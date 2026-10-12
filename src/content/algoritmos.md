# Algoritmos y estructuras de datos

> Un algoritmo es una receta para resolver un problema; una estructura de datos es la forma de organizar la información para que esa receta sea eficiente. No hace falta ser matemático: con unas pocas ideas resolverás la mayoría de problemas del día a día y de las entrevistas técnicas. Los ejemplos están en JavaScript y Python.

## Qué es un algoritmo

Un algoritmo es una secuencia finita de pasos que transforma una **entrada** en una **salida**. Ejemplo: encontrar el número mayor de una lista.

```javascript
function maximo(numeros) {
  let mayor = numeros[0];
  for (const n of numeros) {
    if (n > mayor) mayor = n;
  }
  return mayor;
}
```

Hay muchos algoritmos que dan el resultado correcto; la pregunta es **cuánto tardan y cuánta memoria usan** cuando los datos crecen. Con 10 elementos todo es rápido. Con 10 millones, la elección importa.

## Complejidad: la notación Big O

Big O describe **cómo crece** el trabajo de un algoritmo cuando crece el tamaño de la entrada `n`. Ignora detalles constantes y se fija en la tendencia.

| Notación | Nombre | Ejemplo | Con n = 1 000 000 |
| --- | --- | --- | --- |
| O(1) | Constante | Acceder a `lista[5]` o a un mapa por clave | 1 paso |
| O(log n) | Logarítmica | Búsqueda binaria | ~20 pasos |
| O(n) | Lineal | Recorrer una lista una vez | 1 000 000 |
| O(n log n) | Casi lineal | Buenos algoritmos de ordenación | ~20 000 000 |
| O(n²) | Cuadrática | Dos bucles anidados sobre la misma lista | 1 000 000 000 000 |
| O(2ⁿ) | Exponencial | Probar todas las combinaciones | Imposible |

Reglas rápidas para calcularla:

- Un bucle sobre `n` elementos → O(n).
- Un bucle dentro de otro, ambos sobre `n` → O(n²).
- Dividir el problema a la mitad en cada paso → O(log n).
- Pasos seguidos se suman y se queda el mayor: O(n) + O(n²) = O(n²).

```javascript
// O(n²): compara cada elemento con todos los demás
function tieneDuplicadosLento(lista) {
  for (let i = 0; i < lista.length; i++) {
    for (let j = i + 1; j < lista.length; j++) {
      if (lista[i] === lista[j]) return true;
    }
  }
  return false;
}

// O(n): recuerda lo que ya ha visto en un Set
function tieneDuplicados(lista) {
  const vistos = new Set();
  for (const x of lista) {
    if (vistos.has(x)) return true;
    vistos.add(x);
  }
  return false;
}
```

La segunda versión usa más memoria (el `Set`) a cambio de ser muchísimo más rápida. Este intercambio **tiempo frente a memoria** aparece constantemente.

## Arrays y listas

Un **array** guarda elementos seguidos en memoria.

| Operación | Coste |
| --- | --- |
| Leer o escribir por índice | O(1) |
| Añadir al final (`push`, `append`) | O(1) amortizado |
| Insertar o borrar al principio o en medio | O(n): hay que desplazar el resto |
| Buscar un valor sin orden | O(n) |

```python
numeros = [5, 3, 8]
numeros.append(1)        # O(1)
numeros.insert(0, 9)     # O(n)
8 in numeros             # O(n)
```

### Técnica: dos punteros

Muchos problemas sobre arrays ordenados se resuelven con dos índices que avanzan desde los extremos:

```javascript
// ¿Hay dos números en una lista ORDENADA que sumen "objetivo"? O(n)
function sumaPar(ordenada, objetivo) {
  let i = 0;
  let j = ordenada.length - 1;
  while (i < j) {
    const suma = ordenada[i] + ordenada[j];
    if (suma === objetivo) return [ordenada[i], ordenada[j]];
    if (suma < objetivo) i++;
    else j--;
  }
  return null;
}
```

### Técnica: ventana deslizante

Para subarrays contiguos, en lugar de recalcular todo, se suma lo que entra y se resta lo que sale:

```python
def max_suma_k(numeros, k):
    """Mayor suma de k elementos consecutivos. O(n)."""
    ventana = sum(numeros[:k])
    mejor = ventana
    for i in range(k, len(numeros)):
        ventana += numeros[i] - numeros[i - k]
        mejor = max(mejor, ventana)
    return mejor
```

## Mapas y conjuntos (tablas hash)

Un **mapa** (diccionario, objeto, `Map`, `dict`) guarda pares clave → valor con acceso medio O(1). Un **conjunto** (`Set`, `set`) guarda valores únicos.

Son la herramienta número uno para pasar de O(n²) a O(n).

