import { Level } from '../../engine/types';

const level18: Level = {
  id: 'p7-l2',
  phase: 7,
  title: 'Laberinto del Almacén',
  objective: 'Implementá DFS para encontrar el camino de S a E en una grilla con paredes. Imprimí cuántos pasos.',
  concept: 'DFS · stack · Set<string> · type alias · grafos tipados',
  mentor: 'apolo',
  hint: 'DFS usa un stack (array + .pop()). En cada paso: si llegaste a E → retorná el camino. Para cada vecino libre: marcarlo visitado y pushear [posición, camino+posición]. Guardá visitados en Set<string> para no repetir.',
  starterCode: `// laberinto.ts — Búsqueda con DFS
// '.' = pasillo  '#' = pared  'S' = inicio  'E' = destino
// 🎯 Objetivo:
//    1. type Pos = [number, number]
//    2. Función dfs(grilla: string[][], inicio: Pos): Pos[] | null
//    3. Llamar dfs con inicio en S=[4,0], encontrar E=[0,4]
//    4. Imprimir: "Camino encontrado: [N] pasos"
//       o bien: "Sin camino"

const grilla: string[][] = [
  ['.', '.', '#', '.', 'E'],
  ['#', '.', '#', '.', '#'],
  ['.', '.', '.', '.', '#'],
  ['.', '#', '#', '.', '.'],
  ['S', '.', '.', '#', '.'],
]

// Tu código acá 👇
`,
  solution: `const grilla: string[][] = [
  ['.', '.', '#', '.', 'E'],
  ['#', '.', '#', '.', '#'],
  ['.', '.', '.', '.', '#'],
  ['.', '#', '#', '.', '.'],
  ['S', '.', '.', '#', '.'],
]

type Pos = [number, number]
const DIRS: Pos[] = [[-1, 0], [1, 0], [0, -1], [0, 1]]

function dfs(grilla: string[][], inicio: Pos): Pos[] | null {
  const stack: [Pos, Pos[]][] = [[inicio, [inicio]]]
  const visitados = new Set<string>()
  visitados.add(\`\${inicio[0]},\${inicio[1]}\`)

  while (stack.length) {
    const [[r, c], camino] = stack.pop()!
    if (grilla[r][c] === 'E') return camino

    for (const [dr, dc] of DIRS) {
      const nr = r + dr
      const nc = c + dc
      const clave = \`\${nr},\${nc}\`
      if (!visitados.has(clave) && grilla[nr]?.[nc] !== undefined && grilla[nr][nc] !== '#') {
        visitados.add(clave)
        stack.push([[nr, nc], [...camino, [nr, nc]]])
      }
    }
  }
  return null
}

const inicio: Pos = [4, 0]
const resultado = dfs(grilla, inicio)

if (resultado) {
  console.log(\`Camino encontrado: \${resultado.length} pasos\`)
  resultado.forEach(([r, c]) => console.log(\`  → [\${r},\${c}]\`))
} else {
  console.log('Sin camino')
}`,
  validate: (output: string[]) =>
    output.some(l => l.toLowerCase().includes('camino encontrado')),
  lesson: {
    explanation: 'DFS (Depth-First Search) explora un grafo o árbol yendo tan profundo como puede antes de retroceder. Se implementa con un stack (pila): sacás el último elemento, explorás sus vecinos, los agregás al stack, y repetís. TypeScript tipado hace que este algoritmo sea seguro y expresivo.',
    codeExample: `type Pos = [number, number]
const DIRS: Pos[] = [[-1,0], [1,0], [0,-1], [0,1]]

function dfs(grilla: string[][], inicio: Pos): Pos[] | null {
  // Stack: cada entrada es [posición actual, camino recorrido]
  const stack: [Pos, Pos[]][] = [[inicio, [inicio]]]
  const visitados = new Set<string>()

  while (stack.length) {
    const [[r, c], camino] = stack.pop()!

    if (grilla[r][c] === "E") return camino  // ← encontrado!

    for (const [dr, dc] of DIRS) {
      const clave = \`\${r+dr},\${c+dc}\`
      if (!visitados.has(clave) && grilla[r+dr]?.[c+dc] !== "#") {
        visitados.add(clave)
        stack.push([[r+dr, c+dc], [...camino, [r+dr, c+dc]]])
      }
    }
  }
  return null  // sin camino
}`,
    tips: [
      'Stack → DFS (profundidad primero). Queue → BFS (amplitud primero, camino más corto)',
      'Set<string> para visitados evita revisitar nodos — fundamental para correctitud',
      'El operador ?. en grilla[r+dr]?.[c+dc] maneja los bordes del mapa sin errores',
    ],
  },
  stampsRequired: 5,
  mechanic: 'maze' as const,

  // Curriculum
  subtitle: 'laberinto.ts — Un envío urgente está perdido en el depósito. El robot debe encontrarlo.',
  module: 6,
  moduleName: 'Boss Stages: Algoritmos Reales',
  metaphor: 'El almacén es una grilla de pasillos y paredes. Un envío urgente está escondido en algún lugar. El robot debe navegar los pasillos disponibles para encontrarlo. Implementar DFS: avanzar hasta bloquearse, retroceder, intentar otro camino.',
  concepts: 'Representar grafo con interfaces tipadas · DFS iterativo con Stack (array como pila) · Set<string> para visitados · type Posicion = [number, number] · Aplicar interfaces, generics, arrays, funciones, clases juntos',
  unlocks: ['Navegación autónoma', 'Fase 19 (Final)'],
};

export default level18;
