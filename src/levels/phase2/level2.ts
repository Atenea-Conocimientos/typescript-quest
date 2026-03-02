import { Level } from '../../engine/types';

const level5: Level = {
  id: 'p2-l2',
  phase: 2,
  title: 'Control de Calidad',
  objective: 'Escribí el sistema de inspección completo: las cajas con calidad ≥ 90 van a Despacho, entre 70 y 89 a Reparación, el resto a Residuos. Usá if / else if / else.',
  concept: 'if · else if · else',
  mentor: 'athenix',
  hint: 'Pensá en un inspector que revisa cada caja: primero pregunta "¿es perfecta?" (≥ 90), si no "¿es aceptable?" (≥ 70), y si no pasa ninguna, va a residuos. El código sigue exactamente ese orden.',
  starterCode: `// clasificador.ts — Sistema de Control de Calidad
// 🎯 Objetivo: clasificar la caja según su calidad e imprimir el destino
//    calidad >= 90  → "✅ APROBADO → Sector Despacho"
//    calidad >= 70  → "⚠️ RETRABAJAR → Sector Reparación"
//    de lo contrario → "❌ DESCARTE → Sector Residuos"

let calidad: number = 78

// Tu código acá 👇
`,
  solution: `let calidad: number = 78
if (calidad >= 90) {
  console.log("✅ APROBADO → Sector Despacho")
} else if (calidad >= 70) {
  console.log("⚠️ RETRABAJAR → Sector Reparación")
} else {
  console.log("❌ DESCARTE → Sector Residuos")
}`,
  codeHints: [
    'if (calidad >= 90) {',
    '  console.log("✅ APROBADO → Sector Despacho")',
    '} else if (calidad >= 70) {',
    '  console.log("⚠️ RETRABAJAR → Sector Reparación")',
    '} else {',
    '  console.log("❌ DESCARTE → Sector Residuos")',
    '}',
  ],
  validate: (output: string[]) =>
    output.some((line) => line.includes('RETRABAJAR')),
  stampsRequired: 3,
  mechanic: 'sorter' as const,
};

export default level5;
