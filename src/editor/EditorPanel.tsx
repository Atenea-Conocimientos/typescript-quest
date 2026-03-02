import { useState } from 'react';
import CodeEditor from './CodeEditor';
import { runCode } from '../engine/GameEngine';
import { RunResult } from '../engine/types';

interface EditorPanelProps {
  starterCode: string;
  onResult: (result: RunResult, code: string) => void;
  onCodeChange?: (code: string) => void;
  codeHints?: string[];
}

export default function EditorPanel({
  starterCode,
  onResult,
  onCodeChange,
  codeHints,
}: EditorPanelProps) {
  const [code,           setCode]           = useState(starterCode);
  const [running,        setRunning]        = useState(false);
  const [result,         setResult]         = useState<RunResult | null>(null);
  const [hintsRevealed,  setHintsRevealed]  = useState(0);
  const [hintsOpen,      setHintsOpen]      = useState(false);

  const totalHints  = codeHints?.length ?? 0;
  const hasHints    = totalHints > 0;
  const allRevealed = hintsRevealed >= totalHints;

  function handleCodeChange(newCode: string) {
    setCode(newCode);
    onCodeChange?.(newCode);
  }

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
    onCodeChange?.(starterCode);
    setResult(null);
  }

  function handleHintClick() {
    if (!hasHints) return;
    if (!hintsOpen) setHintsOpen(true);
    if (!allRevealed) setHintsRevealed(prev => prev + 1);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>

      {/* ── Toolbar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
        background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'monospace', flex: 1 }}>
          robot.ts
        </span>

        {/* Hint button — only shown if level has codeHints */}
        {hasHints && (
          <button
            onClick={handleHintClick}
            title={allRevealed ? 'Todas las pistas reveladas' : `Mostrar próxima pista (${hintsRevealed}/${totalHints})`}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 10px', fontSize: 11, fontWeight: 700,
              background: allRevealed ? 'var(--bg-tertiary)' : '#7c3aed',
              border: `1px solid ${allRevealed ? 'var(--border)' : '#a78bfa'}`,
              borderRadius: 6, color: allRevealed ? 'var(--text-secondary)' : 'white',
              cursor: allRevealed ? 'default' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: allRevealed ? 'none' : '0 0 8px #7c3aed50',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            <span style={{ fontSize: 13 }}>💡</span>
            <span>
              {allRevealed ? `${totalHints}/${totalHints}` : `? ${hintsRevealed}/${totalHints}`}
            </span>
          </button>
        )}

        <button
          onClick={handleReset}
          style={{
            padding: '5px 12px', fontSize: 12, background: 'transparent',
            border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          Reiniciar
        </button>
        <button
          onClick={handleDeploy}
          disabled={running}
          style={{
            padding: '5px 16px', fontSize: 12, fontWeight: 600,
            background: running ? 'var(--bg-tertiary)' : 'var(--purple)',
            border: 'none', borderRadius: 6, color: 'white', minWidth: 80,
            cursor: running ? 'default' : 'pointer',
          }}
        >
          {running ? '⚙️ Ejecutando...' : '🚀 Deploy'}
        </button>
      </div>

      {/* ── Editor ── */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <CodeEditor value={code} onChange={handleCodeChange} />
      </div>

      {/* ── Hint panel (collapsible, slides in above console) ── */}
      {hasHints && hintsOpen && (
        <div style={{
          background: '#0d1117', borderTop: '2px solid #7c3aed',
          borderBottom: '1px solid var(--border)',
          maxHeight: 160, overflow: 'hidden',
        }}>
          {/* Panel header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '6px 12px', borderBottom: '1px solid #21262d',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: '#a78bfa', fontFamily: 'monospace', fontWeight: 700 }}>
                💡 Esqueleto
              </span>
              <span style={{ fontSize: 10, color: '#8b949e', fontFamily: 'monospace' }}>
                {hintsRevealed}/{totalHints} líneas reveladas
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {!allRevealed && (
                <button
                  onClick={handleHintClick}
                  style={{
                    padding: '3px 10px', fontSize: 11, fontWeight: 700,
                    background: '#7c3aed', border: '1px solid #a78bfa',
                    borderRadius: 5, color: 'white', cursor: 'pointer',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  Siguiente →
                </button>
              )}
              <button
                onClick={() => setHintsOpen(false)}
                style={{
                  padding: '3px 8px', fontSize: 11,
                  background: 'transparent', border: '1px solid #30363d',
                  borderRadius: 5, color: '#8b949e', cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Revealed hint lines */}
          <div style={{
            padding: '8px 14px', overflowY: 'auto', maxHeight: 100,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
            lineHeight: 1.7,
          }}>
            {codeHints!.slice(0, hintsRevealed).map((line, i) => (
              <div
                key={i}
                style={{
                  color: i === hintsRevealed - 1 ? '#e6edf3' : '#6e7681',
                  background: i === hintsRevealed - 1 ? '#7c3aed15' : 'transparent',
                  padding: '0 4px', borderRadius: 3,
                  borderLeft: i === hintsRevealed - 1 ? '2px solid #7c3aed' : '2px solid transparent',
                  transition: 'all 0.3s',
                  animation: i === hintsRevealed - 1 ? 'hintFade 0.3s ease' : 'none',
                  whiteSpace: 'pre',
                }}
              >
                {line === '' ? '\u00a0' : line}
              </div>
            ))}
            {!allRevealed && hintsRevealed > 0 && (
              <div style={{
                color: '#30363d', fontStyle: 'italic', fontSize: 11,
                marginTop: 2, paddingLeft: 6,
              }}>
                — {totalHints - hintsRevealed} líneas más disponibles…
              </div>
            )}
            {allRevealed && (
              <div style={{
                color: '#22c55e', fontSize: 11, marginTop: 4,
                fontFamily: 'monospace', paddingLeft: 4,
              }}>
                ✅ Esqueleto completo revelado
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Output Panel ── */}
      <div style={{
        height: 140, background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          padding: '6px 12px', fontSize: 11, color: 'var(--text-secondary)',
          borderBottom: '1px solid var(--border)', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: 1,
        }}>
          Consola de Salida
        </div>
        <div style={{
          flex: 1, overflowY: 'auto', padding: '8px 12px',
          fontFamily: 'monospace', fontSize: 13,
        }}>
          {!result && (
            <span style={{ color: 'var(--text-secondary)' }}>
              Hacé click en "Deploy" para ejecutar tu código…
            </span>
          )}
          {result?.error && (
            <div style={{ color: 'var(--red)' }}>❌ {result.error}</div>
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

      <style>{`
        @keyframes hintFade {
          from { opacity: 0; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
