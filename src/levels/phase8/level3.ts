import { Level } from '../../engine/types';

const level22: Level = {
  id: 'p8-l3',
  phase: 8,
  title: 'El Transformador de Esquemas',
  objective: 'Creá mapped types para transformar interfaces automáticamente y usá tipos condicionales.',
  concept: 'mapped types · { [K in keyof T] } · conditional types · T extends ? :',
  mentor: 'hermes',
  hint: 'Mapped type: type Nullable<T> = { [K in keyof T]: T[K] | null }. Itera las keys de T y transforma cada valor. Tipo condicional: type EsNumerico<T> = T extends number ? "si" : "no" — TypeScript elige el branch según el tipo en compile time.',
  starterCode: `// mapped-types.ts — Transformador de esquemas de datos
// 🎯 Objetivo:
//    1. type Nullable<T> = todas las props aceptan null
//    2. type Stringify<T> = todas las props se convierten a string
//    3. type EsNumerico<T> = "si" si T extends number, "no" si no
//    4. Crear robotNullable: Nullable<RobotCore>
//    5. Imprimir: "Nullable energia: null"
//    6. Imprimir: "Es numerico number: si"
//    7. Imprimir: "Es numerico string: no"

interface RobotCore {
  nombre: string
  energia: number
  activo: boolean
}

// Tu código acá 👇
`,
  solution: `interface RobotCore {
  nombre: string
  energia: number
  activo: boolean
}

type Nullable<T> = { [K in keyof T]: T[K] | null }
type Stringify<T> = { [K in keyof T]: string }
type EsNumerico<T> = T extends number ? 'si' : 'no'

const robotNullable: Nullable<RobotCore> = {
  nombre: 'Olympus-2',
  energia: null,
  activo: null,
}

const robotStr: Stringify<RobotCore> = {
  nombre: 'Olympus-2',
  energia: '100',
  activo: 'true',
}

console.log(\`Nullable energia: \${robotNullable.energia}\`)
console.log(\`Stringify activo: \${robotStr.activo} (type: \${typeof robotStr.activo})\`)
console.log(\`Es numerico number: si\`)
console.log(\`Es numerico string: no\`)
console.log(\`Campos transformados: \${Object.keys(robotNullable).length}\`)`,
  validate: (output: string[]) =>
    output.some(l => l.includes('Nullable energia: null')) &&
    output.some(l => l.includes('Es numerico number: si')) &&
    output.some(l => l.includes('Es numerico string: no')),
  lesson: {
    explanation: 'Los mapped types iteran sobre las keys de una interface y transforman cada propiedad. Con { [K in keyof T]: ... } podés crear versiones derivadas de cualquier tipo automáticamente. Los tipos condicionales (T extends X ? A : B) eligen un tipo según una condición en compile time.',
    codeExample: `// Mapped type: transforma cada propiedad
type Nullable<T> = { [K in keyof T]: T[K] | null }
type Stringify<T> = { [K in keyof T]: string }

interface Robot { nombre: string; energia: number }

// Nullable<Robot> → { nombre: string|null; energia: number|null }
const r: Nullable<Robot> = { nombre: "X", energia: null }

// Tipo condicional: elige en compile time
type EsString<T> = T extends string ? "sí" : "no"
type A = EsString<string>  // "sí"
type B = EsString<number>  // "no"

// Los Utility Types de TS son mapped types internamente:
// type Partial<T> = { [K in keyof T]?: T[K] }
// type Readonly<T> = { readonly [K in keyof T]: T[K] }`,
    tips: [
      '{ [K in keyof T]: T[K] } es la base de todos los utility types de TypeScript',
      'T extends X ? A : B se evalúa en compilación, no en runtime',
      'infer permite extraer un tipo de otro: T extends Promise<infer U> ? U : never',
    ],
  },
  stampsRequired: 5,
  mechanic: 'transformer' as const,
  subtitle: 'mapped-types.ts — Generá nuevas interfaces automáticamente a partir de las existentes',
  module: 8,
  moduleName: 'Utility Types',
  metaphor: 'El transformador industrial toma un material y lo procesa para crear otro diferente manteniendo la estructura. Los mapped types hacen lo mismo con interfaces: tomás Robot y obtenés NullableRobot sin escribir cada campo a mano.',
  concepts: 'Mapped types { [K in keyof T]: ... } · Tipos condicionales T extends X ? A : B · Modificadores +/- opcional y readonly · infer keyword',
  unlocks: ['Transformador de esquemas', 'Meta-tipado'],
};

export default level22;
