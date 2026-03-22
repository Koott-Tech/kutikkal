import { NextResponse } from "next/server";
import { sendWasenderText, buildRegistrantWhatsApp } from "@/lib/wasenderNotify";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Human-readable titles for admin WhatsApp (extend per slug). */
const WORKSHOP_EVENT_TITLES = {
  "little-care-summer-workshops-2026": "Little Care Summer Workshops 2026 — Expressing Big Emotions at Home",
};

function workshopTitleFromSlug(slug) {
  const key = String(slug || "").trim();
  if (WORKSHOP_EVENT_TITLES[key]) return WORKSHOP_EVENT_TITLES[key];
  return key ? key.replace(/-/g, " ") : "Workshop event";
}

/** Always receive workshop signup alerts here (E.164), in addition to env-configured numbers. */
const WORKSHOP_NOTIFY_ALSO_E164 = "+918590576385";

/**
 * POST /api/events/workshop-register
 * Body: { fullName, email, countryCode, phone, eventSlug? }
 *
 * Sends internal WhatsApp(s) via WASender (WASENDER_API_KEY) to:
 * - +91 85905 76385 (always)
 * - WORKSHOP_REGISTRATION_NOTIFY_PHONE or OPERATIONS_WHATSAPP_NUMBER if set (deduped)
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const fullName = String(body?.fullName || "").trim();
    const email = String(body?.email || "").trim();
    const countryCode = String(body?.countryCode || "").trim();
    const phone = String(body?.phone || "").trim().replace(/\s+/g, "");
    const eventSlug = String(body?.eventSlug || "little-care-summer-workshops-2026").trim();

    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ success: false, error: "Please enter your full name." }, { status: 400 });
    }
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!countryCode) {
      return NextResponse.json({ success: false, error: "Please select a country code." }, { status: 400 });
    }
    if (!phone || phone.length < 6) {
      return NextResponse.json({ success: false, error: "Please enter a valid phone number." }, { status: 400 });
    }

    const payload = {
      fullName,
      email,
      countryCode,
      phone,
      eventSlug,
      receivedAt: new Date().toISOString(),
    };

    if (process.env.NODE_ENV === "development") {
      console.info("[workshop-register]", payload);
    }

    const eventTitle = workshopTitleFromSlug(eventSlug);
    const registrantWhatsApp = buildRegistrantWhatsApp(countryCode, phone);

    const recipients = new Set();
    recipients.add(WORKSHOP_NOTIFY_ALSO_E164);
    const envNotify = String(
      process.env.WORKSHOP_REGISTRATION_NOTIFY_PHONE || process.env.OPERATIONS_WHATSAPP_NUMBER || ""
    ).trim();
    if (envNotify) {
      let n = envNotify.replace(/\s/g, "");
      if (!n.startsWith("+")) n = `+${n}`;
      recipients.add(n);
    }

    const lines = [
      "New workshop registration",
      "",
      `Event: ${eventTitle}`,
      `Name: ${fullName}`,
      `Email: ${email}`,
    ];
    if (registrantWhatsApp) {
      lines.push(`WhatsApp: ${registrantWhatsApp}`);
    }
    lines.push(`Submitted (UTC): ${payload.receivedAt}`);
    const message = lines.join("\n");

    for (const to of recipients) {
      try {
        const wa = await sendWasenderText(to, message);
        if (!wa.success && !wa.skipped) {
          console.error("[workshop-register] WhatsApp notify failed for", to, wa.error || wa);
        }
      } catch (waErr) {
        console.error("[workshop-register] WhatsApp notify error for", to, waErr);
      }
    }

    if (!registrantWhatsApp) {
      console.warn("[workshop-register] Could not build registrant WhatsApp from countryCode + phone.");
    }

    return NextResponse.json({ success: true, message: "Thank you — we’ve received your registration." });
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
