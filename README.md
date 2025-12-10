## Architecture nodejs

2️⃣ How do you design a rate limiter WITHOUT Redis?

Redis is ideal, but interviewers love to ask:

What if Redis isn't available? How would you implement a rate limiter in-memory?

API rate limiting is an essential technique to prevent abuse and ensure the smooth operation of a server by restricting the number of requests a client can make in a given timeframe. It is commonly used to protect public APIs, prevent brute-force attacks, and reduce server load


⭐ Option 1: Token bucket algorithm (in-memory)

Each user gets a "bucket" that refills over time.

```
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




```


⭐ Option 2: Sliding Window Counter


## 4️⃣ What is a Dead Letter Queue (DLQ)?

A DLQ = Failed messages go here after repeated retry attempts.

It prevents:
- Message loss
- Message loops
- Stuck queues
- Poison messages (bad data)

⭐ DLQ Architecture

```
Main Queue → Worker → (fails 3 times) → Dead Letter Queue

```

🔥 Example using BullMQ
Worker:

```
import { Worker, Queue } from "bullmq";

const fileQueue = new Queue("file-processing");

// Dead Letter Queue
const dlq = new Queue("file-dlq");

const worker = new Worker("file-processing", async (job) => {
  try {
    // process logic
  } catch (err) {
    throw err; // BullMQ tracks failure
  }
}, {
  attempts: 3,     // retries
  backoff: 5000,   // wait 5 sec before retrying
});

worker.on("failed", async (job, err) => {
  if (job.attemptsMade >= 3) {
    // move to DLQ
    await dlq.add("dead-job", job.data);
    console.log("Moved job to DLQ");
  }
});


```

## 3️⃣ Explain graceful shutdown for Express apps

When deploying (PM2, Docker, Kubernetes), you must:

❌ Stop accepting new requests
❌ Wait for ongoing requests to finish
❌ Close DB connections
❌ Close message queues
❌ THEN exit

📌 Why graceful shutdown is required

If you kill -9:

- In-flight requests fail
- DB writes get corrupted
- Jobs get stuck
- Redis/Mongo connections leak