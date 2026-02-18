import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { updateUserStatus } from '../_lib/db';
import { sendTelegramMessage, generateBotDeepLink } from '../_lib/telegram';

/**
 * WayForPay Webhook Handler
 *
 * Called by WayForPay (serviceUrl) when payment status changes.
 * Verifies HMAC-MD5 signature, updates user status, sends Telegram notification.
 *
 * WayForPay sends POST with JSON body containing transaction result.
 * We must respond with a JSON acknowledge to confirm receipt.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = process.env.WAYFORPAY_SECRET_KEY;
  if (!secretKey) {
    console.error('WAYFORPAY_SECRET_KEY not configured');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Empty body' });
  }

  const {
    merchantAccount,
    orderReference,
    amount,
    currency,
    authCode,
    cardPan,
    transactionStatus,
    reasonCode,
    merchantSignature,
  } = body;

  if (!orderReference || !merchantSignature) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Verify response signature
  // WayForPay response signature string:
  // merchantAccount;orderReference;amount;currency;authCode;cardPan;transactionStatus;reasonCode
  const responseSignString = [
    merchantAccount,
    orderReference,
    amount,
    currency,
    authCode,
    cardPan,
    transactionStatus,
    reasonCode,
  ].join(';');

  const expectedSignature = crypto
    .createHmac('md5', secretKey)
    .update(responseSignString)
    .digest('hex');

  if (expectedSignature !== merchantSignature) {
    console.error(`WayForPay signature mismatch for order ${orderReference}`);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Process payment result
  if (transactionStatus === 'Approved') {
    const user = await updateUserStatus(orderReference, 'paid');

    if (user) {
      // Send notification to admin Telegram
      const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
      if (adminChatId) {
        await sendTelegramMessage(
          adminChatId,
          `✅ <b>Нова оплата (WayForPay)!</b>\n\n` +
            `📋 Замовлення: <code>${orderReference}</code>\n` +
            `👤 ${user.name}\n` +
            `📧 ${user.email}\n` +
            `📱 ${user.phone}\n` +
            `💬 ${user.telegram || '—'}\n` +
            `💰 ${user.amount} ₴\n` +
            `💳 ${cardPan || '—'}`
        );
      }

      const deepLink = generateBotDeepLink(orderReference);
      console.log(`WayForPay payment success for ${orderReference}. Bot deep link: ${deepLink}`);
    }
  } else {
    // transactionStatus can be: Declined, Expired, etc.
    await updateUserStatus(orderReference, 'failed');
    console.log(`WayForPay payment ${transactionStatus} for ${orderReference}. Reason: ${reasonCode}`);
  }

  // WayForPay requires an acknowledge response with signature
  const time = Math.floor(Date.now() / 1000);
  const ackStatus = 'accept';
  const ackSignString = `${orderReference};${ackStatus};${time}`;
  const ackSignature = crypto
    .createHmac('md5', secretKey)
    .update(ackSignString)
    .digest('hex');

  return res.status(200).json({
    orderReference,
    status: ackStatus,
    time,
    signature: ackSignature,
  });
}
