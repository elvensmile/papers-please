import "server-only";

import { getServerEnv } from "@/config/env";
import type {
  BestStartup,
  FeasibilityScores,
  OpportunityEdge,
  OpportunityGraph,
  OpportunityNode,
  RankedStartup,
  Stage1Output,
  Stage2Output,
  StartupCandidate,
  StartupScoreSet
} from "@/types/analysis";
import type { LLMAdapter } from "./LLMAdapter";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const FALLBACK_TEXT_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"] as const;

const STAGE_1_PROMPT = `You are a startup strategist analyzing a single academic paper.
Return strict JSON with this exact shape:
{
  "summary": string,
  "coreInnovation": string,
  "startupCandidates": [
    {
      "name": string,
      "description": string,
      "problem": string,
      "solution": string,
      "customers": string[],
      "businessModel": string,
      "whyNow": string
    }
  ],
  "opportunityMap": {
    "nodes": [
      {
        "id": string,
        "label": string,
        "type": "research" | "technology" | "product" | "market" | "startup"
      }
    ],
    "edges": [
      {
        "source": string,
        "target": string
      }
    ]
  }
}

Requirements:
- Generate exactly 6 startupCandidates
- The six ideas must span these categories:
  1. B2B SaaS
  2. API platform
  3. vertical AI product
  4. enterprise workflow
  5. marketplace
  6. consumer product
- Keep the opportunityMap useful with 10-20 nodes and no more than 30 edges
- Do not include markdown fences or prose outside the JSON`;

const STAGE_2_PROMPT = `You are ranking startup concepts extracted from a research paper.
Return strict JSON with this exact shape:
{
  "rankedStartups": [
    {
      "name": string,
      "scores": {
        "novelty": number,
        "marketClarity": number,
        "painLevel": number,
        "feasibility": number,
        "monetization": number,
        "researchFit": number
      },
      "risks": string[],
      "improvedPositioning": string,
      "totalScore": number
    }
  ],
  "bestStartup": {
    "name": string,
    "reason": string,
    "imagePrompt": string
  },
  "feasibilityScores": {
    "technicalDifficulty": number,
    "timeToMarket": number,
    "marketSize": number,
    "defensibility": number,
    "revenuePotential": number,
    "executionRisk": number
  }
}

Requirements:
- Rank all startup concepts from highest to lowest totalScore
- Scores must be 0-100
- Score using novelty, market clarity, pain level, feasibility, monetization, and research fit
- Pick a single bestStartup and explain why it wins
- Write an imagePrompt suitable for a polished startup concept illustration
- Return feasibilityScores on a 0-100 scale
- Do not include markdown fences or prose outside the JSON`;

function stripMarkdownFences(value: string) {
  return value.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.length > 0)
    : [];
}

function clampScore(value: unknown) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function parseJson<T>(raw: string): T {
  const cleaned = stripMarkdownFences(raw);

  try {
    return JSON.parse(cleaned) as T;
  } catch (error) {
    throw new Error(
      `Gemini returned malformed JSON that could not be parsed: ${
        error instanceof Error ? error.message : "unknown parse error"
      }`
    );
  }
}

function validateStartupCandidate(value: unknown, index: number): StartupCandidate {
  if (!isRecord(value)) {
    throw new Error(`Startup candidate at index ${index} is invalid.`);
  }

  return {
    name: asString(value.name, `Startup ${index + 1}`),
    description: asString(value.description),
    problem: asString(value.problem),
    solution: asString(value.solution),
    customers: asStringArray(value.customers),
    businessModel: asString(value.businessModel),
    whyNow: asString(value.whyNow)
  };
}

function validateOpportunityNode(value: unknown, index: number): OpportunityNode {
  if (!isRecord(value)) {
    throw new Error(`Opportunity node at index ${index} is invalid.`);
  }

  const rawType = asString(value.type);
  const type =
    rawType === "research" ||
    rawType === "technology" ||
    rawType === "product" ||
    rawType === "market" ||
    rawType === "startup"
      ? rawType
      : "technology";

  return {
    id: asString(value.id, `node-${index}`),
    label: asString(value.label, `Node ${index + 1}`),
    type
  };
}

function validateOpportunityEdge(value: unknown, index: number): OpportunityEdge {
  if (!isRecord(value)) {
    throw new Error(`Opportunity edge at index ${index} is invalid.`);
  }

  return {
    source: asString(value.source),
    target: asString(value.target)
  };
}

