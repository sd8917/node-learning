const buckets = new Map();

export function rateLimiter(req, res, next) {
  const ip = req.ip;

  const now = Date.now();
  const window = 60 * 1000;
  const limit = 10;

  if (!buckets.has(ip)) {
    buckets.set(ip, { count: 1, start: now });
    return next();
  }

  const bucket = buckets.get(ip);
  // reset to new time after limit is hit
  if (now - bucket.start > window) {
    bucket.count = 1;
    bucket.start = now;
    return next();
  }

  if (bucket.count >= limit) {
    return res.status(429).json({ message: "Too many requests" });
  }

  bucket.count++;
  next();
}
