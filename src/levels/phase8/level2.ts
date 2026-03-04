import { Level } from '../../engine/types';

const level21: Level = {
  id: 'p8-l2',
  phase: 8,
  title: 'El Catálogo Inmutable',
  objective: 'Creá un inventario tipado con Record<K,V>, protegelo con Readonly, y extraé tipos con keyof y ReturnType.',
  concept: 'Record<K,V> · Readonly<T> · keyof T · ReturnType<F>',
  mentor: 'athenix',
  hint: 'Record<string, number> es como { [key: string]: number }. Readonly<T> impide modificar las propiedades (error en compilación si intentás asignar). keyof Robot da una union: "nombre" | "modelo" | ... ReturnType<typeof fn> infiere el tipo de retorno de una función existente.',
  starterCode: `// immutable-catalog.ts — Catálogo de piezas inmutable
// 🎯 Objetivo:
//    1. type Inventario = Record<string, number>
//    2. catalogoFijo: Readonly<Inventario> con 4 entradas
//    3. función obtenerStock(nombre: string): number
//    4. type CampoPieza = keyof Pieza
//    5. type ResultadoStock = ReturnType<typeof obtenerStock>
//    6. Imprimir: "Stock pernos: 500"
//    7. Imprimir: "Tipo retorno: number"

interface Pieza {
  nombre: string
  codigo: string
  peso: number
  disponible: boolean
}

// Tu código acá 👇
`,
  solution: `interface Pieza {
  nombre: string
  codigo: string
  peso: number
  disponible: boolean
}

type Inventario = Record<string, number>
type CampoPieza = keyof Pieza

const catalogoFijo: Readonly<Inventario> = {
  pernos: 500,
  tuercas: 320,
  arandelas: 150,
  engranajes: 45,
}

function obtenerStock(nombre: string): number {
  return catalogoFijo[nombre] ?? 0
}

type ResultadoStock = ReturnType<typeof obtenerStock>

console.log(\`Stock pernos: \${obtenerStock('pernos')}\`)
console.log(\`Stock tornillos: \${obtenerStock('tornillos')}\`)

const campos: CampoPieza[] = ['nombre', 'codigo', 'peso', 'disponible']
console.log(\`Campos de Pieza: \${campos.join(', ')}\`)
console.log(\`Tipo retorno: number\`)
console.log(\`Total productos: \${Object.keys(catalogoFijo).length}\`)`,
  validate: (output: string[]) =>
    output.some(l => l.includes('Stock pernos: 500')) &&
    output.some(l => l.includes('Tipo retorno: number')),
  stampsRequired: 5,
  mechanic: 'catalog' as const,
  subtitle: 'immutable-catalog.ts — Inventarios tipados que no pueden modificarse accidentalmente',
  module: 8,
  moduleName: 'Utility Types',
  metaphor: 'El catálogo oficial de piezas de la fábrica no debería poder modificarse en runtime — cualquier cambio debe ir por el proceso de ingeniería. Readonly garantiza que nadie cambia los precios o stocks accidentalmente.',
  concepts: 'Record<K, V> · Readonly<T> · keyof T · ReturnType<typeof fn> · Diferencia entre const y Readonly',
  unlocks: ['Catálogo inmutable', 'Tipos derivados'],
};

export default level21;
