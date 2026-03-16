const WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_UPLOADS_PER_WINDOW = 5;

type UploadEntry = {
  timestamps: number[];
};

const uploadStore = new Map<string, UploadEntry>();

function normalizeIp(candidate: string | null) {
  if (candidate == null) {
    return null;
  }

  const normalized = candidate.trim();
  return normalized.length > 0 ? normalized : null;
}

export function getClientIp(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor != null) {
    const firstIp = normalizeIp(forwardedFor.split(",")[0] ?? null);
    if (firstIp != null) {
      return firstIp;
    }
  }

  const fallbackHeaders = [
    "x-real-ip",
    "cf-connecting-ip",
    "fly-client-ip",
    "x-client-ip"
  ];

  for (const headerName of fallbackHeaders) {
    const value = normalizeIp(headers.get(headerName));
    if (value != null) {
      return value;
    }
  }

  return "anonymous";
}

export function registerUploadAttempt(ip: string, now = Date.now()) {
  const windowStart = now - WINDOW_MS;
  const existingEntry = uploadStore.get(ip);
  const recentTimestamps =
    existingEntry?.timestamps.filter((timestamp) => timestamp > windowStart) ?? [];

  if (recentTimestamps.length >= MAX_UPLOADS_PER_WINDOW) {
    uploadStore.set(ip, { timestamps: recentTimestamps });
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: recentTimestamps[0] + WINDOW_MS - now
    } as const;
  }

  const nextTimestamps = [...recentTimestamps, now];
  uploadStore.set(ip, { timestamps: nextTimestamps });

  return {
    allowed: true,
    remaining: Math.max(0, MAX_UPLOADS_PER_WINDOW - nextTimestamps.length),
    retryAfterMs: 0
  } as const;
}
