Node.js uses Libuv which manages an event loop containing 6 phases.

Here are the phases + what happens in each, explained using a real-world analogy.

Event Loop Phases

```
┌───────────────────────────┐
│        timers             │  setTimeout, setInterval
└───────┬───────────────────┘
        ↓
┌───────────────────────────┐
│     pending callbacks     │  I/O errors, TCP errors
└───────┬───────────────────┘
        ↓
┌───────────────────────────┐
│     idle / prepare        │  (internal only)
└───────┬───────────────────┘
        ↓
┌───────────────────────────┐
│         poll              │  I/O events, fs, network
│   → may block here        │
└───────┬───────────────────┘
        ↓
┌───────────────────────────┐
│         check             │  setImmediate()
└───────┬───────────────────┘
        ↓
┌───────────────────────────┐
│     close callbacks       │  socket.on('close')
└───────────────────────────┘

Microtasks run *between every phase*:
 - process.nextTick()
 - Promises




```

## Phase 1: Timers

Handles:

1 setTimeout
2 setInterval

➡️ Example:
You schedule a reminder to run later.

## Phase 2: Pending Callbacks

Handles:

I/O-related callbacks that couldn’t run earlier
(e.g., TCP errors, failed requests)

➡️ Example: A network request failed; Node handles the error callback.

## Phase 3: Idle/Prepare

Internal to Node.
You don’t write code for this.

## Phase 4: Poll Phase (MOST IMPORTANT)

This is where I/O happens:
reading files
database queries
HTTP network responses

➡️ Example:
You read users.json or fetch data from MongoDB.
The poll phase waits for I/O to finish.

## Phase 5: Check Phase

Handles:

setImmediate()

➡️ Example:
Execution after I/O, but before timers run again.

## Phase 6: Close Callbacks

Handles:

```
socket.on('close')
stream.destroy()

```

➡️ Example:
A client disconnects; cleanup happens here.



2️⃣ Microtasks vs Macrotasks

Node separates tasks into two categories:
