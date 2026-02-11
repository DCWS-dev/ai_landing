import crypto from 'crypto';

interface WayForPayData {
  merchantAccount: string;
  merchantDomainName: string;
  orderReference: string;
  orderDate: number;
  amount: number;
  currency: string;
  productName: string[];
  productCount: number[];
  productPrice: number[];
}

export function createWayForPaySignature(data: WayForPayData, secretKey: string): string {
  const {
    merchantAccount,
    merchantDomainName,
    orderReference,
    orderDate,
    amount,
    currency,
    productName,
    productCount,
    productPrice,
  } = data;

  const stringToSign = [
    merchantAccount,
    merchantDomainName,
    orderReference,
    orderDate,
    amount,
    currency,
    ...productName,
    ...productCount,
    ...productPrice,
  ].join(';');

  return crypto.createHmac('md5', secretKey).update(stringToSign).digest('hex');
}
