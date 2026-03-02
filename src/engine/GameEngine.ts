import { RunResult } from './types';

let worker: Worker | null = null;
let workerReady = false;
const pendingCallbacks = new Map<string, (result: RunResult) => void>();

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('./worker/tsRunner.worker.ts', import.meta.url), {
      type: 'module',
    });
    worker.onmessage = (event: MessageEvent<RunResult & { id: string; type?: string }>) => {
      const { id, ...result } = event.data;

      // Handle warmup ack
      if ((result as any).type === 'ready') {
        workerReady = true;
        return;
      }

      const cb = pendingCallbacks.get(id);
      if (cb) {
        pendingCallbacks.delete(id);
        cb(result);
      }
    };
    worker.onerror = (err) => {
      console.error('[GameEngine] Worker error:', err);
    };
  }
  return worker;
}

/** Call this early (e.g. on app mount) to pre-warm esbuild-wasm */
export function warmupWorker(): void {
  getWorker(); // triggers worker creation + wasm init
}

export function runCode(code: string): Promise<RunResult> {
  // Give extra time on first run if worker isn't warm yet
  const timeout = workerReady ? 10_000 : 30_000;

  return new Promise((resolve) => {
    const id = `run-${Date.now()}-${Math.random()}`;
    pendingCallbacks.set(id, resolve);
    getWorker().postMessage({ code, id });

    setTimeout(() => {
      if (pendingCallbacks.has(id)) {
        pendingCallbacks.delete(id);
        resolve({
          success: false,
          output: [],
          error: workerReady
            ? 'Execution timed out (10s). Check for infinite loops.'
            : 'Timeout loading the TypeScript engine. Check your internet connection.',
        });
      }
    }, timeout);
  });
}
