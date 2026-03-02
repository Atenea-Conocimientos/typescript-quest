import { Level } from '../../engine/types';

const level1: Level = {
  id: 'p1-l1',
  phase: 1,
  title: 'Hola Fábrica',
  objective: 'Hacé que el robot anuncie: "PERNO LISTO"',
  concept: 'console.log y strings',
  mentor: 'athenix',
  hint: 'Usá console.log() para enviar un mensaje. Los strings van entre comillas: "así".',
  starterCode: `// Hacé que el robot diga "PERNO LISTO"
console.log("???")`,
  solution: `console.log("PERNO LISTO")`,
  validate: (output: string[]) => output.some((line) => line.includes('PERNO LISTO')),
  stampsRequired: 5,
};

export default level1;
