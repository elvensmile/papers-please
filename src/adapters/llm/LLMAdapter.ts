import type { Stage1Output, Stage2Output } from "@/types/analysis";

export interface LLMAdapter {
  analyzePaper(file: File): Promise<Stage1Output>;
  rankStartups(stage1: Stage1Output): Promise<Stage2Output>;
}
