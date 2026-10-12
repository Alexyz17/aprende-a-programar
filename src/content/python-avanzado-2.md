## Generators e iteradores

Un **generator** produce valores de uno en uno, solo cuando se le piden, en lugar de crear una lista entera en memoria. Se escribe como una función normal pero con `yield`:

```python
def leer_csv_grande(ruta):
    with open(ruta, encoding="utf-8") as f:
        cabecera = next(f).strip().split(",")
        for linea in f:
            valores = linea.strip().split(",")
            yield dict(zip(cabecera, valores))

# Procesa millones de filas usando la memoria de una sola fila
total = sum(float(fila["importe"]) for fila in leer_csv_grande("ventas.csv"))
```

Cada `yield` pausa la función y entrega un valor; la siguiente iteración continúa justo donde se quedó.

### Expresiones generadoras

```python
cuadrados_lista = [n * n for n in range(10_000_000)]   # ocupa cientos de MB
cuadrados_gen = (n * n for n in range(10_000_000))     # ocupa unos bytes
sum(cuadrados_gen)
```

### Encadenar generators (pipelines)

```python
def lineas(ruta):
    with open(ruta, encoding="utf-8") as f:
        yield from f

def errores(lineas):
    return (l for l in lineas if "ERROR" in l)

def con_hora(lineas):
    for l in lineas:
        fecha, _, resto = l.partition(" ")
        yield fecha, resto.strip()

for fecha, mensaje in con_hora(errores(lineas("app.log"))):
    print(fecha, mensaje)
```

Nada se lee hasta que el bucle `for` pide el primer elemento, y en ningún momento hay más de una línea en memoria.

### El protocolo de iteración

Cualquier objeto con `__iter__` (y un iterador con `__next__`) funciona en un `for`:

```python
class CuentaAtras:
    def __init__(self, desde: int):
        self.desde = desde

    def __iter__(self):
        n = self.desde
        while n > 0:
            yield n
            n -= 1

for n in CuentaAtras(3):
    print(n)   # 3, 2, 1
```

`itertools` trae herramientas muy útiles: `islice` (cortar un iterador), `chain` (unir), `groupby` (agrupar consecutivos), `batched` (lotes, Python 3.12+), `pairwise`, `count`, `cycle`.

```python
from itertools import batched, islice

for lote in batched(leer_csv_grande("clientes.csv"), 500):
    insertar_en_bd(lote)          # inserciones de 500 en 500

primeras_10 = list(islice(leer_csv_grande("ventas.csv"), 10))
```

## asyncio y programación asíncrona

Cuando un programa pasa la mayor parte del tiempo **esperando** (respuestas de red, base de datos, disco), la programación asíncrona permite atender muchas tareas a la vez en un solo hilo.

```python
import asyncio
import time

async def descargar(nombre: str, segundos: float) -> str:
    await asyncio.sleep(segundos)      # simula una petición de red
    return f"{nombre} listo"

async def main():
    inicio = time.perf_counter()
    resultados = await asyncio.gather(
        descargar("usuarios", 1),
        descargar("pedidos", 1),
        descargar("productos", 1),
    )
    print(resultados, f"{time.perf_counter() - inicio:.1f}s")   # ~1 s, no 3

asyncio.run(main())
```

- `async def` define una **corrutina**.
- `await` cede el control mientras espera, para que otras corrutinas avancen.
- `asyncio.gather` lanza varias a la vez y espera a todas.

### Peticiones HTTP concurrentes

```python
import asyncio
import httpx   # pip install httpx

async def obtener(cliente: httpx.AsyncClient, url: str) -> int:
    r = await cliente.get(url, timeout=10)
    return r.status_code

async def comprobar(urls: list[str]):
    limite = asyncio.Semaphore(10)              # como máximo 10 peticiones a la vez

    async def con_limite(cliente, url):
        async with limite:
            try:
                return url, await obtener(cliente, url)
            except httpx.HTTPError as e:
                return url, f"error: {e.__class__.__name__}"

    async with httpx.AsyncClient() as cliente:
        return await asyncio.gather(*(con_limite(cliente, u) for u in urls))

resultados = asyncio.run(comprobar(["https://www.python.org", "https://pypi.org"]))
```

### TaskGroup y timeouts (Python 3.11+)

```python
async def main():
    try:
        async with asyncio.timeout(5):
            async with asyncio.TaskGroup() as tg:
                t1 = tg.create_task(descargar("a", 1))
                t2 = tg.create_task(descargar("b", 2))
        print(t1.result(), t2.result())
    except TimeoutError:
        print("Ha tardado demasiado")
```

`TaskGroup` cancela el resto de tareas si una falla, evitando tareas "huérfanas".

