import type { ComponentType } from 'react';
import { lazy, createElement } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
    Terminal, Server, Code2, Brain, Zap, Shield, Smartphone, Globe, Database,
    GitBranch, Cloud, Cpu, Package, Layers, Lightbulb, Palette, FlaskConical, Network,
} from 'lucide-react';

export type Level = 'Básico' | 'Intermedio' | 'Avanzado';

export interface Course {
    slug: string;
    title: string;
    description: string;
    duration: string;
    lessons: number;
    level: Level;
    category: string;
    icon: LucideIcon;
    iconColor: string;
    bg: string;
    page: ComponentType;
}

const p = (loader: () => Promise<{ default: ComponentType }>) => lazy(loader);

/** Lección escrita en Markdown: src/content/<slug>.md */
const md = (slug: string, loader: () => Promise<{ default: string }>) =>
    lazy(async () => {
        const [{ default: text }, { default: MarkdownLesson }] = await Promise.all([loader(), import('@/components/MarkdownLesson')]);
        return { default: () => createElement(MarkdownLesson, { slug, md: text }) };
    });

export const CATEGORIES = [
    'Empieza aquí', 'Web', 'Linux', 'PHP / Laravel', 'JavaScript', 'Frontend', 'Python',
    'Bases de datos', 'Git', 'DevOps', 'Servidores', 'Seguridad', 'Arquitectura',
    'Inteligencia Artificial', 'Automatización', 'Mobile',
] as const;

/**
 * Catálogo completo. El orden dentro de cada categoría es el orden recomendado.
 * Todas las lecciones son gratuitas y de libre acceso.
 */
