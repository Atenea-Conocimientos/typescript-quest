import { Level } from '../../engine/types';

const level8: Level = {
  id: 'p4-l1',
  phase: 4,
  title: 'Inventario Digital',
  objective: 'Completar el código para agregar lotes al array, acceder al primer elemento e imprimir el lote más grande',
  concept: 'Arrays tipados · push · length · indexing',
  mentor: 'apolo',
  hint: 'Los arrays tipados se declaran así: number[]. Usá .push() para agregar elementos, [0] para acceder al primero, .length para saber cuántos hay. Iterá con for...of para recorrer todos.',
  starterCode: `// inventario.ts — Almacén de lotes de piezas
const lotes: number[] = []

// Agregá 5 lotes con push (completá los valores):
lotes.push(???, 85, 200, 60, 175)

console.log(\`Total lotes: \${lotes.length}\`)
console.log(\`Primer lote: \${lotes[???]} piezas\`)

let maximo: number = 0
for (const cantidad of lotes) {
  if (cantidad > maximo) maximo = cantidad
}
console.log(\`Lote más grande: \${maximo} piezas\`)`,
  solution: `const lotes: number[] = []

lotes.push(120, 85, 200, 60, 175)

console.log(\`Total lotes: \${lotes.length}\`)
console.log(\`Primer lote: \${lotes[0]} piezas\`)

let maximo: number = 0
for (const cantidad of lotes) {
  if (cantidad > maximo) maximo = cantidad
}
console.log(\`Lote más grande: \${maximo} piezas\`)`,
  validate: (output: string[]) =>
    output.some((l) => l.includes('Total lotes: 5')) &&
    output.some((l) => l.includes('Lote más grande: 200')),
  stampsRequired: 4,
  mechanic: 'warehouse' as const,
};

export default level8;
