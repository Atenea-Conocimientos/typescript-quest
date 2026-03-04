import { Level } from '../../engine/types';

const level20: Level = {
  id: 'p8-l1',
  phase: 8,
  title: 'El Inspector de Partes',
  objective: 'Usá Pick, Omit y Partial para crear versiones reducidas y opcionales de una interface.',
  concept: 'Pick<T,K> · Omit<T,K> · Partial<T> · Required<T>',
  mentor: 'athenix',
  hint: 'Pick<Robot, "nombre"|"modelo"> selecciona solo esas propiedades. Omit<Robot, "codigoInterno"> las elimina. Partial<T> hace todas opcionales (?). Son alias de tipo — no cambian los valores, solo la vista del tipo.',
  starterCode: `// utility-types.ts — Inspector de partes del robot
// 🎯 Objetivo:
//    1. type RobotPublico = Pick<Robot, "nombre" | "modelo">
//    2. type RobotSinCodigo = Omit<Robot, "codigoInterno">
//    3. type RobotBorrador = Partial<Robot>
//    4. Crear instancias de cada tipo
//    5. Imprimir: "Campos publicos: 2"
//    6. Imprimir: "Borrador valido: true"

interface Robot {
  nombre: string
  modelo: string
  energia: number
  piezas: number
  codigoInterno: string
}

const robotBase: Robot = {
  nombre: 'Olympus-1',
  modelo: 'MK-IV',
  energia: 100,
  piezas: 0,
  codigoInterno: 'OLY-2026-001',
}

// Tu código acá 👇
`,
  solution: `interface Robot {
  nombre: string
  modelo: string
  energia: number
  piezas: number
  codigoInterno: string
}

const robotBase: Robot = {
  nombre: 'Olympus-1',
  modelo: 'MK-IV',
  energia: 100,
  piezas: 0,
  codigoInterno: 'OLY-2026-001',
}

type RobotPublico = Pick<Robot, 'nombre' | 'modelo'>
type RobotSinCodigo = Omit<Robot, 'codigoInterno'>
type RobotBorrador = Partial<Robot>

const publico: RobotPublico = { nombre: robotBase.nombre, modelo: robotBase.modelo }
const sinCodigo: RobotSinCodigo = {
  nombre: robotBase.nombre,
  modelo: robotBase.modelo,
  energia: robotBase.energia,
  piezas: robotBase.piezas,
}
const borrador: RobotBorrador = { nombre: 'Prototipo' }

const camposPublicos = Object.keys(publico).length
console.log(\`Campos publicos: \${camposPublicos}\`)
console.log(\`Robot sin codigo: \${sinCodigo.nombre} (\${sinCodigo.modelo})\`)
console.log(\`Borrador valido: \${borrador.nombre !== undefined}\`)
console.log(JSON.stringify(publico))`,
  codeHints: [
    'type RobotPublico = Pick<Robot, "nombre" | "modelo">',
    'type RobotSinCodigo = Omit<Robot, "codigoInterno">',
    'type RobotBorrador = Partial<Robot>',
    '',
    'const publico: RobotPublico = { nombre: robotBase.nombre, modelo: robotBase.modelo }',
    'const sinCodigo: RobotSinCodigo = {',
    '  nombre: robotBase.nombre, modelo: robotBase.modelo,',
    '  energia: robotBase.energia, piezas: robotBase.piezas',
    '}',
    'const borrador: RobotBorrador = { nombre: "Olympus-Draft" }',
    '',
    'console.log(`Campos publicos: ${Object.keys(publico).length}`)',
    'console.log(`Borrador valido: ${borrador.nombre !== undefined}`)',
  ],
  validate: (output: string[]) =>
    output.some(l => l.includes('Campos publicos: 2')) &&
    output.some(l => l.includes('Borrador valido: true')),
  lesson: {
    explanation: 'Pick, Omit y Partial son utility types — tipos predefinidos por TypeScript que transforman otras interfaces. Pick selecciona solo ciertas propiedades, Omit las elimina, Partial las hace todas opcionales. Evitan duplicar interfaces y mantienen el código sincronizado automáticamente.',
    codeExample: `interface Robot {
  nombre: string
  modelo: string
  energia: number
  codigoInterno: string
}

// Pick: solo las propiedades que necesitás
type RobotPublico = Pick<Robot, "nombre" | "modelo">
// → { nombre: string; modelo: string }

// Omit: todo excepto lo que excluís
type RobotSinCodigo = Omit<Robot, "codigoInterno">
// → { nombre, modelo, energia }

// Partial: todas las propiedades opcionales
type RobotBorrador = Partial<Robot>
// → { nombre?: string; modelo?: string; ... }

const borrador: RobotBorrador = { nombre: "Prototipo" }  // ✅`,
    tips: [
      'Pick y Omit son opuestos — elegí el que require menos teclear',
      'Partial es muy útil para objetos de configuración y updates parciales',
      'Estos tipos se actualizan automáticamente si cambiás la interface original',
    ],
  },
  stampsRequired: 5,
  mechanic: 'inspector' as const,
  subtitle: 'utility-types.ts — Recortá y adaptá interfaces existentes sin duplicar código',
  module: 8,
  moduleName: 'Utility Types',
  metaphor: 'El inspector de calidad no necesita ver TODOS los datos del robot para hacer su trabajo — solo el nombre y modelo. Pick, Omit y Partial permiten crear "vistas" de una interface sin duplicar código ni perder type safety.',
  concepts: 'Pick<T, K> · Omit<T, K> · Partial<T> · Required<T> · type aliases · keyof · Por qué no duplicar interfaces',
  unlocks: ['Inspector de partes', 'Tipado flexible'],
};

export default level20;
