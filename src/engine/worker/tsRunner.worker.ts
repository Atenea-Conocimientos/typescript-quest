// Type-only import for IDE support; runtime import uses the ESM browser build
import type { initialize as InitFn, transform as TransformFn } from 'esbuild-wasm';
// Use the ESM browser build directly — the default entry is CJS and breaks in Vite workers
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { initialize as _init, transform as _transform } from 'esbuild-wasm/esm/browser.min.js';

const initialize = _init as typeof InitFn;
const transform = _transform as typeof TransformFn;

// Store the init promise so initialize() is only called once
let initPromise: Promise<void> | null = null;

function ensureInitialized(): Promise<void> {
  if (!initPromise) {
    console.log('[tsRunner.worker] Calling esbuild initialize(), wasmURL=/esbuild.wasm');
    initPromise = initialize({
      wasmURL: '/esbuild.wasm',
      worker: false,
    }).then(() => {
      console.log('[tsRunner.worker] ✅ initialize() resolved');
      // Signal main thread that we're ready
      self.postMessage({ type: 'ready' });
    }).catch((err: unknown) => {
      console.error('[tsRunner.worker] ❌ initialize() rejected:', err);
      // Reset so we can retry on next call
      initPromise = null;
      throw err;
    });
  }
  return initPromise!;
}

// Pre-warm immediately on worker creation
console.log('[tsRunner.worker] Starting initialization...');
ensureInitialized()
  .then(() => console.log('[tsRunner.worker] ✅ esbuild-wasm initialized successfully'))
  .catch((err) => console.error('[tsRunner.worker] ❌ Failed to initialize esbuild-wasm:', err));

self.onmessage = async (event: MessageEvent<{ code: string; id: string }>) => {
  const { code, id } = event.data;
  console.log('[tsRunner.worker] Received run request, id=', id);
  const output: string[] = [];
  const startTime = Date.now();

  try {
    await ensureInitialized();

    // Compile TypeScript to JavaScript (throws on syntax error)
    const result = await transform(code, {
      loader: 'ts',
      target: 'es2020',
      format: 'esm',
    });

    const jsCode = result.code;

    // Create sandboxed eval with captured console.log.
    // Uses AsyncFunction so async/await and top-level `await` work correctly
    // (e.g. `await turnoFinal()` at the top level of user code).
    const sandboxCode = `
      return (async function(console) {
        ${jsCode}
      })({
        log: (...args) => __captureLog(...args),
        warn: (...args) => __captureLog('[warn]', ...args),
        error: (...args) => __captureLog('[error]', ...args),
      });
    `;

    // AsyncFunction constructor supports async/await inside the body
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor as FunctionConstructor;
    const fn = new AsyncFunction('__captureLog', sandboxCode);
    const captureLog = (...args: unknown[]) => {
      output.push(args.map(String).join(' '));
    };
    await fn(captureLog);

    const duration = Date.now() - startTime;
    self.postMessage({ id, success: true, output, duration });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    self.postMessage({
      id,
      success: false,
      output,
      error: errorMessage,
      duration: Date.now() - startTime,
    });
  }
};
