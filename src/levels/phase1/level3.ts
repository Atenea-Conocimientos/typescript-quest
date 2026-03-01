import { Level } from '../../engine/types';

const level3: Level = {
  id: 'p1-l3',
  phase: 1,
  title: 'Quality Check',
  objective: 'Log "APPROVED" if quality > 7, otherwise log "REJECTED"',
  concept: 'if/else conditions',
  mentor: 'athenix',
  hint: 'Use if/else to make decisions. if (condition) { ... } else { ... }',
  starterCode: `// Quality check: > 7 = APPROVED, otherwise REJECTED
const quality = 8
if (quality ???) {
  console.log("???")
} else {
  console.log("???")
}`,
  solution: `const quality = 8
if (quality > 7) {
  console.log("APPROVED")
} else {
  console.log("REJECTED")
}`,
  validate: (output: string[]) => output.some((line) => line.includes('APPROVED')),
};

export default level3;
