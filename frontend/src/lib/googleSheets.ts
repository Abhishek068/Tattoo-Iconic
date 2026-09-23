import crypto from "crypto";
import type { TattooEnquiry } from "@/types";

/**
 * Server-Side In-Memory Enquiry Store
 * Acts as a fast local fallback/cache for Phase 1
 */
const inMemoryEnquiries: TattooEnquiry[] = [
  {
    client_id: "CL-20260920-A101",
    submitted_at: "2026-09-20T10:30:00.000Z",
    full_name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98251 23456",
    tattoo_idea: "Detailed Lord Shiva Trishul with Sanskrit Mahamrityunjaya Mantra on Forearm",
    tattoo_style: "Spiritual",
    placement: "Forearm",
    approx_size: "Medium (4–6 inches)",
    color_preference: "Black & Grey",
    service_type: "Visit Artist",
    preferred_date: "2026-09-25",
    alternative_date: "2026-09-26",
    preferred_time: "11:00 AM",
    detailed_description: "Want crisp fine-line shading for the Damru and Trishul with clean Devanagari script.",
    status: "NEW",
    whatsapp_contacted: "NO",
    artist_notes: "Advised 4-hour custom session.",
  },
  {
    client_id: "CL-20260921-B202",
    submitted_at: "2026-09-21T14:15:00.000Z",
    full_name: "Pooja Patel",
    email: "pooja.patel@example.com",
    phone: "+91 97234 56789",
    tattoo_idea: "Delicate Lotus Mandala with subtle dotwork gradient",
    tattoo_style: "Fine Line",
    placement: "Wrist",
    approx_size: "Small (2–4 inches)",
    color_preference: "Black & Grey",
    service_type: "Home Tattoo Service",
    preferred_date: "2026-09-28",
    alternative_date: "2026-09-29",
    preferred_time: "02:00 PM",
    detailed_description: "Requesting home appointment in Vadodara (Alkapuri).",
    status: "CONSULTATION",
    whatsapp_contacted: "YES",
    artist_notes: "Home travel fee included.",
  },
];

/**
 * Encode string or Buffer to Base64URL
 */
function base64url(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Get an OAuth2 Access Token for Google Sheets API using RSA-SHA256 JWT
 */
async function getGoogleAccessToken(
  clientEmail: string,
  privateKey: string
): Promise<string | null> {
  try {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    };

    const encodedHeader = base64url(JSON.stringify(header));
    const encodedPayload = base64url(JSON.stringify(payload));
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;

    // Normalize private key formatting (handles escaped \n in env variables)
    const normalizedKey = privateKey.replace(/\\n/g, "\n");

    const sign = crypto.createSign("RSA-SHA256");
    sign.update(unsignedToken);
    sign.end();
    const signature = sign.sign(normalizedKey);
    const jwt = `${unsignedToken}.${base64url(signature)}`;

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn("[GoogleSheets] Token exchange failed:", response.status, errText);
      return null;
    }

    const data = (await response.json()) as { access_token?: string };
    return data.access_token || null;
  } catch (err) {
    console.warn("[GoogleSheets] Error during token generation:", (err as Error).message);
    return null;
  }
}

/**
 * Append an Enquiry Row to Google Sheets
 * Supports:
 * 1. Google Apps Script Webhook (easiest, via GOOGLE_SHEET_WEBHOOK_URL)
 * 2. Google Cloud Service Account (via GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID)
 * 3. Local In-Memory Store (instant fallback for offline / dev)
 */
export async function appendEnquiryToGoogleSheets(
  enquiry: TattooEnquiry
): Promise<{ success: boolean; sheet_appended: boolean; error?: string }> {
  // Always cache in local server-side store
  inMemoryEnquiries.unshift(enquiry);

  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  // ── METHOD 1: Google Apps Script Webhook (Recommended & Easiest) ──
  if (webhookUrl && webhookUrl.startsWith("http")) {
    try {
      const webhookRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiry),
        redirect: "follow",
      });

      if (webhookRes.ok) {
        return {
          success: true,
          sheet_appended: true,
        };
      } else {
        const errText = await webhookRes.text();
        console.warn("[GoogleSheets Webhook] Request failed:", webhookRes.status, errText);
      }
    } catch (err) {
      console.warn("[GoogleSheets Webhook] Exception:", (err as Error).message);
    }
  }

  // ── METHOD 2: Google Cloud Service Account API ──
  if (clientEmail && privateKey && sheetId) {
    try {
      const accessToken = await getGoogleAccessToken(clientEmail, privateKey);
      if (!accessToken) {
        return {
          success: true,
          sheet_appended: false,
          error: "Unable to obtain Google OAuth2 access token.",
        };
      }

      const rowValues = [
        enquiry.client_id,
        enquiry.submitted_at,
        enquiry.full_name,
        enquiry.email,
        enquiry.phone,
        enquiry.tattoo_idea,
        enquiry.tattoo_style || "Custom",
        enquiry.placement || "Not Specified",
        enquiry.approx_size || "Not Specified",
        enquiry.color_preference || "Black & Grey",
        enquiry.service_type || "Visit Artist",
        enquiry.preferred_date || "Flexible",
        enquiry.alternative_date || "None",
        enquiry.preferred_time || "Flexible",
        enquiry.detailed_description || "",
        enquiry.status || "NEW",
        enquiry.whatsapp_contacted || "NO",
        enquiry.artist_notes || "",
      ];

      const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A:R:append?valueInputOption=USER_ENTERED`;

      const appendRes = await fetch(appendUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [rowValues],
        }),
      });

      if (appendRes.ok) {
        return {
          success: true,
          sheet_appended: true,
        };
      } else {
        const errBody = await appendRes.text();
        console.warn("[GoogleSheets API] Append row failed:", appendRes.status, errBody);
      }
    } catch (err) {
      console.warn("[GoogleSheets API] Exception:", (err as Error).message);
    }
  }

  // Gracefully return success (stored in local memory)
  return {
    success: true,
    sheet_appended: false,
    error: "Google Sheets credentials not configured in server environment.",
  };
}

/**
 * Get Enquiries (for Artist Dashboard)
 */
export function getStoredEnquiries(): TattooEnquiry[] {
  return inMemoryEnquiries;
}
