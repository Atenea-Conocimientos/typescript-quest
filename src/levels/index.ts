import { Level } from '../engine/types';

// Fase 1 — Fundamentos
import level1 from './phase1/level1';
import level2 from './phase1/level2';
import level3 from './phase1/level3';

// Fase 2 — Sistema de Tipos
import level4 from './phase2/level1';
import level5 from './phase2/level2';

// Fase 3 — Loops y Repetición
import level6 from './phase3/level1';
import level7 from './phase3/level2';

// Fase 4 — Estructuras de Datos y Tipado Avanzado
import level8 from './phase4/level1';
import level9 from './phase4/level2';
import level10 from './phase4/level3';
import level11 from './phase4/level4';
import level12 from './phase4/level5';

// Fase 5 — Programación Funcional
import level13 from './phase5/level1';

// Fase 6 — Patrones Avanzados
import level14 from './phase6/level1';
import level15 from './phase6/level2';
import level16 from './phase6/level3';

// Fase 7 — Boss Stages: Algoritmos Reales
import level17 from './phase7/level1';
import level18 from './phase7/level2';
import level19 from './phase7/level3';

export const ALL_LEVELS: Level[] = [
  level1, level2, level3,
  level4, level5,
  level6, level7,
  level8, level9, level10, level11, level12,
  level13,
  level14, level15, level16,
  level17, level18, level19,
];

export const LEVELS_BY_ID: Record<string, Level> = ALL_LEVELS.reduce(
  (acc, level) => ({ ...acc, [level.id]: level }),
  {}
);

export const INITIAL_LEVEL_ID = 'p1-l1';
