# Expresiones regulares

> Una expresión regular (regex) es un patrón para buscar, validar o transformar texto. Parece un jeroglífico la primera vez, pero con una docena de piezas resolverás el 90 % de los casos: validar un código postal, sacar todos los emails de un texto o renombrar cientos de archivos de golpe. Funcionan casi igual en JavaScript, Python, PHP, Java, tu editor de código y la terminal.

## Para qué sirven

Tres usos que verás constantemente:

| Uso | Ejemplo |
| --- | --- |
| **Validar** | ¿Este texto es un código postal español? |
| **Buscar y extraer** | Saca todas las fechas de un log |
| **Reemplazar** | Cambia `dd/mm/aaaa` por `aaaa-mm-dd` en un archivo entero |

### Dónde practicar

- **regex101.com**: escribes el patrón y el texto, y te explica cada parte. Elige el sabor *ECMAScript (JavaScript)* para seguir este curso.
- La consola del navegador (F12) con JavaScript.
- La búsqueda de VS Code: pulsa el icono `.*` para activar regex.

En JavaScript una regex se escribe entre barras:

```javascript
const patron = /gato/;
patron.test('El gato duerme');   // true
patron.test('El perro duerme');  // false
```

## Caracteres literales y especiales

La mayoría de caracteres se buscan tal cual: `/hola/` encuentra "hola". Pero estos tienen un significado especial:

```text
.  ^  $  *  +  ?  (  )  [  ]  {  }  |  \
```

Para buscarlos de forma literal, se **escapan** con una barra invertida:

```javascript
/3.14/.test('3x14');    // true: el punto significa "cualquier carácter"
/3\.14/.test('3x14');   // false
/3\.14/.test('3.14');   // true
```

> **Atención:** olvidar escapar el punto es el error más común. `/www.google.com/` también encuentra `wwwXgoogleYcom`.

## Clases de caracteres

Los corchetes indican "**uno** de estos caracteres":

| Patrón | Encuentra |
| --- | --- |
| `[aeiou]` | Una vocal |
| `[0-9]` | Un dígito |
| `[a-zA-Z]` | Una letra sin tilde |
| `[^0-9]` | Cualquier cosa que **no** sea un dígito (el `^` dentro de corchetes niega) |

Y hay atajos para las clases más comunes:

| Atajo | Equivale a | Significado |
| --- | --- | --- |
| `\d` | `[0-9]` | Dígito |
| `\w` | `[A-Za-z0-9_]` | Carácter de palabra |
| `\s` | espacio, tabulador, salto de línea… | Espacio en blanco |
| `\D`, `\W`, `\S` | | Lo contrario de cada uno |
| `.` | | Cualquier carácter menos el salto de línea |

```javascript
/\d\d:\d\d/.test('Son las 18:45');   // true
```

> **Nota:** `\w` no incluye letras con tilde ni la ñ. Para texto en español usa `[\p{L}]` con la bandera `u`: `/^\p{L}+$/u.test('Muñoz')` da `true`.

## Cuantificadores

Indican **cuántas veces** se repite lo anterior:

| Cuantificador | Significado |
| --- | --- |
| `*` | 0 o más |
| `+` | 1 o más |
| `?` | 0 o 1 (opcional) |
| `{3}` | Exactamente 3 |
| `{2,4}` | Entre 2 y 4 |
| `{2,}` | 2 o más |

```javascript
/colou?r/.test('color');        // true: la u es opcional
/\d{5}/.test('08221');          // true: cinco dígitos
/ja+/.test('jaaaaa');           // true
```

### Codiciosos y perezosos

Por defecto los cuantificadores son **codiciosos**: cogen todo lo que pueden. Con `?` detrás se vuelven **perezosos**:

```javascript
const html = '<b>uno</b> y <b>dos</b>';
html.match(/<b>.*<\/b>/)[0];    // '<b>uno</b> y <b>dos</b>'
html.match(/<b>.*?<\/b>/)[0];   // '<b>uno</b>'
```

## Anclas y límites

Las anclas no consumen caracteres: marcan **posiciones**.

| Ancla | Posición |
| --- | --- |
| `^` | Inicio del texto (o de la línea con la bandera `m`) |
| `$` | Final del texto (o de la línea con `m`) |
| `\b` | Límite de palabra |

