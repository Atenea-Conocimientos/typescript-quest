import { Level } from '../../engine/types';

const level4: Level = {
  id: 'p2-l1',
  phase: 2,
  title: 'Tipos de Materiales',
  objective: 'Declarar 6 variables con anotaciones de tipo explícitas (number, string, boolean) y mostrar el informe de materiales',
  concept: 'Anotaciones de tipo',
  mentor: 'athenix',
  hint: 'La sintaxis es: let nombre: tipo = valor. Usá number para cantidades, string para texto, boolean para verdadero/falso. El editor te muestra en rojo si el tipo no coincide con el valor.',
  starterCode: `// materiales.ts — Inventario de la Fábrica Olympus
// Completá cada ??? con el tipo correcto: number, string o boolean

let tornillos: ??? = 500
const material: ??? = "acero inoxidable"
let activa: ??? = true
const temp: ??? = 320.5
const codigoPieza: ??? = "P-001"
let pasoQA: ??? = false

// ❌ Intentá descomentar esta línea — TypeScript lo detecta antes de ejecutar:
// tornillos = "muchos"

console.log(\`Material: \${material} | Activa: \${activa}\`)
console.log(\`Tornillos: \${tornillos} | Temp: \${temp}°C | QA: \${pasoQA}\`)`,
  solution: `let tornillos: number = 500
const material: string = "acero inoxidable"
let activa: boolean = true
const temp: number = 320.5
const codigoPieza: string = "P-001"
let pasoQA: boolean = false

console.log(\`Material: \${material} | Activa: \${activa}\`)
console.log(\`Tornillos: \${tornillos} | Temp: \${temp}°C | QA: \${pasoQA}\`)`,
  validate: (output: string[]) => {
    const linea1 = output.some((l) => l.includes('Material:') && l.includes('acero inoxidable') && l.includes('Activa:'));
    const linea2 = output.some((l) => l.includes('Tornillos:') && l.includes('500') && l.includes('Temp:'));
    return linea1 && linea2;
  },
  stampsRequired: 3,
};

export default level4;
