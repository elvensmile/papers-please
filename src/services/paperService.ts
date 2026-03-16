import "server-only";

import { GeminiImageAdapter } from "@/adapters/image/GeminiImageAdapter";
import { GeminiAdapter } from "@/adapters/llm/GeminiAdapter";
import type { AnalyzePaperResponse } from "@/types/analysis";

const llmAdapter = new GeminiAdapter();
const imageAdapter = new GeminiImageAdapter();

export async function analyzePaper(file: File): Promise<AnalyzePaperResponse> {
  const stage1 = await llmAdapter.analyzePaper(file);
  const stage2 = await llmAdapter.rankStartups(stage1);

  let imageUrl: string | null = null;
  let imageError: string | null = null;

  try {
    imageUrl = await imageAdapter.generate(stage2.bestStartup.imagePrompt);
  } catch (error) {
    console.error("Image generation failed", error);
    imageError =
      "The concept image could not be generated this time, but the startup analysis is ready.";
  }

  return {
    stage1,
    stage2,
    imageUrl,
    imageError
  };
}
