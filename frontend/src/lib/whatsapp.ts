import { ARTIST_PROFILE } from "@/constants";

export interface WhatsAppUrlOptions {
  message?: string;
  tattooName?: string;
  context?: "home" | "contact" | "portfolio" | "tattoo_detail" | "general" | "custom";
  phone?: string;
}

/**
 * Get the sanitized WhatsApp phone number (digits only, in international format)
 * Reads from process.env.NEXT_PUBLIC_WHATSAPP_NUMBER or falls back to ARTIST_PROFILE
 */
export function getWhatsAppNumber(overridePhone?: string): string {
  if (overridePhone) {
    return overridePhone.replace(/[^0-9]/g, "");
  }
  const envNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (envNumber) {
    const clean = envNumber.replace(/[^0-9]/g, "");
    if (clean) return clean;
  }
  return (ARTIST_PROFILE?.whatsapp_number || "918238767100").replace(/[^0-9]/g, "");
}

/**
 * Generates a pre-filled enquiry message based on page context or custom parameter
 */
export function getWhatsAppDefaultMessage(options?: WhatsAppUrlOptions): string {
  if (options?.message) {
    return options.message;
  }
  if (options?.tattooName) {
    return `Hi Jainik, I found your website and I'm interested in the ${options.tattooName} tattoo. I'd like to discuss getting something similar.`;
  }
  if (options?.context === "contact") {
    return "Hi Jainik, I'd like to enquire about a tattoo appointment.";
  }
  if (options?.context === "portfolio") {
    return "Hi Jainik, I found your portfolio on your website and would like to enquire about getting a tattoo.";
  }
  // Default message (Homepage / General)
  return "Hi Jainik, I found your tattoo website and would like to enquire about getting a tattoo.";
}

/**
 * Generates the official WhatsApp click-to-chat URL:
 * https://wa.me/[NUMBER]?text=[ENCODED_MESSAGE]
 */
export function createWhatsAppUrl(options?: WhatsAppUrlOptions): string {
  const phone = getWhatsAppNumber(options?.phone);
  const message = getWhatsAppDefaultMessage(options);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}