> **Atención:** una llamada bloqueante dentro de una corrutina (`time.sleep`, `requests.get`, una consulta con un driver síncrono) congela **todo** el bucle de eventos. Usa librerías asíncronas (`httpx`, `asyncpg`, `aiofiles`) o envía el trabajo bloqueante a un hilo con `await asyncio.to_thread(funcion, args)`.

## Type hints y mypy

Las anotaciones de tipo no cambian cómo se ejecuta Python, pero permiten que el editor y herramientas como **mypy** o **pyright** detecten errores antes de ejecutar.

```python
from collections.abc import Iterable, Callable

def media(valores: Iterable[float]) -> float:
    datos = list(valores)
    return sum(datos) / len(datos) if datos else 0.0

def buscar_usuario(id: int) -> dict[str, str] | None:
    ...

def aplicar(f: Callable[[int], int], x: int) -> int:
    return f(x)
```

```bash
pip install mypy
mypy --strict mi_proyecto/
```

### Genéricos y Protocol

```python
from typing import Protocol

def primero[T](elementos: list[T]) -> T | None:       # sintaxis de genéricos de Python 3.12
    return elementos[0] if elementos else None

class Notificador(Protocol):
    def enviar(self, destino: str, mensaje: str) -> None: ...

class Email:
    def enviar(self, destino: str, mensaje: str) -> None:
        print(f"Email a {destino}: {mensaje}")

def avisar(n: Notificador) -> None:     # cualquier clase con un método enviar compatible vale
    n.enviar("ana@ejemplo.com", "Tu pedido ha salido")

avisar(Email())
```

`Protocol` define una interfaz **estructural**: no hace falta heredar de nada, basta con tener los métodos (el "duck typing" de Python, pero comprobado).

Otros tipos útiles: `Literal["asc", "desc"]`, `TypedDict` para diccionarios con forma fija, `Final` para constantes y `type Id = int` para alias (3.12+).

## Dataclasses y Pydantic

### dataclasses

Generan automáticamente `__init__`, `__repr__` y `__eq__`:

```python
from dataclasses import dataclass, field
from datetime import datetime

@dataclass(frozen=True, slots=True)
class Linea:
    producto: str
    precio: float
    cantidad: int = 1

    @property
    def total(self) -> float:
        return self.precio * self.cantidad

@dataclass
class Pedido:
    cliente: str
    lineas: list[Linea] = field(default_factory=list)
    creado: datetime = field(default_factory=datetime.now)

    def total(self) -> float:
        return round(sum(l.total for l in self.lineas), 2)

p = Pedido("Ana", [Linea("Teclado", 45.0), Linea("Ratón", 20.0, 2)])
print(p.total())   # 85.0
```

- `frozen=True`: inmutable (y se puede usar como clave de diccionario).
- `slots=True`: menos memoria y acceso más rápido.
- `field(default_factory=list)`: nunca uses `[]` como valor por defecto directamente; se compartiría entre instancias.

### Pydantic: validar datos externos

Las dataclasses confían en que les pasas datos correctos. Para datos que vienen de fuera (una API, un formulario, un archivo de configuración) usa **Pydantic**, que valida y convierte:

```python
from pydantic import BaseModel, EmailStr, Field, field_validator, ValidationError

class Registro(BaseModel):
    nombre: str = Field(min_length=2, max_length=60)
    email: EmailStr                         # pip install "pydantic[email]"
    edad: int = Field(ge=16, le=120)
    intereses: list[str] = []

    @field_validator("nombre")
    @classmethod
    def capitalizar(cls, v: str) -> str:
        return v.strip().title()

try:
    r = Registro(nombre="  ana garcía ", email="ana@ejemplo.com", edad="30")
    print(r.nombre, r.edad)          # "Ana García" 30 (el texto "30" se convierte a int)
    print(r.model_dump_json())
except ValidationError as e:
    print(e.errors())
```

Pydantic es la base de **FastAPI**, que lo usa para validar peticiones y generar la documentación de la API automáticamente. Para la configuración de una aplicación, `pydantic-settings` lee y valida variables de entorno.

## Concurrencia: threads y multiprocessing

Python tiene tres herramientas para hacer varias cosas a la vez. Elegir bien depende del tipo de trabajo:

| Tipo de trabajo | Ejemplo | Herramienta |
| --- | --- | --- |
| Esperas de red/disco, muchas conexiones | Llamar a 1 000 URLs | `asyncio` (o hilos) |
| Esperas con librerías síncronas | Usar `requests` o un SDK sin versión async | `ThreadPoolExecutor` |
| Cálculo intensivo de CPU | Procesar imágenes, cálculos numéricos | `ProcessPoolExecutor` |

