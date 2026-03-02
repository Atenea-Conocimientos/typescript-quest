import { initialize, transform } from 'esbuild-wasm';

// Store the init promise so initialize() is only called once
let initPromise: Promise<void> | null = null;

function ensureInitialized(): Promise<void> {
  if (!initPromise) {
    initPromise = initialize({
      wasmURL: '/esbuild.wasm',
      worker: false,
    }).then(() => {
      // Signal main thread that we're ready
      self.postMessage({ type: 'ready' });
    }).catch((err) => {
      // Reset so we can retry on next call
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
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

    const fn = new Function('__captureLog', sandboxCode);
    const captureLog = (...args: unknown[]) => {
      output.push(args.map(String).join(' '));
    };
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
