import { Level } from '../../engine/types';

const level26: Level = {
  id: 'p10-l2',
  phase: 10,
  title: 'El Reporte de Calidad',
  objective: 'Implementá el patrón Result<T, E> con discriminated unions para manejar errores sin try/catch.',
  concept: 'Result<T,E> pattern · discriminated union · ok/err · functional error handling',
  mentor: 'apolo',
  hint: 'Result<T, E> = { ok: true; value: T } | { ok: false; error: E }. En vez de lanzar excepciones, retornás el resultado envuelto. Creá helpers: ok<T>(value: T) y err<E>(error: E). Con if (resultado.ok) TypeScript sabe exactamente qué hay en cada rama.',
  starterCode: `// result-pattern.ts — Control de calidad con Result<T,E>
// 🎯 Objetivo:
//    1. type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }
//    2. helpers: ok<T>(value: T) y err<E>(error: E)
//    3. interface InformeCalidad { pieza: string; peso: number; aprobada: boolean }
//    4. función validarPieza(nombre: string, peso: number): Result<InformeCalidad, string>
//       err si nombre vacío, si peso <= 0, o si peso > 100
//       ok con InformeCalidad si todo está bien
//    5. Procesar 4 piezas con diferentes resultados
//    6. Imprimir: "✅ [pieza] ([peso]kg)" o "❌ [error]"
//    7. Imprimir: "Aprobadas: 1 / Rechazadas: 3"

// Tu código acá 👇
`,
  solution: `type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }

function ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}
function err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}

interface InformeCalidad {
  pieza: string
  peso: number
  aprobada: boolean
}

function validarPieza(nombre: string, peso: number): Result<InformeCalidad, string> {
  if (!nombre.trim()) return err('Nombre requerido')
  if (peso <= 0) return err(\`Peso inválido: \${peso}\`)
  if (peso > 100) return err(\`Pieza demasiado pesada: \${peso}kg\`)
  return ok({ pieza: nombre, peso, aprobada: true })
}

const pruebas: [string, number][] = [
  ['Perno M6', 5],
  ['', 10],
  ['Engranaje', -1],
  ['Bloque Motor', 150],
]

let aprobadas = 0
let rechazadas = 0

for (const [nombre, peso] of pruebas) {
  const resultado = validarPieza(nombre, peso)
  if (resultado.ok) {
    console.log(\`✅ \${resultado.value.pieza} (\${resultado.value.peso}kg)\`)
    aprobadas++
  } else {
    console.log(\`❌ \${resultado.error}\`)
    rechazadas++
  }
}

console.log(\`Aprobadas: \${aprobadas} / Rechazadas: \${rechazadas}\`)`,
  validate: (output: string[]) =>
    output.some(l => l.includes('✅')) &&
    output.some(l => l.includes('❌')) &&
    output.some(l => l.includes('Aprobadas:') && l.includes('Rechazadas:')),
  lesson: {
    explanation: 'El patrón Result<T, E> representa el resultado de una operación que puede fallar, sin usar excepciones. Es una discriminated union con dos variantes: { ok: true; value: T } o { ok: false; error: E }. El código que llama decide qué hacer con el resultado — los errores son valores, no excepciones.',
    codeExample: `type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }

// Helpers para construir resultados
function ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}
function err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}

// Función que retorna Result en vez de lanzar excepciones
function dividir(a: number, b: number): Result<number, string> {
  if (b === 0) return err("División por cero")
  return ok(a / b)
}

// Usar el resultado de forma segura:
const resultado = dividir(10, 2)
if (resultado.ok) {
  console.log(resultado.value)  // ✅ TypeScript sabe: number
} else {
  console.log(resultado.error)  // ✅ TypeScript sabe: string
}`,
    tips: [
      'Result hace los errores explícitos — el caller no puede ignorarlos accidentalmente',
      'Podés encadenar Results con funciones que reciben un valor y retornan otro Result',
      'Muy usado en Rust y ahora en TypeScript para código sin excepciones inesperadas',
    ],
  },
  stampsRequired: 5,
  mechanic: 'result-board' as const,
  subtitle: 'result-pattern.ts — Errores como valores: sin excepciones, con type safety total',
  module: 10,
  moduleName: 'Error Handling Robusto',
  metaphor: 'El reporte de calidad no "explota" cuando encuentra una pieza defectuosa — la registra como rechazada y sigue. El patrón Result hace lo mismo: los errores son valores que fluyen por el sistema, no excepciones que interrumpen todo.',
  concepts: 'Result<T, E> pattern · ok() y err() helpers · Functional error handling · Discriminated union como return type · Por qué Result sobre try/catch en algunos contextos',
  unlocks: ['Control de calidad', 'Error handling funcional'],
};

export default level26;
