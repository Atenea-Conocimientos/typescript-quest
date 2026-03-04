import { useState, useEffect } from 'react';
import { Level } from '../engine/types';

interface LessonScreenProps {
  level: Level;
  onStart: () => void;
}

export default function LessonScreen({ level, onStart }: LessonScreenProps) {
  const [visible, setVisible] = useState(false);

  // Fade-in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  function handleStart() {
    setVisible(false);
    setTimeout(onStart, 280);
  }

  const lesson = level.lesson!;
  const moduleLabel = level.moduleName
    ? `Módulo ${level.module} — ${level.moduleName}`
    : `Fase ${level.phase}`;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'stretch',
      background: '#0d1117',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(16px)',
      transition: 'opacity 0.28s ease, transform 0.28s ease',
    }}>
      {/* ── Left column: explanation ─────────────────────────────────────── */}
      <div style={{
        width: '44%', padding: '28px 28px 24px',
        borderRight: '1px solid #30363d',
        display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto',
      }}>
        {/* Phase / module badge */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10, background: '#7c3aed', color: 'white',
            padding: '2px 10px', borderRadius: 4, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {moduleLabel}
          </span>
          <span style={{
            fontSize: 10, background: '#21262d', color: '#06b6d4',
            padding: '2px 10px', borderRadius: 4, fontWeight: 600,
            border: '1px solid #30363d',
          }}>
            {level.concept}
          </span>
        </div>

        {/* Title */}
        <div>
          <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 4 }}>
            📖 LECCIÓN
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#e6edf3', lineHeight: 1.25 }}>
            {level.title}
          </h1>
          {level.subtitle && (
            <p style={{ fontSize: 12, color: '#8b949e', marginTop: 5, fontStyle: 'italic' }}>
              {level.subtitle}
            </p>
          )}
        </div>

        {/* Metaphor / explanation */}
        <div style={{
          padding: '14px 16px', borderRadius: 10,
          background: '#7c3aed12', border: '1px solid #7c3aed30',
        }}>
          <div style={{ fontSize: 11, color: '#a78bfa', fontWeight: 700, marginBottom: 6 }}>
            🏭 Metáfora de la fábrica
          </div>
          <p style={{ fontSize: 13, color: '#e6edf3', lineHeight: 1.65 }}>
            {level.metaphor ?? lesson.explanation}
          </p>
        </div>

        {/* Explanation (if we have both metaphor and explanation) */}
        {level.metaphor && (
          <p style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.65 }}>
            {lesson.explanation}
          </p>
        )}

        {/* Tips */}
        <div>
          <div style={{ fontSize: 11, color: '#8b949e', fontWeight: 700, marginBottom: 8 }}>
            💡 PUNTOS CLAVE
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {lesson.tips.map((tip, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{
                  flexShrink: 0, width: 20, height: 20, borderRadius: '50%',
                  background: '#7c3aed', color: 'white', fontSize: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, marginTop: 1,
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.5 }}>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA button */}
        <div style={{ marginTop: 'auto', paddingTop: 8 }}>
          <button
            onClick={handleStart}
            style={{
              width: '100%', padding: '13px 20px',
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              border: 'none', borderRadius: 10, color: 'white',
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
              transition: 'transform 0.1s, box-shadow 0.1s',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,58,237,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.4)';
            }}
          >
            ¡A practicar! →
          </button>
          <p style={{ fontSize: 11, color: '#8b949e', textAlign: 'center', marginTop: 8 }}>
            🎯 Objetivo: {level.objective}
          </p>
        </div>
      </div>

      {/* ── Right column: code example ───────────────────────────────────── */}
      <div style={{
        flex: 1, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div style={{ fontSize: 11, color: '#8b949e', fontWeight: 700 }}>
          📝 EJEMPLO DE CÓDIGO
        </div>

        {/* Code block */}
        <div style={{
          flex: 1, borderRadius: 12, overflow: 'hidden',
          border: '1px solid #30363d',
          background: '#0d1117',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Fake title bar */}
          <div style={{
            padding: '8px 14px', background: '#161b22',
            borderBottom: '1px solid #30363d',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ marginLeft: 8, fontSize: 11, color: '#8b949e', fontFamily: 'monospace' }}>
              ejemplo.ts
            </span>
          </div>

          {/* Code */}
          <pre style={{
            flex: 1, margin: 0, padding: '18px 20px',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: 13, lineHeight: 1.7,
            color: '#e6edf3',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
          }}>
            <CodeHighlight code={lesson.codeExample} />
          </pre>
        </div>

        {/* Concepts list from curriculum data */}
        {level.concepts && (
          <div style={{
            padding: '10px 14px', borderRadius: 8,
            background: '#06b6d408', border: '1px solid #06b6d420',
          }}>
            <div style={{ fontSize: 10, color: '#06b6d4', fontWeight: 700, marginBottom: 6 }}>
              🔧 CONCEPTOS DE ESTA LECCIÓN
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {level.concepts.split('·').map((c, i) => (
                <span key={i} style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 4,
                  background: '#21262d', color: '#8b949e',
                  border: '1px solid #30363d', fontFamily: 'monospace',
                }}>
                  {c.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Simple syntax highlighter ─────────────────────────────────────────────────
function CodeHighlight({ code }: { code: string }) {
  const lines = code.split('\n');
  return (
    <>
      {lines.map((line, i) => (
        <div key={i}>
          <HighlightLine line={line} />
        </div>
      ))}
    </>
  );
}

function HighlightLine({ line }: { line: string }) {
  // Comment lines
  if (line.trimStart().startsWith('//')) {
    return <span style={{ color: '#6e7681' }}>{line}</span>;
  }

  const segments: { text: string; color: string }[] = [];

  // Tokenize by scanning character by character
  let i = 0;
  let buf = '';

  const flush = (color = '#e6edf3') => {
    if (buf) {
      segments.push({ text: buf, color });
      buf = '';
    }
  };

  while (i < line.length) {
    // Single-line comment
    if (line[i] === '/' && line[i + 1] === '/') {
      flush();
      segments.push({ text: line.slice(i), color: '#6e7681' });
      break;
    }
    // String/template literal
    if (line[i] === '"' || line[i] === "'" || line[i] === '`') {
      flush();
      const quote = line[i];
      let str = quote;
      i++;
      while (i < line.length) {
        str += line[i];
        if (line[i] === '\\') { i++; if (i < line.length) { str += line[i]; } }
        else if (line[i] === quote) { i++; break; }
        i++;
      }
      segments.push({ text: str, color: '#a5d6ff' });
      continue;
    }
    buf += line[i];
    i++;
  }
  flush();

  // Now colorize keywords in text segments
  const final: { text: string; color: string }[] = [];
  const KW = new Set(['const','let','var','function','return','if','else','for','while','class','interface','type','extends','implements','import','export','default','new','this','async','await','typeof','instanceof','in','of','true','false','null','undefined','void','never','string','number','boolean','any','unknown']);

  for (const seg of segments) {
    if (seg.color !== '#e6edf3') { final.push(seg); continue; }
    // Split on word boundaries to detect keywords
    const parts = seg.text.split(/(\b\w+\b)/);
    for (const part of parts) {
      if (KW.has(part)) {
        final.push({ text: part, color: '#ff7b72' });
      } else if (/^\d+\.?\d*$/.test(part)) {
        final.push({ text: part, color: '#79c0ff' });
      } else if (/^[A-Z][A-Za-z0-9]*$/.test(part) && part.length > 1) {
        final.push({ text: part, color: '#ffa657' }); // types/classes
      } else {
        final.push({ text: part, color: '#e6edf3' });
      }
    }
  }

  return (
    <>
      {final.map((seg, i) => (
        <span key={i} style={{ color: seg.color }}>{seg.text}</span>
      ))}
    </>
  );
}
