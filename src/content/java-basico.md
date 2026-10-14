# Java desde cero

> Java lleva treinta años entre los lenguajes más usados del mundo: bancos, seguros, administraciones, Android, sistemas de punto de venta y miles de backends con Spring. Es un lenguaje con tipos estrictos y muy explícito, lo que lo hace algo más largo de escribir pero muy fácil de leer y mantener en equipos grandes.

## Qué es Java y cómo funciona

Cuando escribes Java no generas un programa para Windows o Linux directamente. El proceso tiene dos pasos:

1. El **compilador** (`javac`) convierte tu código `.java` en **bytecode** (`.class`).
2. La **máquina virtual de Java** (JVM) ejecuta ese bytecode en cualquier sistema.

Por eso el lema de Java es *"escribe una vez, ejecuta en cualquier parte"*: el mismo `.class` funciona en Windows, macOS y Linux si tienen una JVM instalada.

| Pieza | Qué es |
| --- | --- |
| **JDK** | Kit de desarrollo: compilador, JVM y herramientas. Es lo que instalas para programar |
| **JRE / JVM** | Lo necesario para ejecutar programas Java |
| **LTS** | Versiones con soporte largo: 17, 21 y 25. Usa siempre una LTS |

### Instalación

Descarga un JDK libre como **Eclipse Temurin** (adoptium.net) en su última versión LTS y comprueba la instalación:

```bash
java -version
javac -version
```

Como editor, **IntelliJ IDEA Community** (gratis) es el más usado para Java. VS Code con el *Extension Pack for Java* también funciona bien.

## Tu primer programa

Crea un archivo `Hola.java`:

```java
public class Hola {
    public static void main(String[] args) {
        System.out.println("¡Hola, Java!");
    }
}
```

- Todo el código vive dentro de una **clase**. El archivo debe llamarse igual que la clase pública: `Hola.java`.
- `main` es el punto de entrada: la JVM empieza por ahí.
- `System.out.println` escribe una línea en la consola.
- Cada instrucción termina en **punto y coma**.

Compílalo y ejecútalo:

```bash
javac Hola.java     # genera Hola.class
java Hola           # ejecuta la clase
```

Desde Java 11 también puedes ejecutar un archivo directamente con `java Hola.java`, sin compilar antes.

> **Nota:** desde Java 25 existe una forma más corta para programas pequeños: un archivo con solo `void main() { IO.println("Hola"); }`. En proyectos reales y en casi todo el código que leerás seguirás viendo la versión clásica con `public static void main`, así que conviene conocerla bien.

## Variables y tipos

Java tiene **tipado estático**: cada variable tiene un tipo que no cambia.

```java
int edad = 30;
double precio = 19.99;
boolean activo = true;
char inicial = 'A';
String nombre = "Ana";
long poblacion = 8_100_000_000L;
```

| Tipo | Guarda | Ejemplo |
| --- | --- | --- |
| `int` | Enteros (±2.100 millones) | `42` |
| `long` | Enteros grandes | `8_100_000_000L` |
| `double` | Decimales | `3.14` |
| `boolean` | Verdadero o falso | `true` |
| `char` | Un carácter, con comillas simples | `'a'` |
| `String` | Texto, con comillas dobles | `"hola"` |

Los tipos en minúscula (`int`, `double`, `boolean`…) son **primitivos**. `String` es una **clase**: por eso empieza en mayúscula y tiene métodos.

### var e inmutabilidad

Con `var` el compilador deduce el tipo, pero sigue siendo fijo:

```java
var ciudad = "Terrassa";   // String
var total = 0;             // int
// total = "cero";         // Error: total es int
```

`final` impide reasignar una variable:

```java
final double IVA = 0.21;
// IVA = 0.10;  // Error de compilación
```

### Operaciones y conversiones

```java
int a = 7, b = 2;
System.out.println(a / b);        // 3  (división entera)
System.out.println(a % b);        // 1  (resto)
System.out.println(a / 2.0);      // 3.5
System.out.println((double) a / b); // 3.5 (conversión explícita)

int numero = Integer.parseInt("42");
String texto = String.valueOf(42);
```

> **Atención:** dividir dos `int` da un `int`. Es una de las fuentes de errores más comunes al empezar.

