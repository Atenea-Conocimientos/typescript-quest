import { Level } from '../../engine/types';

const level1: Level = {
  id: 'p1-l1',
  phase: 1,
  title: 'Hello Factory',
  objective: 'Make the robot announce: "BOLT READY"',
  concept: 'console.log & strings',
  mentor: 'athenix',
  hint: 'Use console.log() to send a message. Strings are wrapped in quotes: "like this".',
  starterCode: `// Make the robot say "BOLT READY"
console.log("???")`,
  solution: `console.log("BOLT READY")`,
  validate: (output: string[]) => output.some((line) => line.includes('BOLT READY')),
};

export default level1;
