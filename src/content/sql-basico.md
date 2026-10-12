# SQL desde cero

> Casi todas las aplicaciones guardan sus datos en una base de datos relacional. SQL es el idioma para hablar con ellas, y es de las habilidades que más duran: el SQL que aprendas hoy seguirá sirviendo dentro de veinte años.

## Bases de datos relacionales

Una base de datos relacional guarda la información en **tablas**, parecidas a una hoja de cálculo:

- Cada **tabla** representa un tipo de cosa: `clientes`, `productos`, `pedidos`.
- Cada **fila** es un elemento concreto: un cliente.
- Cada **columna** es un dato de ese elemento: nombre, email, fecha de alta.

Las tablas se **relacionan** entre sí mediante identificadores: un pedido guarda el `id` del cliente que lo hizo.

Motores más usados: **PostgreSQL**, **MySQL / MariaDB**, **SQLite** y SQL Server. El SQL básico es casi idéntico en todos.

### Para practicar

La forma más rápida es SQLite, que no necesita servidor:

- En el navegador: busca "SQLite online" y usa cualquier editor web.
- En tu ordenador: instala [DB Browser for SQLite](https://sqlitebrowser.org/) o ejecuta `sqlite3 tienda.db` en la terminal.

## Crear tablas

```sql
CREATE TABLE clientes (
    id          INTEGER PRIMARY KEY,
    nombre      TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    ciudad      TEXT,
    creado_en   TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE productos (
    id      INTEGER PRIMARY KEY,
    nombre  TEXT NOT NULL,
    precio  REAL NOT NULL CHECK (precio >= 0),
    stock   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE pedidos (
    id          INTEGER PRIMARY KEY,
    cliente_id  INTEGER NOT NULL REFERENCES clientes(id),
    fecha       TEXT NOT NULL,
    estado      TEXT NOT NULL DEFAULT 'pendiente'
);

CREATE TABLE lineas_pedido (
    pedido_id    INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id  INTEGER NOT NULL REFERENCES productos(id),
    cantidad     INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unit  REAL NOT NULL,
    PRIMARY KEY (pedido_id, producto_id)
);
```

| Restricción | Garantiza que… |
| --- | --- |
| `PRIMARY KEY` | Cada fila tiene un identificador único |
| `NOT NULL` | La columna siempre tiene valor |
| `UNIQUE` | No hay dos filas con el mismo valor |
| `DEFAULT` | Se usa un valor si no indicas ninguno |
| `CHECK` | El valor cumple una condición |
| `REFERENCES` (clave foránea) | El valor existe en otra tabla |

> **Consejo:** las restricciones son tu red de seguridad. Aunque tu aplicación valide los datos, la base de datos es la última línea de defensa contra datos incoherentes.

## Insertar, modificar y borrar

```sql
INSERT INTO clientes (nombre, email, ciudad) VALUES
    ('Ana García', 'ana@ejemplo.com', 'Barcelona'),
    ('Luis Pérez', 'luis@ejemplo.com', 'Madrid'),
    ('Marta Ruiz', 'marta@ejemplo.com', 'Barcelona'),
    ('Jon Etxeberria', 'jon@ejemplo.com', NULL);

INSERT INTO productos (nombre, precio, stock) VALUES
    ('Teclado', 45.00, 10),
    ('Ratón', 20.00, 25),
    ('Monitor', 180.00, 4),
    ('Alfombrilla', 8.50, 0);

INSERT INTO pedidos (cliente_id, fecha, estado) VALUES
    (1, '2026-09-01', 'entregado'),
    (1, '2026-09-20', 'enviado'),
    (2, '2026-09-21', 'pendiente');

INSERT INTO lineas_pedido VALUES
    (1, 1, 1, 45.00), (1, 2, 2, 20.00),
    (2, 3, 1, 180.00),
    (3, 2, 1, 20.00), (3, 4, 3, 8.50);
```

```sql
UPDATE productos SET stock = stock - 1 WHERE id = 3;

DELETE FROM clientes WHERE id = 4;
```

> **Atención:** un `UPDATE` o `DELETE` **sin `WHERE`** afecta a todas las filas de la tabla. Antes de ejecutarlos, prueba la misma condición con un `SELECT` para ver qué filas vas a tocar.

## Consultar con SELECT

```sql
SELECT * FROM clientes;                          -- todas las columnas
SELECT nombre, email FROM clientes;              -- solo algunas
SELECT nombre, precio * 1.21 AS precio_con_iva   -- columnas calculadas con alias
FROM productos;
```

### Filtrar con WHERE

```sql
SELECT * FROM productos WHERE precio < 50;
SELECT * FROM productos WHERE stock = 0;
SELECT * FROM clientes WHERE ciudad = 'Barcelona' AND email LIKE '%@ejemplo.com';
SELECT * FROM productos WHERE precio BETWEEN 10 AND 50;
SELECT * FROM clientes WHERE ciudad IN ('Madrid', 'Sevilla');
SELECT * FROM clientes WHERE ciudad IS NULL;      -- nunca "= NULL"
SELECT * FROM productos WHERE nombre LIKE 'T%';   -- empieza por T
```

`NULL` significa "desconocido": cualquier comparación con `NULL` usando `=` da desconocido, por eso se usa `IS NULL` / `IS NOT NULL`.

### Ordenar y limitar

```sql
SELECT nombre, precio FROM productos
ORDER BY precio DESC, nombre ASC
LIMIT 3;                    -- los 3 más caros
```

Para paginar resultados: `LIMIT 10 OFFSET 20` (página 3 de 10 en 10).

## Agregar y agrupar

Las funciones de agregación resumen muchas filas en un valor:

```sql
SELECT COUNT(*) FROM clientes;                 -- número de clientes
SELECT AVG(precio), MIN(precio), MAX(precio) FROM productos;
SELECT SUM(cantidad * precio_unit) AS facturado FROM lineas_pedido;
```

`GROUP BY` calcula el resumen **por grupo**:

```sql
SELECT ciudad, COUNT(*) AS clientes
FROM clientes
GROUP BY ciudad
ORDER BY clientes DESC;
```

`HAVING` filtra grupos (igual que `WHERE` filtra filas):

```sql
SELECT pedido_id, SUM(cantidad * precio_unit) AS total
FROM lineas_pedido
GROUP BY pedido_id
HAVING SUM(cantidad * precio_unit) > 50;
```

> **Nota:** algunos motores (SQLite, MySQL) permiten escribir `HAVING total > 50` usando el alias, pero PostgreSQL no. Repetir la expresión funciona en todos.

Orden en que se evalúa una consulta (útil para entender errores):

```text
FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

Por eso no puedes usar en `WHERE` un alias definido en `SELECT`, pero sí en `ORDER BY`.

## Relacionar tablas con JOIN

`JOIN` combina filas de varias tablas usando sus claves.

```sql
SELECT p.id, p.fecha, p.estado, c.nombre AS cliente
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id;
```

### Tipos de JOIN

| JOIN | Devuelve |
| --- | --- |
| `INNER JOIN` (o `JOIN`) | Solo las filas que tienen pareja en ambas tablas |
| `LEFT JOIN` | Todas las de la izquierda, con `NULL` si no hay pareja |
| `RIGHT JOIN` | Todas las de la derecha (poco usado; se reescribe como LEFT) |
| `FULL JOIN` | Todas las de ambas tablas |

Clientes con su número de pedidos, **incluidos los que no tienen ninguno**:

```sql
SELECT c.nombre, COUNT(p.id) AS pedidos
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
GROUP BY c.id, c.nombre;
```

Fíjate en `COUNT(p.id)` en lugar de `COUNT(*)`: cuenta solo los pedidos reales (ignora los `NULL`), así Marta aparece con 0.

Total de cada pedido con el nombre del cliente (tres tablas):

```sql
SELECT p.id, c.nombre, SUM(l.cantidad * l.precio_unit) AS total
FROM pedidos p
JOIN clientes c       ON c.id = p.cliente_id
JOIN lineas_pedido l  ON l.pedido_id = p.id
GROUP BY p.id, c.nombre
ORDER BY total DESC;
```

> **Ejercicio:** obtén los productos que nunca se han vendido. Pista: `LEFT JOIN` de productos con líneas de pedido y filtra donde el lado derecho sea `NULL`.

## Subconsultas y CTE

Una **subconsulta** es una consulta dentro de otra:

```sql
SELECT nombre, precio
FROM productos
WHERE precio > (SELECT AVG(precio) FROM productos);
```

Una **CTE** (`WITH`) da nombre a una consulta intermedia y hace el SQL mucho más legible:

```sql
WITH totales AS (
    SELECT pedido_id, SUM(cantidad * precio_unit) AS total
    FROM lineas_pedido
    GROUP BY pedido_id
)
SELECT c.nombre, SUM(t.total) AS gastado
FROM totales t
JOIN pedidos p  ON p.id = t.pedido_id
JOIN clientes c ON c.id = p.cliente_id
GROUP BY c.nombre
ORDER BY gastado DESC;
```

## Diseñar bien las tablas

**Normalizar** es evitar datos repetidos. Mal diseño:

| pedido | cliente | email_cliente | producto |
| --- | --- | --- | --- |
| 1 | Ana | ana@ejemplo.com | Teclado |
| 2 | Ana | ana@ejemplo.com | Monitor |

Si Ana cambia de email, hay que actualizarlo en muchas filas, y es fácil dejar alguna mal. La solución es lo que hicimos al principio: una tabla `clientes` y que `pedidos` guarde solo `cliente_id`.

Reglas prácticas:

- **Cada dato, en un solo sitio.**
- Una tabla por "cosa" del mundo real.
- Relación **uno a muchos** (un cliente, muchos pedidos): clave foránea en el lado "muchos".
- Relación **muchos a muchos** (pedidos y productos): tabla intermedia (`lineas_pedido`).
- Nombres claros y consistentes: plural para tablas, `snake_case`, `<tabla>_id` para claves foráneas.

> **Nota:** a veces se desnormaliza a propósito por rendimiento (por ejemplo, guardar `precio_unit` en la línea de pedido, porque el precio del producto puede cambiar después y el pedido debe conservar el precio de la compra).

## Índices y rendimiento

Sin índice, buscar `WHERE email = '...'` obliga a recorrer **toda** la tabla. Un índice funciona como el índice de un libro.

```sql
CREATE INDEX idx_pedidos_cliente ON pedidos (cliente_id);
CREATE UNIQUE INDEX idx_clientes_email ON clientes (email);
```

- Indexa las columnas que usas en `WHERE`, `JOIN` y `ORDER BY` con frecuencia.
- Las claves primarias y `UNIQUE` ya tienen índice.
- Cada índice ocupa espacio y ralentiza un poco las escrituras: no indexes todo.

Para ver cómo ejecuta el motor una consulta:

```sql
EXPLAIN QUERY PLAN SELECT * FROM pedidos WHERE cliente_id = 1;  -- SQLite
-- EXPLAIN ANALYZE ...  en PostgreSQL y MySQL 8
```

Si ves `SCAN` (recorrido completo) en una tabla grande, probablemente falta un índice. Profundiza en [PostgreSQL avanzado](/lecciones/postgresql-avanzado).

## Transacciones

Una transacción agrupa varias operaciones que deben ocurrir **todas o ninguna**. Ejemplo clásico: una transferencia bancaria.

```sql
BEGIN;
UPDATE cuentas SET saldo = saldo - 100 WHERE id = 1;
UPDATE cuentas SET saldo = saldo + 100 WHERE id = 2;
COMMIT;      -- o ROLLBACK; si algo ha ido mal
```

Si el servidor se cae entre los dos `UPDATE`, sin transacción el dinero desaparecería. Las transacciones garantizan las propiedades **ACID**: atomicidad, consistencia, aislamiento y durabilidad.

## SQL desde tu aplicación

Desde el código, **nunca** metas los datos del usuario dentro del texto SQL:

```php
// MAL: inyección SQL. Si $email vale  ' OR '1'='1  devuelve todos los usuarios.
$pdo->query("SELECT * FROM usuarios WHERE email = '$email'");

// BIEN: consulta preparada
$stmt = $pdo->prepare('SELECT * FROM usuarios WHERE email = ?');
$stmt->execute([$email]);
```

```javascript
// Node.js con node-postgres
await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
```

Los ORM como Eloquent (Laravel) o Prisma (Node) generan consultas preparadas por ti, pero conviene saber SQL para entender qué hacen y optimizarlas. Sigue con [Eloquent ORM a fondo](/lecciones/eloquent).

## Ejercicios finales

Con las tablas de este curso, escribe consultas para:

1. Los clientes de Barcelona ordenados por nombre.
2. El producto más caro con stock disponible.
3. El número de pedidos por estado.
4. El total facturado por cliente, de mayor a menor, incluidos los clientes sin pedidos (con 0).
5. Los pedidos que contienen más de un producto distinto.

> **Reto:** añade una tabla `categorias` y relaciónala con `productos`. Después, calcula las ventas totales por categoría.

Pon a prueba lo aprendido con el [test de SQL](/juegos/quiz-sql).
