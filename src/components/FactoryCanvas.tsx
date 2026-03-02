import { useEffect, useRef, useState, useCallback } from 'react';
import Phaser from 'phaser';

interface FactoryCanvasProps {
  stampsRequired?: number;
  stampedCount: number;
  onRunCode?: () => Promise<boolean>;
  active?: boolean;
  lastOutput?: string[];   // for speech mechanic: shows bubble with logged text
  lastSuccess?: boolean;
}

// ── Phaser Scene ──────────────────────────────────────────────────────────────

type StampResult = 'success' | 'fail' | null;

class FactoryScene extends Phaser.Scene {
  // Callbacks set by React
  onBoxAtStation?: () => void;
  onBoxLeft?: () => void;

  private beltTiles: Phaser.GameObjects.Rectangle[] = [];
  private beltSpeed = 90; // px/s
  private currentBox: Phaser.GameObjects.Container | null = null;
  private boxState: 'moving' | 'waiting' | 'stamping' | 'leaving' | 'none' = 'none';
  private spawnCooldown = 0;
  private STAMP_X = 0;
  private BELT_Y = 0;

  constructor() {
    super({ key: 'FactoryScene' });
  }

  create() {
    const { width, height } = this.scale;
    this.STAMP_X = width * 0.42;
    this.BELT_Y = height * 0.6;

    // Grid background
    const g = this.add.graphics();
    g.lineStyle(1, 0x21262d, 0.4);
    for (let x = 0; x < width; x += 40) g.lineBetween(x, 0, x, height);
    for (let y = 0; y < height; y += 40) g.lineBetween(0, y, width, y);

    // Belt
    const bh = 46;
    this.add.rectangle(width / 2, this.BELT_Y, width, bh, 0x1a2030).setStrokeStyle(1, 0x30363d);
    const stripes = Math.ceil(width / 32) + 2;
    for (let i = 0; i < stripes; i++) {
      this.beltTiles.push(this.add.rectangle(i * 32, this.BELT_Y, 16, bh, 0x30363d));
    }
    // Belt rails
    this.add.rectangle(width / 2, this.BELT_Y - bh / 2 - 3, width, 5, 0x7c3aed);
    this.add.rectangle(width / 2, this.BELT_Y + bh / 2 + 3, width, 5, 0x7c3aed);

    // Robot arm station
    this.buildRobot(this.STAMP_X);

    // Factory label
    this.add.text(14, 14, '🏭 FÁBRICA OLYMPUS', {
      fontSize: '13px', color: '#7c3aed', fontFamily: 'Inter, sans-serif', fontStyle: 'bold',
    });
    this.add.text(14, 33, 'UNIDAD-01 — LISTA', {
      fontSize: '10px', color: '#8b949e', fontFamily: 'JetBrains Mono, monospace',
    }).setName('statusText');

    // Spawn first box after short delay
    this.spawnCooldown = 1200;
  }

  private buildRobot(x: number) {
    const baseY = this.BELT_Y - 23 - 30;

    // Vertical pole
    this.add.rectangle(x, this.BELT_Y - 23 - 60, 6, 80, 0x374151);

    // Robot body
    this.add.rectangle(x, baseY - 24, 52, 42, 0x374151).setStrokeStyle(2, 0x7c3aed);

    // Stamp head (the part that moves down)
    const armGroup = this.add.container(x, baseY - 2);
    const armShaft = this.add.rectangle(0, -14, 10, 28, 0x7c3aed);
    const stampHead = this.add.rectangle(0, 4, 28, 12, 0x5b21b6).setStrokeStyle(2, 0xa78bfa);
    armGroup.add([armShaft, stampHead]);
    armGroup.setName('robotArm');

    // Eye glow
    const eye = this.add.circle(x, baseY - 26, 6, 0x06b6d4);
    this.tweens.add({ targets: eye, alpha: 0.3, duration: 900, yoyo: true, repeat: -1 });

    // Label
    this.add.text(x, baseY + 10, 'UNIDAD-01', {
      fontSize: '8px', color: '#06b6d4', fontFamily: 'JetBrains Mono, monospace',
    }).setOrigin(0.5);

    // Stamp zone indicator (dashed line)
    const zoneG = this.add.graphics();
    zoneG.lineStyle(1, 0x7c3aed, 0.3);
    zoneG.lineBetween(x, this.BELT_Y - 23, x, this.BELT_Y + 23);
  }

  /** Called by React after stamp result is determined */
  finishStamp(success: boolean) {
    if (this.boxState !== 'waiting' || !this.currentBox) return;
    this.boxState = 'stamping';
    this.playStampAnimation(success);
  }

