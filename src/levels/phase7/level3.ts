import { Level } from '../../engine/types';

const level19: Level = {
  id: 'p7-l3',
  phase: 7,
  title: 'Fábrica Multi-Robot',
  objective: 'Usá Promise.all para lanzar 4 tareas async en paralelo y esperar a que todas terminen.',
  concept: 'Promise · async/await · Promise.all · try/catch',
  mentor: 'athenix',
  hint: 'async function siempre retorna Promise<T>. await pausa esa función (no todo el programa). Promise.all([p1, p2, p3]) espera TODAS en paralelo. Al final escribí "await turnoFinal()" (top-level await) para que el runner espere los resultados. Siempre rodeá con try/catch.',
  starterCode: `// async.ts — Fábrica multi-robot con Promise.all
// 🎯 Objetivo:
//    1. async function procesarTarea(nombre: string, ms: number): Promise<string>
//       Espera ms milisegundos y retorna: "✅ [nombre] completado"
//    2. async function turnoFinal(): Promise<void>
//       Lanzá 4 tareas en paralelo con Promise.all()
//    3. Imprimí cada resultado y al final: "🎉 Turno cerrado."
//    💡 Usá ms pequeños (50–150) para no bloquear el runner
//    💡 Usá "await turnoFinal()" para esperar la Promise en el nivel raíz

// Tu código acá 👇
`,
  solution: `async function procesarTarea(nombre: string, ms: number): Promise<string> {
  await new Promise(r => setTimeout(r, ms))
  return \`✅ \${nombre} completado\`
}

async function turnoFinal(): Promise<void> {
  console.log('🏭 Iniciando turno multi-robot...')
  try {
    const resultados = await Promise.all([
      procesarTarea('Ensamblado', 50),
      procesarTarea('Pintado', 80),
      procesarTarea('Control QA', 30),
      procesarTarea('Despacho', 100),
    ])
    resultados.forEach(r => console.log(r))
    console.log('🎉 Turno cerrado.')
  } catch (error) {
    console.error('Robot falló:', error)
  }
}

await turnoFinal()`,
  validate: (output: string[]) =>
    output.some(l => l.includes('Turno cerrado')) &&
    output.filter(l => l.includes('completado')).length >= 4,
  lesson: {
    explanation: 'async/await es la forma moderna de manejar operaciones asincrónicas. Una función async siempre retorna una Promise, y await pausa esa función hasta que la Promise resuelva — sin bloquear el resto del programa. Promise.all lanza múltiples operaciones en paralelo y espera a que todas terminen.',
    codeExample: `async function procesarTarea(nombre: string, ms: number): Promise<string> {
  await new Promise(r => setTimeout(r, ms))
  return \`✅ \${nombre} completado\`
}

async function turnoFinal(): Promise<void> {
  console.log("🏭 Iniciando...")

  // ❌ Secuencial: 50+80+30+100 = 260ms total
  // const r1 = await procesarTarea("A", 50)
  // const r2 = await procesarTarea("B", 80)

  // ✅ Paralelo: solo 100ms (el más largo)
  const resultados = await Promise.all([
    procesarTarea("Ensamblado", 50),
    procesarTarea("Pintado", 80),
    procesarTarea("Control QA", 30),
    procesarTarea("Despacho", 100),
  ])
  resultados.forEach(r => console.log(r))
}

await turnoFinal()  // top-level await`,
    tips: [
      'async function siempre retorna Promise<T> — aunque no lo parezca',
      'Promise.all es mucho más rápido que await en secuencia para tareas independientes',
      'Siempre rodeá con try/catch — las Promises rechazadas son errores silenciosos',
    ],
  },
  stampsRequired: 5,
  mechanic: 'parallel' as const,

  // Curriculum
  subtitle: 'async.ts — Varios robots trabajan en paralelo. El robot aprendió todo lo que había que aprender.',
  module: 6,
  moduleName: 'Boss Stages: Algoritmos Reales',
  metaphor: 'La fábrica tiene 4 robots operando en simultáneo: uno ensambla, otro pinta, otro verifica QA, otro despacha. No se pueden bloquear entre sí. Cada tarea tarda un tiempo distinto. El gerente espera a que todos terminen antes de cerrar el turno.',
  concepts: 'Promise<T> con tipo de retorno · async function · await · Promise.all() para esperar múltiples tareas · Promise.race() · Manejo de errores con try/catch en async · Tipo Promise<Resultado>',
  unlocks: ['🏆 Fábrica completa', '🎓 Certificado TypeScript'],
};

export default level19;
