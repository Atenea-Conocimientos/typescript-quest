import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

interface FactoryCanvasProps {
  isRunning: boolean;
  stampsRequired?: number;
  stampedCount: number;
  onBoxClick?: () => Promise<boolean>; // true = stamped, false = failed
}

class FactoryScene extends Phaser.Scene {
  private beltTiles: Phaser.GameObjects.Rectangle[] = [];
  private products: Phaser.GameObjects.Container[] = [];
  private robotArm!: Phaser.GameObjects.Rectangle;
  private beltSpeed = 80;
  private spawnTimer = 0;
  private active = false;

  constructor() {
    super({ key: 'FactoryScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Background grid
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x21262d, 0.5);
    for (let x = 0; x < width; x += 40) graphics.lineBetween(x, 0, x, height);
    for (let y = 0; y < height; y += 40) graphics.lineBetween(0, y, width, y);

    // Conveyor belt
    const beltY = height * 0.62;
    const beltHeight = 44;
    this.add.rectangle(width / 2, beltY, width, beltHeight, 0x21262d).setStrokeStyle(2, 0x30363d);

    const stripeCount = Math.ceil(width / 32) + 2;
    for (let i = 0; i < stripeCount; i++) {
      const stripe = this.add.rectangle(i * 32, beltY, 16, beltHeight, 0x30363d);
      this.beltTiles.push(stripe);
    }

    this.add.rectangle(width / 2, beltY - beltHeight / 2 - 3, width, 6, 0x7c3aed);
    this.add.rectangle(width / 2, beltY + beltHeight / 2 + 3, width, 6, 0x7c3aed);

    // Robot arm
    const robotX = width * 0.35;
    const robotBaseY = beltY - beltHeight / 2 - 28;

    this.add.rectangle(robotX, robotBaseY - 20, 50, 40, 0x374151).setStrokeStyle(2, 0x7c3aed);
    this.robotArm = this.add.rectangle(robotX, robotBaseY - 50, 8, 40, 0x7c3aed);
    this.robotArm.setOrigin(0.5, 1);

    const eye = this.add.circle(robotX, robotBaseY - 22, 6, 0x06b6d4);
    this.tweens.add({ targets: eye, alpha: 0.3, duration: 800, yoyo: true, repeat: -1 });

    this.add.text(robotX, robotBaseY + 12, 'UNIT-01', {
      fontSize: '9px', color: '#06b6d4', fontFamily: 'JetBrains Mono, monospace',
    }).setOrigin(0.5);

    // Status text
    this.add.text(16, 16, '🏭 OLYMPUS FACTORY', {
      fontSize: '13px', color: '#7c3aed', fontFamily: 'Inter, sans-serif', fontStyle: 'bold',
    });
    this.add.text(16, 34, 'UNIT-01 — STANDBY', {
      fontSize: '10px', color: '#8b949e', fontFamily: 'JetBrains Mono, monospace',
    }).setName('statusText');

    const particles = this.add.particles(robotX, robotBaseY - 60, '__DEFAULT', {
      speed: { min: 10, max: 30 },
      angle: { min: 240, max: 300 },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 400,
      quantity: 0,
      tint: [0x7c3aed, 0x06b6d4],
      blendMode: 'ADD',
    });
    particles.setName('sparks');
    void particles;
  }

  setActive(active: boolean) {
    this.active = active;
    if (!this.children) return;
    const statusText = this.children.getByName('statusText') as Phaser.GameObjects.Text | null;
    if (statusText) {
      statusText.setText(active ? 'UNIT-01 — RUNNING ▶' : 'UNIT-01 — STANDBY');
      statusText.setColor(active ? '#22c55e' : '#8b949e');
    }
    const sparks = this.children.getByName('sparks') as Phaser.GameObjects.Particles.ParticleEmitter | null;
    if (sparks) sparks.setQuantity(active ? 2 : 0);

    if (active && this.robotArm) {
      this.tweens.add({
        targets: this.robotArm,
        y: this.robotArm.y + 20,
        duration: 300,
        yoyo: true,
        repeat: 2,
        ease: 'Sine.easeInOut',
      });
    }
  }

  update(_time: number, delta: number) {
    if (!this.active) return;
    const speed = this.beltSpeed * (delta / 1000);
    this.beltTiles.forEach((tile) => {
      tile.x += speed;
      if (tile.x > this.scale.width + 16) tile.x -= this.scale.width + 32;
    });
    this.products.forEach((p, i) => {
      p.x += speed;
      if (p.x > this.scale.width + 40) { p.destroy(); this.products.splice(i, 1); }
    });
    this.spawnTimer += delta;
    if (this.spawnTimer > 1200) { this.spawnTimer = 0; this.spawnProduct(); }
  }

  spawnProduct() {
    const beltY = this.scale.height * 0.62 - 18;
    const container = this.add.container(-20, beltY);
    const bolt = this.add.rectangle(0, 0, 18, 18, 0xf59e0b).setStrokeStyle(2, 0xfcd34d);
    const label = this.add.text(0, 0, '⬡', { fontSize: '12px', color: '#fcd34d' }).setOrigin(0.5);
    container.add([bolt, label]);
    this.products.push(container);
    this.tweens.add({ targets: bolt, alpha: 0.7, duration: 300, yoyo: true, repeat: 2 });
  }
}

// ── Stamp Box Component ───────────────────────────────────────────────────────

interface StampBoxProps {
  index: number;
  stamped: boolean;
  animating: boolean;
  failed: boolean;
  onClick: () => void;
  disabled: boolean;
}

function StampBox({ index, stamped, animating, failed, onClick, disabled }: StampBoxProps) {
  return (
    <div
      onClick={!disabled && !stamped ? onClick : undefined}
      title={stamped ? 'Stamped ✅' : 'Click to stamp this box'}
      style={{
        width: 64, height: 64,
        borderRadius: 10,
        border: `2px solid ${stamped ? '#22c55e' : failed ? '#ef4444' : '#374151'}`,
        background: stamped ? '#22c55e18' : failed ? '#ef444418' : '#161b22',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: stamped || disabled ? 'default' : 'pointer',
        transition: 'all 0.2s',
        transform: animating ? 'scale(1.15)' : 'scale(1)',
        boxShadow: stamped
          ? '0 0 16px rgba(34,197,94,0.4)'
          : failed
          ? '0 0 12px rgba(239,68,68,0.3)'
          : 'none',
        userSelect: 'none',
      }}
    >
      {stamped ? (
        <>
          <span style={{ fontSize: 22 }}>✅</span>
          <span style={{ fontSize: 9, color: '#22c55e', marginTop: 2, fontFamily: 'monospace' }}>STAMPED</span>
        </>
      ) : animating ? (
        <>
          <span style={{ fontSize: 22 }}>⚙️</span>
          <span style={{ fontSize: 9, color: '#8b949e', marginTop: 2, fontFamily: 'monospace' }}>RUNNING...</span>
        </>
      ) : failed ? (
        <>
          <span style={{ fontSize: 22 }}>❌</span>
          <span style={{ fontSize: 9, color: '#ef4444', marginTop: 2, fontFamily: 'monospace' }}>FAILED</span>
        </>
      ) : (
        <>
          <span style={{ fontSize: 22 }}>📦</span>
          <span style={{ fontSize: 9, color: '#8b949e', marginTop: 2, fontFamily: 'monospace' }}>BOX {index + 1}</span>
        </>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function FactoryCanvas({
  isRunning,
  stampsRequired = 0,
  stampedCount,
  onBoxClick,
}: FactoryCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<FactoryScene | null>(null);

  const [animatingBox, setAnimatingBox] = useState<number | null>(null);
  const [failedBox, setFailedBox] = useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;
    const scene = new FactoryScene();
    sceneRef.current = scene;
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

  useEffect(() => {
    if (!sceneRef.current) return;
    try { sceneRef.current.setActive(isRunning); } catch { /* scene not ready */ }
  }, [isRunning]);

  // Next box to stamp = first unstamped one
  const nextBox = stampedCount < stampsRequired ? stampedCount : null;

  async function handleBoxClick(i: number) {
    if (!onBoxClick || i !== nextBox || animatingBox !== null) return;
    setAnimatingBox(i);
    setFailedBox(null);
    try {
      const success = await onBoxClick();
      if (success) {
        setFailedBox(null);
      } else {
        setFailedBox(i);
      }
    } catch {
      setFailedBox(i);
    } finally {
      setAnimatingBox(null);
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Phaser canvas */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Stamp boxes overlay */}
      {stampsRequired > 0 && (
        <div style={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 10,
          pointerEvents: 'none',
        }}>
          {/* Progress label */}
          <div style={{
            fontSize: 11,
            color: stampedCount >= stampsRequired ? '#22c55e' : '#8b949e',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700,
            textAlign: 'right',
          }}>
            {stampedCount >= stampsRequired
              ? '🎉 ALL BOXES STAMPED!'
              : `STAMP BOXES: ${stampedCount}/${stampsRequired}`}
          </div>
          {/* Box grid */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 8,
            justifyContent: 'flex-end', maxWidth: 220,
            pointerEvents: 'all',
          }}>
            {Array.from({ length: stampsRequired }, (_, i) => (
              <StampBox
                key={i}
                index={i}
                stamped={i < stampedCount}
                animating={animatingBox === i}
                failed={failedBox === i}
                onClick={() => handleBoxClick(i)}
                disabled={animatingBox !== null || i !== nextBox}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
