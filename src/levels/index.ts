import { Level } from '../engine/types';
import level1 from './phase1/level1';
import level2 from './phase1/level2';
import level3 from './phase1/level3';

export const ALL_LEVELS: Level[] = [level1, level2, level3];

export const LEVELS_BY_ID: Record<string, Level> = ALL_LEVELS.reduce(
  (acc, level) => ({ ...acc, [level.id]: level }),
  {}
);

export const INITIAL_LEVEL_ID = 'p1-l1';
