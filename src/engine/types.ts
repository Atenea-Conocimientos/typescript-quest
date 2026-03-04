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
  | 'pipeline'        // p5-l1: filter/reduce — item pipeline
  | 'forge'           // p6-l1: generics — animated typed crates
  | 'blueprint'       // p6-l2: classes — robot assembly card
  | 'recursion-tree'  // p6-l3: recursion — tree node counter
  | 'bar-sort'        // p7-l1: sorting — animated bar chart
  | 'maze'            // p7-l2: DFS — grid maze navigation
  | 'parallel'        // p7-l3: async/await — parallel progress bars
  | 'inspector'       // p8-l1: Pick/Omit/Partial — field inspector panel
  | 'catalog'         // p8-l2: Record/Readonly — locked catalog cards
  | 'transformer'     // p8-l3: mapped types — schema field transformer
  | 'narrower'        // p9-l1: typeof/instanceof/in — type scanner belt
  | 'switcher'        // p9-l2: discriminated unions/never — switch panel
  | 'faultlog'        // p10-l1: custom errors — error log terminal
  | 'result-board'    // p10-l2: Result<T,E> pattern — ok/err split board
  | 'factory-complete'; // p11-l1: boss final — full factory celebration

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
  /** Progressive code skeleton — each string is one hint line revealed on click */
  codeHints?: string[];
  validate: (output: string[]) => boolean;
  stampsRequired?: number;
  mechanic: LevelMechanic;

  // ── Curriculum metadata (optional, used for course display) ──────────────
  /** Short subtitle shown below the title (e.g. "generics.ts — ...") */
  subtitle?: string;
  /** Module number within the course (e.g. 5) */
  module?: number;
  /** Module display name (e.g. "Patrones Avanzados") */
  moduleName?: string;
  /** Factory metaphor explaining the concept in context */
  metaphor?: string;
  /** Comma-separated list of sub-concepts taught in this level */
  concepts?: string;
  /** Achievements/features unlocked on completion */
  unlocks?: string[];
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
