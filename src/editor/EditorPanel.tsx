import { useState } from 'react';
import CodeEditor from './CodeEditor';
import { runCode } from '../engine/GameEngine';
import { RunResult } from '../engine/types';

interface EditorPanelProps {
  starterCode: string;
  onResult: (result: RunResult, code: string) => void;
}

export default function EditorPanel({ starterCode, onResult }: EditorPanelProps) {
  const [code, setCode] = useState(starterCode);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);

  async function handleDeploy() {
    setRunning(true);
    setResult(null);
    const r = await runCode(code);
    setResult(r);
    onResult(r, code);
    setRunning(false);
  }

  function handleReset() {
    setCode(starterCode);
    setResult(null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
        background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'monospace', flex: 1 }}>
          robot.ts
        </span>
        <button
          onClick={handleReset}
          style={{
            padding: '5px 12px', fontSize: 12, background: 'transparent',
            border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-secondary)',
          }}
        >
          Reset
        </button>
        <button
          onClick={handleDeploy}
          disabled={running}
          style={{
            padding: '5px 16px', fontSize: 12, fontWeight: 600,
            background: running ? 'var(--bg-tertiary)' : 'var(--purple)',
            border: 'none', borderRadius: 6, color: 'white', minWidth: 80,
          }}
        >
          {running ? '⚙️ Running...' : '🚀 Deploy'}
        </button>
      </div>

      {/* Editor */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <CodeEditor value={code} onChange={setCode} />
      </div>

      {/* Output Panel */}
      <div style={{
        height: 160, background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          padding: '6px 12px', fontSize: 11, color: 'var(--text-secondary)',
          borderBottom: '1px solid var(--border)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1,
        }}>
          Console Output
        </div>
        <div style={{
          flex: 1, overflowY: 'auto', padding: '8px 12px',
          fontFamily: 'monospace', fontSize: 13,
        }}>
          {!result && (
            <span style={{ color: 'var(--text-secondary)' }}>Click "Deploy" to run your code...</span>
          )}
          {result?.error && (
            <div style={{ color: 'var(--red)' }}>
              ❌ {result.error}
            </div>
          )}
          {result?.output.map((line, i) => (
            <div key={i} style={{ color: 'var(--cyan-light)', marginBottom: 2 }}>
              &gt; {line}
            </div>
          ))}
          {result && !result.error && result.output.length === 0 && (
            <div style={{ color: 'var(--text-secondary)' }}>(no output)</div>
          )}
        </div>
      </div>
    </div>
  );
}
