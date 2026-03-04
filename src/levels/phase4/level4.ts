import { Level } from '../../engine/types';

const level11: Level = {
  id: 'p4-l4',
  phase: 4,
  title: 'Sensor Multi-Material',
  objective: 'Creá una función que identifique si una entrada es número, string o null, y devuelva el mensaje correspondiente para cada tipo.',
  concept: 'Union types · typeof · type narrowing',
  mentor: 'artemisa',
  hint: 'number | string | null es un union type — el parámetro puede ser cualquiera de esos tres. Usá typeof para saber cuál llegó en runtime. Para null, usá === null. TypeScript entiende el tipo exacto dentro de cada if.',
  starterCode: `// sensor.ts — Sensor multi-material
// 🎯 Objetivo: función que identifique el tipo de entrada
//
//    Creá: identificarPieza(entrada: number | string | null): string
//
//    - Si es null   → devolvé "⚠️ Sensor vacío"
//    - Si es number → devolvé "Buscando pieza con ID: N"
//    - Si es string → devolvé "Pieza por nombre: NOMBRE_EN_MAYUS"
//
//    Llamala con estos 3 valores y mostrá cada resultado:
//       identificarPieza(42)
//       identificarPieza("perno m6")
//       identificarPieza(null)

// Tu código acá 👇
`,
  solution: `function identificarPieza(entrada: number | string | null): string {
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
  codeHints: [
    'function identificarPieza(entrada: number | string | null): string {',
    '  if (entrada === null) {',
    '    return "⚠️ Sensor vacío"',
    '  }',
    '  if (typeof entrada === "number") {',
    '    return `Buscando pieza con ID: ${entrada}`',
    '  }',
    '  return `Pieza por nombre: ${entrada.toUpperCase()}`',
    '}',
    '',
    'console.log(identificarPieza(42))',
    'console.log(identificarPieza("perno m6"))',
    'console.log(identificarPieza(null))',
  ],
  validate: (output: string[]) =>
    output.some((l) => l.includes('ID: 42')) &&
    output.some((l) => l.toUpperCase().includes('PERNO M6')) &&
    output.some((l) => l.includes('Sensor') || l.includes('vac')),
  lesson: {
    explanation: 'Un union type permite que una variable sea de uno de varios tipos posibles, usando |. Los tipos literal (como "aprobado" | "rechazado") son perfectos para representar estados — TypeScript garantiza que solo uses valores válidos del conjunto definido.',
    codeExample: `// Union de tipos primitivos
let id: string | number = "P-001"
id = 42  // ✅ también acepta number

// Union de tipos literal (más preciso)
type EstadoOrden = "pendiente" | "procesando" | "completada" | "fallida"
let estado: EstadoOrden = "pendiente"
// estado = "cancelada"  // ❌ Error — no está en la union

// TypeScript hace narrowing automático:
function procesar(valor: string | number) {
  if (typeof valor === "string") {
    console.log(valor.toUpperCase())  // sabe que es string
  } else {
    console.log(valor * 2)           // sabe que es number
  }
}`,
    tips: [
      '| separa los tipos posibles en una union',
      'Los tipos literal "ok" | "error" son muy usados para estados de sistema',
      'TypeScript hace narrowing dentro de cada if — sabe el tipo exacto',
    ],
  },
  stampsRequired: 4,
  mechanic: 'detector' as const,
};

export default level11;
