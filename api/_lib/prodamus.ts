import crypto from 'crypto';

/**
 * Prodamus HMAC signature library (TypeScript port)
 * Based on official Prodamus Hmac.php / Hmac.js
 *
 * Algorithm:
 * 1. Convert all values to strings
 * 2. Sort by keys alphabetically (including nested)
 * 3. Convert to JSON string
 * 4. Escape / in JSON
 * 5. Sign with HMAC-SHA256 using secret key
 */

function deepSortByKeys(obj: Record<string, unknown>): Record<string, unknown> {
  const sorted: Record<string, unknown> = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    const val = obj[key];
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      sorted[key] = deepSortByKeys(val as Record<string, unknown>);
    } else if (Array.isArray(val)) {
      sorted[key] = val.map((item) =>
        item !== null && typeof item === 'object'
          ? deepSortByKeys(item as Record<string, unknown>)
          : String(item)
      );
    } else {
      sorted[key] = val === null || val === undefined ? '' : String(val);
    }
  }
  return sorted;
}

export function createSignature(data: Record<string, unknown>, secretKey: string): string {
  // Remove signature from data if present
  const { signature: _, ...cleanData } = data;

  const sorted = deepSortByKeys(cleanData);
  let json = JSON.stringify(sorted);
  // Escape forward slashes as per Prodamus spec
  json = json.replace(/\//g, '\\/');

  return crypto.createHmac('sha256', secretKey).update(json).digest('hex');
}

export function verifySignature(
  data: Record<string, unknown>,
  secretKey: string,
  signatureFromHeader: string
): boolean {
  const expected = createSignature(data, secretKey);
  return crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(signatureFromHeader, 'hex')
  );
}
