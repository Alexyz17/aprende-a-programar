# MongoDB desde cero

> MongoDB es la base de datos de documentos más usada. En lugar de tablas con columnas fijas guarda documentos parecidos a JSON, lo que encaja de forma natural con JavaScript y con datos que cambian de forma. Aprenderás a usarlo y, sobre todo, a decidir cuándo te conviene y cuándo es mejor una base de datos relacional.

## Documentos en lugar de tablas

En [SQL desde cero](/lecciones/sql-basico) los datos viven en tablas con columnas fijas. En MongoDB la unidad es el **documento**:

```json
{
  "_id": "6710c2f1a3b4c5d6e7f80912",
  "nombre": "Ana García",
  "email": "ana@ejemplo.com",
  "ciudad": "Terrassa",
  "intereses": ["astronomía", "fotografía"],
  "direccion": { "calle": "Rambla 10", "cp": "08221" }
}
```

| Relacional | MongoDB |
| --- | --- |
| Base de datos | Base de datos |
| Tabla | **Colección** |
| Fila | **Documento** |
| Columna | Campo |
| `JOIN` | Documentos incrustados o `$lookup` |

Diferencias clave:

- Un documento puede tener **arrays** y **objetos anidados**: la dirección y los intereses van dentro del propio usuario.
- Los documentos de una colección **no tienen por qué tener los mismos campos**. Es flexible, pero esa flexibilidad hay que controlarla.
- Cada documento tiene un `_id` único. Si no lo das, MongoDB genera un **ObjectId**.

Internamente se guarda en **BSON**, un JSON binario que además tiene tipos como fechas, enteros de 64 bits y decimales exactos.

## Instalación y primeros comandos

La forma más rápida de tenerlo en local es con Docker (mira [Docker desde cero](/lecciones/docker)):

```bash
docker run -d --name mongo -p 27017:27017 -v mongo-datos:/data/db mongo:8
docker exec -it mongo mongosh
```

`mongosh` es la consola de MongoDB. Si prefieres no instalar nada, **MongoDB Atlas** tiene un plan gratuito en la nube. Y **MongoDB Compass** es la interfaz gráfica oficial.

Primeros comandos en `mongosh`:

```javascript
show dbs                 // bases de datos
use tienda               // usar (o crear) la base de datos "tienda"
show collections         // colecciones de la base actual
db.productos.insertOne({ nombre: 'Taza', precio: 9.5 })   // crea la colección al insertar
```

Las bases de datos y colecciones se crean solas la primera vez que guardas algo.

## Insertar documentos

```javascript
db.productos.insertMany([
  { nombre: 'Taza', categoria: 'hogar', precio: 9.5, stock: 40, etiquetas: ['cerámica', 'regalo'] },
  { nombre: 'Mochila', categoria: 'viaje', precio: 49, stock: 12, etiquetas: ['impermeable'] },
  { nombre: 'Libreta', categoria: 'papelería', precio: 3.2, stock: 150, etiquetas: [] },
  { nombre: 'Auriculares', categoria: 'electrónica', precio: 120, stock: 0, etiquetas: ['bluetooth', 'regalo'] },
  { nombre: 'Termo', categoria: 'viaje', precio: 22, stock: 30, etiquetas: ['acero', 'regalo'] }
])
```

Estos datos se usan en el resto del curso: cópialos en tu `mongosh`.

## Consultar con find

```javascript
db.productos.find()                                   // todos
db.productos.find({ categoria: 'viaje' })             // igualdad
db.productos.findOne({ nombre: 'Taza' })              // el primero que coincida
```

### Operadores de comparación

```javascript
db.productos.find({ precio: { $gt: 20 } })            // precio > 20
db.productos.find({ precio: { $gte: 10, $lte: 50 } }) // entre 10 y 50
db.productos.find({ categoria: { $in: ['viaje', 'hogar'] } })
db.productos.find({ stock: { $ne: 0 } })              // distinto de 0
```

| Operador | Significado |
| --- | --- |
| `$eq`, `$ne` | Igual, distinto |
| `$gt`, `$gte` | Mayor, mayor o igual |
| `$lt`, `$lte` | Menor, menor o igual |
| `$in`, `$nin` | Está (o no) en una lista |
| `$exists` | El campo existe |

### Varias condiciones

Varias condiciones en el mismo objeto se combinan con **y**. Para **o**, usa `$or`:

```javascript
db.productos.find({ categoria: 'viaje', precio: { $lt: 30 } })     // viaje Y menos de 30 → Termo
db.productos.find({ $or: [{ stock: 0 }, { precio: { $gt: 100 } }] })
```

### Arrays y campos anidados

```javascript
db.productos.find({ etiquetas: 'regalo' })                // el array contiene 'regalo'
db.productos.find({ etiquetas: { $all: ['regalo', 'acero'] } })
db.usuarios.find({ 'direccion.cp': '08221' })             // notación de punto, entre comillas
```

### Proyección, orden y límite