function validateStage1Output(value: unknown): Stage1Output {
  if (!isRecord(value)) {
    throw new Error("Stage 1 output is missing or invalid.");
  }

  const startupCandidates = Array.isArray(value.startupCandidates)
    ? value.startupCandidates.map(validateStartupCandidate).slice(0, 6)
    : [];

  const opportunityMapRecord = isRecord(value.opportunityMap) ? value.opportunityMap : {};
  const opportunityMap: OpportunityGraph = {
    nodes: Array.isArray(opportunityMapRecord.nodes)
      ? opportunityMapRecord.nodes.map(validateOpportunityNode).slice(0, 20)
      : [],
    edges: Array.isArray(opportunityMapRecord.edges)
      ? opportunityMapRecord.edges.map(validateOpportunityEdge).slice(0, 30)
      : []
  };

  return {
    summary: asString(value.summary),
    coreInnovation: asString(value.coreInnovation),
    startupCandidates,
    opportunityMap
  };
}

function validateScoreSet(value: unknown): StartupScoreSet {
  const record = isRecord(value) ? value : {};

  return {
    novelty: clampScore(record.novelty),
    marketClarity: clampScore(record.marketClarity),
    painLevel: clampScore(record.painLevel),
    feasibility: clampScore(record.feasibility),
    monetization: clampScore(record.monetization),
    researchFit: clampScore(record.researchFit)
  };
}

function validateRankedStartup(value: unknown, index: number): RankedStartup {
  if (!isRecord(value)) {
    throw new Error(`Ranked startup at index ${index} is invalid.`);
  }

  return {
    name: asString(value.name, `Startup ${index + 1}`),
    scores: validateScoreSet(value.scores),
    risks: asStringArray(value.risks),
    improvedPositioning: asString(value.improvedPositioning),
    totalScore: clampScore(value.totalScore)
  };
}

function validateBestStartup(value: unknown): BestStartup {
  const record = isRecord(value) ? value : {};

  return {
    name: asString(record.name),
    reason: asString(record.reason),
    imagePrompt: asString(record.imagePrompt)
  };
}

function validateFeasibilityScores(value: unknown): FeasibilityScores {
  const record = isRecord(value) ? value : {};

  return {
    technicalDifficulty: clampScore(record.technicalDifficulty),
    timeToMarket: clampScore(record.timeToMarket),
    marketSize: clampScore(record.marketSize),
    defensibility: clampScore(record.defensibility),
    revenuePotential: clampScore(record.revenuePotential),
    executionRisk: clampScore(record.executionRisk)
  };
}

function validateStage2Output(value: unknown): Stage2Output {
  if (!isRecord(value)) {
    throw new Error("Stage 2 output is missing or invalid.");
  }

  return {
    rankedStartups: Array.isArray(value.rankedStartups)
      ? value.rankedStartups
          .map(validateRankedStartup)
          .sort((left, right) => right.totalScore - left.totalScore)
      : [],
    bestStartup: validateBestStartup(value.bestStartup),
    feasibilityScores: validateFeasibilityScores(value.feasibilityScores)
  };
}

async function fileToBase64(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return buffer.toString("base64");
}

function getTextFromGeminiResponse(payload: unknown) {
  if (!isRecord(payload) || !Array.isArray(payload.candidates)) {
    throw new Error("Gemini response was missing candidates.");
  }

  const firstCandidate = payload.candidates[0];
  if (!isRecord(firstCandidate) || !isRecord(firstCandidate.content)) {
    throw new Error("Gemini response did not include candidate content.");
  }

  const parts = Array.isArray(firstCandidate.content.parts)
    ? firstCandidate.content.parts
    : [];

  const textPart = parts.find(
    (part): part is { text: string } => isRecord(part) && typeof part.text === "string"
  );

  if (textPart == null) {
    throw new Error("Gemini response did not include a text part.");
  }

  return textPart.text;
}

async function withRetry<T>(operation: () => Promise<T>) {
  try {
    return await operation();
  } catch (error) {
    console.error("Retrying Gemini operation after failure", error);
    return operation();
  }
}

function dedupeModels(models: string[]) {
  return Array.from(new Set(models.filter((model) => model.trim().length > 0)));
}

async function readErrorText(response: Response) {
  const text = await response.text().catch(() => "");
  return text.trim();
}

