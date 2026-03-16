import "server-only";

export function getServerEnv() {
  return {
    geminiApiKey: process.env.GEMINI_API_KEY?.trim() ?? "",
    geminiModel: process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash",
    geminiImageModel:
      process.env.GEMINI_IMAGE_MODEL?.trim() ||
      "gemini-2.5-flash-image",
    mockGemini: process.env.MOCK_GEMINI === "true"
  };
}
