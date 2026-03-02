import { useState, useEffect } from 'react';
import { LevelMechanic } from '../engine/types';
import {
  parseSorterResult,
  parseEnergySteps,
  parseGridSteps,
  parsePanelStates,
  parseDetectorResults,
} from '../engine/outputParser';

// ─── Colors ────────────────────────────────────────────────────────────────────
const C = {
  bg:      '#0d1117', bgSec:   '#161b22', bgTer:   '#21262d',
  border:  '#30363d', purple:  '#7c3aed', purpleL: '#a78bfa',
  cyan:    '#06b6d4', cyanL:   '#67e8f9', green:   '#22c55e',
  red:     '#ef4444', amber:   '#f59e0b', text:    '#e6edf3',
  textSec: '#8b949e',
};

// ─── Shared types ──────────────────────────────────────────────────────────────
interface ActivateResult { output: string[]; success: boolean }
interface MechanicProps {
  stampsRequired: number;
  stampedCount:   number;
  onActivate: () => Promise<ActivateResult>;
}

// ─── Shared components ─────────────────────────────────────────────────────────
function StampDots({ required, count }: { required: number; count: number }) {
  // Only show dots when there are multiple stamps to collect (not for single-success mechanics)
  if (required <= 1) return null;
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
      {Array.from({ length: required }, (_, i) => (
        <div key={i} style={{
          width: 11, height: 11, borderRadius: '50%',
          background: i < count ? C.green : C.bgTer,
          border: `1px solid ${i < count ? C.green : C.border}`,
          boxShadow: i < count ? `0 0 5px ${C.green}80` : 'none',
          transition: 'all 0.3s',
        }} />
      ))}
    </div>
  );
}

function ActionBtn({ onClick, loading, label }: { onClick: () => void; loading: boolean; label: string }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      padding: '10px 24px', fontSize: 13, fontWeight: 700,
      background: loading ? C.bgTer : `linear-gradient(135deg, ${C.purple}, #5b21b6)`,
      border: `2px solid ${loading ? C.border : C.purpleL}`,
      borderRadius: 10, color: 'white', cursor: loading ? 'default' : 'pointer',
      boxShadow: !loading ? `0 0 14px ${C.purple}50` : 'none',
      transition: 'all 0.2s', fontFamily: 'JetBrains Mono, monospace',
    }}>
      {loading ? '⚙️ Ejecutando...' : label}
    </button>
  );
}

function FeedbackLine({ success }: { success: boolean | null }) {
  if (success === null) return null;
  return (
    <div style={{ fontSize: 12, color: success ? C.green : C.red, fontFamily: 'monospace' }}>
      {success ? '✅ ¡Correcto! Producción registrada.' : '❌ Código incorrecto — revisá y volvé a intentar'}
    </div>
  );
}

function MechanicWrapper({ label, children, bottom }: {
  label: string; children: React.ReactNode; bottom: React.ReactNode;
}) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: C.bg, padding: '14px 16px', boxSizing: 'border-box', gap: 12 }}>
      <div style={{ fontSize: 10, color: C.textSec, fontFamily: 'monospace',
        textAlign: 'center', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        {bottom}
      </div>
    </div>
  );
}

// ─── TANKS (p1-l2: let vs const) ──────────────────────────────────────────────
function TanksMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const [loading, setLoading] = useState(false);
  const [letVal, setLetVal]   = useState<string | null>(null);
  const [cstVal, setCstVal]   = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  async function run() {
    setLoading(true);
    const { output, success: ok } = await onActivate();
    setSuccess(ok);
    if (ok && output[0]) {
      const line = output[0];
      const parts = line.split(':');
      setCstVal((parts[0] ?? '').trim());
      const num = line.match(/(\d+)\s*pernos/);
      setLetVal(num ? num[1] : '5');
    }
    setLoading(false);
  }

  const letFill = letVal ? Math.min(100, (parseInt(letVal) / 10) * 100) : 0;
  const cstFill = cstVal ? 75 : 0;

  return (
    <MechanicWrapper label="🏭 Depósito de Variables — let vs const" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="⚡ LLENAR DEPÓSITO" />
      </div>
    </>}>
      <div style={{ height: '100%', display: 'flex', gap: 40, alignItems: 'flex-end',
        justifyContent: 'center', paddingBottom: 20 }}>
        {/* LET tank */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <code style={{ fontSize: 13, color: C.cyanL, fontWeight: 700 }}>let pernos</code>
          <div style={{ fontSize: 28, fontWeight: 900, color: letVal ? C.cyanL : C.textSec,
            fontFamily: 'JetBrains Mono, monospace', transition: 'color 0.4s' }}>
            {letVal ?? '???'}
          </div>
          <div style={{ width: 80, height: 140, border: `3px solid ${C.cyan}`, borderRadius: '8px 8px 4px 4px',
            background: C.bgSec, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
              height: `${letFill}%`, background: `linear-gradient(to top, ${C.cyan}bb, ${C.cyanL}44)`,
              transition: 'height 0.8s ease' }} />
          </div>
          <div style={{ fontSize: 10, color: C.cyan, fontFamily: 'monospace' }}>🔓 puede cambiar</div>
        </div>
        {/* CONST tank */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <code style={{ fontSize: 13, color: C.purpleL, fontWeight: 700 }}>const fabrica</code>
          <div style={{ fontSize: 16, fontWeight: 700, color: cstVal ? C.purpleL : C.textSec,
            fontFamily: 'JetBrains Mono, monospace', transition: 'color 0.4s',
            maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {cstVal ? `"${cstVal}"` : '???'}
          </div>
          <div style={{ width: 80, height: 140, border: `3px solid ${C.purple}`, borderRadius: '8px 8px 4px 4px',
            background: C.bgSec, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
              height: `${cstFill}%`, background: `linear-gradient(to top, ${C.purple}bb, ${C.purpleL}44)`,
              transition: 'height 0.8s ease' }} />
            <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
              fontSize: 26, opacity: 0.7 }}>🔒</div>
          </div>
          <div style={{ fontSize: 10, color: C.purpleL, fontFamily: 'monospace' }}>🔒 valor fijo</div>
        </div>
      </div>
    </MechanicWrapper>
  );
}

