import LessonLayout from '@/layouts/LessonLayout';
import { Head } from '@inertiajs/react';

const modules = [
    { id: '/lecciones/javascript-moderno', title: 'ES2024+ y novedades', free: true },
    { id: '/lecciones/javascript-moderno#destructuring', title: 'Destructuring y spread', free: true },
    { id: '/lecciones/javascript-moderno#async', title: 'Async/await y Promises', free: true },
    { id: '/lecciones/javascript-moderno#modulos', title: 'Módulos ES', free: true },
    { id: '/lecciones/javascript-moderno#fetch', title: 'Fetch API y HTTP', free: true },
    { id: '/lecciones/javascript-moderno#templates', title: 'Template literals avanzados', free: true },
];

export default function JavaScriptModerno() {
    return (
        <LessonLayout
            title="JavaScript moderno (ES2024+)"
            description="Destructuring, async/await, módulos ES, Fetch API y las últimas novedades del lenguaje. JavaScript como lo escriben los profesionales."
            duration="3h 15min"
            lessons={16}
            level="Intermedio"
            premium={false}
            modules={modules}
            activeModule="/lecciones/javascript-moderno"
            nextHref="/lecciones/typescript-basico"
            category="JavaScript"
        >
            <Head>
                <title>JavaScript moderno ES2024+ — Aprende a Programar</title>
                <meta name="description" content="Aprende JavaScript moderno: destructuring, async/await, módulos ES, Fetch API y ES2024. Curso gratuito 2026." />
            </Head>

            <h1>JavaScript moderno (ES2024+)</h1>

            <blockquote>
                JavaScript evoluciona cada año. Las características modernas no son azúcar sintáctico — son herramientas que hacen tu código más legible, menos propenso a errores y más expresivo. Si todavía escribes <code>var</code> o callbacks anidados, este curso te actualiza.
            </blockquote>

            {/* ── 1. ES2024+ ── */}
            <h2 id="es2024">ES2024+ y novedades del lenguaje</h2>

            <h3>let y const — adiós a var</h3>
            <pre><code>{`// var tiene scope de función y se "eleva" (hoisting)
// let y const tienen scope de bloque — más predecible

const MAX = 100;          // no se puede reasignar
let contador = 0;         // puede reasignarse
contador++;               // ✅

// const no significa inmutable para objetos
const usuario = { nombre: "Ana" };
usuario.nombre = "Eva";   // ✅ mutación permitida
// usuario = {};          // ❌ Error: reasignación de const

// Temporal Dead Zone — let/const no se pueden usar antes de declarar
// console.log(x); // ❌ ReferenceError
let x = 5;`}</code></pre>

            <h3>Nullish coalescing y Optional chaining (ES2020+)</h3>
            <pre><code>{`// ?? — Nullish coalescing: valor por defecto solo si es null/undefined
const nombre = null ?? "Anónimo";     // "Anónimo"
const edad = 0 ?? 18;                 // 0  (0 no es nullish)
const texto = "" ?? "vacío";          // ""  ("" no es nullish)

// vs || — el OR lógico trataba 0, "" y false como falsy
const edadMal = 0 || 18;             // 18  (bug sutil)

// ?. — Optional chaining: acceso seguro a propiedades anidadas
const usuario = null;
const ciudad = usuario?.direccion?.ciudad;  // undefined (sin error)
const tag = usuario?.tags?.[0];             // undefined
const saludo = usuario?.saludar?.();        // undefined (método)

// ??= y ||= — asignación condicional (ES2021)
let config = null;
config ??= {};           // asigna solo si es null/undefined
config.tema ||= "oscuro"; // asigna si es falsy`}</code></pre>

            <h3>Novedades ES2023-2024</h3>
            <pre><code>{`// Array.findLast() y findLastIndex()
const nums = [1, 2, 3, 4, 5];
console.log(nums.findLast(n => n % 2 === 0));      // 4
console.log(nums.findLastIndex(n => n % 2 === 0)); // 3

// Array.toSorted(), toReversed(), toSpliced() — no mutan el original
const original = [3, 1, 2];
const ordenado = original.toSorted();  // [1, 2, 3]
console.log(original);                 // [3, 1, 2] — sin cambios

// Object.groupBy() — ES2024
const personas = [
    { nombre: "Ana", rol: "dev" },
    { nombre: "Bob", rol: "design" },
    { nombre: "Cal", rol: "dev" },
];
const porRol = Object.groupBy(personas, p => p.rol);
// { dev: [{...}, {...}], design: [{...}] }

// Promise.withResolvers() — ES2024
const { promise, resolve, reject } = Promise.withResolvers();
setTimeout(() => resolve("hecho"), 1000);
await promise; // "hecho"

// using — Resource Management (Stage 3, próximamente)
// Gestión declarativa de recursos con Symbol.dispose`}</code></pre>

            {/* ── 2. Destructuring ── */}
            <h2 id="destructuring">Destructuring y spread/rest</h2>
            <pre><code>{`// Destructuring de arrays
const [primero, segundo, ...resto] = [1, 2, 3, 4, 5];
// primero = 1, segundo = 2, resto = [3, 4, 5]

// Saltar elementos
const [,, tercero] = [10, 20, 30];  // 30

// Valores por defecto
const [a = 0, b = 0] = [1];  // a = 1, b = 0

// Swap sin variable temporal
let x = 1, y = 2;
[x, y] = [y, x];  // x = 2, y = 1

// Destructuring de objetos
const usuario = { nombre: "Ana", edad: 30, ciudad: "Madrid" };
const { nombre, edad } = usuario;
const { ciudad: ubicacion } = usuario;  // renombrar
const { email = "N/A" } = usuario;      // valor por defecto

// Destructuring anidado
const { direccion: { calle, cp } = {} } = usuario;

// En parámetros de función
function mostrar({ nombre, edad, rol = "usuario" }) {
    return \`\${nombre} (\${edad}) - \${rol}\`;
}
mostrar({ nombre: "Bob", edad: 25 });

// Spread — expandir iterables
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combinado = [...arr1, ...arr2];         // [1, 2, 3, 4, 5, 6]
const copia = [...arr1];                       // copia superficial

// Spread en objetos
const base = { tema: "oscuro", idioma: "es" };
const usuario2 = { ...base, nombre: "Eva", tema: "claro" };
// tema: "claro" sobreescribe base.tema`}</code></pre>

            {/* ── 3. Async/await ── */}
            <h2 id="async">Async/await y Promises</h2>
            <pre><code>{`// Promise básica
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// async/await — código asíncrono que parece síncrono
async function obtenerUsuario(id) {
    const respuesta = await fetch(\`/api/usuarios/\${id}\`);
    if (!respuesta.ok) {
        throw new Error(\`HTTP \${respuesta.status}\`);
    }
    return respuesta.json();
}

// Manejo de errores
async function cargarDatos() {
    try {
        const usuario = await obtenerUsuario(1);
        const posts = await fetch(\`/api/posts?userId=\${usuario.id}\`).then(r => r.json());
        return { usuario, posts };
    } catch (error) {
        console.error("Error cargando datos:", error.message);
        return null;
    }
}

// Paralelismo con Promise.all
async function cargarTodo() {
    // ❌ Secuencial — innecesariamente lento
    const usuario = await obtenerUsuario(1);   // espera
    const perfil = await obtenerPerfil(1);     // espera otro

    // ✅ Paralelo — ejecuta ambas a la vez
    const [usuario2, perfil2] = await Promise.all([
        obtenerUsuario(1),
        obtenerPerfil(1),
    ]);
}

// Promise.allSettled — espera todas aunque alguna falle
const resultados = await Promise.allSettled([
    fetch("/api/a"),
    fetch("/api/b"),
    fetch("/api/c"),
]);
for (const r of resultados) {
    if (r.status === "fulfilled") console.log(r.value);
    else console.error(r.reason);
}

// Promise.race — la primera que resuelve gana
const timeout = (ms) => new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms)
);

const resultado = await Promise.race([
    fetch("/api/datos"),
    timeout(5000),
]);`}</code></pre>

            {/* ── 4. Módulos ── */}
            <h2 id="modulos">Módulos ES (ESM)</h2>
            <pre><code>{`// ── utils.js ──
export const PI = 3.14159;

export function sumar(a, b) {
    return a + b;
}

export class Calculadora {
    constructor(inicial = 0) { this.valor = inicial; }
    sumar(n) { this.valor += n; return this; }
    resultado() { return this.valor; }
}

// Export por defecto (uno por módulo)
export default function formatearMoneda(cantidad, moneda = "EUR") {
    return new Intl.NumberFormat("es-ES", {
        style: "currency", currency: moneda
    }).format(cantidad);
}

// ── main.js ──
import formatear, { sumar, PI, Calculadora } from "./utils.js";
import * as Utils from "./utils.js";  // namespace import

console.log(PI);
console.log(sumar(2, 3));
console.log(formatear(1234.5));  // "1.234,50 €"

const c = new Calculadora(10).sumar(5).sumar(3);
console.log(c.resultado());  // 18

// Importación dinámica — carga bajo demanda
async function cargarGrafico() {
    const { Chart } = await import("./chart.js");
    return new Chart();
}

// Re-exportar desde un módulo índice
// ── lib/index.js ──
export { sumar, PI } from "./utils.js";
export { default as formatear } from "./utils.js";
export * from "./validators.js";`}</code></pre>

            {/* ── 5. Fetch API ── */}
            <h2 id="fetch">Fetch API y peticiones HTTP</h2>
            <pre><code>{`// GET básico
const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
const post = await res.json();

// POST con JSON
const nuevo = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo: "Hola", contenido: "Mundo" }),
});
const creado = await nuevo.json();

// Función reutilizable con manejo de errores
async function apiFetch(url, opciones = {}) {
    const respuesta = await fetch(url, {
        ...opciones,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            ...opciones.headers,
        },
    });

    if (!respuesta.ok) {
        const error = await respuesta.json().catch(() => ({}));
        throw new Error(error.message ?? \`Error HTTP \${respuesta.status}\`);
    }

    return respuesta.json();
}

// Uso
const usuarios = await apiFetch("/api/usuarios");
const actualizado = await apiFetch(\`/api/usuarios/\${id}\`, {
    method: "PATCH",
    body: JSON.stringify({ nombre: "Nuevo nombre" }),
});

// Cancelar petición con AbortController
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
    const datos = await fetch("/api/lentos", { signal: controller.signal });
} catch (err) {
    if (err.name === "AbortError") console.log("Petición cancelada");
} finally {
    clearTimeout(timeoutId);
}`}</code></pre>

            {/* ── 6. Template literals ── */}
            <h2 id="templates">Template literals avanzados</h2>
            <pre><code>{`// Multilínea y expresiones
const nombre = "Ana";
const items = ["manzana", "pera", "uva"];

const html = \`
    <ul>
        \${items.map(item => \`<li>\${item}</li>\`).join("\\n        ")}
    </ul>
\`;

// Tagged templates — HTML seguro
function html(strings, ...values) {
    return strings.reduce((resultado, str, i) => {
        const valor = values[i - 1];
        const seguro = String(valor)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        return resultado + seguro + str;
    });
}

const inputUsuario = '<script>alert("xss")</script>';
const seguro = html\`<p>Hola \${inputUsuario}</p>\`;
// <p>Hola &lt;script&gt;alert("xss")&lt;/script&gt;</p>

// String.raw — sin procesar escapes
const ruta = String.raw\`C:\\Users\\Alex\\Desktop\`;
// "C:\\Users\\Alex\\Desktop" (los \\ no se procesan)

// Template para SQL (con librería de sanitización real en producción)
function sql(strings, ...params) {
    const query = strings.reduce((q, str, i) =>
        q + (i > 0 ? \`$\${i}\` : "") + str
    );
    return { query, params };
}

const { query, params: p } = sql\`
    SELECT * FROM usuarios
    WHERE email = \${email}
    AND activo = \${true}
\`;`}</code></pre>

            <h2>Próximos pasos</h2>
            <p>
                Con JavaScript moderno bien dominado, el siguiente paso natural es <strong>TypeScript</strong>: añade tipado estático que detecta errores antes de ejecutar el código, mejora el autocompletado en tu editor y hace el código más fácil de entender y mantener.
            </p>
        </LessonLayout>
    );
}
