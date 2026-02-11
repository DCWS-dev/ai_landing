import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUser, getUserByEmail, getUserByTelegram } from '../_lib/db';
import { sendTelegramMessage } from '../_lib/telegram';

/**
 * Telegram Bot Webhook Handler
 *
 * Receives updates from Telegram when users interact with the bot.
 * Main flow: user clicks deep link after payment → /start {orderId} →
 * bot validates user by username or email → sends welcome message.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const update = req.body;

  // Handle /start command with optional deep link parameter
  if (update?.message?.text) {
    const chatId = update.message.chat.id;
    const text: string = update.message.text;
    const username = update.message.from?.username || '';

    if (text.startsWith('/start')) {
      const parts = text.split(' ');
      const orderId = parts[1]; // deep link payload: /start M-12345-abc

      if (orderId) {
        // User came from payment deep link — validate by orderId
        const user = await getUser(orderId);

        if (user && user.status === 'paid') {
          // Check if the Telegram username matches (case-insensitive)
          const tgMatch =
            username &&
            user.telegram &&
            username.toLowerCase() === user.telegram.replace('@', '').toLowerCase();

          if (tgMatch) {
            await sendTelegramMessage(
              chatId,
              `🎉 <b>Добро пожаловать, ${user.name}!</b>\n\n` +
                `✅ Оплата подтверждена!\n` +
                `📋 Заказ: <code>${orderId}</code>\n\n` +
                `Вы успешно зачислены на 7-дневный марафон «Бизнес с ИИ»! 🚀\n\n` +
                `📌 Что дальше:\n` +
                `• Мы пришлём ссылку на чат участников\n` +
                `• Старт марафона — по расписанию\n` +
                `• Все материалы будут доступны здесь в боте\n\n` +
                `По любым вопросам пишите сюда — мы на связи! 💬`
            );
          } else {
            // Username doesn't match — try email verification
            await sendTelegramMessage(
              chatId,
              `👋 Привет!\n\n` +
                `Мы нашли ваш заказ <code>${orderId}</code>, но Telegram-никнейм не совпадает.\n\n` +
                `📧 Для верификации отправьте email, который вы указали при оплате:`
            );
          }
        } else if (user && user.status === 'pending') {
          await sendTelegramMessage(
            chatId,
            `⏳ Ваша оплата ещё обрабатывается.\n\n` +
              `Заказ: <code>${orderId}</code>\n` +
              `Подождите несколько минут и попробуйте снова командой:\n` +
              `/start ${orderId}`
          );
        } else {
          await sendTelegramMessage(
            chatId,
            `❌ Заказ <code>${orderId}</code> не найден.\n\n` +
              `Если вы оплатили, напишите нам — мы разберёмся! 🔧`
          );
        }
      } else {
        // No orderId — generic welcome
        await sendTelegramMessage(
          chatId,
          `👋 Привет! Это бот марафона «Бизнес с ИИ».\n\n` +
            `Если вы уже оплатили марафон, перейдите по ссылке из письма с подтверждением оплаты.\n\n` +
            `Или отправьте ваш email для проверки:`
        );
      }
    } else if (text.includes('@') && text.includes('.')) {
      // User sent an email — try to verify
      const email = text.trim();
      const user = await getUserByEmail(email);

      if (user && user.status === 'paid') {
        await sendTelegramMessage(
          chatId,
          `🎉 <b>Верификация пройдена!</b>\n\n` +
            `✅ Оплата подтверждена для ${user.name}!\n` +
            `📋 Заказ: <code>${user.orderId}</code>\n\n` +
            `Вы успешно зачислены на марафон «Бизнес с ИИ»! 🚀\n\n` +
            `📌 Мы пришлём ссылку на чат участников и все материалы.\n` +
            `По любым вопросам пишите сюда! 💬`
        );
      } else if (user && user.status === 'pending') {
        await sendTelegramMessage(
          chatId,
          `⏳ Мы нашли заказ для <b>${email}</b>, но оплата ещё обрабатывается.\n` +
            `Попробуйте через несколько минут.`
        );
      } else {
        await sendTelegramMessage(
          chatId,
          `❌ Мы не нашли оплату для <b>${email}</b>.\n\n` +
            `Убедитесь, что вы ввели тот же email, что при оплате. ` +
            `Если проблема остаётся, напишите нам — поможем! 🔧`
        );
      }
    } else {
      // Unknown message
      const userByTg = username ? await getUserByTelegram(username) : null;
      if (userByTg && userByTg.status === 'paid') {
        await sendTelegramMessage(
          chatId,
          `✅ <b>${userByTg.name}</b>, вы уже зачислены на марафон!\n\n` +
            `По любым вопросам пишите — мы на связи! 💬`
        );
      } else {
        await sendTelegramMessage(
          chatId,
          `Отправьте ваш email для проверки оплаты, или перейдите по ссылке из письма с подтверждением.`
        );
      }
    }
  }

  return res.status(200).json({ ok: true });
}