¿Por qué los hilos no aceleran el cálculo? En CPython, el **GIL** (*Global Interpreter Lock*) solo deja ejecutar código Python a un hilo cada vez. Los hilos sirven para **esperar** en paralelo; para **calcular** en paralelo hacen falta procesos.

> **Nota:** desde Python 3.13 existe una compilación experimental sin GIL (*free-threaded*). Todavía no es la opción por defecto, así que la regla anterior sigue siendo la práctica habitual.

```python
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor, as_completed
import requests

urls = [f"https://jsonplaceholder.typicode.com/posts/{i}" for i in range(1, 21)]

with ThreadPoolExecutor(max_workers=8) as ex:
    futuros = {ex.submit(requests.get, u, timeout=10): u for u in urls}
    for f in as_completed(futuros):
        print(futuros[f], f.result().status_code)
```

```python
from concurrent.futures import ProcessPoolExecutor
import math

def es_primo(n: int) -> bool:
    if n < 2:
        return False
    return all(n % d for d in range(2, math.isqrt(n) + 1))

if __name__ == "__main__":          # obligatorio con procesos en Windows y macOS
    numeros = range(10_000_000, 10_000_500)
    with ProcessPoolExecutor() as ex:
        primos = [n for n, p in zip(numeros, ex.map(es_primo, numeros, chunksize=50)) if p]
    print(len(primos))
```

Mide siempre antes y después con `time.perf_counter()` o `cProfile`: crear procesos tiene un coste y para tareas pequeñas puede ser más lento.

```bash
python -m cProfile -s cumtime mi_script.py | head -20
```

## Patrones avanzados: descriptores, slots y metaclases

### Descriptores

Un **descriptor** controla el acceso a un atributo. `@property` es el ejemplo más conocido; puedes crear los tuyos para reutilizar validaciones:

```python
class Positivo:
    def __set_name__(self, owner, nombre):
        self.nombre = "_" + nombre

    def __get__(self, obj, tipo=None):
        return getattr(obj, self.nombre)

    def __set__(self, obj, valor):
        if valor <= 0:
            raise ValueError(f"{self.nombre[1:]} debe ser positivo")
        setattr(obj, self.nombre, valor)

class Producto:
    precio = Positivo()
    stock = Positivo()

    def __init__(self, precio: float, stock: int):
        self.precio = precio
        self.stock = stock

Producto(10, 5)
Producto(-1, 5)   # ValueError: precio debe ser positivo
```

Es el mecanismo que usan los ORM como Django o SQLAlchemy para sus campos.

### `__slots__`

Por defecto cada objeto guarda sus atributos en un diccionario. Con `__slots__` se fija la lista de atributos: menos memoria (útil con millones de objetos) y error si intentas crear uno no previsto.

```python
class Punto:
    __slots__ = ("x", "y")

    def __init__(self, x: float, y: float):
        self.x, self.y = x, y
```

### Metaclases y `__init_subclass__`

Una **metaclase** es "la clase de una clase": controla cómo se crean las clases. Rara vez las necesitas; casi siempre basta con `__init_subclass__`, mucho más simple:

```python
class Plugin:
    registro: dict[str, type["Plugin"]] = {}

    def __init_subclass__(cls, nombre: str, **kwargs):
        super().__init_subclass__(**kwargs)
        Plugin.registro[nombre] = cls

class ExportarCSV(Plugin, nombre="csv"):
    ...

class ExportarPDF(Plugin, nombre="pdf"):
    ...

print(Plugin.registro)   # {'csv': <class 'ExportarCSV'>, 'pdf': <class 'ExportarPDF'>}
```

Cada subclase se registra sola al definirse: un patrón muy usado en sistemas de plugins.

> **Consejo:** estas herramientas son potentes, pero el código "mágico" es difícil de leer y depurar. Úsalas en librerías y frameworks; en el código de una aplicación, lo simple y explícito casi siempre gana.

## Proyecto final

Construye un **comprobador de enlaces** de línea de comandos:

1. Lee un archivo con miles de URLs usando un generator.
2. Las comprueba de forma asíncrona con `httpx`, como máximo 20 a la vez y con timeout.
3. Modela cada resultado con una dataclass y valida la configuración (límite, timeout, archivo de salida) con Pydantic.
4. Escribe el informe en CSV por lotes.
5. Todo con type hints y sin errores en `mypy --strict`.

> **Reto:** añade un modo que descargue cada página y extraiga su título usando un `ProcessPoolExecutor` para el análisis del HTML. Mide cuánto mejora frente a hacerlo en el mismo proceso. Sigue con [Machine Learning con Python](/lecciones/machine-learning).
