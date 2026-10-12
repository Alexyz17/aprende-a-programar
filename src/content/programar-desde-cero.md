# Programar desde cero

> Este curso no da nada por sabido. Si nunca has escrito una línea de código, estás en el sitio adecuado. Solo necesitas un navegador.

## Qué es programar

Un ordenador es una máquina muy rápida y muy obediente, pero que no entiende nada por sí misma. **Programar es escribir instrucciones precisas** para que el ordenador haga una tarea: calcular un precio, mostrar una web, guardar un mensaje o encender una luz.

Esas instrucciones se escriben en un **lenguaje de programación**: un idioma con reglas estrictas que tanto las personas como el ordenador pueden leer. Hay muchos (Python, JavaScript, PHP, Java…) y todos comparten las mismas ideas básicas. Si aprendes bien esas ideas en uno, aprender el siguiente es mucho más fácil.

Piensa en una receta de cocina:

1. Precalienta el horno a 180 grados.
2. Mezcla la harina con los huevos.
3. Si la masa está muy espesa, añade un poco de leche.
4. Repite el batido hasta que no queden grumos.
5. Hornea 30 minutos.

En esa receta ya aparecen casi todos los conceptos de este curso: **pasos en orden**, **datos** (180 grados, 30 minutos), **decisiones** ("si la masa está espesa…") y **repeticiones** ("repite hasta que…"). Programar es escribir recetas para una máquina que lo hace todo al pie de la letra.

> **Nota:** el ordenador no "adivina" lo que quieres decir. Si te olvidas un paso o lo escribes mal, hará exactamente lo que pone, aunque no tenga sentido. Por eso los errores son normales y forman parte del trabajo.

## Tu primer programa

Vamos a usar **JavaScript**, porque funciona en cualquier navegador sin instalar nada.

1. Abre el navegador (Chrome, Firefox, Edge…).
2. Pulsa `F12` (o `Cmd + Opción + I` en Mac) para abrir las herramientas de desarrollo.
3. Ve a la pestaña **Consola**.
4. Escribe lo siguiente y pulsa Intro:

```javascript
console.log("Hola, mundo");
```

Acabas de ejecutar tu primer programa. `console.log` es una **instrucción** que muestra un texto en la consola. Lo que va entre comillas es un **texto** (en programación se llama *string*).

Prueba también:

```javascript
console.log(2 + 3);
console.log(10 * 4);
console.log("Tengo " + 25 + " años");
```

El ordenador calcula `2 + 3` y muestra `5`. En la última línea, el `+` **une** textos.

> **Ejercicio:** muestra en la consola tu nombre y la ciudad donde vives en una sola frase.

## Variables: guardar datos

Una **variable** es una caja con nombre donde guardas un dato para usarlo después.

```javascript
let nombre = "Lucía";
let edad = 31;

console.log("Hola, " + nombre);
console.log("El año que viene tendrás " + (edad + 1) + " años");
```

- `let` crea la variable.
- `nombre` y `edad` son los nombres de las cajas.
- `=` significa **"guarda esto en la caja"**, no "es igual que".

Puedes cambiar el contenido de una variable creada con `let`:

```javascript
let puntos = 0;
puntos = puntos + 10;   // ahora vale 10
puntos = puntos + 5;    // ahora vale 15
console.log(puntos);
```

Si un valor no va a cambiar nunca, usa `const`:

```javascript
const IVA = 0.21;
```

### Elige buenos nombres

Los nombres de variables los lees tú (y tus compañeros) mucho más que el ordenador. Compara:

```javascript
let x = 3;           // ¿x de qué?
let numeroDeHijos = 3; // se entiende solo
```

Reglas prácticas: nombres descriptivos, sin espacios ni tildes, empezando por letra. En JavaScript se usa *camelCase*: `precioTotal`, `fechaDeAlta`.

## Tipos de datos

Cada dato tiene un **tipo**, y el tipo decide qué puedes hacer con él.

