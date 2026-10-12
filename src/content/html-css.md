# HTML y CSS desde cero

> Toda web que visitas está hecha de tres piezas: **HTML** (la estructura), **CSS** (el aspecto) y **JavaScript** (el comportamiento). En este curso dominarás las dos primeras y construirás una página completa, adaptable al móvil y accesible.

## Cómo funciona una página web

Cuando escribes una dirección en el navegador:

1. El navegador pide la página a un **servidor**.
2. El servidor devuelve un archivo **HTML**.
3. El navegador lee el HTML, descarga lo que este enlaza (hojas de estilo CSS, imágenes, scripts) y **dibuja** la página.

Para practicar solo necesitas un editor de texto (te recomendamos [Visual Studio Code](https://code.visualstudio.com/), gratuito) y un navegador. Crea una carpeta `mi-web` con un archivo `index.html` y ábrelo con doble clic.

> **Consejo:** en VS Code instala la extensión *Live Server*. Recarga el navegador sola cada vez que guardas.

## Tu primer documento HTML

HTML usa **etiquetas** que envuelven el contenido: `<etiqueta>contenido</etiqueta>`.

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mi primera web</title>
  </head>
  <body>
    <h1>Hola, soy Lucía</h1>
    <p>Estoy aprendiendo a hacer páginas web.</p>
  </body>
</html>
```

- `<!doctype html>` indica que es HTML moderno.
- `<html lang="es">` es la raíz; `lang` ayuda a los lectores de pantalla y a los buscadores.
- `<head>` contiene información **sobre** la página (no se ve): codificación, título de la pestaña, estilos.
- `<meta name="viewport">` es imprescindible para que la página se vea bien en móvil.
- `<body>` contiene todo lo que se ve.

## Texto, enlaces e imágenes

### Títulos y párrafos

```html
<h1>Título principal (uno por página)</h1>
<h2>Sección</h2>
<h3>Subsección</h3>
<p>Un párrafo con <strong>texto importante</strong> y <em>texto enfatizado</em>.</p>
```

Los títulos `h1`–`h6` forman el **esquema** del documento. No los elijas por su tamaño (eso es trabajo de CSS), sino por su jerarquía.

### Listas

```html
<ul>
  <li>Lista sin orden</li>
  <li>Otro elemento</li>
</ul>

<ol>
  <li>Primer paso</li>
  <li>Segundo paso</li>
</ol>
```

### Enlaces

```html
<a href="https://developer.mozilla.org/es/">Documentación de MDN</a>
<a href="contacto.html">Página de contacto</a>
<a href="#precios">Ir a la sección de precios</a>
```

El texto del enlace debe describir el destino. Evita "haz clic aquí": quien navega con lector de pantalla suele escuchar solo la lista de enlaces.

### Imágenes

```html
<img src="foto.jpg" alt="Perro labrador corriendo por la playa" width="800" height="600">
```

El atributo `alt` describe la imagen para quien no puede verla. Si es puramente decorativa, deja `alt=""`. Indicar `width` y `height` evita que la página "salte" mientras carga.

## HTML semántico

Usar la etiqueta que **significa** lo que contiene hace tu web más accesible, mejor posicionada en buscadores y más fácil de mantener.

```html
<body>
  <header>
    <nav>
      <a href="/">Inicio</a>
      <a href="/blog">Blog</a>
    </nav>
  </header>

  <main>
    <article>
      <h1>Cómo aprendí a programar</h1>
      <p>…</p>
    </article>
    <aside>Artículos relacionados</aside>
  </main>

  <footer>© 2026 Lucía</footer>
</body>
```

| Etiqueta | Uso |
| --- | --- |
| `header` | Cabecera de la página o de una sección |
| `nav` | Navegación principal |
| `main` | Contenido principal (una vez por página) |
| `article` | Contenido independiente: un post, una noticia |
| `section` | Sección temática con su propio título |
| `aside` | Contenido relacionado pero secundario |
| `footer` | Pie de página |
| `button` | Una acción (enviar, abrir, cerrar) |
| `a` | Un enlace a otra página o sección |

> **Atención:** no uses un `<div>` con un evento de clic como si fuera un botón. Un `<button>` real funciona con teclado y lector de pantalla sin hacer nada extra.

## Formularios

```html
<form action="/suscribirse" method="post">
  <label for="email">Correo electrónico</label>
  <input id="email" name="email" type="email" required autocomplete="email">

  <label for="tema">Tema favorito</label>
  <select id="tema" name="tema">
    <option>Frontend</option>
    <option>Backend</option>
  </select>

  <fieldset>
    <legend>Nivel</legend>
    <label><input type="radio" name="nivel" value="inicial" checked> Inicial</label>
    <label><input type="radio" name="nivel" value="medio"> Medio</label>
  </fieldset>

  <label>
    <input type="checkbox" name="acepto" required>
    Acepto recibir correos
  </label>

  <button type="submit">Suscribirme</button>
</form>
```

Claves:

- Cada campo necesita un `<label>` asociado con `for` e `id`. Así, al pulsar el texto se activa el campo y el lector de pantalla lo anuncia.
- Los tipos (`email`, `number`, `date`, `tel`, `url`) muestran el teclado adecuado en móvil y validan automáticamente.
- `required`, `min`, `max`, `minlength` y `pattern` validan en el navegador, pero **la validación de verdad siempre se hace en el servidor**.

## CSS: dar estilo

CSS se escribe en un archivo aparte y se enlaza desde el `<head>`:

```html
<link rel="stylesheet" href="estilos.css">
```

Una regla CSS tiene un **selector** (a qué elementos afecta) y **declaraciones** (qué cambia):

```css
h1 {
  color: #1e293b;
  font-size: 2.5rem;
}

.destacado {
  background-color: #fef3c7;
  padding: 1rem;
}

#cabecera {
  border-bottom: 1px solid #e2e8f0;
}
```

### Selectores más usados

| Selector | Selecciona |
| --- | --- |
| `p` | Todos los párrafos |
| `.tarjeta` | Elementos con `class="tarjeta"` |
| `#menu` | El elemento con `id="menu"` |
| `nav a` | Enlaces dentro de un `nav` |
| `ul > li` | `li` hijos directos de un `ul` |
| `a:hover` | Enlaces con el ratón encima |
| `input:focus` | El campo que tiene el foco |
| `li:nth-child(2n)` | Los `li` pares |

### La cascada y la especificidad

Cuando varias reglas afectan al mismo elemento, gana:

1. La de mayor **especificidad**: `#id` > `.clase` > `etiqueta`.
2. Con la misma especificidad, la que aparece **después**.

```css
p { color: gray; }
.aviso { color: orange; }   /* gana sobre p */
p.aviso { color: red; }     /* gana sobre .aviso: más específica */
```

> **Consejo:** usa sobre todo clases. Los `id` en CSS crean reglas difíciles de sobrescribir y `!important` suele indicar un problema de organización.

## Colores, tipografía y unidades

```css
:root {
  --color-primario: #4f46e5;
  --color-texto: #1f2937;
  --radio: 0.75rem;
}

body {
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-texto);
}

.boton {
  background: var(--color-primario);
  color: white;
  border-radius: var(--radio);
}
```

Las **variables CSS** (`--nombre`) permiten cambiar el diseño desde un solo sitio, por ejemplo para un tema oscuro.

| Unidad | Relativa a | Uso típico |
| --- | --- | --- |
| `px` | Nada (fija) | Bordes finos |
| `rem` | Tamaño de letra raíz | Tamaños de texto, espaciados |
| `em` | Tamaño de letra del elemento | Espaciado dentro de un componente |
| `%` | El contenedor | Anchos |
| `vw` / `vh` | El ancho / alto de la ventana | Secciones a pantalla completa |

Usa `rem` para el texto: respeta el tamaño de letra que la persona ha configurado en su navegador.

## El modelo de caja

Todo elemento es una **caja** formada por cuatro capas, de dentro hacia fuera:

```text
┌────────────── margin ──────────────┐
│ ┌──────────── border ────────────┐ │
│ │ ┌────────── padding ─────────┐ │ │
│ │ │          contenido         │ │ │
│ │ └────────────────────────────┘ │ │
│ └────────────────────────────────┘ │
└────────────────────────────────────┘
```

```css
.tarjeta {
  width: 300px;
  padding: 1.5rem;          /* espacio interior */
  border: 1px solid #ddd;   /* borde */
  margin: 1rem auto;        /* espacio exterior; auto centra horizontalmente */
}
```

Por defecto, `width` mide solo el contenido, así que la tarjeta anterior ocuparía 300 + 48 + 2 píxeles. Casi todos los proyectos empiezan con:

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

Con `border-box`, el `width` incluye padding y borde: mucho más intuitivo.

## Flexbox: alinear en una dirección

Flexbox coloca elementos en **fila o columna** y reparte el espacio entre ellos.

```css
.barra {
  display: flex;
  justify-content: space-between; /* eje principal: horizontal */
  align-items: center;            /* eje cruzado: vertical */
  gap: 1rem;                      /* separación entre hijos */
}
```

```html
<header class="barra">
  <a href="/" class="logo">MiWeb</a>
  <nav>…</nav>
  <button>Entrar</button>
</header>
```

Propiedades clave:

| En el contenedor | Efecto |
| --- | --- |
| `flex-direction: row \| column` | Dirección del eje principal |
| `justify-content` | Reparto en el eje principal (`flex-start`, `center`, `space-between`…) |
| `align-items` | Alineación en el eje cruzado |
| `flex-wrap: wrap` | Permite saltar de línea |
| `gap` | Espacio entre elementos |

| En los hijos | Efecto |
| --- | --- |
| `flex: 1` | Ocupa el espacio sobrante |
| `flex-shrink: 0` | No se encoge |
| `align-self` | Alineación propia |

Centrar algo en ambos ejes, el clásico problema, se resuelve así:

```css
.centrado {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

## Grid: diseñar en dos dimensiones

Grid controla **filas y columnas** a la vez. Es ideal para el esqueleto de la página y para galerías.

```css
.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}
```

Esa línea crea tantas columnas de al menos 220 px como quepan, y reparte el sobrante. Es responsive sin una sola media query.

Un esqueleto de página con zonas con nombre:

```css
.pagina {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-areas:
    "cabecera cabecera"
    "lateral  contenido"
    "pie      pie";
  gap: 1rem;
}
.pagina > header { grid-area: cabecera; }
.pagina > aside  { grid-area: lateral; }
.pagina > main   { grid-area: contenido; }
.pagina > footer { grid-area: pie; }
```

> **Consejo:** Flexbox para alinear elementos en una línea (una barra, una fila de botones); Grid para el diseño general y las cuadrículas.

## Diseño responsive

Más de la mitad de las visitas llegan desde el móvil. La estrategia recomendada es **mobile first**: estilos base para pantallas pequeñas y media queries para ampliar.

```css
.tarjetas {
  display: grid;
  gap: 1rem;
}

