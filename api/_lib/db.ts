import { Redis } from '@upstash/redis';

// In production, these come from Vercel environment (auto-set when you add Upstash integration)
// For local dev, set them in .env
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export interface User {
  orderId: string;
  name: string;
  email: string;
  phone: string;
  telegram: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  paidAt?: string;
  createdAt: string;
}

const USERS_SET_KEY = 'marathon:users';
const USER_PREFIX = 'marathon:user:';

export async function saveUser(user: User): Promise<void> {
  await redis.set(`${USER_PREFIX}${user.orderId}`, JSON.stringify(user));
  await redis.sadd(USERS_SET_KEY, user.orderId);
}

export async function getUser(orderId: string): Promise<User | null> {
  const data = await redis.get<string>(`${USER_PREFIX}${orderId}`);
  if (!data) return null;
  return typeof data === 'string' ? JSON.parse(data) : data as unknown as User;
}

export async function updateUserStatus(orderId: string, status: User['status']): Promise<User | null> {
  const user = await getUser(orderId);
  if (!user) return null;
  user.status = status;
  if (status === 'paid') user.paidAt = new Date().toISOString();
  await redis.set(`${USER_PREFIX}${orderId}`, JSON.stringify(user));
  return user;
}

export async function getAllUsers(): Promise<User[]> {
  const orderIds = await redis.smembers(USERS_SET_KEY);
  if (!orderIds || orderIds.length === 0) return [];

  const users: User[] = [];
  for (const orderId of orderIds) {
    const user = await getUser(orderId as string);
    if (user) users.push(user);
  }

  // Sort by creation date descending
  users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return users;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getAllUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function getUserByTelegram(telegram: string): Promise<User | null> {
  const users = await getAllUsers();
  const normalized = telegram.replace('@', '').toLowerCase();
  return users.find((u) => u.telegram.replace('@', '').toLowerCase() === normalized) || null;
}