## Strings

```java
String saludo = "Hola, mundo";

saludo.length();              // 11
saludo.toUpperCase();         // "HOLA, MUNDO"
saludo.contains("mundo");     // true
saludo.substring(0, 4);       // "Hola"
saludo.replace("mundo", "Java");
saludo.split(", ");           // ["Hola", "mundo"]
"  hola  ".strip();           // "hola"
```

Para comparar textos usa **siempre** `equals`, nunca `==`:

```java
String a = "java";
String b = new String("java");
System.out.println(a == b);       // false: son objetos distintos
System.out.println(a.equals(b));  // true: mismo contenido
```

Para construir texto con variables, `formatted` o `String.format`:

```java
String linea = "%s tiene %d años".formatted("Ana", 30);
```

Los **text blocks** (tres comillas) son cómodos para textos de varias líneas, como JSON o SQL:

```java
String sql = """
    SELECT nombre, email
    FROM usuarios
    WHERE activo = true
    """;
```

## Condiciones

```java
int nota = 7;

if (nota >= 9) {
    System.out.println("Sobresaliente");
} else if (nota >= 5) {
    System.out.println("Aprobado");
} else {
    System.out.println("Suspenso");
}
```

Operadores lógicos: `&&` (y), `||` (o), `!` (no).

### switch moderno

Desde Java 14, `switch` puede devolver un valor y usa flechas, sin `break`:

```java
String dia = "sábado";
String tipo = switch (dia) {
    case "sábado", "domingo" -> "fin de semana";
    case "lunes", "martes", "miércoles", "jueves", "viernes" -> "laborable";
    default -> "desconocido";
};
```

El operador ternario resume un `if` sencillo:

```java
String estado = nota >= 5 ? "aprobado" : "suspenso";
```

## Bucles

```java
// for clásico
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

// while
int intentos = 3;
while (intentos > 0) {
    intentos--;
}

// for-each: recorrer una colección
String[] lenguajes = {"Java", "Kotlin", "Python"};
for (String lenguaje : lenguajes) {
    System.out.println(lenguaje);
}
```

`break` sale del bucle y `continue` salta a la siguiente vuelta.

## Arrays y colecciones

Un **array** tiene tamaño fijo:

```java
int[] numeros = {4, 8, 15, 16, 23, 42};
System.out.println(numeros[0]);       // 4
System.out.println(numeros.length);   // 6
```

En la práctica casi siempre usarás las **colecciones**, que crecen solas:

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

List<String> tareas = new ArrayList<>();
tareas.add("Estudiar Java");
tareas.add("Hacer ejercicios");
tareas.remove(0);
System.out.println(tareas.size());    // 1

Map<String, Integer> edades = new HashMap<>();
edades.put("Ana", 30);
edades.put("Luis", 25);
System.out.println(edades.get("Ana"));            // 30
System.out.println(edades.getOrDefault("Eva", 0)); // 0
```

| Colección | Para qué |
| --- | --- |
| `List` (`ArrayList`) | Elementos en orden, con repetidos |
| `Set` (`HashSet`) | Sin repetidos |
| `Map` (`HashMap`) | Pares clave → valor |

Lo que va entre `< >` es el **tipo genérico**: `List<String>` solo admite textos. Las colecciones no aceptan primitivos, así que se usan sus clases envoltorio: `Integer`, `Double`, `Boolean`.

Para listas fijas, `List.of("a", "b")` y `Map.of("a", 1)` crean colecciones **inmutables**.

## Métodos

Un método es una función dentro de una clase:

```java
public class Calculadora {

    static double mediaDe(int[] numeros) {
        if (numeros.length == 0) return 0;
        int suma = 0;
        for (int n : numeros) suma += n;
        return (double) suma / numeros.length;
    }

    public static void main(String[] args) {
        System.out.println(mediaDe(new int[]{4, 6, 8})); // 6.0
    }
}
```

- Se declara el **tipo de retorno** (`double`) o `void` si no devuelve nada.
- Cada parámetro lleva su tipo.
- `static` significa que el método pertenece a la clase y se llama sin crear objetos.

### Sobrecarga

Puedes tener varios métodos con el mismo nombre si sus parámetros son distintos:

```java
static int sumar(int a, int b) { return a + b; }
static double sumar(double a, double b) { return a + b; }
```

## Clases y objetos

Una **clase** es un molde; un **objeto** es algo concreto creado con ese molde.

```java
public class CuentaBancaria {
    private final String titular;
    private double saldo;

