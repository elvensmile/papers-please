import type { AnalyzePaperResponse } from "@/types/analysis";

type ApiError = {
  error?: string;
};

export async function analyzePaper(file: File): Promise<AnalyzePaperResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/analyze", {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as ApiError | null;
    throw new Error(
      errorBody?.error ?? "The paper analysis request failed unexpectedly."
    );
  }

  return (await response.json()) as AnalyzePaperResponse;
}
