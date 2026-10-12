# PHP desde cero

> PHP mueve una gran parte de la web, desde WordPress hasta aplicaciones hechas con Laravel o Symfony. Este curso te da una base sólida en PHP moderno (8.3 y posteriores) para que después [Laravel](/lecciones/laravel) tenga todo el sentido.

## Qué es PHP y cómo se ejecuta

PHP es un lenguaje que se ejecuta **en el servidor**. El navegador pide una página, el servidor ejecuta el código PHP y devuelve el HTML resultante. Quien visita la web nunca ve tu código PHP, solo lo que este genera.

### Instalación

- **Windows**: instala [Laravel Herd](https://herd.laravel.com/) (incluye PHP y Composer) o XAMPP.
- **macOS**: Laravel Herd o `brew install php`.
- **Linux (Ubuntu/Debian)**: `sudo apt install php-cli php-mbstring php-xml php-sqlite3`.

Comprueba la versión:

```bash
php -v
```

### Hola, mundo

Crea `hola.php`:

```php
<?php

echo "Hola, mundo\n";
```

Ejecútalo desde la terminal con `php hola.php`, o arranca el servidor de desarrollo integrado y ábrelo en el navegador:

```bash
php -S localhost:8000
# Abre http://localhost:8000/hola.php
```

> **Nota:** en archivos que solo contienen PHP, no cierres la etiqueta `?>` al final. Evita que se cuelen espacios en blanco en la respuesta.

## Variables y tipos

Las variables empiezan por `$` y no hace falta declarar el tipo:

```php
<?php

$nombre = "Ana";
$edad = 28;
$altura = 1.68;
$activo = true;
$sinValor = null;

echo "Me llamo $nombre y tengo $edad años\n";   // interpolación con comillas dobles
echo 'Con comillas simples no se interpola: $nombre' . "\n";
echo "Concatenar con el punto: " . $nombre . "\n";
```

| Tipo | Ejemplo |
| --- | --- |
| `int` | `42` |
| `float` | `3.14` |
| `string` | `"texto"` |
| `bool` | `true`, `false` |
| `array` | `[1, 2, 3]` |
| `null` | `null` |

`var_dump()` muestra el tipo y el valor; es tu mejor amigo para depurar:

```php
var_dump($edad);   // int(28)
var_dump("28");    // string(2) "28"
```

### Comparaciones: == frente a ===

```php
var_dump(5 == "5");    // true: compara el valor convirtiendo tipos
var_dump(5 === "5");   // false: compara valor Y tipo
```

Usa siempre `===` y `!==` salvo que tengas un motivo claro. Evita sorpresas.

### Tipos estrictos

Añade al principio de cada archivo:

```php
<?php

declare(strict_types=1);
```

Así PHP lanza un error si pasas un tipo incorrecto a una función con tipos declarados, en lugar de convertirlo en silencio.

## Condicionales y match

```php
$hora = (int) date('H');

if ($hora < 12) {
    $saludo = "Buenos días";
} elseif ($hora < 20) {
    $saludo = "Buenas tardes";
} else {
    $saludo = "Buenas noches";
}
```

`match` (PHP 8) es una alternativa más segura al `switch`: compara con `===`, devuelve un valor y falla si ningún caso coincide.

```php
$estado = 'enviado';

$mensaje = match ($estado) {
    'pendiente' => 'Estamos preparando tu pedido',
    'enviado', 'en_reparto' => 'Tu pedido está en camino',
    'entregado' => '¡Pedido entregado!',
    default => 'Estado desconocido',
};
```

Operadores útiles:

```php
$nombre = $_GET['nombre'] ?? 'invitado';     // valor por defecto si no existe o es null
$precio = $esSocio ? 8 : 10;                 // operador ternario
$longitud = $usuario?->perfil?->bio;         // nullsafe: null si algo intermedio es null
```

## Bucles

```php
for ($i = 1; $i <= 3; $i++) {
    echo "Vuelta $i\n";
}

$intentos = 0;
while ($intentos < 3) {
    $intentos++;
}

$frutas = ['manzana', 'pera', 'uva'];
foreach ($frutas as $fruta) {
    echo $fruta . "\n";
}

foreach ($frutas as $indice => $fruta) {
    echo "$indice: $fruta\n";
}
```

`foreach` es el bucle que más usarás: recorre arrays sin preocuparte de los índices.

## Arrays

En PHP, el array sirve a la vez de **lista** y de **diccionario** (clave → valor).

```php
// Lista (índices numéricos)
$colores = ['rojo', 'verde', 'azul'];
$colores[] = 'negro';            // añadir al final
echo $colores[0];                // rojo
echo count($colores);            // 4

// Asociativo (claves de texto)
$usuario = [
    'nombre' => 'Ana',
    'email' => 'ana@ejemplo.com',
    'roles' => ['editor', 'autora'],
];
echo $usuario['email'];
$usuario['activo'] = true;

// Array de arrays: lo que te devolverá una base de datos
$productos = [
    ['nombre' => 'Teclado', 'precio' => 45.0, 'stock' => 3],
    ['nombre' => 'Ratón', 'precio' => 20.0, 'stock' => 0],
    ['nombre' => 'Monitor', 'precio' => 180.0, 'stock' => 5],
];
```

Funciones imprescindibles:

```php
$conStock = array_filter($productos, fn ($p) => $p['stock'] > 0);
$nombres  = array_map(fn ($p) => $p['nombre'], $productos);
$total    = array_sum(array_column($productos, 'precio'));

usort($productos, fn ($a, $b) => $a['precio'] <=> $b['precio']); // ordenar por precio

in_array('rojo', $colores, true);         // ¿existe el valor?
array_key_exists('email', $usuario);      // ¿existe la clave?
[$primero, $segundo] = $colores;          // desestructurar
```

> **Consejo:** `fn ($x) => ...` es una *arrow function*: una función corta que además puede usar las variables de fuera sin `use`.

## Funciones

```php
function precioFinal(float $precio, float $iva = 0.21): float
{
    return round($precio * (1 + $iva), 2);
}

echo precioFinal(100);          // 121
echo precioFinal(100, 0.10);    // 110
echo precioFinal(iva: 0.04, precio: 50); // argumentos con nombre (PHP 8)
```

- Declara los **tipos** de parámetros y del valor de retorno: documentan el código y detectan errores.
- `?string` significa "string o null"; `int|float` acepta cualquiera de los dos.
- Una función debe hacer **una sola cosa** y tener un nombre que lo diga.

Funciones de texto frecuentes:

```php
strlen('hola');                     // 4 (bytes)
mb_strlen('camión');                // 6 (caracteres; usa mb_ con tildes y ñ)
strtoupper('hola');                 // HOLA
str_contains('Hola mundo', 'mundo'); // true
str_starts_with('index.php', 'index'); // true
explode(',', 'a,b,c');              // ['a', 'b', 'c']
implode(' - ', ['a', 'b']);         // 'a - b'
trim('  espacios  ');               // 'espacios'
sprintf('%05.2f €', 3.5);           // '03.50 €'
```

## PHP y HTML: formularios

PHP nació para generar HTML. Un formulario que envía datos al propio archivo:

```php
<?php
declare(strict_types=1);

$errores = [];
$nombre = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = trim($_POST['nombre'] ?? '');
    $email = trim($_POST['email'] ?? '');

    if ($nombre === '') {
        $errores[] = 'El nombre es obligatorio';
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errores[] = 'El correo no es válido';
    }
}

function e(string $texto): string
{
    return htmlspecialchars($texto, ENT_QUOTES, 'UTF-8');
}
?>
<!doctype html>
<html lang="es">
<body>
  <?php foreach ($errores as $error): ?>
    <p role="alert"><?= e($error) ?></p>
  <?php endforeach; ?>

  <form method="post">
    <label for="nombre">Nombre</label>
    <input id="nombre" name="nombre" value="<?= e($nombre) ?>">
    <label for="email">Correo</label>
    <input id="email" name="email" type="email">
    <button>Enviar</button>
  </form>
</body>
</html>
```

> **Importante:** todo lo que viene del usuario (`$_GET`, `$_POST`, cookies, cabeceras) puede ser malicioso. **Valida** al recibir y **escapa** al mostrar con `htmlspecialchars`. Si no, abres la puerta a ataques XSS. Más en [Seguridad básica en la web](/lecciones/seguridad-web).

- `$_GET`: datos de la URL (`?pagina=2`). Para leer y filtrar.
- `$_POST`: datos del cuerpo del formulario. Para crear o modificar.
- `<?= ... ?>` es la forma corta de `<?php echo ... ?>`.

## Sesiones y cookies

HTTP no recuerda nada entre peticiones. Las **sesiones** guardan datos en el servidor asociados a una cookie del navegador.

```php
<?php
session_start();

// Tras comprobar usuario y contraseña:
session_regenerate_id(true);   // evita el robo de sesión
$_SESSION['usuario_id'] = 42;

// En otra página:
session_start();
if (!isset($_SESSION['usuario_id'])) {
    header('Location: /login.php');
    exit;
}

// Cerrar sesión:
$_SESSION = [];
session_destroy();
```

Contraseñas: **nunca** las guardes en claro.

```php
$hash = password_hash($passwordEnClaro, PASSWORD_DEFAULT); // guarda esto en la base de datos
if (password_verify($passwordIntroducida, $hash)) {
    // correcto
}
```

## Bases de datos con PDO

PDO es la forma estándar de hablar con MySQL, PostgreSQL o SQLite.

```php
<?php
declare(strict_types=1);

$pdo = new PDO('sqlite:' . __DIR__ . '/tienda.sqlite', options: [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);

$pdo->exec('CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    precio REAL NOT NULL
)');

// Insertar con consulta preparada
$stmt = $pdo->prepare('INSERT INTO productos (nombre, precio) VALUES (:nombre, :precio)');
$stmt->execute(['nombre' => 'Teclado', 'precio' => 45.0]);

// Leer
$stmt = $pdo->prepare('SELECT * FROM productos WHERE precio < :max ORDER BY precio');
$stmt->execute(['max' => 100]);
foreach ($stmt->fetchAll() as $producto) {
    echo "{$producto['nombre']}: {$producto['precio']} €\n";
}
```

> **Atención:** jamás construyas SQL concatenando datos del usuario (`"... WHERE id = " . $_GET['id']`). Usa siempre consultas preparadas con parámetros: es la defensa contra la inyección SQL. Aprende el lenguaje en [SQL desde cero](/lecciones/sql-basico).

## Programación orientada a objetos

Las clases agrupan **datos** (propiedades) y **comportamiento** (métodos). Laravel está construido por completo con clases.

```php
<?php
declare(strict_types=1);

class CuentaBancaria
{
    private float $saldo = 0;

    public function __construct(
        public readonly string $titular,   // promoción de propiedades (PHP 8)
    ) {}

    public function ingresar(float $cantidad): void
    {
        if ($cantidad <= 0) {
            throw new InvalidArgumentException('La cantidad debe ser positiva');
        }
        $this->saldo += $cantidad;
    }

    public function retirar(float $cantidad): void
    {
        if ($cantidad > $this->saldo) {
            throw new RuntimeException('Saldo insuficiente');
        }
        $this->saldo -= $cantidad;
    }

    public function saldo(): float
    {
        return $this->saldo;
    }
}

$cuenta = new CuentaBancaria('Ana');
$cuenta->ingresar(100);
$cuenta->retirar(30);
echo $cuenta->saldo(); // 70
```

- `private`: solo accesible desde dentro de la clase. Protege el saldo de cambios sin control.
- `public`: accesible desde fuera.
- `readonly`: se asigna una vez y no cambia.
- Las **excepciones** señalan errores que quien llama debe gestionar con `try/catch`.

### Herencia, interfaces y enums

```php
interface Notificador
{
    public function enviar(string $destino, string $mensaje): void;
}

class NotificadorEmail implements Notificador
{
    public function enviar(string $destino, string $mensaje): void
    {
        // mail($destino, 'Aviso', $mensaje);
    }
}

enum EstadoPedido: string
{
    case Pendiente = 'pendiente';
    case Enviado = 'enviado';

    public function etiqueta(): string
    {
        return match ($this) {
            self::Pendiente => 'Pendiente de envío',
            self::Enviado => 'En camino',
        };
    }
}

echo EstadoPedido::from('enviado')->etiqueta(); // En camino
```

Una **interfaz** es un contrato: "quien me implemente tendrá estos métodos". Permite cambiar el email por SMS sin tocar el código que notifica.

## Composer y autoload

**Composer** gestiona dependencias (librerías de terceros) y carga tus clases automáticamente.

```bash
composer init
composer require nesbot/carbon     # instala una librería de fechas
```

En `composer.json` define el autoload según el estándar PSR-4:

```json
{
  "autoload": {
    "psr-4": { "App\\": "src/" }
  }
}
```

```bash
composer dump-autoload
```

Ahora `src/Servicios/Calculadora.php` con `namespace App\Servicios;` se carga solo:

```php
<?php
require __DIR__ . '/vendor/autoload.php';

use App\Servicios\Calculadora;
use Carbon\Carbon;

echo Carbon::now()->addDays(3)->format('d/m/Y');
```

> **Nota:** la carpeta `vendor/` no se sube a Git (añádela al `.gitignore`). Quien clone el proyecto ejecuta `composer install`.

## Proyecto: una lista de tareas

Junta todo en una pequeña aplicación con SQLite:

```php
<?php
declare(strict_types=1);

$pdo = new PDO('sqlite:' . __DIR__ . '/tareas.sqlite', options: [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
$pdo->exec('CREATE TABLE IF NOT EXISTS tareas (id INTEGER PRIMARY KEY, titulo TEXT NOT NULL, hecha INTEGER DEFAULT 0)');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $titulo = trim($_POST['titulo'] ?? '');
    if (isset($_POST['completar'])) {
        $pdo->prepare('UPDATE tareas SET hecha = 1 WHERE id = ?')->execute([(int) $_POST['completar']]);
    } elseif ($titulo !== '') {
        $pdo->prepare('INSERT INTO tareas (titulo) VALUES (?)')->execute([$titulo]);
    }
    header('Location: ' . $_SERVER['PHP_SELF']);   // patrón POST/redirect/GET
    exit;
}

$tareas = $pdo->query('SELECT * FROM tareas ORDER BY hecha, id DESC')->fetchAll();
$e = fn (string $s) => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
?>
<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><title>Tareas</title></head>
<body>
  <h1>Mis tareas</h1>
  <form method="post">
    <label for="titulo">Nueva tarea</label>
    <input id="titulo" name="titulo" required>
    <button>Añadir</button>
  </form>
  <ul>
    <?php foreach ($tareas as $t): ?>
      <li>
        <?= $t['hecha'] ? '<s>' . $e($t['titulo']) . '</s>' : $e($t['titulo']) ?>
        <?php if (!$t['hecha']): ?>
          <form method="post" style="display:inline">
            <button name="completar" value="<?= $t['id'] ?>">Hecha</button>
          </form>
        <?php endif; ?>
      </li>
    <?php endforeach; ?>
  </ul>
</body>
</html>
```

> **Reto:** añade un botón para borrar tareas y un contador de tareas pendientes. Después, piensa qué partes se repetirían en una aplicación más grande (rutas, validación, plantillas, acceso a datos…): eso es exactamente lo que resuelve un framework.

## Siguientes pasos

- Da el salto a [Primeros pasos con Laravel](/lecciones/laravel).
- Practica con el juego [Adivina la salida en PHP](/juegos/adivina-output-php).
- Documentación oficial: [php.net/manual/es](https://www.php.net/manual/es/).
