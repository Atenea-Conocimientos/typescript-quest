import { useState, useRef, useCallback } from 'react';
import EditorPanel from '../editor/EditorPanel';
import Mentor from '../mentors/Mentor';
import { LEVELS_BY_ID, INITIAL_LEVEL_ID, ALL_LEVELS } from '../levels';
import { runCode } from '../engine/GameEngine';
import { RunResult } from '../engine/types';
import FactoryCanvas from './FactoryCanvas';
import MechanicCanvas from './MechanicCanvas';
import DevPanel from './DevPanel';

export default function GameScreen() {
  const [currentLevelId, setCurrentLevelId] = useState(INITIAL_LEVEL_ID);
  const [completedLevels, setCompletedLevels] = useState<Set<string>>(new Set());
  const [successState, setSuccessState] = useState(false);
  const [stampedCount, setStampedCount] = useState(0);

  // Last run output — shared between EditorPanel (Deploy) and canvas mechanics
  const [lastOutput, setLastOutput]   = useState<string[]>([]);
  const [lastSuccess, setLastSuccess] = useState(false);

  const currentCodeRef = useRef<string>(LEVELS_BY_ID[INITIAL_LEVEL_ID]?.starterCode ?? '');

  const level = LEVELS_BY_ID[currentLevelId];
  const stampsRequired = level.stampsRequired ?? 0;
  const usesPhaser = level.mechanic === 'speech';

  // ── Deploy button handler (EditorPanel) ──────────────────────────────────────
  function handleResult(result: RunResult) {
    setLastOutput(result.output);
    const valid = result.success && level.validate(result.output);
    setLastSuccess(valid);
    if (stampsRequired === 0) {
      if (valid) {
        setSuccessState(true);
        setCompletedLevels((prev) => new Set([...prev, currentLevelId]));
      } else {
        setSuccessState(false);
      }
    }
  }

  // ── FactoryCanvas stamp handler (speech mechanic) ─────────────────────────────
  const handleRunCode = useCallback(async (): Promise<boolean> => {
    const code = currentCodeRef.current;
    const result = await runCode(code);
    setLastOutput(result.output);
    const valid = result.success && level.validate(result.output);
    setLastSuccess(valid);
    if (valid) {
      setStampedCount((prev) => {
        const next = prev + 1;
        if (next >= stampsRequired) {
          setSuccessState(true);
          setCompletedLevels((c) => new Set([...c, currentLevelId]));
        }
        return next;
      });
      return true;
    }
    return false;
  }, [level, stampsRequired, currentLevelId]);

  // ── MechanicCanvas activate handler (all non-speech mechanics) ───────────────
  const handleActivate = useCallback(async (): Promise<{ output: string[]; success: boolean }> => {
    const code = currentCodeRef.current;
    const result = await runCode(code);
    setLastOutput(result.output);
    const valid = result.success && level.validate(result.output);
    setLastSuccess(valid);
    if (valid) {
      if (stampsRequired > 0) {
        setStampedCount((prev) => {
          const next = prev + 1;
          if (next >= stampsRequired) {
            setSuccessState(true);
            setCompletedLevels((c) => new Set([...c, currentLevelId]));
          }
          return next;
        });
      } else {
        setSuccessState(true);
        setCompletedLevels((c) => new Set([...c, currentLevelId]));
      }
    }
    return { output: result.output, success: valid };
  }, [level, stampsRequired, currentLevelId]);

  // ── Navigation ────────────────────────────────────────────────────────────────
  function handleNextLevel() {
    const currentIndex = ALL_LEVELS.findIndex((l) => l.id === currentLevelId);
    if (currentIndex < ALL_LEVELS.length - 1) {
      const nextLevel = ALL_LEVELS[currentIndex + 1];
      setCurrentLevelId(nextLevel.id);
      setSuccessState(false);
      setStampedCount(0);
      setLastOutput([]);
      setLastSuccess(false);
      currentCodeRef.current = nextLevel.starterCode ?? '';
    }
  }

  function handleLevelChange(levelId: string) {
    const l = LEVELS_BY_ID[levelId];
    setCurrentLevelId(levelId);
    setSuccessState(false);
    setStampedCount(0);
    setLastOutput([]);
    setLastSuccess(false);
    currentCodeRef.current = l?.starterCode ?? '';
  }

  // ── Hint text per mechanic ────────────────────────────────────────────────────
  const mechanicHints: Record<string, string> = {
    speech:      `Escribí tu código y hacé click en 🚀 Deploy para ver hablar al robot. Cuando aparezca el mensaje correcto, usá ¡SELLAR! en la fábrica.`,
    tanks:       `Completá las variables y Deploy. Luego hacé click en ⚡ LLENAR DEPÓSITO para ver los tanques llenarse.`,
    assembler:   `Completá el template literal y Deploy. Hacé click en 🔩 ENSAMBLAR para ver las piezas unirse.`,
    scanner:     `Completá los tipos y hacé click en 🔍 ESCANEAR TIPOS para ver el escáner identificarlos.`,
    sorter:      `Completá los operadores y hacé click en 📦 CLASIFICAR CAJA para ver a dónde va la caja.`,
    'energy-bar':`Completá la condición del while y hacé click en ▶️ INICIAR TURNO para ver la energía drenar.`,
    grid:        `Completá los for loops y hacé click en 🏭 MAPEAR ESTACIONES para ver la grilla iluminarse.`,
    warehouse:   `Completá el código y hacé click en 📦 CARGAR INVENTARIO para llenar el almacén.`,
    machine:     `Completá las funciones y hacé click en ⚙️ EJECUTAR FUNCIÓN para ver la máquina procesar.`,
    cards:       `Completá los objetos y hacé click en 🗂️ PROCESAR CATÁLOGO para ver las fichas.`,
    detector:    `Completá el código y hacé click en 🔬 IDENTIFICAR PIEZA para activar el sensor.`,
    panel:       `Completá el enum y hacé click en 📊 ACTUALIZAR ESTADOS para ver el panel.`,
    pipeline:    `Completá el pipeline y hacé click en 🔄 EJECUTAR PIPELINE para ver el filter/reduce.`,
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: 'var(--bg-primary)', padding: 16, boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'flex', width: '100%', maxWidth: 1280, height: 'min(92vh, 800px)',
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 48px rgba(0,0,0,0.4)',
      }}>
        {/* Left: Level info + Editor */}
        <div style={{
          width: '44%', display: 'flex', flexDirection: 'column',
          borderRight: '1px solid var(--border)', minWidth: 0,
        }}>
          {/* Level Header */}
          <div style={{
            padding: '12px 14px', background: 'var(--bg-tertiary)',
            borderBottom: '1px solid var(--border)', flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <span style={{
                fontSize: 10, background: 'var(--purple)', color: 'white',
                padding: '2px 8px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Phase {level.phase} · {level.concept}
              </span>
              {completedLevels.has(currentLevelId) && (
                <span style={{ fontSize: 11, color: 'var(--green)' }}>✅ Completado</span>
              )}
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 3, lineHeight: 1.3 }}>{level.title}</h2>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              🎯 <strong>Objetivo:</strong> {level.objective}
            </p>
            <p style={{ fontSize: 11, color: 'var(--cyan-light)', margin: '6px 0 0', lineHeight: 1.4 }}>
              {mechanicHints[level.mechanic] ?? ''}
            </p>
          </div>

          {/* Mentor hint */}
          <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <Mentor mentorId={level.mentor} message={level.hint} />
          </div>

          {/* Editor */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <EditorPanel
              key={currentLevelId}
              starterCode={level.starterCode}
              onResult={(r) => handleResult(r)}
              onCodeChange={(code) => { currentCodeRef.current = code; }}
            />
          </div>
        </div>

        {/* Right: Factory + HUD */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* HUD */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
            background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)', flexShrink: 0,
          }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', marginRight: 4 }}>
              🏭 <strong style={{ color: 'var(--text-primary)' }}>Fábrica Olympus</strong>
            </span>
            <div style={{ flex: 1 }} />
            {ALL_LEVELS.map((l, i) => {
              const prevLevel = ALL_LEVELS[i - 1];
              const phaseBreak = i > 0 && l.phase !== prevLevel?.phase;
              return (
                <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {phaseBreak && (
                    <div style={{ width: 1, height: 16, background: 'var(--border)', marginRight: 2 }} />
                  )}
                  <button
                    onClick={() => handleLevelChange(l.id)}
                    title={`F${l.phase} · ${l.title}`}
                    style={{
                      width: 26, height: 26, borderRadius: '50%', border: 'none', fontSize: 11,
                      fontWeight: 700, cursor: 'pointer',
                      background: l.id === currentLevelId ? 'var(--purple)' :
                        completedLevels.has(l.id) ? '#22c55e33' : 'var(--bg-primary)',
                      color: l.id === currentLevelId ? 'white' :
                        completedLevels.has(l.id) ? 'var(--green)' : 'var(--text-secondary)',
                      boxShadow: l.id === currentLevelId ? '0 0 8px rgba(124,58,237,0.5)' : 'none',
                      transition: 'background 0.15s',
                    }}
                  >
                    {i + 1}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Canvas area */}
          <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
            {usesPhaser ? (
              <FactoryCanvas
                stampsRequired={stampsRequired}
                stampedCount={stampedCount}
                onRunCode={stampsRequired > 0 ? handleRunCode : undefined}
                lastOutput={lastOutput}
                lastSuccess={lastSuccess}
              />
            ) : (
              <MechanicCanvas
                key={currentLevelId}
                mechanic={level.mechanic}
                stampsRequired={stampsRequired}
                stampedCount={stampedCount}
                onActivate={handleActivate}
              />
            )}

            {/* Success Overlay */}
            {successState && (
              <div style={{
                position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
                background: '#22c55e22', border: '1px solid #22c55e88', borderRadius: 12,
                padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 14,
                backdropFilter: 'blur(8px)', whiteSpace: 'nowrap', zIndex: 40,
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)', marginBottom: 2 }}>
                    ✅ {stampsRequired > 0 ? `¡${stampsRequired} ciclos completados!` : '¡Objetivo completado!'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    La fábrica dominó {level.concept.toLowerCase()} 🔩
                  </div>
                </div>
                {ALL_LEVELS.findIndex((l) => l.id === currentLevelId) < ALL_LEVELS.length - 1 && (
                  <button
                    onClick={handleNextLevel}
                    style={{
                      padding: '7px 16px', background: 'var(--green)', border: 'none',
                      borderRadius: 8, color: 'white', fontWeight: 600, fontSize: 12, cursor: 'pointer',
                    }}
                  >
                    Siguiente nivel →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <DevPanel level={level} stampedCount={stampedCount} stampsRequired={stampsRequired} />
    </div>
  );
}
