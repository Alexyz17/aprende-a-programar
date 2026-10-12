# React desde cero

> React es la biblioteca más usada para construir interfaces web. En este curso aprenderás a pensar en componentes, a manejar estado y eventos, a pintar listas y formularios y a pedir datos a una API. Al terminar tendrás la base para seguir con [React avanzado](/lecciones/react-avanzado) o [Next.js](/lecciones/nextjs).

## Qué es React y por qué se usa

Sin React, para cambiar algo en pantalla buscas un elemento del DOM y lo modificas a mano:

```js
const contador = document.querySelector('#contador');
let n = 0;
document.querySelector('#boton').addEventListener('click', () => {
    n++;
    contador.textContent = n;
});
```

Con dos o tres elementos funciona. Con cien, cuesta saber qué parte del código cambia qué. React propone otra forma de trabajar:

1. **Describes** cómo debe verse la interfaz para unos datos concretos.
2. Cuando los datos cambian, **React actualiza el DOM por ti**, tocando solo lo necesario.

```jsx
function Contador() {
    const [n, setN] = useState(0);
    return <button onClick={() => setN(n + 1)}>Has pulsado {n} veces</button>;
}
```

No dices *cómo* cambiar el texto del botón: dices *qué* debe mostrar. A esto se le llama programación **declarativa**.

> **Nota:** antes de empezar conviene que sepas [JavaScript moderno](/lecciones/javascript-moderno): funciones flecha, destructuring, `map`, `filter`, módulos y `async/await`. React es JavaScript; casi todo lo que parece "magia" es JavaScript normal.

## Crear un proyecto con Vite

La forma recomendada de empezar un proyecto React sin framework es **Vite**:

```bash
npm create vite@latest mi-app -- --template react-ts
cd mi-app
npm install
npm run dev
```

Abre `http://localhost:5173`. La estructura importante es:

```text
mi-app/
├── index.html          # página base con <div id="root">
├── src/
│   ├── main.tsx        # monta la app en #root
│   ├── App.tsx         # componente principal
│   └── index.css
└── package.json
```

`main.tsx` conecta React con el HTML:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
```

> **Consejo:** usamos la plantilla `react-ts` (TypeScript). Si aún no sabes TypeScript, no pasa nada: los tipos de este curso son sencillos y los puedes aprender en [TypeScript desde cero](/lecciones/typescript-basico).

## JSX: HTML dentro de JavaScript

JSX es una sintaxis que parece HTML pero se convierte en llamadas de JavaScript. Reglas que debes conocer:

```tsx
function Tarjeta() {
    const nombre = 'Ana';
    const esAdmin = true;

    return (
        // 1. Un solo elemento raíz (o un fragmento <>...</>)
        <>
            {/* 2. Las expresiones van entre llaves */}
            <h2>Hola, {nombre.toUpperCase()}</h2>

            {/* 3. class se escribe className; for se escribe htmlFor */}
            <label htmlFor="email" className="etiqueta">Email</label>
            <input id="email" type="email" />

            {/* 4. Todas las etiquetas se cierran, también las vacías */}
            <img src="/avatar.png" alt="Avatar de Ana" />

            {/* 5. Los estilos en línea son objetos con camelCase */}
            <p style={{ fontSize: 14, marginTop: 8 }}>{esAdmin ? 'Administradora' : 'Usuaria'}</p>
        </>
    );
}
```

Dentro de las llaves cabe cualquier **expresión** (algo que devuelve un valor): variables, operaciones, llamadas a funciones, ternarios. No caben sentencias como `if` o `for`; para eso hay patrones que verás más abajo.

> **Atención:** React escapa automáticamente el texto que pintas con `{}`. Si un usuario escribe `<script>` en un comentario, se mostrará como texto, no se ejecutará. Esa protección contra XSS desaparece si usas `dangerouslySetInnerHTML`: úsalo solo con HTML del que te fíes. Más en [Seguridad básica en la web](/lecciones/seguridad-web).

## Componentes y props

Un componente es una **función que devuelve JSX**. Su nombre empieza por mayúscula para que React lo distinga de las etiquetas HTML.

Las **props** son los parámetros del componente. Llegan como un objeto, que normalmente se desestructura:

```tsx
interface BotonProps {
    texto: string;
    variante?: 'primario' | 'secundario';
    onClick?: () => void;
}

function Boton({ texto, variante = 'primario', onClick }: BotonProps) {
    return (
        <button className={`btn btn-${variante}`} onClick={onClick}>
            {texto}
        </button>
    );
}