@media (min-width: 640px) {
  .tarjetas { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .tarjetas { grid-template-columns: repeat(3, 1fr); }
}
```

Otras técnicas:

- Imágenes fluidas: `img { max-width: 100%; height: auto; }`.
- Tamaños flexibles con `clamp()`: `font-size: clamp(1.75rem, 4vw, 3rem);`.
- Comprueba siempre en el modo de dispositivo de las herramientas del navegador (`Ctrl + Shift + M` en Chrome).

## Accesibilidad básica

Una web accesible funciona para todo el mundo: personas ciegas que usan lector de pantalla, personas que navegan solo con teclado, personas mayores o con poca visión… y también para ti con el móvil a pleno sol.

Lista de comprobación:

- **HTML semántico**: `button` para acciones, `a` para enlaces, títulos en orden.
- **Texto alternativo** en las imágenes con contenido.
- **Etiquetas** en todos los campos de formulario.
- **Contraste** suficiente: al menos 4,5:1 para texto normal. Las herramientas del navegador lo miden.
- **Foco visible**: nunca quites el contorno de foco sin poner otro.
- **Navegación con teclado**: recorre tu página solo con `Tab`, `Shift + Tab`, `Intro` y `Espacio`.
- **No dependas solo del color**: un error en un formulario necesita también un texto.

```css
:focus-visible {
  outline: 3px solid #4f46e5;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

## Proyecto: tu tarjeta de presentación

Junta todo lo aprendido en una página personal.

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lucía Pérez — Desarrolladora web</title>
  <link rel="stylesheet" href="estilos.css">
</head>
<body>
  <main class="tarjeta">
    <img src="foto.jpg" alt="Lucía sonriendo" width="120" height="120" class="avatar">
    <h1>Lucía Pérez</h1>
    <p class="rol">Desarrolladora web junior</p>
    <p>Me gusta construir páginas rápidas y accesibles.</p>
    <ul class="enlaces">
      <li><a href="https://github.com/">GitHub</a></li>
      <li><a href="mailto:lucia@ejemplo.com">Correo</a></li>
    </ul>
  </main>
</body>
</html>
```

```css
*, *::before, *::after { box-sizing: border-box; }

:root {
  --fondo: #f8fafc;
  --texto: #0f172a;
  --primario: #4f46e5;
}

@media (prefers-color-scheme: dark) {
  :root { --fondo: #0f172a; --texto: #e2e8f0; --primario: #818cf8; }
}

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1rem;
  font-family: system-ui, sans-serif;
  background: var(--fondo);
  color: var(--texto);
}

.tarjeta {
  max-width: 24rem;
  text-align: center;
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid color-mix(in srgb, var(--texto) 15%, transparent);
}

.avatar { border-radius: 50%; }
.rol { color: var(--primario); font-weight: 600; }

.enlaces {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 0;
  list-style: none;
}

.enlaces a { color: var(--primario); }
```

> **Reto:** añade una sección "Proyectos" con una cuadrícula de tarjetas que muestre una columna en móvil y tres en escritorio. Después, publícala gratis con GitLab Pages o GitHub Pages siguiendo [Git esencial](/lecciones/git-esencial).

## Siguientes pasos

- Da vida a tu página con [JavaScript moderno](/lecciones/javascript-moderno).
- Practica con el [test de HTML y CSS](/juegos/quiz-html-css).
- Referencia imprescindible: la documentación de [MDN en español](https://developer.mozilla.org/es/).
