import logger from "./logger.js";

export async function sendEmail({ to, subject, text, html }) {
  if (process.env.RESEND_API_KEY) {
    return sendViaResend({ to, subject, html });
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return sendViaSMTP({ to, subject, text, html });
  }

  console.log(`[Email] No provider configured. Would send to ${to}: ${subject}`);
  console.log(`[Email] Set RESEND_API_KEY or SMTP_HOST/SMTP_USER in env`);
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
    } else {
      console.error(`[Email] Resend API error (${res.status}): ${JSON.stringify(body)}`);
    }
  } catch (error) {
    console.error(`[Email] Resend request failed: ${error.message}`);
    logger.error(`[Email] Resend request failed: ${error.message}`);
  }
}

async function sendViaSMTP({ to, subject, text, html }) {
  let nodemailer;
  try {
    nodemailer = await import("nodemailer");
  } catch {
    console.error("[Email] nodemailer not installed — can't use SMTP");
    return;
  }

  const from = process.env.EMAIL_FROM || "noreply@attachlink.com";
  console.log(`[Email] Sending via SMTP to ${to}: ${subject}`);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({ from, to, subject, text, html });
    console.log(`[Email] Sent successfully — id: ${info.messageId}`);
  } catch (error) {
    console.error(`[Email] SMTP failed: ${error.message}`);
    logger.error(`[Email] SMTP failed: ${error.message}`);
  }
}
