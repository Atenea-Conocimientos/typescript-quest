import { Level } from '../../engine/types';

const level24: Level = {
  id: 'p9-l2',
  phase: 9,
  title: 'El Clasificador Definitivo',
  objective: 'Usá discriminated unions y never para crear un switch exhaustivo que TypeScript verifique en compilación.',
  concept: 'discriminated unions · switch exhaustivo · never · literal types',
  mentor: 'hermes',
  hint: 'Una discriminated union tiene una propiedad "tag" con literal type: { tipo: "metal" } | { tipo: "electronica" }. En el switch de esa propiedad TypeScript va reduciendo los tipos. Si llegás al default y asignás a never, TypeScript da error si olvidaste un caso.',
  starterCode: `// discriminated-unions.ts — Clasificador exhaustivo de eventos
// 🎯 Objetivo:
//    1. type EventoFabrica con 3 variantes:
//       | { tipo: "produccion"; cantidad: number; linea: string }
//       | { tipo: "falla"; codigo: string; critica: boolean }
//       | { tipo: "mantenimiento"; duracionMin: number }
//    2. función procesarEvento(e: EventoFabrica): string
//       switch exhaustivo con never en default
//    3. Procesar array de 4 eventos mixtos
//    4. Imprimir: "Eventos procesados: 4"
//    5. Imprimir: "Fallas criticas: 1"

// Tu código acá 👇
`,
  solution: `type EventoFabrica =
  | { tipo: 'produccion'; cantidad: number; linea: string }
  | { tipo: 'falla'; codigo: string; critica: boolean }
  | { tipo: 'mantenimiento'; duracionMin: number }

function procesarEvento(e: EventoFabrica): string {
  switch (e.tipo) {
    case 'produccion':
      return \`✅ Producción: \${e.cantidad} piezas en línea \${e.linea}\`
    case 'falla':
      return \`⚠️ Falla [\${e.codigo}]\${e.critica ? ' — CRÍTICA' : ''}\`
    case 'mantenimiento':
      return \`🔧 Mantenimiento: \${e.duracionMin} minutos\`
    default:
      const _exhaustive: never = e
      return _exhaustive
  }
}

const eventos: EventoFabrica[] = [
  { tipo: 'produccion', cantidad: 150, linea: 'A' },
  { tipo: 'falla', codigo: 'ERR-042', critica: true },
  { tipo: 'mantenimiento', duracionMin: 30 },
  { tipo: 'falla', codigo: 'WARN-007', critica: false },
]

eventos.forEach(e => console.log(procesarEvento(e)))

const fallasCriticas = eventos.filter(e => e.tipo === 'falla' && e.critica).length
console.log(\`Eventos procesados: \${eventos.length}\`)
console.log(\`Fallas criticas: \${fallasCriticas}\`)`,
  validate: (output: string[]) =>
    output.some(l => l.includes('Eventos procesados: 4')) &&
    output.some(l => l.includes('Fallas criticas: 1')),
  lesson: {
    explanation: 'Las discriminated unions son union types donde cada variante tiene una propiedad "tag" con un valor literal único. TypeScript usa esa propiedad para reducir el tipo en cada case del switch. El tipo never en el default actúa como "exhaustiveness check" — si olvidás un case, el compilador te avisa.',
    codeExample: `type Evento =
  | { tipo: "produccion"; cantidad: number }
  | { tipo: "falla";      codigo: string   }
  | { tipo: "pausa";      motivo: string   }

function procesar(e: Evento): string {
  switch (e.tipo) {
    case "produccion": return \`\${e.cantidad} piezas\`  // e: {tipo:"produccion", cantidad}
    case "falla":      return \`Error: \${e.codigo}\`   // e: {tipo:"falla", codigo}
    case "pausa":      return \`Pausa: \${e.motivo}\`   // e: {tipo:"pausa", motivo}
    default:
      const _check: never = e  // ← si falta un case, TypeScript da error acá
      return _check
  }
}
// Si agregás un 4to tipo a Evento pero olvidás el case,
// el compilador grita antes de que llegue a producción`,
    tips: [
      'La propiedad discriminante debe tener un literal type único por variante',
      'El default: never garantiza que manejes todos los casos — exhaustiveness check',
      'Muy útil para eventos de Redux, mensajes de WebSocket, estados de una UI',
    ],
  },
  stampsRequired: 5,
  mechanic: 'switcher' as const,
  subtitle: 'discriminated-unions.ts — TypeScript te avisa en compilación si olvidás manejar un caso',
  module: 9,
  moduleName: 'Type Guards & Narrowing',
  metaphor: 'El tablero de control tiene un handler para cada tipo de evento. Si alguien agrega un nuevo tipo y olvida actualizar el switch, el sistema lo detecta en compilación — antes de que el robot quede sin instrucciones.',
  concepts: 'Discriminated unions · Propiedad discriminante literal · switch exhaustivo · never type · Exhaustiveness checking',
  unlocks: ['Clasificador definitivo', 'Switch exhaustivo'],
};

export default level24;
