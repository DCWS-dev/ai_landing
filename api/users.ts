import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isAuthorizedAdmin } from './_lib/auth.js';
import { getAllUsers } from './_lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify admin auth
  if (!isAuthorizedAdmin(req.headers.authorization)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const users = await getAllUsers();

  return res.status(200).json({
    total: users.length,
    paid: users.filter((u) => u.status === 'paid').length,
    pending: users.filter((u) => u.status === 'pending').length,
    users,
  });
}
