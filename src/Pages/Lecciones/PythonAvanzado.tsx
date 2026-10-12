import LessonLayout from '@/layouts/LessonLayout';
import { Head } from '@inertiajs/react';
import { MarkdownContent } from '@/components/MarkdownLesson';
import resto from '@/content/python-avanzado-2.md?raw';

const modules = [
    { id: '/lecciones/python-avanzado', title: 'Decoradores' },
    { id: '/lecciones/python-avanzado#context', title: 'Context managers' },
    { id: '/lecciones/python-avanzado#generators-e-iteradores', title: 'Generators e iteradores' },
    { id: '/lecciones/python-avanzado#asyncio-y-programacion-asincrona', title: 'asyncio y programación asíncrona' },
    { id: '/lecciones/python-avanzado#type-hints-y-mypy', title: 'Type hints y mypy' },
    { id: '/lecciones/python-avanzado#dataclasses-y-pydantic', title: 'Dataclasses y Pydantic' },
    { id: '/lecciones/python-avanzado#concurrencia-threads-y-multiprocessing', title: 'Concurrencia: threads y multiprocessing' },
    { id: '/lecciones/python-avanzado#patrones-avanzados-descriptores-slots-y-metaclases', title: 'Descriptores, slots y metaclases' },
    { id: '/lecciones/python-avanzado#proyecto-final', title: 'Proyecto final' },
];

export default function PythonAvanzado() {
    return (
        <LessonLayout
            title="Python avanzado"
            description="Decoradores, context managers, generators, asyncio y type hints para escribir código profesional y eficiente."
            duration="4h 30min"
            lessons={20}
            level="Avanzado"
            premium={false}
            modules={modules}
            activeModule="/lecciones/python-avanzado"
            category="Python"
        >
            <Head>
                <title>Python avanzado — Aprende a Programar</title>
                <meta name="description" content="Curso avanzado de Python: decoradores, generators, asyncio, type hints y Pydantic. Curso gratuito." />
            </Head>

            <h1>Python avanzado</h1>

            <blockquote>
                La diferencia entre un script de Python y código de producción no está en los conceptos básicos — está en los patrones avanzados. Decoradores, generators y asyncio son las herramientas que convierten código correcto en código elegante, eficiente y mantenible.
            </blockquote>

            {/* ── 1. Decoradores ── */}
            <h2 id="decoradores">Decoradores</h2>
            <p>
                Un decorador es una función que envuelve otra función para modificar o extender su comportamiento <strong>sin cambiar su código</strong>. Es el patrón más pythónico para añadir funcionalidad transversal (logging, caché, autenticación, timing...).
            </p>

            <pre><code>{`import functools
import time

# Decorador básico
def medir_tiempo(func):
    @functools.wraps(func)   # preserva metadata de la función original
    def wrapper(*args, **kwargs):
        inicio = time.perf_counter()
        resultado = func(*args, **kwargs)
        fin = time.perf_counter()
        print(f"{func.__name__} tardó {fin - inicio:.4f}s")
        return resultado
    return wrapper

@medir_tiempo
def calcular_primos(n):
    return [x for x in range(2, n) if all(x % i != 0 for i in range(2, x))]

primos = calcular_primos(1000)  # calcular_primos tardó 0.0842s

# Decorador con parámetros
def reintentar(max_intentos=3, espera=1.0):
    def decorador(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for intento in range(max_intentos):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if intento == max_intentos - 1:
                        raise
                    print(f"Intento {intento + 1} fallido: {e}. Reintentando...")
                    time.sleep(espera)
        return wrapper
    return decorador

@reintentar(max_intentos=3, espera=0.5)
def llamar_api(url):
    import urllib.request
    with urllib.request.urlopen(url, timeout=5) as r:
        return r.read()

# Decorador de caché simple (memoización)
def cache(func):
    memo = {}
    @functools.wraps(func)
    def wrapper(*args):
        if args not in memo:
            memo[args] = func(*args)
        return memo[args]
    return wrapper

@cache
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Python incluye @functools.lru_cache y @functools.cache
from functools import cache as lru_cache

@lru_cache(maxsize=128)
def fib(n):
    return n if n < 2 else fib(n-1) + fib(n-2)`}</code></pre>

            {/* ── 2. Context managers ── */}
            <h2 id="context">Context managers</h2>
            <p>
                Los context managers garantizan que los recursos se liberen correctamente aunque ocurra una excepción. Los usas con <code>with</code>. Puedes crear los tuyos propios con una clase o con <code>contextlib</code>.
            </p>

            <pre><code>{`# Con clase — __enter__ y __exit__
class ConexionDB:
    def __init__(self, url):
        self.url = url
        self.conexion = None

    def __enter__(self):
        print(f"Conectando a {self.url}")
        self.conexion = {"url": self.url, "activa": True}  # simula conexión
        return self.conexion

    def __exit__(self, tipo_exc, valor_exc, tb):
        print("Cerrando conexión")
        self.conexion["activa"] = False
        # Retornar True suprimiría la excepción
        return False

with ConexionDB("postgres://localhost/mydb") as db:
    print(f"Usando conexión: {db}")

# Con contextlib.contextmanager (más conciso)
from contextlib import contextmanager

@contextmanager
def cronometro(etiqueta="Operación"):
    inicio = time.perf_counter()
    try:
        yield  # aquí se ejecuta el bloque with
    finally:
        duracion = time.perf_counter() - inicio
        print(f"{etiqueta}: {duracion:.4f}s")

with cronometro("Ordenar lista"):
    datos = sorted(range(100_000), reverse=True)

# Context manager para gestión de archivos temporal
import tempfile
from pathlib import Path

@contextmanager
def archivo_temporal(sufijo=".txt"):
    ruta = Path(tempfile.mktemp(suffix=sufijo))
    try:
        yield ruta
    finally:
        if ruta.exists():
            ruta.unlink()

with archivo_temporal(".json") as tmp:
    tmp.write_text('{"test": true}')
    datos = tmp.read_text()
    print(datos)
# El archivo se elimina automáticamente al salir`}</code></pre>

            <MarkdownContent md={resto} />
        </LessonLayout>
    );
}