export default function App() {
    return (
        <div>
            <Boton texto="Guardar" />
            <Boton texto="Cancelar" variante="secundario" onClick={() => alert('Cancelado')} />
        </div>
    );
}
```

Ideas clave:

- **Las props son de solo lectura.** Un componente nunca modifica sus props; si algo debe cambiar, es estado (siguiente apartado).
- Los datos fluyen **de padre a hijo**. Si el hijo necesita avisar al padre, el padre le pasa una función como prop (`onClick` arriba).
- Divide la interfaz en componentes pequeños con una sola responsabilidad: `Cabecera`, `ListaDeTareas`, `Tarea`, `FormularioNuevaTarea`…

### La prop `children`

Lo que pones entre la etiqueta de apertura y la de cierre llega como `children`:

```tsx
function Caja({ titulo, children }: { titulo: string; children: React.ReactNode }) {
    return (
        <section className="caja">
            <h3>{titulo}</h3>
            {children}
        </section>
    );
}

<Caja titulo="Aviso">
    <p>Tu sesión caduca en 5 minutos.</p>
</Caja>
```

## Estado con useState

El **estado** son los datos que cambian con el tiempo y que, al cambiar, deben actualizar la pantalla. Se declara con el hook `useState`:

```tsx
import { useState } from 'react';

function Contador() {
    const [cuenta, setCuenta] = useState(0);

    return (
        <div>
            <p>Cuenta: {cuenta}</p>
            <button onClick={() => setCuenta(cuenta + 1)}>+1</button>
            <button onClick={() => setCuenta(0)}>Reiniciar</button>
        </div>
    );
}
```

`useState(0)` devuelve un array con dos cosas: el valor actual y la función para cambiarlo. Cada vez que llamas a `setCuenta`, React vuelve a ejecutar la función `Contador` con el nuevo valor y actualiza el DOM. A eso se le llama **render**.

Reglas importantes:

1. **Nunca modifiques el estado directamente.** `cuenta++` no avisa a React; usa siempre el setter.
2. **Con objetos y arrays, crea uno nuevo** en lugar de mutar el existente:

```tsx
const [usuario, setUsuario] = useState({ nombre: 'Ana', edad: 30 });
setUsuario({ ...usuario, edad: 31 });          // ✅ objeto nuevo

const [tareas, setTareas] = useState<string[]>([]);
setTareas([...tareas, 'Comprar pan']);          // ✅ añadir
setTareas(tareas.filter((t) => t !== 'Comprar pan')); // ✅ quitar
// tareas.push('Comprar pan')                   // ❌ muta el array: React no se entera
```

3. **Si el nuevo valor depende del anterior, usa la forma de función**:

```tsx
setCuenta((c) => c + 1);
```

Así siempre partes del valor más reciente, aunque se hagan varias actualizaciones seguidas.

4. **Los hooks se llaman siempre arriba del componente**, nunca dentro de un `if`, un bucle o una función anidada. React los identifica por el orden en que se llaman.

## Eventos

Los eventos se escriben en camelCase y reciben una función:

```tsx
function Buscador() {
    const [texto, setTexto] = useState('');

    function manejarTecla(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Escape') setTexto('');
    }

    return (
        <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={manejarTecla}
            placeholder="Buscar…"
        />
    );
}
```

> **Atención:** pasa la función, no la llames. `onClick={guardar}` es correcto; `onClick={guardar()}` la ejecuta en cada render. Si necesitas argumentos, envuélvela: `onClick={() => borrar(tarea.id)}`.

## Renderizado condicional

Como en JSX no puedes usar `if` directamente, hay tres patrones:

```tsx
function Panel({ usuario, cargando, errores }: PanelProps) {
    // 1. if con return temprano: para casos que cambian todo el componente
    if (cargando) return <p>Cargando…</p>;

    return (
        <div>
            {/* 2. Ternario: elegir entre dos opciones */}
            {usuario ? <p>Hola, {usuario.nombre}</p> : <a href="/login">Inicia sesión</a>}

            {/* 3. &&: mostrar algo o nada */}
            {errores.length > 0 && <p className="error">Hay {errores.length} errores</p>}
        </div>
    );
}
```

> **Atención:** con `&&`, si la izquierda es el número `0`, React pinta un `0` en pantalla. Escribe `lista.length > 0 && ...` en lugar de `lista.length && ...`.

## Listas y keys

Para pintar una lista, transforma el array en elementos con `map`:

```tsx
interface Tarea {
    id: number;
    texto: string;
    hecha: boolean;
}