```javascript
// Contar apariciones de cada palabra
function frecuencias(texto) {
  const conteo = new Map();
  for (const palabra of texto.toLowerCase().split(/\s+/)) {
    conteo.set(palabra, (conteo.get(palabra) ?? 0) + 1);
  }
  return conteo;
}

// Clásico de entrevista: índices de dos números que suman "objetivo" (lista sin ordenar)
function dosSuma(numeros, objetivo) {
  const visto = new Map(); // valor → índice
  for (let i = 0; i < numeros.length; i++) {
    const falta = objetivo - numeros[i];
    if (visto.has(falta)) return [visto.get(falta), i];
    visto.set(numeros[i], i);
  }
  return null;
}
```

```python
from collections import Counter, defaultdict

Counter("abracadabra").most_common(2)   # [('a', 5), ('b', 2)]

agrupados = defaultdict(list)
for palabra in ["roma", "amor", "mora", "sol"]:
    agrupados["".join(sorted(palabra))].append(palabra)   # agrupar anagramas
```

## Pilas y colas

Una **pila** (*stack*) funciona como una pila de platos: el último en entrar es el primero en salir (LIFO).

```javascript
// ¿Están bien equilibrados los paréntesis?
function equilibrado(texto) {
  const pareja = { ')': '(', ']': '[', '}': '{' };
  const pila = [];
  for (const c of texto) {
    if ('([{'.includes(c)) pila.push(c);
    else if (c in pareja) {
      if (pila.pop() !== pareja[c]) return false;
    }
  }
  return pila.length === 0;
}

equilibrado('{[()()]}'); // true
equilibrado('(]');       // false
```

Las pilas están en todas partes: el "deshacer" de un editor, el historial del navegador, la pila de llamadas de las funciones.

Una **cola** (*queue*) es como la del supermercado: el primero en llegar es el primero en salir (FIFO). Se usa para procesar tareas en orden y en la búsqueda en anchura.

```python
from collections import deque

cola = deque()
cola.append("tarea 1")
cola.append("tarea 2")
cola.popleft()   # "tarea 1" en O(1). Con una lista normal, pop(0) sería O(n).
```

## Búsqueda binaria

Si los datos están **ordenados**, no hace falta mirarlos todos: se compara con el elemento central y se descarta la mitad en cada paso. O(log n).

```javascript
function busquedaBinaria(ordenada, objetivo) {
  let izq = 0;
  let der = ordenada.length - 1;
  while (izq <= der) {
    const medio = Math.floor((izq + der) / 2);
    if (ordenada[medio] === objetivo) return medio;
    if (ordenada[medio] < objetivo) izq = medio + 1;
    else der = medio - 1;
  }
  return -1;
}
```

En un millón de elementos, como máximo 20 comparaciones. Es la misma idea que buscar una palabra en un diccionario de papel.

> **Consejo:** la búsqueda binaria sirve para más cosas que buscar en arrays. Cualquier problema del tipo "encuentra el menor valor que cumple X" donde X es monótono (si se cumple para un valor, se cumple para todos los mayores) se puede resolver así.

## Ordenación

En la práctica usarás la ordenación del lenguaje (O(n log n)):

```javascript
const numeros = [10, 1, 3];
numeros.sort((a, b) => a - b);                 // ¡sin función, ordena como texto!
usuarios.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
```

```python
sorted(usuarios, key=lambda u: (u["ciudad"], -u["edad"]))
```

Pero conviene entender cómo funciona al menos un algoritmo eficiente. **Merge sort** divide la lista en mitades, ordena cada mitad y las mezcla:

```python
def merge_sort(lista):
    if len(lista) <= 1:
        return lista
    medio = len(lista) // 2
    izq = merge_sort(lista[:medio])
    der = merge_sort(lista[medio:])
    return mezclar(izq, der)

def mezclar(a, b):
    resultado, i, j = [], 0, 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            resultado.append(a[i]); i += 1
        else:
            resultado.append(b[j]); j += 1
    return resultado + a[i:] + b[j:]
```

| Algoritmo | Caso medio | Peor caso | Notas |
| --- | --- | --- | --- |
| Burbuja / inserción | O(n²) | O(n²) | Solo para listas pequeñas o casi ordenadas |
| Merge sort | O(n log n) | O(n log n) | Estable, usa memoria extra |
| Quicksort | O(n log n) | O(n²) | Muy rápido en la práctica |
| Timsort (Python, Java) | O(n log n) | O(n log n) | Híbrido, aprovecha tramos ya ordenados |

## Recursividad

Una función **recursiva** se llama a sí misma con un problema más pequeño. Siempre necesita un **caso base** que detenga la recursión.

```javascript
function factorial(n) {
  if (n <= 1) return 1;          // caso base
  return n * factorial(n - 1);   // caso recursivo
}
```

Es natural para estructuras que contienen versiones más pequeñas de sí mismas, como carpetas o comentarios anidados:

```javascript
function contarArchivos(carpeta) {
  let total = carpeta.archivos.length;
  for (const sub of carpeta.subcarpetas) total += contarArchivos(sub);
  return total;
}
```

### Memoización

Algunas recursiones repiten el mismo cálculo muchísimas veces. Fibonacci ingenuo es O(2ⁿ):

```python
from functools import cache

@cache
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

fib(200)  # instantáneo gracias a la caché: O(n)
```