function createMockStage1(fileName: string): Stage1Output {
  const baseName = fileName.replace(/\.pdf$/i, "") || "Research paper";

  return {
    summary:
      `${baseName} introduces a production-ready technical capability that can move ` +
      "from lab insight to applied commercial workflows across complex industries.",
    coreInnovation:
      "A reusable intelligence layer that reduces expert effort while improving decision speed and consistency.",
    startupCandidates: [
      {
        name: "LabSignal OS",
        description: "B2B SaaS workspace that turns the paper's methodology into guided operating playbooks.",
        problem: "Teams struggle to operationalize cutting-edge research inside repeatable workflows.",
        solution: "Provide configurable dashboards, workflows, and reporting around the paper's core method.",
        customers: ["R&D teams", "Innovation groups", "Technical program managers"],
        businessModel: "Seat-based SaaS with enterprise deployment tiers",
        whyNow: "Teams need defensible AI workflows backed by real technical differentiation."
      },
      {
        name: "Method API",
        description: "Developer API platform exposing the paper's core capability as infrastructure.",
        problem: "Builders need direct programmable access instead of rebuilding research from scratch.",
        solution: "Offer API endpoints, SDKs, and evaluation tooling around the methodology.",
        customers: ["AI product teams", "Developers", "Technical founders"],
        businessModel: "Usage-based API pricing with premium support",
        whyNow: "AI-native products are consolidating around specialized infrastructure layers."
      },
      {
        name: "VerticalPilot",
        description: "Vertical AI copilot for one high-friction industry workflow.",
        problem: "Industry experts are overloaded with repetitive review and interpretation tasks.",
        solution: "Embed the paper's method into a domain-specific assistant with audit trails.",
        customers: ["Healthcare operators", "Legal ops teams", "Industrial analysts"],
        businessModel: "Annual platform license plus implementation",
        whyNow: "Vertical buyers want opinionated products, not generic copilots."
      },
      {
        name: "OpsWeave",
        description: "Enterprise workflow layer connecting the research output to existing systems of record.",
        problem: "Organizations cannot capture value if insight lives outside production systems.",
        solution: "Trigger approvals, alerts, and downstream automations from the model output.",
        customers: ["Enterprise operations", "Shared services teams", "Compliance teams"],
        businessModel: "Workflow subscription priced by volume and integrations",
        whyNow: "Automation budgets are shifting from pilots to measurable operational ROI."
      },
      {
        name: "Insight Exchange",
        description: "Marketplace that pairs specialized providers with buyers who need the paper's capability delivered.",
        problem: "Buyers need results quickly but do not have in-house expertise.",
        solution: "Match verified experts and service firms using standardized toolchains derived from the paper.",
        customers: ["Mid-market companies", "Consultancies", "Specialist operators"],
        businessModel: "Take rate on transactions plus premium lead placement",
        whyNow: "Outcome-based purchasing is growing faster than bespoke services sales."
      },
      {
        name: "Signal Lens",
        description: "Consumer product that packages the research insight into a simple personal decision tool.",
        problem: "Consumers rarely benefit directly from sophisticated research methods.",
        solution: "Deliver an intuitive mobile-first experience with recommendations and explainability.",
        customers: ["Prosumers", "Independent creators", "Knowledge workers"],
        businessModel: "Freemium subscription with premium reports",
        whyNow: "Consumers are increasingly comfortable paying for specialized AI assistants."
      }
    ],
    opportunityMap: {
      nodes: [
        { id: "research", label: baseName, type: "research" },
        { id: "core-tech", label: "Core technical method", type: "technology" },
        { id: "workflow", label: "Operational workflow", type: "product" },
        { id: "enterprise", label: "Enterprise teams", type: "market" },
        { id: "developers", label: "Developers", type: "market" },
        { id: "consumers", label: "Consumers", type: "market" },
        { id: "labsignal", label: "LabSignal OS", type: "startup" },
        { id: "methodapi", label: "Method API", type: "startup" },
        { id: "verticalpilot", label: "VerticalPilot", type: "startup" },
        { id: "opsweave", label: "OpsWeave", type: "startup" },
        { id: "insight-exchange", label: "Insight Exchange", type: "startup" },
        { id: "signal-lens", label: "Signal Lens", type: "startup" }
      ],
      edges: [
        { source: "research", target: "core-tech" },
        { source: "core-tech", target: "workflow" },
        { source: "workflow", target: "enterprise" },
        { source: "core-tech", target: "developers" },
        { source: "core-tech", target: "consumers" },
        { source: "enterprise", target: "labsignal" },
        { source: "developers", target: "methodapi" },
        { source: "enterprise", target: "verticalpilot" },
        { source: "enterprise", target: "opsweave" },
        { source: "enterprise", target: "insight-exchange" },
        { source: "consumers", target: "signal-lens" }
      ]
    }
  };
}