// ─── ASSEMBLER (p1-l3: template literals) ─────────────────────────────────────
function AssemblerMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const [loading, setLoading]       = useState(false);
  const [assembled, setAssembled]   = useState<string | null>(null);
  const [merging, setMerging]       = useState(false);
  const [done, setDone]             = useState(false);
  const [nombreVal, setNombreVal]   = useState<string | null>(null);
  const [velocidadVal, setVelocidadVal] = useState<string | null>(null);
  const [success, setSuccess]       = useState<boolean | null>(null);

  async function run() {
    setLoading(true);
    setAssembled(null); setMerging(false); setDone(false);
    setNombreVal(null); setVelocidadVal(null);
    const { output, success: ok } = await onActivate();
    setSuccess(ok);
    if (ok && output[0]) {
      const line = output[0];
      // Parse "Robot: Olympus | Velocidad: 100" → extract nombre and velocidad
      const nombreMatch    = line.match(/Robot:\s*([^|]+)\s*\|/);
      const velocidadMatch = line.match(/Velocidad:\s*(.+)$/);
      const parsedNombre    = nombreMatch    ? nombreMatch[1].trim()    : '???';
      const parsedVelocidad = velocidadMatch ? velocidadMatch[1].trim() : '???';
      setNombreVal(parsedNombre);
      setVelocidadVal(parsedVelocidad);
      // Brief pause to show the pieces, then animate merge
      setTimeout(() => setMerging(true), 400);
      setTimeout(() => { setAssembled(line); setMerging(false); setDone(true); }, 1100);
    }
    setLoading(false);
  }

  return (
    <MechanicWrapper label="🔩 Ensamblador de Etiquetas — Template Literals" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="🔩 ENSAMBLAR ETIQUETA" />
      </div>
    </>}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 18 }}>

        {/* Piece A (nombre) + Piece B (velocidad) → animate toward center */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%',
          justifyContent: 'center', position: 'relative' }}>
          {/* Pieza A */}
          <div style={{ padding: '10px 16px', border: `2px solid ${nombreVal ? C.cyan : C.border}`,
            borderRadius: 8, background: C.bgSec, fontFamily: 'monospace',
            color: nombreVal ? C.cyanL : C.textSec,
            transition: 'all 0.4s',
            transform: merging ? 'translateX(48px) scale(0.9)' : 'translateX(0) scale(1)',
            opacity: done ? 0 : 1 }}>
            <div style={{ fontSize: 9, color: C.textSec, marginBottom: 3 }}>const nombre</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>
              {nombreVal ? `"${nombreVal}"` : '???'}
            </div>
          </div>
          {/* Operador + */}
          <div style={{ fontSize: 20, color: C.textSec,
            opacity: merging || done ? 0 : 1, transition: 'opacity 0.2s', flexShrink: 0 }}>+</div>
          {/* Pieza B */}
          <div style={{ padding: '10px 16px', border: `2px solid ${velocidadVal ? C.amber : C.border}`,
            borderRadius: 8, background: C.bgSec, fontFamily: 'monospace',
            color: velocidadVal ? C.amber : C.textSec,
            transition: 'all 0.4s',
            transform: merging ? 'translateX(-48px) scale(0.9)' : 'translateX(0) scale(1)',
            opacity: done ? 0 : 1 }}>
            <div style={{ fontSize: 9, color: C.textSec, marginBottom: 3 }}>const velocidad</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>
              {velocidadVal ?? '???'}
            </div>
          </div>
        </div>

        {/* Arrow down */}
        <div style={{ fontSize: 22, color: assembled ? C.green : C.textSec,
          transition: 'color 0.5s', marginTop: -4 }}>⬇️</div>

        {/* Result */}
        <div style={{ padding: '14px 24px',
          border: `2px solid ${assembled ? C.green : C.border}`,
          borderRadius: 10, background: assembled ? `${C.green}15` : C.bgSec,
          fontFamily: 'monospace', fontSize: 13, color: assembled ? C.green : C.textSec,
          minWidth: 280, textAlign: 'center', transition: 'all 0.5s',
          opacity: assembled ? 1 : 0.45,
          transform: assembled ? 'scale(1.03)' : 'scale(0.97)',
          boxShadow: assembled ? `0 0 18px ${C.green}30` : 'none' }}>
          {assembled ? (
            <>
              <div style={{ fontSize: 9, color: C.textSec, marginBottom: 6 }}>✅ ETIQUETA ENSAMBLADA</div>
              <span style={{ color: C.green }}>"{assembled}"</span>
            </>
          ) : (
            <span style={{ opacity: 0.6 }}>
              {merging ? '⚙️ Ensamblando...' : '`Robot: ${nombre} | Velocidad: ${velocidad}`'}
            </span>
          )}
        </div>
      </div>
    </MechanicWrapper>
  );
}

