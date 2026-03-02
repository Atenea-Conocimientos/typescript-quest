import { Level } from '../../engine/types';

const level6: Level = {
  id: 'p3-l1',
  phase: 3,
  title: 'Turno Continuo',
  objective: 'Completar el while loop para que el robot trabaje hasta agotar la energía (100 → 0, consumo 10 por ciclo)',
  concept: 'while loop · condición de parada',
  mentor: 'hermes',
  hint: 'while (condición) ejecuta el bloque mientras la condición sea verdadera. Acordate de actualizar la variable de control dentro del loop, si no ¡loop infinito! Usá > (mayor que) para verificar que quede energía.',
  starterCode: `// turno.ts — El robot trabaja mientras haya energía
let energia: number = 100
let piezas: number = 0
const consumo: number = 10

// Completá la condición del while:
while (energia ???) {
  energia -= consumo
  piezas++
  console.log(\`⚡ Energía: \${energia} | Pieza #\${piezas} lista\`)
}

console.log(\`Turno finalizado. Total: \${piezas} piezas\`)`,
  solution: `let energia: number = 100
let piezas: number = 0
const consumo: number = 10

while (energia > 0) {
  energia -= consumo
  piezas++
  console.log(\`⚡ Energía: \${energia} | Pieza #\${piezas} lista\`)
}

console.log(\`Turno finalizado. Total: \${piezas} piezas\`)`,
  validate: (output: string[]) =>
    output.some((l) => l.includes('Turno finalizado') && l.includes('10 piezas')),
  stampsRequired: 4,
  mechanic: 'energy-bar' as const,
};

export default level6;
