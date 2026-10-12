# Node.js y Express

> Node.js te permite usar JavaScript fuera del navegador: en servidores, herramientas de línea de comandos y scripts. Con Express construirás una API REST completa, con validación, base de datos, gestión de errores y tests.

## Qué es Node.js

Node.js es un **entorno de ejecución** de JavaScript basado en el motor V8 de Chrome. Su característica principal es el modelo **asíncrono y sin bloqueos**: mientras espera una respuesta de la base de datos o de la red, sigue atendiendo otras peticiones. Por eso es muy eficiente en aplicaciones con mucha entrada/salida (APIs, chats, tiempo real).

Instala la versión **LTS** (soporte a largo plazo) desde [nodejs.org](https://nodejs.org) o, mejor, con un gestor de versiones como `nvm` (Linux/macOS) o `fnm` (también en Windows):

```bash
fnm install --lts
node -v
npm -v
```

Tu primer script, `hola.js`:

```javascript
const nombre = process.argv[2] ?? 'mundo';
console.log(`Hola, ${nombre}`);
```

```bash
node hola.js Ana
```

## Módulos y npm

Node usa **módulos ES** (`import` / `export`). Crea un proyecto:

```bash
mkdir api-tareas && cd api-tareas
npm init -y
```

En `package.json` añade `"type": "module"` para usar `import`:

```json
{
  "name": "api-tareas",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "test": "node --test"
  }
}
```

```javascript
// src/utils/precio.js
export function conIva(precio, iva = 0.21) {
  return Math.round(precio * (1 + iva) * 100) / 100;
}

// src/index.js
import { conIva } from './utils/precio.js';
console.log(conIva(100));
```

**npm** instala librerías en `node_modules/` y las anota en `package.json`:

```bash
npm install express          # dependencia de producción
npm install -D vitest        # dependencia de desarrollo
npm run dev                  # ejecuta un script de package.json
```

> **Nota:** sube a Git `package.json` y `package-lock.json`, pero nunca `node_modules/`. El lock garantiza que todo el equipo instala exactamente las mismas versiones (`npm ci`).

### Módulos integrados

Node trae módulos para casi todo:

```javascript
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ruta = path.join(import.meta.dirname, 'datos.json');
const datos = JSON.parse(await readFile(ruta, 'utf8'));
datos.visitas += 1;
await writeFile(ruta, JSON.stringify(datos, null, 2));
```

## Asincronía: promesas y async/await

Las operaciones lentas (leer archivos, consultar la base de datos, llamar a otra API) devuelven **promesas**. Con `async/await` se escriben como código secuencial:

```javascript
async function obtenerUsuario(id) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
  return res.json();
}

try {
  const usuario = await obtenerUsuario(1);
  console.log(usuario.name);
} catch (error) {
  console.error('No se pudo obtener el usuario:', error.message);
}
```

Para lanzar varias operaciones **en paralelo**:

```javascript
const [usuarios, posts] = await Promise.all([
  fetch('/api/usuarios').then((r) => r.json()),
  fetch('/api/posts').then((r) => r.json()),
]);
```

> **Atención:** una operación síncrona pesada (un bucle de millones de iteraciones, `readFileSync` de un archivo enorme) bloquea el servidor para **todas** las peticiones. En el servidor, usa siempre las versiones asíncronas.

## Tu primer servidor con Express

```bash
npm install express
```

```javascript
// src/server.js
import express from 'express';

const app = express();
app.use(express.json());   // interpreta el cuerpo JSON de las peticiones

app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando' });
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Escuchando en http://localhost:${PORT}`));
```

```bash
npm run dev
curl http://localhost:3000
```

- `req` (*request*): la petición (URL, parámetros, cabeceras, cuerpo).
- `res` (*response*): lo que devuelves (`res.json`, `res.status`, `res.send`).

## Rutas y parámetros

```javascript
let tareas = [
  { id: 1, titulo: 'Aprender Node', hecha: false },
  { id: 2, titulo: 'Crear una API', hecha: false },
];
let siguienteId = 3;

// GET /tareas?hecha=true
app.get('/tareas', (req, res) => {
  const { hecha } = req.query;
  const resultado = hecha === undefined ? tareas : tareas.filter((t) => String(t.hecha) === hecha);
  res.json(resultado);
});

// GET /tareas/2
app.get('/tareas/:id', (req, res) => {
  const tarea = tareas.find((t) => t.id === Number(req.params.id));
  if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
  res.json(tarea);
});

// POST /tareas  { "titulo": "..." }
app.post('/tareas', (req, res) => {
  const tarea = { id: siguienteId++, titulo: req.body.titulo, hecha: false };
  tareas.push(tarea);
  res.status(201).json(tarea);
});

