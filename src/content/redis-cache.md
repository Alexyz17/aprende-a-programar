# Redis: caché y mensajería

> Redis es una base de datos en memoria extremadamente rápida (respuestas por debajo del milisegundo). Se usa como caché, almacén de sesiones, cola de trabajos, contador, ranking en tiempo real y sistema de mensajería. En este curso aprenderás sus estructuras de datos y los patrones que se usan en producción.

## Qué es Redis y cuándo usarlo

Redis guarda los datos **en memoria RAM** como pares clave → valor, donde el valor puede ser una de varias estructuras de datos. Opcionalmente los persiste en disco.

Úsalo para:

- **Caché** de consultas lentas o respuestas de APIs.
- **Sesiones** de usuarios compartidas entre varios servidores.
- **Colas de trabajos** (envío de emails, procesado de imágenes).
- **Límites de peticiones** (*rate limiting*).
- **Contadores y rankings** en tiempo real.
- **Mensajería** entre servicios (pub/sub, streams).

No lo uses como base de datos principal para datos que no puedes perder, salvo que configures bien la persistencia y entiendas sus garantías. Lo habitual es **Redis junto a** PostgreSQL o MySQL.

> **Nota:** en 2024 Redis cambió su licencia y apareció **Valkey**, un fork de código abierto mantenido por la Linux Foundation y compatible con los mismos comandos. Todo lo de este curso funciona igual en ambos.

### Arrancarlo

```bash
docker run -d --name redis -p 6379:6379 redis:7-alpine
docker exec -it redis redis-cli
```

```text
127.0.0.1:6379> PING
PONG
```

## Strings y expiración

El tipo más simple: una clave con un valor (texto, número o datos binarios de hasta 512 MB).

```text
SET usuario:42:nombre "Ana"
GET usuario:42:nombre
SET sesion:abc123 "{...}" EX 3600     # caduca en una hora
TTL sesion:abc123                     # segundos que le quedan
SET bloqueo:pedido:7 1 NX EX 30       # solo si NO existe (útil para bloqueos)
DEL usuario:42:nombre
EXISTS usuario:42:nombre
```

Contadores atómicos (seguros aunque muchas peticiones lleguen a la vez):

```text
INCR visitas:post:15
INCRBY puntos:usuario:42 50
```

### Nombres de claves

Usa un esquema consistente con dos puntos como separador: `tipo:id:campo`. Por ejemplo `cache:productos:pagina:2`, `sesion:<token>`, `rate:api:<ip>`. Facilita depurar y borrar grupos de claves.

> **Atención:** nunca uses `KEYS *` en producción: recorre todas las claves y bloquea Redis. Usa `SCAN` para iterar poco a poco.

## Estructuras de datos

### Hash: objetos

```text
HSET usuario:42 nombre "Ana" email "ana@ejemplo.com" plan "gratis"
HGET usuario:42 email
HGETALL usuario:42
HINCRBY usuario:42 logins 1
```

### List: listas ordenadas por inserción

```text
LPUSH notificaciones:42 "Nuevo comentario"   # añade al principio
LRANGE notificaciones:42 0 9                 # las 10 más recientes
LTRIM notificaciones:42 0 99                 # conserva solo 100
```

### Set: conjuntos sin duplicados

```text
SADD post:15:likes 42 7 99
SISMEMBER post:15:likes 42     # ¿le ha dado like?
SCARD post:15:likes            # número de likes
SINTER siguiendo:42 siguiendo:7   # amigos en común
```

### Sorted set: rankings

Cada elemento tiene una puntuación y se mantiene ordenado:

```text
ZADD ranking 1500 "ana" 1320 "luis" 1710 "marta"
ZINCRBY ranking 100 "luis"
ZREVRANGE ranking 0 2 WITHSCORES     # top 3
ZREVRANK ranking "ana"               # posición de Ana (empieza en 0)
```

Ideal para rankings de juegos, "lo más leído" o colas con prioridad.

### Otras

