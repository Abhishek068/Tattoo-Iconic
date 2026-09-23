import { ARTIST_PROFILE } from "@/constants";
import type { TattooEnquiry, EnquiryFormData } from "@/types";

/**
 * WhatsApp Integration Service for Phase 1
 * Uses the official WhatsApp Click-to-Chat API: https://wa.me/<number>?text=<message>
 */
export const whatsappService = {
  /**
   * Get the configured Artist WhatsApp Number (digits only, e.g. 918238767100)
   */
  getArtistPhoneNumber(): string {
    const envNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    if (envNumber) {
      return envNumber.replace(/[^0-9]/g, "");
    }
    return ARTIST_PROFILE.whatsapp_number.replace(/[^0-9]/g, "") || "918238767100";
  },

  /**
   * Format a professional, structured WhatsApp message for a new Tattoo Enquiry
   */
  formatEnquiryMessage(enquiry: {
    client_id: string;
    full_name: string;
    tattoo_idea: string;
    tattoo_style?: string;
    placement?: string;
    approx_size?: string;
    color_preference?: string;
    service_type?: string;
    preferred_date?: string;
    preferred_time?: string;
    city?: string;
  }): string {
    const lines = [
      `*Hi Jainik, I have submitted a tattoo enquiry on Tattoo Iconic.*`,
      ``,
      `*Client ID:* \`${enquiry.client_id}\``,
      `*Name:* ${enquiry.full_name}`,
      `*Tattoo Idea:* ${enquiry.tattoo_idea}`,
      `*Style:* ${enquiry.tattoo_style || "Custom"}`,
      `*Placement:* ${enquiry.placement || "To Discuss"}`,
      `*Approximate Size:* ${enquiry.approx_size || "Medium"}`,
      `*Colour Preference:* ${enquiry.color_preference || "Black & Grey"}`,
      `*Service:* ${enquiry.service_type === "Home Tattoo Service" ? "Luxury Home Service (Doorstep)" : "Studio Visit (Bhadam, Rajpipla)"}`,
    ];

    if (enquiry.city) {
      lines.push(`*Location/City:* ${enquiry.city}`);
    }

    if (enquiry.preferred_date) {
      lines.push(`*Preferred Date:* ${enquiry.preferred_date} (${enquiry.preferred_time || "Flexible"})`);
    }

    lines.push(``);
    lines.push(`I would like to discuss my tattoo idea and get your estimate/availability.`);

    return lines.join("\n");
  },

  /**
   * Generate official WhatsApp click-to-chat URL with pre-filled enquiry message
   */
  generateEnquiryUrl(enquiry: {
    client_id: string;
    full_name: string;
    tattoo_idea: string;
    tattoo_style?: string;
    placement?: string;
    approx_size?: string;
    color_preference?: string;
    service_type?: string;
    preferred_date?: string;
    preferred_time?: string;
    city?: string;
  }): string {
    const phoneNumber = this.getArtistPhoneNumber();
    const rawMessage = this.formatEnquiryMessage(enquiry);
    const encodedMessage = encodeURIComponent(rawMessage);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  },

  /**
   * Generate a direct message URL for the artist to contact a client
   */
  generateArtistToClientUrl(clientPhone: string, clientId: string, clientName: string): string {
    const cleanPhone = clientPhone.replace(/[^0-9]/g, "");
    const message = encodeURIComponent(
      `Hello ${clientName}, this is Jainik Patel from Tattoo Iconic regarding your enquiry #${clientId}. I reviewed your tattoo concept and would love to assist you!`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  },
};
