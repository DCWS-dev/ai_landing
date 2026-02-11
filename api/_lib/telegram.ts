const TELEGRAM_API = 'https://api.telegram.org/bot';

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not set');
  return token;
}

export async function sendTelegramMessage(chatId: string | number, text: string, parseMode: string = 'HTML'): Promise<boolean> {
  const token = getBotToken();
  const res = await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: parseMode,
    }),
  });
  const data = await res.json();
  return data.ok === true;
}

export async function setWebhook(url: string): Promise<boolean> {
  const token = getBotToken();
  const res = await fetch(`${TELEGRAM_API}${token}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  return data.ok === true;
}

export function getBotName(): string {
  return process.env.TELEGRAM_BOT_USERNAME || 'your_marathon_bot';
}

/**
 * Generate a deep link URL that sends user to the bot with /start {orderId}
 * After payment, user follows this link → bot validates them
 */
export function generateBotDeepLink(orderId: string): string {
  const botName = getBotName();
  return `https://t.me/${botName}?start=${orderId}`;
}
