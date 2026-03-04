import { Level } from '../../engine/types';

const level16: Level = {
  id: 'p6-l3',
  phase: 6,
  title: 'Búsqueda en Profundidad',
  objective: 'Implementá función recursiva contarTotal(caja) que cuenta TODAS las piezas en un árbol de cajas anidadas.',
  concept: 'recursión · caso base · tipo recursivo',
  mentor: 'hermes',
  hint: 'Toda función recursiva tiene 2 partes: caso base (cuándo parar) + caso recursivo (llamarse con subproblema). Si no hay subcajas → retorná solo las piezas propias. Si hay → sumá propias + reduce sobre cada subcaja.',
  starterCode: `// recursion.ts — Búsqueda recursiva en cajas anidadas
// 🎯 Objetivo:
//    1. Interface Caja con nombre: string, piezas: number, subcajas?: Caja[]
//    2. Función contarTotal(caja: Caja): number (recursiva)
//    3. Armar el depósito de prueba y llamar contarTotal
//    4. Imprimir: "Total piezas: [número]"
//
//    El depósito: Principal(10) → A(50) → A1(20)
//                              → B(30)
//    Total esperado: 110

// Tu código acá 👇
`,
  solution: `interface Caja {
  nombre: string
  piezas: number
  subcajas?: Caja[]
}

function contarTotal(caja: Caja): number {
  if (!caja.subcajas) return caja.piezas
  return caja.piezas + caja.subcajas.reduce((acc, sub) => acc + contarTotal(sub), 0)
}

const deposito: Caja = {
  nombre: 'Principal', piezas: 10,
  subcajas: [
    { nombre: 'A', piezas: 50, subcajas: [
      { nombre: 'A1', piezas: 20 }
    ]},
    { nombre: 'B', piezas: 30 }
  ]
}

console.log(\`Caja Principal: \${deposito.piezas} piezas directas\`)
console.log(\`Caja A: \${deposito.subcajas[0].piezas} piezas\`)
console.log(\`Caja B: \${deposito.subcajas[1].piezas} piezas\`)
console.log(\`Total piezas: \${contarTotal(deposito)}\`)`,
  validate: (output: string[]) =>
    output.some(l => l.includes('Total piezas: 110')),
  lesson: {
    explanation: 'Una función recursiva se llama a sí misma para resolver un problema dividiéndolo en subproblemas más pequeños. Siempre necesita un caso base (cuándo parar) y un caso recursivo (cómo dividir el problema). Es la herramienta natural para estructuras anidadas como árboles y directorios.',
    codeExample: `interface Caja {
  nombre: string
  piezas: number
  subcajas?: Caja[]  // tipo recursivo — Caja contiene Cajas
}

function contarTotal(caja: Caja): number {
  // Caso base: sin sub-cajas, retorná solo las propias
  if (!caja.subcajas) return caja.piezas

  // Caso recursivo: propias + suma de cada sub-caja
  return caja.piezas +
    caja.subcajas.reduce((acc, sub) => acc + contarTotal(sub), 0)
}

// Árbol: Principal(10) → A(50) → A1(20)
//                       → B(30)
// Total: 10 + 50 + 20 + 30 = 110`,
    tips: [
      'Siempre identificá el caso base primero — es lo que detiene la recursión',
      'Cada llamada recursiva debe acercarse al caso base (subproblema más pequeño)',
      'El call stack acumula llamadas — demasiada profundidad causa Stack Overflow',
    ],
  },
  stampsRequired: 5,
  mechanic: 'recursion-tree' as const,

  // Curriculum
  subtitle: 'recursion.ts — El robot busca piezas en estantes anidados dentro de estantes',
  module: 5,
  moduleName: 'Patrones Avanzados',
  metaphor: 'El depósito tiene cajas dentro de cajas: una caja contiene piezas sueltas y otras sub-cajas, que a su vez tienen más. El robot debe contar TODAS las piezas sin importar cuántos niveles de profundidad haya. No puede saber de antemano cuántos niveles hay.',
  concepts: 'Función recursiva que se llama a sí misma · Caso base que detiene la recursión · Call stack · Tipo recursivo: interface Nodo { valor: number; hijos?: Nodo[] } · Diferencia con loop iterativo',
  unlocks: ['Inventario profundo', 'Módulo Boss'],
};

export default level16;
