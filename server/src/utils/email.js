import logger from "./logger.js";

export async function sendEmail({ to, subject, html }) {
  if (process.env.RESEND_API_KEY) {
    return sendViaResend({ to, subject, html });
  }

  console.log(`[Email] No API key configured. Would send to ${to}: ${subject}`);
  console.log(`[Email] Set RESEND_API_KEY in env`);
  return { sent: false, reason: "no_provider" };
}

async function sendViaResend({ to, subject, html }) {
  const from = process.env.EMAIL_FROM || "AttachLink <onboarding@resend.dev>";
  console.log(`[Email] Sending via Resend API to ${to}: ${subject}`);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });

    const body = await res.json();

    if (res.ok) {
      console.log(`[Email] Sent successfully — id: ${body.id}`);
      return { sent: true };
    }

    if (res.status === 403 && body.message?.includes("verify a domain")) {
      console.log(`[Email] Domain not verified — falling back to dev mode`);
      return { sent: false, reason: "domain_not_verified" };
    }

    console.error(`[Email] Resend API error (${res.status}): ${JSON.stringify(body)}`);
    return { sent: false, reason: "api_error", error: body };
  } catch (error) {
    console.error(`[Email] Resend request failed: ${error.message}`);
    logger.error(`[Email] Resend request failed: ${error.message}`);
    return { sent: false, reason: "network_error", error: error.message };
  }
}
