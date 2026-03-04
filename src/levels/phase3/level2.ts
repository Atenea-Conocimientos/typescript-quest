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
  lesson: {
    explanation: 'El for con índice es perfecto cuando necesitás iterar un número conocido de veces. El for anidado (un for dentro de otro) te permite recorrer estructuras bidimensionales — una grilla de estaciones, una tabla de datos, o en testing: filas × columnas de un dataset de prueba.',
    codeExample: `// For simple: 5 iteraciones
for (let i = 0; i < 5; i++) {
  console.log(\`Estación \${i + 1}\`)
}

// For anidado: grilla 3×3 (9 combinaciones)
for (let fila = 0; fila < 3; fila++) {
  for (let col = 0; col < 3; col++) {
    console.log(\`Celda [\${fila}][\${col}]\`)
  }
}

// for...of para arrays (más limpio que índice):
const items = ["perno", "tuerca", "arandela"]
for (const item of items) {
  console.log(item)
}`,
    tips: [
      'i++ es shorthand para i = i + 1',
      'El índice suele empezar en 0 — el límite es longitud - 1',
      'Preferí for...of para arrays cuando no necesitás el índice',
    ],
  },
  stampsRequired: 4,
  mechanic: 'grid' as const,
};

export default level7;
