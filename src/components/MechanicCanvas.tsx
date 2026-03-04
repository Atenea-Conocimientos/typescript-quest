import { useState, useEffect, useRef } from 'react';
import { LevelMechanic } from '../engine/types';
import {
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

// ─── SORTER (p2-l2: if/else if/else) — Conveyor Belt + 5-Box Batch + Checkpoints
function SorterMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  type Dest     = 'DESPACHO' | 'REPARACION' | 'RESIDUOS';
  type BoxPhase = 'idle' | 'start' | 'to-g1' | 'drop-despacho' |
                  'past-g1' | 'to-g2' | 'drop-reparacion' |
                  'past-g2' | 'to-end' | 'drop-residuos' | 'done';
  type CPData   = { gate: 1 | 2; calidad: number; dest: Dest };

  const BATCH = [
    { id: 1, calidad: 95 }, // DESPACHO
    { id: 2, calidad: 78 }, // REPARACION
    { id: 3, calidad: 45 }, // RESIDUOS
    { id: 4, calidad: 91 }, // DESPACHO
    { id: 5, calidad: 65 }, // RESIDUOS
  ] as const;

  function getDest(cal: number): Dest {
    if (cal >= 90) return 'DESPACHO';
    if (cal >= 70) return 'REPARACION';
    return 'RESIDUOS';
  }
  function qualColor(cal: number) {
    return cal >= 90 ? C.green : cal >= 70 ? C.amber : C.red;
  }
  const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

  const [loading,    setLoading]    = useState(false);
  const [success,    setSuccess]    = useState<boolean | null>(null);
  const [batchDone,  setBatchDone]  = useState(false);
  const [bStatuses,  setBStatuses]  = useState<Array<'waiting'|'on-belt'|'done'>>(BATCH.map(() => 'waiting'));
  const [bDests,     setBDests]     = useState<Array<Dest|null>>(BATCH.map(() => null));
  const [activeIdx,  setActiveIdx]  = useState<number | null>(null);
  const [boxPhase,   setBoxPhase]   = useState<BoxPhase>('idle');
  const [arm1,       setArm1]       = useState(false);
  const [arm2,       setArm2]       = useState(false);
  const [checkpoint, setCheckpoint] = useState<CPData | null>(null);

  // ── Step control: animation pauses until user clicks "Siguiente" ─────────────
  const resolveRef  = useRef<(() => void) | null>(null);
  const cancelledRef = useRef(false);

  function waitForNext(): Promise<void> {
    return new Promise(resolve => { resolveRef.current = resolve; });
  }
  function handleNext() {
    resolveRef.current?.();
    resolveRef.current = null;
    setCheckpoint(null);
  }

  // Geometry
  const BELT_Y = 46, DROP_Y = 84;
  const G1_X = 28, G2_X = 58, END_X = 84;

  function bPos(ph: BoxPhase): { left: string; top: string } | null {
    switch (ph) {
      case 'start':          return { left: '7%',          top: `${BELT_Y}%` };
      case 'to-g1':          return { left: `${G1_X}%`,    top: `${BELT_Y}%` };
      case 'drop-despacho':  return { left: `${G1_X}%`,    top: `${DROP_Y}%` };
      case 'past-g1':        return { left: `${G1_X+4}%`,  top: `${BELT_Y}%` };
      case 'to-g2':          return { left: `${G2_X}%`,    top: `${BELT_Y}%` };
      case 'drop-reparacion':return { left: `${G2_X}%`,    top: `${DROP_Y}%` };
      case 'past-g2':        return { left: `${G2_X+4}%`,  top: `${BELT_Y}%` };
      case 'to-end':         return { left: `${END_X}%`,   top: `${BELT_Y}%` };
      case 'drop-residuos':  return { left: `${END_X}%`,   top: `${DROP_Y}%` };
      default:               return null;
    }
  }

  const updStat = (i: number, s: 'waiting'|'on-belt'|'done') =>
    setBStatuses(prev => { const n=[...prev]; n[i]=s; return n; });
  const updDest = (i: number, d: Dest) =>
    setBDests(prev => { const n=[...prev]; n[i]=d; return n; });

  // ── Main run — fully async, pauses at each checkpoint ────────────────────────
  async function run() {
    // Cancel any in-progress run
    cancelledRef.current = true;
    resolveRef.current?.();
    await delay(50);
    cancelledRef.current = false;

    setLoading(true);
    setBStatuses(BATCH.map(() => 'waiting'));
    setBDests(BATCH.map(() => null));
    setActiveIdx(null); setBoxPhase('idle');
    setArm1(false); setArm2(false);
    setCheckpoint(null); setBatchDone(false);

    const { success: ok } = await onActivate();
    setSuccess(ok);

    if (ok) {
      for (let i = 0; i < BATCH.length; i++) {
        if (cancelledRef.current) break;
        const box  = BATCH[i];
        const dest = getDest(box.calidad);

        // ── Box enters belt ─────────────────────────────────────────────────
        setActiveIdx(i);
        setBoxPhase('start');
        updStat(i, 'on-belt');
        await delay(60);
        setBoxPhase('to-g1');
        await delay(550);                       // box travels to gate 1
        if (cancelledRef.current) break;

        // ── Checkpoint: Gate 1 (if calidad >= 90) ──────────────────────────
        setCheckpoint({ gate: 1, calidad: box.calidad, dest });
        await waitForNext();                    // ← PAUSES: user clicks Siguiente
        if (cancelledRef.current) break;

        if (dest === 'DESPACHO') {
          // Arm 1 fires → box drops to APROBADO
          setArm1(true);
          await delay(350);
          setBoxPhase('drop-despacho');
          await delay(500);
          setBoxPhase('done');
          updStat(i, 'done'); updDest(i, dest);
          await delay(450);
          setArm1(false);

        } else {
          // Box passes gate 1 → moves to gate 2
          setBoxPhase('past-g1');
          await delay(120);
          setBoxPhase('to-g2');
          await delay(550);                     // travels to gate 2
          if (cancelledRef.current) break;

          // ── Checkpoint: Gate 2 (else if calidad >= 70) ─────────────────
          setCheckpoint({ gate: 2, calidad: box.calidad, dest });
          await waitForNext();                  // ← PAUSES: user clicks Siguiente
          if (cancelledRef.current) break;

          if (dest === 'REPARACION') {
            setArm2(true);
            await delay(350);
            setBoxPhase('drop-reparacion');
            await delay(500);
            setBoxPhase('done');
            updStat(i, 'done'); updDest(i, dest);
            await delay(450);
            setArm2(false);

          } else {
            // RESIDUOS: passes both gates → falls off end
            setBoxPhase('past-g2');
            await delay(120);
            setBoxPhase('to-end');
            await delay(500);
            setBoxPhase('drop-residuos');
            await delay(500);
            setBoxPhase('done');
            updStat(i, 'done'); updDest(i, dest);
            await delay(400);
          }
        }
        await delay(250);                       // small gap before next box
      }

      if (!cancelledRef.current) setBatchDone(true);
    }
    setLoading(false);
  }

  const activeBox  = activeIdx !== null ? BATCH[activeIdx] : null;
  const activeQual = activeBox?.calidad ?? 0;
  const pos        = bPos(boxPhase);
  const boxColor   = activeBox ? qualColor(activeBox.calidad) : C.amber;

  // ── Checkpoint popup (with Siguiente button) ─────────────────────────────────
  function CheckpointPopup({ cp }: { cp: CPData }) {
    const isG1      = cp.gate === 1;
    const condColor = isG1 ? C.green : C.amber;
    const result    = isG1 ? cp.calidad >= 90 : cp.calidad >= 70;
    const cond      = isG1 ? 'calidad >= 90' : 'calidad >= 70';
    const keyword   = isG1 ? 'if' : 'else if';
    const nextMsg   = isG1
      ? (result ? '✅ ¡Condición verdadera! → se dirige a APROBADO' : '❌ Condición falsa → sigue al brazo 2')
      : (result ? '⚠️ ¡Condición verdadera! → se dirige a RETRABAJAR' : '❌ Condición falsa → cae a DESCARTE');

    const leftPct = isG1 ? G1_X + 9 : G2_X + 8;

    return (
      <div style={{
        position: 'absolute', left: `${leftPct}%`, top: '5%',
        zIndex: 30, minWidth: 190, maxWidth: 230,
        background: C.bgSec, border: `2px solid ${condColor}`,
        borderRadius: 12, padding: '12px 15px',
        boxShadow: `0 8px 28px rgba(0,0,0,0.5), 0 0 0 1px ${condColor}40`,
        fontFamily: 'monospace', fontSize: 11,
        animation: 'cpSlide 0.18s ease',
      }}>
        {/* Header */}
        <div style={{ fontWeight: 700, color: condColor, marginBottom: 8, fontSize: 12,
          display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14 }}>{isG1 ? '🟢' : '🟡'}</span>
          Brazo {cp.gate} — <code style={{ background: `${condColor}20`,
            padding: '1px 5px', borderRadius: 3 }}>{keyword}</code>
        </div>

        {/* Code being evaluated */}
        <div style={{ background: C.bgTer, borderRadius: 6, padding: '7px 10px',
          marginBottom: 8, border: `1px solid ${C.border}` }}>
          <div style={{ color: C.purpleL, marginBottom: 3 }}>
            <span style={{ color: C.amber }}>{keyword}</span>
            {' ('}
            <span style={{ color: C.cyanL }}>{cond}</span>
            {')'}
          </div>
          <div style={{ color: C.textSec, fontSize: 10 }}>
            <span style={{ color: C.cyanL }}>{cp.calidad}</span>
            {' '}{isG1 ? '>= 90' : '>= 70'}
            {' '}
            <span style={{ color: C.textSec }}>→</span>
            {' '}
            <span style={{ color: result ? C.green : C.red, fontWeight: 700, fontSize: 12 }}>
              {String(result)}
            </span>
          </div>
        </div>

        {/* Result */}
        <div style={{ fontSize: 11, color: result ? C.green : C.red,
          fontWeight: 600, marginBottom: 10, lineHeight: 1.4 }}>
          {nextMsg}
        </div>

        {/* Siguiente button */}
        <button
          onClick={handleNext}
          style={{
            width: '100%', padding: '8px 0', fontSize: 12, fontWeight: 700,
            background: `linear-gradient(135deg, ${condColor}cc, ${condColor}88)`,
            border: `2px solid ${condColor}`, borderRadius: 8, color: 'white',
            cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
            boxShadow: `0 0 12px ${condColor}50`,
            transition: 'opacity 0.15s',
          }}
          onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseOut={e  => (e.currentTarget.style.opacity = '1')}
        >
          Siguiente →
        </button>
      </div>
    );
  }

  // ── Destination zone ─────────────────────────────────────────────────────────
  function DestZone({ x, icon, name, color }: { x: number; icon: string; name: string; color: string }) {
    const destKey = name === 'APROBADO' ? 'DESPACHO' : name === 'RETRABAJAR' ? 'REPARACION' : 'RESIDUOS';
    const count   = bDests.filter(d => d === destKey).length;
    const lit     = count > 0;
    return (
      <div style={{
        position: 'absolute', left: `${x}%`, top: `${DROP_Y + 4}%`,
        transform: 'translateX(-50%)', textAlign: 'center', minWidth: 68,
        padding: '5px 8px', border: `2px solid ${lit ? color : C.border}`,
        borderRadius: 8, background: lit ? `${color}18` : C.bgSec,
        transition: 'all 0.45s', boxShadow: lit ? `0 0 14px ${color}50` : 'none', zIndex: 2,
      }}>
        <div style={{ fontSize: 16 }}>{icon}</div>
        <div style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700,
          color: lit ? color : C.textSec, transition: 'color 0.3s' }}>{name}</div>
        {count > 0 && (
          <div style={{ fontSize: 11, color, fontWeight: 900 }}>×{count}</div>
        )}
      </div>
    );
  }

  return (
    <MechanicWrapper label="📦 Clasificador de Calidad — if / else if / else" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="📦 INICIAR CLASIFICACIÓN" />
      </div>
    </>}>
      <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>

        {/* ── 5-box queue ──────────────────────────────────────────────────── */}
        <div style={{ position: 'absolute', top: '1%', left: '2%', right: '2%',
          display: 'flex', gap: 5, alignItems: 'center' }}>
          <div style={{ fontSize: 8, color: C.textSec, fontFamily: 'monospace',
            flexShrink: 0, marginRight: 2 }}>LOTE:</div>
          {BATCH.map((box, i) => {
            const st  = bStatuses[i];
            const d   = bDests[i];
            const qc  = qualColor(box.calidad);
            const dc  = d === 'DESPACHO' ? C.green : d === 'REPARACION' ? C.amber : d === 'RESIDUOS' ? C.red : C.border;
            const isA = activeIdx === i && st === 'on-belt';
            const done = st === 'done';
            return (
              <div key={box.id} style={{
                flex: 1, padding: '4px 5px', borderRadius: 7, textAlign: 'center',
                border: `2px solid ${isA ? qc : done ? dc : C.border}`,
                background: isA ? `${qc}18` : done ? `${dc}10` : C.bgSec,
                transition: 'all 0.35s', opacity: done ? 0.75 : 1,
                boxShadow: isA ? `0 0 10px ${qc}50` : 'none',
              }}>
                <div style={{ fontSize: 13 }}>
                  {done ? (d==='DESPACHO'?'✅':d==='REPARACION'?'⚠️':'❌') : isA?'🚀':'📦'}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: qc, fontFamily: 'monospace' }}>
                  {box.calidad}%
                </div>
                <div style={{ fontSize: 7, color: C.textSec, fontFamily: 'monospace' }}>#{box.id}</div>
              </div>
            );
          })}
          {batchDone && (
            <div style={{ fontSize: 9, color: C.green, fontFamily: 'monospace',
              fontWeight: 700, flexShrink: 0 }}>✅ Lote<br/>OK</div>
          )}
        </div>

        {/* ── Belt track ───────────────────────────────────────────────────── */}
        <div style={{ position: 'absolute', top: `${BELT_Y + 1}%`, left: '3%', right: '3%',
          height: 8, background: C.bgTer, borderRadius: 4, border: `1px solid ${C.border}`, zIndex: 1 }} />
        {[0,1,2,3,4,5,6,7,8].map(i => (
          <div key={i} style={{ position: 'absolute', left: `${4+i*11}%`, top: `${BELT_Y+2}%`,
            width: '5%', height: 5, background: `${C.bgSec}90`, borderRadius: 1, zIndex: 2 }} />
        ))}
        <div style={{ position: 'absolute', left: '2%', top: `${BELT_Y - 12}%`,
          fontSize: 8, color: C.textSec, fontFamily: 'monospace', textAlign: 'center', lineHeight: 1.4 }}>
          📥<br/>INICIO</div>

        {/* ── Gate 1 (green / if ≥ 90) ─────────────────────────────────────── */}
        <div style={{ position: 'absolute', left: `${G1_X}%`, top: arm1 ? '28%' : '36%',
          transform: 'translateX(-50%)',
          width: 7, height: arm1 ? `${BELT_Y-28+6}%` : `${BELT_Y-36+6}%`,
          background: arm1 ? C.green : C.bgTer, borderRadius: 4,
          transition: 'all 0.35s ease', boxShadow: arm1 ? `0 0 12px ${C.green}90` : 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', left: `${G1_X}%`, top: '36%',
          transform: 'translate(-50%,-100%)', width: 38, height: 26,
          background: arm1 ? `${C.green}30` : C.bgSec,
          border: `2px solid ${arm1 ? C.green : C.border}`, borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
          transition: 'all 0.3s', boxShadow: arm1 ? `0 0 14px ${C.green}70` : 'none', zIndex: 2 }}>
          {arm1 ? '🟢' : '🔘'}
        </div>
        <div style={{ position: 'absolute', left: `${G1_X}%`, top: '22%',
          transform: 'translateX(-50%)', fontSize: 8, fontFamily: 'monospace',
          color: arm1 ? C.green : C.textSec, textAlign: 'center', whiteSpace: 'nowrap', zIndex: 2 }}>
          if ≥ 90</div>
        <div style={{ position: 'absolute', left: `${G1_X}%`, top: `${BELT_Y+5}%`,
          transform: 'translateX(-50%)', width: 2, height: `${DROP_Y-BELT_Y-8}%`,
          background: arm1 ? `${C.green}70` : `${C.border}30`, transition: 'background 0.5s', zIndex: 1 }} />

        {/* ── Gate 2 (yellow / else if ≥ 70) ──────────────────────────────── */}
        <div style={{ position: 'absolute', left: `${G2_X}%`, top: arm2 ? '28%' : '36%',
          transform: 'translateX(-50%)',
          width: 7, height: arm2 ? `${BELT_Y-28+6}%` : `${BELT_Y-36+6}%`,
          background: arm2 ? C.amber : C.bgTer, borderRadius: 4,
          transition: 'all 0.35s ease', boxShadow: arm2 ? `0 0 12px ${C.amber}90` : 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', left: `${G2_X}%`, top: '36%',
          transform: 'translate(-50%,-100%)', width: 38, height: 26,
          background: arm2 ? `${C.amber}30` : C.bgSec,
          border: `2px solid ${arm2 ? C.amber : C.border}`, borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
          transition: 'all 0.3s', boxShadow: arm2 ? `0 0 14px ${C.amber}70` : 'none', zIndex: 2 }}>
          {arm2 ? '🟡' : '🔘'}
        </div>
        <div style={{ position: 'absolute', left: `${G2_X}%`, top: '22%',
          transform: 'translateX(-50%)', fontSize: 8, fontFamily: 'monospace',
          color: arm2 ? C.amber : C.textSec, textAlign: 'center', whiteSpace: 'nowrap', zIndex: 2 }}>
          else if ≥ 70</div>
        <div style={{ position: 'absolute', left: `${G2_X}%`, top: `${BELT_Y+5}%`,
          transform: 'translateX(-50%)', width: 2, height: `${DROP_Y-BELT_Y-8}%`,
          background: arm2 ? `${C.amber}70` : `${C.border}30`, transition: 'background 0.5s', zIndex: 1 }} />

        {/* ── End of belt (else → RESIDUOS) ────────────────────────────────── */}
        <div style={{ position: 'absolute', left: `${END_X}%`, top: `${BELT_Y+5}%`,
          transform: 'translateX(-50%)', width: 2, height: `${DROP_Y-BELT_Y-8}%`,
          background: `${C.red}35`, zIndex: 1 }} />
        <div style={{ position: 'absolute', left: `${END_X}%`, top: '36%',
          transform: 'translate(-50%,-100%)', fontSize: 8, fontFamily: 'monospace',
          color: C.textSec, textAlign: 'center', whiteSpace: 'nowrap', zIndex: 2 }}>else</div>

        {/* ── Destination zones ─────────────────────────────────────────────── */}
        <DestZone x={G1_X}  icon="✅" name="APROBADO"   color={C.green} />
        <DestZone x={G2_X}  icon="⚠️" name="RETRABAJAR" color={C.amber} />
        <DestZone x={END_X} icon="❌" name="DESCARTE"   color={C.red}   />

        {/* ── Moving box ────────────────────────────────────────────────────── */}
        {pos && activeBox && (
          <div style={{
            position: 'absolute', left: pos.left, top: pos.top,
            transform: 'translate(-50%,-50%)',
            transition: 'left 0.5s cubic-bezier(0.4,0,0.2,1), top 0.4s ease',
            zIndex: 10, width: 38, height: 38,
            background: `linear-gradient(135deg, ${boxColor}cc, ${boxColor}77)`,
            border: `2px solid ${boxColor}`, borderRadius: 6,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 1, boxShadow: `0 3px 12px ${boxColor}55`,
          }}>
            <div style={{ fontSize: 13 }}>📦</div>
            <div style={{ fontSize: 8, color: 'white', fontFamily: 'monospace', fontWeight: 700 }}>
              {activeQual}%
            </div>
          </div>
        )}

        {/* ── Checkpoint popup (pauses animation) ───────────────────────────── */}
        {checkpoint && <CheckpointPopup cp={checkpoint} />}

        <style>{`
          @keyframes cpSlide {
            from { opacity: 0; transform: translateY(-6px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0)   scale(1);    }
          }
        `}</style>
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
        const step = steps[i];
        if (step) setLit(prev => new Set([...prev, step.fila * 4 + step.col]));
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

