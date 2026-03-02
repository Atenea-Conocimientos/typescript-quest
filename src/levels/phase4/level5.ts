import { Level } from '../../engine/types';

const level12: Level = {
  id: 'p4-l5',
  phase: 4,
  title: 'Códigos de Estado',
  objective: 'Creá el enum EstadoLinea con 5 valores y una función switch que imprima el mensaje correcto para cada estado. Llamala con 3 estados distintos.',
  concept: 'enum · string enum · switch/case',
  mentor: 'artemisa',
  hint: 'Un enum es un conjunto de constantes con nombres legibles: enum Color { ROJO = "ROJO" }. switch evalúa cada case y ejecuta el bloque que coincide — más limpio que varios if/else. default cubre los casos no listados explícitamente.',
  starterCode: `// panel.ts — Panel de control de líneas de producción
// 🎯 Objetivo: crear un enum de estados y una función switch
//
//    1. Creá el enum EstadoLinea con estos valores (string enum):
//       ACTIVA, PAUSA, MANTENIMIENTO, ERROR, APAGADA
//
//    2. Creá procesarEstado(estado: EstadoLinea): void con switch:
//       - ACTIVA → imprimir "✅ Línea produciendo"
//       - ERROR  → imprimir "🚨 Llamar al técnico"
//       - default → imprimir "Estado: [valor]"
//
//    3. Llamala con 3 estados distintos
//       (uno ACTIVA, uno ERROR, uno más)

// Tu código acá 👇
`,
  solution: `enum EstadoLinea {
  ACTIVA        = "ACTIVA",
  PAUSA         = "PAUSA",
  MANTENIMIENTO = "MANTENIMIENTO",
  ERROR         = "ERROR",
  APAGADA       = "APAGADA",
}

function procesarEstado(estado: EstadoLinea): void {
  switch (estado) {
    case EstadoLinea.ACTIVA:
      return console.log("✅ Línea produciendo")
    case EstadoLinea.ERROR:
      return console.log("🚨 Llamar al técnico")
    default:
      console.log(\`Estado: \${estado}\`)
  }
}

procesarEstado(EstadoLinea.ACTIVA)
procesarEstado(EstadoLinea.ERROR)
procesarEstado(EstadoLinea.PAUSA)`,
  codeHints: [
    'enum EstadoLinea {',
    '  ACTIVA = "ACTIVA", PAUSA = "PAUSA",',
    '  MANTENIMIENTO = "MANTENIMIENTO",',
    '  ERROR = "ERROR", APAGADA = "APAGADA",',
    '}',
    '',
    'function procesarEstado(estado: EstadoLinea): void {',
    '  switch (estado) {',
    '    case EstadoLinea.ACTIVA:',
    '      return console.log("✅ Línea produciendo")',
    '    case EstadoLinea.ERROR:',
    '      return console.log("🚨 Llamar al técnico")',
    '    default:',
    '      console.log(`Estado: ${estado}`)',
    '  }',
    '}',
    '',
    'procesarEstado(EstadoLinea.ACTIVA)',
    'procesarEstado(EstadoLinea.ERROR)',
    'procesarEstado(EstadoLinea.PAUSA)',
  ],
  validate: (output: string[]) =>
    output.some((l) => l.includes('produciendo')) &&
    output.some((l) => l.includes('cnico') || l.includes('técnico')) &&
    output.some((l) => l.includes('Estado:')),
  stampsRequired: 4,
  mechanic: 'panel' as const,
};

export default level12;
