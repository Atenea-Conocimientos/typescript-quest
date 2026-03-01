import { RunResult } from './types';

let worker: Worker | null = null;
const pendingCallbacks = new Map<string, (result: RunResult) => void>();

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('./worker/tsRunner.worker.ts', import.meta.url), {
      type: 'module',
    });
    worker.onmessage = (event: MessageEvent<RunResult & { id: string }>) => {
      const { id, ...result } = event.data;
      const cb = pendingCallbacks.get(id);
      if (cb) {
        pendingCallbacks.delete(id);
        cb(result);
      }
    };
  }
  return worker;
}

export function runCode(code: string): Promise<RunResult> {
  return new Promise((resolve) => {
    const id = `run-${Date.now()}-${Math.random()}`;
    pendingCallbacks.set(id, resolve);
    getWorker().postMessage({ code, id });

    // Timeout after 10 seconds
    setTimeout(() => {
      if (pendingCallbacks.has(id)) {
        pendingCallbacks.delete(id);
        resolve({
          success: false,
          output: [],
          error: 'Execution timed out (10s). Check for infinite loops.',
        });
      }
    }, 10000);
  });
}
