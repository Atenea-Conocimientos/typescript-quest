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
  lesson: {
    explanation: 'Un array es una lista ordenada de elementos del mismo tipo. En TypeScript, string[] es un array de strings, number[] de números. Los arrays son fundamentales en testing: listas de elementos a verificar, resultados de queries, lotes de datos de prueba.',
    codeExample: `// Declarar arrays tipados
const piezas: string[] = ["perno", "tuerca", "arandela"]
const precios: number[] = [0.5, 1.2, 0.8]

// Acceder por índice (empieza en 0)
console.log(piezas[0])    // "perno"
console.log(piezas.length) // 3

// Métodos esenciales
piezas.push("tornillo")           // agrega al final
const ultimo = piezas.pop()       // saca el último
const sublista = piezas.slice(0, 2) // copia parcial

// Iterar
piezas.forEach(p => console.log(p))
const mayus = piezas.map(p => p.toUpperCase())`,
    tips: [
      'Los índices empiezan en 0 — el último es length - 1',
      'push/pop para agregar/quitar al final, unshift/shift al inicio',
      'forEach para iterar, map para transformar, filter para filtrar',
    ],
  },
  stampsRequired: 4,
  mechanic: 'warehouse' as const,
};

export default level8;
