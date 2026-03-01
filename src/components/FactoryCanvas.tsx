import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

interface FactoryCanvasProps {
  isRunning: boolean;
}

class FactoryScene extends Phaser.Scene {
  private beltTiles: Phaser.GameObjects.Rectangle[] = [];
  private products: Phaser.GameObjects.Container[] = [];
  private robotArm!: Phaser.GameObjects.Rectangle;
  private beltSpeed = 80; // px per second
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
    for (let x = 0; x < width; x += 40) {
      graphics.lineBetween(x, 0, x, height);
    }
    for (let y = 0; y < height; y += 40) {
      graphics.lineBetween(0, y, width, y);
    }

    // Conveyor belt base
    const beltY = height * 0.55;
    const beltHeight = 48;
    this.add.rectangle(width / 2, beltY, width, beltHeight, 0x21262d).setStrokeStyle(2, 0x30363d);

    // Belt stripes (animated)
    const stripeCount = Math.ceil(width / 32) + 2;
    for (let i = 0; i < stripeCount; i++) {
      const stripe = this.add.rectangle(i * 32, beltY, 16, beltHeight, 0x30363d);
      this.beltTiles.push(stripe);
    }

    // Belt rail top & bottom
    this.add.rectangle(width / 2, beltY - beltHeight / 2 - 3, width, 6, 0x7c3aed);
    this.add.rectangle(width / 2, beltY + beltHeight / 2 + 3, width, 6, 0x7c3aed);

    // Robot arm
    const robotX = width * 0.3;
    const robotBaseY = beltY - beltHeight / 2 - 30;

    // Robot base (box)
    const robotBase = this.add.rectangle(robotX, robotBaseY - 20, 50, 40, 0x374151)
      .setStrokeStyle(2, 0x7c3aed);

    // Robot arm
    this.robotArm = this.add.rectangle(robotX, robotBaseY - 50, 8, 40, 0x7c3aed);
    this.robotArm.setOrigin(0.5, 1);

    // Robot eye (glow)
    const eye = this.add.circle(robotX, robotBaseY - 22, 6, 0x06b6d4);
    this.tweens.add({
      targets: eye,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Robot label
    this.add.text(robotX, robotBaseY + 12, 'UNIT-01', {
      fontSize: '9px',
      color: '#06b6d4',
      fontFamily: 'JetBrains Mono, monospace',
    }).setOrigin(0.5);

    void robotBase; // suppress unused warning

    // Status text
    this.add.text(16, 16, '🏭 OLYMPUS FACTORY', {
      fontSize: '14px',
      color: '#7c3aed',
      fontFamily: 'Inter, sans-serif',
      fontStyle: 'bold',
    });

    this.add.text(16, 36, 'UNIT-01 — STANDBY', {
      fontSize: '11px',
      color: '#8b949e',
      fontFamily: 'JetBrains Mono, monospace',
    }).setName('statusText');

    // Particle emitter (sparks on robot)
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

    void particles; // suppress unused
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
    if (sparks) {
      sparks.setQuantity(active ? 2 : 0);
    }

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

    // Animate belt stripes
    this.beltTiles.forEach((tile) => {
      tile.x += speed;
      if (tile.x > this.scale.width + 16) {
        tile.x -= this.scale.width + 32;
      }
    });

    // Animate products
    this.products.forEach((p, i) => {
      p.x += speed;
      if (p.x > this.scale.width + 40) {
        p.destroy();
        this.products.splice(i, 1);
      }
    });

    // Spawn products
    this.spawnTimer += delta;
    if (this.spawnTimer > 1200) {
      this.spawnTimer = 0;
      this.spawnProduct();
    }
  }

  spawnProduct() {
    const beltY = this.scale.height * 0.55 - 20;
    const container = this.add.container(-20, beltY);

    // Bolt shape
    const bolt = this.add.rectangle(0, 0, 18, 18, 0xf59e0b);
    bolt.setStrokeStyle(2, 0xfcd34d);
    const label = this.add.text(0, 0, '⬡', {
      fontSize: '12px',
      color: '#fcd34d',
    }).setOrigin(0.5);

    container.add([bolt, label]);
    this.products.push(container);

    // Glow effect
    this.tweens.add({
      targets: bolt,
      alpha: 0.7,
      duration: 300,
      yoyo: true,
      repeat: 2,
    });
  }
}

export default function FactoryCanvas({ isRunning }: FactoryCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<FactoryScene | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const scene = new FactoryScene();
    sceneRef.current = scene;

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      backgroundColor: '#0d1117',
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%',
      },
      scene,
      physics: { default: 'arcade' },
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;
    try {
      sceneRef.current.setActive(isRunning);
    } catch {
      // Scene not yet fully initialized — skip
    }
  }, [isRunning]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
