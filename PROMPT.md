# TypeScript Quest — Scaffold Task

Build the MVP scaffold for **TypeScript Quest** ("Olympus Factory"), a browser-based educational game where players learn TypeScript by programming robots on a factory assembly line — inspired by the Steam game "The Farmer Was Replaced" but for TypeScript.

## Core Architecture

### Tech Stack
- **Vite + React + TypeScript** (not Next.js — pure client-side, no SSR needed)
- **Monaco Editor** (`@monaco-editor/react`) — VS Code's editor with TypeScript language server
- **esbuild-wasm** — compile & run TypeScript in the browser inside a Web Worker (sandboxed)
- **Phaser.js 3** — 2D isometric factory game world
- **CSS Modules** for styling

### Project Structure to Create

```
typescript-quest/
├── public/
│   └── assets/
│       └── placeholder.png
├── src/
│   ├── main.tsx                  ← App entry
│   ├── App.tsx                   ← Root component, routing between screens
│   ├── styles/
│   │   └── globals.css           ← Global styles (dark theme, purple/cyan palette)
│   ├── engine/
│   │   ├── GameEngine.ts         ← Core game state machine
│   │   ├── types.ts              ← Game types (Phase, Robot, Product, etc.)
│   │   └── worker/
│   │       └── tsRunner.worker.ts ← Web Worker: esbuild-wasm compile + eval
│   ├── editor/
│   │   ├── CodeEditor.tsx        ← Monaco Editor wrapper
│   │   └── EditorPanel.tsx       ← Editor + Run button + Output panel
│   ├── game/
│   │   ├── FactoryScene.ts       ← Phaser.js Scene: the factory floor
│   │   ├── Robot.ts              ← Robot sprite + animation
│   │   └── ConveyorBelt.ts       ← Moving belt animation
│   ├── levels/
│   │   ├── index.ts              ← Level registry
│   │   ├── Level.ts              ← Level interface
│   │   └── phase1/
│   │       ├── level1.ts         ← Bolts: console.log basics
│   │       ├── level2.ts         ← Bolts: variables (let, const)
│   │       └── level3.ts         ← Bolts: if/else
│   ├── mentors/
│   │   ├── Mentor.tsx            ← Mentor speech bubble component
│   │   └── mentors.ts            ← Mentor data (Athenix, Hermes, Apolo, Artemisa)
│   └── components/
│       ├── GameScreen.tsx        ← Main game layout (editor left, factory right)
│       ├── TechTree.tsx          ← Tech tree sidebar (locked/unlocked phases)
│       └── HUD.tsx               ← Score, production rate, phase indicator
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Level System

Each level has:
- **objective**: what the robot should produce (e.g., "5 bolts")
- **starterCode**: initial code shown in the editor  
- **solution**: working TypeScript code
- **validate(output: string[]): boolean** — checks if the run produced the right output
- **mentor**: which avatar gives the intro hint
- **concept**: TypeScript concept being taught

## Phase 1 Levels (implement these 3):

### Level 1 — Hello Factory
```typescript
// Concept: console.log, strings
// Objective: Make the robot say "BOLT READY"
// Starter code:
console.log("???")
// Solution:
console.log("BOLT READY")
// Validate: output includes "BOLT READY"
```

### Level 2 — Count the Bolts
```typescript
// Concept: let, const, numbers
// Objective: Store 5 in a variable and log it
// Starter code:
let bolts = ???
console.log(bolts)
// Solution:
let bolts = 5
console.log(bolts)
// Validate: output includes "5"
```

### Level 3 — Quality Check
```typescript
// Concept: if/else, boolean conditions
// Objective: Log "APPROVED" if quality > 7, else "REJECTED"
// Starter code:
const quality = 8
if (quality ???) {
  console.log("???")
} else {
  console.log("???")
}
// Solution:
const quality = 8
if (quality > 7) {
  console.log("APPROVED")
} else {
  console.log("REJECTED")
}
// Validate: output includes "APPROVED"
```

## Web Worker (TypeScript Runner)

The worker receives TypeScript code as a string, compiles it with esbuild-wasm to JavaScript, then evaluates it in a sandboxed context, capturing console.log output. Returns `{ success: boolean, output: string[], error?: string }`.

```typescript
// Key pattern:
// 1. Import esbuild-wasm in worker
// 2. Initialize esbuild once
// 3. On message: transform TS → JS, eval with captured console.log
// 4. Return captured output
```

## Visual Design

- **Color palette**: Dark background (#0d1117), Purple (#7c3aed), Cyan (#06b6d4), Pink (#ec4899)
- **Font**: JetBrains Mono for code, Inter for UI
- **Layout**: Left 40% = code editor, Right 60% = factory floor (Phaser canvas)
- **Factory aesthetic**: Conveyor belts, robotic arms, glowing products

## Mentor Avatars (placeholder data)

```typescript
// Use emoji as placeholder until real assets are ready
const mentors = {
  athenix: { name: "Athenix", emoji: "🦉", color: "#7c3aed", phases: [1, 2] },
  hermes:  { name: "Hermes",  emoji: "⚡", color: "#06b6d4", phases: [3, 4] },
  apolo:   { name: "Apolo",   emoji: "🎯", color: "#f59e0b", phases: [5, 6] },
  artemisa:{ name: "Artemisa",emoji: "🏹", color: "#ec4899", phases: [7, 8] },
}
```

## What Should Work After Scaffold

1. `npm run dev` → app starts at localhost:5173
2. The app shows the factory screen with Monaco editor on the left
3. Player can type TypeScript in the editor
4. Click "Deploy" button → code compiles + runs in the Web Worker
5. Output appears in a console panel below the editor
6. Level 1 hint appears from Athenix (the owl mentor)
7. If the output matches the objective → "BOLT READY ✅" success state
8. Phaser factory canvas shows a simple conveyor belt animating

## Important Implementation Notes

- esbuild-wasm needs to be initialized ONCE in the worker with `esbuild.initialize({ wasmURL: ... })`
- Use `vite-plugin-top-level-await` or set `optimizeDeps.exclude` for esbuild-wasm
- Worker needs `type: 'module'` in Vite config for ESM workers
- Monaco Editor needs `monaco-editor` in `optimizeDeps.include`
- Phaser 3 import: `import Phaser from 'phaser'` (not default ESM)

## After Building

1. Run `npm install && npm run dev` to verify it builds
2. Fix any TypeScript errors
3. Create an initial commit: `git add -A && git commit -m "feat: initial TypeScript Quest scaffold with Monaco + esbuild-wasm + Phaser"`
4. Push to origin: `git push -u origin main`
5. Run this notification: `openclaw system event --text "Done: TypeScript Quest scaffold built — Monaco + esbuild-wasm + Phaser working at localhost:5173" --mode now`
