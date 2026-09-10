import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 10000 : 10,
  skip: () => process.env.NODE_ENV === 'test',
  message: { error: 'Too many login attempts, please try again in 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || req.socket.remoteAddress || 'unknown',
});

export const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 10000 : 100,
  skip: () => process.env.NODE_ENV === 'test',
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 10000 : 5,
  skip: () => process.env.NODE_ENV === 'test',
  message: { error: 'Too many requests, please try again in 1 hour' },
  standardHeaders: true,
  legacyHeaders: false,
});

export function resetAllLimiters(): { auth: number; global: number; strict: number } {
  const results = { auth: 0, global: 0, strict: 0 };
  try { (authLimiter as any).store?.resetAll?.(); results.auth = 1; } catch {}
  try { (globalLimiter as any).store?.resetAll?.(); results.global = 1; } catch {}
  try { (strictLimiter as any).store?.resetAll?.(); results.strict = 1; } catch {}
  return results;
}
