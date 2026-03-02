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
  stampsRequired: 4,
  mechanic: 'detector' as const,
};

export default level11;
