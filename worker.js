import { parentPort,workerData } from "worker_threads";

function fibonacci(n) {
  return n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(workerData.number);


parentPort.postMessage(result)