  private playStampAnimation(success: boolean) {
    const arm = this.children.getByName('robotArm') as Phaser.GameObjects.Container | null;
    const box = this.currentBox;
    if (!box) return;

    // Arm punches down
    if (arm) {
      this.tweens.add({
        targets: arm,
        y: arm.y + 22,
        duration: 120,
        yoyo: true,
        ease: 'Cubic.easeIn',
        onComplete: () => {
          // Stamp mark on box
          this.addStampMark(box, success);
          this.updateStatus(success ? '✅ SELLADO' : '❌ RECHAZADO', success ? '#22c55e' : '#ef4444');

          // Particles
          const color = success ? 0x22c55e : 0xef4444;
          const px = this.add.particles(box.x, box.y, '__DEFAULT', {
            speed: { min: 20, max: 60 },
            scale: { start: 0.4, end: 0 },
            lifespan: 500,
            quantity: 8,
            tint: [color],
          });
          this.time.delayedCall(600, () => px.destroy());

          // Short pause then release box
          this.time.delayedCall(700, () => {
            this.boxState = 'leaving';
            this.onBoxLeft?.();
            this.time.delayedCall(1200, () => {
              this.updateStatus('UNIDAD-01 — LISTA', '#8b949e');
            });
          });
        },
      });
    }
  }

  private addStampMark(box: Phaser.GameObjects.Container, success: boolean) {
    const mark = this.add.text(0, 0, success ? '✅' : '❌', {
      fontSize: '20px',
    }).setOrigin(0.5);
    mark.setDepth(10);
    box.add(mark);
    this.tweens.add({ targets: mark, scaleX: 1.3, scaleY: 1.3, duration: 150, yoyo: true });
  }

  private updateStatus(text: string, color: string) {
    const s = this.children.getByName('statusText') as Phaser.GameObjects.Text | null;
    if (s) { s.setText(text); s.setColor(color); }
  }

  private spawnBox() {
    const boxY = this.BELT_Y - 20;
    const container = this.add.container(-48, boxY);

    // Box body
    const body = this.add.rectangle(0, 0, 44, 38, 0x1e3a5f).setStrokeStyle(2, 0x3b82f6);
    // Box details
    const stripe = this.add.rectangle(0, -4, 36, 4, 0x3b82f6).setAlpha(0.5);
    const bolt = this.add.rectangle(0, 8, 14, 8, 0xf59e0b).setStrokeStyle(1, 0xfcd34d);
    const boltLabel = this.add.text(0, 8, 'PKG', {
      fontSize: '6px', color: '#fbbf24', fontFamily: 'monospace',
    }).setOrigin(0.5);

    container.add([body, stripe, bolt, boltLabel]);
    container.setDepth(5);
    this.currentBox = container;
    this.boxState = 'moving';
  }

