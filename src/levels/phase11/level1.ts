import { Level } from '../../engine/types';

const level27: Level = {
  id: 'p11-l1',
  phase: 11,
  title: '🏭 La Fábrica Completa',
  objective: 'Diseñá un sistema de gestión de inventario completo usando TODOS los conceptos del curso: generics, clases, utility types, Result, y async.',
  concept: 'integración total · generics · classes · utility types · Result · async/await',
  mentor: 'artemisa',
  hint: 'Este es el boss final. El sistema necesita: 1) Clase genérica Almacen<T extends { id: string; stock: number }>, 2) type Result<T,E> con helpers ok/err, 3) Utility types para vistas públicas, 4) función async que usa Promise.all. Combiná todo. Al final escribí await turnoFinal() o await procesarTodos().',
  starterCode: `// fabrica-completa.ts — Sistema de gestión integrado
// 🎯 Construí un sistema completo que use:
//
//    1. interface Producto { id: string; nombre: string; precio: number; stock: number }
//    2. type ProductoPublico = Omit<Producto, "precio">
//    3. type Result<T,E> = { ok: true; value: T } | { ok: false; error: E }
//       + helpers ok<T>() y err<E>()
//    4. class Almacen<T extends { id: string; stock: number }>
//       - agregar(item: T): Result<T, string>
//       - obtener(id: string): Result<T, string>
//       - actualizarStock(id: string, delta: number): Result<number, string>
//       - resumen(): string
//    5. async function procesarPedido(...): Promise<Result<string, string>>
//    6. Crear almacén con 3 productos, procesar 2 pedidos en paralelo
//    7. Imprimir resumen y: "Sistema operativo ✅"

// Tu código acá 👇
`,
  solution: `interface Producto {
  id: string
  nombre: string
  precio: number
  stock: number
}

type ProductoPublico = Omit<Producto, 'precio'>
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }

function ok<T>(value: T): Result<T, never> { return { ok: true, value } }
function err<E>(error: E): Result<never, E> { return { ok: false, error } }

class Almacen<T extends { id: string; stock: number }> {
  private items = new Map<string, T>()

  agregar(item: T): Result<T, string> {
    if (this.items.has(item.id)) return err(\`ID duplicado: \${item.id}\`)
    this.items.set(item.id, item)
    return ok(item)
  }

  obtener(id: string): Result<T, string> {
    const item = this.items.get(id)
    if (!item) return err(\`No encontrado: \${id}\`)
    return ok(item)
  }

  actualizarStock(id: string, delta: number): Result<number, string> {
    const res = this.obtener(id)
    if (!res.ok) return err(res.error)
    const nuevoStock = res.value.stock + delta
    if (nuevoStock < 0) return err(\`Stock insuficiente: \${res.value.stock} disponibles\`)
    this.items.set(id, { ...res.value, stock: nuevoStock })
    return ok(nuevoStock)
  }

  resumen(): string {
    const total = [...this.items.values()].reduce((acc, i) => acc + i.stock, 0)
    return \`\${this.items.size} productos, \${total} unidades en stock\`
  }
}

async function procesarPedido(
  almacen: Almacen<Producto>,
  id: string,
  cantidad: number
): Promise<Result<string, string>> {
  await new Promise(r => setTimeout(r, 30))
  const res = almacen.actualizarStock(id, -cantidad)
  if (!res.ok) return err(\`Pedido fallido: \${res.error}\`)
  return ok(\`Pedido confirmado: \${cantidad}x \${id} (stock: \${res.value})\`)
}

const almacen = new Almacen<Producto>()
almacen.agregar({ id: 'P001', nombre: 'Perno M6', precio: 0.5, stock: 100 })
almacen.agregar({ id: 'P002', nombre: 'Engranaje Z4', precio: 12, stock: 10 })
almacen.agregar({ id: 'P003', nombre: 'Circuito QX', precio: 45, stock: 5 })

console.log(\`Almacén inicial: \${almacen.resumen()}\`)

const resultados = await Promise.all([
  procesarPedido(almacen, 'P001', 30),
  procesarPedido(almacen, 'P002', 15),
])

resultados.forEach(r => {
  if (r.ok) console.log(\`✅ \${r.value}\`)
  else console.log(\`❌ \${r.error}\`)
})

console.log(\`Almacén final: \${almacen.resumen()}\`)
console.log('Sistema operativo ✅')`,
  validate: (output: string[]) =>
    output.some(l => l.includes('Almacén')) &&
    output.some(l => l.includes('Sistema operativo ✅')),
  lesson: {
    explanation: 'El boss final integra todo lo aprendido en un sistema real: una clase genérica con Result para errores, Omit para vistas públicas, y async/await para operaciones en paralelo. No hay una única solución correcta — hay múltiples formas válidas de implementarlo.',
    codeExample: `// El sistema que vas a construir:
class Almacen<T extends { id: string; stock: number }> {
  private items = new Map<string, T>()

  agregar(item: T): Result<T, string> { ... }
  obtener(id: string): Result<T, string> { ... }
  actualizarStock(id: string, delta: number): Result<number, string> { ... }
  resumen(): string { ... }
}

// Async con Result:
async function procesarPedido(
  almacen: Almacen<Producto>,
  id: string,
  cantidad: number
): Promise<Result<string, string>> { ... }

// Uso final:
const resultados = await Promise.all([
  procesarPedido(almacen, "P001", 30),
  procesarPedido(almacen, "P002", 15),
])
// → [{ ok: true, value: "..." }, { ok: false, error: "..." }]`,
    tips: [
      'Empezá por los tipos: Result<T,E>, la interface Producto, el Almacen genérico',
      'Implementá método por método — cada uno puede usar los anteriores',
      'async + Promise.all al final: el sistema corre pedidos en paralelo',
    ],
  },
  stampsRequired: 5,
  mechanic: 'factory-complete' as const,
  subtitle: 'fabrica-completa.ts — Integrá todo lo aprendido en un sistema real de producción',
  module: 11,
  moduleName: 'Boss Final',
  metaphor: 'La fábrica Olympus está completa. Generics para el almacén universal, clases para los robots, utility types para las vistas, Result para el control de calidad, async para la operación en paralelo. Este es el sistema que une todo.',
  concepts: 'Integración: generics + classes + utility types + Result<T,E> + async/await + discriminated unions + type guards',
  unlocks: ['🏆 Fábrica Olympus completa', '🎓 Certificado TypeScript Quest', '⭐ TypeScript Master'],
};

export default level27;
