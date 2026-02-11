import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifySignature } from '../_lib/prodamus';
import { updateUserStatus, getUser } from '../_lib/db';
import { sendTelegramMessage, generateBotDeepLink } from '../_lib/telegram';

/**
 * Prodamus Webhook Handler
 *
 * Called by Prodamus when payment status changes.
 * Verifies HMAC signature, updates user status, sends Telegram notification.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = process.env.PRODAMUS_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).send('Server misconfigured');
  }

  // Get signature from headers (Prodamus sends it in "Sign" header)
  const signatureHeader = req.headers['sign'] as string | undefined;
  if (!signatureHeader) {
    return res.status(400).send('error: signature not found');
  }

  // Verify HMAC signature
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).send('error: empty body');
  }

  try {
    const isValid = verifySignature(body, secretKey, signatureHeader);
    if (!isValid) {
      return res.status(400).send('error: signature incorrect');
    }
  } catch {
    return res.status(400).send('error: signature verification failed');
  }

  // Extract payment data from webhook
  const orderId = body.order_num || body.order_id;
  const paymentStatus = body.payment_status; // 'success' for successful payment

  if (!orderId) {
    return res.status(400).send('error: order_id missing');
  }

  // Update user status in database
  if (paymentStatus === 'success') {
    const user = await updateUserStatus(orderId, 'paid');

    if (user) {
      // Send notification to admin Telegram (optional)
      const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
      if (adminChatId) {
        await sendTelegramMessage(
          adminChatId,
          `✅ <b>Новая оплата!</b>\n\n` +
            `📋 Заказ: <code>${orderId}</code>\n` +
            `👤 ${user.name}\n` +
            `📧 ${user.email}\n` +
            `📱 ${user.phone}\n` +
            `💬 ${user.telegram || '—'}\n` +
            `💰 ${user.amount} ₽`
        );
      }

      // If we have a notification bot chat, log the deeplink for debugging
      const deepLink = generateBotDeepLink(orderId);
      console.log(`Payment success for ${orderId}. Bot deep link: ${deepLink}`);
    }
  } else {
    await updateUserStatus(orderId, 'failed');
  }

  // Prodamus expects HTTP 200 and "success" text
  return res.status(200).send('success');
}
