import { NextRequest, NextResponse } from "next/server";

// ─── Whatsassure Configuration ────────────────────────────────────────────────
// API endpoint provided by Rhaitech / Whatsassure (proxies Meta WhatsApp Cloud API)
const WHATSASSURE_URL =
  process.env.WHATSASSURE_API_URL ??
  "https://crmapi.whatsassure.com//api/meta/v19.0/1167639093088437/messages";

const WHATSASSURE_TOKEN = process.env.WHATSASSURE_TOKEN ?? "";
const TEMPLATE_NAME = process.env.WHATSASSURE_TEMPLATE_NAME ?? "";
const TEMPLATE_LANGUAGE = process.env.WHATSASSURE_TEMPLATE_LANGUAGE ?? "en";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Format YYYY-MM-DD → "23 June 2026"  ({{3}} in template)
 */
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Normalize phone number to E.164 (91XXXXXXXXXX for India).
 */
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return "91" + digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  if (digits.length === 11 && digits.startsWith("0")) return "91" + digits.slice(1);
  if (digits.length > 10) return digits; // already has country code
  return null; // invalid
}

// ─── Send single WhatsApp message via Whatsassure ─────────────────────────────

/**
 * Template:
 *   Respected Parent,
 *   {{1}} has {{2}} at Vikas Academy {{3}}.
 *   Thank you!
 *
 * {{1}} = student name
 * {{2}} = attendance status  (e.g. "marked Present", "marked Absent")
 * {{3}} = formatted date
 */
async function sendWhatsAppMessage(
  phone: string,
  studentName: string,
  status: string,
  dateStr: string
): Promise<{ success: boolean; error?: string }> {
  if (!WHATSASSURE_TOKEN) {
    return {
      success: false,
      error: "WHATSASSURE_TOKEN env variable is not set.",
    };
  }
  if (!TEMPLATE_NAME) {
    return {
      success: false,
      error: "WHATSASSURE_TEMPLATE_NAME env variable is not set.",
    };
  }

  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) {
    return { success: false, error: `Invalid phone number: "${phone}"` };
  }

  const formattedDate = formatDate(dateStr);

  // Build request body matching Meta WhatsApp Cloud API template format
  const payload = {
    messaging_product: "whatsapp",
    to: normalizedPhone,
    type: "template",
    template: {
      name: TEMPLATE_NAME,
      language: { code: TEMPLATE_LANGUAGE },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: studentName },        // {{1}}
            { type: "text", text: status },              // {{2}}
            { type: "text", text: formattedDate },       // {{3}}
          ],
        },
      ],
    },
  };

  try {
    const res = await fetch(WHATSASSURE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${WHATSASSURE_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await res.text();

    if (!res.ok) {
      return {
        success: false,
        error: `Whatsassure API ${res.status}: ${responseText}`,
      };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error";
    return { success: false, error: msg };
  }
}

// ─── POST /api/whatsapp/notify ────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { records, date } = body as {
      records: {
        student: {
          name?: string;
          contact?: string;
          parentMobile?: string;
          parentName?: string;
        };
        status?: string;
      }[];
      date: string;
    };

    if (!records || !Array.isArray(records)) {
      return NextResponse.json(
        { success: false, error: "records array is required" },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { success: false, error: "date is required (YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    const results = {
      sent: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const record of records) {
      const studentName = record.student?.name ?? "Student";
      const status      = record.status ?? "Present";

      // Prefer parentMobile, fall back to contact (student's own number)
      const phone = (record.student?.parentMobile ?? record.student?.contact ?? "").trim();

      if (!phone) {
        results.skipped++;
        continue;
      }

      const result = await sendWhatsAppMessage(phone, studentName, status, date);

      if (result.success) {
        results.sent++;
      } else {
        results.failed++;
        results.errors.push(`${studentName} (${phone}): ${result.error}`);
        console.error(`[WhatsApp] Failed for ${studentName}:`, result.error);
      }
    }

    const message =
      `WhatsApp Notifications → ` +
      `✅ Sent: ${results.sent}  ` +
      `❌ Failed: ${results.failed}  ` +
      `⏭️ Skipped (no contact): ${results.skipped}`;

    return NextResponse.json({
      success: true,
      message,
      details: results,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    console.error("[WhatsApp notify] Unexpected error:", msg);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
