## File streams and backpressure

### What is backpressure?
- When a readable stream pushes data faster than a writable stream can consume, the writable signals backpressure by returning `false` from `write()`.
- Proper handling pauses the readable until the writable emits `drain`, preventing memory bloat and dropped data.

### Minimal example (copy with backpressure)
```javascript
import fs from 'fs';

const readable = fs.createReadStream('10mb.pdf', {
  highWaterMark: 64 * 1024 // 64KB chunks
});

const writable = fs.createWriteStream('copy.txt');

readable.on('data', (chunk) => {
  const canWrite = writable.write(chunk);
  if (!canWrite) {
    console.log('Backpressure detected. Pausing readable...');
    readable.pause();
  }
});

writable.on('drain', () => {
  console.log('Writable drained. Resuming readable...');
  readable.resume();
});

readable.on('end', () => {
  writable.end();
  console.log('Copy complete.');
});

writable.on('finish', () => console.log('Writable closed.'));
writable.on('error', (err) => console.error('Writable error:', err));
readable.on('error', (err) => console.error('Readable error:', err));
```

### Other useful `fs` stream options
- `encoding`: Set text encoding; omit for binary.
- `highWaterMark`: Chunk size; adjust to tune throughput vs. memory.
- `flags`: E.g., `'a'` to append, `'w'` to overwrite.
- `mode`: File permissions on create (e.g., `0o644`).

### Common `fs` operations (quick reference)
- `fs.promises.readFile(path, encoding)`: Read entire file as string/buffer.
- `fs.promises.writeFile(path, data, options)`: Overwrite or create a file.
- `fs.promises.appendFile(path, data)`: Append to a file.
- `fs.promises.stat(path)`: Inspect file metadata.
- `fs.createReadStream(path, options)`: Stream reads with backpressure support.
- `fs.createWriteStream(path, options)`: Stream writes with backpressure support.

### Tips
- Always handle `error` on both readable and writable streams.
- Call `writable.end()` when the readable finishes to flush and close the writable.
- Prefer `fs/promises` for simple one-shot reads/writes; use streams for large files.


=== 

## ⭐ 1. What is highWaterMark and how does it relate to backpressure?

- `highWaterMark` defines how much data a stream can hold in memory before stopping the flow.

```

Readable default: 64KB
Writable default: 16KB

```

ex 

```

const fs = require("fs");

const stream = fs.createReadStream("bigfile.txt", {
  highWaterMark: 1024 * 1024 // 1MB buffer per chunk
});


```


Interview Insight

Bigger highWaterMark = fewer I/O calls, more RAM usage.
Smaller = more pressure, more chunking.

Trick question:
“What happens if your readable has a higher highWaterMark than writable?”
Answer: Backpressure increases, write() returns false more often.