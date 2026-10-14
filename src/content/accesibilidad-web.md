# Accesibilidad web

> Una web accesible es una web que puede usar todo el mundo: quien no ve la pantalla, quien navega solo con el teclado, quien necesita el texto más grande o quien tiene una mano escayolada y el móvil en la otra. No es un extra para el final: es parte de hacer bien el trabajo y, en muchos casos, una obligación legal.

## Por qué importa

- En la Unión Europea hay unos **100 millones** de personas con alguna discapacidad, y todos tenemos limitaciones temporales o de contexto: sol en la pantalla, un brazo ocupado, una conexión lenta.
- Desde el 28 de junio de 2025 la **Ley Europea de Accesibilidad** (en España, la Ley 11/2023) exige que muchos servicios privados sean accesibles: comercio electrónico, banca, transporte, libros electrónicos… Las administraciones públicas ya estaban obligadas desde antes.
- Lo que ayuda a la accesibilidad ayuda a todo el mundo: buen contraste, textos claros, formularios con etiquetas y una estructura ordenada también mejoran el SEO y la usabilidad.

### WCAG en cuatro palabras

La referencia mundial son las pautas **WCAG** (*Web Content Accessibility Guidelines*), versión 2.2. El nivel que se exige casi siempre es el **AA**. Se organizan en cuatro principios, que en inglés forman la palabra **POUR**:

| Principio | Pregunta |
| --- | --- |
| **Perceptible** | ¿Se puede percibir con más de un sentido? (texto alternativo, subtítulos, contraste) |
| **Operable** | ¿Se puede usar con teclado, sin prisas y sin provocar crisis? |
| **Comprensible** | ¿Se entiende el texto y el comportamiento es predecible? |
| **Robusto** | ¿Funciona con distintos navegadores y tecnologías de apoyo? |

## Cómo navega la gente

Antes de tocar código, conviene saber cómo se usa una web sin ratón o sin ver la pantalla:

- **Lectores de pantalla**: leen en voz alta el contenido y la función de cada elemento. NVDA (gratis, Windows), VoiceOver (incluido en macOS e iOS) y TalkBack (Android).
- **Teclado**: `Tab` y `Mayús + Tab` para moverse entre elementos interactivos, `Enter` y `Espacio` para activar, flechas dentro de menús y listas.
- **Ampliación**: zoom del navegador al 200 % o más, o ampliadores de pantalla.
- **Control por voz** y **conmutadores** para personas con movilidad reducida.

> **Ejercicio:** desconecta el ratón (o no lo toques) y completa una compra o un registro en tu web favorita usando solo el teclado. Apunta cada momento en que te quedas atascado. Después, activa el lector de pantalla de tu sistema y escucha la portada con los ojos cerrados.

## HTML semántico: la base de todo

La mayor parte de la accesibilidad sale **gratis** si usas el elemento HTML correcto. Un lector de pantalla sabe qué es un `<button>`, un `<nav>` o un `<h2>`; no sabe qué es un `<div class="boton">`.

```html
<!-- Mal: no se puede usar con teclado y el lector no sabe que es un botón -->
<div class="boton" onclick="guardar()">Guardar</div>

<!-- Bien: foco, Enter, Espacio y su función se anuncian solos -->
<button type="button" onclick="guardar()">Guardar</button>
```

| Usa | Para |
| --- | --- |
| `<button>` | Acciones (guardar, abrir un menú, enviar) |
| `<a href>` | Navegar a otra página o a un ancla |
| `<header>`, `<nav>`, `<main>`, `<footer>` | Las regiones de la página: el lector permite saltar entre ellas |
| `<h1>` a `<h6>` | Títulos en orden, sin saltar niveles. Un solo `<h1>` por página |
| `<ul>`, `<ol>` | Listas: se anuncia cuántos elementos tienen |
| `<table>` con `<th>` | Datos tabulares, nunca para maquetar |

