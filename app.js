import fs from 'fs';

const readable = fs.createReadStream("10mb.pdf", {
  highWaterMark: 1024 * 64 // 64KB chunks
});

const writable = fs.createWriteStream("copy.txt");

readable.on("data", (chunk) => {
  const canWrite = writable.write(chunk);

  if (!canWrite) {
    console.log("Backpressure detected! Pausing...");
    readable.pause();
  }
});

writable.on("drain", () => {
  console.log("Writable drained. Resuming...");
  readable.resume();
});
