import { Level } from '../../engine/types';

const level15: Level = {
  id: 'p6-l2',
  phase: 6,
  title: 'El Robot es una Clase',
  objective: 'Definí clase Robot con constructor, propiedades y métodos. Luego RobotPro que la extiende con mayor eficiencia.',
  concept: 'class · constructor · protected · extends · super',
  mentor: 'athenix',
  hint: 'Una clase es un plano. constructor(readonly nombre: string) declara y asigna en un paso. Usá protected para que las subclases accedan a energia. extends Robot + super(nombre) para heredar.',
  starterCode: `// robot-oop.ts — Robot con orientación a objetos
// 🎯 Objetivo:
//    1. Clase Robot: readonly nombre, protected energia=100, public piezas=0
//    2. Métodos: ensamblar(): boolean (consume 10 energía, falla si <10)
//                recargar(cant: number): void
//                reporte(): string → "[nombre] ⚡[energia] 🔩[piezas]"
//    3. Clase RobotPro extends Robot: ensamblar consume solo 5 de energía
//    4. Crear instancias, ejecutar 3 ensamblar() en cada uno, imprimir reporte
//    5. Imprimir: "Total piezas: [suma]"

// Tu código acá 👇
`,
  solution: `class Robot {
  readonly nombre: string
  protected energia: number = 100
  public piezas: number = 0

  constructor(nombre: string) {
    this.nombre = nombre
  }

  ensamblar(): boolean {
    if (this.energia < 10) return false
    this.energia -= 10
    this.piezas++
    return true
  }

  recargar(cant: number): void {
    this.energia += cant
  }

  reporte(): string {
    return \`[\${this.nombre}] ⚡\${this.energia} 🔩\${this.piezas}\`
  }
}

class RobotPro extends Robot {
  constructor(nombre: string) {
    super(nombre)
  }

  ensamblar(): boolean {
    if (this.energia < 5) return false
    this.energia -= 5
    this.piezas++
    return true
  }
}

const r1 = new Robot('Olympus-1')
const r2 = new RobotPro('Olympus-Pro')

for (let i = 0; i < 3; i++) {
  r1.ensamblar()
  r2.ensamblar()
}

console.log(r1.reporte())
console.log(r2.reporte())
console.log(\`Total piezas: \${r1.piezas + r2.piezas}\`)`,
  codeHints: [
    'class Robot {',
    '  readonly nombre: string',
    '  protected energia: number = 100',
    '  public piezas: number = 0',
    '  constructor(nombre: string) { this.nombre = nombre }',
    '  ensamblar(): boolean {',
    '    if (this.energia < 10) return false',
    '    this.energia -= 10; this.piezas++; return true',
    '  }',
    '  recargar(cant: number): void { this.energia += cant }',
    '  reporte(): string { return `[${this.nombre}] ⚡${this.energia} 🔩${this.piezas}` }',
    '}',
    '',
    'class RobotPro extends Robot {',
    '  constructor(nombre: string) { super(nombre) }',
    '  ensamblar(): boolean {',
    '    if (this.energia < 5) return false',
    '    this.energia -= 5; this.piezas++; return true',
    '  }',
    '}',
    '',
    'const r1 = new Robot("Olympus-1")',
    'const r2 = new RobotPro("Olympus-Pro")',
    'for (let i = 0; i < 3; i++) { r1.ensamblar(); r2.ensamblar() }',
    'console.log(r1.reporte())',
    'console.log(r2.reporte())',
    'console.log(`Total piezas: ${r1.piezas + r2.piezas}`)',
  ],
  validate: (output: string[]) =>
    output.some(l => /\[.+\] ⚡\d+ 🔩\d+/.test(l)) &&
    output.some(l => l.includes('Total piezas:')),
  lesson: {
    explanation: 'Una clase es un plano para crear objetos con estado (propiedades) y comportamiento (métodos). El constructor inicializa el estado, this accede a las propiedades del objeto. extends permite heredar y extender una clase base sin duplicar código.',
    codeExample: `class Robot {
  readonly nombre: string
  private energia: number = 100
  public piezas: number = 0

  constructor(nombre: string) {
    this.nombre = nombre
  }

  ensamblar(): boolean {
    if (this.energia < 10) return false
    this.energia -= 10
    this.piezas++
    return true
  }

  reporte(): string {
    return \`[\${this.nombre}] ⚡\${this.energia} 🔩\${this.piezas}\`
  }
}

class RobotPro extends Robot {
  ensamblar(): boolean {
    // sobrescribe: consume solo 5 de energía
    this.piezas++
    return true
  }
}`,
    tips: [
      'readonly: no se puede cambiar después del constructor',
      'private: solo accesible dentro de la clase; public: accesible desde afuera',
      'extends + super(args) para heredar e inicializar la clase base',
    ],
  },
  stampsRequired: 5,
  mechanic: 'blueprint' as const,

  // Curriculum
  subtitle: 'robot-oop.ts — El robot se programa a sí mismo con orientación a objetos',
  module: 5,
  moduleName: 'Patrones Avanzados',
  metaphor: 'La fábrica tiene varios modelos de robot. Cada uno tiene sus propias características (nombre, energía, piezas producidas) y puede hacer cosas (moverse, ensamblar, recargar). Una clase es el plano del robot — cada instancia es un robot real en el piso de fábrica.',
  concepts: 'class · constructor · modificadores public/private/readonly · Métodos de instancia · this · Herencia con extends · super() · Getters/setters · Instanciar con new',
  unlocks: ['Robot modular', 'Flota de robots'],
};

export default level15;
