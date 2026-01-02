## Worker & event 

- Its important concept to understand when we have cpu intensive task we offload those task to worker
- Since, js is single-threaded event loop so its will block code executing in line... 
- It main thread the sequential exectuction goes and parallel in worker thread we do intesive task.

- CPU-heavy tasks block the event loop:

      - image processing
      - encryption
      - large loops
      - data transformation

      Bonus: Worker Pool (Senior-Level Tip)

For production:

- Create N workers = CPU cores
- Distribute tasks
- Avoid single worker bottleneck

## 2️⃣ Worker Threads vs Child Processes (Interview MUST)



## Worker vs cluster module
- Cluster increases throughput, workers reduce latency under CPU load
- Cluster scales the server, workers scale computation.
- I use cluster to scale I/O across cores and worker threads to offload CPU-intensive tasks, sometimes combining both for high-scale systems

 1. fault Tolerance
      Cluster
      ✔ If one process crashes, others survive
      ✔ Easy respawn
      Worker Threads
      ❌ Worker crash can affect process
      ⚠️ Must handle errors carefully

      `
      import cluster from "cluster";
import os from "os";

if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }
} else {
  startServer();
}


      `

## Loadtesting and how to debug real production issues

- We test our apis and system on unexpected i/o and heavy load 
- System should be fault taularent and 
- understand peak traffic to identify bottlenecks before users do.”

## Flow diagram

- Worker thread

```

        ┌───────────────┐
        │   Client      │
        └───────┬───────┘
                │ HTTP
                ▼
        ┌─────────────────┐
        │ Node.js Process │
        │ (Main Thread)   │
        │ Event Loop      │
        └───────┬─────────┘
                │ postMessage()
                ▼
        ┌─────────────────┐
        │ Worker Thread   │
        │ (Same Process) │
        │ Separate V8    │
        └───────┬─────────┘
                │ message back (parentPort.on("message", (data) => {}))
                | send using parentPort.postMessage({})
                ▼
        ┌─────────────────┐
        │ Main Thread     │
        └─────────────────┘
```


- Same process
- Separate JS thread
- Can share memory (SharedArrayBuffer)
- Best for CPU-bound logic


## Cluster

```

                 ┌────────────┐
                 │   Client   │
                 └─────┬──────┘
                       │ HTTP
                       ▼
               ┌────────────────┐
               │   Master       │
               │   Process      │
               │ (Load Balancer)│
               └─────┬──────────┘
         ┌───────────┼───────────┐
         ▼           ▼           ▼
┌────────────┐ ┌────────────┐ ┌────────────┐
│ Worker #1  │ │ Worker #2  │ │ Worker #3  │
│ Event Loop │ │ Event Loop │ │ Event Loop │
└────────────┘ └────────────┘ └────────────┘

```

- Multiple processes
- Each has own event loop & memory
- OS-level isolation
- Best for I/O-heavy apps

## Child process
- Run external programs or isolate risky tasks

```
        ┌───────────────┐
        │ Node.js App   │
        │ (Parent)     │
        └───────┬───────┘
                │ spawn / fork
                ▼
        ┌─────────────────┐
        │ Child Process   │
        │ (OS Process)   │
        │ Own Memory     │
        └───────┬─────────┘
                │ IPC / stdio
                ▼
        ┌─────────────────┐
        │ Parent Process  │
        └─────────────────┘

```

# 20 HIGH-IMPACT INTERVIEW QUESTIONS

## How to avoid payment twice
`Same request → same result → executed only once`

- Idempotency key add while make api calls and check if

- From frontend send in header

`
axios.post(
  "/api/pay",
  { amount: 500 },
  {
    headers: {
      "Idempotency-Key": idempotencyKey
    }
  }
);

`

- In backedn idepotency key must be unqiue

`
{
  idempotencyKey: String, // UNIQUE
  status: "processing" | "success" | "failed",
  amount: Number,
  response: Object,
  createdAt: Date
}


`

”

🔥 20 HIGH-IMPACT INTERVIEW QUESTIONS

How does Node handle concurrency?

What blocks event loop?

Cluster vs worker threads?

How to handle CPU-heavy tasks?

Express middleware flow?

Error handling in async routes?

Prevent memory leaks?

Scale Node horizontally?

Handle backpressure?

Graceful shutdown?

Why Fastify over Express?

What is event loop lag?

What happens if DB is slow?

How retries cause outages?

Circuit breaker pattern?

How Node handles GC?

How to secure Express?

JWT vs sessions?

API versioning?

Production debugging steps?
