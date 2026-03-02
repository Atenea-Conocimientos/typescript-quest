import { Level } from '../../engine/types';

const level7: Level = {
  id: 'p3-l2',
  phase: 3,
  title: 'Línea de Ensamblaje',
  objective: 'Completar el for anidado para recorrer una grilla de 4×4 estaciones e imprimir el total al final',
  concept: 'for · loops anidados',
  mentor: 'hermes',
  hint: 'El for clásico: for (let i = 0; i < limite; i++). Para recorrer filas Y columnas necesitás dos for uno adentro del otro. La variable i (o f, c) se actualiza sola con i++.',
  starterCode: `// linea.ts — Recorrer todas las estaciones de la fábrica
const filas: number = 4
const columnas: number = 4
let estacion: number = 1

// Completá las condiciones del for (reemplazá ???):
for (let f = 0; f < ???; f++) {
  for (let c = 0; c < ???; c++) {
    console.log(\`🔩 Estación \${estacion} → fila \${f}, col \${c}\`)
    estacion++
  }
}

console.log(\`Total estaciones: \${filas * columnas}\`)`,
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
  validate: (output: string[]) =>
    output.some((l) => l.includes('Total estaciones: 16')) &&
    output.some((l) => l.includes('Estación 1')),
  stampsRequired: 4,
  mechanic: 'grid' as const,
};

export default level7;