// PATCH /tareas/2  { "hecha": true }
app.patch('/tareas/:id', (req, res) => {
  const tarea = tareas.find((t) => t.id === Number(req.params.id));
  if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
  Object.assign(tarea, req.body);
  res.json(tarea);
});

// DELETE /tareas/2
app.delete('/tareas/:id', (req, res) => {
  tareas = tareas.filter((t) => t.id !== Number(req.params.id));
  res.status(204).end();
});
```

| Método | Uso | Código de éxito |
| --- | --- | --- |
| `GET` | Leer | 200 |
| `POST` | Crear | 201 |
| `PUT` / `PATCH` | Reemplazar / modificar | 200 |
| `DELETE` | Borrar | 204 |

Los principios de diseño de una API REST se explican a fondo en [APIs REST con Laravel](/lecciones/apis-rest); son los mismos en cualquier lenguaje.

## Organizar el código: routers y controladores

Con muchas rutas, separa por recursos:

```text
src/
├── server.js          # arranca el servidor
├── app.js             # crea y configura Express (útil para los tests)
├── routes/
│   └── tareas.js
├── controllers/
│   └── tareasController.js
├── services/
│   └── tareasService.js   # lógica de negocio y acceso a datos
└── middleware/
    └── errores.js
```

```javascript
// src/routes/tareas.js
import { Router } from 'express';
import * as ctrl from '../controllers/tareasController.js';

const router = Router();
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', ctrl.crear);
router.delete('/:id', ctrl.borrar);
export default router;

// src/app.js
import express from 'express';
import tareas from './routes/tareas.js';
import { manejarErrores, rutaNoEncontrada } from './middleware/errores.js';

export const app = express();
app.use(express.json());
app.use('/api/tareas', tareas);
app.use(rutaNoEncontrada);
app.use(manejarErrores);

