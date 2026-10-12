import LessonLayout from '@/layouts/LessonLayout';
import { Head } from '@inertiajs/react';

const modules = [
    { id: '/lecciones/python-basico', title: 'Variables y tipos de datos', free: true },
    { id: '/lecciones/python-basico#colecciones', title: 'Listas, tuplas y dicts', free: true },
    { id: '/lecciones/python-basico#funciones', title: 'Funciones y scope', free: true },
    { id: '/lecciones/python-basico#fstrings', title: 'f-strings y formateo', free: true },
    { id: '/lecciones/python-basico#modulos', title: 'Módulos y paquetes', free: true },
    { id: '/lecciones/python-basico#errores', title: 'Manejo de errores', free: true },
    { id: '/lecciones/python-basico#archivos', title: 'Lectura y escritura de archivos', free: true },
];

export default function PythonBasico() {
    return (
        <LessonLayout
            title="Python desde cero"
            description="Variables, tipos, colecciones, funciones, módulos y manejo de errores. Todo lo que necesitas para empezar a programar en Python."
            duration="3h 00min"
            lessons={14}
            level="Básico"
            premium={false}
            modules={modules}
            activeModule="/lecciones/python-basico"
            nextHref="/lecciones/python-avanzado"
            category="Python"
        >
            <Head>
                <title>Python desde cero — Aprende a Programar</title>
                <meta name="description" content="Aprende Python desde cero: variables, listas, diccionarios, funciones, f-strings y módulos. Curso gratuito y actualizado 2026." />
            </Head>

            <h1>Python desde cero</h1>

            <blockquote>
                Python es el lenguaje más aprendido del mundo y el primero en Data Science, IA y scripting. Su sintaxis clara lo hace ideal para aprender a programar y también para profesionales que quieren automatizar tareas o construir sistemas complejos.
            </blockquote>

            {/* ── 1. Variables y tipos ── */}
            <h2 id="variables">Variables y tipos de datos</h2>
            <p>
                Python usa <strong>tipado dinámico</strong>: no declaras el tipo, Python lo infiere. Las variables se crean en el momento de la asignación con <code>=</code>.
            </p>

            <pre><code>{`# Tipos básicos
nombre = "Alicia"          # str
edad = 28                  # int
altura = 1.72              # float
activo = True              # bool
nada = None                # NoneType

# Comprobar el tipo
print(type(nombre))        # <class 'str'>
print(type(edad))          # <class 'int'>

# Conversión de tipos (casting)
texto_numero = "42"
numero = int(texto_numero) # str → int
pi = float("3.14159")      # str → float
como_texto = str(numero)   # int → str

# Múltiple asignación
x, y, z = 1, 2, 3
a = b = c = 0              # Todos valen 0

# Constantes (convención: MAYÚSCULAS)
MAX_INTENTOS = 3
BASE_URL = "https://api.ejemplo.com"`}</code></pre>

            <h3>Operaciones con números</h3>
            <pre><code>{`# Aritmética
print(10 + 3)   # 13  suma
print(10 - 3)   # 7   resta
print(10 * 3)   # 30  multiplicación
print(10 / 3)   # 3.3333... división real
print(10 // 3)  # 3   división entera
print(10 % 3)   # 1   módulo (resto)
print(10 ** 3)  # 1000 potencia

# Asignación compuesta
x = 10
x += 5   # x = 15
x -= 2   # x = 13
x *= 2   # x = 26
x //= 4  # x = 6

# Funciones numéricas útiles
print(abs(-7))         # 7   valor absoluto
print(round(3.7))      # 4   redondear
print(round(3.14159, 2)) # 3.14
print(min(3, 1, 4, 1)) # 1
print(max(3, 1, 4, 1)) # 4
print(sum([1, 2, 3]))  # 6`}</code></pre>

            {/* ── 2. Colecciones ── */}
            <h2 id="colecciones">Listas, tuplas y diccionarios</h2>

            <h3>Listas — colecciones ordenadas y mutables</h3>
            <pre><code>{`lenguajes = ["Python", "JavaScript", "Rust"]

# Acceso por índice (empieza en 0)
print(lenguajes[0])    # "Python"
print(lenguajes[-1])   # "Rust"  (último)

# Slicing
print(lenguajes[0:2])  # ["Python", "JavaScript"]
print(lenguajes[1:])   # ["JavaScript", "Rust"]
print(lenguajes[::-1]) # ["Rust", "JavaScript", "Python"]  (invertida)

# Modificar
lenguajes.append("Go")           # añadir al final
lenguajes.insert(1, "TypeScript") # insertar en posición
lenguajes.remove("Rust")          # eliminar por valor
ultimo = lenguajes.pop()          # eliminar y devolver el último
del lenguajes[0]                  # eliminar por índice

# Información
print(len(lenguajes))             # número de elementos
print("Python" in lenguajes)      # True/False

# Ordenar
numeros = [3, 1, 4, 1, 5, 9]
numeros.sort()                    # ordena en sitio
ordenados = sorted(numeros)       # devuelve nueva lista
numeros.sort(reverse=True)        # orden descendente

# List comprehension — muy pythónico
cuadrados = [x**2 for x in range(10)]
pares = [x for x in range(20) if x % 2 == 0]
mayusculas = [s.upper() for s in ["hola", "mundo"]]`}</code></pre>

            <h3>Diccionarios — pares clave-valor</h3>
            <pre><code>{`usuario = {
    "nombre": "Alicia",
    "edad": 28,
    "activo": True,
    "tags": ["python", "dev"]
}

# Acceso
print(usuario["nombre"])           # "Alicia"
print(usuario.get("email"))        # None (sin excepción)
print(usuario.get("email", "N/A")) # "N/A" (valor por defecto)

# Modificar
usuario["email"] = "ali@ejemplo.com"  # añadir/sobreescribir
usuario["edad"] = 29
del usuario["activo"]                  # eliminar clave

# Iterar
for clave, valor in usuario.items():
    print(f"{clave}: {valor}")

# Solo claves o valores
print(list(usuario.keys()))    # ["nombre", "edad", ...]
print(list(usuario.values()))  # ["Alicia", 29, ...]

# Dict comprehension
cuadrados = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# Unir diccionarios (Python 3.9+)
defaults = {"tema": "oscuro", "idioma": "es"}
config = {"tema": "claro"} | defaults
# {"tema": "oscuro", "idioma": "es"}  (defaults sobreescribe)`}</code></pre>

            <h3>Sets y tuplas</h3>
            <pre><code>{`# Set — sin duplicados, sin orden
etiquetas = {"python", "web", "api", "python"}
print(etiquetas)  # {"python", "web", "api"}  (sin duplicados)

# Operaciones de conjuntos
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a & b)  # {3, 4}  intersección
print(a | b)  # {1, 2, 3, 4, 5, 6}  unión
print(a - b)  # {1, 2}  diferencia

# Tupla — inmutable, útil como clave de dict
coordenada = (40.4168, -3.7038)
x, y = coordenada  # desempaquetado
print(coordenada[0])  # 40.4168`}</code></pre>

            {/* ── 3. Funciones ── */}
            <h2 id="funciones">Funciones y scope</h2>
            <pre><code>{`# Función básica
def saludar(nombre):
    return f"Hola, {nombre}!"

print(saludar("Alicia"))  # "Hola, Alicia!"

# Parámetros por defecto
def conectar(host, puerto=5432, ssl=True):
    return f"Conectando a {host}:{puerto} (SSL: {ssl})"

conectar("db.ejemplo.com")             # usa defaults
conectar("db.ejemplo.com", 3306)       # sobreescribe puerto
conectar("host", ssl=False)            # keyword argument

# *args y **kwargs
def sumar(*numeros):
    return sum(numeros)

print(sumar(1, 2, 3, 4))  # 10

def crear_usuario(**datos):
    return datos

u = crear_usuario(nombre="Bob", rol="admin", activo=True)
# {"nombre": "Bob", "rol": "admin", "activo": True}

# Funciones como valores (primera clase)
def aplicar(funcion, lista):
    return [funcion(x) for x in lista]

resultado = aplicar(str.upper, ["hola", "mundo"])
# ["HOLA", "MUNDO"]

# Lambda — función anónima de una línea
doble = lambda x: x * 2
print(doble(5))  # 10

# Útil con sorted, filter, map
personas = [{"nombre": "Ana", "edad": 30}, {"nombre": "Bob", "edad": 25}]
por_edad = sorted(personas, key=lambda p: p["edad"])

# Scope — LEGB: Local, Enclosing, Global, Built-in
contador = 0

def incrementar():
    global contador   # acceder a la variable global
    contador += 1

def crear_contador():
    n = 0
    def inc():
        nonlocal n    # acceder a la variable del closure
        n += 1
        return n
    return inc

c = crear_contador()
print(c())  # 1
print(c())  # 2`}</code></pre>

            {/* ── 4. f-strings ── */}
            <h2 id="fstrings">f-strings y formateo de texto</h2>
            <p>
                Las <strong>f-strings</strong> (disponibles desde Python 3.6) son la forma moderna y recomendada de construir cadenas de texto con variables.
            </p>
            <pre><code>{`nombre = "Alicia"
edad = 28
saldo = 1234.5678

# f-string básica
print(f"Me llamo {nombre} y tengo {edad} años.")

# Expresiones dentro de {}
print(f"Doble de la edad: {edad * 2}")
print(f"Mayúsculas: {nombre.upper()}")
print(f"¿Mayor de edad? {edad >= 18}")

# Formato de números
print(f"Saldo: {saldo:.2f}")       # 1234.57  (2 decimales)
print(f"Saldo: {saldo:,.2f}")      # 1,234.57 (separador de miles)
print(f"Porcentaje: {0.856:.1%}")  # 85.6%
print(f"Entero: {42:05d}")         # 00042   (relleno de ceros)
print(f"Hexadecimal: {255:#x}")    # 0xff

# Alineación
print(f"{'izquierda':<20}|")  # alinear izquierda
print(f"{'derecha':>20}|")    # alinear derecha
print(f"{'centro':^20}|")     # centrar

# f-strings multilínea
mensaje = (
    f"Usuario: {nombre}\n"
    f"Edad:    {edad}\n"
    f"Saldo:   {saldo:,.2f}€"
)
print(mensaje)

# Debug con = (Python 3.8+)
x = 42
print(f"{x = }")           # x = 42  (muy útil para debug)
print(f"{nombre.lower() = }")  # nombre.lower() = 'alicia'`}</code></pre>

            {/* ── 5. Módulos ── */}
            <h2 id="modulos">Módulos y paquetes</h2>
            <pre><code>{`# Importar módulo completo
import math
print(math.pi)          # 3.14159...
print(math.sqrt(16))    # 4.0
print(math.ceil(3.2))   # 4
print(math.floor(3.8))  # 3

# Importar elementos específicos
from math import pi, sqrt, floor
print(sqrt(25))  # 5.0

# Alias
import datetime as dt
from collections import defaultdict as dd

# Módulos de la biblioteca estándar más útiles
import os
import sys
import json
import re
import random
import pathlib

# os — sistema operativo
cwd = os.getcwd()                    # directorio actual
os.makedirs("logs/app", exist_ok=True)  # crear directorios
archivos = os.listdir(".")           # listar directorio
variable = os.getenv("HOME", "/tmp") # leer variable de entorno

# pathlib — rutas modernas (preferida sobre os.path)
from pathlib import Path

ruta = Path("/var/www/html")
archivo = ruta / "index.php"         # unir rutas con /
print(archivo.suffix)                # ".php"
print(archivo.stem)                  # "index"
print(archivo.parent)                # /var/www/html
print(archivo.exists())              # True/False

# json — serialización
datos = {"nombre": "Alicia", "edad": 28}
texto = json.dumps(datos, indent=2)  # dict → string JSON
obj = json.loads('{"key": "value"}') # string JSON → dict

# Guardar/cargar JSON de archivo
with open("datos.json", "w") as f:
    json.dump(datos, f, indent=2)

with open("datos.json") as f:
    cargado = json.load(f)

# random
print(random.randint(1, 100))        # entero aleatorio
print(random.choice(["a", "b", "c"])) # elemento aleatorio
lista = [1, 2, 3, 4, 5]
random.shuffle(lista)                # mezclar en sitio`}</code></pre>

            {/* ── 6. Errores ── */}
            <h2 id="errores">Manejo de errores</h2>
            <pre><code>{`# try/except básico
try:
    resultado = 10 / 0
except ZeroDivisionError:
    print("Error: división por cero")

# Capturar múltiples excepciones
try:
    valor = int("no_es_número")
except (ValueError, TypeError) as e:
    print(f"Error de conversión: {e}")

# Bloque completo
try:
    archivo = open("datos.txt")
    contenido = archivo.read()
except FileNotFoundError:
    print("El archivo no existe")
except PermissionError:
    print("Sin permisos de lectura")
except Exception as e:          # cualquier otra excepción
    print(f"Error inesperado: {e}")
else:
    print("Lectura exitosa")    # se ejecuta si NO hubo excepción
finally:
    print("Esto siempre se ejecuta")  # limpieza

# Lanzar excepciones propias
def dividir(a, b):
    if b == 0:
        raise ValueError("El divisor no puede ser cero")
    return a / b

# Crear excepciones personalizadas
class SaldoInsuficienteError(Exception):
    def __init__(self, saldo, cantidad):
        self.saldo = saldo
        self.cantidad = cantidad
        super().__init__(f"Saldo {saldo}€ insuficiente para retirar {cantidad}€")

def retirar(saldo, cantidad):
    if cantidad > saldo:
        raise SaldoInsuficienteError(saldo, cantidad)
    return saldo - cantidad

try:
    nuevo_saldo = retirar(100, 200)
except SaldoInsuficienteError as e:
    print(e)  # Saldo 100€ insuficiente para retirar 200€`}</code></pre>

            {/* ── 7. Archivos ── */}
            <h2 id="archivos">Lectura y escritura de archivos</h2>
            <pre><code>{`# Leer archivo completo
with open("notas.txt", "r", encoding="utf-8") as f:
    contenido = f.read()       # string completo

# Leer línea a línea (eficiente con archivos grandes)
with open("datos.csv", "r", encoding="utf-8") as f:
    for linea in f:
        print(linea.strip())   # .strip() elimina saltos de línea

# Leer todas las líneas en lista
with open("notas.txt") as f:
    lineas = f.readlines()     # ["línea 1\n", "línea 2\n", ...]

# Escribir
with open("salida.txt", "w", encoding="utf-8") as f:
    f.write("Primera línea\n")
    f.write("Segunda línea\n")

# Añadir al final (append)
with open("log.txt", "a") as f:
    f.write("Nuevo registro\n")

# Modos de apertura
# "r"  — lectura (por defecto)
# "w"  — escritura (sobreescribe)
# "a"  — append (añade al final)
# "rb" — lectura binaria (imágenes, PDFs)
# "wb" — escritura binaria

# CSV con el módulo estándar
import csv

# Leer CSV
with open("empleados.csv", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for fila in reader:
        print(fila["nombre"], fila["salario"])

# Escribir CSV
campos = ["nombre", "edad", "ciudad"]
filas = [
    {"nombre": "Ana", "edad": 30, "ciudad": "Madrid"},
    {"nombre": "Bob", "edad": 25, "ciudad": "Barcelona"},
]
with open("salida.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=campos)
    writer.writeheader()
    writer.writerows(filas)`}</code></pre>

            <h2>Próximos pasos</h2>
            <p>
                Con estos fundamentos dominas la base de Python. El siguiente nivel cubre <strong>decoradores, generators, context managers, asyncio y type hints</strong> — las herramientas que usan los desarrolladores profesionales para escribir código más limpio, reutilizable y eficiente.
            </p>
        </LessonLayout>
    );
}