Para **validar**, casi siempre necesitas `^` y `$`; sin ellos basta con que el patrón aparezca en cualquier parte:

```javascript
/\d{5}/.test('abc08221xyz');     // true  (lo contiene)
/^\d{5}$/.test('abc08221xyz');   // false (no es solo eso)
/^\d{5}$/.test('08221');         // true
```

`\b` evita coincidencias dentro de otras palabras:

```javascript
/\bcasa\b/.test('la casa azul');   // true
/\bcasa\b/.test('casamiento');     // false
```

## Grupos y alternativas

Los paréntesis **agrupan** y **capturan**:

```javascript
const fecha = '2026-10-14';
const m = fecha.match(/^(\d{4})-(\d{2})-(\d{2})$/);
m[1]; // '2026'
m[2]; // '10'
m[3]; // '14'
```

Mejor todavía con **grupos con nombre**:

```javascript
const { anio, mes, dia } = fecha.match(/^(?<anio>\d{4})-(?<mes>\d{2})-(?<dia>\d{2})$/).groups;
```

La barra `|` significa "o":

```javascript
/^(gato|perro)$/.test('perro');   // true
```

Si solo necesitas agrupar sin capturar, usa `(?:...)`:

```javascript
/^(?:https?):\/\//.test('https://ejemplo.com');   // true
```

### Referencias hacia atrás

`\1` repite lo que capturó el grupo 1. Sirve, por ejemplo, para detectar palabras repetidas:

```javascript
/\b(\w+) \1\b/.test('esto es es un error');   // true
```

## Banderas

Van detrás de la barra de cierre y cambian el comportamiento:

| Bandera | Efecto |
| --- | --- |
| `g` | Global: todas las coincidencias, no solo la primera |
| `i` | No distingue mayúsculas y minúsculas |
| `m` | `^` y `$` funcionan por línea |
| `u` | Unicode: necesaria para `\p{L}` y emojis |
| `s` | El punto también encuentra saltos de línea |

```javascript
/hola/i.test('HOLA');                     // true
'a1b2c3'.match(/\d/g);                    // ['1', '2', '3']
```

## Regex en JavaScript

Los métodos que más usarás:

```javascript
const texto = 'Pedidos: 12 tazas, 3 mochilas y 7 libretas';

/\d+/.test(texto);                       // true: ¿hay coincidencia?
texto.match(/\d+/g);                     // ['12', '3', '7']
texto.replace(/\d+/g, 'N');              // 'Pedidos: N tazas, N mochilas y N libretas'
texto.split(/,\s*|\s+y\s+/);             // ['Pedidos: 12 tazas', '3 mochilas', '7 libretas']

for (const m of texto.matchAll(/(\d+) (\w+)/g)) {
    console.log(m[2], m[1]);             // tazas 12, mochilas 3, libretas 7
}
```

En `replace`, `$1`, `$2`… insertan los grupos capturados:

```javascript
'14/10/2026'.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1');   // '2026-10-14'
```

Y puedes pasar una función para calcular el reemplazo:

```javascript
'precio: 10 €'.replace(/\d+/, (n) => n * 2);   // 'precio: 20 €'
```

## En otros lenguajes

Las piezas son las mismas; cambia cómo se escriben.

**Python** (usa cadenas `r'...'` para no duplicar las barras):

```python
import re

re.fullmatch(r'\d{5}', '08221')              # coincide: valida el texto entero
re.findall(r'\d+', 'a1 b22 c333')            # ['1', '22', '333']
re.sub(r'(\d{2})/(\d{2})/(\d{4})', r'\3-\2-\1', '14/10/2026')  # '2026-10-14'
```

**PHP** (el patrón va entre delimitadores dentro de un string):

```php
preg_match('/^\d{5}$/', '08221');                     // 1
preg_match_all('/\d+/', 'a1 b22 c333', $m);           // $m[0] = ['1', '22', '333']
preg_replace('/\s+/', ' ', "muchos    espacios");     // 'muchos espacios'
```

En Laravel las usas en la validación: `'codigo_postal' => ['required', 'regex:/^\d{5}$/']`.

**Terminal** (con `grep -E`):

