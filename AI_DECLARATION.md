# Declaración de Uso de Inteligencia Artificial (AI_DECLARATION.md)

En cumplimiento de los requerimientos de la **Actividad Integradora 2: TaskManager (Programación III)**, se detalla a continuación el uso real, ético y documentado de la Inteligencia Artificial durante el desarrollo del proyecto.

---

## 1. Herramienta de IA Utilizada y Momentos de Uso

Para este proyecto **únicamente se utilizó Antigravity con el modelo Gemini 3.8 Flash**. No se empleó ninguna otra herramienta externa (ni ChatGPT, Claude ni Copilot).

La herramienta intervino en los siguientes momentos específicos del desarrollo:

1. **Diseño de Interfaz de Usuario (UI) y Maquetación Responsiva:**
   - Creación y definición de la propuesta estética (minimalismo moderno), paleta de colores y variables CSS.
   - Disposición del contenido visual y maquetación semántica estructurada (dashboard superior, controles de filtrado/búsqueda, formulario y lista de tareas).
   - Implementación del diseño adaptable (*responsive design*) mediante CSS Grid y Flexbox.
2. **Tutoría Técnica y Planificación por Fases:**
   - Estructuración progresiva del proyecto (planificación de fases, arquitectura modular ES6, separación de responsabilidades entre módulos).
   - Revisión puntual de código y orientación conceptual para el manejo de CRUD, persistencia en `localStorage`, algoritmos de ordenamiento/filtrado y consumo asíncrono de JSONPlaceholder con `fetch`/`async`/`await`.
3. **Generación de la Documentación del Proyecto:**
   - Redacción técnica y estructuración completa del archivo `README.md`.
   - Generación y formalización de este documento de autoría y transparencia (`AI_DECLARATION.md`).

---

## 2. Prompts Clave Utilizados Durante el Desarrollo

Los siguientes prompts reales fueron extraídos directamente de la interacción con el asistente durante el proyecto:

### Prompt 1: Diseño de la interfaz de usuario (UI)
> **Instrucción:**
> ```text
> Quiero diseñar una interfaz de usuario moderna, minimalista, atractiva y funcional para una aplicación web llamada TaskManager, destinada a gestionar tareas personales.
> 
> El diseño debe tener una estética anime minimalista, con una apariencia limpia, ligera y profesional, evitando sobrecargar la interfaz con demasiados elementos decorativos. La prioridad es que sea visualmente agradable, fácil de utilizar y que mantenga una buena legibilidad.
> 
> La interfaz debe incluir un dashboard con estadísticas de tareas totales, pendientes y completadas; un formulario para crear y editar tareas; una lista de tareas con opciones para completarlas y eliminarlas; búsqueda dinámica por título; filtros por estado; y opciones para ordenar las tareas por fecha de creación o prioridad.
> 
> Utiliza HTML5 y CSS3, con una estructura sencilla y adaptable a diferentes tamaños de pantalla. La aplicación debe desarrollarse con JavaScript Vanilla ES6+, sin frameworks como React, Vue o Angular.
> 
> Propón una paleta de colores coherente, componentes visuales consistentes, estados vacíos, notificaciones y una distribución clara de los elementos. El resultado debe ser suficientemente sencillo para que un estudiante pueda implementarlo y comprenderlo como parte de un proyecto académico.
> 
> El objetivo de esta solicitud es obtener una propuesta de diseño visual que sirva como referencia para desarrollar la interfaz de TaskManager, manteniendo un equilibrio entre estética, funcionalidad y simplicidad.
> ```