| Tipo | Ejemplo | Para qué sirve |
| --- | --- | --- |
| Número | `42`, `3.14` | Cálculos |
| Texto (*string*) | `"Hola"` | Nombres, mensajes |
| Booleano | `true`, `false` | Sí / no, verdadero / falso |
| Lista (*array*) | `[1, 2, 3]` | Varios datos en orden |
| Objeto | `{ nombre: "Ana", edad: 30 }` | Datos agrupados con nombre |

Ojo con mezclar tipos:

```javascript
console.log(5 + 5);     // 10   (números: suma)
console.log("5" + 5);   // "55" (texto: une)
```

`"5"` entre comillas es un texto, no un número. Es uno de los errores más típicos al empezar.

## Decisiones: if y else

Los programas toman decisiones con `if` ("si"):

```javascript
let edad = 16;

if (edad >= 18) {
    console.log("Puedes votar");
} else {
    console.log("Todavía no puedes votar");
}
```

Lo que va entre paréntesis es una **condición**: una pregunta cuya respuesta es `true` o `false`.

| Operador | Significado | Ejemplo |
| --- | --- | --- |
| `===` | es igual a | `nota === 10` |
| `!==` | es distinto de | `ciudad !== "Madrid"` |
| `>` / `<` | mayor / menor que | `precio > 100` |
| `>=` / `<=` | mayor o igual / menor o igual | `edad >= 18` |
| `&&` | y (las dos se cumplen) | `edad >= 18 && tieneDni` |
| `\|\|` | o (basta con una) | `esSabado \|\| esDomingo` |
| `!` | no | `!estaLloviendo` |

Puedes encadenar varias opciones:

```javascript
let nota = 7.5;

if (nota >= 9) {
    console.log("Sobresaliente");
} else if (nota >= 7) {
    console.log("Notable");
} else if (nota >= 5) {
    console.log("Aprobado");
} else {
    console.log("Suspenso");
}
```

El ordenador comprueba las condiciones de arriba abajo y ejecuta **solo la primera** que se cumple.

> **Ejercicio:** crea una variable `temperatura` y muestra "Hace frío" si es menor de 10, "Se está bien" entre 10 y 25, y "Hace calor" si es mayor de 25.

## Bucles: repetir sin copiar y pegar

Si quieres mostrar los números del 1 al 100, no vas a escribir 100 líneas. Usas un **bucle**.

### Bucle for

```javascript
for (let i = 1; i <= 5; i++) {
    console.log("Vuelta número " + i);
}
```

Se lee así: "empieza con `i` en 1; mientras `i` sea menor o igual que 5, ejecuta el bloque; después de cada vuelta suma 1 a `i`" (`i++` es lo mismo que `i = i + 1`).

### Bucle while

Repite **mientras** se cumpla una condición:

```javascript
let ahorro = 0;
let semanas = 0;

while (ahorro < 100) {
    ahorro = ahorro + 15;
    semanas = semanas + 1;
}

console.log("Necesitas " + semanas + " semanas");
```

> **Atención:** si la condición nunca deja de cumplirse, el bucle no termina (bucle infinito) y la página se queda colgada. Asegúrate de que algo dentro del bucle hace que la condición acabe siendo falsa.

### Recorrer una lista

```javascript
const compra = ["pan", "leche", "huevos"];

for (const producto of compra) {
    console.log("Comprar: " + producto);
}

console.log("Total de productos: " + compra.length);
```

Las listas empiezan a contar en **0**: `compra[0]` es `"pan"` y `compra[2]` es `"huevos"`.

## Funciones: recetas reutilizables

Una **función** es un bloque de código con nombre que puedes usar tantas veces como quieras.

```javascript
function saludar(nombre) {
    console.log("¡Hola, " + nombre + "!");
}

saludar("Ana");
saludar("Pedro");
```

- `nombre` es un **parámetro**: el dato que la función necesita para trabajar.
- `"Ana"` y `"Pedro"` son los **argumentos**: los valores concretos que le pasas.

Las funciones también pueden **devolver** un resultado con `return`:

```javascript
function precioConIva(precio) {
    return precio * 1.21;
}

const total = precioConIva(100);
console.log(total); // 121
```

¿Por qué son tan importantes?

