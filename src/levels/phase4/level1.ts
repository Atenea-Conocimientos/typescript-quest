import { Level } from '../../engine/types';

const level8: Level = {
  id: 'p4-l1',
  phase: 4,
  title: 'Inventario Digital',
  objective: 'Creá un array de 5 lotes de producción, imprimí el total y el primer lote, y encontrá el lote más grande.',
  concept: 'Arrays tipados · push · length · indexing',
  mentor: 'apolo',
  hint: 'number[] declara un array de números. .push() agrega elementos, [0] accede al primero (los arrays empiezan en 0), .length dice cuántos hay. Para encontrar el máximo podés recorrer con for...of comparando.',
  starterCode: `// inventario.ts — Almacén de lotes de piezas
// 🎯 Objetivo: gestionar un array de 5 lotes de producción
//    - Creá el array con 5 números (ej: entre 50 y 250)
//    - Imprimí: "Total lotes: 5"
//    - Imprimí: "Primer lote: N piezas"
//    - Encontrá e imprimí: "Lote más grande: N piezas"

// Tu código acá 👇
`,
  solution: `const lotes: number[] = []

lotes.push(120, 85, 200, 60, 175)

console.log(\`Total lotes: \${lotes.length}\`)
console.log(\`Primer lote: \${lotes[0]} piezas\`)

let maximo: number = 0
for (const cantidad of lotes) {
  if (cantidad > maximo) maximo = cantidad
}
console.log(\`Lote más grande: \${maximo} piezas\`)`,
  codeHints: [
    'const lotes: number[] = []',
    '',
    'lotes.push(120, 85, 200, 60, 175)',
    '',
    'console.log(`Total lotes: ${lotes.length}`)',
    'console.log(`Primer lote: ${lotes[0]} piezas`)',
    '',
    'let maximo: number = 0',
    'for (const cantidad of lotes) {',
    '  if (cantidad > maximo) maximo = cantidad',
    '}',
    'console.log(`Lote más grande: ${maximo} piezas`)',
  ],
  validate: (output: string[]) =>
    output.some((l) => l.includes('Total lotes: 5')) &&
    output.some((l) => /Lote m[aá]s grande: \d+/.test(l)),
  stampsRequired: 4,
  mechanic: 'warehouse' as const,
};

export default level8;
