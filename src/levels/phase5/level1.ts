import { Level } from '../../engine/types';

const level13: Level = {
  id: 'p5-l1',
  phase: 5,
  title: 'Transformador de Lotes',
  objective: 'Completar el pipeline: filter (aprobados con peso > 3) + reduce (suma de pesos). Resultado esperado: 2 productos, 9g total',
  concept: 'map · filter · reduce · arrow functions',
  mentor: 'artemisa',
  hint: 'filter recibe una función que devuelve true/false por elemento. reduce acumula: (acc, p) => acc + p.peso, empieza en 0. Podés encadenarlos: array.filter(...).reduce(...). Las arrow functions son: (param) => expresión.',
  starterCode: `// lotes.ts — Pipeline de procesamiento de materiales

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

// 1. Filtrá: aprobados con peso > 3 (completá la condición):
const filtrados = lote.filter(p => ???)

// 2. Sumá el peso total de los filtrados (completá el reduce):
const pesoTotal = filtrados.reduce((acc, p) => ???, 0)

console.log(\`Productos filtrados: \${filtrados.length}\`)
console.log(\`Peso total del lote: \${pesoTotal}g\`)

// Bonus: encontrá el primero sin proveedor
const sinProv = lote.find(p => !p.proveedor)
console.log(\`Sin proveedor: \${sinProv?.nombre ?? "ninguno"}\`)`,
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
  validate: (output: string[]) =>
    output.some((l) => l.includes('Productos filtrados: 2')) &&
    output.some((l) => l.includes('Peso total del lote: 9g')),
  stampsRequired: 5,
};

export default level13;
