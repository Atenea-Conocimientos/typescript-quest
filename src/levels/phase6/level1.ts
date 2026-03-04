import { Level } from '../../engine/types';

const level14: Level = {
  id: 'p6-l1',
  phase: 6,
  title: 'Almacén Genérico',
  objective: 'Creá función almacenar<T>, interface Caja<T>, y función primero<T>. Imprimí el contenido de cada caja.',
  concept: 'generics · <T> · type parameters',
  mentor: 'athenix',
  hint: 'Los generics son plantillas de tipo. function fn<T>(x: T): T funciona para cualquier tipo. TypeScript infiere T automáticamente al llamar la función — no hace falta escribir fn<number>(5).',
  starterCode: `// almacen-generico.ts — Sistema de almacenamiento universal
// 🎯 Objetivo:
//    1. función genérica almacenar<T>(item: T, deposito: T[]): T[]
//    2. interface genérica Caja<T> con contenido: T, etiqueta: string, sellada: boolean
//    3. Crear cajaPernos: Caja<number> y cajaProducto: Caja<Producto>
//    4. Función primero<T>(lista: T[]): T | undefined
//    5. Para cada caja imprimir: "Caja: [etiqueta] → [contenido]"
//    6. Imprimir: "Primero del depósito: [etiqueta]"

interface Producto {
  nombre: string
  precio: number
}

const catalogo: Producto[] = [
  { nombre: 'Perno M6', precio: 0.5 },
  { nombre: 'Engranaje Z4', precio: 12.0 },
]

// Tu código acá 👇
`,
  solution: `interface Producto {
  nombre: string
  precio: number
}

const catalogo: Producto[] = [
  { nombre: 'Perno M6', precio: 0.5 },
  { nombre: 'Engranaje Z4', precio: 12.0 },
]

function almacenar<T>(item: T, deposito: T[]): T[] {
  return [...deposito, item]
}

interface Caja<T> {
  contenido: T
  etiqueta: string
  sellada: boolean
}

const cajaPernos: Caja<number> = {
  contenido: 500, etiqueta: 'Pernos M6', sellada: true
}

const cajaProducto: Caja<Producto> = {
  contenido: catalogo[0], etiqueta: 'QA OK', sellada: false
}

function primero<T>(lista: T[]): T | undefined {
  return lista[0]
}

console.log(\`Caja: \${cajaPernos.etiqueta} → \${cajaPernos.contenido}\`)
console.log(\`Caja: \${cajaProducto.etiqueta} → \${cajaProducto.contenido.nombre}\`)
const deposito = almacenar(cajaPernos, [])
console.log(\`Primero del depósito: \${primero(deposito)?.etiqueta}\`)
console.log(\`Cajas totales: \${deposito.length}\`)`,
  validate: (output: string[]) =>
    output.some(l => l.includes('Caja:')) &&
    output.some(l => l.includes('Primero del depósito:')),
  lesson: {
    explanation: 'Los generics permiten escribir funciones y clases que funcionan con cualquier tipo sin perder type safety. En vez de duplicar código para cada tipo, usás un parámetro de tipo <T> que TypeScript reemplaza automáticamente según cómo llamás la función.',
    codeExample: `// Sin generics: necesitás una función por tipo ❌
function guardarNumero(n: number, arr: number[]) { ... }
function guardarString(s: string, arr: string[]) { ... }

// Con generics: una función para todo ✅
function guardar<T>(item: T, arr: T[]): T[] {
  return [...arr, item]
}

// TypeScript infiere T automáticamente:
guardar(42, [])          // T = number
guardar("hola", [])      // T = string

// Interface genérica:
interface Caja<T> {
  contenido: T
  etiqueta: string
}
const caja: Caja<number> = { contenido: 500, etiqueta: "Pernos" }`,
    tips: [
      '<T> es el nombre convencional pero podés usar cualquiera: <Item>, <Data>',
      'TypeScript infiere T automáticamente — no hace falta escribir fn<number>(5)',
      'Restricciones: <T extends object> limita T a tipos que sean objetos',
    ],
  },
  stampsRequired: 5,
  mechanic: 'forge' as const,

  // Curriculum
  subtitle: 'generics.ts — Un sistema de almacenamiento que funciona para cualquier tipo de pieza',
  module: 5,
  moduleName: 'Patrones Avanzados',
  metaphor: 'El almacén necesita un sistema de estanterías universal: no importa si guarda pernos, circuitos o ruedas — el sistema funciona igual. Los generics permiten construir funciones y clases que son type-safe para cualquier tipo sin duplicar código.',
  concepts: 'function fn<T>(param: T): T · Inferencia del tipo genérico · Múltiples parámetros <T, K> · Restricción <T extends object> · Interfaces genéricas · Por qué no usar any',
  unlocks: ['Almacén universal', 'Reutilización máxima'],
};

export default level14;