// src/server.js
import { app } from './app.js';
app.listen(process.env.PORT ?? 3000);
```

Separar `app` de `server` permite testear la aplicación sin abrir un puerto real.

## Middleware

Un **middleware** es una función que se ejecuta entre la petición y la respuesta. Puede modificar `req`, responder antes de tiempo o pasar al siguiente con `next()`.

```javascript
// Registro de cada petición
app.use((req, res, next) => {
  const inicio = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${Date.now() - inicio} ms)`);
  });
  next();
});

// Protección con una clave de API
function requiereClave(req, res, next) {
  if (req.get('x-api-key') !== process.env.API_KEY) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
}
app.use('/api/admin', requiereClave);
```

Middleware habituales de terceros:

```bash
npm install helmet cors express-rate-limit
```

```javascript
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

app.use(helmet());                                         // cabeceras de seguridad
app.use(cors({ origin: 'https://mi-frontend.com' }));      // quién puede llamar a la API
app.use('/api', rateLimit({ windowMs: 60_000, limit: 100 })); // 100 peticiones/minuto por IP
```

## Validación de datos

Nunca confíes en lo que envía el cliente. **Zod** valida y además genera tipos para TypeScript:

```bash
npm install zod
```

```javascript
import { z } from 'zod';

const esquemaTarea = z.object({
  titulo: z.string().trim().min(3, 'Mínimo 3 caracteres').max(120),
  prioridad: z.enum(['baja', 'media', 'alta']).default('media'),
  fechaLimite: z.coerce.date().optional(),
});

export function validar(esquema) {
  return (req, res, next) => {
    const resultado = esquema.safeParse(req.body);
    if (!resultado.success) {
      return res.status(422).json({ errores: resultado.error.flatten().fieldErrors });
    }
    req.body = resultado.data;   // datos limpios y con valores por defecto
    next();
  };
}

router.post('/', validar(esquemaTarea), ctrl.crear);
```

## Gestión de errores

Centraliza los errores en un middleware con **cuatro** parámetros:

```javascript
// src/middleware/errores.js
export class ErrorHttp extends Error {
  constructor(status, mensaje) {
    super(mensaje);
    this.status = status;
  }
}

export function rutaNoEncontrada(req, res) {
  res.status(404).json({ error: `No existe ${req.method} ${req.originalUrl}` });
}

export function manejarErrores(err, req, res, next) {
  const status = err.status ?? 500;
  if (status >= 500) console.error(err);   // los errores inesperados se registran
  res.status(status).json({
    error: status >= 500 ? 'Error interno del servidor' : err.message,
  });
}
```

En Express 5, si una función `async` lanza un error o una promesa falla, se envía automáticamente al middleware de errores:

```javascript
export async function obtener(req, res) {
  const tarea = await servicio.buscar(Number(req.params.id));
  if (!tarea) throw new ErrorHttp(404, 'Tarea no encontrada');
  res.json(tarea);
}
```

> **Importante:** no envíes al cliente los detalles de un error 500 (trazas, consultas SQL). Dan pistas a un atacante. Regístralos en el servidor y devuelve un mensaje genérico.

## Base de datos con PostgreSQL

```bash
npm install pg
```

```javascript
// src/db.js
import pg from 'pg';

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// src/services/tareasService.js
import { pool } from '../db.js';

export async function listar() {
  const { rows } = await pool.query('SELECT * FROM tareas ORDER BY id');
  return rows;
}

export async function buscar(id) {
  const { rows } = await pool.query('SELECT * FROM tareas WHERE id = $1', [id]);
  return rows[0] ?? null;
}

export async function crear({ titulo, prioridad }) {
  const { rows } = await pool.query(
    'INSERT INTO tareas (titulo, prioridad) VALUES ($1, $2) RETURNING *',
    [titulo, prioridad],
  );
  return rows[0];
}
```

Los parámetros `$1, $2` evitan la inyección SQL. Si prefieres no escribir SQL a mano, **Prisma** o **Drizzle** son ORM populares con soporte excelente para TypeScript.

### Variables de entorno

```bash
# .env  (no se sube a Git)
PORT=3000
DATABASE_URL=postgres://usuario:clave@localhost:5432/tareas
API_KEY=cambia-esto
```

Node 22 puede cargarlas sin librerías:

```bash
node --env-file=.env src/server.js
```

## Autenticación con JWT

Para APIs consumidas por un frontend o una app móvil, un patrón habitual es el **token JWT**:

```bash
npm install jsonwebtoken bcrypt
```

```javascript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

router.post('/login', async (req, res) => {
  const usuario = await usuarios.buscarPorEmail(req.body.email);
  const ok = usuario && (await bcrypt.compare(req.body.password, usuario.password_hash));
  if (!ok) return res.status(401).json({ error: 'Credenciales incorrectas' });

  const token = jwt.sign({ sub: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

export function autenticado(req, res, next) {
  const token = req.get('authorization')?.replace('Bearer ', '');
  try {
    req.usuarioId = jwt.verify(token, process.env.JWT_SECRET).sub;
    next();
  } catch {
    res.status(401).json({ error: 'Token no válido o caducado' });
  }
}
```

> **Nota:** el contenido de un JWT se puede leer (está codificado, no cifrado). Nunca guardes datos sensibles dentro. Para aplicaciones web en el mismo dominio, una cookie de sesión `HttpOnly` suele ser más segura que guardar el token en `localStorage`.

## Tests de la API

Con el *test runner* integrado de Node y `supertest`:

```bash
npm install -D supertest
```

```javascript
// test/tareas.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/app.js';

test('crea una tarea válida', async () => {
  const res = await request(app).post('/api/tareas').send({ titulo: 'Escribir tests' });
  assert.equal(res.status, 201);
  assert.equal(res.body.titulo, 'Escribir tests');
});

test('rechaza un título demasiado corto', async () => {
  const res = await request(app).post('/api/tareas').send({ titulo: 'a' });
  assert.equal(res.status, 422);
  assert.ok(res.body.errores.titulo);
});
```

```bash
npm test
```

Más estrategias en [Testing para desarrolladores web](/lecciones/testing).

## TypeScript y despliegue

Node 22.18+ ejecuta archivos `.ts` directamente (elimina los tipos al cargar), lo que facilita empezar con TypeScript sin compilar. Para proyectos grandes, sigue usando `tsc` para comprobar los tipos en CI. Repasa los fundamentos en [TypeScript desde cero](/lecciones/typescript-basico).

Un `Dockerfile` para producción:

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["node", "src/server.js"]
```

Lista de comprobación antes de publicar:

- `NODE_ENV=production`.
- Secretos en variables de entorno, nunca en el código.
- `helmet`, CORS restringido y límite de peticiones.
- Logs estructurados (por ejemplo con `pino`).
- Un endpoint `/health` para que la plataforma sepa si el servicio está vivo.
- Cerrar las conexiones al recibir `SIGTERM` para no cortar peticiones a medias.

> **Reto:** amplía la API de tareas con usuarios: cada usuario solo puede ver y modificar sus propias tareas. Añade tests que comprueben que un usuario no puede leer las tareas de otro.

## Siguientes pasos

- Empaqueta tu API con [Docker desde cero](/lecciones/docker).
- Aprende a sacarle partido a la base de datos con [PostgreSQL avanzado](/lecciones/postgresql-avanzado) y [Redis](/lecciones/redis-cache).
- Conecta un frontend con [React avanzado](/lecciones/react-avanzado).