Además, declara el idioma de la página para que el lector use la pronunciación correcta:

```html
<html lang="es">
```

> **Consejo:** muchos usuarios de lectores de pantalla navegan saltando de título en título. Si tus `<h2>` y `<h3>` resumen bien cada sección, pueden encontrar lo que buscan en segundos.

## Imágenes y contenido multimedia

Toda imagen necesita un atributo `alt`, pero su contenido depende de para qué sirve la imagen:

```html
<!-- Informativa: describe lo que aporta -->
<img src="grafico.png" alt="Las ventas crecieron un 40 % entre enero y junio">

<!-- Decorativa: alt vacío para que el lector la ignore -->
<img src="adorno.svg" alt="">

<!-- Funcional (dentro de un enlace o botón): describe la acción -->
<a href="/"><img src="logo.svg" alt="Inicio"></a>
```

- No empieces con "Imagen de…": el lector ya dice que es una imagen.
- Si un icono va junto a un texto que dice lo mismo, el icono es decorativo (`alt=""` o `aria-hidden="true"`).
- Los **vídeos** necesitan subtítulos, y el audio importante, una transcripción.
- Nada debe parpadear más de tres veces por segundo: puede provocar crisis epilépticas.

## Color y contraste

El texto debe contrastar lo suficiente con su fondo:

| Texto | Contraste mínimo (AA) |
| --- | --- |
| Normal | **4,5 : 1** |
| Grande (24 px, o 18,5 px en negrita) | **3 : 1** |
| Iconos y bordes de controles | **3 : 1** |

El gris claro sobre blanco que tanto se ve suele suspender. Compruébalo con las herramientas de desarrollo del navegador (al inspeccionar un texto se muestra su contraste) o con cualquier comprobador de contraste.

Y **nunca uses solo el color** para transmitir información:

```html
<!-- Mal: solo el borde rojo indica el error -->
<input class="borde-rojo">

<!-- Bien: color + icono + texto -->
<input aria-invalid="true" aria-describedby="error-email">
<p id="error-email">⚠ El email no tiene un formato válido</p>
```

Unas 1 de cada 12 personas con cromosomas XY tienen algún tipo de daltonismo: un gráfico con una línea roja y otra verde puede ser ilegible para ellas.

## Teclado y foco

Todo lo que se puede hacer con el ratón se tiene que poder hacer con el teclado.

### El foco siempre visible

El contorno que marca el elemento con foco es imprescindible para quien navega con teclado. **Nunca lo quites sin poner otro**:

```css
/* Mal */
*:focus { outline: none; }

/* Bien: visible al usar el teclado, sin molestar al hacer clic */
:focus-visible {
    outline: 3px solid #047857;
    outline-offset: 2px;
}
```

### Orden lógico

El foco sigue el orden del HTML. Si reordenas visualmente con CSS (`order`, `flex-direction: row-reverse`, posiciones absolutas), el orden del teclado puede quedar absurdo.

`tabindex`:

- `tabindex="0"`: hace enfocable un elemento que no lo es (y te obliga a gestionar su teclado; normalmente es mejor usar un `<button>`).
- `tabindex="-1"`: enfocable por código (`elemento.focus()`), pero no con `Tab`.
- Valores positivos (`tabindex="5"`): **no los uses**, rompen el orden natural.

### Enlace para saltar al contenido

El primer elemento de la página debería permitir saltarse el menú:

```html
<a href="#contenido" class="saltar">Saltar al contenido</a>
...
<main id="contenido">
```

```css
.saltar { position: absolute; left: -9999px; }
.saltar:focus { left: 1rem; top: 1rem; }
```

Esta misma web tiene uno: pulsa `Tab` nada más cargar cualquier página.

## Formularios accesibles

Cada campo necesita una **etiqueta** asociada. El `placeholder` no sirve como etiqueta: desaparece al escribir y suele tener poco contraste.

