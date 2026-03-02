import { initialize, transform } from 'esbuild-wasm';

let initialized = false;

async function ensureInitialized() {
  if (!initialized) {
    await initialize({
      wasmURL: '/esbuild.wasm',
      worker: false,
    });
    initialized = true;
    // Signal the main thread that we're ready
    self.postMessage({ type: 'ready' });
  }
}

// Pre-warm immediately on worker creation
ensureInitialized().catch((err) => {
  console.error('[tsRunner.worker] Failed to initialize esbuild-wasm:', err);
});

self.onmessage = async (event: MessageEvent<{ code: string; id: string }>) => {
  const { code, id } = event.data;
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

    // Create sandboxed eval with captured console.log
    const sandboxCode = `
      (function(console) {
        ${jsCode}
      })({
        log: (...args) => __captureLog(...args),
        warn: (...args) => __captureLog('[warn]', ...args),
        error: (...args) => __captureLog('[error]', ...args),
      });
    `;

    // Evaluate with captured output
    const logCapture = (global: Record<string, unknown>) => {
      global.__captureLog = (...args: unknown[]) => {
        output.push(args.map(String).join(' '));
      };
    };

    // eslint-disable-next-line no-new-func
    const fn = new Function('__captureLog', sandboxCode);
    const captureLog = (...args: unknown[]) => {
      output.push(args.map(String).join(' '));
    };
    void logCapture; // suppress unused warning
    fn(captureLog);

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
