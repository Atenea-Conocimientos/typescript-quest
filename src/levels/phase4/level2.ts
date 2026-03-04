import { Level } from '../../engine/types';

const level9: Level = {
  id: 'p4-l2',
  phase: 4,
  title: 'Manual del Técnico',
  objective: 'Creá dos funciones tipadas: una que calcule eficiencia como porcentaje, y otra que genere una etiqueta de producto en mayúsculas.',
  concept: 'function · parámetros tipados · return',
  mentor: 'apolo',
  hint: 'Las funciones en TypeScript declaran el tipo de cada parámetro y el tipo de retorno: function nombre(x: number): string { }. La eficiencia es un porcentaje simple. .toUpperCase() convierte a mayúsculas. .toFixed(1) muestra un decimal.',
  starterCode: `// tecnico.ts — Funciones del robot técnico
// 🎯 Objetivo: crear dos funciones con tipos explícitos
//
//    1. calcularEficiencia(producidas: number, meta: number): number
//       → devuelve el porcentaje (ej: 847 de 1000 = 84.7)
//
//    2. generarEtiqueta(pieza: string, lote: number): string
//       → devuelve "[LOTE-42] PERNO M6"  (nombre en MAYÚSCULAS)
//
//    Llamalas así y mostrá el resultado en una sola línea:
//       calcularEficiencia(847, 1000)
//       generarEtiqueta("perno m6", 42)
//    Resultado esperado: "[LOTE-42] PERNO M6 → Eficiencia: 84.7%"

// Tu código acá 👇
`,
  solution: `function calcularEficiencia(producidas: number, meta: number): number {
  return (producidas / meta) * 100
}

function generarEtiqueta(pieza: string, lote: number): string {
  return \`[LOTE-\${lote}] \${pieza.toUpperCase()}\`
}

const efic = calcularEficiencia(847, 1000)
const etiq = generarEtiqueta("perno m6", 42)
console.log(\`\${etiq} → Eficiencia: \${efic.toFixed(1)}%\`)`,
  codeHints: [
    'function calcularEficiencia(producidas: number, meta: number): number {',
    '  return (producidas / meta) * 100',
    '}',
    '',
    'function generarEtiqueta(pieza: string, lote: number): string {',
    '  return `[LOTE-${lote}] ${pieza.toUpperCase()}`',
    '}',
    '',
    'const efic = calcularEficiencia(847, 1000)',
    'const etiq = generarEtiqueta("perno m6", 42)',
    'console.log(`${etiq} → Eficiencia: ${efic.toFixed(1)}%`)',
  ],
  validate: (output: string[]) =>
    output.some((l) => l.includes('PERNO M6') && l.includes('84.7%')),
  lesson: {
    explanation: 'Las funciones son bloques de código reutilizables. En TypeScript declarás el tipo de cada parámetro y el tipo de retorno — esto garantiza que la función siempre reciba lo correcto y siempre devuelva lo esperado. En automatización, cada helper, Page Object method y utilidad es una función.',
    codeExample: `// Función clásica con tipos
function calcular(piezas: number, horas: number): number {
  return piezas / horas
}
console.log(calcular(100, 8))  // 12.5

// Arrow function (sintaxis moderna, muy usada)
const saludar = (nombre: string): string =>
  \`Hola, \${nombre}!\`

// Parámetro con valor por defecto
function ensamblar(pieza: string, cantidad: number = 1): string {
  return \`\${cantidad}x \${pieza}\`
}
console.log(ensamblar("perno"))     // "1x perno"
console.log(ensamblar("tuerca", 5)) // "5x tuerca"`,
    tips: [
      'Tipá siempre los parámetros: (nombre: string, cant: number)',
      'El tipo de retorno va después del paréntesis de cierre: ): number',
      'Parámetro opcional con default: (cant: number = 1)',
    ],
  },
  stampsRequired: 4,
  mechanic: 'machine' as const,
};

export default level9;