// ─── FORGE (p6-l1: generics <T>) ──────────────────────────────────────────────
function ForgeMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const [loading, setLoading] = useState(false);
  const [crates, setCrates]   = useState<{ label: string; value: string; tag: string; color: string }[]>([]);
  const [visible, setVisible] = useState<boolean[]>([]);
  const [success, setSuccess] = useState<boolean | null>(null);

  async function run() {
    setLoading(true); setCrates([]); setVisible([]);
    const { output, success: ok } = await onActivate();
    setSuccess(ok);
    if (ok) {
      const parsed: { label: string; value: string; tag: string; color: string }[] = [];
      for (const line of output) {
        if (line.includes('Caja:')) {
          const parts = line.replace('Caja:', '').split('→');
          const label = (parts[0] ?? '').trim();
          const value = (parts[1] ?? '').trim();
          const isNum = /^\d+/.test(value);
          parsed.push({
            label,
            value,
            tag: isNum ? '<number>' : '<Producto>',
            color: isNum ? C.amber : C.green,
          });
        } else if (line.includes('Primero del depósito:')) {
          const val = line.replace('Primero del depósito:', '').trim();
          parsed.push({ label: 'Primero', value: val, tag: '<T>', color: C.cyan });
        }
      }
      setCrates(parsed);
      parsed.forEach((_, i) => {
        setTimeout(() => setVisible(prev => { const next = [...prev]; next[i] = true; return next; }), i * 320);
      });
    }
    setLoading(false);
  }

  return (
    <MechanicWrapper label="⚗️ Forja Genérica — generics <T>" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="⚗️ FORJAR CAJAS" />
      </div>
    </>}>
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
        {crates.length === 0 && !loading && (
          <div style={{ color: C.textSec, fontFamily: 'monospace', fontSize: 12, textAlign: 'center' }}>
            Ejecutá tu código para ver las cajas genéricas
          </div>
        )}
        {crates.map((c, i) => (
          <div key={i} style={{
            opacity: visible[i] ? 1 : 0,
            transform: visible[i] ? 'translateY(0)' : 'translateY(-24px)',
            transition: 'all 0.45s cubic-bezier(0.34,1.56,0.64,1)',
            border: `2px solid ${c.color}`,
            borderRadius: 12, padding: '14px 18px', minWidth: 120,
            background: `${c.color}10`, textAlign: 'center', boxShadow: `0 0 14px ${c.color}30`,
          }}>
            <div style={{ fontSize: 9, color: c.color, fontFamily: 'monospace', marginBottom: 6, fontWeight: 700 }}>
              {c.tag}
            </div>
            <div style={{ fontSize: 11, color: C.textSec, fontFamily: 'monospace', marginBottom: 4 }}>
              {c.label}
            </div>
            <div style={{ fontSize: 16, color: c.color, fontWeight: 700, fontFamily: 'monospace' }}>
              {c.value}
            </div>
            <div style={{ marginTop: 8, fontSize: 18 }}>📦</div>
          </div>
        ))}
      </div>
    </MechanicWrapper>
  );
}

