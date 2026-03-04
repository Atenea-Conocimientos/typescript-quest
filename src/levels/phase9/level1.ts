import { Level } from '../../engine/types';

const level23: Level = {
  id: 'p9-l1',
  phase: 9,
  title: 'El Escáner de Tipos',
  objective: 'Implementá type guards con typeof, instanceof e in para identificar y procesar piezas de diferentes tipos.',
  concept: 'typeof · instanceof · in · type guards · narrowing',
  mentor: 'hermes',
  hint: 'typeof x === "string" | "number" | "boolean". instanceof comprueba si x fue creado con un constructor (x instanceof MiClase). El operador in verifica si una propiedad existe ("peso" in pieza). Dentro del if, TypeScript sabe exactamente el tipo — eso es narrowing.',
  starterCode: `// type-guards.ts — Escáner de tipos de piezas
// 🎯 Objetivo:
//    1. class PiezaMetal con peso: number
//    2. class PiezaElectronica con voltaje: number
//    3. type guard: esMetal(p): p is PiezaMetal — usar instanceof
//    4. función procesarPieza(p: PiezaMetal | PiezaElectronica): string
//       Si es metal → "Metal: [peso]kg"
//       Si es electrónica → "Electronica: [voltaje]V"
//    5. función identificar(valor: unknown): string — usar typeof
//    6. Procesar un lote de 4 piezas mixtas
//    7. Imprimir: "Escaneadas: 4 piezas"

// Tu código acá 👇
`,
  solution: `class PiezaMetal {
  tipo = 'metal' as const
  constructor(public peso: number) {}
}

class PiezaElectronica {
  tipo = 'electronica' as const
  constructor(public voltaje: number) {}
}

function esMetal(p: PiezaMetal | PiezaElectronica): p is PiezaMetal {
  return p instanceof PiezaMetal
}

function procesarPieza(p: PiezaMetal | PiezaElectronica): string {
  if (esMetal(p)) return \`Metal: \${p.peso}kg\`
  return \`Electronica: \${p.voltaje}V\`
}

function identificar(valor: unknown): string {
  if (typeof valor === 'string') return \`string: "\${valor}"\`
  if (typeof valor === 'number') return \`number: \${valor}\`
  if (typeof valor === 'boolean') return \`boolean: \${valor}\`
  if (typeof valor === 'object' && valor !== null) return \`object: \${JSON.stringify(valor)}\`
  return 'desconocido'
}

const lote: (PiezaMetal | PiezaElectronica)[] = [
  new PiezaMetal(2.5),
  new PiezaElectronica(12),
  new PiezaMetal(0.8),
  new PiezaElectronica(5),
]

lote.forEach(p => console.log(procesarPieza(p)))
console.log(identificar('hola'))
console.log(identificar(42))
console.log(\`Escaneadas: \${lote.length} piezas\`)`,
  codeHints: [
    'class PiezaMetal {',
    '  tipo = "metal" as const',
    '  constructor(public peso: number) {}',
    '}',
    'class PiezaElectronica {',
    '  tipo = "electronica" as const',
    '  constructor(public voltaje: number) {}',
    '}',
    '',
    'function esMetal(p: PiezaMetal | PiezaElectronica): p is PiezaMetal {',
    '  return p instanceof PiezaMetal',
    '}',
    '',
    'function procesarPieza(p: PiezaMetal | PiezaElectronica): string {',
    '  if (esMetal(p)) return `Metal: ${p.peso}kg`',
    '  return `Electronica: ${p.voltaje}V`',
    '}',
    '',
    'const lote: (PiezaMetal | PiezaElectronica)[] = [',
    '  new PiezaMetal(2.5), new PiezaElectronica(12),',
    '  new PiezaMetal(0.8), new PiezaElectronica(5),',
    ']',
    'lote.forEach(p => console.log(procesarPieza(p)))',
    'console.log(`Escaneadas: ${lote.length} piezas`)',
  ],
  validate: (output: string[]) =>
    output.some(l => l.includes('Metal:')) &&
    output.some(l => l.includes('Electronica:')) &&
    output.some(l => l.includes('Escaneadas: 4 piezas')),
  lesson: {
    explanation: 'Los type guards son expresiones que, al ser verdaderas, le dicen a TypeScript el tipo exacto de una variable. Dentro del if, el compilador "estrecha" (narrow) el tipo y habilita solo las operaciones válidas para ese tipo. Es la diferencia entre código seguro y código que puede fallar en runtime.',
    codeExample: `// typeof: para primitivos
function identificar(valor: unknown): string {
  if (typeof valor === "string") return valor.toUpperCase()  // sabe: string
  if (typeof valor === "number") return String(valor * 2)   // sabe: number
  return "desconocido"
}

// instanceof: para clases
class PiezaMetal { constructor(public peso: number) {} }
class PiezaElec  { constructor(public voltaje: number) {} }

function procesar(p: PiezaMetal | PiezaElec): string {
  if (p instanceof PiezaMetal) return \`Metal: \${p.peso}kg\`
  return \`Electrónica: \${p.voltaje}V\`  // TypeScript sabe: PiezaElec
}

// Type predicate: función que actúa como guard
function esMetal(p: PiezaMetal | PiezaElec): p is PiezaMetal {
  return p instanceof PiezaMetal
}`,
    tips: [
      'typeof funciona para: "string", "number", "boolean", "object", "function"',
      'instanceof funciona para clases — no para interfaces (estas no existen en JS)',
      'p is T en el return type convierte la función en un type guard reutilizable',
    ],
  },
  stampsRequired: 5,
  mechanic: 'narrower' as const,
  subtitle: 'type-guards.ts — El robot identifica el tipo exacto de cada pieza antes de procesarla',
  module: 9,
  moduleName: 'Type Guards & Narrowing',
  metaphor: 'El escáner de la fábrica no puede procesar una pieza hasta saber exactamente qué es. TypeScript hace lo mismo: dentro del if, ya sabe el tipo exacto y habilita solo las operaciones correctas.',
  concepts: 'typeof operator · instanceof operator · in operator · Type predicate: p is T · Narrowing automático · unknown vs any',
  unlocks: ['Escáner de tipos', 'Narrowing maestro'],
};

export default level23;
