# Curriculum Metadata — Levels 14–19
_Provided by Juan 2026-03-04. To be integrated into level files / Level interface._

---

## Fase 14 — Almacén Genérico
- **Módulo:** 5 — Patrones Avanzados
- **Subtítulo:** generics.ts — Un sistema de almacenamiento que funciona para cualquier tipo de pieza
- **Stamps:** 5
- **Concepto TS:** generics · <T> · type parameters · constraints
- **Metáfora:** El almacén necesita un sistema de estanterías universal: no importa si guarda pernos, circuitos o ruedas — el sistema funciona igual. Los generics permiten construir funciones y clases que son type-safe para cualquier tipo sin duplicar código.
- **Conceptos:** function fn<T>(param: T): T. Inferencia del tipo genérico. Múltiples parámetros: <T, K>. Restricción: <T extends object>. Interfaces genéricas: interface Caja<T>. Por qué no usar any.
- **Ejercicio:** Función genérica almacenar<T>(item: T, deposito: T[]): T[]. Interface genérica Caja<T> con contenido y etiqueta. Crear Caja<Producto> y Caja<number>. Función primero<T>(lista: T[]): T | undefined.
- **Desbloquea:** ["Almacén universal", "Reutilización máxima"]

```typescript
function almacenar<T>(item: T, deposito: T[]): T[] {
  return [...deposito, item]
}
interface Caja<T> {
  contenido: T
  etiqueta: string
  sellada: boolean
}
const cajaPernos: Caja<number> = { contenido: 500, etiqueta: "Pernos M6", sellada: true }
const cajaProducto: Caja<Producto> = { contenido: catalogo[0], etiqueta: "QA OK", sellada: false }
```

---

## Fase 15 — El Robot es una Clase
- **Módulo:** 5 — Patrones Avanzados
- **Subtítulo:** robot-oop.ts — El robot se programa a sí mismo con orientación a objetos
- **Stamps:** 5
- **Concepto TS:** class · constructor · private/public · readonly · extends
- **Metáfora:** La fábrica tiene varios modelos de robot. Cada uno tiene sus propias características (nombre, energía, piezas producidas) y puede hacer cosas (moverse, ensamblar, recargar). Una clase es el plano del robot — cada instancia es un robot real en el piso de fábrica.
- **Conceptos:** class, constructor, modificadores public / private / readonly. Métodos de instancia. this. Herencia con extends. super(). Getters / setters. Instanciar con new.
- **Ejercicio:** Clase Robot con nombre (readonly), energía privada, y contador de piezas. Métodos: mover(), ensamblar(): boolean (consume energía, falla si agotada), recargar(cantidad: number), reporte(): string. Crear RobotPro que extiende Robot con capacidad doble.
- **Desbloquea:** ["Robot modular", "Flota de robots"]

```typescript
class Robot {
  readonly nombre: string
  private energia: number = 100
  public piezas: number = 0
  constructor(nombre: string) { this.nombre = nombre }
  ensamblar(): boolean {
    if (this.energia < 10) return false
    this.energia -= 10; this.piezas++; return true
  }
  recargar(cant: number): void { this.energia += cant }
  reporte(): string { return `[${this.nombre}] ⚡${this.energia} 🔩${this.piezas}` }
}
```

---

## Fase 16 — Búsqueda en Profundidad
- **Módulo:** 5 — Patrones Avanzados
- **Subtítulo:** recursion.ts — El robot busca piezas en estantes anidados dentro de estantes
- **Stamps:** 5
- **Concepto TS:** recursión · caso base · call stack · tipo recursivo
- **Metáfora:** El depósito tiene cajas dentro de cajas: una caja contiene piezas sueltas y otras sub-cajas, que a su vez tienen más. El robot debe contar TODAS las piezas sin importar cuántos niveles de profundidad haya. No puede saber de antemano cuántos niveles hay.
- **Conceptos:** Función recursiva que se llama a sí misma. Caso base que detiene la recursión. Call stack. Tipo recursivo con TypeScript: interface Nodo { valor: number; hijos?: Nodo[] }. Diferencia con loop iterativo.
- **Ejercicio:** Interface Caja con piezas: number y subcajas?: Caja[]. Función recursiva contarTotal(caja: Caja): number que suma piezas propias + recursión en subcajas. Armar un árbol de 3 niveles y verificar el total.
- **Desbloquea:** ["Inventario profundo", "Módulo Boss"]

```typescript
interface Caja { nombre: string; piezas: number; subcajas?: Caja[] }
function contarTotal(caja: Caja): number {
  if (!caja.subcajas) return caja.piezas
  return caja.piezas + caja.subcajas.reduce((acc, sub) => acc + contarTotal(sub), 0)
}
```

---

