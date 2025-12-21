## 1. Create a basic server in nodejs.



## CPU Overheader
Fix

Move CPU work to:

worker_threads

child_process

Job queue

📌 Interview line:

“Anything that blocks the event loop blocks all requests.”

Use Compression Carefully
❌ Always compressing responses

CPU heavy

Slows small responses

✅ Conditional compression
app.use(compression({
  threshold: 1024 // compress only >1KB
}));

Caching (Biggest Latency Killer)
Levels:

In-memory (LRU cache)

Redis

HTTP Cache Headers

Example:
Cache-Control: public, max-age=600


📌 Never hit DB if you don’t need to.

1️⃣6️⃣ Rate Limiting & Throttling

Protects from:

DOS attacks

Resource exhaustion

rateLimit({ windowMs: 1 * 60 * 1000, max: 100 });

9️⃣ Cluster Mode (Multi-Core Usage)

Node is single-threaded.

import cluster from 'cluster';
import os from 'os';

if (cluster.isPrimary) {
  os.cpus().forEach(() => cluster.fork());
}


📌 Scales horizontally on same machine.