- **Evitan repetir código.** Si el IVA cambia, lo cambias en un solo sitio.
- **Dan nombre a las ideas.** `precioConIva(100)` se entiende mejor que `100 * 1.21`.
- **Permiten dividir un problema grande** en piezas pequeñas.

> **Ejercicio:** escribe una función `esPar(numero)` que devuelva `true` si el número es par y `false` si no. Pista: el operador `%` da el resto de una división, y un número es par si `numero % 2 === 0`.

## Objetos: agrupar datos

Un **objeto** agrupa datos relacionados con nombre:

```javascript
const libro = {
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    paginas: 471,
    leido: true,
};

console.log(libro.titulo);
console.log(libro.paginas > 300 ? "Libro largo" : "Libro corto");
```

Lo más habitual es tener **listas de objetos**:

```javascript
const alumnos = [
    { nombre: "Ana", nota: 8 },
    { nombre: "Luis", nota: 4 },
    { nombre: "Marta", nota: 9.5 },
];

for (const alumno of alumnos) {
    const resultado = alumno.nota >= 5 ? "aprobado" : "suspenso";
    console.log(alumno.nombre + ": " + resultado);
}
```

Así se representan casi todos los datos de una aplicación real: usuarios, productos, pedidos, mensajes…

## Errores y cómo leerlos

Vas a ver errores constantemente. No significa que lo estés haciendo mal: **es la forma en que el ordenador te dice qué arreglar**.

```javascript
console.log(nombr);
// ReferenceError: nombr is not defined
```

El mensaje dice el **tipo de error** (`ReferenceError`) y la **causa** (`nombr` no existe: hay una errata). Errores típicos al empezar:

- Olvidar cerrar comillas, paréntesis o llaves.
- Escribir mal el nombre de una variable (las mayúsculas cuentan: `Nombre` y `nombre` son distintas).
- Mezclar textos y números sin querer.
- Usar una variable antes de crearla.

Método para resolver un error:

1. **Lee el mensaje entero**, aunque esté en inglés. Suele decir la línea exacta.
2. **Mira esa línea y la anterior**.
3. **Reduce el problema**: comenta partes del código hasta encontrar la que falla.
4. **Muestra valores** con `console.log` para comprobar qué contienen tus variables.
5. **Busca el mensaje** en internet: casi seguro que alguien tuvo el mismo problema.

## Pensar como programador

Programar no es memorizar instrucciones: es **resolver problemas**. Antes de escribir código:

1. **Entiende el problema.** ¿Qué datos tienes? ¿Qué resultado quieres?
2. **Resuélvelo a mano** con un ejemplo pequeño.
3. **Escribe los pasos en tu idioma** (pseudocódigo).
4. **Tradúcelo a código** poco a poco, probando cada paso.

Ejemplo: "calcular la nota media de una clase".

```text
Datos: una lista de notas.
Resultado: un número, la media.
Pasos:
  - empezar con suma = 0
  - para cada nota, sumarla a "suma"
  - dividir la suma entre el número de notas
```

```javascript
function media(notas) {
    let suma = 0;
    for (const nota of notas) {
        suma = suma + nota;
    }
    return suma / notas.length;
}

console.log(media([7, 8.5, 6, 9])); // 7.625
```

> **Reto:** escribe una función que reciba una lista de números y devuelva el mayor. No uses `Math.max`: recórrela con un bucle y guarda el mayor que hayas visto hasta el momento.

## Y ahora, ¿qué?

Ya conoces los cimientos de cualquier lenguaje: variables, tipos, condiciones, bucles, funciones y objetos. A partir de aquí:

- Si te interesa la **web**, sigue con [HTML y CSS desde cero](/lecciones/html-css) y [JavaScript moderno](/lecciones/javascript-moderno).
- Si prefieres un lenguaje muy legible y útil para datos e IA, prueba [Python desde cero](/lecciones/python-basico).
- Aprende a guardar tu código con [Git esencial](/lecciones/git-esencial): lo usarás en cualquier trabajo.
- Mira todas las [rutas de aprendizaje](/rutas) para elegir un camino.

Y sobre todo: **programa un poco cada día**. Practicar 20 minutos diarios funciona mucho mejor que una tarde entera una vez al mes.
