export type MentorId = 'athenix' | 'hermes' | 'apolo' | 'artemisa';

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