    public CuentaBancaria(String titular) {
        this.titular = titular;
        this.saldo = 0;
    }

    public void ingresar(double cantidad) {
        if (cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser positiva");
        }
        saldo += cantidad;
    }

    public double getSaldo() {
        return saldo;
    }
}
```

```java
CuentaBancaria cuenta = new CuentaBancaria("Ana");
cuenta.ingresar(100);
System.out.println(cuenta.getSaldo()); // 100.0
```

- Los atributos son `private`: nadie de fuera puede poner un saldo negativo a mano. Esto es la **encapsulación**.
- El **constructor** tiene el nombre de la clase y prepara el objeto.
- `this` se refiere al objeto actual.

### Records

Para clases que solo guardan datos, los **records** te ahorran el constructor, los getters, `equals`, `hashCode` y `toString`:

```java
public record Producto(String nombre, double precio) {}

var p = new Producto("Taza", 9.5);
System.out.println(p.nombre());  // Taza
System.out.println(p);           // Producto[nombre=Taza, precio=9.5]
```

Los records son inmutables: perfectos para datos que viajan entre capas de una aplicación.

## Herencia e interfaces

Una **interfaz** define qué sabe hacer algo, sin decir cómo:

```java
public interface Figura {
    double area();
}

public record Circulo(double radio) implements Figura {
    public double area() { return Math.PI * radio * radio; }
}

public record Rectangulo(double ancho, double alto) implements Figura {
    public double area() { return ancho * alto; }
}
```

```java
List<Figura> figuras = List.of(new Circulo(1), new Rectangulo(2, 3));
for (Figura f : figuras) {
    System.out.printf("%.2f%n", f.area());
}
```

Cada figura calcula su área a su manera, pero las tratas a todas igual: eso es el **polimorfismo**.

La **herencia** (`extends`) permite que una clase reutilice y amplíe otra:

```java
public class Empleado {
    protected String nombre;
    public Empleado(String nombre) { this.nombre = nombre; }
    public double sueldo() { return 1500; }
}

public class Responsable extends Empleado {
    public Responsable(String nombre) { super(nombre); }

    @Override
    public double sueldo() { return super.sueldo() + 500; }
}
```

> **Consejo:** prefiere interfaces y composición antes que cadenas largas de herencia. Una clase solo puede heredar de otra, pero puede implementar muchas interfaces.

### Pattern matching

Java moderno permite comprobar el tipo y extraer datos a la vez:

```java
static String describir(Figura f) {
    return switch (f) {
        case Circulo c -> "Círculo de radio " + c.radio();
        case Rectangulo r -> "Rectángulo de " + r.ancho() + "x" + r.alto();
        default -> "Otra figura";
    };
}
```

## Excepciones

Cuando algo va mal, Java lanza una **excepción**. Se capturan con `try` / `catch`:

```java
try {
    int numero = Integer.parseInt("doce");
} catch (NumberFormatException e) {
    System.out.println("Eso no es un número: " + e.getMessage());
} finally {
    System.out.println("Esto se ejecuta siempre");
}
```

Hay dos tipos:

| Tipo | Ejemplos | ¿Obligatorio capturarla? |
| --- | --- | --- |
| **Comprobadas** (*checked*) | `IOException` | Sí, o declararla con `throws` |
| **No comprobadas** (*unchecked*) | `NullPointerException`, `IllegalArgumentException` | No |

Para recursos que hay que cerrar (archivos, conexiones), usa **try-with-resources**: se cierran solos.

```java
import java.nio.file.Files;
import java.nio.file.Path;