// ─── BLUEPRINT (p6-l2: classes) ───────────────────────────────────────────────
function BlueprintMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const [loading, setLoading]   = useState(false);
  const [robots, setRobots]     = useState<{ nombre: string; energia: number; piezas: number }[]>([]);
  const [phases, setPhases]     = useState<number[]>([]); // 0=hidden,1=name,2=energy,3=full
  const [total, setTotal]       = useState<number | null>(null);
  const [success, setSuccess]   = useState<boolean | null>(null);

  async function run() {
    setLoading(true); setRobots([]); setPhases([]); setTotal(null);
    const { output, success: ok } = await onActivate();
    setSuccess(ok);
    if (ok) {
      const parsed: { nombre: string; energia: number; piezas: number }[] = [];
      for (const line of output) {
        const m = line.match(/\[(.+?)\]\s*⚡(\d+)\s*🔩(\d+)/);
        if (m) parsed.push({ nombre: m[1], energia: parseInt(m[2]), piezas: parseInt(m[3]) });
        const t = line.match(/Total piezas:\s*(\d+)/);
        if (t) setTotal(parseInt(t[1]));
      }
      setRobots(parsed);
      setPhases(new Array(parsed.length).fill(0));
      parsed.forEach((_, i) => {
        setTimeout(() => setPhases(prev => { const n = [...prev]; n[i] = 1; return n; }), i * 500 + 200);
        setTimeout(() => setPhases(prev => { const n = [...prev]; n[i] = 2; return n; }), i * 500 + 600);
        setTimeout(() => setPhases(prev => { const n = [...prev]; n[i] = 3; return n; }), i * 500 + 950);
      });
    }
    setLoading(false);
  }

  return (
    <MechanicWrapper label="🤖 Blueprint de Robot — class · extends" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="🤖 ENSAMBLAR ROBOT" />
      </div>
    </>}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        {robots.length === 0 && !loading && (
          <div style={{ color: C.textSec, fontFamily: 'monospace', fontSize: 12 }}>
            Ejecutá tu código para ver los robots ensamblarse
          </div>
        )}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          {robots.map((r, i) => (
            <div key={i} style={{
              border: `2px solid ${phases[i] >= 1 ? C.purple : C.border}`,
              borderRadius: 12, padding: '14px 18px', minWidth: 150,
              background: C.bgSec, transition: 'all 0.4s',
              boxShadow: phases[i] >= 3 ? `0 0 16px ${C.purple}40` : 'none',
              opacity: phases[i] >= 1 ? 1 : 0, transform: phases[i] >= 1 ? 'scale(1)' : 'scale(0.8)',
            }}>
              {/* Name badge */}
              <div style={{
                fontSize: 12, fontWeight: 700, color: C.purpleL, fontFamily: 'monospace',
                marginBottom: 10, textAlign: 'center',
                opacity: phases[i] >= 1 ? 1 : 0, transition: 'opacity 0.3s',
              }}>
                🤖 {r.nombre}
              </div>
              {/* Energy bar */}
              {phases[i] >= 2 && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: C.textSec, fontFamily: 'monospace', marginBottom: 3 }}>
                    ⚡ Energía {r.energia}%
                  </div>
                  <div style={{ height: 8, background: C.bgTer, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${r.energia}%`, background: C.cyan,
                      borderRadius: 4, transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              )}
              {/* Pieces */}
              {phases[i] >= 3 && (
                <div style={{ fontSize: 12, color: C.green, fontFamily: 'monospace', textAlign: 'center' }}>
                  🔩 {r.piezas} piezas
                </div>
              )}
            </div>
          ))}
        </div>
        {total !== null && phases.every(p => p >= 3) && (
          <div style={{ fontSize: 13, color: C.green, fontFamily: 'monospace', fontWeight: 700 }}>
            ✅ Total producción: {total} piezas
          </div>
        )}
      </div>
    </MechanicWrapper>
  );
}

// ─── RECURSION TREE (p6-l3: recursion) ────────────────────────────────────────
function RecursionTreeMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const [loading, setLoading] = useState(false);
  const [litNodes, setLitNodes] = useState<Set<string>>(new Set());
  const [total, setTotal]     = useState<number | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  // Animation sequence for recursion tree: leaves → root
  const SEQUENCE = ['A1', 'B', 'A', 'Principal'];

  async function run() {
    setLoading(true); setLitNodes(new Set()); setTotal(null);
    const { output, success: ok } = await onActivate();
    setSuccess(ok);
    if (ok) {
      const t = output.find(l => l.includes('Total piezas:'));
      if (t) {
        const m = t.match(/Total piezas:\s*(\d+)/);
        if (m) {
          const finalTotal = parseInt(m[1]);
          SEQUENCE.forEach((nodeId, i) => {
            setTimeout(() => {
              setLitNodes(prev => new Set([...prev, nodeId]));
              if (i === SEQUENCE.length - 1) setTotal(finalTotal);
            }, i * 400 + 200);
          });
        }
      }
    }
    setLoading(false);
  }

  const nodeStyle = (id: string) => ({
    border: `2px solid ${litNodes.has(id) ? C.cyan : C.border}`,
    borderRadius: 8, padding: '8px 12px', textAlign: 'center' as const,
    background: litNodes.has(id) ? `${C.cyan}15` : C.bgSec,
    boxShadow: litNodes.has(id) ? `0 0 12px ${C.cyan}40` : 'none',
    transition: 'all 0.35s', minWidth: 80,
    fontFamily: 'monospace',
  });

  return (
    <MechanicWrapper label="🌳 Árbol de Cajas — recursión · caso base" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="🌳 CONTAR ÁRBOL" />
      </div>
    </>}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {/* Row 0: Principal */}
        <div style={nodeStyle('Principal')}>
          <div style={{ fontSize: 10, color: C.textSec }}>Principal</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: litNodes.has('Principal') ? C.cyan : C.text }}>
            {total !== null && litNodes.has('Principal') ? total : 10} 🔩
          </div>
        </div>
        {/* Connector lines */}
        <div style={{ display: 'flex', gap: 60, position: 'relative', alignItems: 'flex-start' }}>
          <div style={{ position: 'absolute', top: -8, left: '50%', width: 1, height: 8, background: C.border }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            {/* Row 1: A */}
            <div style={{ width: 1, height: 16, background: C.border }} />
            <div style={nodeStyle('A')}>
              <div style={{ fontSize: 10, color: C.textSec }}>A</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: litNodes.has('A') ? C.cyan : C.text }}>
                {litNodes.has('A') ? 70 : 50} 🔩
              </div>
            </div>
            <div style={{ width: 1, height: 16, background: C.border }} />
            {/* Row 2: A1 */}
            <div style={nodeStyle('A1')}>
              <div style={{ fontSize: 10, color: C.textSec }}>A1</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: litNodes.has('A1') ? C.cyan : C.text }}>
                20 🔩
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            {/* Row 1: B */}
            <div style={{ width: 1, height: 16, background: C.border }} />
            <div style={nodeStyle('B')}>
              <div style={{ fontSize: 10, color: C.textSec }}>B</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: litNodes.has('B') ? C.cyan : C.text }}>
                30 🔩
              </div>
            </div>
          </div>
        </div>
        {total !== null && (
          <div style={{ fontSize: 12, color: C.green, fontFamily: 'monospace', marginTop: 8, fontWeight: 700 }}>
            contarTotal() = {total} ✅
          </div>
        )}
      </div>
    </MechanicWrapper>
  );
}

// ─── BAR SORT (p7-l1: sorting) ────────────────────────────────────────────────
function BarSortMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const INITIAL = [64, 34, 25, 12, 22, 11, 90];
  const [loading, setLoading] = useState(false);
  const [bars, setBars]       = useState<number[]>(INITIAL);
  const [sorted, setSorted]   = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  async function run() {
    setLoading(true); setBars(INITIAL); setSorted(false);
    const { output, success: ok } = await onActivate();
    setSuccess(ok);
    if (ok) {
      const line = output.find(l => l.includes('Ordenado:'));
      if (line) {
        const m = line.match(/\[([^\]]+)\]/);
        if (m) {
          const nums = m[1].split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
          if (nums.length > 0) {
            setTimeout(() => { setBars(nums); setSorted(true); }, 600);
          }
        }
      }
    }
    setLoading(false);
  }

  const maxVal = Math.max(...bars, 1);

  return (
    <MechanicWrapper label="📊 Clasificadora de Pedidos — Bubble Sort · Array.sort()" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="📊 ORDENAR LOTE" />
      </div>
    </>}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-end', padding: '8px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: '80%', width: '100%', justifyContent: 'center' }}>
          {bars.map((val, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1, maxWidth: 52 }}>
              <div style={{ fontSize: 10, color: sorted ? C.green : C.textSec, fontFamily: 'monospace', fontWeight: 700 }}>
                {val}
              </div>
              <div style={{
                width: '100%', height: `${(val / maxVal) * 160}px`,
                background: sorted
                  ? `linear-gradient(180deg, ${C.green}, #16a34a)`
                  : `linear-gradient(180deg, ${C.purple}, #5b21b6)`,
                borderRadius: '6px 6px 2px 2px',
                transition: 'height 0.8s cubic-bezier(0.34,1.56,0.64,1), background 0.5s',
                boxShadow: sorted ? `0 0 10px ${C.green}40` : `0 0 6px ${C.purple}30`,
              }} />
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: sorted ? C.green : C.textSec, fontFamily: 'monospace', marginTop: 10 }}>
          {sorted ? '✅ Ordenado ascendente' : '● Sin ordenar'}
        </div>
      </div>
    </MechanicWrapper>
  );
}

