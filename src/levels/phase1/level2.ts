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
  validate: (output: string[]) =>
    output.some((line) => line.includes('Olympus') && line.includes('5')),
  stampsRequired: 3,
};

export default level2;
