import { NextResponse } from "next/server";
import { ACCEPTED_PDF_MIME_TYPES, MAX_PDF_SIZE_BYTES } from "@/config/constants";
import { getClientIp, registerUploadAttempt } from "@/server/uploadRateLimit";
import { analyzePaper } from "@/services/paperService";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fileEntry = formData.get("file");

    if (!(fileEntry instanceof File)) {
      return NextResponse.json(
        { error: "Please upload a PDF file to analyze." },
        { status: 400 }
      );
    }

    if (!ACCEPTED_PDF_MIME_TYPES.includes(fileEntry.type as (typeof ACCEPTED_PDF_MIME_TYPES)[number])) {
      return NextResponse.json(
        { error: "Only PDF files are supported for this analysis." },
        { status: 400 }
      );
    }

    if (fileEntry.size > MAX_PDF_SIZE_BYTES) {
      return NextResponse.json(
        { error: "The PDF is too large. Please upload a file under 20MB." },
        { status: 400 }
      );
    }

    const clientIp = getClientIp(request.headers);
    const rateLimitResult = registerUploadAttempt(clientIp);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error:
            "It looks like you're enjoying the app. Email me at nyriabova@gmail.com to keep going.",
          code: "UPLOAD_LIMIT_REACHED"
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.max(60, Math.ceil(rateLimitResult.retryAfterMs / 1000))
            )
          }
        }
      );
    }

    const result = await analyzePaper(fileEntry);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Analyze route failed", error);

    return NextResponse.json(
      {
        error:
          "We could not finish analyzing that paper. Please try again in a moment."
      },
      { status: 500 }
    );
  }
}
