import { useState, useEffect } from 'react';
import GameScreen from './components/GameScreen';
import { warmupWorker } from './engine/GameEngine';
import './styles/globals.css';

export default function App() {
  const [started, setStarted] = useState(false);

  // Pre-warm the TypeScript worker as soon as the app loads
  useEffect(() => {
    warmupWorker();
  }, []);

  if (!started) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: 'var(--bg-primary)', gap: 24, textAlign: 'center', padding: 32,
      }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>🏭</div>
        <h1 style={{
          fontSize: 42, fontWeight: 700, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          TypeScript Quest
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 480, lineHeight: 1.6 }}>
          Programá robots en la <strong style={{ color: 'var(--text-primary)' }}>Fábrica Olympus</strong>.
          Aprendé TypeScript construyendo, automatizando y escalando una línea de ensamblaje futurista.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          {['🦉 Athenix', '⚡ Hermes', '🎯 Apolo', '🏹 Artemisa'].map((m) => (
            <div key={m} style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '8px 14px', fontSize: 13, color: 'var(--text-secondary)',
            }}>{m}</div>
          ))}
        </div>
        <button
          onClick={() => setStarted(true)}
          style={{
            marginTop: 16, padding: '14px 40px', fontSize: 16, fontWeight: 600,
            background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: 'white',
            border: 'none', borderRadius: 10, cursor: 'pointer',
            boxShadow: '0 0 24px rgba(124, 58, 237, 0.4)',
            transition: 'transform 0.1s, box-shadow 0.1s',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
            (e.target as HTMLButtonElement).style.boxShadow = '0 0 36px rgba(124, 58, 237, 0.6)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.transform = '';
            (e.target as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(124, 58, 237, 0.4)';
          }}
        >
          Entrar a la Fábrica →
        </button>
      </div>
    );
  }

  return <GameScreen />;
}
