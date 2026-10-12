import LessonLayout from '@/layouts/LessonLayout';
import { Head } from '@inertiajs/react';

const modules = [
    { id: '/lecciones/typescript-basico', title: '¿Por qué TypeScript?', free: true },
    { id: '/lecciones/typescript-basico#tipos', title: 'Tipos básicos y anotaciones', free: true },
    { id: '/lecciones/typescript-basico#interfaces', title: 'Interfaces y type aliases', free: true },
    { id: '/lecciones/typescript-basico#generics', title: 'Generics básicos', free: true },
    { id: '/lecciones/typescript-basico#narrowing', title: 'Type narrowing y guards', free: true },
    { id: '/lecciones/typescript-basico#tsconfig', title: 'tsconfig.json', free: true },
];

export default function TypeScriptBasico() {
    return (
        <LessonLayout
            title="TypeScript desde cero"
            description="Tipos, interfaces, type aliases, generics básicos y configuración de tsconfig. La base para escribir JavaScript con seguridad de tipos."
            duration="2h 45min"
            lessons={13}
            level="Básico"
            premium={false}
            modules={modules}
            activeModule="/lecciones/typescript-basico"
            category="JavaScript"
        >
            <Head>
                <title>TypeScript desde cero — Aprende a Programar</title>
                <meta name="description" content="Aprende TypeScript: tipos básicos, interfaces, generics y tsconfig. Curso gratuito actualizado 2026." />
            </Head>

            <h1>TypeScript desde cero</h1>

            <blockquote>
                TypeScript no es un lenguaje nuevo — es JavaScript con un sistema de tipos encima. El compilador detecta errores antes de ejecutar el código, tu editor conoce la forma exacta de cada objeto, y el código se documenta solo. En 2026, cualquier proyecto JavaScript serio usa TypeScript.
            </blockquote>

            {/* ── 1. Por qué TypeScript ── */}
            <h2 id="intro">¿Por qué TypeScript?</h2>
            <p>
                JavaScript es dinámico: puedes pasar cualquier cosa a cualquier función. Esto es flexible, pero causa bugs sutiles que solo aparecen en producción. TypeScript añade un sistema de tipos estático que verifica la corrección de tu código en tiempo de compilación.
            </p>

            <pre><code>{`// JavaScript — el error aparece en runtime
function formatearPrecio(precio) {
    return precio.toFixed(2) + " €";
}
formatearPrecio("gratis");  // TypeError en runtime: toFixed is not a function

// TypeScript — el error aparece en el editor, antes de ejecutar
function formatearPrecio(precio: number): string {
    return precio.toFixed(2) + " €";
}
formatearPrecio("gratis");  // ❌ Error: Argument of type 'string' is not assignable to 'number'
formatearPrecio(9.99);      // ✅  "9.99 €"`}</code></pre>

            {/* ── 2. Tipos básicos ── */}
            <h2 id="tipos">Tipos básicos y anotaciones</h2>
            <pre><code>{`// Primitivos
let nombre: string = "Alicia";
let edad: number = 28;
let activo: boolean = true;
let nada: null = null;
let indefinido: undefined = undefined;
let cualquiera: unknown = "puede ser cualquier cosa";  // unknown > any

// Arrays
let numeros: number[] = [1, 2, 3];
let nombres: Array<string> = ["Ana", "Bob"];
const pares: readonly number[] = [2, 4, 6];  // inmutable

// Tuplas — array con longitud y tipos fijos
let coordenada: [number, number] = [40.4168, -3.7038];
let entrada: [string, number] = ["Madrid", 2026];
const [lat, lng] = coordenada;

// Union types — uno u otro
let id: string | number;
id = 42;       // ✅
id = "uuid-1"; // ✅
id = true;     // ❌

// Literal types — solo valores específicos
type Direccion = "norte" | "sur" | "este" | "oeste";
type HttpStatus = 200 | 201 | 400 | 401 | 404 | 500;

let dir: Direccion = "norte";  // ✅
dir = "arriba";                // ❌

// any vs unknown
let val: any = "texto";
val.toUpperCase();   // ✅ TypeScript confía en ti (peligroso)

let val2: unknown = "texto";
val2.toUpperCase();  // ❌ Error: debes verificar el tipo primero
if (typeof val2 === "string") {
    val2.toUpperCase();  // ✅ ahora TypeScript sabe que es string
}

// never — función que nunca retorna
function lanzarError(msg: string): never {
    throw new Error(msg);
}

// void — función sin retorno significativo
function log(msg: string): void {
    console.log(msg);
}`}</code></pre>

            {/* ── 3. Interfaces y types ── */}
            <h2 id="interfaces">Interfaces y type aliases</h2>
            <pre><code>{`// Interface — para describir la forma de un objeto
interface Usuario {
    readonly id: number;    // no se puede modificar después de crear
    nombre: string;
    email: string;
    edad?: number;          // opcional
    rol: "admin" | "user" | "guest";
}

const alex: Usuario = {
    id: 1,
    nombre: "Alex",
    email: "alex@ejemplo.com",
    rol: "admin",
};

// Extender interfaces
interface Empleado extends Usuario {
    departamento: string;
    salario: number;
}

// Interface para funciones
interface Formateador {
    (valor: number, decimales: number): string;
    separador: string;  // también puede tener propiedades
}

// Type alias — más flexible que interface
type Punto = {
    x: number;
    y: number;
};

type Punto3D = Punto & { z: number };  // intersección

// Types para uniones complejas
type Resultado<T> =
    | { ok: true; datos: T }
    | { ok: false; error: string };

function parsearJSON(texto: string): Resultado<unknown> {
    try {
        return { ok: true, datos: JSON.parse(texto) };
    } catch {
        return { ok: false, error: "JSON inválido" };
    }
}

const r = parsearJSON('{"clave": "valor"}');
if (r.ok) {
    console.log(r.datos);  // TypeScript sabe que datos existe
} else {
    console.error(r.error); // TypeScript sabe que error existe
}

// Interface vs Type — cuándo usar cada uno
// Interface: para objetos que pueden extenderse o implementarse
// Type: para uniones, intersecciones, tipos complejos, primitivos con alias`}</code></pre>

            {/* ── 4. Generics ── */}
            <h2 id="generics">Generics básicos</h2>
            <pre><code>{`// El problema sin generics
function primero(arr: any[]): any {
    return arr[0];
}
const n = primero([1, 2, 3]);  // n es any — perdemos el tipo

// Con generics
function primero<T>(arr: T[]): T | undefined {
    return arr[0];
}
const num = primero([1, 2, 3]);    // num es number ✅
const str = primero(["a", "b"]);   // str es string ✅

// Generics con constraints
function obtenerPropiedad<T, K extends keyof T>(obj: T, clave: K): T[K] {
    return obj[clave];
}

const usuario = { nombre: "Ana", edad: 30 };
const nombre = obtenerPropiedad(usuario, "nombre");  // string ✅
const edad = obtenerPropiedad(usuario, "edad");      // number ✅
// obtenerPropiedad(usuario, "email");               // ❌ error

// Interfaz genérica
interface Repositorio<T extends { id: number }> {
    buscarPorId(id: number): Promise<T | null>;
    guardar(entidad: T): Promise<T>;
    eliminar(id: number): Promise<void>;
}

interface Producto {
    id: number;
    nombre: string;
    precio: number;
}

class ProductoRepositorio implements Repositorio<Producto> {
    private datos: Producto[] = [];

    async buscarPorId(id: number): Promise<Producto | null> {
        return this.datos.find(p => p.id === id) ?? null;
    }

    async guardar(producto: Producto): Promise<Producto> {
        this.datos.push(producto);
        return producto;
    }

    async eliminar(id: number): Promise<void> {
        this.datos = this.datos.filter(p => p.id !== id);
    }
}

// Utility types — tipos genéricos que vienen incluidos
interface Config {
    host: string;
    puerto: number;
    ssl: boolean;
    usuario: string;
}

type ConfigOpcional = Partial<Config>;         // todas las propiedades opcionales
type ConfigRequerida = Required<ConfigOpcional>; // todas requeridas
type ConfigReadonly = Readonly<Config>;         // todas readonly
type HostYPuerto = Pick<Config, "host" | "puerto">; // solo esas propiedades
type SinUsuario = Omit<Config, "usuario">;      // sin esa propiedad`}</code></pre>

            {/* ── 5. Narrowing ── */}
            <h2 id="narrowing">Type narrowing y type guards</h2>
            <pre><code>{`// typeof narrowing
function procesar(valor: string | number) {
    if (typeof valor === "string") {
        return valor.toUpperCase();  // TS sabe: string
    }
    return valor.toFixed(2);         // TS sabe: number
}

// instanceof narrowing
function formatear(valor: Date | string): string {
    if (valor instanceof Date) {
        return valor.toLocaleDateString("es-ES");
    }
    return valor;
}

// in narrowing — comprobar si existe una propiedad
interface Perro { tipo: "perro"; ladrar(): void }
interface Gato { tipo: "gato"; maullar(): void }
type Animal = Perro | Gato;

function hacerRuido(animal: Animal) {
    if ("ladrar" in animal) {
        animal.ladrar();   // TS sabe: Perro
    } else {
        animal.maullar();  // TS sabe: Gato
    }
}

// Discriminated unions — patrón muy potente
type Evento =
    | { tipo: "click"; x: number; y: number }
    | { tipo: "teclado"; tecla: string }
    | { tipo: "scroll"; deltaY: number };

function manejar(evento: Evento) {
    switch (evento.tipo) {
        case "click":
            console.log(evento.x, evento.y);  // TS sabe: x y y existen
            break;
        case "teclado":
            console.log(evento.tecla);         // TS sabe: tecla existe
            break;
        case "scroll":
            console.log(evento.deltaY);
            break;
    }
}

// Type guard personalizado
function esUsuario(obj: unknown): obj is Usuario {
    return (
        typeof obj === "object" &&
        obj !== null &&
        "nombre" in obj &&
        "email" in obj
    );
}

const datos: unknown = await fetch("/api/me").then(r => r.json());
if (esUsuario(datos)) {
    console.log(datos.nombre);  // TS sabe que es Usuario ✅
}`}</code></pre>

            {/* ── 6. tsconfig ── */}
            <h2 id="tsconfig">tsconfig.json — configuración esencial</h2>
            <pre><code>{`// tsconfig.json básico recomendado para 2026
{
    "compilerOptions": {
        // Versión objetivo de JavaScript generado
        "target": "ES2022",

        // Sistema de módulos
        "module": "ESNext",
        "moduleResolution": "bundler",

        // Directorio de salida
        "outDir": "./dist",

        // Opciones de strictness — actívalas todas
        "strict": true,            // activa todas las siguientes:
        // "strictNullChecks": true      — null y undefined no asignables a otros tipos
        // "noImplicitAny": true         — error si TypeScript infiere any
        // "strictFunctionTypes": true   — tipos de funciones más estrictos
        // "strictPropertyInitialization": true — propiedades de clase deben inicializarse

        "noUnusedLocals": true,        // error si hay variables sin usar
        "noUnusedParameters": true,    // error si hay parámetros sin usar
        "noImplicitReturns": true,     // todas las rutas deben retornar
        "noFallthroughCasesInSwitch": true,

        // Paths (alias de importación)
        "baseUrl": ".",
        "paths": {
            "@/*": ["./src/*"]
        },

        // Otras opciones útiles
        "sourceMap": true,     // genera source maps para debugging
        "declaration": true,   // genera archivos .d.ts
        "skipLibCheck": true,  // omite chequeo de node_modules (más rápido)
        "esModuleInterop": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
}`}</code></pre>

            <blockquote>
                <strong>Consejo:</strong> Siempre activa <code>"strict": true</code> desde el principio. Añadirlo a un proyecto existente es doloroso, pero empezar sin él crea una deuda técnica que tarde o temprano tendrás que pagar.
            </blockquote>

            <h2>Próximos pasos</h2>
            <p>
                Con TypeScript básico dominado, puedes explorar <strong>React con TypeScript</strong> (tipado de props, hooks y eventos) o profundizar en TypeScript avanzado: conditional types, mapped types, template literal types e infer.
            </p>
        </LessonLayout>
    );
}