function ListaTareas({ tareas }: { tareas: Tarea[] }) {
    if (tareas.length === 0) return <p>No hay tareas. ¡Disfruta!</p>;

    return (
        <ul>
            {tareas.map((tarea) => (
                <li key={tarea.id} className={tarea.hecha ? 'tachada' : ''}>
                    {tarea.texto}
                </li>
            ))}
        </ul>
    );
}
```

Cada elemento necesita una prop `key` **única y estable** entre sus hermanos. React la usa para saber qué elemento es cuál cuando la lista cambia (se reordena, se añade o se borra algo).

- Usa el **id** que viene de los datos.
- Evita el índice del array (`key={i}`) si la lista puede reordenarse o perder elementos: React confundiría unos con otros y mezclaría su estado.
- Nunca generes la key con `Math.random()`: cambiaría en cada render.

## Formularios

En React lo habitual son los **inputs controlados**: el valor vive en el estado y el input solo lo muestra.

```tsx
function FormularioRegistro() {
    const [form, setForm] = useState({ nombre: '', email: '', acepto: false });
    const [error, setError] = useState('');

    function cambiar(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    }

    function enviar(e: React.FormEvent) {
        e.preventDefault(); // evita que el navegador recargue la página
        if (!form.email.includes('@')) {
            setError('El email no es válido');
            return;
        }
        setError('');
        console.log('Enviando', form);
    }

    return (
        <form onSubmit={enviar}>
            <label>
                Nombre
                <input name="nombre" value={form.nombre} onChange={cambiar} required />
            </label>
            <label>
                Email
                <input name="email" type="email" value={form.email} onChange={cambiar} required />
            </label>
            <label>
                <input name="acepto" type="checkbox" checked={form.acepto} onChange={cambiar} />
                Acepto las condiciones
            </label>
            {error && <p role="alert">{error}</p>}
            <button disabled={!form.acepto}>Crear cuenta</button>
        </form>
    );
}
```

Un solo manejador `cambiar` sirve para todos los campos gracias al atributo `name` y a las claves calculadas `[name]`.

> **Importante:** la validación en el navegador es para la comodidad del usuario. La validación de verdad siempre se repite en el servidor, porque cualquiera puede saltarse tu JavaScript.

## Efectos con useEffect y peticiones a una API

Un **efecto** es código que sincroniza tu componente con algo de fuera de React: una API, un temporizador, el título de la pestaña, una suscripción…

```tsx
import { useEffect, useState } from 'react';

interface Usuario {
    id: number;
    name: string;
    email: string;
}

function ListaUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        fetch('https://jsonplaceholder.typicode.com/users', { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error(`Error ${res.status}`);
                return res.json();
            })
            .then((datos: Usuario[]) => setUsuarios(datos))
            .catch((e) => {
                if (e.name !== 'AbortError') setError(e.message);
            })
            .finally(() => setCargando(false));

        // Limpieza: se ejecuta si el componente desaparece antes de terminar
        return () => controller.abort();
    }, []); // [] = solo al montar el componente

    if (cargando) return <p>Cargando…</p>;
    if (error) return <p role="alert">No se pudieron cargar los usuarios: {error}</p>;

    return (
        <ul>
            {usuarios.map((u) => (
                <li key={u.id}>{u.name} — {u.email}</li>
            ))}
        </ul>
    );
}
```

El segundo argumento de `useEffect` es el **array de dependencias**:

| Dependencias | Cuándo se ejecuta |
| --- | --- |
| `[]` | Una vez, al montar el componente |
| `[id]` | Al montar y cada vez que cambia `id` |
| (sin array) | Después de cada render (casi nunca es lo que quieres) |

Un ejemplo con dependencia y limpieza:

```tsx
function Reloj({ activo }: { activo: boolean }) {
    const [segundos, setSegundos] = useState(0);

    useEffect(() => {
        if (!activo) return;
        const id = setInterval(() => setSegundos((s) => s + 1), 1000);
        return () => clearInterval(id); // sin esto, se acumularían intervalos
    }, [activo]);

    return <p>{segundos} s</p>;
}
```

> **Consejo:** no uses `useEffect` para calcular datos que salen de otros datos. Si tienes `tareas` en el estado, las tareas pendientes se calculan directamente en el render: `const pendientes = tareas.filter((t) => !t.hecha);`. Menos estado significa menos errores.

> **Nota:** en proyectos reales, para pedir datos se suele usar una librería como TanStack Query, que añade caché, reintentos y estados de carga. Lo verás en [React avanzado](/lecciones/react-avanzado). Aun así, entender `useEffect` con `fetch` es imprescindible.

## Compartir estado entre componentes

Cuando dos componentes hermanos necesitan el mismo dato, **sube el estado** al padre común y pásalo hacia abajo:

```tsx
function App() {
    const [tareas, setTareas] = useState<Tarea[]>([]);

    function añadir(texto: string) {
        setTareas((ts) => [...ts, { id: Date.now(), texto, hecha: false }]);
    }

    function alternar(id: number) {
        setTareas((ts) => ts.map((t) => (t.id === id ? { ...t, hecha: !t.hecha } : t)));
    }

    return (
        <>
            <FormularioTarea onAñadir={añadir} />
            <ListaTareas tareas={tareas} onAlternar={alternar} />
            <p>{tareas.filter((t) => !t.hecha).length} pendientes</p>
        </>
    );
}
```

`FormularioTarea` no sabe nada de la lista y `ListaTareas` no sabe nada del formulario: los dos hablan con el padre a través de props. Este patrón (estado arriba, datos hacia abajo, eventos hacia arriba) resuelve la mayoría de casos.

Si el mismo dato hace falta en muchos niveles (usuario conectado, tema claro/oscuro, idioma), pasar props por cinco componentes se vuelve pesado. Para eso existe el **Context**:

```tsx
import { createContext, useContext, useState } from 'react';