Guardar resultados ya calculados es la base de la **programación dinámica**.

## Árboles

Un **árbol** tiene un nodo raíz y cada nodo tiene hijos. Ejemplos: el DOM de una página, el sistema de archivos, los comentarios con respuestas.

Un **árbol binario de búsqueda** mantiene a la izquierda los valores menores y a la derecha los mayores, lo que permite buscar en O(log n) si está equilibrado. Los índices de las bases de datos usan una variante (árboles B).

```javascript
class Nodo {
  constructor(valor) {
    this.valor = valor;
    this.izq = null;
    this.der = null;
  }
}

function insertar(raiz, valor) {
  if (!raiz) return new Nodo(valor);
  if (valor < raiz.valor) raiz.izq = insertar(raiz.izq, valor);
  else raiz.der = insertar(raiz.der, valor);
  return raiz;
}

// Recorrido en orden: devuelve los valores ordenados
function enOrden(nodo, resultado = []) {
  if (!nodo) return resultado;
  enOrden(nodo.izq, resultado);
  resultado.push(nodo.valor);
  enOrden(nodo.der, resultado);
  return resultado;
}
```

## Grafos

Un **grafo** son nodos conectados por aristas: una red social, un mapa de carreteras, las dependencias de un proyecto. Se suele representar con una **lista de adyacencia**:

```python
grafo = {
    "Barcelona": ["Zaragoza", "Valencia"],
    "Zaragoza": ["Barcelona", "Madrid"],
    "Valencia": ["Barcelona", "Madrid"],
    "Madrid": ["Zaragoza", "Valencia", "Sevilla"],
    "Sevilla": ["Madrid"],
}
```

**Búsqueda en anchura (BFS)**: explora por niveles con una cola. Encuentra el camino con menos saltos.

```python
from collections import deque

def camino_mas_corto(grafo, origen, destino):
    cola = deque([[origen]])
    visitados = {origen}
    while cola:
        camino = cola.popleft()
        nodo = camino[-1]
        if nodo == destino:
            return camino
        for vecino in grafo[nodo]:
            if vecino not in visitados:
                visitados.add(vecino)
                cola.append(camino + [vecino])
    return None

camino_mas_corto(grafo, "Barcelona", "Sevilla")
# ['Barcelona', 'Zaragoza', 'Madrid', 'Sevilla']
```

**Búsqueda en profundidad (DFS)**: va lo más lejos posible por cada rama (con recursión o una pila). Útil para detectar ciclos, recorrer todo o resolver laberintos.

Para caminos con distancias (kilómetros, tiempo), se usa el **algoritmo de Dijkstra**, que es un BFS con una cola de prioridad (`heapq` en Python).

## Cómo afrontar un problema de entrevista

1. **Entiende el enunciado.** Repítelo con tus palabras. Pregunta por los límites: ¿puede estar vacía la lista? ¿hay negativos? ¿cuántos elementos como máximo?
2. **Haz un ejemplo a mano**, incluido un caso límite.
3. **Empieza por la solución directa**, aunque sea lenta, y di su complejidad.
4. **Optimiza**: ¿qué trabajo se repite? ¿Un mapa evitaría un bucle? ¿Ordenar primero ayuda? ¿Dos punteros? ¿Búsqueda binaria?
5. **Escribe el código** explicando lo que haces en voz alta.
6. **Prueba** con tus ejemplos y con casos límite (vacío, un elemento, duplicados).

| Si el problema… | Piensa en… |
| --- | --- |
| Pide buscar rápido o contar | Mapa / conjunto |
| Tiene una lista ordenada | Dos punteros, búsqueda binaria |
| Habla de subarrays o subcadenas contiguas | Ventana deslizante |
| Tiene estructuras anidadas | Recursión, pila |
| Pide el camino más corto | BFS |
| Pide "los k mayores" | Ordenar o un *heap* |
| Pide todas las combinaciones | Backtracking (recursión) |
| Repite subproblemas | Memoización / programación dinámica |

> **Consejo:** en una entrevista importa tanto el proceso como el resultado. Explicar por qué descartas una solución y qué complejidad tiene cada opción demuestra más que llegar callado al código perfecto.

## Ejercicios

Resuélvelos primero de forma directa y luego optimízalos:

1. Devuelve el primer carácter que no se repite en un texto.
2. Comprueba si dos palabras son anagramas.
3. Invierte una lista sin crear otra nueva.
4. Fusiona dos listas ordenadas en una sola ordenada.
5. Encuentra la subcadena más larga sin caracteres repetidos.
6. Dado un laberinto como matriz de 0 (libre) y 1 (muro), calcula el número mínimo de pasos de una esquina a la otra.

> **Reto:** para practicar a diario, hay plataformas gratuitas con miles de problemas como LeetCode, HackerRank, Exercism o Advent of Code. Empieza por los de dificultad "fácil" y céntrate en entender los patrones, no en memorizar soluciones.

Sigue con la ruta [Preparar entrevistas técnicas](/rutas#entrevistas).
