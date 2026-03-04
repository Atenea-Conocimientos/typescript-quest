import { Level } from '../../engine/types';

const level2: Level = {
  id: 'p1-l2',
  phase: 1,
  title: 'Contar Pernos',
  objective: 'Declarar el nombre de la fábrica con const y la cantidad de pernos con let, luego mostrá ambos',
  concept: 'Variables: let y const',
  mentor: 'athenix',
  hint: 'Usá const para valores que no cambian (como un nombre) y let para los que sí pueden cambiar (como un contador). Ej: const nombre = "Olympus" / let cantidad = 5',
  starterCode: `// Nombre fijo de la fábrica (usa const — no cambia)
const fabrica = "???"

// Cantidad de pernos (usa let — puede cambiar)
let pernos = ???

console.log(fabrica + ": " + pernos + " pernos")`,
  solution: `const fabrica = "Olympus"
let pernos = 5
console.log(fabrica + ": " + pernos + " pernos")`,
  codeHints: [
    'const fabrica = "Olympus"',
    'let pernos = 5',
    'console.log(fabrica + ": " + pernos + " pernos")',
  ],
  validate: (output: string[]) =>
    output.some((line) => line.includes('Olympus') && line.includes('5')),
  lesson: {
    explanation: 'let y const son las dos formas de declarar variables. const es para valores que no cambian (el nombre de la fábrica, una URL de base), let para valores que pueden cambiar (contadores, estados). La regla de oro: usá const por defecto y cambiá a let solo cuando necesites reasignar.',
    codeExample: `const fabrica = "Olympus"   // ✅ const: no cambia
let pernos = 100            // ✅ let: puede cambiar

pernos = 80                 // ✅ OK — reasignación de let
// fabrica = "otro"         // ❌ Error — const no se puede cambiar

// TypeScript infiere el tipo automáticamente:
const url = "https://api.com"  // infiere: string
let intentos = 0               // infiere: number`,
    tips: [
      'Usá const por defecto — más seguro y más claro',
      'let cuando el valor cambia: contadores, estado, resultados de loops',
      'TypeScript infiere el tipo sin que lo escribas explícitamente',
    ],
  },
  stampsRequired: 3,
  mechanic: 'tanks' as const,
};

export default level2;
