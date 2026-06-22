import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
const MAIL_FROM = process.env.MAIL_FROM || "NAVIX <no-reply@navix.uz>";
const MAIL_TO = process.env.MAIL_TO || "0java20100@gmail.com";

export function emailEnabled(): boolean {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);
}

function getTransport() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendOrderEmail(html: string, subject: string): Promise<boolean> {
  if (!emailEnabled()) {
    console.warn("[email] disabled (missing SMTP_* env)");
    return false;
  }
  try {
    const transport = getTransport();
    await transport.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      subject,
      html,
    });
    return true;
  } catch (err) {
    console.error("[email] send failed", err);
    return false;
  }
}

export function formatOrderEmail(order: {
  name: string;
  phone: string;
  telegram?: string | null;
  email?: string | null;
  projectType: string;
  description: string;
  budget?: string | null;
  deadline?: string | null;
}): string {
  const row = (k: string, v?: string | null) =>
    v ? `<tr><td style="padding:6px 12px;font-weight:600;color:#555">${k}</td><td style="padding:6px 12px">${escapeHtml(v)}</td></tr>` : "";
  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
    <div style="background:#0a0a12;color:#fff;padding:24px;border-radius:12px 12px 0 0">
      <h2 style="margin:0">🚀 Новая заявка — NAVIX</h2>
    </div>
    <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eee">
      ${row("Имя", order.name)}
      ${row("Телефон", order.phone)}
      ${row("Telegram", order.telegram)}
      ${row("Email", order.email)}
      ${row("Тип проекта", order.projectType)}
      ${row("Бюджет", order.budget)}
      ${row("Сроки", order.deadline)}
      ${row("Описание", order.description)}
    </table>
    <p style="color:#999;font-size:12px;padding:12px">NAVIX — navix.uz</p>
  </div>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