  update(_time: number, delta: number) {
    const speed = this.beltSpeed * (delta / 1000);

    // Animate belt stripes (always)
    this.beltTiles.forEach((t) => {
      t.x += speed;
      if (t.x > this.scale.width + 16) t.x -= this.scale.width + 32;
    });

    // Spawn cooldown
    if (this.boxState === 'none') {
      this.spawnCooldown -= delta;
      if (this.spawnCooldown <= 0) {
        this.spawnBox();
        this.spawnCooldown = 2500;
      }
    }

    const box = this.currentBox;
    if (!box) return;

    if (this.boxState === 'moving') {
      box.x += speed;
      if (box.x >= this.STAMP_X) {
        box.x = this.STAMP_X;
        this.boxState = 'waiting';
        this.updateStatus('UNIDAD-01 — ESPERANDO ▼', '#f59e0b');
        this.onBoxAtStation?.();

        // Pulse the box
        this.tweens.add({
          targets: box,
          scaleX: 1.08, scaleY: 1.08,
          duration: 400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
      }
    } else if (this.boxState === 'leaving') {
      box.x += speed * 2.5;
      if (box.x > this.scale.width + 60) {
        box.destroy();
        this.currentBox = null;
        this.boxState = 'none';
        this.spawnCooldown = 800;
      }
    }
  }
}

// ── React Component ───────────────────────────────────────────────────────────

export default function FactoryCanvas({
  stampsRequired = 0,
  stampedCount,
  onRunCode,
  active = true,
  lastOutput = [],
  lastSuccess = false,
}: FactoryCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<FactoryScene | null>(null);
  const [boxAtStation, setBoxAtStation] = useState(false);
  const [stamping, setStamping] = useState(false);
  const [lastResult, setLastResult] = useState<StampResult>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;
    const scene = new FactoryScene();
    sceneRef.current = scene;

    scene.onBoxAtStation = () => setBoxAtStation(true);
    scene.onBoxLeft = () => {
      setBoxAtStation(false);
      setLastResult(null);
    };

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      backgroundColor: '#0d1117',
      scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH, width: '100%', height: '100%' },
      scene,
      physics: { default: 'arcade' },
    });
    return () => { gameRef.current?.destroy(true); gameRef.current = null; sceneRef.current = null; };
  }, []);

  void active; // may be used for pausing later

  const handleStamp = useCallback(async () => {
    if (!onRunCode || !boxAtStation || stamping) return;
    setStamping(true);
    const success = await onRunCode();
    setLastResult(success ? 'success' : 'fail');
    sceneRef.current?.finishStamp(success);
    setStamping(false);
  }, [onRunCode, boxAtStation, stamping]);

  const allDone = stampsRequired > 0 && stampedCount >= stampsRequired;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Phaser canvas */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Stamp counter (top-right) */}
      {stampsRequired > 0 && (
        <div style={{
          position: 'absolute', top: 12, right: 14,
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#0d1117cc', border: '1px solid #30363d',
          borderRadius: 8, padding: '6px 12px',
          backdropFilter: 'blur(6px)',
        }}>
          <span style={{ fontSize: 14 }}>📦</span>
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace',
              color: allDone ? '#22c55e' : '#e6edf3',
            }}>
              {allDone ? '🎉 ¡TODO SELLADO!' : `${stampedCount} / ${stampsRequired} selladas`}
            </div>
            {/* Progress dots */}
            <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
              {Array.from({ length: stampsRequired }, (_, i) => (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: i < stampedCount ? '#22c55e' : '#21262d',
                  border: `1px solid ${i < stampedCount ? '#22c55e' : '#30363d'}`,
                  transition: 'background 0.3s',
                  boxShadow: i < stampedCount ? '0 0 6px rgba(34,197,94,0.6)' : 'none',
                }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stamp action button (bottom center, appears when box is waiting) */}
      {stampsRequired > 0 && !allDone && (
        <div style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          transition: 'opacity 0.2s',
          opacity: boxAtStation ? 1 : 0.3,
          pointerEvents: boxAtStation ? 'all' : 'none',
        }}>
          {lastResult && !stamping && (
            <div style={{
              fontSize: 12, fontWeight: 700,
              color: lastResult === 'success' ? '#22c55e' : '#ef4444',
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              {lastResult === 'success' ? '✅ ¡Correcto! ¡Caja sellada!' : '❌ Salida incorrecta — ¡corregí tu código!'}
            </div>
          )}
          <button
            onClick={handleStamp}
            disabled={stamping || !boxAtStation}
            style={{
              padding: '12px 32px',
              fontSize: 15,
              fontWeight: 700,
              background: stamping
                ? '#374151'
                : lastResult === 'fail'
                ? 'linear-gradient(135deg, #7f1d1d, #991b1b)'
                : 'linear-gradient(135deg, #7c3aed, #5b21b6)',
              border: `2px solid ${stamping ? '#4b5563' : lastResult === 'fail' ? '#ef4444' : '#a78bfa'}`,
              borderRadius: 12,
              color: 'white',
              cursor: stamping ? 'default' : 'pointer',
              boxShadow: boxAtStation && !stamping ? '0 0 24px rgba(124,58,237,0.5)' : 'none',
              transition: 'all 0.2s',
              animation: boxAtStation && !stamping && !lastResult ? 'pulse 1.5s infinite' : 'none',
            }}
          >
            {stamping ? '⚙️ Ejecutando código...' : '🔨 ¡SELLAR!'}
          </button>
          {!boxAtStation && (
            <div style={{ fontSize: 11, color: '#8b949e', fontFamily: 'monospace' }}>
              ⏳ Esperando la próxima caja...
            </div>
          )}
        </div>
      )}

      {/* Speech bubble (for 'speech' mechanic / console.log lesson) */}
      {lastSuccess && lastOutput.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '14%',
          left: '54%',
          transform: 'translateX(-50%)',
          background: 'white',
          color: '#0d1117',
          padding: '10px 18px',
          borderRadius: 12,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 15,
          fontWeight: 700,
          maxWidth: 220,
          textAlign: 'center',
          zIndex: 30,
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          animation: 'speechPop 0.25s ease',
          pointerEvents: 'none',
        }}>
          {lastOutput[0]}
          <div style={{
            position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '10px solid white',
          }} />
        </div>
      )}

      {/* Pulse + speech keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 16px rgba(124,58,237,0.4); }
          50% { box-shadow: 0 0 32px rgba(124,58,237,0.8); }
        }
        @keyframes speechPop {
          from { transform: translateX(-50%) scale(0.5); opacity: 0; }
          to   { transform: translateX(-50%) scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
