# Script Live — TypeScript Quest
**Duración estimada: 25-35 minutos**
_Tono: directo, entretenido, argentino. No leer literalmente — usarlo como guía._

---

## 🎬 APERTURA (2 min)

> *Mientras la gente entra al live:*

"Buenas, buenas — hoy no hacemos clase normal. Hoy hacemos algo distinto."

*[Pausa. Que se genere expectativa.]*

"Hace unas semanas me pasó algo. Estaba preparando el módulo de TypeScript del curso y pensé: *¿por qué aprender TypeScript tiene que ser tan aburrido?* Variables, tipos, interfaces... todo bien, pero en una pantalla estática, sin feedback real, la gente se duerme."

"Entonces arranqué a construir algo. Y hoy se los traigo."

*[Compartí pantalla — mostrá el juego en el nivel 1, sin explicar nada todavía]*

"Esto se llama **TypeScript Quest**. Es un juego donde aprendés TypeScript programando robots en una fábrica."

*[Pausa. Dejá que lo vean.]*

"¿Ven el editor de código a la izquierda? Es el mismo editor de VS Code, corriendo en el browser. Y a la derecha, la fábrica. Cuando escribís código correcto... la fábrica reacciona."

"Hoy lo jugamos juntos. Y de paso, aprendemos TypeScript."

---

## 🎮 NIVEL 1 — El primer "wow" (4 min)

*[Nivel 1 — Hello Factory, speech mechanic]*

"Empezamos simple. El objetivo: hacer que el robot diga 'BOLT READY'."

*[Mostrá el código starter con el `???`]*

"¿Alguien del chat sabe qué va acá?"

*[Esperá 20 segundos, leé respuestas]*

"Exacto — `console.log`. Lo más básico de TypeScript."

*[Escribí la solución: `console.log("BOLT READY")`]*

"Ahora le doy a Deploy..."

*[Click en Deploy — esperá el resultado]*

"¿Vieron eso? El código compila **en el browser**, sin instalar nada. Puro TypeScript corriendo en tiempo real."

*[La fábrica reacciona — sellar el robot]*

"Sellar dos veces para completar el nivel..."

*[Completá el nivel — aparece el overlay de éxito]*

"Listo. Nivel 1. Parece simple pero esto es exactamente lo que hace la diferencia: **feedback inmediato**. Escribís código, ves qué pasa, aprendés."

---

## ⚡ NIVELES 2-5 — Subiendo la temperatura (5 min)

*[Avanzá rápido por niveles 2, 3, 4 — mostrá la mecánica visual en cada uno]*

**Nivel 2 (variables):**
"Nivel 2 — variables. `let` vs `const`. ¿Alguien recuerda la diferencia?"

*[Chat responde — tomá una respuesta correcta]*

"Exacto. `const` no se puede reasignar. `let` sí. Mirá cómo el tanque se llena cuando el código es correcto..."

*[Mostrá la animación de los tanques llenándose]*

**Nivel 3 (template literals):**
"Nivel 3 — template literals. Esto lo van a usar todo el tiempo en sus tests de Playwright."

*[Mencioná la conexión con el trabajo real — no solo un juego]*

"En automatización, cuando armás un mensaje de log o un selector dinámico, esto es exactamente lo que usás."

*[Completá el nivel rápido]*

**Nivel 4-5 (tipos y if/else):**
"Niveles 4 y 5 — sistema de tipos y condicionales. Acá es donde TypeScript empieza a diferenciarse de JavaScript."

*[Mostrá el scanner de tipos — la animación del beam]*

"¿Ven que el compilador sabe exactamente de qué tipo es cada cosa? No hay 'puede ser un string, puede ser un número'. TypeScript te obliga a ser explícito."

---

## 🔥 EL CONCEPTO CENTRAL — Por qué TypeScript (3 min)

*[Pausá la demo — mirá a cámara]*

"Antes de seguir, quiero que entiendan POR QUÉ esto importa para ustedes como QA."

"Cuando trabajan con Playwright, con Appium, con cualquier framework moderno de automatización — están escribiendo TypeScript. No JavaScript. TypeScript."

"¿La diferencia? Con TypeScript, si escribís mal el nombre de un método, el editor te avisa **antes de correr el test**. Con JavaScript, ese bug lo encontrás a las 3 de la mañana cuando falla el pipeline."

*[Chat: "¿cuántas veces les pasó debuguear un test que falló por un typo?"]*

"TypeScript elimina una clase entera de bugs. Y este juego los lleva de los conceptos básicos hasta el nivel donde ya pueden escribir frameworks de automatización serios."

---

## 🚀 NIVELES INTERMEDIOS — Donde se pone bueno (5 min)

*[Saltá al nivel 8 o 9 — arrays/funciones]*

**Arrays (nivel 8):**
"Nivel 8 — arrays. El almacén de la fábrica. En QA van a manejar arrays todo el tiempo: listas de elementos, resultados de queries, reportes."

*[Mostrá el starter code con los productos]*

"El objetivo es llenar el almacén. Escribimos el código..."

