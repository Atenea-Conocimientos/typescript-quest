import { Level } from '../../engine/types';

const level13: Level = {
  id: 'p5-l1',
  phase: 5,
  title: 'Transformador de Lotes',
  objective: 'Usá filter y reduce para extraer los productos aprobados con peso > 3g y calcular su peso total. Resultado esperado: 2 productos, 9g.',
  concept: 'map · filter · reduce · arrow functions',
  mentor: 'artemisa',
  hint: 'filter recibe una arrow function que devuelve true/false: array.filter(p => condición). reduce acumula un valor: array.reduce((acc, p) => acc + p.peso, 0). Podés encadenarlos directamente.',
  starterCode: `// pipeline.ts — Pipeline de procesamiento de materiales
// 🎯 Objetivo: filter + reduce sobre el lote de productos
//
//    1. Filtrá: solo aprobados con peso > 3
//    2. Sumá el peso total de los filtrados con reduce
//    3. Imprimí: "Productos filtrados: 2"
//               "Peso total del lote: 9g"
//    Bonus: encontrá el primero sin proveedor e imprimí:
//               "Sin proveedor: [nombre]"

interface Producto {
  nombre: string
  peso: number
  aprobado: boolean
  proveedor?: string
}

const lote: Producto[] = [
  { nombre: "Perno M6",  peso: 5,   aprobado: true },
  { nombre: "Tuerca M6", peso: 3,   aprobado: false },
  { nombre: "Arandela",  peso: 1.5, aprobado: true, proveedor: "MetalPro" },
  { nombre: "Tornillo",  peso: 4,   aprobado: true },
  { nombre: "Remache",   peso: 2,   aprobado: false },
]

// Tu código acá 👇
`,
  solution: `interface Producto {
  nombre: string
  peso: number
  aprobado: boolean
  proveedor?: string
}

const lote: Producto[] = [
  { nombre: "Perno M6",  peso: 5,   aprobado: true },
  { nombre: "Tuerca M6", peso: 3,   aprobado: false },
  { nombre: "Arandela",  peso: 1.5, aprobado: true, proveedor: "MetalPro" },
  { nombre: "Tornillo",  peso: 4,   aprobado: true },
  { nombre: "Remache",   peso: 2,   aprobado: false },
]

const filtrados = lote.filter(p => p.aprobado && p.peso > 3)
const pesoTotal = filtrados.reduce((acc, p) => acc + p.peso, 0)

console.log(\`Productos filtrados: \${filtrados.length}\`)
console.log(\`Peso total del lote: \${pesoTotal}g\`)

const sinProv = lote.find(p => !p.proveedor)
console.log(\`Sin proveedor: \${sinProv?.nombre ?? "ninguno"}\`)`,
  codeHints: [
    'const filtrados = lote.filter(p => p.aprobado && p.peso > 3)',
    'const pesoTotal = filtrados.reduce((acc, p) => acc + p.peso, 0)',
    '',
    'console.log(`Productos filtrados: ${filtrados.length}`)',
    'console.log(`Peso total del lote: ${pesoTotal}g`)',
    '',
    'const sinProv = lote.find(p => !p.proveedor)',
    'console.log(`Sin proveedor: ${sinProv?.nombre ?? "ninguno"}`)',
  ],
  validate: (output: string[]) =>
    output.some((l) => l.includes('Productos filtrados: 2')) &&
    output.some((l) => l.includes('Peso total del lote: 9g')),
  lesson: {
    explanation: 'filter, map y reduce son los tres métodos funcionales más importantes de los arrays. filter selecciona elementos que cumplen una condición, map transforma cada elemento, reduce acumula todos en un único valor. En automatización los usás para procesar respuestas de APIs, filtrar logs y calcular métricas de tus suites.',
    codeExample: `const productos = [
  { nombre: "Perno",  precio: 0.5, activo: true  },
  { nombre: "Rueda",  precio: 12,  activo: false },
  { nombre: "Motor",  precio: 85,  activo: true  },
]

// filter: solo los activos
const activos = productos.filter(p => p.activo)
// → [{Perno...}, {Motor...}]

// map: extraer solo los nombres
const nombres = productos.map(p => p.nombre)
// → ["Perno", "Rueda", "Motor"]

// reduce: sumar todos los precios
const total = productos.reduce((acc, p) => acc + p.precio, 0)
// → 97.5

// Encadenado: suma solo de activos
const totalActivos = productos
  .filter(p => p.activo)
  .reduce((acc, p) => acc + p.precio, 0)  // 85.5`,
    tips: [
      'filter y map siempre retornan un nuevo array — no modifican el original',
      'map retorna siempre la misma cantidad de elementos que el array original',
      'reduce puede retornar cualquier tipo: number, string, objeto, array',
    ],
  },
  stampsRequired: 5,
  mechanic: 'pipeline' as const,
};

export default level13;