### Prompt 2: Planificación de la implementación y guía de desarrollo
> **Instrucción:**
> ```text
> Actúa como tutor técnico para ayudarme a desarrollar una aplicación web llamada TaskManager como parte de una actividad académica. Mi objetivo es escribir y comprender personalmente el código, por lo que necesito una guía de implementación progresiva, no que desarrolles el proyecto completo por mí.
> 
> La aplicación debe utilizar HTML5, CSS3, JavaScript Vanilla ES6+, manipulación del DOM, eventos `addEventListener`, módulos nativos ES6 mediante `import` y `export`, consumo de una API REST mediante `fetch`, `async/await` y `try/catch`, y persistencia con `localStorage`. No se deben utilizar frameworks ni librerías externas para implementar la lógica principal.
> 
> La aplicación debe permitir crear, editar y eliminar tareas, cambiar su estado, validar campos obligatorios, buscar por título, filtrar por estado, ordenar por fecha de creación o prioridad y actualizar estadísticas en tiempo real. También debe consumir JSONPlaceholder para importar tareas cuando `localStorage` no contenga datos guardados, gestionar errores de conexión y continuar funcionando sin internet cuando existan datos locales.
> 
> Organiza el desarrollo en fases ordenadas, desde la planificación y la estructura de archivos hasta el almacenamiento, el CRUD, los filtros y las estadísticas, la integración con la API y las pruebas finales. Para cada fase, explica sus objetivos, los archivos involucrados, las responsabilidades de cada módulo, las tareas que debo realizar y los criterios que permiten verificar que funciona correctamente.
> 
> Quiero que actúes como tutor durante el proceso: revisa el código que te comparta, identifica errores concretos, explica por qué ocurren y propón cambios puntuales. No generes todos los archivos ni sustituyas mi implementación por una solución completa. Evita duplicar funciones que ya existan y respeta las decisiones arquitectónicas acordadas.
> ```

---

## 3. Errores Identificados en las Sugerencias de la IA y Ajustes Manuales

Durante el desarrollo, las respuestas y códigos generados por la IA requirieron revisiones y ajustes manuales obligatorios para adecuarse al proyecto:

1. **Propensión a Soluciones Sobrecomplejas (*Over-engineering*):**
   - **Problema:** En repetidas ocasiones la IA propuso implementaciones innecesariamente complicadas, con capas de abstracción redundantes y estructuras sobrediseñadas que excedían el alcance pedagógico y funcional de un proyecto en JavaScript Vanilla.
   - **Ajuste:** Se intervino manualmente para simplificar el flujo hacia funciones directas, comprensibles y fáciles de mantener.

2. **Mutación Directa de Arreglos en `sort()`:**
   - **Problema:** La IA aplicó inicialmente `tasks.sort()` directamente sobre el arreglo original de datos. Como `.sort()` muta el arreglo *in-place*, alteraba el orden almacenado en memoria y rompía el comportamiento de los filtros combinados.
   - **Ajuste:** Se corrigió en `js/tasks.js` empleando una copia superficial inmutable con el operador de propagación: `[...list].sort(...)`.

3. **Manejo Incorrecto de Estados de Error en `fetch()`:**
   - **Problema:** La IA asumió que cualquier código de error HTTP (como `404` o `500`) era capturado automáticamente por el bloque `catch`. Sin embargo, `fetch()` solo rechaza la promesa ante fallos de red.
   - **Ajuste:** Se agregó en `js/api.js` la verificación explícita `if (!response.ok)` y el formateo de notificaciones amigables diferenciando caídas de red de errores de servidor.

4. **Duplicación de Tareas al Sincronizar con la API:**
   - **Problema:** La propuesta inicial realizaba una concatenación simple de arrays, lo que duplicaba los datos de la API cada vez que se iniciaba o recargaba la aplicación.
   - **Ajuste:** Se implementó una verificación con `Set` basada en los IDs existentes para asegurar que solo se importen registros no presentes previamente en `localStorage`.

5. **Desacoplamiento de las Métricas Globales frente a Filtros Visuales:**
   - **Problema:** La IA intentó calcular las métricas del dashboard a partir de la lista de tareas ya filtrada por búsqueda o estado, haciendo que los totales variaran erróneamente al buscar o filtrar.
   - **Ajuste:** Se desacopló la función en `refreshUI()`, de modo que `totalTask()` siempre procesa la totalidad de las tareas almacenadas mientras que el renderizado procesa únicamente la vista filtrada.

6. **Sanitización de Datos en el DOM contra XSS:**
   - **Problema:** La IA generaba la inserción de datos en plantillas literales dentro de `innerHTML` sin desinfectar las entradas de usuario.
   - **Ajuste:** Se incorporó la función `escapeHTML()` en `js/dom.js` para neutralizar caracteres reservados y prevenir inyecciones de código malicioso.
