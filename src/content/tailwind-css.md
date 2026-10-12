# Tailwind CSS

> Tailwind es un framework de CSS basado en clases de utilidad: en lugar de escribir hojas de estilo, combinas clases pequeñas como `flex`, `p-4` o `text-gray-700` directamente en el HTML. En este curso aprenderás a usarlo con criterio en su versión 4: diseño responsive, estados, modo oscuro, personalización del tema y cómo mantener el código ordenado.

## Qué es y por qué tanta gente lo usa

Con CSS tradicional inventas nombres de clases y escribes sus estilos en otro archivo:

```html
<div class="tarjeta-producto">
    <h3 class="tarjeta-producto__titulo">Teclado</h3>
</div>
```

```css
.tarjeta-producto { padding: 1rem; border-radius: 0.5rem; background: white; }
.tarjeta-producto__titulo { font-size: 1.125rem; font-weight: 600; }
```

Con Tailwind los estilos van en el propio marcado:

```html
<div class="rounded-lg bg-white p-4">
    <h3 class="text-lg font-semibold">Teclado</h3>
</div>
```

Ventajas:

- **No inventas nombres** ni saltas entre archivos.
- **Diseño consistente:** los espaciados, colores y tamaños salen de una escala fija, no de valores sueltos.
- **CSS final pequeño:** solo se genera el CSS de las clases que usas.
- **Borrar es seguro:** si quitas un componente, sus estilos se van con él. No quedan reglas huérfanas.

Inconvenientes reales: el HTML queda más cargado y al principio tienes que aprender los nombres. Se compensa al organizar bien los componentes (lo verás al final del curso).

> **Nota:** Tailwind no sustituye a saber CSS. Cada clase es una propiedad CSS concreta (`flex` es `display: flex`), así que si no entiendes el box model o Flexbox, Tailwind no lo arreglará. Repásalo en [HTML y CSS desde cero](/lecciones/html-css).

## Instalación con Vite

En un proyecto de Vite (React, Vue o JavaScript puro):

```bash
npm install tailwindcss @tailwindcss/vite
```

Añade el plugin en `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [tailwindcss()],
});
```

E importa Tailwind en tu CSS principal:

```css
/* src/index.css */
@import "tailwindcss";
```

Ya está. En la versión 4 no hace falta `tailwind.config.js` ni indicar qué archivos analizar: Tailwind detecta solo las clases que usas en tu proyecto.

> **Consejo:** instala la extensión oficial **Tailwind CSS IntelliSense** en VS Code. Autocompleta las clases, muestra el CSS que generan y avisa de clases que entran en conflicto.

> **Atención:** Tailwind lee tus archivos como texto buscando clases completas. Si construyes nombres con concatenación (`'text-' + color + '-500'`), no los encontrará. Escribe siempre la clase completa: `color === 'rojo' ? 'text-red-500' : 'text-green-500'`.

## Espaciado, tamaño y tipografía

La escala de espaciado se basa en múltiplos de `0.25rem` (4 px con la fuente por defecto):

| Clase | CSS | Píxeles |
| --- | --- | --- |
| `p-1` | `padding: 0.25rem` | 4 px |
| `p-4` | `padding: 1rem` | 16 px |
| `mt-8` | `margin-top: 2rem` | 32 px |
| `px-6` | padding izquierdo y derecho | 24 px |
| `gap-2` | `gap: 0.5rem` | 8 px |

Prefijos de dirección: `p` (todos), `px` / `py` (horizontal / vertical), `pt`, `pr`, `pb`, `pl` (cada lado). Lo mismo con `m` para margin.

```html
<article class="mx-auto max-w-2xl px-4 py-12">
    <h1 class="text-3xl font-bold tracking-tight text-gray-900">Título del artículo</h1>
    <p class="mt-4 text-base leading-relaxed text-gray-600">
        Párrafo con un interlineado cómodo para leer.
    </p>
</article>
```

- Anchos: `w-full`, `w-1/2`, `w-64`, `max-w-2xl`, `min-h-screen`.
- Texto: `text-sm` … `text-5xl`, `font-medium`, `font-bold`, `leading-relaxed`, `tracking-tight`, `text-center`, `truncate`.
- Colores: `text-gray-600`, `bg-indigo-600`, `border-red-300`. La escala va de 50 (muy claro) a 950 (muy oscuro).
- Opacidad del color con barra: `bg-black/50` es negro al 50 %.

Cuando necesitas un valor fuera de la escala, usa **valores arbitrarios** entre corchetes:

```html
<div class="top-[117px] grid-cols-[200px_1fr] bg-[#1da1f2]">...</div>
```