type Tema = 'claro' | 'oscuro';
const TemaContext = createContext<{ tema: Tema; cambiar: () => void } | null>(null);

export function TemaProvider({ children }: { children: React.ReactNode }) {
    const [tema, setTema] = useState<Tema>('claro');
    const cambiar = () => setTema((t) => (t === 'claro' ? 'oscuro' : 'claro'));
    return <TemaContext value={{ tema, cambiar }}>{children}</TemaContext>;
}

export function useTema() {
    const ctx = useContext(TemaContext);
    if (!ctx) throw new Error('useTema debe usarse dentro de <TemaProvider>');
    return ctx;
}

// En cualquier componente:
function BotonTema() {
    const { tema, cambiar } = useTema();
    return <button onClick={cambiar}>Modo {tema === 'claro' ? 'oscuro' : 'claro'}</button>;
}
```

> **Nota:** desde React 19 puedes usar `<TemaContext value={...}>` directamente. En código anterior verás `<TemaContext.Provider value={...}>`, que sigue funcionando.

## Hooks propios

Cuando repites la misma lógica con hooks en varios componentes, extráela a un **hook propio**: una función cuyo nombre empieza por `use` y que llama a otros hooks.

```tsx
function useLocalStorage<T>(clave: string, inicial: T) {
    const [valor, setValor] = useState<T>(() => {
        try {
            const guardado = localStorage.getItem(clave);
            return guardado ? (JSON.parse(guardado) as T) : inicial;
        } catch {
            return inicial;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(clave, JSON.stringify(valor));
        } catch {
            // modo privado o almacenamiento lleno: seguimos sin guardar
        }
    }, [clave, valor]);

    return [valor, setValor] as const;
}

// Uso: igual que useState, pero sobrevive a recargar la página
const [tareas, setTareas] = useLocalStorage<Tarea[]>('tareas', []);
```

Fíjate en `useState(() => ...)`: si pasas una función, React solo la ejecuta en el primer render. Es útil cuando el valor inicial es costoso de calcular, como leer y parsear `localStorage`.

## Organizar un proyecto

No hay una única estructura correcta, pero esta funciona bien para proyectos pequeños y medianos:

```text
src/
├── components/     # piezas reutilizables: Boton, Modal, Tarjeta
├── features/       # una carpeta por funcionalidad
│   └── tareas/
│       ├── ListaTareas.tsx
│       ├── FormularioTarea.tsx
│       └── useTareas.ts
├── hooks/          # hooks genéricos: useLocalStorage, useDebounce
├── lib/            # utilidades y cliente de la API
├── App.tsx
└── main.tsx
```

Buenas prácticas para empezar:

- **Un componente por archivo**, con el mismo nombre que el archivo.
- **Componentes pequeños.** Si un componente pasa de unas 150 líneas o hace varias cosas, divídelo.
- **El estado, lo más abajo posible**: solo súbelo cuando otro componente lo necesite.
- **Instala las React DevTools** en el navegador para ver el árbol de componentes, sus props y su estado.
- Para dar estilo rápido y consistente, prueba [Tailwind CSS](/lecciones/tailwind-css).

## Proyecto: lista de tareas completa

Construye una aplicación de tareas que junte todo lo del curso:

1. Formulario para añadir tareas (input controlado, no permite tareas vacías).
2. Lista con casilla para marcarlas como hechas y botón para borrarlas.
3. Filtros "Todas / Pendientes / Hechas" (el filtro es estado; la lista filtrada se **calcula**, no se guarda).
4. Contador de tareas pendientes.
5. Las tareas se guardan en `localStorage` con el hook `useLocalStorage`.
6. Un botón para cargar 5 tareas de ejemplo desde `https://jsonplaceholder.typicode.com/todos?_limit=5`, con estados de carga y error.

> **Ejercicio:** divide la aplicación en al menos cuatro componentes (`App`, `FormularioTarea`, `ListaTareas`, `FiltroTareas`) y decide en cuál vive cada estado. Escribe en un comentario por qué lo pusiste ahí.

> **Reto:** añade la edición de una tarea con doble clic (el texto se convierte en un input; Enter guarda y Escape cancela) y escribe dos tests con Vitest y Testing Library que comprueben que se puede añadir y completar una tarea. Lo tienes explicado en [Testing para desarrolladores web](/lecciones/testing).