```html
<label for="email">Email</label>
<input id="email" name="email" type="email" autocomplete="email" required
       aria-describedby="email-ayuda">
<p id="email-ayuda">Te enviaremos la confirmación aquí.</p>
```

- `for` + `id` asocian la etiqueta: al hacer clic en el texto se enfoca el campo y el lector anuncia "Email, campo de edición, obligatorio".
- `autocomplete` permite que el navegador rellene datos conocidos: ayuda a todo el mundo y especialmente a personas con dificultades motoras o cognitivas.
- `type="email"`, `type="tel"` o `inputmode="numeric"` muestran el teclado adecuado en el móvil.
- Agrupa opciones relacionadas con `<fieldset>` y `<legend>`.

### Errores

```html
<label for="cp">Código postal</label>
<input id="cp" aria-invalid="true" aria-describedby="cp-error">
<p id="cp-error" role="alert">El código postal debe tener 5 dígitos.</p>
```

- Explica **qué** está mal y **cómo** arreglarlo.
- `role="alert"` hace que el lector lo anuncie al aparecer.
- Con muchos errores, muestra un resumen arriba con enlaces a cada campo y mueve el foco a ese resumen.

## ARIA: solo cuando el HTML no llega

**ARIA** son atributos que añaden información para las tecnologías de apoyo: roles, estados y relaciones. La primera regla de ARIA es **no usar ARIA** si existe un elemento HTML que ya hace lo que necesitas. Un ARIA mal usado es peor que ninguno.

Los atributos que más usarás:

| Atributo | Para qué |
| --- | --- |
| `aria-label` | Nombre accesible cuando no hay texto visible (un botón con solo un icono) |
| `aria-labelledby` | El nombre lo da otro elemento por su `id` |
| `aria-describedby` | Información adicional (ayudas, errores) |
| `aria-expanded` | Si un menú o acordeón está abierto |
| `aria-pressed` | Si un botón conmutador está activado |
| `aria-current="page"` | El enlace de la página actual en un menú |
| `aria-hidden="true"` | Oculta algo decorativo al lector (nunca en elementos enfocables) |
| `aria-live="polite"` | Anuncia cambios en una zona (resultados de búsqueda, mensajes) |

Un botón de menú bien hecho:

```html
<button type="button" aria-expanded="false" aria-controls="menu">
    <svg aria-hidden="true">...</svg>
    <span class="sr-only">Abrir menú</span>
</button>
<ul id="menu" hidden>...</ul>
```

```javascript
boton.addEventListener('click', () => {
    const abierto = boton.getAttribute('aria-expanded') === 'true';
    boton.setAttribute('aria-expanded', String(!abierto));
    menu.hidden = abierto;
});
```

La clase `sr-only` oculta un texto visualmente pero lo deja para los lectores de pantalla:

```css
.sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}
```

## Componentes interactivos

Los componentes complejos (ventanas modales, pestañas, menús desplegables, carruseles) son donde más se rompe la accesibilidad. Para cada uno hay un patrón documentado en la **ARIA Authoring Practices Guide** (APG) del W3C, con el teclado y los roles esperados.

### Ventanas modales

Desde hace poco el HTML tiene un elemento nativo que resuelve casi todo:

```html
<dialog id="confirmar" aria-labelledby="titulo-confirmar">
    <h2 id="titulo-confirmar">¿Borrar el proyecto?</h2>
    <p>Esta acción no se puede deshacer.</p>
    <form method="dialog">
        <button value="cancelar">Cancelar</button>
        <button value="borrar">Borrar</button>
    </form>
</dialog>
```

```javascript
document.getElementById('confirmar').showModal();
```

Con `showModal()` el navegador mueve el foco dentro, lo mantiene ahí, cierra con `Esc`, deja el resto de la página inerte y, al cerrarse, devuelve el foco al elemento que lo abrió.

### En React

Los mismos principios aplican en cualquier framework:

```tsx
function BotonFavorito({ activo, onToggle }: { activo: boolean; onToggle: () => void }) {
    return (
        <button type="button" aria-pressed={activo} onClick={onToggle}>
            <Estrella aria-hidden />
            <span className="sr-only">Favorito</span>
        </button>
    );
}
```

- En JSX es `htmlFor` en lugar de `for`.
- Cuando cambias de "página" en una SPA, mueve el foco al nuevo `<h1>` o anuncia el cambio: el lector no se entera solo.
- Librerías como Radix UI o React Aria traen componentes accesibles ya resueltos. Mira [React desde cero](/lecciones/react-basico).

## Movimiento, tiempo y lectura

- **Animaciones**: respeta la preferencia del sistema para reducir el movimiento.

```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

- **Tiempo**: si una sesión caduca o hay una cuenta atrás, avisa antes y permite ampliarla.
- **Zoom**: la página debe funcionar al 200 % y con texto agrandado. Usa `rem` para tamaños de letra y no bloquees el zoom con `maximum-scale=1` en la etiqueta viewport.
- **Objetivos táctiles**: botones y enlaces de al menos 24 × 24 px (WCAG 2.2), mejor 44 × 44 en móvil.
- **Lenguaje claro**: frases cortas, palabras comunes, una idea por párrafo y enlaces que digan a dónde llevan. "Descarga la guía en PDF" es mejor que "Haz clic aquí".

## Probar la accesibilidad

Las herramientas automáticas encuentran entre un 30 y un 40 % de los problemas. El resto exige probar a mano.

**Automático:**

- **Lighthouse** (en las herramientas de Chrome) y la extensión **axe DevTools**: auditan la página y explican cada fallo.
- **eslint-plugin-jsx-a11y** en proyectos React: avisa mientras escribes.
- Tests con **axe-core** o con Testing Library, que busca elementos como lo haría una persona:

```javascript
// Si este test encuentra el botón por su nombre, un lector de pantalla también lo hará
screen.getByRole('button', { name: 'Guardar' });
screen.getByLabelText('Email');
```

Mira [Testing para desarrolladores web](/lecciones/testing).

**Manual, en cada pantalla:**

1. Recórrela solo con el teclado: ¿llegas a todo?, ¿se ve siempre el foco?, ¿el orden tiene sentido?
2. Haz zoom al 200 %: ¿se lee todo sin scroll horizontal?
3. Escucha la página con un lector de pantalla: ¿se entiende cada botón y cada imagen?
4. Revisa los contrastes y que ningún dato dependa solo del color.
5. Envía un formulario con errores: ¿se anuncian y se entiende cómo corregirlos?

## Proyecto: auditoría y arreglo

Elige una web pequeña (un proyecto tuyo, la web de una asociación, una página de ejemplo con fallos) y haz una auditoría completa:

1. Pasa Lighthouse y axe y anota los fallos.
2. Haz las cinco pruebas manuales de la lista anterior.
3. Escribe un informe breve con cada problema, el criterio WCAG afectado, a quién perjudica y cómo arreglarlo, ordenado por gravedad.
4. Corrige los problemas y vuelve a pasar las pruebas.
5. Añade a tu proyecto la comprobación automática (eslint-plugin-jsx-a11y o tests con axe) para que no vuelvan a aparecer.

> **Ejercicio:** construye un componente de pestañas (*tabs*) accesible siguiendo el patrón de la APG: `role="tablist"`, `role="tab"` con `aria-selected` y `aria-controls`, `role="tabpanel"`, y navegación con las flechas izquierda y derecha.

> **Reto:** crea un formulario de registro de varios pasos totalmente accesible: indicador de progreso que se anuncia ("Paso 2 de 3"), foco en el título de cada paso al avanzar, errores con resumen enlazado y la posibilidad de volver atrás sin perder datos. Pruébalo de principio a fin con NVDA o VoiceOver.
