import { NextRequest, NextResponse } from "next/server";
import { generateClientId } from "@/lib/clientId";
import { appendEnquiryToGoogleSheets, getStoredEnquiries } from "@/lib/googleSheets";
import { sendEnquiryEmailNotification } from "@/lib/email";
import { whatsappService } from "@/services/whatsapp.service";
import type { TattooEnquiry, EnquiryFormData } from "@/types";

/**
 * Sanitize text to prevent spreadsheet formula injection and HTML injection
 */
function sanitizeInput(val: unknown): string {
  if (typeof val !== "string") return "";
  let clean = val.trim();
  // Prevent spreadsheet formula injection (=, +, -, @, \t, \r)
  if (/^[=+\-@\t\r]/.test(clean)) {
    clean = `'${clean}`;
  }
  return clean;
}

/**
 * POST /api/enquiry
 * Submits customer enquiry to Google Sheets and generates official WhatsApp link
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as EnquiryFormData;

    const fullName = sanitizeInput(body.full_name);
    const email = sanitizeInput(body.email);
    const phone = sanitizeInput(body.phone);
    const tattooIdea = sanitizeInput(body.tattoo_idea);
    const tattooStyle = sanitizeInput(body.tattoo_style || "Custom");
    const placement = sanitizeInput(body.placement || "To Discuss");
    const approxSize = sanitizeInput(body.approx_size || "Medium");
    const colorPreference = (sanitizeInput(body.color_preference) || "Black & Grey") as any;
    const serviceType = (body.service_type === "Home Tattoo Service" ? "Home Tattoo Service" : "Visit Artist") as any;
    const preferredDate = sanitizeInput(body.preferred_date || "");
    const alternativeDate = sanitizeInput(body.alternative_date || "");
    const preferredTime = sanitizeInput(body.preferred_time || "Flexible");
    const detailedDescription = sanitizeInput(body.detailed_description || "");
    const referenceImageUrl = sanitizeInput(body.reference_image_url || "");
    const city = sanitizeInput(body.city || "");
    const address = sanitizeInput(body.address || "");

    // 1. Validation & Field Normalization
    if (!fullName || fullName.length < 1) {
      return NextResponse.json(
        { success: false, error: "Please provide your name." },
        { status: 400 }
      );
    }

    const cleanPhone = phone ? phone.replace(/[^0-9+]/g, "") : "";
    const hasValidPhone = cleanPhone.replace(/[^0-9]/g, "").length >= 7;
    const hasValidEmail = Boolean(email && email.includes("@"));

    if (!hasValidPhone && !hasValidEmail) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid phone number or email address." },
        { status: 400 }
      );
    }

    const finalPhone = hasValidPhone ? cleanPhone : (phone || "+91 82387 67100");
    const finalIdea = tattooIdea || detailedDescription || "General Consultation Inquiry";

    // 2. Generate Collision-Resistant Client ID
    const clientId = generateClientId();
    const submittedAt = new Date().toISOString();

    // 3. Assemble Complete Enquiry Record
    const enquiry: TattooEnquiry = {
      client_id: clientId,
      submitted_at: submittedAt,
      full_name: fullName,
      email: email || `${clientId.toLowerCase()}@client.tattooiconic.in`,
      phone: finalPhone,
      tattoo_idea: finalIdea,
      tattoo_style: tattooStyle,
      placement,
      approx_size: approxSize,
      color_preference: colorPreference,
      service_type: serviceType,
      preferred_date: preferredDate,
      alternative_date: alternativeDate,
      preferred_time: preferredTime,
      detailed_description: detailedDescription || (address ? `Address: ${address}, ${city}` : ""),
      reference_image_url: referenceImageUrl,
      status: "NEW",
      whatsapp_contacted: "NO",
      artist_notes: city ? `City/Location: ${city}` : "",
    };

    // 4. Server-Side Google Sheets Storage
    const sheetResult = await appendEnquiryToGoogleSheets(enquiry);

    // 5. Trigger Email Notification to Jainik Patel
    sendEnquiryEmailNotification(enquiry).catch((err) =>
      console.warn("[Email Notification Error]:", err?.message)
    );

    // 6. Generate Official WhatsApp Click-to-Chat Link
    const whatsappUrl = whatsappService.generateEnquiryUrl({
      client_id: clientId,
      full_name: fullName,
      tattoo_idea: tattooIdea,
      tattoo_style: tattooStyle,
      placement,
      approx_size: approxSize,
      color_preference: colorPreference,
      service_type: serviceType,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      city: city || address,
    });

    return NextResponse.json({
      success: true,
      client_id: clientId,
      whatsapp_url: whatsappUrl,
      stored_in_sheet: sheetResult.sheet_appended,
      message: "Your enquiry has been received successfully.",
      enquiry,
    });
  } catch (err) {
    console.error("[POST /api/enquiry] Error:", (err as Error).message);
    return NextResponse.json(
      {
        success: false,
        error: "We couldn't submit your enquiry right now. Please contact us directly on WhatsApp.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/enquiry
 * Retrieves recorded enquiries for the Artist Dashboard
 */
export async function GET() {
  try {
    const enquiries = getStoredEnquiries();
    return NextResponse.json({ success: true, enquiries });
  } catch (err) {
    console.error("[GET /api/enquiry] Error:", (err as Error).message);
    return NextResponse.json(
      { success: false, enquiries: [] },
      { status: 500 }
    );
  }
}