try (var lineas = Files.lines(Path.of("datos.txt"))) {
    lineas.forEach(System.out::println);
} catch (java.io.IOException e) {
    System.out.println("No se pudo leer el archivo");
}
```

### El famoso null

Una variable de objeto puede valer `null`, y llamar a un método sobre `null` lanza `NullPointerException`. Para valores que pueden no existir, usa `Optional`:

```java
Optional<String> email = buscarEmail("ana");
System.out.println(email.orElse("sin email"));
```

## Streams y lambdas

Los **streams** procesan colecciones de forma declarativa, como `map` y `filter` en JavaScript:

```java
import java.util.stream.Collectors;

record Venta(String producto, int unidades, double precio) {}

List<Venta> ventas = List.of(
    new Venta("Taza", 3, 9.5),
    new Venta("Mochila", 1, 49.0),
    new Venta("Taza", 2, 9.5)
);

double total = ventas.stream()
    .mapToDouble(v -> v.unidades() * v.precio())
    .sum();                                   // 96.5

List<String> caros = ventas.stream()
    .filter(v -> v.precio() > 20)
    .map(Venta::producto)
    .toList();                                // [Mochila]

Map<String, Integer> unidadesPorProducto = ventas.stream()
    .collect(Collectors.groupingBy(Venta::producto, Collectors.summingInt(Venta::unidades)));
// Taza=5 y Mochila=1 (un HashMap no garantiza el orden)
```

- `v -> v.precio() > 20` es una **lambda**: una función corta sin nombre.
- `Venta::producto` es una **referencia a método**, equivale a `v -> v.producto()`.
- Las operaciones intermedias (`filter`, `map`) no hacen nada hasta que llega una final (`sum`, `toList`, `collect`).

## Proyectos con Maven o Gradle

Los proyectos reales no se compilan a mano. Se usa una herramienta de construcción que gestiona dependencias, compila y ejecuta los tests:

- **Maven**: configuración en `pom.xml`. Muy extendido en empresas.
- **Gradle**: configuración en `build.gradle.kts`. Es el estándar en Android.

Estructura típica de un proyecto Maven:

```text
mi-app/
├── pom.xml
└── src/
    ├── main/java/com/ejemplo/App.java
    └── test/java/com/ejemplo/AppTest.java
```

Comandos básicos:

```bash
mvn compile      # compilar
mvn test         # ejecutar los tests
mvn package      # generar el .jar
```

Los tests se escriben con **JUnit**:

```java
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class CuentaBancariaTest {
    @Test
    void ingresarSumaAlSaldo() {
        var cuenta = new CuentaBancaria("Ana");
        cuenta.ingresar(50);
        assertEquals(50, cuenta.getSaldo());
    }
}
```

### Y después, ¿qué?

- **Spring Boot**: el framework de backend más usado con Java. Si ya conoces [APIs REST con Laravel](/lecciones/apis-rest), las ideas (rutas, controladores, validación, inyección de dependencias) te sonarán.
- **Android**: hoy se programa sobre todo en Kotlin, que es 100 % compatible con Java. Mira [Kotlin para Android](/lecciones/kotlin-android).
- **Bases de datos**: JDBC y JPA/Hibernate, sobre lo que aprendiste en [SQL desde cero](/lecciones/sql-basico).

## Proyecto: gestor de biblioteca

Construye un programa de consola para una pequeña biblioteca:

1. Un `record Libro(String isbn, String titulo, String autor, int anio)`.
2. Una clase `Biblioteca` con una `List<Libro>` privada y un `Map<String, String>` con los préstamos (ISBN → nombre de la persona).
3. Métodos `anadir`, `prestar`, `devolver` y `disponibles`. `prestar` debe lanzar `IllegalStateException` si el libro ya está prestado.
4. Un método que devuelva los libros de un autor ordenados por año, usando streams.
5. Un menú en `main` que lea opciones con `Scanner` hasta que el usuario escriba `salir`.
6. Tests con JUnit para `prestar` y `devolver`, incluido el caso de error.

> **Ejercicio:** añade un método `librosPorDecada()` que devuelva un `Map<Integer, List<Libro>>` agrupando por década (1990, 2000…). Pista: `Collectors.groupingBy(l -> l.anio() / 10 * 10)`.

> **Reto:** guarda la biblioteca en un archivo CSV al salir y cárgala al arrancar, usando `Files.readAllLines` y `Files.write` con try-with-resources donde haga falta. Controla qué pasa si el archivo no existe o tiene una línea mal formada.