| Estructura | Uso |
| --- | --- |
| Bitmap | Millones de flags en muy poco espacio (¿se conectó el usuario el día N?) |
| HyperLogLog | Contar elementos únicos aproximados con 12 KB (visitantes únicos) |
| Geo | Búsquedas por distancia ("tiendas a menos de 5 km") |
| Stream | Registro de eventos persistente con grupos de consumidores |
| JSON / búsqueda / vectores | Disponibles en Redis 8 y como módulos |

## Patrones de caché

### Cache-aside (el más común)

La aplicación consulta primero la caché; si no está (*miss*), lee de la base de datos y guarda el resultado.

```javascript
// Node.js con el cliente oficial "redis"
import { createClient } from 'redis';

const redis = await createClient({ url: process.env.REDIS_URL }).connect();

async function obtenerProducto(id) {
  const clave = `cache:producto:${id}`;
  const enCache = await redis.get(clave);
  if (enCache) return JSON.parse(enCache);

  const producto = await db.productos.buscar(id);       // consulta lenta
  await redis.set(clave, JSON.stringify(producto), { EX: 600 });
  return producto;
}

async function actualizarProducto(id, datos) {
  await db.productos.actualizar(id, datos);
  await redis.del(`cache:producto:${id}`);              // invalidar
}
```

En Laravel, la fachada `Cache` hace lo mismo en una línea:

```php
$producto = Cache::remember("producto:{$id}", now()->addMinutes(10),
    fn () => Producto::with('categoria')->findOrFail($id)
);

Cache::forget("producto:{$id}");
```

### Otras estrategias

| Estrategia | Funcionamiento | Cuándo |
| --- | --- | --- |
| Cache-aside | La app lee de caché y rellena en los fallos | Por defecto |
| Write-through | Al escribir, se actualizan base de datos y caché | Datos muy leídos tras escribirse |
| Write-behind | Se escribe en caché y se vuelca a la base de datos después | Escrituras masivas (contadores) |
| Refresh-ahead | Se renueva antes de caducar | Datos críticos y caros de calcular |

### Los problemas difíciles de la caché

- **Invalidación**: decidir cuándo un dato cacheado deja de ser válido. Regla práctica: TTL razonable siempre, más borrado explícito cuando cambian los datos.
- **Estampida** (*cache stampede*): una clave muy usada caduca y cientos de peticiones van a la vez a la base de datos. Soluciones: un bloqueo para que solo una petición recalcule (`SET ... NX`), o añadir un pequeño margen aleatorio al TTL.
- **Datos obsoletos**: acepta conscientemente cuántos segundos de retraso son tolerables para cada dato. Un catálogo puede tolerar minutos; un saldo, ninguno.

> **Consejo:** mide antes de cachear. Cachear consultas que ya son rápidas solo añade complejidad. Empieza por las páginas o endpoints más lentos y más visitados.

## Sesiones y rate limiting

Con varios servidores detrás de un balanceador, las sesiones en archivos locales no funcionan: cada servidor tiene las suyas. Guardarlas en Redis las comparte:

```dotenv
# Laravel (.env)
SESSION_DRIVER=redis
CACHE_STORE=redis
QUEUE_CONNECTION=redis
```

Límite de peticiones con ventana fija:

```javascript
async function permitido(ip, limite = 100) {
  const clave = `rate:${ip}:${Math.floor(Date.now() / 60000)}`;   // una clave por minuto
  const n = await redis.incr(clave);
  if (n === 1) await redis.expire(clave, 60);
  return n <= limite;
}
```

## Colas de trabajos

Las tareas lentas (enviar emails, generar PDFs, redimensionar imágenes) no deben bloquear la respuesta al usuario. Se encolan y un proceso aparte (*worker*) las ejecuta.

En Laravel:

```php
// Encolar
EnviarFactura::dispatch($pedido);

// app/Jobs/EnviarFactura.php
class EnviarFactura implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(public Pedido $pedido) {}

    public function handle(): void
    {
        Mail::to($this->pedido->cliente)->send(new FacturaMail($this->pedido));
    }
}
```