Úsalos con moderación: si repites el mismo valor arbitrario, probablemente debería ser parte de tu tema.

## Flexbox y Grid

Las utilidades de layout son las que más usarás:

```html
<!-- Barra de navegación: logo a la izquierda, enlaces a la derecha -->
<nav class="flex items-center justify-between border-b px-6 py-4">
    <a href="/" class="text-xl font-bold">MiApp</a>
    <ul class="flex gap-6 text-sm font-medium">
        <li><a href="/cursos">Cursos</a></li>
        <li><a href="/rutas">Rutas</a></li>
    </ul>
</nav>
```

```html
<!-- Rejilla de tarjetas -->
<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <div class="rounded-xl border p-6">Tarjeta 1</div>
    <div class="rounded-xl border p-6">Tarjeta 2</div>
    <div class="rounded-xl border p-6">Tarjeta 3</div>
</div>
```

```html
<!-- Centrar algo en la pantalla -->
<main class="grid min-h-screen place-items-center">
    <p>Centrado</p>
</main>
```

Chuleta rápida:

- `flex` + `items-center` (eje cruzado) + `justify-between` (eje principal).
- `flex-col` para apilar en vertical, `flex-wrap` para que salte de línea, `flex-1` para ocupar el espacio libre, `shrink-0` para que no se encoja.
- `grid` + `grid-cols-3` + `gap-4`; `col-span-2` para que un elemento ocupe dos columnas.

## Diseño responsive

Tailwind es **mobile first**: las clases sin prefijo se aplican siempre, y los prefijos de breakpoint se aplican **a partir de** ese ancho.

| Prefijo | Ancho mínimo |
| --- | --- |
| `sm:` | 640 px |
| `md:` | 768 px |
| `lg:` | 1024 px |
| `xl:` | 1280 px |
| `2xl:` | 1536 px |

```html
<section class="flex flex-col gap-8 md:flex-row md:items-center">
    <img src="/foto.jpg" alt="Equipo trabajando" class="w-full rounded-lg md:w-1/2" />
    <div class="text-center md:text-left">
        <h2 class="text-2xl font-bold md:text-4xl">Aprende a tu ritmo</h2>
        <p class="mt-4 text-gray-600">En el móvil va debajo de la imagen; en escritorio, al lado.</p>
    </div>
</section>
```

Léelo así: "en columna; **desde** `md`, en fila". Diseña primero para el móvil y añade prefijos para pantallas mayores.

> **Atención:** `sm:` no significa "en móviles". Significa "desde 640 px en adelante". Para estilos solo de móvil, pon la clase sin prefijo y anúlala en el breakpoint: `block md:hidden`.

### Container queries

A veces lo que importa no es el ancho de la pantalla sino el del contenedor (una tarjeta puede estar en una columna estrecha o en una ancha). Marca el contenedor con `@container` y usa los prefijos `@sm:`, `@md:`…:

```html
<div class="@container">
    <div class="flex flex-col @md:flex-row">...</div>
</div>
```

## Estados: hover, focus y más

Los estados también son prefijos:

```html
<button class="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white
               hover:bg-indigo-500
               focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
               active:bg-indigo-700
               disabled:cursor-not-allowed disabled:opacity-50">
    Guardar
</button>
```

Prefijos útiles:

- `hover:`, `focus:`, `focus-visible:` (foco solo con teclado), `active:`, `disabled:`.
- `first:`, `last:`, `odd:`, `even:` para listas y tablas: `odd:bg-gray-50`.
- `placeholder:text-gray-400` para el placeholder de un input.
- `group` y `group-hover:` para reaccionar al hover del padre:

```html
<a href="/curso" class="group block rounded-xl border p-6 hover:border-indigo-500">
    <h3 class="font-semibold group-hover:text-indigo-600">React desde cero</h3>
    <span class="text-sm text-gray-500 group-hover:underline">Ver curso →</span>
</a>
```

- `peer` y `peer-invalid:` para reaccionar a un hermano anterior (por ejemplo, mostrar un error si un input no es válido).

Los prefijos se combinan: `md:hover:bg-indigo-500` aplica el hover solo desde `md`.

> **Importante:** no quites el contorno de foco (`outline-none`) sin poner otro indicador visible. Quien navega con teclado necesita ver dónde está.

## Modo oscuro

El prefijo `dark:` aplica estilos cuando el modo oscuro está activo:

```html
<body class="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <div class="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
        <p class="text-gray-600 dark:text-gray-400">Se adapta solo.</p>
    </div>
</body>
```

