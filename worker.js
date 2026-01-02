import { parentPort } from "worker_threads";

parentPort.on("message", (duration) => {
  const start = Date.now();

  // CPU-heavy / blocking logic INSIDE worker
  while (Date.now() - start < duration) {
    // heavy computation
  }

  parentPort.postMessage({
    success: true,
    message: `Worker finished after ${duration / 1000} seconds`,
  });
});
