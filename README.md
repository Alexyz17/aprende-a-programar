# Aprende a Programar

Cursos de programación **gratuitos y abiertos** en español: desde tu primer programa hasta desplegar aplicaciones en la nube. Sin registro, sin pagos, sin publicidad y sin cookies de seguimiento.

**Web:** https://alexvillar10.gitlab.io/aprende-a-programar/

- 38 cursos: Programar desde cero, HTML y CSS, Tailwind CSS, JavaScript, TypeScript, React, Next.js, Vue, PHP, Laravel, Eloquent, Laravel + Inertia + React, APIs REST, Node.js, Python, Machine Learning, SQL, PostgreSQL, Redis, Git, Linux, Docker, Kubernetes, GitHub Actions, microservicios, IA, n8n, Kotlin, Swift, testing, algoritmos y seguridad web.
- 9 rutas de aprendizaje (frontend, backend PHP, full stack Laravel + React, DevOps, datos e IA…).
- 24 juegos para practicar: tests, completar código, ordenar bloques y "adivina la salida".
- Progreso y récords guardados solo en el navegador.

## Tecnología

| Pieza | Uso |
| --- | --- |
| React 19 + TypeScript | Interfaz |
| Vite | Desarrollo y build |
| Tailwind CSS 4 | Estilos, tema claro y oscuro |
| marked | Lecciones escritas en Markdown |
| Router propio (History API) | Navegación sin dependencias, con soporte de subdirectorio |
| GitLab CI + GitLab Pages | Publicación automática y gratuita |

No hay servidor ni base de datos: es una web estática. Tras el build, `scripts/postbuild.mjs` genera una página HTML por ruta con su título y descripción (mejor SEO y enlaces compartibles), el `sitemap.xml`, el `robots.txt` y el `404.html`.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera dist/
npm run preview
```

## Estructura

```text
src/
├── content/            # lecciones en Markdown (formato recomendado)
├── Pages/Lecciones/    # lecciones heredadas escritas en TSX
├── Pages/              # inicio, cursos, rutas, juegos, progreso…
├── data/
│   ├── courses.ts      # catálogo de cursos
│   ├── paths.ts        # rutas de aprendizaje
│   └── games.ts        # juegos y preguntas
├── components/         # tarjetas, Markdown, bloques de código…
├── layouts/            # AppLayout y LessonLayout
├── lib/                # router, progreso (localStorage)
└── site.ts             # nombre, URL y licencia de la web
```

## Cómo añadir o mejorar una lección

1. Crea `src/content/mi-curso.md`. Empieza con `# Título` y usa `## Apartado` para cada sección: cada `##` aparece en el índice lateral.
2. Añade el curso a `src/data/courses.ts` con `page: md('mi-curso', () => import('@/content/mi-curso.md?raw'))`.
3. Opcional: inclúyelo en alguna ruta de `src/data/paths.ts` y crea un juego en `src/data/games.ts`.

Convenciones del Markdown:

- Enlaces internos con ruta absoluta: `[Docker](/lecciones/docker)`.
- Bloques de código con lenguaje: ` ```python `.
- Avisos destacados: `> **Consejo:**`, `> **Atención:**`, `> **Nota:**`, `> **Importante:**`, `> **Ejercicio:**`, `> **Reto:**`.
- Lenguaje claro, explicando desde cero y con ejemplos que funcionen.

¿Has encontrado un error? Abre una incidencia o una merge request.

## Licencia

- Contenido de los cursos: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.es).
- Código de la plataforma: MIT.

Proyecto de [Alex Villar Gracia](https://alexvillar10.gitlab.io). Es una web estática, sin servidor ni base de datos, pensada para que el contenido sea gratuito y esté siempre disponible.
