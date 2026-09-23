import type { EnquiryFormData, EnquirySubmissionResult, TattooEnquiry } from "@/types";
import { whatsappService } from "./whatsapp.service";

/**
 * Enquiry Service for Phase 1
 * Interacts with Next.js Server-Side API /api/enquiry and handles WhatsApp fallbacks
 */
export const enquiryService = {
  /**
   * Submit a new Tattoo Enquiry
   */
  async submitEnquiry(formData: EnquiryFormData): Promise<EnquirySubmissionResult> {
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Intercept non-200 responses gracefully
        const errorData = await response.json().catch(() => ({}));
        
        // Generate a local client ID and WhatsApp fallback URL
        const fallbackClientId = `CL-${Date.now().toString().slice(-8)}`;
        const fallbackWhatsappUrl = whatsappService.generateEnquiryUrl({
          client_id: fallbackClientId,
          full_name: formData.full_name,
          tattoo_idea: formData.tattoo_idea,
          tattoo_style: formData.tattoo_style,
          placement: formData.placement,
          approx_size: formData.approx_size,
          color_preference: formData.color_preference,
          service_type: formData.service_type,
          preferred_date: formData.preferred_date,
          preferred_time: formData.preferred_time,
          city: formData.city,
        });

        return {
          success: false,
          client_id: fallbackClientId,
          whatsapp_url: fallbackWhatsappUrl,
          stored_in_sheet: false,
          error: errorData.error || "We couldn't submit your enquiry right now. Please contact us directly on WhatsApp.",
        };
      }

      const data: EnquirySubmissionResult = await response.json();
      return data;
    } catch (err) {
      console.warn("[EnquiryService] Submit exception:", (err as Error).message);

      const fallbackClientId = `CL-${Date.now().toString().slice(-8)}`;
      const fallbackWhatsappUrl = whatsappService.generateEnquiryUrl({
        client_id: fallbackClientId,
        full_name: formData.full_name,
        tattoo_idea: formData.tattoo_idea,
        tattoo_style: formData.tattoo_style,
        placement: formData.placement,
        approx_size: formData.approx_size,
        color_preference: formData.color_preference,
        service_type: formData.service_type,
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time,
        city: formData.city,
      });

      return {
        success: false,
        client_id: fallbackClientId,
        whatsapp_url: fallbackWhatsappUrl,
        stored_in_sheet: false,
        error: "We couldn't submit your enquiry right now. Please contact us directly on WhatsApp.",
      };
    }
  },

  /**
   * Fetch Enquiries for the Artist Dashboard (via server-side endpoint)
   */
  async getEnquiries(): Promise<TattooEnquiry[]> {
    try {
      const response = await fetch("/api/enquiry", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.enquiries || [];
    } catch (err) {
      console.warn("[EnquiryService] Get enquiries exception:", (err as Error).message);
      return [];
    }
  },
};
