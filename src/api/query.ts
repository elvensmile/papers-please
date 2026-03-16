import type { AnalyzePaperResponse } from "@/types/analysis";

type ApiError = {
  error?: string;
  code?: string;
};

export class ApiRequestError extends Error {
  status: number;
  code?: string;

  constructor(message: string, options: { status: number; code?: string }) {
    super(message);
    this.name = "ApiRequestError";
    this.status = options.status;
    this.code = options.code;
  }
}

export async function analyzePaper(file: File): Promise<AnalyzePaperResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/analyze", {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as ApiError | null;
    throw new ApiRequestError(
      errorBody?.error ?? "The paper analysis request failed unexpectedly.",
      {
        status: response.status,
        code: errorBody?.code
      }
    );
  }

  return (await response.json()) as AnalyzePaperResponse;
}