```bash
grep -E '^[0-9]{4}-[0-9]{2}-[0-9]{2}' app.log     # líneas que empiezan por una fecha
grep -oE '[[:alnum:]._%+-]+@[[:alnum:].-]+' contactos.txt   # extraer emails
```

> **Nota:** `grep -E` no entiende `\d`; usa `[0-9]` o `[[:digit:]]`. Con `grep -P` (si está disponible) sí funcionan los atajos de Perl.

## Patrones útiles (y sus límites)

| Qué | Patrón | Ejemplos válidos |
| --- | --- | --- |
| Código postal español | `^(0[1-9]\|[1-4]\d\|5[0-2])\d{3}$` | 08221, 28001 |
| Hora 24 h | `^([01]\d\|2[0-3]):[0-5]\d$` | 09:30, 23:59 |
| Matrícula española actual | `^\d{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$` | 1234BCD |
| Color hexadecimal | `^#([0-9a-fA-F]{3}){1,2}$` | #fff, #10B981 |
| Slug de URL | `^[a-z0-9]+(?:-[a-z0-9]+)*$` | mi-primer-post |

Un patrón dice si el **formato** es correcto, no si el dato es **real**: `^\d{8}[A-Z]$` acepta un DNI con la letra equivocada. La letra hay que calcularla aparte (el número módulo 23).

### Emails

Un patrón "perfecto" para emails ocupa cientos de caracteres y aun así no garantiza que el buzón exista. En la práctica:

```javascript
const pareceEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

Y después confirmas enviando un correo de verificación. En formularios HTML, `<input type="email">` ya hace una comprobación razonable.

> **Importante:** algunos patrones con cuantificadores anidados, como `^(a+)+$`, pueden tardar muchísimo con ciertas entradas (*backtracking catastrófico*, o ReDoS). Nunca construyas una regex con texto del usuario sin escaparlo, y desconfía de patrones con `(algo+)+` o `(.*)*`. Mira [Seguridad básica en la web](/lecciones/seguridad-web).

## Lookarounds

Comprueban lo que hay delante o detrás **sin incluirlo** en la coincidencia:

| Sintaxis | Nombre | Significado |
| --- | --- | --- |
| `(?=...)` | Lookahead positivo | Seguido de… |
| `(?!...)` | Lookahead negativo | No seguido de… |
| `(?<=...)` | Lookbehind positivo | Precedido de… |
| `(?<!...)` | Lookbehind negativo | No precedido de… |

```javascript
'100€ y 200$'.match(/\d+(?=€)/g);        // ['100']
'precio: 50'.match(/(?<=precio: )\d+/)[0];  // '50'
```

Un uso clásico es comprobar varias reglas a la vez en una contraseña:

```javascript
// Al menos 12 caracteres, una mayúscula, una minúscula y un dígito
const segura = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{12,}$/;
segura.test('Aprende2026ya');   // true
segura.test('aprende2026ya');   // false
```

> **Consejo:** si una regex no cabe en una línea o necesitas leerla tres veces, probablemente sea mejor dividir la validación en varias comprobaciones con código normal. Es más fácil de mantener y de explicar en un mensaje de error.

## Proyecto: limpiador de datos

Escribe un script de Node.js (o Python) que reciba un CSV de contactos mal escrito y lo deje limpio:

1. Quita los espacios de sobra al principio, al final y repetidos en medio de cada campo.
2. Normaliza los teléfonos españoles a `+34 600 000 000`, aceptando entradas como `600000000`, `600-00-00-00` o `0034 600 000 000`.
3. Pasa las fechas `dd/mm/aaaa` a `aaaa-mm-dd`.
4. Marca como dudosos los emails que no cumplan el patrón básico.
5. Escribe un resumen: cuántas filas se han corregido y cuántas tienen datos dudosos.

> **Ejercicio:** escribe una regex que encuentre en un texto las palabras repetidas seguidas sin distinguir mayúsculas (`El el perro`) y otra que reemplace esas repeticiones por una sola palabra.

> **Reto:** crea un pequeño "resaltador de sintaxis" para JSON: una función que reciba un texto JSON y devuelva HTML con los strings, números, `true`/`false`/`null` y las claves en `<span>` con clases distintas. Pista: una sola regex global con varios grupos alternativos y `replace` con una función. Si quieres ver una solución real, esta web resalta su propio código así.
