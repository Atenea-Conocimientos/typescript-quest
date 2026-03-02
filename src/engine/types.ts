export type MentorId = 'athenix' | 'hermes' | 'apolo' | 'artemisa';

export type LevelMechanic =
  | 'speech'      // p1-l1: console.log — robot speech bubble
  | 'tanks'       // p1-l2: let vs const — two fill tanks
  | 'assembler'   // p1-l3: template literals — parts assembling
  | 'scanner'     // p2-l1: type annotations — type scanner beam
  | 'sorter'      // p2-l2: if/else if/else — 3-lane quality sorter
  | 'energy-bar'  // p3-l1: while loop — energy draining bar
  | 'grid'        // p3-l2: for nested — 4×4 station grid lighting up
  | 'warehouse'   // p4-l1: arrays — warehouse shelves filling
  | 'machine'     // p4-l2: functions — input→process→output machine
  | 'cards'       // p4-l3: interface/objects — product cards
  | 'detector'    // p4-l4: union types — type detector lights
  | 'panel'       // p4-l5: enum/switch — status control panel
  | 'pipeline';   // p5-l1: filter/reduce — item pipeline

export interface Mentor {
  id: MentorId;
  name: string;
  emoji: string;
  color: string;
  phases: number[];
}

export interface Level {
  id: string;
  phase: number;
  title: string;
  objective: string;
  concept: string;
  mentor: MentorId;
  hint: string;
  starterCode: string;
  solution: string;
  validate: (output: string[]) => boolean;
  stampsRequired?: number;
  mechanic: LevelMechanic;
}

export interface GameState {
  currentLevelId: string;
  unlockedLevels: string[];
  completedLevels: string[];
  resources: {
    bolts: number;
    crates: number;
    gears: number;
  };
}

export interface RunResult {
  success: boolean;
  output: string[];
  error?: string;
  duration?: number;
}
