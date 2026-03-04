import { Level } from '../../engine/types';

const level3: Level = {
  id: 'p1-l3',
  phase: 1,
  title: 'Reporte del Robot',
  objective: 'Usá template literals (backticks) para imprimir: "Robot: Olympus | Velocidad: 100"',
  concept: 'Template literals',
  mentor: 'athenix',
  hint: 'Los template literals usan backticks (`) y permiten insertar variables con ${}. Ejemplo: `Hola ${nombre}`',
  starterCode: `// Datos del robot
const nombre = "Olympus"
const velocidad = 100

// Usá backticks y \${} para armar el mensaje
console.log(\`Robot: ??? | Velocidad: ???\`)`,
  solution: `const nombre = "Olympus"
const velocidad = 100
console.log(\`Robot: \${nombre} | Velocidad: \${velocidad}\`)`,
  validate: (output: string[]) =>
    output.some((line) =>
      line.includes('Robot:') && line.includes('Olympus') && line.includes('100')
    ),
  lesson: {
    explanation: 'Los template literals (backtick `) te permiten insertar variables directamente dentro de un string con ${}. Son mucho más legibles que concatenar con +, y los vas a usar constantemente en automatización para construir mensajes de log, URLs dinámicas y assertions.',
    codeExample: `const robot = "Olympus-1"
const velocidad = 100
const activo = true

// Sin template literal (difícil de leer):
console.log("Robot " + robot + " velocidad: " + velocidad)

// Con template literal (limpio):
console.log(\`Robot: \${robot} | Velocidad: \${velocidad}\`)

// Podés poner expresiones completas:
console.log(\`Doble velocidad: \${velocidad * 2}\`)
console.log(\`Estado: \${activo ? "online" : "offline"}\`)`,
    tips: [
      'Backtick ` (no comillas) para abrir y cerrar el template',
      '${} para insertar cualquier expresión TypeScript',
      'En Playwright: \`expect(el).toHaveText(\`\${producto} encontrado\`)\`',
    ],
  },
  stampsRequired: 3,
  mechanic: 'assembler' as const,
};

export default level3;
