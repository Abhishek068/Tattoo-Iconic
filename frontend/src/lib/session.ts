import type { ArtistSession } from "@/types";

export const ARTIST_COOKIE_NAME = "artist_session";
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60; // 8 hours

export function getArtistSecret(): string | null {
  const secret = process.env.ARTIST_DASHBOARD_SECRET;
  if (secret && secret.trim().length > 0) {
    return secret.trim();
  }

  // FAIL CLOSED IN PRODUCTION:
  // If the secret is missing in production, NEVER fall back to a known default.
  // Deny all authentication attempts immediately.
  if (process.env.NODE_ENV === "production") {
    console.error(
      "[CRITICAL SECURITY] ARTIST_DASHBOARD_SECRET is not configured in production environment! Authentication is disabled (fail-closed)."
    );
    return null;
  }

  // Local development fallback key for DX when .env.local is not present
  return "tattoo-iconic-artist-key-2026";
}

// ── Base64 URL Helpers (Universal Browser/Edge/Node) ──
function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Generate a cryptographically signed HMAC-SHA256 session token.
 */
export async function createSessionToken(secret?: string): Promise<string> {
  const secretKey = secret || getArtistSecret();
  if (!secretKey) {
    throw new Error(
      "Cannot generate session token: ARTIST_DASHBOARD_SECRET is not configured in production (fail-closed)."
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const exp = now + SESSION_MAX_AGE_SECONDS;
  const jti = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);

  const payload: ArtistSession = {
    role: "artist",
    iat: now,
    exp,
    jti,
  };

  const payloadString = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(payloadString);

  const key = await getHmacKey(secretKey);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(encodedPayload)
  );

  const encodedSignature = arrayBufferToBase64Url(signature);
  return `${encodedPayload}.${encodedSignature}`;
}

/**
 * Verify a signed session token. Returns null if invalid, expired, or missing secret.
 */
export async function verifySessionToken(
  token: string | undefined | null,
  secret?: string
): Promise<ArtistSession | null> {
  if (!token || typeof token !== "string") return null;

  const secretKey = secret || getArtistSecret();
  if (!secretKey) {
    // Fail-closed: Cannot verify token authenticity without configured secret
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encodedPayload, encodedSignature] = parts;

  try {
    const key = await getHmacKey(secretKey);

    // Convert signature back to Uint8Array for verification
    let base64 = encodedSignature.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    const binary = atob(base64);
    const signatureBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      signatureBytes[i] = binary.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      new TextEncoder().encode(encodedPayload)
    );

    if (!isValid) return null;

    const decodedString = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(decodedString) as ArtistSession;

    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return null;
    }

    if (payload.role !== "artist") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
