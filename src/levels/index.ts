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

// Fase 5 — Patrones Avanzados
import level13 from './phase5/level1';

export const ALL_LEVELS: Level[] = [
  level1, level2, level3,
  level4, level5,
  level6, level7,
  level8, level9, level10, level11, level12,
  level13,
];

export const LEVELS_BY_ID: Record<string, Level> = ALL_LEVELS.reduce(
  (acc, level) => ({ ...acc, [level.id]: level }),
  {}
);

export const INITIAL_LEVEL_ID = 'p1-l1';