```javascript
db.productos.find(
  { stock: { $gt: 0 } },
  { nombre: 1, precio: 1, _id: 0 }        // solo nombre y precio
).sort({ precio: -1 }).limit(3)           // los 3 más caros con stock
```

`1` incluye un campo, `0` lo excluye; `-1` en `sort` es descendente. `countDocuments` cuenta:

```javascript
db.productos.countDocuments({ categoria: 'viaje' })   // 2
```

## Actualizar y borrar

```javascript
// Cambiar campos concretos con $set
db.productos.updateOne({ nombre: 'Taza' }, { $set: { precio: 10.5 } })

// Sumar o restar con $inc
db.productos.updateOne({ nombre: 'Mochila' }, { $inc: { stock: -1 } })

// Añadir a un array sin repetir
db.productos.updateOne({ nombre: 'Libreta' }, { $addToSet: { etiquetas: 'oferta' } })

// Quitar de un array
db.productos.updateMany({}, { $pull: { etiquetas: 'regalo' } })

// Crear si no existe (upsert)
db.productos.updateOne(
  { nombre: 'Lámpara' },
  { $set: { categoria: 'hogar', precio: 35, stock: 5 } },
  { upsert: true }
)

db.productos.deleteOne({ nombre: 'Lámpara' })
db.productos.deleteMany({ stock: 0 })
```

> **Atención:** `updateOne({ nombre: 'Taza' }, { precio: 10 })` sin `$set` da error en `mongosh` actual, pero `replaceOne` sí sustituye el documento entero y borra el resto de campos. Usa siempre operadores como `$set` cuando quieras cambiar solo una parte.

> **Importante:** `deleteMany({})` borra **todos** los documentos de la colección. Antes de un borrado masivo, ejecuta el mismo filtro con `find` o `countDocuments` para ver qué vas a borrar.

## Modelar los datos: incrustar o referenciar

Esta es la decisión más importante en MongoDB. Hay dos opciones:

**Incrustar** (*embed*): los datos relacionados van dentro del documento.

```json
{
  "_id": 1,
  "titulo": "Mi primer post",
  "comentarios": [
    { "autor": "Luis", "texto": "¡Genial!" },
    { "autor": "Eva", "texto": "Muy útil" }
  ]
}
```

**Referenciar**: se guarda el `_id` del otro documento, como una clave foránea.

```json
{ "_id": 101, "cliente_id": 7, "total": 59.5, "fecha": "2026-10-14" }
```

| Incrusta cuando… | Referencia cuando… |
| --- | --- |
| Los datos se leen siempre juntos | Los datos se consultan por separado |
| La parte incrustada es pequeña y acotada | La lista puede crecer sin límite (pedidos de un cliente) |
| Pertenece solo a ese documento | Se comparte entre muchos documentos (un producto en muchos pedidos) |

La regla de oro: **diseña según cómo vas a leer los datos**, no según cómo los dibujarías en un diagrama.

> **Nota:** un documento puede ocupar como máximo 16 MB. Un array que crece sin parar (todos los logs de un usuario) acabará siendo un problema: eso va en su propia colección.

## Índices

Sin índices, MongoDB revisa **todos** los documentos de la colección en cada consulta. Con un índice va directo:

```javascript
db.productos.createIndex({ categoria: 1 })
db.productos.createIndex({ categoria: 1, precio: -1 })    // índice compuesto
db.usuarios.createIndex({ email: 1 }, { unique: true })   // además impide emails repetidos
```

Comprueba si una consulta usa un índice con `explain`:

```javascript
db.productos.find({ categoria: 'viaje' }).explain('executionStats')
```

Busca `IXSCAN` (usa un índice) frente a `COLLSCAN` (recorre toda la colección) y compara `totalDocsExamined` con `nReturned`.

> **Consejo:** en un índice compuesto el orden importa. `{ categoria: 1, precio: -1 }` sirve para filtrar por categoría y ordenar por precio, pero no para filtrar solo por precio.

## Agregaciones

El **aggregation pipeline** es una serie de etapas por las que pasan los documentos, como una tubería. Es el equivalente a `GROUP BY`, `JOIN` y compañía:

```javascript
db.productos.aggregate([
  { $match: { stock: { $gt: 0 } } },                       // filtrar (como WHERE)
  { $group: {                                              // agrupar (como GROUP BY)
      _id: '$categoria',
      productos: { $sum: 1 },
      valorStock: { $sum: { $multiply: ['$precio', '$stock'] } }
  } },
  { $sort: { valorStock: -1 } }
])
```

| Etapa | Equivale a |
| --- | --- |
| `$match` | `WHERE` |
| `$group` | `GROUP BY` con `SUM`, `AVG`, `COUNT`… |
| `$project` | Elegir o calcular campos (`SELECT`) |
| `$sort`, `$limit` | `ORDER BY`, `LIMIT` |
| `$unwind` | Una fila por cada elemento de un array |
| `$lookup` | `LEFT JOIN` con otra colección |

Contar productos por etiqueta con `$unwind`:

```javascript
db.productos.aggregate([
  { $unwind: '$etiquetas' },
  { $group: { _id: '$etiquetas', total: { $sum: 1 } } },
  { $sort: { total: -1 } }
])
```

Unir pedidos con sus clientes con `$lookup`:

```javascript
db.pedidos.aggregate([
  { $lookup: { from: 'clientes', localField: 'cliente_id', foreignField: '_id', as: 'cliente' } },
  { $unwind: '$cliente' },
  { $project: { total: 1, 'cliente.nombre': 1 } }
])
```

> **Consejo:** pon `$match` lo antes posible en el pipeline: así las siguientes etapas trabajan con menos documentos y puede usar índices.

## Validar el esquema

Que MongoDB sea flexible no significa que tu aplicación deba aceptar cualquier cosa. Puedes exigir una estructura con **JSON Schema**:

```javascript
db.createCollection('clientes', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['nombre', 'email'],
      properties: {
        nombre: { bsonType: 'string', minLength: 2 },
        email: { bsonType: 'string', pattern: '^[^@\\s]+@[^@\\s]+$' },
        edad: { bsonType: 'int', minimum: 0 }
      }
    }
  }
})
```

Ahora un `insertOne` sin email o con una edad negativa falla con `Document failed validation`.

## Usarlo desde Node.js

Con el driver oficial:

```bash
npm install mongodb
```

```javascript
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI ?? 'mongodb://localhost:27017');
await client.connect();
const productos = client.db('tienda').collection('productos');

const baratos = await productos
  .find({ precio: { $lt: 20 } }, { projection: { nombre: 1, precio: 1 } })
  .sort({ precio: 1 })
  .toArray();

const { insertedId } = await productos.insertOne({ nombre: 'Cuaderno', precio: 4, stock: 60 });
await productos.updateOne({ _id: insertedId }, { $inc: { stock: -1 } });

// Un id que llega como texto (por ejemplo en la URL) se convierte antes de buscar:
const uno = await productos.findOne({ _id: new ObjectId('6710c2f1a3b4c5d6e7f80912') });

await client.close();
```

- Crea **un solo** `MongoClient` para toda la aplicación y reutilízalo: gestiona un grupo de conexiones.
- Guarda la cadena de conexión en una variable de entorno, nunca en el código.
- Muchos proyectos usan **Mongoose**, que añade esquemas, validación y modelos encima del driver.

Si ya hiciste [Node.js y Express](/lecciones/node-express), puedes sustituir la base de datos de ese curso por MongoDB con estas mismas llamadas.

### Seguridad: inyección NoSQL

Si pasas directamente lo que llega en la petición, un atacante puede enviar un objeto en lugar de un texto:

```javascript
// Petición: { "email": "ana@ejemplo.com", "password": { "$ne": null } }
db.usuarios.findOne({ email: req.body.email, password: req.body.password }); // ¡entra sin contraseña!
```

Valida siempre que cada campo tenga el tipo esperado (con zod, Joi o a mano) antes de usarlo en una consulta, y nunca guardes contraseñas sin `bcrypt` o `argon2`.

## MongoDB o SQL

| Elige MongoDB si… | Elige SQL (PostgreSQL, MySQL) si… |
| --- | --- |
| Los datos son documentos que se leen enteros (catálogos, perfiles, contenido) | Los datos están muy relacionados y los cruzas de muchas formas |
| La estructura cambia a menudo o varía entre elementos | Necesitas transacciones complejas entre muchas tablas (contabilidad, reservas) |
| Escribes y lees mucho por clave | Haces informes con muchos `JOIN` y agregaciones ad hoc |

MongoDB admite transacciones con varios documentos y PostgreSQL tiene columnas `JSONB` (mira [PostgreSQL avanzado](/lecciones/postgresql-avanzado)), así que la frontera es menos rígida de lo que parece. Elige por cómo son tus datos y tus consultas, no por moda.

## Proyecto: API de recetas

Construye una API con Node.js, Express y MongoDB:

1. Colección `recetas` con título, raciones, tiempo, `ingredientes` (array de `{ nombre, cantidad, unidad }`) y `etiquetas`.
2. Validación con `$jsonSchema` en la colección y validación de tipos en la API.
3. Rutas para crear, listar (con filtros por etiqueta y tiempo máximo), ver, editar y borrar.
4. Índices para los filtros que uses y un índice de texto para buscar por título: `createIndex({ titulo: 'text' })` y `find({ $text: { $search: 'tortilla' } })`.
5. Un endpoint `/estadisticas` con una agregación: número de recetas por etiqueta y tiempo medio.

> **Ejercicio:** escribe la agregación que devuelve los 5 ingredientes más usados en todas las recetas. Pista: `$unwind` sobre `ingredientes`, `$group` por `ingredientes.nombre`, `$sort` y `$limit`.

> **Reto:** añade valoraciones de usuarios. Decide si las incrustas en la receta o las guardas en otra colección, justifícalo pensando en cuántas puede llegar a haber, y guarda en la receta la media y el número de valoraciones para no recalcularlos en cada lectura.