// ─── MAZE (p7-l2: DFS) ────────────────────────────────────────────────────────
function MazeMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const GRID = [
    ['.', '.', '#', '.', 'E'],
    ['#', '.', '#', '.', '#'],
    ['.', '.', '.', '.', '#'],
    ['.', '#', '#', '.', '.'],
    ['S', '.', '.', '#', '.'],
  ];
  // Known valid path for S=[4,0] to E=[0,4]
  const FALLBACK_PATH: [number, number][] = [
    [4,0],[3,0],[2,0],[2,1],[2,2],[2,3],[1,3],[0,3],[0,4]
  ];

  const [loading, setLoading] = useState(false);
  const [activePath, setActivePath] = useState<Set<string>>(new Set());
  const [robotPos, setRobotPos]    = useState<[number,number] | null>(null);
  const [done, setDone]            = useState(false);
  const [success, setSuccess]      = useState<boolean | null>(null);

  async function run() {
    setLoading(true); setActivePath(new Set()); setRobotPos(null); setDone(false);
    const { output, success: ok } = await onActivate();
    setSuccess(ok);
    if (ok) {
      // Parse path from output lines like "  → [r,c]"
      const pathSteps: [number, number][] = [];
      for (const line of output) {
        const m = line.match(/→\s*\[(\d+),\s*(\d+)\]/);
        if (m) pathSteps.push([parseInt(m[1]), parseInt(m[2])]);
      }
      const path = pathSteps.length >= 2 ? pathSteps : FALLBACK_PATH;
      path.forEach((pos, i) => {
        setTimeout(() => {
          const key = `${pos[0]},${pos[1]}`;
          setActivePath(prev => new Set([...prev, key]));
          setRobotPos(pos);
          if (i === path.length - 1) setDone(true);
        }, i * 230);
      });
    }
    setLoading(false);
  }

  function cellColor(cell: string, r: number, c: number): string {
    const key = `${r},${c}`;
    if (activePath.has(key) && cell !== 'S' && cell !== 'E') return C.purple;
    if (cell === 'S') return C.green;
    if (cell === 'E') return done ? C.green : C.cyan;
    if (cell === '#') return '#1a1f26';
    return C.bgSec;
  }

  function cellBorder(cell: string, r: number, c: number): string {
    const key = `${r},${c}`;
    if (cell === 'S') return C.green;
    if (cell === 'E') return done ? C.green : C.cyan;
    if (activePath.has(key)) return C.purpleL;
    return C.border;
  }

  return (
    <MechanicWrapper label="🔍 Laberinto del Almacén — DFS · stack · Set<string>" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="🔍 BUSCAR CAMINO" />
      </div>
    </>}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 48px)',
          gridTemplateRows: 'repeat(5, 44px)', gap: 4 }}>
          {GRID.map((row, r) => row.map((cell, c) => {
            const isRobot = robotPos && robotPos[0] === r && robotPos[1] === c;
            return (
              <div key={`${r},${c}`} style={{
                border: `2px solid ${cellBorder(cell, r, c)}`,
                borderRadius: 6, background: cellColor(cell, r, c),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: cell === '#' ? 14 : 12, fontWeight: 700,
                color: cell === '#' ? '#2d333b' : C.text,
                transition: 'all 0.25s',
                boxShadow: activePath.has(`${r},${c}`) ? `0 0 8px ${C.purple}60` : 'none',
              }}>
                {isRobot ? '🤖' : cell === '#' ? '▪' : cell === 'S' ? 'S' : cell === 'E' ? 'E' : ''}
              </div>
            );
          }))}
        </div>
        <div style={{ fontSize: 11, fontFamily: 'monospace', color: done ? C.green : C.textSec }}>
          {done ? '✅ ¡Envío encontrado!' : robotPos ? '🤖 Navegando...' : 'S = inicio · E = destino · # = pared'}
        </div>
      </div>
    </MechanicWrapper>
  );
}