export const COURSES: Course[] = [
    // ── Empieza aquí ──
    { slug: 'programar-desde-cero', title: 'Programar desde cero', description: 'Qué es programar, cómo piensa un ordenador, variables, condiciones, bucles y funciones explicados sin dar nada por sabido.', duration: '2h 30min', lessons: 10, level: 'Básico', category: 'Empieza aquí', icon: Lightbulb, iconColor: 'text-amber-400', bg: 'bg-amber-500/10', page: md('programar-desde-cero', () => import('@/content/programar-desde-cero.md?raw')) },
    { slug: 'algoritmos', title: 'Algoritmos y estructuras de datos', description: 'Complejidad, arrays, mapas, pilas, colas, árboles, búsqueda, ordenación, recursividad y cómo enfrentarte a un problema de entrevista.', duration: '4h 00min', lessons: 14, level: 'Intermedio', category: 'Empieza aquí', icon: Network, iconColor: 'text-amber-400', bg: 'bg-amber-500/10', page: md('algoritmos', () => import('@/content/algoritmos.md?raw')) },
    // ── Web ──
    { slug: 'html-css', title: 'HTML y CSS desde cero', description: 'Estructura una página con HTML semántico y dale estilo con CSS: box model, Flexbox, Grid, diseño responsive y accesibilidad.', duration: '4h 00min', lessons: 16, level: 'Básico', category: 'Web', icon: Palette, iconColor: 'text-pink-400', bg: 'bg-pink-500/10', page: md('html-css', () => import('@/content/html-css.md?raw')) },
    { slug: 'testing', title: 'Testing para desarrolladores web', description: 'Por qué y qué testear, tests unitarios y de integración con Vitest, PHPUnit y Pest, mocks, testing de componentes y TDD.', duration: '3h 30min', lessons: 14, level: 'Intermedio', category: 'Web', icon: FlaskConical, iconColor: 'text-pink-400', bg: 'bg-pink-500/10', page: md('testing', () => import('@/content/testing.md?raw')) },
    // ── Linux ──
    { slug: 'linux-esencial', title: 'Introducción a Linux', description: 'Aprende a moverte por la terminal, gestionar archivos y entender el sistema operativo más usado en servidores.', duration: '2h 30min', lessons: 12, level: 'Básico', category: 'Linux', icon: Terminal, iconColor: 'text-orange-400', bg: 'bg-orange-500/10', page: p(() => import('@/Pages/Lecciones/LinuxEsencial')) },
    { slug: 'comandos-linux', title: 'Comandos Linux esenciales', description: 'Domina los comandos que usarás cada día: grep, awk, sed, find, pipes y más.', duration: '1h 45min', lessons: 9, level: 'Básico', category: 'Linux', icon: Terminal, iconColor: 'text-orange-400', bg: 'bg-orange-500/10', page: p(() => import('@/Pages/Lecciones/ComandosLinux')) },
    { slug: 'shell-scripting', title: 'Shell scripting con Bash', description: 'Automatiza tareas repetitivas escribiendo tus propios scripts de shell.', duration: '3h 10min', lessons: 15, level: 'Intermedio', category: 'Linux', icon: Terminal, iconColor: 'text-orange-400', bg: 'bg-orange-500/10', page: p(() => import('@/Pages/Lecciones/ShellScripting')) },
    // ── PHP / Laravel ──
    { slug: 'php-basico', title: 'PHP desde cero', description: 'Sintaxis, tipos, arrays, funciones, formularios, sesiones, POO y Composer: la base para entender Laravel.', duration: '3h 30min', lessons: 15, level: 'Básico', category: 'PHP / Laravel', icon: Code2, iconColor: 'text-red-400', bg: 'bg-red-500/10', page: md('php-basico', () => import('@/content/php-basico.md?raw')) },
    { slug: 'laravel', title: 'Primeros pasos con Laravel', description: 'Crea tu primera aplicación web con el framework PHP más popular. Rutas, controladores y Eloquent.', duration: '3h 15min', lessons: 18, level: 'Básico', category: 'PHP / Laravel', icon: Code2, iconColor: 'text-red-400', bg: 'bg-red-500/10', page: p(() => import('@/Pages/Lecciones/LaravelPrimeros')) },
    { slug: 'eloquent', title: 'Eloquent ORM a fondo', description: 'Relaciones, scopes, accessors, eager loading y todo lo que necesitas para dominar la capa de datos de Laravel.', duration: '4h 30min', lessons: 22, level: 'Avanzado', category: 'PHP / Laravel', icon: Code2, iconColor: 'text-red-400', bg: 'bg-red-500/10', page: md('eloquent', () => import('@/content/eloquent.md?raw')) },
    { slug: 'apis-rest', title: 'APIs REST con Laravel', description: 'Diseña, construye y documenta APIs profesionales con validación, recursos, autenticación con Sanctum y versionado.', duration: '5h 00min', lessons: 25, level: 'Avanzado', category: 'PHP / Laravel', icon: Code2, iconColor: 'text-red-400', bg: 'bg-red-500/10', page: md('apis-rest', () => import('@/content/apis-rest.md?raw')) },
    // ── Inteligencia Artificial ──
    { slug: 'ia-programacion', title: 'Programación con IA', description: 'Integra modelos de lenguaje en tus proyectos. APIs, prompts, agentes y automatizaciones con IA.', duration: '5h 45min', lessons: 28, level: 'Avanzado', category: 'Inteligencia Artificial', icon: Brain, iconColor: 'text-purple-400', bg: 'bg-purple-500/10', page: p(() => import('@/Pages/Lecciones/IAProgramacion')) },
    { slug: 'fine-tuning', title: 'Fine-tuning de modelos', description: 'Cuándo ajustar un modelo y cuándo no, cómo preparar los datos y cómo entrenar y evaluar un modelo con LoRA.', duration: '4h 00min', lessons: 18, level: 'Avanzado', category: 'Inteligencia Artificial', icon: Brain, iconColor: 'text-purple-400', bg: 'bg-purple-500/10', page: md('fine-tuning', () => import('@/content/fine-tuning.md?raw')) },
    // ── Servidores ──
    { slug: 'maquinas-virtuales', title: 'Máquinas virtuales con Linux', description: 'Configura y gestiona VMs con VirtualBox: redes, snapshots, SSH y entornos reproducibles con Vagrant.', duration: '3h 30min', lessons: 16, level: 'Intermedio', category: 'Servidores', icon: Server, iconColor: 'text-blue-400', bg: 'bg-blue-500/10', page: md('maquinas-virtuales', () => import('@/content/maquinas-virtuales.md?raw')) },
    { slug: 'docker', title: 'Docker desde cero', description: 'Contenedores, imágenes, volúmenes y Docker Compose explicados paso a paso.', duration: '4h 50min', lessons: 24, level: 'Intermedio', category: 'Servidores', icon: Server, iconColor: 'text-blue-400', bg: 'bg-blue-500/10', page: p(() => import('@/Pages/Lecciones/Docker')) },
    // ── Automatización ──
    { slug: 'n8n', title: 'Automatiza con n8n', description: 'Crea flujos de trabajo automáticos sin código. Conecta apps, APIs e IA en minutos.', duration: '3h 50min', lessons: 20, level: 'Intermedio', category: 'Automatización', icon: Zap, iconColor: 'text-yellow-400', bg: 'bg-yellow-500/10', page: p(() => import('@/Pages/Lecciones/N8n')) },
    // ── Seguridad ──
    { slug: 'seguridad-web', title: 'Seguridad básica en la web', description: 'Entiende las vulnerabilidades más comunes y cómo proteger tus aplicaciones desde el principio.', duration: '2h 10min', lessons: 10, level: 'Básico', category: 'Seguridad', icon: Shield, iconColor: 'text-emerald-400', bg: 'bg-emerald-500/10', page: p(() => import('@/Pages/Lecciones/SeguridadWeb')) },
    // ── Python ──
    { slug: 'python-basico', title: 'Python desde cero', description: 'Variables, tipos, listas, diccionarios, funciones, f-strings y módulos. Todo para empezar en Python.', duration: '3h 00min', lessons: 14, level: 'Básico', category: 'Python', icon: Code2, iconColor: 'text-yellow-400', bg: 'bg-yellow-500/10', page: p(() => import('@/Pages/Lecciones/PythonBasico')) },
    { slug: 'python-avanzado', title: 'Python avanzado', description: 'Decoradores, context managers, generators, asyncio y type hints para código profesional.', duration: '4h 30min', lessons: 20, level: 'Avanzado', category: 'Python', icon: Code2, iconColor: 'text-yellow-400', bg: 'bg-yellow-500/10', page: p(() => import('@/Pages/Lecciones/PythonAvanzado')) },
    { slug: 'machine-learning', title: 'Machine Learning con Python', description: 'pandas, scikit-learn, validación, métricas y cómo llevar un modelo a producción con una API.', duration: '5h 00min', lessons: 22, level: 'Avanzado', category: 'Python', icon: Cpu, iconColor: 'text-rose-400', bg: 'bg-rose-500/10', page: md('machine-learning', () => import('@/content/machine-learning.md?raw')) },
    // ── JavaScript ──
    { slug: 'javascript-moderno', title: 'JavaScript moderno', description: 'Destructuring, async/await, módulos ES, Fetch API y las novedades del lenguaje.', duration: '3h 15min', lessons: 16, level: 'Intermedio', category: 'JavaScript', icon: Zap, iconColor: 'text-yellow-300', bg: 'bg-yellow-500/10', page: p(() => import('@/Pages/Lecciones/JavaScriptModerno')) },
    { slug: 'typescript-basico', title: 'TypeScript desde cero', description: 'Tipos, interfaces, generics y tsconfig. La base para escribir JavaScript con seguridad de tipos.', duration: '2h 45min', lessons: 13, level: 'Básico', category: 'JavaScript', icon: Code2, iconColor: 'text-yellow-300', bg: 'bg-yellow-500/10', page: p(() => import('@/Pages/Lecciones/TypeScriptBasico')) },
    { slug: 'node-express', title: 'Node.js y Express', description: 'Crea servidores y APIs con JavaScript: módulos, npm, Express, middleware, validación, base de datos y despliegue.', duration: '3h 45min', lessons: 16, level: 'Intermedio', category: 'JavaScript', icon: Server, iconColor: 'text-yellow-300', bg: 'bg-yellow-500/10', page: md('node-express', () => import('@/content/node-express.md?raw')) },
    // ── Git ──
    { slug: 'git-esencial', title: 'Git esencial', description: 'Init, add, commit, push, ramas, merge y flujo de trabajo en equipo.', duration: '2h 15min', lessons: 11, level: 'Básico', category: 'Git', icon: GitBranch, iconColor: 'text-orange-400', bg: 'bg-orange-500/10', page: p(() => import('@/Pages/Lecciones/GitEsencial')) },
    // ── Mobile ──
    { slug: 'kotlin-android', title: 'Kotlin para Android', description: 'Apps Android con Kotlin, Jetpack Compose, ViewModel, Room, Coroutines y Material 3.', duration: '6h 00min', lessons: 32, level: 'Intermedio', category: 'Mobile', icon: Smartphone, iconColor: 'text-green-400', bg: 'bg-green-500/10', page: p(() => import('@/Pages/Lecciones/KotlinAndroid')) },
    { slug: 'swift-ios', title: 'Swift para iOS', description: 'Apps iOS modernas con SwiftUI, MVVM y SwiftData.', duration: '5h 30min', lessons: 28, level: 'Intermedio', category: 'Mobile', icon: Smartphone, iconColor: 'text-green-400', bg: 'bg-green-500/10', page: p(() => import('@/Pages/Lecciones/SwiftIOS')) },
    // ── Frontend ──
    { slug: 'react-avanzado', title: 'React avanzado', description: 'Hooks avanzados, TanStack Query, estado global, Server Components y optimización de rendimiento.', duration: '5h 00min', lessons: 26, level: 'Avanzado', category: 'Frontend', icon: Globe, iconColor: 'text-cyan-400', bg: 'bg-cyan-500/10', page: p(() => import('@/Pages/Lecciones/ReactAvanzado')) },
    { slug: 'nextjs', title: 'Next.js con App Router', description: 'Server Components, rutas, carga de datos, Server Actions, middleware, SEO y despliegue.', duration: '4h 30min', lessons: 22, level: 'Avanzado', category: 'Frontend', icon: Globe, iconColor: 'text-cyan-400', bg: 'bg-cyan-500/10', page: md('nextjs', () => import('@/content/nextjs.md?raw')) },
    { slug: 'vuejs', title: 'Vue.js 3 con Composition API', description: 'Reactividad, componentes, composables, Vue Router y Pinia para proyectos reales.', duration: '4h 00min', lessons: 20, level: 'Intermedio', category: 'Frontend', icon: Globe, iconColor: 'text-cyan-400', bg: 'bg-cyan-500/10', page: md('vuejs', () => import('@/content/vuejs.md?raw')) },
    // ── DevOps ──
    { slug: 'github-actions', title: 'GitHub Actions: CI/CD', description: 'Workflows, jobs, secrets, matrices y despliegue automático con GitHub Actions.', duration: '4h 00min', lessons: 20, level: 'Intermedio', category: 'DevOps', icon: Cloud, iconColor: 'text-sky-400', bg: 'bg-sky-500/10', page: p(() => import('@/Pages/Lecciones/GitHubActions')) },
    { slug: 'kubernetes', title: 'Kubernetes desde cero', description: 'Pods, Deployments, Services, Ingress, ConfigMaps, Secrets y Helm para orquestar contenedores.', duration: '5h 00min', lessons: 24, level: 'Avanzado', category: 'DevOps', icon: Package, iconColor: 'text-sky-400', bg: 'bg-sky-500/10', page: md('kubernetes', () => import('@/content/kubernetes.md?raw')) },
    // ── Bases de datos ──
    { slug: 'sql-basico', title: 'SQL desde cero', description: 'Diseña tablas y consulta datos: SELECT, filtros, JOIN, agregaciones, claves, índices y transacciones con ejemplos prácticos.', duration: '3h 30min', lessons: 15, level: 'Básico', category: 'Bases de datos', icon: Database, iconColor: 'text-violet-400', bg: 'bg-violet-500/10', page: md('sql-basico', () => import('@/content/sql-basico.md?raw')) },
    { slug: 'postgresql-avanzado', title: 'PostgreSQL avanzado', description: 'Índices, EXPLAIN ANALYZE, CTEs, window functions, particionado y búsqueda semántica con pgvector.', duration: '4h 30min', lessons: 22, level: 'Avanzado', category: 'Bases de datos', icon: Database, iconColor: 'text-violet-400', bg: 'bg-violet-500/10', page: p(() => import('@/Pages/Lecciones/PostgreSQLAvanzado')) },
    { slug: 'redis-cache', title: 'Redis: caché y mensajería', description: 'Estructuras de datos, patrones de caché, expiración, pub/sub, streams y colas.', duration: '3h 30min', lessons: 18, level: 'Intermedio', category: 'Bases de datos', icon: Database, iconColor: 'text-violet-400', bg: 'bg-violet-500/10', page: md('redis-cache', () => import('@/content/redis-cache.md?raw')) },
    // ── Arquitectura ──
    { slug: 'microservicios-diseno', title: 'Diseño de microservicios', description: 'Cuándo usarlos, cómo dividir servicios, API Gateway, mensajería, sagas, Event Sourcing y CQRS.', duration: '4h 30min', lessons: 20, level: 'Avanzado', category: 'Arquitectura', icon: Layers, iconColor: 'text-orange-400', bg: 'bg-orange-500/10', page: md('microservicios-diseno', () => import('@/content/microservicios-diseno.md?raw')) },
];

export const courseBySlug = (slug: string) => COURSES.find((c) => c.slug === slug);

export const coursePath = (c: Pick<Course, 'slug'>) => `/lecciones/${c.slug}`;