// ─── SCANNER (p2-l1: type annotations) ────────────────────────────────────────
function ScannerMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const [loading, setLoading]   = useState(false);
  const [scanPct, setScanPct]   = useState(0);
  const [scanned, setScanned]   = useState(false);
  const [success, setSuccess]   = useState<boolean | null>(null);

  const vars = [
    { name: 'tornillos',   value: '500',               type: 'number'  as const },
    { name: 'material',    value: '"acero inoxidable"', type: 'string'  as const },
    { name: 'activa',      value: 'true',              type: 'boolean' as const },
    { name: 'temp',        value: '320.5',             type: 'number'  as const },
    { name: 'codigoPieza', value: '"P-001"',           type: 'string'  as const },
    { name: 'pasoQA',      value: 'false',             type: 'boolean' as const },
  ];
  const typeColor = { number: C.cyan, string: C.green, boolean: C.amber };

  async function run() {
    setLoading(true); setScanned(false); setScanPct(0);
    const { success: ok } = await onActivate();
    setSuccess(ok);
    if (ok) {
      let p = 0;
      const t = setInterval(() => {
        p += 2; setScanPct(p);
        if (p >= 100) { clearInterval(t); setScanned(true); }
      }, 18);
    }
    setLoading(false);
  }

  return (
    <MechanicWrapper label="🔍 Escáner de Tipos — TypeScript Type Checker" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="🔍 ESCANEAR TIPOS" />
      </div>
    </>}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Scanner beam */}
        <div style={{ height: 4, background: C.bgTer, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${scanPct}%`, background: C.cyan,
            boxShadow: `0 0 10px ${C.cyan}`, transition: 'width 0.02s linear' }} />
        </div>
        {/* Cards grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {vars.map((v, i) => {
            const revealed = scanned || (scanPct > (i + 1) * 16);
            return (
              <div key={v.name} style={{ padding: '8px 10px',
                border: `1px solid ${revealed ? typeColor[v.type] + '70' : C.border}`,
                borderRadius: 7, background: C.bgSec, display: 'flex',
                flexDirection: 'column', gap: 3, transition: 'border-color 0.3s' }}>
                <div style={{ fontSize: 10, color: C.textSec, fontFamily: 'monospace' }}>{v.name}</div>
                <div style={{ fontSize: 12, color: C.text, fontFamily: 'monospace' }}>{v.value}</div>
                <div style={{ display: 'inline-block', padding: '1px 7px', borderRadius: 4,
                  fontSize: 10, fontWeight: 700, fontFamily: 'monospace',
                  background: revealed ? typeColor[v.type] + '25' : C.bgTer,
                  color: revealed ? typeColor[v.type] : C.textSec,
                  border: `1px solid ${revealed ? typeColor[v.type] + '60' : C.border}`,
                  transition: 'all 0.3s' }}>
                  {revealed ? v.type : '???'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MechanicWrapper>
  );
}

// ─── SORTER (p2-l2: if/else if/else) ──────────────────────────────────────────
function SorterMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<'DESPACHO' | 'REPARACION' | 'RESIDUOS' | null>(null);
  const [animating, setAnimating] = useState(false);
  const [success, setSuccess]   = useState<boolean | null>(null);

  const lanes = [
    { key: 'DESPACHO'   as const, label: '✅ DESPACHO',    color: C.green, sub: 'calidad ≥ 90' },
    { key: 'REPARACION' as const, label: '⚠️  REPARACIÓN',  color: C.amber, sub: '70 ≤ calidad < 90' },
    { key: 'RESIDUOS'   as const, label: '❌ RESIDUOS',    color: C.red,   sub: 'calidad < 70' },
  ];

  async function run() {
    setLoading(true); setResult(null); setAnimating(true);
    const { output, success: ok } = await onActivate();
    setSuccess(ok);
    const parsed = parseSorterResult(output);
    setTimeout(() => { setResult(parsed); setAnimating(false); }, 500);
    setLoading(false);
  }

  return (
    <MechanicWrapper label="📦 Clasificador de Calidad — if / else if / else" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="📦 CLASIFICAR CAJA" />
      </div>
    </>}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Input box */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 64, height: 52, border: `2px solid ${animating ? C.amber : C.border}`,
            borderRadius: 6, background: animating ? `${C.amber}20` : C.bgSec,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 2, transition: 'all 0.3s', boxShadow: animating ? `0 0 14px ${C.amber}40` : 'none' }}>
            <span style={{ fontSize: 20 }}>📦</span>
            <span style={{ fontSize: 9, color: C.textSec, fontFamily: 'monospace' }}>calidad: 78</span>
          </div>
        </div>
        <div style={{ textAlign: 'center', color: C.textSec, fontSize: 18 }}>▼</div>
        {/* 3 lanes */}
        <div style={{ flex: 1, display: 'flex', gap: 10 }}>
          {lanes.map((lane) => {
            const active = result === lane.key;
            return (
              <div key={lane.key} style={{ flex: 1, border: `2px solid ${active ? lane.color : C.border}`,
                borderRadius: 10, background: active ? lane.color + '15' : C.bgSec,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 8, padding: '10px 6px',
                transition: 'all 0.4s', boxShadow: active ? `0 0 18px ${lane.color}40` : 'none',
                transform: active ? 'scale(1.04)' : 'scale(1)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: active ? lane.color : C.textSec,
                  fontFamily: 'monospace', textAlign: 'center', transition: 'color 0.3s' }}>
                  {lane.label}
                </div>
                <div style={{ fontSize: 10, color: C.textSec, fontFamily: 'monospace', textAlign: 'center' }}>
                  {lane.sub}
                </div>
                {active && <span style={{ fontSize: 22 }}>📦</span>}
              </div>
            );
          })}
        </div>
      </div>
    </MechanicWrapper>
  );
}

// ─── ENERGY BAR (p3-l1: while loop) ───────────────────────────────────────────
function EnergyBarMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const [loading, setLoading]       = useState(false);
  const [steps, setSteps]           = useState<Array<{ energia: number; pieza: number }>>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [done, setDone]             = useState(false);
  const [success, setSuccess]       = useState<boolean | null>(null);

  const energia    = currentStep >= 0 && steps[currentStep] ? steps[currentStep].energia : 100;
  const pieza      = currentStep >= 0 && steps[currentStep] ? steps[currentStep].pieza : 0;
  const energyPct  = energia;
  const barColor   = energyPct > 60 ? C.green : energyPct > 30 ? C.amber : C.red;

  async function run() {
    setLoading(true); setCurrentStep(-1); setDone(false);
    const { output, success: ok } = await onActivate();
    setSuccess(ok);
    const parsed = parseEnergySteps(output);
    setSteps(parsed);
    if (ok && parsed.length > 0) {
      let i = 0;
      const t = setInterval(() => {
        setCurrentStep(i); i++;
        if (i >= parsed.length) { clearInterval(t); setTimeout(() => setDone(true), 300); }
      }, 240);
    }
    setLoading(false);
  }

  return (
    <MechanicWrapper label="⚡ Turno Continuo — while loop" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="▶️ INICIAR TURNO" />
      </div>
    </>}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Energy bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: C.textSec, fontFamily: 'monospace' }}>⚡ ENERGÍA</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: barColor,
              fontFamily: 'JetBrains Mono, monospace', transition: 'color 0.3s' }}>{energia}%</span>
          </div>
          <div style={{ height: 22, background: C.bgTer, borderRadius: 11, overflow: 'hidden',
            border: `1px solid ${C.border}` }}>
            <div style={{ height: '100%', width: `${energyPct}%`,
              background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
              borderRadius: 11, transition: 'width 0.2s ease, background 0.3s',
              boxShadow: `0 0 8px ${barColor}60` }} />
          </div>
        </div>
        {/* Counter */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 10 }}>
          <div style={{ fontSize: 11, color: C.textSec, fontFamily: 'monospace' }}>🔩 PIEZAS PRODUCIDAS</div>
          <div style={{ fontSize: 52, fontWeight: 900, color: pieza > 0 ? C.cyanL : C.textSec,
            fontFamily: 'JetBrains Mono, monospace', transition: 'all 0.2s',
            textShadow: pieza > 0 ? `0 0 20px ${C.cyan}80` : 'none' }}>{pieza}</div>
          {done && (
            <div style={{ fontSize: 13, fontWeight: 700, color: C.green, fontFamily: 'monospace',
              padding: '7px 18px', border: `1px solid ${C.green}`, borderRadius: 8,
              background: `${C.green}15` }}>
              ✅ TURNO FINALIZADO — {pieza} piezas
            </div>
          )}
          {steps.length > 0 && currentStep >= 0 && (
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: C.textSec, textAlign: 'center' }}>
              {steps.slice(Math.max(0, currentStep - 1), currentStep + 1).map((s, i) => (
                <div key={i} style={{ color: i === Math.min(1, currentStep) ? C.cyanL : C.textSec }}>
                  ⚡ Energía: {s.energia} | Pieza #{s.pieza} lista
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MechanicWrapper>
  );
}

// ─── GRID (p3-l2: nested for loops) ───────────────────────────────────────────
function GridMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const [loading, setLoading]   = useState(false);
  const [lit, setLit]           = useState<Set<number>>(new Set());
  const [done, setDone]         = useState(false);
  const [success, setSuccess]   = useState<boolean | null>(null);

  async function run() {
    setLoading(true); setLit(new Set()); setDone(false);
    const { output, success: ok } = await onActivate();
    setSuccess(ok);
    const steps = parseGridSteps(output);
    if (ok && steps.length > 0) {
      let i = 0;
      const t = setInterval(() => {
        if (steps[i]) setLit(prev => new Set([...prev, steps[i].fila * 4 + steps[i].col]));
        i++;
        if (i >= steps.length) { clearInterval(t); setTimeout(() => setDone(true), 300); }
      }, 170);
    }
    setLoading(false);
  }

  return (
    <MechanicWrapper label="🏭 Mapa de Estaciones — for loops anidados" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="🏭 MAPEAR ESTACIONES" />
      </div>
    </>}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Column labels */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
          {['col 0', 'col 1', 'col 2', 'col 3'].map(c => (
            <div key={c} style={{ width: 64, fontSize: 9, color: C.textSec,
              fontFamily: 'monospace', textAlign: 'center' }}>{c}</div>
          ))}
        </div>
        {/* Grid */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 64px)',
            gridTemplateRows: 'repeat(4, 56px)', gap: 5 }}>
            {Array.from({ length: 16 }, (_, idx) => {
              const row = Math.floor(idx / 4); const col = idx % 4;
              const active = lit.has(idx);
              return (
                <div key={idx} style={{ border: `2px solid ${active ? C.cyan : C.border}`,
                  borderRadius: 6, background: active ? `${C.cyan}20` : C.bgSec,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: 1, transition: 'all 0.22s',
                  boxShadow: active ? `0 0 10px ${C.cyan}50` : 'none' }}>
                  <div style={{ fontSize: 14, fontWeight: 700,
                    color: active ? C.cyanL : C.textSec, fontFamily: 'monospace', transition: 'color 0.22s' }}>
                    {idx + 1}
                  </div>
                  <div style={{ fontSize: 8, color: active ? C.cyan : C.bgTer,
                    fontFamily: 'monospace', transition: 'color 0.22s' }}>f:{row} c:{col}</div>
                  {active && <span style={{ fontSize: 10 }}>🔩</span>}
                </div>
              );
            })}
          </div>
        </div>
        {done && (
          <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: C.green,
            fontFamily: 'monospace', padding: '6px', border: `1px solid ${C.green}`,
            borderRadius: 6, background: `${C.green}15` }}>
            ✅ 16 / 16 estaciones mapeadas
          </div>
        )}
      </div>
    </MechanicWrapper>
  );
}

// ─── WAREHOUSE (p4-l1: arrays) ─────────────────────────────────────────────────
function WarehouseMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const [loading, setLoading]   = useState(false);
  const [slots, setSlots]       = useState<(number | null)[]>([null, null, null, null, null]);
  const [maxIdx, setMaxIdx]     = useState(-1);
  const [total, setTotal]       = useState(0);
  const [success, setSuccess]   = useState<boolean | null>(null);
  const VALUES = [120, 85, 200, 60, 175];

  async function run() {
    setLoading(true); setSlots([null, null, null, null, null]); setMaxIdx(-1); setTotal(0);
    const { success: ok } = await onActivate();
    setSuccess(ok);
    if (ok) {
      let maxV = 0, mIdx = 0;
      VALUES.forEach((v, i) => { if (v > maxV) { maxV = v; mIdx = i; } });
      setMaxIdx(mIdx); setTotal(VALUES.length);
      let i = 0;
      const t = setInterval(() => {
        const fi = i;
        setSlots(prev => { const n = [...prev]; n[fi] = VALUES[fi]; return n; });
        i++; if (i >= VALUES.length) clearInterval(t);
      }, 340);
    }
    setLoading(false);
  }

  return (
    <MechanicWrapper label="📦 Almacén de Lotes — Arrays Tipados" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="📦 CARGAR INVENTARIO" />
      </div>
    </>}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Array type display */}
        <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 12, color: C.purpleL }}>
          const lotes: <span style={{ color: C.cyan }}>number[]</span> = [
          <span style={{ color: C.amber }}>{slots.map(s => s ?? '…').join(', ')}</span>]
        </div>
        {/* Shelves */}
        <div style={{ flex: 1, display: 'flex', gap: 8, alignItems: 'flex-end',
          justifyContent: 'center', paddingBottom: 12 }}>
          {slots.map((val, i) => {
            const isMax = i === maxIdx && val !== null;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 15, fontWeight: 700, minHeight: 22,
                  color: isMax ? C.amber : val !== null ? C.cyanL : C.textSec,
                  fontFamily: 'JetBrains Mono, monospace', transition: 'color 0.3s',
                  textShadow: isMax ? `0 0 10px ${C.amber}` : 'none' }}>
                  {val ?? ''}
                </div>
                {isMax && val !== null && (
                  <div style={{ fontSize: 8, color: C.amber, fontFamily: 'monospace' }}>MAX</div>
                )}
                <div style={{ width: 60, height: 50,
                  border: `2px solid ${isMax ? C.amber : val !== null ? C.cyan : C.border}`,
                  borderRadius: 6, background: isMax ? `${C.amber}20` : val !== null ? `${C.cyan}15` : C.bgSec,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s',
                  boxShadow: isMax ? `0 0 14px ${C.amber}50` : val !== null ? `0 0 6px ${C.cyan}30` : 'none' }}>
                  {val !== null ? <span style={{ fontSize: 18 }}>{isMax ? '🥇' : '📦'}</span>
                    : <span style={{ fontSize: 14, opacity: 0.3 }}>□</span>}
                </div>
                <div style={{ width: 68, height: 5, background: C.bgTer,
                  borderRadius: 3, border: `1px solid ${C.border}` }} />
                <div style={{ fontSize: 11, color: C.purpleL, fontFamily: 'monospace',
                  fontWeight: i === 0 ? 700 : 400 }}>[{i}]</div>
                {i === 0 && (
                  <div style={{ fontSize: 8, color: C.textSec, fontFamily: 'monospace' }}>primer</div>
                )}
              </div>
            );
          })}
        </div>
        {total > 0 && (
          <div style={{ textAlign: 'center', fontSize: 11, color: C.textSec, fontFamily: 'monospace' }}>
            Total lotes: <span style={{ color: C.cyanL }}>{total}</span>
            {' '}· Lote más grande: <span style={{ color: C.amber }}>200 piezas</span>
          </div>
        )}
      </div>
    </MechanicWrapper>
  );
}

// ─── MACHINE (p4-l2: functions) ────────────────────────────────────────────────
function MachineMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const [loading, setLoading]     = useState(false);
  const [stage, setStage]         = useState<'idle' | 'input' | 'process' | 'output'>('idle');
  const [outputLine, setOutputLine] = useState('');
  const [success, setSuccess]     = useState<boolean | null>(null);

  async function run() {
    setLoading(true); setStage('idle'); setOutputLine('');
    const { output, success: ok } = await onActivate();
    setSuccess(ok);
    if (ok) {
      setStage('input');
      setTimeout(() => setStage('process'), 600);
      setTimeout(() => { setOutputLine(output[0] ?? ''); setStage('output'); }, 1300);
    }
    setLoading(false);
  }

  const spinning = stage === 'process';

  return (
    <MechanicWrapper label="⚙️ Máquina de Funciones — Parámetros y Return" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="⚙️ EJECUTAR FUNCIÓN" />
      </div>
    </>}>
      <div style={{ height: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 16 }}>
        {/* Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[{ name: 'producidas', type: 'number', val: '847' },
            { name: 'meta', type: 'number', val: '1000' }].map(p => (
            <div key={p.name} style={{ padding: '10px 14px',
              border: `2px solid ${stage !== 'idle' ? C.cyan : C.border}`,
              borderRadius: 8, background: C.bgSec, fontFamily: 'monospace',
              transition: 'border-color 0.3s', boxShadow: stage !== 'idle' ? `0 0 8px ${C.cyan}40` : 'none' }}>
              <div style={{ fontSize: 9, color: C.textSec, marginBottom: 3 }}>{p.name}: {p.type}</div>
              <div style={{ fontSize: 18, color: C.cyanL, fontWeight: 700 }}>{p.val}</div>
            </div>
          ))}
        </div>
        {/* Arrow + machine */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 18, color: stage !== 'idle' ? C.cyan : C.textSec, transition: 'color 0.3s' }}>→</div>
          <div style={{ width: 88, height: 88, border: `3px solid ${spinning ? C.purple : C.border}`,
            borderRadius: 12, background: C.bgSec,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
            transition: 'border-color 0.3s', boxShadow: spinning ? `0 0 18px ${C.purple}60` : 'none' }}>
            <div style={{ fontSize: 22, display: 'inline-block',
              animation: spinning ? 'spin 0.5s linear infinite' : 'none' }}>⚙️</div>
            <div style={{ fontSize: 8, color: C.purpleL, fontFamily: 'monospace', textAlign: 'center' }}>
              calcular<br/>Eficiencia
            </div>
          </div>
          <div style={{ fontSize: 18, color: stage === 'output' ? C.green : C.textSec, transition: 'color 0.3s' }}>→</div>
        </div>
        {/* Output */}
        <div style={{ padding: '16px 16px', border: `2px solid ${stage === 'output' ? C.green : C.border}`,
          borderRadius: 10, background: stage === 'output' ? `${C.green}15` : C.bgSec,
          fontFamily: 'monospace', minWidth: 150, transition: 'all 0.4s',
          boxShadow: stage === 'output' ? `0 0 14px ${C.green}40` : 'none' }}>
          <div style={{ fontSize: 9, color: C.textSec, marginBottom: 8 }}>RESULTADO</div>
          {outputLine
            ? <div style={{ fontSize: 12, color: C.green }}>{outputLine}</div>
            : <div style={{ fontSize: 22, color: C.textSec, opacity: 0.4 }}>???</div>}
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </MechanicWrapper>
  );
}

// ─── CARDS (p4-l3: interface/objects) ──────────────────────────────────────────
function CardsMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const [loading, setLoading]   = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [filtered, setFiltered] = useState(false);
  const [success, setSuccess]   = useState<boolean | null>(null);

  const products = [
    { id: 1, nombre: 'Perno M6',  peso: 5,   aprobado: true,  proveedor: undefined as string | undefined },
    { id: 2, nombre: 'Tuerca M6', peso: 3,   aprobado: false, proveedor: undefined as string | undefined },
    { id: 3, nombre: 'Arandela',  peso: 1.5, aprobado: true,  proveedor: 'MetalPro' },
  ];

  async function run() {
    setLoading(true); setRevealed(false); setFiltered(false);
    const { success: ok } = await onActivate();
    setSuccess(ok);
    if (ok) {
      setTimeout(() => setRevealed(true), 400);
      setTimeout(() => setFiltered(true), 1100);
    }
    setLoading(false);
  }

  return (
    <MechanicWrapper label="🗂️ Fichas de Producto — interface & objects" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="🗂️ PROCESAR CATÁLOGO" />
      </div>
    </>}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ flex: 1, display: 'flex', gap: 8 }}>
          {products.map((p) => {
            const hidden = filtered && !p.aprobado;
            return (
              <div key={p.id} style={{ flex: 1, padding: '10px 12px',
                border: `2px solid ${revealed ? (p.aprobado ? C.green : C.border) : C.border}`,
                borderRadius: 10, background: revealed ? (p.aprobado ? `${C.green}10` : C.bgSec) : C.bgSec,
                transition: 'all 0.5s', opacity: hidden ? 0.12 : 1,
                transform: hidden ? 'translateY(18px)' : 'translateY(0)' }}>
                <div style={{ fontSize: 10, color: C.purpleL, fontFamily: 'monospace',
                  marginBottom: 6, fontWeight: 700 }}>Producto #{p.id}</div>
                {[{ k: 'nombre',    v: `"${p.nombre}"` },
                  { k: 'peso',      v: `${p.peso}g` },
                  { k: 'aprobado',  v: revealed ? String(p.aprobado) : '???' },
                  { k: 'proveedor', v: p.proveedor ? `"${p.proveedor}"` : (revealed ? 'undefined' : '???') },
                ].map(({ k, v }) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between',
                    fontSize: 10, fontFamily: 'monospace', marginBottom: 3 }}>
                    <span style={{ color: C.textSec }}>{k}:</span>
                    <span style={{ color: k === 'aprobado' && revealed
                      ? (p.aprobado ? C.green : C.red) : C.text }}>{v}</span>
                  </div>
                ))}
                {revealed && p.aprobado && (
                  <div style={{ marginTop: 6, fontSize: 10, color: C.green, fontFamily: 'monospace',
                    textAlign: 'center', padding: '3px',
                    border: `1px solid ${C.green}40`, borderRadius: 4, background: `${C.green}15` }}>
                    ✅ APROBADO
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {filtered && (
          <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 11, color: C.green,
            padding: '5px', border: `1px solid ${C.green}40`, borderRadius: 6, background: `${C.green}10` }}>
            Aprobados: 2 / 3 · Primer aprobado: Perno M6
          </div>
        )}
      </div>
    </MechanicWrapper>
  );
}

// ─── DETECTOR (p4-l4: union types) ─────────────────────────────────────────────
function DetectorMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const [loading, setLoading]         = useState(false);
  const [activeTypes, setActiveTypes] = useState<Array<'null' | 'number' | 'string'>>([]);
  const [messages, setMessages]       = useState<string[]>([]);
  const [success, setSuccess]         = useState<boolean | null>(null);

  const indicators = [
    { key: 'number' as const, label: 'NUMBER', color: C.cyan,    emoji: '🔢' },
    { key: 'string' as const, label: 'STRING',  color: C.green,   emoji: '📝' },
    { key: 'null'   as const, label: 'NULL',    color: C.textSec, emoji: '⚠️' },
  ];

  async function run() {
    setLoading(true); setActiveTypes([]); setMessages([]);
    const { output, success: ok } = await onActivate();
    setSuccess(ok);
    if (ok) {
      const detected = parseDetectorResults(output);
      let i = 0;
      const t = setInterval(() => {
        if (i < detected.length) {
          setActiveTypes(prev => [...prev, detected[i]]);
          setMessages(prev => [...prev, output[i] ?? '']);
        }
        i++; if (i >= output.length) clearInterval(t);
      }, 550);
    }
    setLoading(false);
  }

  return (
    <MechanicWrapper label="🔬 Sensor de Tipos — Union Types & Type Narrowing" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="🔬 IDENTIFICAR PIEZA" />
      </div>
    </>}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Indicator lights */}
        <div style={{ flex: 1, display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'center' }}>
          {indicators.map((ind) => {
            const active = activeTypes.includes(ind.key);
            return (
              <div key={ind.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%',
                  border: `3px solid ${active ? ind.color : C.border}`,
                  background: active ? `${ind.color}30` : C.bgSec,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, transition: 'all 0.4s',
                  boxShadow: active ? `0 0 22px ${ind.color}80` : 'none' }}>
                  {ind.emoji}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700,
                  color: active ? ind.color : C.textSec,
                  fontFamily: 'monospace', transition: 'color 0.3s' }}>{ind.label}</div>
                <div style={{ width: 10, height: 10, borderRadius: '50%',
                  background: active ? ind.color : C.bgTer,
                  border: `1px solid ${active ? ind.color : C.border}`,
                  boxShadow: active ? `0 0 7px ${ind.color}` : 'none',
                  transition: 'all 0.4s' }} />
              </div>
            );
          })}
        </div>
        {/* Output log */}
        <div style={{ background: C.bgSec, borderRadius: 7,
          border: `1px solid ${C.border}`, padding: '8px 12px',
          fontFamily: 'monospace', fontSize: 11, minHeight: 56 }}>
          {messages.length === 0
            ? <span style={{ color: C.textSec }}>Esperando identificación...</span>
            : messages.map((m, i) => (
              <div key={i} style={{ color: C.cyanL, marginBottom: 2 }}>&gt; {m}</div>
            ))}
        </div>
      </div>
    </MechanicWrapper>
  );
}

// ─── PANEL (p4-l5: enum / switch) ──────────────────────────────────────────────
function PanelMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const [loading, setLoading]           = useState(false);
  const [activeStates, setActiveStates] = useState<string[]>([]);
  const [msgs, setMsgs]                 = useState<string[]>([]);
  const [success, setSuccess]           = useState<boolean | null>(null);

  const enumStates = [
    { key: 'ACTIVA',        color: C.green,   emoji: '✅', label: 'ACTIVA' },
    { key: 'PAUSA',         color: C.amber,   emoji: '⏸️',  label: 'PAUSA' },
    { key: 'MANTENIMIENTO', color: C.cyan,    emoji: '🔧', label: 'MANT.' },
    { key: 'ERROR',         color: C.red,     emoji: '🚨', label: 'ERROR' },
    { key: 'APAGADA',       color: C.textSec, emoji: '⚫', label: 'APAGADA' },
  ];

  async function run() {
    setLoading(true); setActiveStates([]); setMsgs([]);
    const { output, success: ok } = await onActivate();
    setSuccess(ok);
    if (ok) {
      const states = parsePanelStates(output);
      let i = 0;
      const t = setInterval(() => {
        if (i < states.length) {
          setActiveStates(prev => [...prev, states[i]]);
          setMsgs(prev => [...prev, output[i] ?? '']);
        }
        i++; if (i >= states.length) clearInterval(t);
      }, 480);
    }
    setLoading(false);
  }

  return (
    <MechanicWrapper label="📊 Panel de Control — enum & switch/case" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="📊 ACTUALIZAR ESTADOS" />
      </div>
    </>}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
        gap: 8, justifyContent: 'center' }}>
        {enumStates.map((s) => {
          const active = activeStates.includes(s.key);
          const msgIdx = activeStates.indexOf(s.key);
          return (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 12,
              padding: '9px 14px', borderRadius: 8,
              border: `1px solid ${active ? s.color + '70' : C.border}`,
              background: active ? s.color + '12' : C.bgSec, transition: 'all 0.4s' }}>
              <div style={{ width: 13, height: 13, borderRadius: '50%',
                background: active ? s.color : C.bgTer,
                border: `2px solid ${active ? s.color : C.border}`,
                boxShadow: active ? `0 0 9px ${s.color}` : 'none',
                flexShrink: 0, transition: 'all 0.3s' }} />
              <div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700,
                color: active ? s.color : C.textSec, width: 86, transition: 'color 0.3s' }}>
                {s.emoji} {s.label}
              </div>
              {active && msgs[msgIdx] && (
                <div style={{ fontSize: 11, color: C.text, fontFamily: 'monospace', flex: 1, opacity: 0.9 }}>
                  {msgs[msgIdx]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </MechanicWrapper>
  );
}

// ─── PIPELINE (p5-l1: filter/reduce) ───────────────────────────────────────────
function PipelineMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const [loading, setLoading]           = useState(false);
  const [passed, setPassed]             = useState<string[]>([]);
  const [rejected, setRejected]         = useState<string[]>([]);
  const [weight, setWeight]             = useState(0);
  const [done, setDone]                 = useState(false);
  const [success, setSuccess]           = useState<boolean | null>(null);

  const items = [
    { nombre: 'Perno M6',  peso: 5,   aprobado: true  },
    { nombre: 'Tuerca M6', peso: 3,   aprobado: false },
    { nombre: 'Arandela',  peso: 1.5, aprobado: true  },
    { nombre: 'Tornillo',  peso: 4,   aprobado: true  },
    { nombre: 'Remache',   peso: 2,   aprobado: false },
  ];

  async function run() {
    setLoading(true); setPassed([]); setRejected([]); setWeight(0); setDone(false);
    const { success: ok } = await onActivate();
    setSuccess(ok);
    if (ok) {
      let w = 0; let i = 0;
      const t = setInterval(() => {
        const item = items[i];
        if (item) {
          if (item.aprobado && item.peso > 3) {
            setPassed(prev => [...prev, item.nombre]);
            w += item.peso; setWeight(w);
          } else {
            setRejected(prev => [...prev, item.nombre]);
          }
        }
        i++; if (i >= items.length) { clearInterval(t); setTimeout(() => setDone(true), 400); }
      }, 380);
    }
    setLoading(false);
  }

  return (
    <MechanicWrapper label="🔄 Pipeline de Producción — filter & reduce" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="🔄 EJECUTAR PIPELINE" />
      </div>
    </>}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Input items */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 9, color: C.textSec, fontFamily: 'monospace', width: 42 }}>INPUT:</span>
          {items.map((item, i) => (
            <div key={i} style={{ padding: '3px 7px', fontSize: 9, fontFamily: 'monospace',
              border: `1px solid ${C.border}`, borderRadius: 4, background: C.bgSec, color: C.text }}>
              {item.nombre} ({item.peso}g)
            </div>
          ))}
        </div>
        {/* Filter gate */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px',
          border: `1px solid ${C.purple}50`, borderRadius: 7, background: `${C.purple}10` }}>
          <span style={{ fontSize: 13 }}>🔽</span>
          <div style={{ fontFamily: 'monospace', fontSize: 10 }}>
            <span style={{ color: C.purpleL }}>filter</span>
            <span style={{ color: C.text }}>(p {'→'} p.aprobado {'&&'} p.peso {'>'} 3)</span>
          </div>
        </div>
        {/* Two lanes */}
        <div style={{ flex: 1, display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, border: `1px solid ${C.green}40`, borderRadius: 7,
            background: `${C.green}08`, padding: 8 }}>
            <div style={{ fontSize: 9, color: C.green, fontFamily: 'monospace',
              fontWeight: 700, marginBottom: 5 }}>✅ PASAN ({passed.length})</div>
            {passed.map((name, i) => (
              <div key={i} style={{ fontSize: 10, color: C.text, fontFamily: 'monospace',
                marginBottom: 3, padding: '2px 5px', background: `${C.green}15`, borderRadius: 3 }}>
                📦 {name}
              </div>
            ))}
          </div>
          <div style={{ flex: 1, border: `1px solid ${C.red}40`, borderRadius: 7,
            background: `${C.red}08`, padding: 8 }}>
            <div style={{ fontSize: 9, color: C.red, fontFamily: 'monospace',
              fontWeight: 700, marginBottom: 5 }}>❌ DESCARTAN ({rejected.length})</div>
            {rejected.map((name, i) => (
              <div key={i} style={{ fontSize: 10, color: C.textSec, fontFamily: 'monospace',
                marginBottom: 3, padding: '2px 5px', background: `${C.red}15`, borderRadius: 3 }}>
                🗑️ {name}
              </div>
            ))}
          </div>
        </div>
        {/* Reduce */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px',
          border: `1px solid ${weight > 0 ? C.amber + '60' : C.border}`, borderRadius: 7,
          background: weight > 0 ? `${C.amber}10` : C.bgSec, transition: 'all 0.3s' }}>
          <span style={{ fontSize: 14 }}>⚖️</span>
          <div style={{ fontFamily: 'monospace', fontSize: 10 }}>
            <span style={{ color: C.purpleL }}>reduce</span>
            <span style={{ color: C.text }}> → peso total: </span>
            <span style={{ color: C.amber, fontWeight: 700, fontSize: 13 }}>{weight}g</span>
          </div>
          {done && (
            <span style={{ fontSize: 9, color: C.green, fontFamily: 'monospace', marginLeft: 'auto' }}>
              ✅ 2 filtrados | 9g
            </span>
          )}
        </div>
      </div>
    </MechanicWrapper>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────
export interface MechanicCanvasProps {
  mechanic:       LevelMechanic;
  stampsRequired: number;
  stampedCount:   number;
  onActivate:     () => Promise<ActivateResult>;
}

export default function MechanicCanvas({ mechanic, stampsRequired, stampedCount, onActivate }: MechanicCanvasProps) {
  // Reset internal state when mechanic changes (key-based reset handled by parent)
  const props = { stampsRequired, stampedCount, onActivate };
  switch (mechanic) {
    case 'tanks':      return <TanksMechanic      {...props} />;
    case 'assembler':  return <AssemblerMechanic  {...props} />;
    case 'scanner':    return <ScannerMechanic    {...props} />;
    case 'sorter':     return <SorterMechanic     {...props} />;
    case 'energy-bar': return <EnergyBarMechanic  {...props} />;
    case 'grid':       return <GridMechanic       {...props} />;
    case 'warehouse':  return <WarehouseMechanic  {...props} />;
    case 'machine':    return <MachineMechanic    {...props} />;
    case 'cards':      return <CardsMechanic      {...props} />;
    case 'detector':   return <DetectorMechanic   {...props} />;
    case 'panel':      return <PanelMechanic      {...props} />;
    case 'pipeline':   return <PipelineMechanic   {...props} />;
    default:           return null; // 'speech' uses FactoryCanvas
  }
}

// Suppress unused import warning — useEffect available if needed in sub-components
void useEffect;
