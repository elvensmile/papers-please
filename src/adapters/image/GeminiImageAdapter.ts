import "server-only";

import { getServerEnv } from "@/config/env";
import type { ImageAdapter } from "./ImageAdapter";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const FALLBACK_IMAGE_MODELS = [
  "gemini-2.5-flash-image",
  "gemini-3-pro-image-preview"
] as const;

function createFallbackSvg(prompt: string) {
  const safePrompt = prompt
    .slice(0, 180)
    .replace(/[<>&"]/g, "")
    .trim();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0b5d49" />
          <stop offset="100%" stop-color="#d88b35" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#bg)" rx="36" />
      <circle cx="200" cy="170" r="120" fill="rgba(255,255,255,0.08)" />
      <circle cx="980" cy="650" r="190" fill="rgba(255,255,255,0.08)" />
      <rect x="96" y="92" width="1008" height="616" rx="28" fill="rgba(255,250,240,0.18)" stroke="rgba(255,255,255,0.32)" />
      <text x="130" y="180" fill="#fffaf0" font-family="Avenir Next, Arial, sans-serif" font-size="32" font-weight="700">
        Startup concept preview
      </text>
      <text x="130" y="236" fill="#fffaf0" font-family="Avenir Next, Arial, sans-serif" font-size="22">
        ${safePrompt}
      </text>
      <rect x="130" y="304" width="360" height="220" rx="24" fill="rgba(255,255,255,0.16)" />
      <rect x="530" y="304" width="540" height="120" rx="24" fill="rgba(255,255,255,0.14)" />
      <rect x="530" y="450" width="240" height="160" rx="24" fill="rgba(255,255,255,0.22)" />
      <rect x="798" y="450" width="272" height="160" rx="24" fill="rgba(255,255,255,0.1)" />
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export class GeminiImageAdapter implements ImageAdapter {
  private readonly env = getServerEnv();

  async generate(prompt: string): Promise<string> {
    if (this.env.mockGemini || this.env.geminiApiKey.length === 0) {
      return createFallbackSvg(prompt);
    }

    const modelsToTry = Array.from(
      new Set([this.env.geminiImageModel, ...FALLBACK_IMAGE_MODELS])
    );
    let lastError: Error | null = null;

    for (const model of modelsToTry) {
      try {
        const response = await fetch(
          `${GEMINI_API_BASE}/models/${model}:generateContent?key=${this.env.geminiApiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              generationConfig: {
                responseModalities: ["TEXT", "IMAGE"]
              },
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: prompt
                    }
                  ]
                }
              ]
            })
          }
        );

        if (!response.ok) {
          const errorText = await response.text().catch(() => "");
          throw new Error(
            `Gemini image generation failed for model ${model} with status ${response.status}. ${errorText.trim()}`
          );
        }

        const payload = (await response.json()) as {
          candidates?: Array<{
            content?: {
              parts?: Array<{
                inlineData?: {
                  mimeType?: string;
                  data?: string;
                };
              }>;
            };
          }>;
        };

        const imageData = payload.candidates?.[0]?.content?.parts?.find(
          (part) => part.inlineData?.data != null
        )?.inlineData;

        if (imageData?.data == null || imageData.mimeType == null) {
          throw new Error(`Gemini image generation returned no image data for model ${model}.`);
        }

        return `data:${imageData.mimeType};base64,${imageData.data}`;
      } catch (error) {
        lastError =
          error instanceof Error ? error : new Error("Unknown Gemini image generation failure");
        console.error(`Image generation failed for Gemini model ${model}`, lastError);
      }
    }

    throw lastError ?? new Error("Gemini image generation failed for all configured models.");
  }
}
