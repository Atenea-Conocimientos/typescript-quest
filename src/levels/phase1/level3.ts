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
  stampsRequired: 3,
};

export default level3;
