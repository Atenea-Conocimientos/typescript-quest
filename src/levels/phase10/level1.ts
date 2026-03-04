import { Level } from '../../engine/types';

const level25: Level = {
  id: 'p10-l1',
  phase: 10,
  title: 'El Protocolo de Fallas',
  objective: 'Creá una jerarquía de errores custom con clases que extienden Error, y manejá cada tipo con instanceof en el catch.',
  concept: 'custom Error classes · instanceof in catch · error hierarchy · typed errors',
  mentor: 'apolo',
  hint: 'class ErrorFabrica extends Error { constructor(msg: string) { super(msg); this.name = "ErrorFabrica" } }. En el catch, usá instanceof para distinguir tipos. Siempre establecé this.name para que el stack trace sea legible. En TypeScript el error en catch es unknown — debés hacer el check antes de usarlo.',
  starterCode: `// custom-errors.ts — Protocolo de manejo de fallas
// 🎯 Objetivo:
//    1. class ErrorFabrica extends Error (clase base)
//    2. class ErrorEnergia extends ErrorFabrica (con nivelActual: number)
//    3. class ErrorPieza extends ErrorFabrica (con codigoPieza: string)
//    4. función ensamblarConValidacion(energia: number, pieza: string): string
//       Lanza ErrorEnergia si energia < 20
//       Lanza ErrorPieza si pieza está vacía
//       Retorna "✅ [pieza] ensamblada" si ok
//    5. Probar 3 llamadas (ok, sin energía, sin pieza)
//    6. En catch: loguear tipo y mensaje de cada error
//    7. Imprimir: "Protocolo completado: 3 intentos"

// Tu código acá 👇
`,
  solution: `class ErrorFabrica extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ErrorFabrica'
  }
}

class ErrorEnergia extends ErrorFabrica {
  constructor(public nivelActual: number) {
    super(\`Energía insuficiente: \${nivelActual}% (mínimo 20%)\`)
    this.name = 'ErrorEnergia'
  }
}

class ErrorPieza extends ErrorFabrica {
  constructor(public codigoPieza: string) {
    super(\`Pieza inválida: "\${codigoPieza}"\`)
    this.name = 'ErrorPieza'
  }
}

function ensamblarConValidacion(energia: number, pieza: string): string {
  if (energia < 20) throw new ErrorEnergia(energia)
  if (!pieza.trim()) throw new ErrorPieza(pieza)
  return \`✅ \${pieza} ensamblada\`
}

const intentos: [number, string][] = [
  [80, 'Perno M6'],
  [10, 'Tuerca'],
  [90, ''],
]

let contador = 0
for (const [energia, pieza] of intentos) {
  contador++
  try {
    console.log(ensamblarConValidacion(energia, pieza))
  } catch (e) {
    if (e instanceof ErrorEnergia) {
      console.log(\`[ErrorEnergia] \${e.message} — nivel: \${e.nivelActual}%\`)
    } else if (e instanceof ErrorPieza) {
      console.log(\`[ErrorPieza] \${e.message}\`)
    } else if (e instanceof ErrorFabrica) {
      console.log(\`[ErrorFabrica] \${(e as ErrorFabrica).message}\`)
    }
  }
}
console.log(\`Protocolo completado: \${contador} intentos\`)`,
  validate: (output: string[]) =>
    output.some(l => l.includes('ensamblada')) &&
    output.some(l => l.includes('ErrorEnergia') || l.includes('insuficiente')) &&
    output.some(l => l.includes('Protocolo completado: 3 intentos')),
  stampsRequired: 5,
  mechanic: 'faultlog' as const,
  subtitle: 'custom-errors.ts — Errores tipados que el compilador puede distinguir y manejar',
  module: 10,
  moduleName: 'Error Handling Robusto',
  metaphor: 'La fábrica tiene protocolos específicos para cada tipo de falla. Las custom errors permiten capturar el tipo exacto de falla y reaccionar de forma precisa — no solo "algo salió mal".',
  concepts: 'class MiError extends Error · this.name · instanceof en catch · Error como unknown en TypeScript · Jerarquía de errores',
  unlocks: ['Protocolo de fallas', 'Errores tipados'],
};

export default level25;
