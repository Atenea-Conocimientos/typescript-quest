import { Level } from '../../engine/types';

const level6: Level = {
  id: 'p3-l1',
  phase: 3,
  title: 'Turno Continuo',
  objective: 'Hacé que el robot trabaje hasta agotar la energía. Cada ciclo consume 10 unidades y produce una pieza. Al final imprimí el total.',
  concept: 'while loop · condición de parada',
  mentor: 'hermes',
  hint: '¿Qué tiene que ser verdadero para que el robot siga trabajando? Pensá en la condición que controla el while. Y acordate: si la energía no cambia dentro del loop, el robot trabaja para siempre.',
  starterCode: `// turno.ts — El robot trabaja mientras haya energía
// 🎯 Objetivo: producir piezas hasta agotar la energía
//    - Cada ciclo: la energía baja 10, las piezas suben 1
//    - Imprimí por ciclo: "⚡ Energía: X | Pieza #N lista"
//    - Al terminar: "Turno finalizado. Total: N piezas"

let energia: number = 100
let piezas: number = 0
const consumo: number = 10

// Tu código acá 👇
`,
  solution: `let energia: number = 100
let piezas: number = 0
const consumo: number = 10

while (energia > 0) {
  energia -= consumo
  piezas++
  console.log(\`⚡ Energía: \${energia} | Pieza #\${piezas} lista\`)
}

console.log(\`Turno finalizado. Total: \${piezas} piezas\`)`,
  codeHints: [
    'while (energia > 0) {',
    '  energia -= consumo',
    '  piezas++',
    '  console.log(`⚡ Energía: ${energia} | Pieza #${piezas} lista`)',
    '}',
    '',
    'console.log(`Turno finalizado. Total: ${piezas} piezas`)',
  ],
  validate: (output: string[]) =>
    output.some((l) => l.includes('Turno finalizado') && l.includes('10 piezas')),
  stampsRequired: 4,
  mechanic: 'energy-bar' as const,
};

export default level6;
