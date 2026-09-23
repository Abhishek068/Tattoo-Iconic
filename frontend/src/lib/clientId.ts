/**
 * Collision-resistant Client ID Generator
 * Format: CL-YYYYMMDD-XXXX (e.g. CL-20260922-4E9A)
 */
export function generateClientId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateSegment = `${year}${month}${day}`;

  // 4 random alphanumeric characters (avoiding ambiguous chars)
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomSegment = "";
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    randomSegment += chars[randomIndex];
  }

  return `CL-${dateSegment}-${randomSegment}`;
}
