import nodemailer from "nodemailer";
import logger from "./logger.js";

function createTransport() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
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

  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  }

  if (process.env.RESEND_API_KEY) {
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

  return null;
}

const transporter = createTransport();

export async function sendEmail({ to, subject, text, html }) {
  if (!transporter) {
    logger.warn(`[Email] No email provider configured. Would send to ${to}: ${subject}`);
    logger.warn(`[Email] Set SMTP_HOST/SMTP_USER/SMTP_PASS, SENDGRID_API_KEY, or RESEND_API_KEY in .env`);
    return;
  }

  const from = process.env.EMAIL_FROM || "noreply@attachlink.com";

  try {
    const info = await transporter.sendMail({ from, to, subject, text, html });
    logger.info(`[Email] Sent to ${to}: ${subject} (id: ${info.messageId})`);
  } catch (error) {
    logger.error(`[Email] Failed to send to ${to}: ${error.message}`);
  }
}
