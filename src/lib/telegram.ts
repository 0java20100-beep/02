const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export function telegramEnabled(): boolean {
  return Boolean(TOKEN && CHAT_ID);
}

export async function sendTelegramMessage(text: string): Promise<boolean> {
  if (!telegramEnabled()) {
    console.warn("[telegram] disabled (missing TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID)");
    return false;
  }
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    );
    if (!res.ok) {
      console.error("[telegram] send failed", await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[telegram] error", err);
    return false;
  }
}

export function formatOrderForTelegram(order: {
  name: string;
  phone: string;
  telegram?: string | null;
  email?: string | null;
  projectType: string;
  description: string;
  budget?: string | null;
  deadline?: string | null;
}): string {
  const lines = [
    "🚀 <b>Новая заявка — NAVIX</b>",
    "",
    `👤 <b>Имя:</b> ${escapeHtml(order.name)}`,
    `📞 <b>Телефон:</b> ${escapeHtml(order.phone)}`,
  ];
  if (order.telegram) lines.push(`✈️ <b>Telegram:</b> ${escapeHtml(order.telegram)}`);
  if (order.email) lines.push(`📧 <b>Email:</b> ${escapeHtml(order.email)}`);
  lines.push(`🧩 <b>Тип проекта:</b> ${escapeHtml(order.projectType)}`);
  if (order.budget) lines.push(`💰 <b>Бюджет:</b> ${escapeHtml(order.budget)}`);
  if (order.deadline) lines.push(`⏱ <b>Сроки:</b> ${escapeHtml(order.deadline)}`);
  lines.push("", `📝 <b>Описание:</b>`, escapeHtml(order.description));
  return lines.join("\n");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