function averageScore(scoreSet: StartupScoreSet) {
  const values = Object.values(scoreSet);
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function createMockStage2(stage1: Stage1Output): Stage2Output {
  const rankedStartups = stage1.startupCandidates.map((candidate, index) => {
    const scores: StartupScoreSet = {
      novelty: 74 + index * 2,
      marketClarity: 68 + ((index + 2) % 5) * 5,
      painLevel: 70 + ((index + 1) % 4) * 6,
      feasibility: 64 + ((index + 3) % 4) * 7,
      monetization: 69 + ((index + 2) % 3) * 8,
      researchFit: 76 + ((index + 1) % 3) * 6
    };

    return {
      name: candidate.name,
      scores,
      risks: [
        "Requires sharp positioning to avoid sounding like a generic AI tool.",
        "Needs measurable ROI proof inside the first customer workflow."
      ],
      improvedPositioning:
        `Position ${candidate.name} as the fastest path from research insight to ` +
        "production value for one clearly defined buyer.",
      totalScore: averageScore(scores)
    };
  });

  rankedStartups.sort((left, right) => right.totalScore - left.totalScore);

  return {
    rankedStartups,
    bestStartup: {
      name: rankedStartups[0]?.name ?? stage1.startupCandidates[0]?.name ?? "Top startup",
      reason:
        "It balances clear buyer urgency, implementation realism, and direct leverage of the paper's differentiated method.",
      imagePrompt:
        "Create a polished editorial startup concept illustration showing researchers and operators turning complex paper insights into a live product dashboard, warm modern palette, cinematic lighting, product demo aesthetic."
    },
    feasibilityScores: {
      technicalDifficulty: 61,
      timeToMarket: 72,
      marketSize: 82,
      defensibility: 78,
      revenuePotential: 84,
      executionRisk: 58
    }
  };
}

export class GeminiAdapter implements LLMAdapter {
  private readonly env = getServerEnv();

  async analyzePaper(file: File): Promise<Stage1Output> {
    if (this.env.mockGemini || this.env.geminiApiKey.length === 0) {
      return createMockStage1(file.name);
    }

    const pdfData = await fileToBase64(file);
    const modelsToTry = dedupeModels([
      this.env.geminiModel,
      ...FALLBACK_TEXT_MODELS
    ]);
    let lastError: Error | null = null;
    let text: string | null = null;

    for (const model of modelsToTry) {
      try {
        text = await withRetry(async () => {
          const response = await fetch(
            `${GEMINI_API_BASE}/models/${model}:generateContent?key=${this.env.geminiApiKey}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                generationConfig: {
                  responseMimeType: "application/json",
                  temperature: 0.3
                },
                contents: [
                  {
                    role: "user",
                    parts: [
                      { text: STAGE_1_PROMPT },
                      {
                        inlineData: {
                          mimeType: file.type || "application/pdf",
                          data: pdfData
                        }
                      }
                    ]
                  }
                ]
              })
            }
          );

          if (!response.ok) {
            const errorText = await readErrorText(response);
            throw new Error(
              `Gemini stage 1 failed for model ${model} with status ${response.status}. ${errorText}`
            );
          }

          return getTextFromGeminiResponse((await response.json()) as unknown);
        });
        break;
      } catch (error) {
        lastError =
          error instanceof Error ? error : new Error("Unknown Gemini stage 1 failure");
        console.error(`Stage 1 failed for Gemini model ${model}`, lastError);
      }
    }

    if (text == null) {
      throw lastError ?? new Error("Gemini stage 1 failed for all configured models.");
    }

    return validateStage1Output(parseJson(text));
  }

  async rankStartups(stage1: Stage1Output): Promise<Stage2Output> {
    if (this.env.mockGemini || this.env.geminiApiKey.length === 0) {
      return createMockStage2(stage1);
    }

    const modelsToTry = dedupeModels([
      this.env.geminiModel,
      ...FALLBACK_TEXT_MODELS
    ]);
    let lastError: Error | null = null;
    let text: string | null = null;

    for (const model of modelsToTry) {
      try {
        text = await withRetry(async () => {
          const response = await fetch(
            `${GEMINI_API_BASE}/models/${model}:generateContent?key=${this.env.geminiApiKey}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                generationConfig: {
                  responseMimeType: "application/json",
                  temperature: 0.2
                },
                contents: [
                  {
                    role: "user",
                    parts: [
                      {
                        text: `${STAGE_2_PROMPT}\n\nStage 1 JSON:\n${JSON.stringify(stage1)}`
                      }
                    ]
                  }
                ]
              })
            }
          );

          if (!response.ok) {
            const errorText = await readErrorText(response);
            throw new Error(
              `Gemini stage 2 failed for model ${model} with status ${response.status}. ${errorText}`
            );
          }

          return getTextFromGeminiResponse((await response.json()) as unknown);
        });
        break;
      } catch (error) {
        lastError =
          error instanceof Error ? error : new Error("Unknown Gemini stage 2 failure");
        console.error(`Stage 2 failed for Gemini model ${model}`, lastError);
      }
    }

    if (text == null) {
      throw lastError ?? new Error("Gemini stage 2 failed for all configured models.");
    }

    return validateStage2Output(parseJson(text));
  }
}