## Fase 17 — Clasificadora Automática
- **Módulo:** 6 — Boss Stages: Algoritmos Reales
- **Subtítulo:** sorting.ts — El robot debe ordenar lotes de producción por prioridad crítica
- **Stamps:** 5
- **Concepto TS:** Bubble Sort · Array.sort() · compareFn · multi-sort
- **Metáfora:** La línea de despacho necesita ordenar pedidos por prioridad: primero los urgentes, luego por fecha, luego por peso. El robot implementa primero sorting manual (Bubble Sort) para entender el concepto, luego usa Array.sort() con función comparadora custom.
- **Conceptos:** Implementar Bubble Sort manualmente para entender intercambios. Luego Array.sort((a, b) => ...) con comparador tipado. Ordenar por múltiples criterios (multi-sort). Ordenar array de objetos por propiedad.
- **Ejercicio:** Array de Pedido[] con prioridad (1=urgente, 3=normal), fecha y peso. Implementar Bubble Sort manual sobre números. Luego refactorizar con .sort(). Finalmente: ordenar pedidos primero por prioridad ascendente, luego por peso descendente (multi-criterio).
- **Desbloquea:** ["Línea de despacho", "Fase 18"]

```typescript
interface Pedido { id: number; prioridad: 1 | 2 | 3; peso: number }
function bubbleSort(arr: number[]): number[] {
  const copia = [...arr]
  for (let i = 0; i < copia.length - 1; i++)
    for (let j = 0; j < copia.length - i - 1; j++)
      if (copia[j] > copia[j + 1]) [copia[j], copia[j+1]] = [copia[j+1], copia[j]]
  return copia
}
const ordenados = pedidos.sort((a, b) =>
  a.prioridad !== b.prioridad ? a.prioridad - b.prioridad : b.peso - a.peso
)
```

---

## Fase 18 — Laberinto del Almacén
- **Módulo:** 6 — Boss Stages: Algoritmos Reales
- **Subtítulo:** laberinto.ts — Un envío urgente está perdido en el depósito. El robot debe encontrarlo.
- **Stamps:** 5
- **Concepto TS:** DFS · stacks · Set · grafos tipados · type Posicion
- **Metáfora:** El almacén es una grilla de pasillos y paredes. Un envío urgente está escondido en algún lugar. El robot debe navegar los pasillos disponibles para encontrarlo. Implementar DFS: avanzar hasta bloquearse, retroceder, intentar otro camino.
- **Conceptos:** Representar grafo con interfaces tipadas. DFS iterativo con Stack (array como pila). Set<string> para visitados. Tipos: type Posicion = [number, number]. Aplicar todos los conceptos anteriores juntos: interfaces, generics, arrays, funciones, clases.
- **Ejercicio:** Grilla string[][] donde '.'=pasillo, '#'=pared, 'S'=inicio, 'E'=envío perdido. Implementar DFS para encontrar un camino de S a E. Retornar el camino como Posicion[]. Desafío extra: implementar BFS para encontrar el camino más corto.
- **Desbloquea:** ["Navegación autónoma", "Fase 19 (Final)"]

```typescript
type Pos = [number, number]
const DIRS: Pos[] = [[-1,0],[1,0],[0,-1],[0,1]]
function dfs(grilla: string[][], inicio: Pos): Pos[] | null {
  const stack: [Pos, Pos[]][] = [[inicio, [inicio]]]
  const visitados = new Set<string>()
  while (stack.length) {
    const [[r, c], camino] = stack.pop()!
    if (grilla[r][c] === "E") return camino
    for (const [dr, dc] of DIRS) {
      const clave = `${r+dr},${c+dc}`
      if (!visitados.has(clave) && grilla[r+dr]?.[c+dc] !== "#") {
        visitados.add(clave)
        stack.push([[r+dr, c+dc], [...camino, [r+dr, c+dc]]])
      }
    }
  }
  return null
}
```

---

## Fase 19 — Fábrica Multi-Robot
- **Módulo:** 6 — Boss Stages: Algoritmos Reales
- **Subtítulo:** async.ts — Varios robots trabajan en paralelo. El robot aprendió todo lo que había que aprender.
- **Stamps:** 5
- **Concepto TS:** Promise · async/await · Promise.all · Promise.race · try/catch
- **Metáfora:** La fábrica tiene 4 robots operando en simultáneo: uno ensambla, otro pinta, otro verifica QA, otro despacha. No se pueden bloquear entre sí. Cada tarea tarda un tiempo distinto. El gerente espera a que todos terminen antes de cerrar el turno.
- **Conceptos:** Promise<T> con tipo de retorno. async function. await. Promise.all() para esperar múltiples tareas. Promise.race(). Manejo de errores con try/catch en async. Tipo Promise<Resultado>.
- **Ejercicio:** Función async procesarTarea(nombre: string, duracion: number): Promise<string> que simula trabajo con setTimeout. Lanzar 4 tareas en paralelo con Promise.all(). Luego versión con Promise.race() para detectar cuál termina primero. Manejar errores async.
- **Desbloquea:** ["🏆 Fábrica completa", "🎓 Certificado TypeScript"]

```typescript
async function procesarTarea(nombre: string, segundos: number): Promise<string> {
  await new Promise(r => setTimeout(r, segundos * 1000))
  return `✅ ${nombre} completado en ${segundos}s`
}
async function turnoFinal(): Promise<void> {
  console.log("🏭 Iniciando turno multi-robot...")
  try {
    const resultados = await Promise.all([
      procesarTarea("Ensamblado", 2),
      procesarTarea("Pintado", 3),
      procesarTarea("Control QA", 1),
      procesarTarea("Despacho", 4),
    ])
    resultados.forEach(r => console.log(r))
    console.log("🎉 Turno cerrado. ¡Fábrica optimizada!")
  } catch (error) { console.error("Robot falló:", error) }
}
turnoFinal()
```
