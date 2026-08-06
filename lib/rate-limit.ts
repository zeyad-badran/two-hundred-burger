const rateLimitStore = new Map<string, { count: number; expires: number }>();

export function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (record && record.expires > now) {
    if (record.count >= limit) {
      return false; // Rate limit exceeded
    }
    record.count++;
  } else {
    rateLimitStore.set(ip, { count: 1, expires: now + windowMs });
  }
  return true;
}
