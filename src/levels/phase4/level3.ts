import { Level } from '../../engine/types';

const level10: Level = {
  id: 'p4-l3',
  phase: 4,
  title: 'Ficha de Producto',
  objective: 'Definí la interface Producto, creá un catálogo de 3 piezas (2 aprobadas), filtrá las aprobadas e imprimí el resultado.',
  concept: 'interface · objects · propiedades opcionales',
  mentor: 'apolo',
  hint: 'Una interface define la "forma" que debe tener un objeto — sus propiedades y tipos. La ? hace una propiedad opcional. filter() devuelve un nuevo array con los elementos que cumplen la condición. [0] accede al primero.',
  starterCode: `// catalogo.ts — Catálogo de productos de la fábrica
// 🎯 Objetivo: modelar el catálogo con una interface y filtrar los aprobados
//
//    1. Definí la interface Producto con estas propiedades:
//       id: number, nombre: string, peso: number (en gramos),
//       aprobado: boolean, proveedor?: string (opcional)
//
//    2. Creá un array catalogo: Producto[] con 3 productos:
//       - Uno con proveedor "MetalPro"
//       - 2 aprobados, 1 no aprobado
//
//    3. Filtrá los aprobados e imprimí:
//       "Aprobados: 2 / 3"
//       "Primer aprobado: [nombre]"

// Tu código acá 👇
`,
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
  codeHints: [
    'interface Producto {',
    '  id: number; nombre: string; peso: number',
    '  aprobado: boolean; proveedor?: string',
    '}',
    '',
    'const catalogo: Producto[] = [',
    '  { id: 1, nombre: "Perno M6",  peso: 5,   aprobado: true },',
    '  { id: 2, nombre: "Tuerca M6", peso: 3,   aprobado: false },',
    '  { id: 3, nombre: "Arandela",  peso: 1.5, aprobado: true, proveedor: "MetalPro" },',
    ']',
    '',
    'const aprobados = catalogo.filter(p => p.aprobado)',
    'console.log(`Aprobados: ${aprobados.length} / ${catalogo.length}`)',
    'console.log(`Primer aprobado: ${aprobados[0].nombre}`)',
  ],
  validate: (output: string[]) =>
    output.some((l) => l.includes('Aprobados: 2 / 3')) &&
    output.some((l) => l.includes('Primer aprobado:')),
  lesson: {
    explanation: 'Una interface define la "forma" de un objeto — qué propiedades tiene y de qué tipo es cada una. Es el contrato que TypeScript usa para verificar que tus objetos tienen exactamente lo que necesitan. En automatización definís interfaces para los datos de la API, para las opciones de tus helpers, y para los modelos de datos de tus tests.',
    codeExample: `interface Producto {
  nombre: string
  precio: number
  disponible: boolean
  proveedor?: string   // ← ? = propiedad opcional
}

// TypeScript verifica que el objeto cumpla la interface
const perno: Producto = {
  nombre: "Perno M6",
  precio: 0.5,
  disponible: true
  // proveedor es opcional — no hace falta
}

// Error si falta una propiedad obligatoria:
// const mal: Producto = { nombre: "X" }
// ❌ falta 'precio' y 'disponible'`,
    tips: [
      '? al final del nombre hace la propiedad opcional',
      'Las interfaces no generan código JS — solo existen para TypeScript',
      'Usá PascalCase para nombres de interfaces: Producto, RobotConfig, ApiResponse',
    ],
  },
  stampsRequired: 5,
  mechanic: 'cards' as const,
};

export default level10;
