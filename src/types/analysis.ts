export type StartupCandidate = {
  name: string;
  description: string;
  problem: string;
  solution: string;
  customers: string[];
  businessModel: string;
  whyNow: string;
};

export type OpportunityNodeType =
  | "research"
  | "technology"
  | "product"
  | "market"
  | "startup";

export type OpportunityNode = {
  id: string;
  label: string;
  type: OpportunityNodeType;
};

export type OpportunityEdge = {
  source: string;
  target: string;
};

export type OpportunityGraph = {
  nodes: OpportunityNode[];
  edges: OpportunityEdge[];
};

export type Stage1Output = {
  summary: string;
  coreInnovation: string;
  startupCandidates: StartupCandidate[];
  opportunityMap: OpportunityGraph;
};

export type StartupScoreSet = {
  novelty: number;
  marketClarity: number;
  painLevel: number;
  feasibility: number;
  monetization: number;
  researchFit: number;
};

export type RankedStartup = {
  name: string;
  scores: StartupScoreSet;
  risks: string[];
  improvedPositioning: string;
  totalScore: number;
};

export type BestStartup = {
  name: string;
  reason: string;
  imagePrompt: string;
};

export type FeasibilityScores = {
  technicalDifficulty: number;
  timeToMarket: number;
  marketSize: number;
  defensibility: number;
  revenuePotential: number;
  executionRisk: number;
};

export type Stage2Output = {
  rankedStartups: RankedStartup[];
  bestStartup: BestStartup;
  feasibilityScores: FeasibilityScores;
};

export type AnalyzePaperResponse = {
  stage1: Stage1Output;
  stage2: Stage2Output;
  imageUrl: string | null;
  imageError: string | null;
};
