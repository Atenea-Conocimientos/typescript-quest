import { Level } from '../../engine/types';

const level17: Level = {
  id: 'p7-l1',
  phase: 7,
  title: 'Clasificadora Automática',
  objective: 'Implementá Bubble Sort manual y luego ordená pedidos por prioridad + peso con Array.sort().',
  concept: 'Bubble Sort · Array.sort() · compareFn · multi-sort',
  mentor: 'apolo',
  hint: 'Bubble Sort: dos loops anidados. Si arr[j] > arr[j+1] → swap con destructuring: [a,b]=[b,a]. Array.sort((a,b)=>a-b) ordena ASC. Para multi-criterio: si el primer resultado === 0, aplicá el segundo.',
  starterCode: `// sorting.ts — Clasificadora de pedidos por prioridad
// 🎯 Objetivo:
//    1. bubbleSort(arr: number[]): number[] — implementar manualmente
//    2. Probar: bubbleSort([64, 34, 25, 12, 22, 11, 90])
//    3. Imprimir: "Ordenado: [resultado]"
//    4. Ordenar pedidos[] por prioridad ASC, luego peso DESC
//    5. Imprimir cada pedido: "Pedido #[id] prioridad=[p] peso=[w]kg"

interface Pedido {
  id: number
  prioridad: 1 | 2 | 3
  peso: number
}

const pedidos: Pedido[] = [
  { id: 1, prioridad: 2, peso: 15 },
  { id: 2, prioridad: 1, peso: 8 },
  { id: 3, prioridad: 3, peso: 30 },
  { id: 4, prioridad: 1, peso: 12 },
  { id: 5, prioridad: 2, peso: 5 },
]

// Tu código acá 👇
`,
  solution: `interface Pedido {
  id: number
  prioridad: 1 | 2 | 3
  peso: number
}

const pedidos: Pedido[] = [
  { id: 1, prioridad: 2, peso: 15 },
  { id: 2, prioridad: 1, peso: 8 },
  { id: 3, prioridad: 3, peso: 30 },
  { id: 4, prioridad: 1, peso: 12 },
  { id: 5, prioridad: 2, peso: 5 },
]

function bubbleSort(arr: number[]): number[] {
  const copia = [...arr]
  for (let i = 0; i < copia.length - 1; i++) {
    for (let j = 0; j < copia.length - i - 1; j++) {
      if (copia[j] > copia[j + 1]) {
        [copia[j], copia[j + 1]] = [copia[j + 1], copia[j]]
      }
    }
  }
  return copia
}

const nums = bubbleSort([64, 34, 25, 12, 22, 11, 90])
console.log(\`Ordenado: [\${nums.join(', ')}]\`)

const ordenados = [...pedidos].sort((a, b) =>
  a.prioridad !== b.prioridad ? a.prioridad - b.prioridad : b.peso - a.peso
)

ordenados.forEach(p => console.log(\`Pedido #\${p.id} prioridad=\${p.prioridad} peso=\${p.peso}kg\`))`,
  validate: (output: string[]) =>
    output.some(l => l.includes('Ordenado:') && l.includes('11')) &&
    output.some(l => l.includes('Pedido #')),
  stampsRequired: 1,
  mechanic: 'bar-sort' as const,
};

export default level17;
