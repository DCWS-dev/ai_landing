/**
 * Bun-native API server — replaces Vercel serverless functions for local dev.
 *
 * Routes:
 *   POST /api/auth           → admin login
 *   POST /api/create-payment → create payment (Prodamus / WayForPay)
 *   GET  /api/health         → health check
 *   GET  /api/users          → list users (admin)
 *   POST /api/webhook/prodamus  → Prodamus payment webhook
 *   POST /api/webhook/telegram  → Telegram bot webhook
 *   POST /api/webhook/wayforpay → WayForPay payment webhook
 */

import { resolve, join } from "node:path";

const ROOT = resolve(import.meta.dir, "..");

/* ── Load .env into process.env ── */
function loadEnv() {
  try {
    const content = require("fs").readFileSync(join(ROOT, ".env"), "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {}
}
loadEnv();

/* ── Import _lib utilities (unchanged, they use process.env + crypto) ── */
import {
  verifyAdminPassword,
  createAdminToken,
  isAuthorizedAdmin,
} from "../api/_lib/auth";
import {
  saveUser,
  getUser,
  getUserByEmail,
  getUserByTelegram,
  getAllUsers,
  updateUserStatus,
  type User,
} from "../api/_lib/db";
import { createSignature, verifySignature } from "../api/_lib/prodamus";
import { createWayForPaySignature } from "../api/_lib/wayforpay";
import {
  sendTelegramMessage,
  generateBotDeepLink,
} from "../api/_lib/telegram";

/* ── Helpers ── */
function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function text(body: string, status = 200): Response {
  return new Response(body, { status });
}

async function getBody(req: Request): Promise<Record<string, unknown>> {
  try {
    return (await req.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/* ── Route handlers ── */

async function handleAuth(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const { password } = await getBody(req);
  if (!password || typeof password !== "string")
    return json({ error: "Password is required" }, 400);
  if (!verifyAdminPassword(password))
    return json({ error: "Invalid password" }, 401);
  const token = createAdminToken();
  return json({ token });
}

async function handleCreatePayment(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const body = await getBody(req);
  const { name, email, phone, telegram, currency = "RUB" } = body as Record<
    string,
    string
  >;
  if (!name || !email || !phone)
    return json({ error: "name, email, and phone are required" }, 400);

  const siteUrl = process.env.SITE_URL || "https://your-site.vercel.app";
  const orderId = `M-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const amount = currency === "UAH" ? 665 : 1490;

  await saveUser({
    orderId,
    name,
    email,
    phone,
    telegram: (telegram as string) || "",
    amount,
    currency,
    status: "pending",
    createdAt: new Date().toISOString(),
  } as User & { currency: string });

  if (currency === "UAH") {
    const merchantAccount =
      process.env.WAYFORPAY_MERCHANT_ACCOUNT || "test_merch_n1";
    const secretKey =
      process.env.WAYFORPAY_SECRET_KEY || "flk3409refn54t54t*FNJret";
    const merchantDomainName = new URL(siteUrl).hostname;
    const orderDate = Math.floor(Date.now() / 1000);
    const products = [{ name: "7-денний марафон «Бізнес з ШІ»", price: 665, count: 1 }];

    const data = {
      merchantAccount,
      merchantAuthType: "SimpleSignature",
      merchantDomainName,
      orderReference: orderId,
      orderDate,
      amount,
      currency: "UAH",
      productName: products.map((p) => p.name),
      productCount: products.map((p) => p.count),
      productPrice: products.map((p) => p.price),
    };

    const signature = createWayForPaySignature(data as any, secretKey);

    return json({
      paymentSystem: "wayforpay",
      url: "https://secure.wayforpay.com/pay",
      data: {
        ...data,
        merchantSignature: signature,
        orderTimeout: 49000,
        returnUrl: `${siteUrl}/payment-success?order_id=${orderId}`,
        serviceUrl: `${siteUrl}/api/webhook/wayforpay`,
        clientFirstName: name,
        clientEmail: email,
        clientPhone: phone,
      },
    });
  } else {
    const prodamusUrl = process.env.PRODAMUS_FORM_URL;
    const secretKey = process.env.PRODAMUS_SECRET_KEY;
    if (!prodamusUrl || !secretKey)
      return json({ error: "Payment system not configured" }, 500);

    const paymentData: Record<string, unknown> = {
      order_id: orderId,
      customer_phone: phone,
      customer_email: email,
      customer_extra: `Имя: ${name}${telegram ? `, Telegram: ${telegram}` : ""}`,
      products: [
        { name: '7-дневный марафон «Бизнес с ИИ»', price: "1490", quantity: "1" },
      ],
      do: "pay",
      urlReturn: siteUrl,
      urlSuccess: `${siteUrl}/payment-success?order_id=${orderId}`,
      urlNotification: `${siteUrl}/api/webhook/prodamus`,
      paid_content:
        "Спасибо за покупку! Переходите в Telegram-бота для получения доступа к марафону.",
    };

    const sig = createSignature(paymentData, secretKey);
    paymentData.signature = sig;

    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(paymentData)) {
      if (key === "products" && Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          const product = value[i] as Record<string, string>;
          for (const [pKey, pVal] of Object.entries(product))
            params.append(`products[${i}][${pKey}]`, pVal);
        }
      } else {
        params.append(key, String(value));
      }
    }

    return json({
      paymentSystem: "prodamus",
      paymentUrl: `${prodamusUrl}?${params.toString()}`,
      orderId,
    });
  }
}

function handleHealth(): Response {
  return json({ status: "ok", time: new Date().toISOString() });
}

async function handleUsers(req: Request): Promise<Response> {
  if (req.method !== "GET") return json({ error: "Method not allowed" }, 405);
  const authHeader = req.headers.get("authorization") ?? undefined;
  if (!isAuthorizedAdmin(authHeader))
    return json({ error: "Unauthorized" }, 401);
  const users = await getAllUsers();
  return json({
    total: users.length,
    paid: users.filter((u) => u.status === "paid").length,
    pending: users.filter((u) => u.status === "pending").length,
    users,
  });
}

async function handleWebhookProdamus(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const secretKey = process.env.PRODAMUS_SECRET_KEY;
  if (!secretKey) return text("Server misconfigured", 500);

  const signatureHeader = req.headers.get("sign");
  if (!signatureHeader) return text("error: signature not found", 400);

  const body = await getBody(req);
  if (!Object.keys(body).length) return text("error: empty body", 400);

  try {
    if (!verifySignature(body, secretKey, signatureHeader))
      return text("error: signature incorrect", 400);
  } catch {
    return text("error: signature verification failed", 400);
  }

  const orderId = (body.order_num || body.order_id) as string;
  const paymentStatus = body.payment_status as string;
  if (!orderId) return text("error: order_id missing", 400);

  if (paymentStatus === "success") {
    const user = await updateUserStatus(orderId, "paid");
    if (user) {
      const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
      if (adminChatId) {
        await sendTelegramMessage(
          adminChatId,
          `✅ <b>Новая оплата!</b>\n\n📋 Заказ: <code>${orderId}</code>\n👤 ${user.name}\n📧 ${user.email}\n📱 ${user.phone}\n💬 ${user.telegram || "—"}\n💰 ${user.amount} ₽`
        );
      }
      console.log(`Payment success for ${orderId}. Bot deep link: ${generateBotDeepLink(orderId)}`);
    }
  } else {
    await updateUserStatus(orderId, "failed");
  }
  return text("success");
}

async function handleWebhookTelegram(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const update = await getBody(req);

  if (update?.message && (update.message as any).text) {
    const msg = update.message as any;
    const chatId = msg.chat.id;
    const msgText: string = msg.text;
    const username = msg.from?.username || "";

    if (msgText.startsWith("/start")) {
      const parts = msgText.split(" ");
      const orderId = parts[1];

      if (orderId) {
        const user = await getUser(orderId);
        if (user && user.status === "paid") {
          const tgMatch =
            username &&
            user.telegram &&
            username.toLowerCase() ===
              user.telegram.replace("@", "").toLowerCase();
          if (tgMatch) {
            await sendTelegramMessage(
              chatId,
              `🎉 <b>Добро пожаловать, ${user.name}!</b>\n\n✅ Оплата подтверждена!\n📋 Заказ: <code>${orderId}</code>\n\nВы успешно зачислены на 7-дневный марафон «Бизнес с ИИ»! 🚀\n\n📌 Что дальше:\n• Мы пришлём ссылку на чат участников\n• Старт марафона — по расписанию\n• Все материалы будут доступны здесь в боте\n\nПо любым вопросам пишите сюда — мы на связи! 💬`
            );
          } else {
            await sendTelegramMessage(
              chatId,
              `👋 Привет!\n\nМы нашли ваш заказ <code>${orderId}</code>, но Telegram-никнейм не совпадает.\n\n📧 Для верификации отправьте email, который вы указали при оплате:`
            );
          }
        } else if (user && user.status === "pending") {
          await sendTelegramMessage(
            chatId,
            `⏳ Ваша оплата ещё обрабатывается.\n\nЗаказ: <code>${orderId}</code>\nПодождите несколько минут и попробуйте снова командой:\n/start ${orderId}`
          );
        } else {
          await sendTelegramMessage(
            chatId,
            `❌ Заказ <code>${orderId}</code> не найден.\n\nЕсли вы оплатили, напишите нам — мы разберёмся! 🔧`
          );
        }
      } else {
        await sendTelegramMessage(
          chatId,
          `👋 Привет! Это бот марафона «Бизнес с ИИ».\n\nЕсли вы уже оплатили марафон, перейдите по ссылке из письма с подтверждением оплаты.\n\nИли отправьте ваш email для проверки:`
        );
      }
    } else if (msgText.includes("@") && msgText.includes(".")) {
      const email = msgText.trim();
      const user = await getUserByEmail(email);
      if (user && user.status === "paid") {
        await sendTelegramMessage(
          chatId,
          `🎉 <b>Верификация пройдена!</b>\n\n✅ Оплата подтверждена для ${user.name}!\n📋 Заказ: <code>${user.orderId}</code>\n\nВы успешно зачислены на марафон «Бизнес с ИИ»! 🚀\n\n📌 Мы пришлём ссылку на чат участников и все материалы.\nПо любым вопросам пишите сюда! 💬`
        );
      } else if (user && user.status === "pending") {
        await sendTelegramMessage(
          chatId,
          `⏳ Мы нашли заказ для <b>${email}</b>, но оплата ещё обрабатывается.\nПопробуйте через несколько минут.`
        );
      } else {
        await sendTelegramMessage(
          chatId,
          `❌ Мы не нашли оплату для <b>${email}</b>.\n\nУбедитесь, что вы ввели тот же email, что при оплате. Если проблема остаётся, напишите нам — поможем! 🔧`
        );
      }
    } else {
      const userByTg = username ? await getUserByTelegram(username) : null;
      if (userByTg && userByTg.status === "paid") {
        await sendTelegramMessage(
          chatId,
          `✅ <b>${userByTg.name}</b>, вы уже зачислены на марафон!\n\nПо любым вопросам пишите — мы на связи! 💬`
        );
      } else {
        await sendTelegramMessage(
          chatId,
          `Отправьте ваш email для проверки оплаты, или перейдите по ссылке из письма с подтверждением.`
        );
      }
    }
  }

  return json({ ok: true });
}

async function handleWebhookWayForPay(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const secretKey = process.env.WAYFORPAY_SECRET_KEY;
  if (!secretKey) return json({ error: "Server misconfigured" }, 500);

  const body = await getBody(req);
  if (!Object.keys(body).length) return json({ error: "Empty body" }, 400);

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
  } = body as Record<string, string>;

  if (!orderReference || !merchantSignature)
    return json({ error: "Missing required fields" }, 400);

  const responseSignString = [
    merchantAccount, orderReference, amount, currency,
    authCode, cardPan, transactionStatus, reasonCode,
  ].join(";");

  const crypto = await import("node:crypto");
  const expectedSignature = crypto
    .createHmac("md5", secretKey)
    .update(responseSignString)
    .digest("hex");

  if (expectedSignature !== merchantSignature) {
    console.error(`WayForPay signature mismatch for order ${orderReference}`);
    return json({ error: "Invalid signature" }, 400);
  }

  if (transactionStatus === "Approved") {
    const user = await updateUserStatus(orderReference, "paid");
    if (user) {
      const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
      if (adminChatId) {
        await sendTelegramMessage(
          adminChatId,
          `✅ <b>Нова оплата (WayForPay)!</b>\n\n📋 Замовлення: <code>${orderReference}</code>\n👤 ${user.name}\n📧 ${user.email}\n📱 ${user.phone}\n💬 ${user.telegram || "—"}\n💰 ${user.amount} ₴\n💳 ${cardPan || "—"}`
        );
      }
      console.log(
        `WayForPay payment success for ${orderReference}. Bot deep link: ${generateBotDeepLink(orderReference)}`
      );
    }
  } else {
    await updateUserStatus(orderReference, "failed");
    console.log(
      `WayForPay payment ${transactionStatus} for ${orderReference}. Reason: ${reasonCode}`
    );
  }

  const time = Math.floor(Date.now() / 1000);
  const ackStatus = "accept";
  const ackSignString = `${orderReference};${ackStatus};${time}`;
  const ackSignature = crypto
    .createHmac("md5", secretKey)
    .update(ackSignString)
    .digest("hex");

  return json({ orderReference, status: ackStatus, time, signature: ackSignature });
}

/* ── CORS helper ── */
function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(corsHeaders())) headers.set(k, v);
  return new Response(response.body, {
    status: response.status,
    headers,
  });
}

/* ── Router ── */
const PORT = Number(process.env.API_PORT) || 3000;

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    let response: Response;

    try {
      switch (path) {
        case "/api/auth":
          response = await handleAuth(req);
          break;
        case "/api/create-payment":
          response = await handleCreatePayment(req);
          break;
        case "/api/health":
          response = handleHealth();
          break;
        case "/api/users":
          response = await handleUsers(req);
          break;
        case "/api/webhook/prodamus":
          response = await handleWebhookProdamus(req);
          break;
        case "/api/webhook/telegram":
          response = await handleWebhookTelegram(req);
          break;
        case "/api/webhook/wayforpay":
          response = await handleWebhookWayForPay(req);
          break;
        default:
          response = json({ error: "Not found" }, 404);
      }
    } catch (err) {
      console.error(`API error on ${path}:`, err);
      response = json({ error: "Internal server error" }, 500);
    }

    return withCors(response);
  },
});

console.log(`  🔌 API server running at http://localhost:${PORT}\n`);
