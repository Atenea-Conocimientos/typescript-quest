import { useState } from 'react';
import EditorPanel from '../editor/EditorPanel';
import Mentor from '../mentors/Mentor';
import { LEVELS_BY_ID, INITIAL_LEVEL_ID, ALL_LEVELS } from '../levels';
import { RunResult } from '../engine/types';
import FactoryCanvas from './FactoryCanvas';

export default function GameScreen() {
  const [currentLevelId, setCurrentLevelId] = useState(INITIAL_LEVEL_ID);
  const [completedLevels, setCompletedLevels] = useState<Set<string>>(new Set());
  const [lastResult, setLastResult] = useState<RunResult | null>(null);
  const [successState, setSuccessState] = useState(false);

  const level = LEVELS_BY_ID[currentLevelId];

  function handleResult(result: RunResult) {
    setLastResult(result);
    if (result.success && level.validate(result.output)) {
      setSuccessState(true);
      setCompletedLevels((prev) => new Set([...prev, currentLevelId]));
    } else {
      setSuccessState(false);
    }
  }

  function handleNextLevel() {
    const currentIndex = ALL_LEVELS.findIndex((l) => l.id === currentLevelId);
    if (currentIndex < ALL_LEVELS.length - 1) {
      setCurrentLevelId(ALL_LEVELS[currentIndex + 1].id);
      setSuccessState(false);
      setLastResult(null);
    }
  }

  return (
    <div style={{
      display: 'flex', height: '100vh', background: 'var(--bg-primary)',
      overflow: 'hidden',
    }}>
      {/* Left: Level info + Editor */}
      <div style={{
        width: '42%', display: 'flex', flexDirection: 'column',
        borderRight: '1px solid var(--border)',
      }}>
        {/* Level Header */}
        <div style={{
          padding: '14px 16px', background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{
              fontSize: 10, background: 'var(--purple)', color: 'white',
              padding: '2px 8px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase',
            }}>
              Phase {level.phase} · {level.concept}
            </span>
            {completedLevels.has(currentLevelId) && (
              <span style={{ fontSize: 12, color: 'var(--green)' }}>✅ Completed</span>
            )}
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{level.title}</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            🎯 <strong>Objective:</strong> {level.objective}
          </p>
        </div>

        {/* Mentor hint */}
        <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)' }}>
          <Mentor mentorId={level.mentor} message={level.hint} />
        </div>

        {/* Editor */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <EditorPanel
            key={currentLevelId}
            starterCode={level.starterCode}
            onResult={handleResult}
          />
        </div>
      </div>

      {/* Right: Factory + HUD */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* HUD */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px',
          background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            🏭 <strong style={{ color: 'var(--text-primary)' }}>Olympus Factory</strong>
          </span>
          <div style={{ flex: 1 }} />
          {/* Level navigator */}
          {ALL_LEVELS.map((l, i) => (
            <button
              key={l.id}
              onClick={() => { setCurrentLevelId(l.id); setSuccessState(false); setLastResult(null); }}
              style={{
                width: 28, height: 28, borderRadius: '50%', border: 'none', fontSize: 11,
                fontWeight: 700, cursor: 'pointer',
                background: l.id === currentLevelId ? 'var(--purple)' :
                  completedLevels.has(l.id) ? '#22c55e33' : 'var(--bg-tertiary)',
                color: l.id === currentLevelId ? 'white' :
                  completedLevels.has(l.id) ? 'var(--green)' : 'var(--text-secondary)',
                boxShadow: l.id === currentLevelId ? '0 0 8px rgba(124,58,237,0.5)' : 'none',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Factory Canvas */}
        <div style={{ flex: 1, position: 'relative' }}>
          <FactoryCanvas isRunning={!!(lastResult?.success)} />

          {/* Success Overlay */}
          {successState && (
            <div style={{
              position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
              background: '#22c55e22', border: '1px solid #22c55e88', borderRadius: 12,
              padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16,
              backdropFilter: 'blur(8px)',
            }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--green)', marginBottom: 4 }}>
                  ✅ Objective Complete!
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  The factory is producing {level.title.toLowerCase()} 🔩
                </div>
              </div>
              {ALL_LEVELS.findIndex((l) => l.id === currentLevelId) < ALL_LEVELS.length - 1 && (
                <button
                  onClick={handleNextLevel}
                  style={{
                    padding: '8px 18px', background: 'var(--green)', border: 'none',
                    borderRadius: 8, color: 'white', fontWeight: 600, fontSize: 13,
                  }}
                >
                  Next Level →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
