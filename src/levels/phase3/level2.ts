import { Level } from '../../engine/types';

const level7: Level = {
  id: 'p3-l2',
  phase: 3,
  title: 'Línea de Ensamblaje',
  objective: 'Mapeá todas las estaciones de una fábrica de 4×4. Imprimí cada una con su fila y columna, y el total al final.',
  concept: 'for · loops anidados',
  mentor: 'hermes',
  hint: 'Para recorrer filas Y columnas necesitás dos for, uno adentro del otro. El de afuera avanza por filas, el de adentro por columnas. Cada combinación (fila, col) es una estación.',
  starterCode: `// linea.ts — Mapear todas las estaciones de la fábrica
// 🎯 Objetivo: recorrer una grilla de 4×4 e imprimir cada estación
//    Formato: "🔩 Estación N → fila F, col C"
//    Al final:  "Total estaciones: 16"

const filas: number = 4
const columnas: number = 4

// Tu código acá 👇
`,
  solution: `const filas: number = 4
const columnas: number = 4
let estacion: number = 1

for (let f = 0; f < filas; f++) {
  for (let c = 0; c < columnas; c++) {
    console.log(\`🔩 Estación \${estacion} → fila \${f}, col \${c}\`)
    estacion++
  }
}

console.log(\`Total estaciones: \${filas * columnas}\`)`,
  codeHints: [
    'let estacion: number = 1',
    '',
    'for (let f = 0; f < filas; f++) {',
    '  for (let c = 0; c < columnas; c++) {',
    '    console.log(`🔩 Estación ${estacion} → fila ${f}, col ${c}`)',
    '    estacion++',
    '  }',
    '}',
    '',
    'console.log(`Total estaciones: ${filas * columnas}`)',
  ],
  validate: (output: string[]) =>
    output.some((l) => l.includes('Total estaciones: 16')) &&
    output.some((l) => l.includes('Estaci')),
  stampsRequired: 4,
  mechanic: 'grid' as const,
};

export default level7;
