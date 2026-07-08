import nodemailer from "nodemailer";
import logger from "./logger.js";

function createTransport() {
  console.log(`[Email] Checking env vars: RESEND_API_KEY=${process.env.RESEND_API_KEY ? "SET" : "NOT SET"}, SMTP_HOST=${process.env.SMTP_HOST || "NOT SET"}`);

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    console.log("[Email] Using SMTP provider");
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  if (process.env.RESEND_API_KEY) {
    console.log("[Email] Using Resend SMTP");
    return nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: true,
      auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY,
      },
    });
  }

  if (process.env.SENDGRID_API_KEY) {
    console.log("[Email] Using SendGrid SMTP");
    return nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  }

  console.log("[Email] No email provider configured!");
  return null;
}

let _transporter = null;

async function getTransporter() {
  if (!_transporter) {
    _transporter = createTransport();
  }
  return _transporter;
}

export async function sendEmail({ to, subject, text, html }) {
  const transporter = await getTransporter();

  if (!transporter) {
    console.log(`[Email] Would send to ${to}: ${subject} — no provider configured`);
    return;
  }

  const from = process.env.EMAIL_FROM || "noreply@attachlink.com";
  console.log(`[Email] Sending to ${to}: ${subject} (from: ${from})`);

  try {
    const info = await transporter.sendMail({ from, to, subject, text, html });
    console.log(`[Email] Sent successfully — id: ${info.messageId}`);
  } catch (error) {
    console.error(`[Email] Failed to send: ${error.message}`);
    logger.error(`[Email] Failed to send to ${to}: ${error.message}`);
  }
}