// ─── PARALLEL (p7-l3: async/await) ────────────────────────────────────────────
function ParallelMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const TASKS = [
    { nombre: 'Ensamblado',  ms: 1200, emoji: '🔩' },
    { nombre: 'Pintado',     ms: 1600, emoji: '🎨' },
    { nombre: 'Control QA',  ms: 800,  emoji: '🔬' },
    { nombre: 'Despacho',    ms: 2000, emoji: '📦' },
  ];

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number[]>([0, 0, 0, 0]);
  const [done, setDone]         = useState<boolean[]>([false, false, false, false]);
  const [allDone, setAllDone]   = useState(false);
  const [success, setSuccess]   = useState<boolean | null>(null);
  const timersRef = useRef<ReturnType<typeof setInterval>[]>([]);

  async function run() {
    timersRef.current.forEach(clearInterval);
    setLoading(true); setProgress([0,0,0,0]); setDone([false,false,false,false]); setAllDone(false);
    const { success: ok } = await onActivate();
    setSuccess(ok);
    if (ok) {
      const intervals: ReturnType<typeof setInterval>[] = [];
      TASKS.forEach((task, i) => {
        const steps = 30;
        const stepMs = task.ms / steps;
        let step = 0;
        const iv = setInterval(() => {
          step++;
          const pct = Math.min(100, Math.round((step / steps) * 100));
          setProgress(prev => { const n = [...prev]; n[i] = pct; return n; });
          if (step >= steps) {
            clearInterval(iv);
            setDone(prev => { const n = [...prev]; n[i] = true; return n; });
          }
        }, stepMs);
        intervals.push(iv);
      });
      timersRef.current = intervals;
      setTimeout(() => setAllDone(true), Math.max(...TASKS.map(t => t.ms)) + 100);
    }
    setLoading(false);
  }

  return (
    <MechanicWrapper label="⚡ Fábrica Multi-Robot — Promise.all · async/await" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="⚡ LANZAR TURNO" />
      </div>
    </>}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', gap: 14, padding: '0 8px' }}>
        {TASKS.map((task, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 16, width: 24 }}>{task.emoji}</div>
            <div style={{ fontSize: 11, color: C.textSec, fontFamily: 'monospace', width: 90, flexShrink: 0 }}>
              {task.nombre}
            </div>
            <div style={{ flex: 1, height: 14, background: C.bgTer, borderRadius: 7, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${progress[i]}%`,
                background: done[i] ? `linear-gradient(90deg, ${C.green}, #16a34a)` : `linear-gradient(90deg, ${C.cyan}, #0891b2)`,
                borderRadius: 7, transition: 'width 0.06s linear, background 0.4s',
                boxShadow: done[i] ? `0 0 8px ${C.green}60` : `0 0 6px ${C.cyan}40`,
              }} />
            </div>
            <div style={{ width: 28, textAlign: 'center', fontSize: 14 }}>
              {done[i] ? '✅' : `${progress[i]}%`}
            </div>
          </div>
        ))}
        {allDone && (
          <div style={{ textAlign: 'center', fontSize: 13, color: C.green,
            fontFamily: 'monospace', fontWeight: 700, marginTop: 4 }}>
            🎉 Turno cerrado — Promise.all completado
          </div>
        )}
      </div>
    </MechanicWrapper>
  );
}