Por defecto sigue la preferencia del sistema operativo (`prefers-color-scheme`). Si quieres un botón para cambiarlo manualmente, define la variante para que dependa de una clase `dark` en el `<html>`:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```

```js
// Al pulsar el botón:
document.documentElement.classList.toggle('dark');
localStorage.setItem('tema', document.documentElement.classList.contains('dark') ? 'oscuro' : 'claro');
```

## Personalizar el tema

En la versión 4 el tema se configura **en el CSS** con `@theme`. Cada variable crea las clases correspondientes:

```css
@import "tailwindcss";

@theme {
    --color-marca-50: oklch(0.97 0.02 270);
    --color-marca-500: oklch(0.58 0.2 270);
    --color-marca-700: oklch(0.45 0.18 270);

    --font-display: "Inter", system-ui, sans-serif;

    --breakpoint-3xl: 1920px;
}
```

Con esto ya puedes usar `bg-marca-500`, `text-marca-700`, `font-display` y el prefijo `3xl:`. Además, todas las variables están disponibles como CSS normal: `var(--color-marca-500)`.

Para añadir plugins oficiales, como el de tipografía para textos largos (`prose`):

```bash
npm install @tailwindcss/typography
```

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

```html
<article class="prose dark:prose-invert">
    <!-- HTML generado desde Markdown: títulos, listas y código con estilo -->
</article>
```

> **Nota:** si trabajas en un proyecto con Tailwind 3 verás un `tailwind.config.js` con `theme.extend` y la directiva `@tailwind base`. El concepto es el mismo; la herramienta oficial `npx @tailwindcss/upgrade` migra la mayor parte automáticamente.

## Componentes sin repetir clases

La pregunta típica: "si tengo 20 botones, ¿repito las mismas 12 clases 20 veces?". No. La solución es **extraer componentes**, no clases CSS.

En React (o Vue, o Blade) crea el componente una vez:

```tsx
type Variante = 'primario' | 'secundario' | 'peligro';

const estilos: Record<Variante, string> = {
    primario: 'bg-indigo-600 text-white hover:bg-indigo-500',
    secundario: 'bg-white text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50',
    peligro: 'bg-red-600 text-white hover:bg-red-500',
};

export function Boton({ variante = 'primario', className = '', ...props }:
    React.ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
    return (
        <button
            className={`rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50 ${estilos[variante]} ${className}`}
            {...props}
        />
    );
}
```

Y úsalo donde quieras: `<Boton variante="peligro">Borrar</Boton>`.

> **Consejo:** cuando las clases que llegan por `className` chocan con las del componente (por ejemplo `px-4` y `px-8`), gana la que aparece después en el CSS generado, no la que escribes después. La librería `tailwind-merge` resuelve esos conflictos y suele combinarse con `clsx` en una función `cn()`, que es lo que usan proyectos como shadcn/ui.

¿Y `@apply`? Existe y permite reutilizar utilidades dentro de CSS:

```css
@layer components {
    .btn {
        @apply rounded-lg px-4 py-2 font-semibold;
    }
}
```

Úsalo solo para casos donde no puedes crear un componente (HTML generado por un CMS, estilos de terceros). Si lo usas para todo, vuelves a CSS tradicional con más pasos.

### Ordenar las clases

Con muchas clases, el orden ayuda a leer. El plugin oficial de Prettier las ordena solo:

```bash
npm install -D prettier prettier-plugin-tailwindcss
```

```json
{ "plugins": ["prettier-plugin-tailwindcss"] }
```

## Proyecto: página de producto responsive

Maqueta con Tailwind una página de presentación de un curso:

1. **Navegación** con logo y enlaces; en móvil, un botón que abre y cierra el menú.
2. **Hero** con título grande, subtítulo y dos botones (principal y secundario). En móvil el contenido va centrado; en escritorio, alineado a la izquierda con una imagen a la derecha.
3. **Rejilla de características**: 1 columna en móvil, 2 en tablet y 3 en escritorio, con un icono, título y texto en cada tarjeta.
4. **Tabla de temario** con filas alternas (`odd:`) y scroll horizontal en móvil.
5. **Pie de página** con enlaces en varias columnas.
6. **Modo oscuro** completo con un botón que recuerda la elección en `localStorage`.
7. **Color de marca propio** definido con `@theme` y usado en botones y enlaces.

> **Ejercicio:** revisa la accesibilidad: todos los botones deben tener foco visible, las imágenes `alt`, el contraste del texto gris sobre blanco debe superar 4,5:1 y la página debe poder usarse solo con el teclado.

> **Reto:** convierte la maqueta en componentes de React (`Boton`, `Tarjeta`, `Seccion`) con variantes, sin repetir ninguna lista de clases de más de tres utilidades. Si aún no sabes React, empieza por [React desde cero](/lecciones/react-basico).
