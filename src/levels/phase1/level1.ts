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
  codeHints: [
    '// Usá console.log() para imprimir',
    'console.log("PERNO LISTO")',
  ],
  validate: (output: string[]) => output.some((line) => line.includes('PERNO LISTO')),
  lesson: {
    explanation: 'console.log() es el micrófono del robot: todo lo que ponés entre paréntesis se transmite a la pantalla de la fábrica. Es la primera instrucción que vas a usar en cualquier programa TypeScript y la que más vas a ver en tus tests de automatización.',
    codeExample: `// Distintas formas de usar console.log
console.log("Mensaje simple")
console.log("Número:", 42)
console.log("Suma:", 10 + 5)        // → 15

// Podés pasar múltiples argumentos
console.log("Robot", "Olympus", 1)  // → Robot Olympus 1

// En tus tests de Playwright:
console.log("Página cargada:", url)`,
    tips: [
      'Los strings van entre comillas simples \' o dobles "',
      'Podés pasar múltiples valores separados por coma — los une con espacio',
      'En tus tests de Playwright lo vas a usar constantemente para debuguear',
    ],
  },
  stampsRequired: 2,
  mechanic: 'speech' as const,
};

export default level1;