// ─── Phase 8-11 Mechanics ──────────────────────────────────────────────────────

function InspectorMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const FIELDS = [
    { key: 'nombre',        label: 'nombre: string',       included: true },
    { key: 'modelo',        label: 'modelo: string',       included: true },
    { key: 'energia',       label: 'energia: number',      included: false },
    { key: 'piezas',        label: 'piezas: number',       included: false },
    { key: 'codigoInterno', label: 'codigoInterno: string',included: false },
  ];
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [success, setSuccess] = useState<boolean | null>(null);

  async function run() {
    setLoading(true); setRevealed(0);
    const { success: ok } = await onActivate();
    setSuccess(ok);
    if (ok) {
      for (let i = 1; i <= FIELDS.length; i++) {
        await new Promise(r => setTimeout(r, 220 * i));
        setRevealed(i);
      }
    }
    setLoading(false);
  }

  return (
    <MechanicWrapper label="🔍 Inspector de Partes — Pick · Omit · Partial" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="🔍 INSPECCIONAR ROBOT" />
      </div>
    </>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 8px', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: 10, color: C.textSec, fontFamily: 'monospace', marginBottom: 4 }}>
          Pick&lt;Robot, "nombre" | "modelo"&gt;
        </div>
        {FIELDS.map((f, i) => (
          <div key={f.key} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '7px 12px', borderRadius: 8,
            border: `1px solid ${revealed > i ? (f.included ? C.green : C.border) : C.border}`,
            background: revealed > i ? (f.included ? '#22c55e14' : C.bgSec) : C.bgTer,
            opacity: revealed > i ? 1 : 0.35,
            transition: 'all 0.3s',
          }}>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: C.text, flex: 1 }}>{f.label}</span>
            {revealed > i && (
              <span style={{ fontSize: 11, fontWeight: 700,
                color: f.included ? C.green : C.textSec }}>
                {f.included ? '✅ Pick' : '⬜ Omit'}
              </span>
            )}
          </div>
        ))}
        {revealed >= FIELDS.length && (
          <div style={{ textAlign: 'center', fontSize: 11, color: C.cyan, fontFamily: 'monospace', marginTop: 4 }}>
            Pick: 2 campos · Omit: 3 campos
          </div>
        )}
      </div>
    </MechanicWrapper>
  );
}

function CatalogMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const ITEMS = [
    { nombre: 'pernos',    stock: 500 },
    { nombre: 'tuercas',   stock: 320 },
    { nombre: 'arandelas', stock: 150 },
    { nombre: 'engranajes',stock: 45  },
  ];
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [locked, setLocked] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  async function run() {
    setLoading(true); setRevealed(0); setLocked(false);
    const { success: ok } = await onActivate();
    setSuccess(ok);
    if (ok) {
      for (let i = 1; i <= ITEMS.length; i++) {
        await new Promise(r => setTimeout(r, 300 * i));
        setRevealed(i);
      }
      await new Promise(r => setTimeout(r, 400));
      setLocked(true);
    }
    setLoading(false);
  }

  return (
    <MechanicWrapper label="📋 Catálogo Inmutable — Record · Readonly" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="📋 CARGAR CATÁLOGO" />
      </div>
    </>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: 12, height: '100%', alignContent: 'center' }}>
        {ITEMS.map((item, i) => (
          <div key={item.nombre} style={{
            padding: '10px 12px', borderRadius: 10,
            border: `1px solid ${revealed > i ? C.amber : C.border}`,
            background: revealed > i ? '#f59e0b0e' : C.bgTer,
            opacity: revealed > i ? 1 : 0.3,
            transform: revealed > i ? 'scale(1)' : 'scale(0.92)',
            transition: 'all 0.35s',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <div style={{ fontSize: 11, color: C.text, fontFamily: 'monospace', fontWeight: 700 }}>{item.nombre}</div>
            <div style={{ fontSize: 13, color: C.amber, fontWeight: 700 }}>{item.stock} uds</div>
            {locked && revealed > i && (
              <div style={{ fontSize: 10, color: C.textSec }}>🔒 Readonly</div>
            )}
          </div>
        ))}
        {locked && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', fontSize: 11, color: C.green, fontFamily: 'monospace' }}>
            Catálogo sellado — Readonly activo ✅
          </div>
        )}
      </div>
    </MechanicWrapper>
  );
}

function TransformerMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const FIELDS = [
    { name: 'nombre', before: 'string',  after: 'string | null' },
    { name: 'energia',before: 'number',  after: 'number | null' },
    { name: 'activo', before: 'boolean', after: 'boolean | null'},
  ];
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<'idle'|'transforming'|'done'>('idle');
  const [transformed, setTransformed] = useState(0);
  const [success, setSuccess] = useState<boolean | null>(null);

  async function run() {
    setLoading(true); setPhase('idle'); setTransformed(0);
    const { success: ok } = await onActivate();
    setSuccess(ok);
    if (ok) {
      setPhase('transforming');
      for (let i = 1; i <= FIELDS.length; i++) {
        await new Promise(r => setTimeout(r, 350));
        setTransformed(i);
      }
      setPhase('done');
    }
    setLoading(false);
  }

  return (
    <MechanicWrapper label="⚙️ Transformador de Esquemas — Mapped Types" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="⚙️ TRANSFORMAR ESQUEMA" />
      </div>
    </>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '10px 8px', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: 10, color: C.textSec, fontFamily: 'monospace', marginBottom: 2 }}>
          type Nullable&lt;T&gt; = {'{ [K in keyof T]: T[K] | null }'}
        </div>
        {FIELDS.map((f, i) => (
          <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ padding: '6px 10px', borderRadius: 6, background: C.bgTer,
              border: `1px solid ${C.border}`, fontFamily: 'monospace', fontSize: 11, flex: 1 }}>
              <span style={{ color: C.cyan }}>{f.name}</span>
              <span style={{ color: C.textSec }}>: {f.before}</span>
            </div>
            <div style={{
              fontSize: 18, color: C.purple, opacity: transformed > i ? 1 : 0.15,
              transform: transformed > i ? 'translateX(0)' : 'translateX(-6px)',
              transition: 'all 0.3s',
            }}>→</div>
            <div style={{
              padding: '6px 10px', borderRadius: 6, flex: 1,
              background: transformed > i ? '#7c3aed18' : C.bgTer,
              border: `1px solid ${transformed > i ? C.purple : C.border}`,
              fontFamily: 'monospace', fontSize: 11,
              opacity: transformed > i ? 1 : 0.2,
              transition: 'all 0.4s',
            }}>
              <span style={{ color: C.cyan }}>{f.name}</span>
              <span style={{ color: transformed > i ? C.purpleL : C.textSec }}>: {f.after}</span>
            </div>
          </div>
        ))}
        {phase === 'done' && (
          <div style={{ textAlign: 'center', fontSize: 11, color: C.green, fontFamily: 'monospace', marginTop: 4 }}>
            Mapped type aplicado: {FIELDS.length} campos transformados ✅
          </div>
        )}
      </div>
    </MechanicWrapper>
  );
}

function NarrowerMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const ITEMS = [
    { tipo: 'metal',      emoji: '⚙️', color: '#94a3b8', label: 'Metal: 2.5kg' },
    { tipo: 'electronica',emoji: '⚡', color: C.cyan,    label: 'Electronica: 12V' },
    { tipo: 'metal',      emoji: '⚙️', color: '#94a3b8', label: 'Metal: 0.8kg' },
    { tipo: 'electronica',emoji: '⚡', color: C.cyan,    label: 'Electronica: 5V' },
  ];
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(0);
  const [success, setSuccess] = useState<boolean | null>(null);

  async function run() {
    setLoading(true); setScanned(0);
    const { success: ok } = await onActivate();
    setSuccess(ok);
    if (ok) {
      for (let i = 1; i <= ITEMS.length; i++) {
        await new Promise(r => setTimeout(r, 500));
        setScanned(i);
      }
    }
    setLoading(false);
  }

  return (
    <MechanicWrapper label="🔬 Escáner de Tipos — typeof · instanceof · in" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="🔬 ESCANEAR LOTE" />
      </div>
    </>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 8px', height: '100%', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {ITEMS.map((item, i) => (
            <div key={i} style={{
              width: 72, padding: '10px 6px', borderRadius: 10, textAlign: 'center',
              border: `2px solid ${scanned > i ? item.color : C.border}`,
              background: scanned > i ? `${item.color}18` : C.bgTer,
              transition: 'all 0.4s',
            }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{item.emoji}</div>
              {scanned > i ? (
                <>
                  <div style={{ fontSize: 9, color: item.color, fontWeight: 700, fontFamily: 'monospace' }}>
                    {item.tipo}
                  </div>
                  <div style={{ fontSize: 9, color: C.textSec, fontFamily: 'monospace', marginTop: 2 }}>
                    {item.label}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 9, color: C.textSec }}>?</div>
              )}
            </div>
          ))}
        </div>
        {scanned > 0 && (
          <div style={{ textAlign: 'center', fontSize: 11, color: C.textSec, fontFamily: 'monospace' }}>
            Escaneadas: {scanned}/{ITEMS.length} piezas
          </div>
        )}
        {scanned >= ITEMS.length && (
          <div style={{ textAlign: 'center', fontSize: 11, color: C.green, fontFamily: 'monospace' }}>
            ✅ Type narrowing completado
          </div>
        )}
      </div>
    </MechanicWrapper>
  );
}

function SwitcherMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const EVENTS = [
    { tipo: 'produccion',   emoji: '✅', color: C.green,  label: 'Producción: 150 piezas' },
    { tipo: 'falla',        emoji: '⚠️', color: C.red,    label: 'Falla ERR-042 — CRÍTICA' },
    { tipo: 'mantenimiento',emoji: '🔧', color: C.amber,  label: 'Mantenimiento: 30 min' },
    { tipo: 'falla',        emoji: '⚠️', color: '#f97316',label: 'Falla WARN-007' },
  ];
  const [loading, setLoading] = useState(false);
  const [processed, setProcessed] = useState(0);
  const [success, setSuccess] = useState<boolean | null>(null);

  async function run() {
    setLoading(true); setProcessed(0);
    const { success: ok } = await onActivate();
    setSuccess(ok);
    if (ok) {
      for (let i = 1; i <= EVENTS.length; i++) {
        await new Promise(r => setTimeout(r, 450));
        setProcessed(i);
      }
    }
    setLoading(false);
  }

  return (
    <MechanicWrapper label="📡 Clasificador — Discriminated Unions · never" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="📡 PROCESAR EVENTOS" />
      </div>
    </>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 8px', height: '100%', justifyContent: 'center' }}>
        {EVENTS.map((ev, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8,
            border: `1px solid ${processed > i ? ev.color : C.border}`,
            background: processed > i ? `${ev.color}14` : C.bgTer,
            opacity: processed > i ? 1 : 0.35,
            transform: processed > i ? 'translateX(0)' : 'translateX(-8px)',
            transition: 'all 0.35s',
          }}>
            <span style={{ fontSize: 16 }}>{ev.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: ev.color, fontFamily: 'monospace', fontWeight: 700 }}>{ev.tipo}</div>
              <div style={{ fontSize: 10, color: C.textSec }}>{ev.label}</div>
            </div>
            {processed > i && (
              <span style={{ fontSize: 10, color: C.green }}>handled</span>
            )}
          </div>
        ))}
        {processed >= EVENTS.length && (
          <div style={{ textAlign: 'center', fontSize: 11, color: C.cyan, fontFamily: 'monospace' }}>
            Switch exhaustivo: ✅ todos los casos cubiertos
          </div>
        )}
      </div>
    </MechanicWrapper>
  );
}

function FaultlogMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const [loading, setLoading] = useState(false);
  const [lines, setLines] = useState<{ text: string; color: string }[]>([]);
  const [success, setSuccess] = useState<boolean | null>(null);

  function colorForLine(l: string): string {
    if (l.includes('✅') || l.includes('ensamblada')) return C.green;
    if (l.includes('ErrorEnergia') || l.includes('insuficiente') || l.includes('nivelActual')) return C.amber;
    if (l.includes('ErrorPieza') || l.includes('inválida')) return C.red;
    if (l.includes('Protocolo')) return C.cyan;
    return C.textSec;
  }

  async function run() {
    setLoading(true); setLines([]);
    const { output, success: ok } = await onActivate();
    setSuccess(ok);
    for (let i = 0; i < output.length; i++) {
      await new Promise(r => setTimeout(r, 160));
      setLines(prev => [...prev, { text: output[i], color: colorForLine(output[i]) }]);
    }
    setLoading(false);
  }

  return (
    <MechanicWrapper label="⚠️ Log de Fallas — Custom Error Classes" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="⚠️ SIMULAR FALLAS" />
      </div>
    </>}>
      <div style={{ flex: 1, background: '#0a0e14', borderRadius: 8, margin: '10px 8px',
        padding: '10px 12px', fontFamily: 'monospace', fontSize: 11,
        overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ color: '#4b5563', marginBottom: 4 }}>{'// error.log'}</div>
        {lines.map((l, i) => (
          <div key={i} style={{
            color: l.color, opacity: 1,
            animation: 'fadeSlideIn 0.2s ease-out',
          }}>
            {'> '}{l.text}
          </div>
        ))}
        {loading && <div style={{ color: C.textSec }}>{'> '}<span style={{ animation: 'blink 1s infinite' }}>█</span></div>}
      </div>
    </MechanicWrapper>
  );
}

function ResultBoardMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const [loading, setLoading] = useState(false);
  const [okItems, setOkItems] = useState<string[]>([]);
  const [errItems, setErrItems] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  async function run() {
    setLoading(true); setOkItems([]); setErrItems([]); setDone(false);
    const { output, success: ok } = await onActivate();
    setSuccess(ok);
    const oks = output.filter(l => l.startsWith('✅'));
    const errs = output.filter(l => l.startsWith('❌'));
    for (let i = 0; i < Math.max(oks.length, errs.length); i++) {
      await new Promise(r => setTimeout(r, 300));
      if (oks[i]) setOkItems(prev => [...prev, oks[i].replace('✅ ', '')]);
      if (errs[i]) setErrItems(prev => [...prev, errs[i].replace('❌ ', '')]);
    }
    setDone(true);
    setLoading(false);
  }

  return (
    <MechanicWrapper label="✅ Tablero de Resultados — Result&lt;T, E&gt; Pattern" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="✅ VALIDAR LOTE" />
      </div>
    </>}>
      <div style={{ display: 'flex', gap: 8, padding: '10px 8px', height: '100%' }}>
        {/* OK column */}
        <div style={{ flex: 1, border: `1px solid ${C.green}60`, borderRadius: 8,
          padding: '8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 10, color: C.green, fontWeight: 700, fontFamily: 'monospace' }}>
            {'{ ok: true }'}
          </div>
          {okItems.map((item, i) => (
            <div key={i} style={{ fontSize: 10, color: C.green, background: '#22c55e14',
              padding: '4px 8px', borderRadius: 5, fontFamily: 'monospace' }}>
              ✅ {item}
            </div>
          ))}
          {done && <div style={{ fontSize: 10, color: C.textSec, marginTop: 'auto' }}>
            Aprobadas: {okItems.length}
          </div>}
        </div>
        {/* ERR column */}
        <div style={{ flex: 1, border: `1px solid ${C.red}60`, borderRadius: 8,
          padding: '8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 10, color: C.red, fontWeight: 700, fontFamily: 'monospace' }}>
            {'{ ok: false }'}
          </div>
          {errItems.map((item, i) => (
            <div key={i} style={{ fontSize: 10, color: C.red, background: '#ef444414',
              padding: '4px 8px', borderRadius: 5, fontFamily: 'monospace' }}>
              ❌ {item}
            </div>
          ))}
          {done && <div style={{ fontSize: 10, color: C.textSec, marginTop: 'auto' }}>
            Rechazadas: {errItems.length}
          </div>}
        </div>
      </div>
      {done && (
        <div style={{ textAlign: 'center', fontSize: 11, color: C.cyan, fontFamily: 'monospace', padding: '0 8px 8px' }}>
          Result&lt;T,E&gt; pattern: sin excepciones ✅
        </div>
      )}
    </MechanicWrapper>
  );
}

function FactoryCompleteMechanic({ stampsRequired, stampedCount, onActivate }: MechanicProps) {
  const MODULES = [
    { label: 'Generics',      emoji: '⚗️', color: C.purple  },
    { label: 'Clases',        emoji: '🤖', color: C.cyan    },
    { label: 'Utility Types', emoji: '🔍', color: C.amber   },
    { label: 'Async/Result',  emoji: '⚡', color: C.green   },
  ];
  const [loading, setLoading] = useState(false);
  const [lit, setLit] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  async function run() {
    setLoading(true); setLit(0); setCelebrating(false);
    const { success: ok } = await onActivate();
    setSuccess(ok);
    if (ok) {
      for (let i = 1; i <= MODULES.length; i++) {
        await new Promise(r => setTimeout(r, 500));
        setLit(i);
      }
      await new Promise(r => setTimeout(r, 300));
      setCelebrating(true);
    }
    setLoading(false);
  }

  return (
    <MechanicWrapper label="🏭 Fábrica Olympus — Sistema Completo" bottom={<>
      <FeedbackLine success={success} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <StampDots required={stampsRequired} count={stampedCount} />
        <ActionBtn onClick={run} loading={loading} label="🏭 ACTIVAR FÁBRICA" />
      </div>
    </>}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', height: '100%', gap: 12, padding: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
          {MODULES.map((m, i) => (
            <div key={i} style={{
              padding: '12px 8px', borderRadius: 10, textAlign: 'center',
              border: `2px solid ${lit > i ? m.color : C.border}`,
              background: lit > i ? `${m.color}1a` : C.bgTer,
              boxShadow: lit > i ? `0 0 16px ${m.color}40` : 'none',
              transition: 'all 0.5s',
            }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{m.emoji}</div>
              <div style={{ fontSize: 10, color: lit > i ? m.color : C.textSec,
                fontWeight: 700, fontFamily: 'monospace' }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
        {celebrating && (
          <div style={{ textAlign: 'center', animation: 'fadeSlideIn 0.5s ease-out' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#f59e0b',
              fontFamily: 'monospace', marginBottom: 4 }}>
              🏆 TypeScript Quest completado
            </div>
            <div style={{ fontSize: 12, color: C.cyan, fontFamily: 'monospace' }}>
              🎓 Certificado: TypeScript Master
            </div>
            <div style={{ fontSize: 20, marginTop: 6 }}>🎉 🎊 🎉</div>
          </div>
        )}
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
    case 'pipeline':        return <PipelineMechanic      {...props} />;
    case 'forge':           return <ForgeMechanic          {...props} />;
    case 'blueprint':       return <BlueprintMechanic      {...props} />;
    case 'recursion-tree':  return <RecursionTreeMechanic  {...props} />;
    case 'bar-sort':        return <BarSortMechanic         {...props} />;
    case 'maze':            return <MazeMechanic            {...props} />;
    case 'parallel':        return <ParallelMechanic        {...props} />;
    case 'inspector':       return <InspectorMechanic       {...props} />;
    case 'catalog':         return <CatalogMechanic         {...props} />;
    case 'transformer':     return <TransformerMechanic     {...props} />;
    case 'narrower':        return <NarrowerMechanic        {...props} />;
    case 'switcher':        return <SwitcherMechanic        {...props} />;
    case 'faultlog':        return <FaultlogMechanic        {...props} />;
    case 'result-board':    return <ResultBoardMechanic     {...props} />;
    case 'factory-complete':return <FactoryCompleteMechanic {...props} />;
    default:                return null; // 'speech' uses FactoryCanvas
  }
}

// Suppress unused import warning — useEffect available if needed in sub-components
void useEffect;
