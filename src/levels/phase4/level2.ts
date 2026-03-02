import { Level } from '../../engine/types';

const level9: Level = {
  id: 'p4-l2',
  phase: 4,
  title: 'Manual del Técnico',
  objective: 'Completar dos funciones: calcularEficiencia (devuelve porcentaje) y generarEtiqueta (devuelve string en mayúsculas)',
  concept: 'function · parámetros tipados · return',
  mentor: 'apolo',
  hint: 'Las funciones tipadas: function nombre(param: Tipo): TipoRetorno { return valor }. Para el porcentaje: (producidas / meta) * 100. Para mayúsculas: .toUpperCase(). El tipo de retorno va después de los parámetros con :.',
  starterCode: `// funciones.ts — Manual de procedimientos del robot

function calcularEficiencia(producidas: number, meta: number): number {
  // Calculá el porcentaje: (producidas / meta) * 100
  return ???
}

function generarEtiqueta(pieza: string, lote: number): string {
  // Armá el string: "[LOTE-42] PERNO M6" (nombre en mayúsculas)
  return \`[LOTE-\${lote}] \${pieza.???()}\`
}

const efic = calcularEficiencia(847, 1000)
const etiq = generarEtiqueta("perno m6", 42)
console.log(\`\${etiq} → Eficiencia: \${efic.toFixed(1)}%\`)`,
  solution: `function calcularEficiencia(producidas: number, meta: number): number {
  return (producidas / meta) * 100
}

function generarEtiqueta(pieza: string, lote: number): string {
  return \`[LOTE-\${lote}] \${pieza.toUpperCase()}\`
}

const efic = calcularEficiencia(847, 1000)
const etiq = generarEtiqueta("perno m6", 42)
console.log(\`\${etiq} → Eficiencia: \${efic.toFixed(1)}%\`)`,
  validate: (output: string[]) =>
    output.some((l) => l.includes('PERNO M6') && l.includes('84.7%')),
  stampsRequired: 4,
  mechanic: 'machine' as const,
};

export default level9;
