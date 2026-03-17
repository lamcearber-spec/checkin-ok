const attempts = new Map<string, { count: number; resetTime: number }>();
export function checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetTime) { attempts.set(key, { count: 1, resetTime: now + windowMs }); return true; }
  if (entry.count >= maxAttempts) return false;
  entry.count++;
  return true;
}