*[Completá el nivel — mostrá las estanterías llenándose]*

**Funciones (nivel 9):**
"Nivel 9 — funciones. La máquina de la fábrica. Entrada → proceso → salida. Exactamente como un helper en un framework de tests."

*[Completá rápido — destacá la animación input→output]*

**Interfaces (nivel 10):**
"Nivel 10 — interfaces. Esto es clave. En automatización definen interfaces para los datos que esperan de la API, para las opciones de sus helpers, para los reportes."

*[Mostrá el código con `interface Producto`]*

"Cuando le dicen a TypeScript 'este objeto tiene esta forma', el compilador los protege. Si alguien cambia la API y la respuesta viene diferente, TypeScript grita antes de que fallen los tests."

---

## 💡 PAUSA INTERACTIVA — Pregunta al chat (2 min)

*[Dejá de mostrar el juego por un momento]*

"Pregunta para el chat: ¿cuál de los conceptos que vimos hasta ahora les costó más cuando arrancaron con TypeScript?"

*[Esperá respuestas — 30-45 segundos]*

*[Tomá 2-3 respuestas y comentalas brevemente]*

"Exacto. Esas respuestas son la razón por la que construí esto. Porque el problema no es el concepto — es que cuando aprendés en abstracto, sin contexto, sin feedback, no queda."

"Con esto, cada concepto tiene una metáfora visual. Cuando resolvés el laberinto con DFS o usás Promise.all para los robots en paralelo, lo recordás porque lo viviste."

---

## 🎯 LOS NIVELES AVANZADOS — El showcase (5 min)

*[Saltá al nivel 14 — generics]*

**Generics (nivel 14):**
"Esto es fase 6. Generics. Si alguna vez escribieron un helper en Playwright que funciona para cualquier tipo de dato — esto es lo que estaban usando sin saberlo."

*[Mostrá el código con `function almacenar<T>`]*

"Una función que sirve para cualquier tipo. TypeScript infiere el tipo automáticamente. Sin duplicar código."

*[Completá con la solución — mostrá las cajas animadas de la forja]*

**Clases (nivel 15):**
"Nivel 15 — clases. El robot tiene nombre, energía, contador de piezas. Puede ensamblar, recargar, dar un reporte. Exactamente como modelarían un cliente de API en sus frameworks."

**Async/await (nivel 19):**
"Y nivel 19 — async/await. Cuatro robots trabajando en paralelo con Promise.all."

*[Mostrá la mecánica de las 4 barras de progreso corriendo simultáneas]*

"¿Ven cómo las 4 barras avanzan al mismo tiempo? Eso es el paralelismo. En Playwright cuando ejecutan tests en múltiples workers — esto es lo que pasa internamente."

---

## 🏆 EL BOSS FINAL — Nivel 27 (3 min)

*[Saltá al nivel 27]*

"Y el nivel final. El boss. Un sistema de gestión de inventario que usa TODO lo que aprendieron:"

*[Mostrá el starterCode — que vean la lista de requerimientos]*

- "Clase genérica `Almacen<T>`"
- "Pattern `Result<T, E>` para errores sin excepciones"
- "Utility types para las vistas públicas"
- "Todo async con `Promise.all`"

"No voy a resolverlo en vivo — lo dejan para ustedes."

*[Si tenés tiempo: pegá la solution y mostrá la celebración final]*

*[Los 4 módulos encendiéndose + 🏆 TypeScript Quest completado]*

"Cuando completan esto, saben TypeScript. No 'algo de TypeScript'. TypeScript de verdad."

---

## 🎬 CIERRE (2 min)

*[Salí de la pantalla compartida]*

"Bien. Lo que vieron hoy es real — está en producción, lo pueden abrir en cualquier browser, no instalan nada."

"¿Qué viene ahora? Estoy agregando lecciones antes de cada ejercicio — un video corto mío explicando el concepto con la metáfora de la fábrica, antes de que entren al editor. Como Duolingo pero para TypeScript y para QA."

"Si les gustó esto, díganme en el chat. Y si conocen a alguien que está empezando con TypeScript o con automatización — mándenle el link."

*[Link del juego si está deployado, o "proximamente"]*

"La semana que viene seguimos. Cuídense."

---

## 📋 NOTAS TÉCNICAS

**Si algo falla en vivo:**
- "Esto está en construcción activa — lo bueno de los lives es ver cosas reales"
- Usá el botón de **solución** (ícono en la toolbar del editor) para llenar el código rápido
- Si el compilador tarda: "el primer Deploy siempre tarda porque carga el engine de TypeScript"

**Atajos útiles:**
- Botón solución → carga el código correcto en el editor
- Deploy → compila y valida
- Siguiente nivel → aparece automáticamente al completar

**Niveles más visualmente impresionantes para el live:**
- Nivel 6 (energy bar) — la barra drenándose
- Nivel 7 (grid) — la grilla iluminándose
- Nivel 18 (maze) — el laberinto navegándose
- Nivel 19 (parallel) — 4 barras simultáneas
- Nivel 27 (boss) — la celebración final
