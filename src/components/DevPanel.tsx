import { useState } from 'react';
import { Level } from '../engine/types';

interface DevPanelProps {
  level: Level;
  stampedCount: number;
  stampsRequired: number;
}

export default function DevPanel({ level, stampedCount, stampsRequired }: DevPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle button — fixed bottom-left, semi-transparent */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Dev Panel (toggle)"
        style={{
          position: 'fixed', bottom: 16, left: 16, zIndex: 9999,
          background: open ? '#7c3aed' : '#21262d',
          border: '1px solid #7c3aed44',
          borderRadius: 8, padding: '5px 10px', fontSize: 11,
          color: open ? 'white' : '#8b949e',
          cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
          opacity: 0.7,
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
      >
        🛠️ DEV
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 52, left: 16, zIndex: 9998,
          width: 380, maxHeight: '70vh', overflowY: 'auto',
          background: '#0d1117ee',
          border: '1px solid #7c3aed',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 12,
          color: '#e6edf3',
          padding: 16,
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 16 }}>🛠️</span>
            <span style={{ fontWeight: 700, color: '#7c3aed', fontSize: 13 }}>DEV PANEL</span>
            <span style={{ fontSize: 10, color: '#8b949e', marginLeft: 'auto' }}>solo vos ves esto</span>
          </div>

          {/* Level identity */}
          <Row label="ID" value={level.id} color="#8b949e" />
          <Row label="Fase" value={`Phase ${level.phase}`} color="#a78bfa" />
          <Row label="Concepto" value={level.concept} color="#06b6d4" />

          <Divider />

          {/* Objective */}
          <div style={{ marginBottom: 10 }}>
            <Label>🎯 Objetivo del ejercicio</Label>
            <div style={{
              background: '#161b22', borderRadius: 6, padding: '8px 10px',
              color: '#e6edf3', lineHeight: 1.5, marginTop: 4,
            }}>
              {level.objective}
            </div>
          </div>

          {/* Hint */}
          <div style={{ marginBottom: 10 }}>
            <Label>💡 Hint para el alumno</Label>
            <div style={{
              background: '#161b22', borderRadius: 6, padding: '8px 10px',
              color: '#8b949e', lineHeight: 1.5, marginTop: 4, fontStyle: 'italic',
            }}>
              "{level.hint}"
            </div>
          </div>

          <Divider />

          {/* Solution */}
          <div style={{ marginBottom: 10 }}>
            <Label>✅ Solución esperada</Label>
            <pre style={{
              background: '#161b22', borderRadius: 6, padding: '8px 10px',
              color: '#22c55e', margin: '4px 0 0', overflowX: 'auto', fontSize: 11,
            }}>
              {level.solution}
            </pre>
          </div>

          {/* Validation */}
          <div style={{ marginBottom: 10 }}>
            <Label>🔍 Criterio de validación</Label>
            <pre style={{
              background: '#161b22', borderRadius: 6, padding: '8px 10px',
              color: '#f59e0b', margin: '4px 0 0', overflowX: 'auto', fontSize: 10,
              whiteSpace: 'pre-wrap',
            }}>
              {level.validate.toString()}
            </pre>
          </div>

          {/* Stamps */}
          {stampsRequired > 0 && (
            <>
              <Divider />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Label>📦 Stamps</Label>
                <span style={{ color: stampedCount >= stampsRequired ? '#22c55e' : '#f59e0b' }}>
                  {stampedCount} / {stampsRequired}
                  {stampedCount >= stampsRequired ? ' ✅ COMPLETO' : ''}
                </span>
              </div>
            </>
          )}

          <Divider />

          {/* Review section — Juan's notes */}
          <div style={{ marginBottom: 4 }}>
            <Label>📝 ¿El ejercicio es el adecuado?</Label>
            <div style={{ color: '#8b949e', marginTop: 4, fontSize: 11, lineHeight: 1.6 }}>
              Concepto enseñado: <strong style={{ color: '#e6edf3' }}>{level.concept}</strong><br />
              Mecánica: {stampsRequired > 0 ? `Stampar ${stampsRequired} cajas` : 'Deploy único'}<br />
              Mentor: {level.mentor}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
      <span style={{ color: '#8b949e', minWidth: 70 }}>{label}:</span>
      <span style={{ color: color ?? '#e6edf3', fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ borderTop: '1px solid #21262d', margin: '10px 0' }} />;
}
