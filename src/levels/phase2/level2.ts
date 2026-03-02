import { Level } from '../../engine/types';

const level5: Level = {
  id: 'p2-l2',
  phase: 2,
  title: 'Control de Calidad',
  objective: 'Completar el sistema de inspección: si calidad >= 90 → APROBADO, entre 70 y 90 → RETRABAJAR, menor → DESCARTE',
  concept: 'if · else if · else',
  mentor: 'athenix',
  hint: 'Usá else if para múltiples condiciones en cadena. Operadores: >= (mayor o igual), < (menor). El ! delante de un boolean lo invierte: !activa significa "si NO está activa".',
  starterCode: `// qa.ts — Sistema de Control de Calidad
// Completá los operadores de comparación (???) para clasificar la pieza

let calidad: number = 78
let activa: boolean = true

if (!activa) {
  console.log("Línea detenida — saltando inspección")
} else if (calidad ??? 90) {
  console.log("✅ APROBADO → Sector Despacho")
} else if (calidad ??? 70) {
  console.log("⚠️ RETRABAJAR → Sector Reparación")
} else {
  console.log("❌ DESCARTE → Sector Residuos")
}`,
  solution: `let calidad: number = 78
let activa: boolean = true

if (!activa) {
  console.log("Línea detenida — saltando inspección")
} else if (calidad >= 90) {
  console.log("✅ APROBADO → Sector Despacho")
} else if (calidad >= 70) {
  console.log("⚠️ RETRABAJAR → Sector Reparación")
} else {
  console.log("❌ DESCARTE → Sector Residuos")
}`,
  validate: (output: string[]) =>
    output.some((line) => line.includes('RETRABAJAR')),
  stampsRequired: 3,
  mechanic: 'sorter' as const,
};

export default level5;
