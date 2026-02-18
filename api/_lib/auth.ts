import crypto from 'crypto';

const AUTH_SECRET = () => {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET env var is not set');
  return secret;
};

export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return password === adminPassword;
}

export function createAdminToken(): string {
  const payload = {
    role: 'admin',
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', AUTH_SECRET()).update(payloadStr).digest('base64url');
  return `${payloadStr}.${sig}`;
}

export function verifyAdminToken(token: string): boolean {
  try {
    const [payloadStr, sig] = token.split('.');
    if (!payloadStr || !sig) return false;

    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET()).update(payloadStr).digest('base64url');
    if (sig !== expectedSig) return false;

    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString());
    if (payload.role !== 'admin') return false;
    if (payload.exp < Date.now()) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts and verifies admin token from Authorization header.
 * Returns true if valid admin session.
 */
export function isAuthorizedAdmin(authHeader: string | undefined | null): boolean {
  if (!authHeader) return false;
  const token = authHeader.replace('Bearer ', '');
  return verifyAdminToken(token);
}
