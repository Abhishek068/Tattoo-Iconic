import type { TattooEnquiry } from "@/types";

export interface EmailNotificationPayload {
  to: string;
  subject: string;
  html: string;
  enquiry: TattooEnquiry;
}

/**
 * Send an email notification to Jainik Patel when a new enquiry or booking is submitted.
 * Supports:
 * 1. Resend API (via RESEND_API_KEY)
 * 2. Custom Webhook / Notification endpoint (via NOTIFICATION_WEBHOOK_URL)
 * 3. Log / Fallback
 */
export async function sendEnquiryEmailNotification(
  enquiry: TattooEnquiry
): Promise<{ success: boolean; sent: boolean; message?: string }> {
  const recipient = process.env.ARTIST_NOTIFICATION_EMAIL || "Jainik.patel.33@gmail.com";
  const resendApiKey = process.env.RESEND_API_KEY;
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;

  const subject = `🔥 New Tattoo Enquiry [${enquiry.client_id}]: ${enquiry.full_name}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #0b0f17; color: #e2e8f0; margin: 0; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background: #111827; border: 1px solid #d97706; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #1f2937 0%, #0b0f17 100%); padding: 28px; border-bottom: 1px solid #374151; text-align: center; }
          .badge { display: inline-block; background: rgba(217, 119, 6, 0.15); border: 1px solid #d97706; color: #fbbf24; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; }
          .title { color: #ffffff; margin: 12px 0 0 0; font-size: 22px; font-weight: bold; }
          .content { padding: 24px 28px; }
          .field-group { margin-bottom: 16px; }
          .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #9ca3af; margin-bottom: 4px; font-weight: 600; }
          .value { font-size: 15px; color: #ffffff; font-weight: 500; background: #1f2937; padding: 10px 14px; border-radius: 8px; border: 1px solid #374151; }
          .idea-box { background: rgba(217, 119, 6, 0.08); border: 1px solid rgba(217, 119, 6, 0.3); padding: 14px; border-radius: 10px; color: #fef3c7; font-size: 15px; line-height: 1.5; }
          .footer { padding: 20px 28px; background: #0b0f17; border-top: 1px solid #374151; text-align: center; font-size: 12px; color: #6b7280; }
          .button { display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 8px; margin-top: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">Direct Studio Inquiry</span>
            <h1 class="title">New Tattoo Consultation Request</h1>
          </div>
          <div class="content">
            <div class="field-group">
              <div class="label">Reference ID</div>
              <div class="value" style="color: #fbbf24; font-family: monospace; font-weight: bold;">${enquiry.client_id}</div>
            </div>
            <div class="field-group">
              <div class="label">Client Name</div>
              <div class="value">${enquiry.full_name}</div>
            </div>
            <div class="field-group">
              <div class="label">Phone / WhatsApp</div>
              <div class="value">${enquiry.phone}</div>
            </div>
            <div class="field-group">
              <div class="label">Email Address</div>
              <div class="value">${enquiry.email}</div>
            </div>
            <div class="field-group">
              <div class="label">Service Type &amp; Preferred Date</div>
              <div class="value">${enquiry.service_type || "Studio Visit"} · ${enquiry.preferred_date || "Flexible"} (${enquiry.preferred_time || "Flexible"})</div>
            </div>
            <div class="field-group">
              <div class="label">Tattoo Concept &amp; Placement</div>
              <div class="idea-box">
                <strong>Placement:</strong> ${enquiry.placement || "To Discuss"} | <strong>Size:</strong> ${enquiry.approx_size || "Custom"}<br/>
                <strong>Style:</strong> ${enquiry.tattoo_style || "Custom"}<br/><br/>
                ${enquiry.detailed_description || enquiry.tattoo_idea}
              </div>
            </div>
            <div style="text-align: center; margin-top: 24px;">
              <a href="https://wa.me/${enquiry.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(enquiry.full_name)},%20this%20is%20Jainik%20Patel%20regarding%20your%20Tattoo%20Iconic%20enquiry%20[${enquiry.client_id}]" class="button">
                💬 Reply on WhatsApp
              </a>
            </div>
          </div>
          <div class="footer">
            Tattoo Iconic · Notification delivered directly to ${recipient}
          </div>
        </div>
      </body>
    </html>
  `;

  // 1. If Resend API Key is configured
  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Tattoo Iconic <notifications@tattooiconic.in>",
          to: [recipient],
          subject,
          html,
        }),
      });

      if (res.ok) {
        return { success: true, sent: true, message: "Email sent via Resend." };
      }
    } catch (err) {
      console.warn("[Email Notification] Resend exception:", (err as Error).message);
    }
  }

  // 2. If Notification Webhook is configured
  if (webhookUrl && webhookUrl.startsWith("http")) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipient,
          subject,
          html,
          enquiry,
        }),
      });

      if (res.ok) {
        return { success: true, sent: true, message: "Email sent via Webhook." };
      }
    } catch (err) {
      console.warn("[Email Notification] Webhook exception:", (err as Error).message);
    }
  }

  // Fallback: Logged in server console
  console.log(`[Email Notification] Saved for ${recipient} - Client ID: ${enquiry.client_id} (${enquiry.full_name})`);
  return { success: true, sent: false, message: "Logged for Jainik.patel.33@gmail.com" };
}