```bash
php artisan queue:work redis --tries=3
```

En Node, **BullMQ** es la librería de colas más usada sobre Redis:

```javascript
import { Queue, Worker } from 'bullmq';

const connection = { host: 'localhost', port: 6379 };
const emails = new Queue('emails', { connection });

await emails.add('bienvenida', { usuarioId: 42 }, { attempts: 3, backoff: { type: 'exponential', delay: 5000 } });

new Worker('emails', async (job) => {
  await enviarBienvenida(job.data.usuarioId);
}, { connection });
```

> **Importante:** diseña los trabajos para que sean **idempotentes**: si se ejecutan dos veces por un reintento, el resultado debe ser el mismo (por ejemplo, comprobar si la factura ya se envió antes de enviarla).

## Pub/Sub y Streams

**Pub/Sub**: un publicador envía mensajes a un canal y todos los suscriptores conectados los reciben al instante.

```text
SUBSCRIBE chat:sala1                    # en una terminal
PUBLISH chat:sala1 "Hola a todos"       # en otra
```

Es perfecto para notificaciones en tiempo real (por ejemplo, combinado con WebSockets), pero los mensajes **no se guardan**: si un suscriptor está desconectado, se los pierde.

**Streams** son un registro persistente de eventos, con confirmación y grupos de consumidores que se reparten el trabajo:

```text
XADD pedidos * id 101 total 49.90 estado creado
XGROUP CREATE pedidos facturacion $ MKSTREAM
XREADGROUP GROUP facturacion worker-1 COUNT 10 BLOCK 5000 STREAMS pedidos >
XACK pedidos facturacion <id-del-mensaje>
```

| | Pub/Sub | Streams |
| --- | --- | --- |
| Guarda mensajes | No | Sí |
| Si el consumidor está caído | Se pierden | Los lee al volver |
| Reparto de trabajo | No (todos reciben todo) | Sí, con grupos de consumidores |
| Uso típico | Notificaciones en vivo | Eventos entre microservicios |

Para sistemas de eventos más grandes se usa Kafka o RabbitMQ; lo verás en [Diseño de microservicios](/lecciones/microservicios-diseno).

## Persistencia y producción

Redis puede guardar los datos en disco de dos formas:

- **RDB**: instantáneas periódicas. Rápido de recuperar, pero puedes perder los últimos minutos.
- **AOF**: registra cada escritura. Más duradero, archivos más grandes.

Lo habitual es combinar ambos si los datos importan, o ninguno si es solo caché.

Lista de comprobación para producción:

- Define `maxmemory` y una política de expulsión: `allkeys-lru` para caché pura; `noeviction` si guardas colas (no quieres que borre trabajos).
- Exige contraseña o usuarios con ACL y **nunca lo expongas a internet**.
- Usa TLS si el tráfico sale de una red privada.
- Monitoriza memoria, conexiones y la tasa de aciertos de la caché (`INFO stats`: `keyspace_hits` frente a `keyspace_misses`).
- Para alta disponibilidad: réplicas con Redis Sentinel, Redis Cluster para repartir datos, o un servicio gestionado.

```text
INFO memory
SLOWLOG GET 10        # comandos lentos
MEMORY USAGE cache:producto:7
```

## Proyecto

Añade Redis a una API existente (por ejemplo la de [Node.js y Express](/lecciones/node-express) o [APIs REST con Laravel](/lecciones/apis-rest)):

1. Cachea el listado de productos 5 minutos e invalídalo al crear o editar un producto.
2. Limita la API a 60 peticiones por minuto e IP.
3. Envía el email de confirmación de pedido mediante una cola con 3 reintentos.
4. Mantén un ranking de los 10 productos más vistos con un sorted set.

> **Reto:** mide el tiempo de respuesta del listado con y sin caché usando `curl -w "%{time_total}\n"` o una herramienta como `oha`. Después, provoca una estampida (miles de peticiones justo al caducar) y protégete con un bloqueo `SET NX`.
