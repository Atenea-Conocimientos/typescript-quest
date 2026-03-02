import { Level } from '../../engine/types';

const level10: Level = {
  id: 'p4-l3',
  phase: 4,
  title: 'Ficha de Producto',
  objective: 'Completar las 3 fichas de producto con valores correctos y obtener "Aprobados: 2 / 3"',
  concept: 'interface · objects · propiedades opcionales',
  mentor: 'apolo',
  hint: 'Una interface define la "forma" de un objeto: las propiedades que debe tener y sus tipos. Las propiedades con ? son opcionales. Completá aprobado: true/false y proveedor solo donde corresponde.',
  starterCode: `// productos.ts — Catálogo de piezas de la fábrica

interface Producto {
  id: number
  nombre: string
  peso: number       // en gramos
  aprobado: boolean
  proveedor?: string // opcional
}

const catalogo: Producto[] = [
  { id: 1, nombre: "Perno M6",   peso: 5,   aprobado: ??? },
  { id: 2, nombre: "Tuerca M6",  peso: 3,   aprobado: ??? },
  { id: 3, nombre: "Arandela",   peso: 1.5, aprobado: ???, proveedor: "MetalPro" },
]

const aprobados = catalogo.filter(p => p.aprobado)
console.log(\`Aprobados: \${aprobados.length} / \${catalogo.length}\`)
console.log(\`Primer aprobado: \${aprobados[0].nombre}\`)`,
  solution: `interface Producto {
  id: number
  nombre: string
  peso: number
  aprobado: boolean
  proveedor?: string
}

const catalogo: Producto[] = [
  { id: 1, nombre: "Perno M6",  peso: 5,   aprobado: true },
  { id: 2, nombre: "Tuerca M6", peso: 3,   aprobado: false },
  { id: 3, nombre: "Arandela",  peso: 1.5, aprobado: true, proveedor: "MetalPro" },
]

const aprobados = catalogo.filter(p => p.aprobado)
console.log(\`Aprobados: \${aprobados.length} / \${catalogo.length}\`)
console.log(\`Primer aprobado: \${aprobados[0].nombre}\`)`,
  validate: (output: string[]) =>
    output.some((l) => l.includes('Aprobados: 2 / 3')) &&
    output.some((l) => l.includes('Perno M6')),
  stampsRequired: 5,
};

export default level10;
