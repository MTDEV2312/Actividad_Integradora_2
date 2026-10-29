# TaskManager — Actividad Integradora 2

Aplicación web interactiva para la gestión de tareas (*TaskManager*) desarrollada en **JavaScript Vanilla (ES6+)** con soporte completo para funcionamiento *offline*, persistencia de datos en el navegador mediante la **Web Storage API (`localStorage`)**, consumo asíncrono de APIs REST externas y una arquitectura modular nativa basada en componentes desacoplados.

> **Materia:** Programación III  
> **Institución:** Universidad ECOTEC  
> **Entrega:** Actividad Integradora 2  

---

## 📋 Tabla de Contenidos
- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Funcionalidades Principales](#-funcionalidades-principales)
  - [1. Gestión CRUD y Validaciones](#1-gestión-crud-y-validaciones)
  - [2. Filtros y Búsqueda Dinámica](#2-filtros-y-búsqueda-dinámica)
  - [3. Ordenamiento Avanzado](#3-ordenamiento-avanzado)
  - [4. Dashboard de Métricas en Tiempo Real](#4-dashboard-de-métricas-en-tiempo-real)
  - [5. Consumo de API REST y Persistencia](#5-consumo-de-api-rest-y-persistencia)
- [Arquitectura Técnica (Opción A — Módulos ES6)](#-arquitectura-técnica-opción-a--módulos-es6)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Ejecución Local](#-instalación-y-ejecución-local)
- [Verificación de Persistencia en DevTools](#-verificación-de-persistencia-en-devtools)
- [Declaración de Inteligencia Artificial](#-declaración-de-inteligencia-artificial)

---

## 🚀 Descripción del Proyecto

El objetivo de este proyecto es demostrar el dominio práctico de JavaScript moderno sin depender de bibliotecas ni frameworks externos (sin React, Vue, Angular o jQuery). La aplicación permite administrar el ciclo de vida completo de tareas diarias, garantizando que el usuario pueda trabajar tanto con conexión a internet como de manera 100% desconectada (*offline*).

---

## ✨ Funcionalidades Principales

### 1. Gestión CRUD y Validaciones
* **Crear:** Registro de nuevas tareas con título, descripción y prioridad (`high`, `medium`, `low`).
* **Leer:** Presentación limpia de tareas con indicadores visuales de prioridad y estado.
* **Editar:** Posibilidad de modificar título, descripción y prioridad *inline* de tareas existentes.
* **Marcar Completada:** Alternancia de estado completada/pendiente con actualización visual inmediata.
* **Eliminar:** Borrado individual de tareas con confirmación interactiva.
* **Validaciones estrictas en JS:** Control de longitud mínima (3 caracteres) y máxima (100 caracteres) en el título, validación de longitud máxima en la descripción (500 caracteres), verificación de campos vacíos y desinfección contra inyecciones XSS mediante sanitización de cadenas.

### 2. Filtros y Búsqueda Dinámica
* **Filtro por Estado:** Visualización selectiva entre *Todas*, *Pendientes* y *Completadas*.
* **Búsqueda en Tiempo Real:** Filtrado predictivo e instantáneo mediante el evento `input`, evaluando coincidencias sin distinguir entre mayúsculas y minúsculas (`toLowerCase`, `includes`).

### 3. Ordenamiento Avanzado
* **Por Fecha:** Ordenamiento cronológico descendente (*Más recientes*) y ascendente (*Más antiguas*).
* **Por Prioridad:** Función comparadora ponderada que clasifica las tareas según criticidad (`Alta > Media > Baja`).
* **Inmutabilidad:** Todos los ordenamientos se efectúan sobre copias superficiales (`[...tasks].sort()`), previniendo mutaciones accidentales del estado original.

### 4. Dashboard de Métricas en Tiempo Real
* Contadores reactivos en la parte superior que calculan y muestran en vivo:
  * **Total** de tareas registradas.
  * Tareas **Pendientes**.
  * Tareas **Completadas**.
* El dashboard refleja el estado global de la base de datos local de manera independiente a los filtros visuales aplicados en pantalla.

### 5. Consumo de API REST y Persistencia
* **Carga Inicial:** Consulta inicial a [JSONPlaceholder](https://jsonplaceholder.typicode.com/todos) (`/todos`) mediante `fetch()` y `async/await`. Si `localStorage` se encuentra vacío, importa automáticamente tareas remotas normalizadas sin duplicar registros.
* **Manejo Resiliente de Errores:** Estructura `try/catch` que intercepta fallos de conectividad (`offline`, `TypeError`) y fallos HTTP de servidor (códigos `4xx` y `5xx`), notificando al usuario mediante mensajes contextuales accesibles (`role="status"`, `aria-live="polite"`).
* **Persistencia Local:** Sincronización transparente con `localStorage.setItem()` y `JSON.parse(localStorage.getItem())`, permitiendo persistencia permanente entre recargas y sesiones.

---

## 🏛️ Arquitectura Técnica (Opción A — Módulos ES6)

La aplicación fue desarrollada implementando el componente de investigación técnica **Opción A: Arquitectura Modular ES6**, organizando el sistema en módulos independientes y altamente cohesivos:

```
js/
├── storage.js   # Encapsula el acceso a localStorage, serialización y control de excepciones
├── tasks.js     # Lógica pura de negocio: modelos, CRUD, filtros, ordenamiento y métricas
├── api.js       # Servicio cliente HTTP asíncrono para JSONPlaceholder y deduplicación
├── dom.js       # Manipulación del DOM, renderizado, validación y notificaciones accesibles
└── main.js      # Orquestador principal, inicialización y vinculación de eventos del usuario
```

* **Separación de Responsabilidades:** La vista (`dom.js`) no interactúa directamente con `localStorage`, ni la lógica de datos (`tasks.js`) manipula elementos HTML.
* **Reutilización y Mantenibilidad:** Cada módulo expone funciones específicas mediante `export` e integra dependencias con `import` nativo de JavaScript.

---

## 📂 Estructura del Proyecto

```text
Actividad_Integradora_2/
├── index.html            # Maquetación semántica y accesible (HTML5)
├── README.md             # Documentación exhaustiva del proyecto
├── AI_DECLARATION.md     # Declaración ética de herramientas de IA y prompts utilizados
├── css/
│   └── styles.css        # Estilos modernos con variables CSS, Flexbox, Grid y modo responsive
└── js/
    ├── api.js            # Módulo de consumo de API REST externa
    ├── dom.js            # Módulo de manipulación y actualización del DOM
    ├── main.js           # Módulo principal y orquestador de eventos
    ├── storage.js        # Módulo de persistencia local (localStorage)
    └── tasks.js          # Módulo de lógica de negocio y operaciones de datos
```

---

## 💻 Instalación y Ejecución Local

Dado que la aplicación utiliza módulos nativos de JavaScript (`<script type="module">`), por políticas de seguridad de CORS de los navegadores modernos **debe servirse mediante un servidor HTTP local** (no abriendo directamente con el protocolo `file://`).

### Opción 1: VS Code Live Server (Recomendado)
1. Instala la extensión **Live Server** en Visual Studio Code.
2. Haz clic derecho sobre el archivo `index.html`.
3. Selecciona **"Open with Live Server"**.

### Opción 2: Node.js (npx serve / http-server)
```bash
# Con npx serve
npx serve .

# O con http-server
npx http-server -p 3000
```

### Opción 3: Python
```bash
# Python 3
python -m http.server 8000
```
Luego abre tu navegador en `http://localhost:8000`.

---

## 🔍 Verificación de Persistencia en DevTools

Para constatar la persistencia de las tareas en el navegador:

1. Abre la aplicación en Google Chrome, Microsoft Edge o Mozilla Firefox.
2. Presiona `F12` o clic derecho y selecciona **Inspeccionar**.
3. Dirígete a la pestaña **Application** (o **Almacenamiento** en Firefox).
4. En el panel izquierdo, despliega **Storage > Local Storage**.
5. Selecciona el origen del servidor local (por ejemplo `http://localhost:5500` o `http://127.0.0.1:8000`).
6. Observa la clave `taskmanager_tasks`: contendrá la cadena JSON serializada con las tareas creadas, editadas o importadas.

---

## 🤖 Declaración de Inteligencia Artificial

De acuerdo con las directrices de autoría y transparencia académica, el desarrollo contó con el soporte de **Antigravity (Gemini 3.8 Flash)** para el diseño de la interfaz de usuario (UI, paleta de colores y maquetación responsive), la estructuración modular ES6 y la redacción de la documentación (`README.md` y `AI_DECLARATION.md`). El detalle exhaustivo, los prompts clave utilizados y las correcciones de sobrecomplejidad y lógica aplicadas se encuentran documentados en el archivo [AI_DECLARATION.md](AI_DECLARATION.md).
