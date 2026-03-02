import { Level } from '../../engine/types';

const level11: Level = {
  id: 'p4-l4',
  phase: 4,
  title: 'Sensor Multi-Material',
  objective: 'Completar el union type (número | texto | ???) y el type narrowing para que el sensor maneje los 3 casos',
  concept: 'Union types · typeof · type narrowing',
  mentor: 'artemisa',
  hint: 'Un union type acepta más de un tipo: number | string | null. Usá typeof para saber qué recibiste en runtime. TypeScript "estrecha" el tipo dentro de cada if — dentro del bloque typeof === "number" ya sabe que es number.',
  starterCode: `// sensor.ts — El sensor detecta piezas de distintos tipos

function identificarPieza(
  entrada: number | string | ??? // completá el tercer tipo posible
): string {
  // Caso 1: entrada ausente
  if (entrada === null) {
    return "⚠️ Sensor vacío"
  }
  // Caso 2: llegó un número (ID de pieza)
  if (typeof entrada === "???") {
    return \`Buscando pieza con ID: \${entrada}\`
  }
  // Caso 3: llegó texto (TS ya sabe que es string aquí)
  return \`Pieza por nombre: \${entrada.toUpperCase()}\`
}

console.log(identificarPieza(42))
console.log(identificarPieza("perno m6"))
console.log(identificarPieza(null))`,
  solution: `function identificarPieza(
  entrada: number | string | null
): string {
  if (entrada === null) {
    return "⚠️ Sensor vacío"
  }
  if (typeof entrada === "number") {
    return \`Buscando pieza con ID: \${entrada}\`
  }
  return \`Pieza por nombre: \${entrada.toUpperCase()}\`
}

console.log(identificarPieza(42))
console.log(identificarPieza("perno m6"))
console.log(identificarPieza(null))`,
  validate: (output: string[]) =>
    output.some((l) => l.includes('ID: 42')) &&
    output.some((l) => l.includes('PERNO M6')) &&
    output.some((l) => l.includes('Sensor vacío')),
  stampsRequired: 4,
  mechanic: 'detector' as const,
};

export default level11;
