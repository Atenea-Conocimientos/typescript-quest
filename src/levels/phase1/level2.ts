import { Level } from '../../engine/types';

const level2: Level = {
  id: 'p1-l2',
  phase: 1,
  title: 'Count the Bolts',
  objective: 'Store the number 5 in a variable and log it',
  concept: 'Variables: let & const',
  mentor: 'athenix',
  hint: 'Use "let" for values that can change, "const" for values that stay fixed. Try: let bolts = 5',
  starterCode: `// Store 5 bolts in a variable and log it
let bolts = ???
console.log(bolts)`,
  solution: `let bolts = 5
console.log(bolts)`,
  validate: (output: string[]) => output.some((line) => line.trim() === '5'),
};

export default level2;
