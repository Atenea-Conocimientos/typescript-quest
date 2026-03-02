import { Level } from '../../engine/types';

const level12: Level = {
  id: 'p4-l5',
  phase: 4,
  title: 'Códigos de Estado',
  objective: 'Llamar a procesarEstado con 3 estados distintos: uno ACTIVA, uno ERROR, y uno de los restantes',
  concept: 'enum · string enum · switch/case',
  mentor: 'artemisa',
  hint: 'Los enums son conjuntos de valores con nombre. Accedés a sus valores con EstadoLinea.ACTIVA, EstadoLinea.ERROR, etc. El switch evalúa cada case y ejecuta el bloque que coincide. default cubre los casos restantes.',
  starterCode: `// estados.ts — Panel de control de líneas de producción

enum EstadoLinea {
  ACTIVA        = "ACTIVA",
  PAUSA         = "PAUSA",
  MANTENIMIENTO = "MANTENIMIENTO",
  ERROR         = "ERROR",
  APAGADA       = "APAGADA",
}

function procesarEstado(e: EstadoLinea): void {
  switch (e) {
    case EstadoLinea.ACTIVA:
      return console.log("✅ Línea produciendo")
    case EstadoLinea.ERROR:
      return console.log("🚨 Llamar al técnico")
    default:
      console.log(\`Estado: \${e}\`)
  }
}

// Llamá la función con 3 estados distintos (reemplazá ???):
procesarEstado(EstadoLinea.???)
procesarEstado(EstadoLinea.???)
procesarEstado(EstadoLinea.???)`,
  solution: `enum EstadoLinea {
  ACTIVA        = "ACTIVA",
  PAUSA         = "PAUSA",
  MANTENIMIENTO = "MANTENIMIENTO",
  ERROR         = "ERROR",
  APAGADA       = "APAGADA",
}

function procesarEstado(e: EstadoLinea): void {
  switch (e) {
    case EstadoLinea.ACTIVA:
      return console.log("✅ Línea produciendo")
    case EstadoLinea.ERROR:
      return console.log("🚨 Llamar al técnico")
    default:
      console.log(\`Estado: \${e}\`)
  }
}

procesarEstado(EstadoLinea.ACTIVA)
procesarEstado(EstadoLinea.ERROR)
procesarEstado(EstadoLinea.PAUSA)`,
  validate: (output: string[]) =>
    output.some((l) => l.includes('produciendo')) &&
    output.some((l) => l.includes('técnico')) &&
    output.some((l) => l.includes('Estado:')),
  stampsRequired: 4,
};

export default level12;
