import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createSignature } from './_lib/prodamus.js';
import { createWayForPaySignature } from './_lib/wayforpay.js';
import { saveUser } from './_lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, telegram, currency = 'RUB' } = req.body || {};

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'name, email, and phone are required' });
  }

  const siteUrl = process.env.SITE_URL || 'https://your-site.vercel.app';
  
  // Generate unique order ID
  const orderId = `M-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Amount & product name by currency
  const PRICE_MAP: Record<string, { amount: number; product: string }> = {
    RUB: { amount: 1490, product: '7-дневный марафон «Бизнес с ИИ»' },
    UAH: { amount: 665,  product: '7-денний марафон «Бізнес з ШІ»' },
    KZT: { amount: 7900, product: '7 күндік марафон «ЖИ-мен бизнес»' },
    USD: { amount: 15,   product: '7-day marathon «Business with AI»' },
  };
  const { amount, product } = PRICE_MAP[currency] || PRICE_MAP.USD;

  // Save user to DB with pending status
  await saveUser({
    orderId,
    name,
    email,
    phone,
    telegram: telegram || '',
    amount,
    currency,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });

  if (currency === 'UAH') {
    // WayForPay Logic
    const merchantAccount = process.env.WAYFORPAY_MERCHANT_ACCOUNT || 'test_merch_n1';
    const secretKey = process.env.WAYFORPAY_SECRET_KEY || 'flk3409refn54t54t*FNJret';
    const merchantDomainName = (new URL(siteUrl)).hostname;
    const orderDate = Math.floor(Date.now() / 1000);

    const products = [
      {
        name: product,
        price: amount,
        count: 1,
      }
    ];

    const data = {
      merchantAccount,
      merchantAuthType: 'SimpleSignature',
      merchantDomainName,
      orderReference: orderId,
      orderDate,
      amount,
      currency: 'UAH',
      productName: products.map(p => p.name),
      productCount: products.map(p => p.count),
      productPrice: products.map(p => p.price),
    };

    const signature = createWayForPaySignature({ ...data } as any, secretKey);

    // Construct form URL or return data for frontend to post
    // WayForPay usually works by POSTing a form to their URL.
    // We will return the data and URL for the frontend to create a form and submit immediately.
    
    return res.status(200).json({
      paymentSystem: 'wayforpay',
      url: 'https://secure.wayforpay.com/pay',
      data: {
        ...data,
        merchantSignature: signature,
        orderTimeout: 49000,
        returnUrl: `${siteUrl}/payment-success?order_id=${orderId}`,
        serviceUrl: `${siteUrl}/api/webhook/wayforpay`,
        clientFirstName: name,
        clientEmail: email,
        clientPhone: phone,
      }
    });

  } else {
    // Prodamus Logic (RUB / KZT / USD)
    const prodamusUrl = process.env.PRODAMUS_FORM_URL;
    const secretKey = process.env.PRODAMUS_SECRET_KEY;

    if (!prodamusUrl || !secretKey) {
       // Fallback for demo mode if envs missing, or error
       console.error('Prodamus not configured');
       return res.status(500).json({ error: 'Payment system not configured' });
    }

    // Build Prodamus payment data
    const paymentData: Record<string, unknown> = {
      order_id: orderId,
      customer_phone: phone,
      customer_email: email,
      customer_extra: `Имя: ${name}${telegram ? `, Telegram: ${telegram}` : ''}`,
      products: [
        {
          name: product,
          price: String(amount),
          quantity: '1',
        },
      ],
      do: 'pay',
      urlReturn: `${siteUrl}`,
      urlSuccess: `${siteUrl}/payment-success?order_id=${orderId}`,
      urlNotification: `${siteUrl}/api/webhook/prodamus`,
      paid_content: 'Спасибо за покупку! Переходите в Telegram-бота для получения доступа к марафону.',
    };

    // Create HMAC signature
    const signature = createSignature(paymentData, secretKey);
    paymentData.signature = signature;

    // Build the payment URL
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(paymentData)) {
      if (key === 'products' && Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          const product = value[i] as Record<string, string>;
          for (const [pKey, pVal] of Object.entries(product)) {
            params.append(`products[${i}][${pKey}]`, pVal);
          }
        }
      } else {
        params.append(key, String(value));
      }
    }

    const paymentUrl = `${prodamusUrl}?${params.toString()}`;

    return res.status(200).json({
      paymentSystem: 'prodamus',
      paymentUrl,
      orderId,
    });
  }
}
