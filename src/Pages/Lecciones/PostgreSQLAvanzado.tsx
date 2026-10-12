import LessonLayout from '@/layouts/LessonLayout';
import { Head } from '@inertiajs/react';

const modules = [
    { id: '/lecciones/postgresql-avanzado', title: 'EXPLAIN ANALYZE', free: true },
    { id: '/lecciones/postgresql-avanzado#indices', title: 'Índices: tipos y estrategias', free: true },
    { id: '/lecciones/postgresql-avanzado#ctes', title: 'CTEs y consultas recursivas', free: true },
    { id: '/lecciones/postgresql-avanzado#window', title: 'Window functions', free: true },
    { id: '/lecciones/postgresql-avanzado#partitioning', title: 'Particionado de tablas', free: true },
    { id: '/lecciones/postgresql-avanzado#jsonb', title: 'JSON y JSONB', free: true },
    { id: '/lecciones/postgresql-avanzado#pgvector', title: 'pgvector — búsqueda semántica', free: true },
    { id: '/lecciones/postgresql-avanzado#mantenimiento', title: 'Mantenimiento y monitorización', free: true },
];

export default function PostgreSQLAvanzado() {
    return (
        <LessonLayout
            title="PostgreSQL avanzado"
            description="Índices, EXPLAIN ANALYZE, CTEs, window functions, particionado y pgvector para búsqueda semántica."
            duration="4h 30min"
            lessons={22}
            level="Avanzado"
            premium={false}
            modules={modules}
            activeModule="/lecciones/postgresql-avanzado"
            allUnlocked={true}
            category="Bases de datos"
        >
            <Head>
                <title>PostgreSQL avanzado — Aprende a Programar</title>
                <meta name="description" content="Curso completo de PostgreSQL avanzado: índices, CTEs, window functions, particionado y pgvector." />
            </Head>

            <h1>PostgreSQL avanzado</h1>

            <blockquote>
                PostgreSQL es el RDBMS open source más avanzado del mundo. Bien utilizado, puede gestionar miles de millones de filas, búsqueda de texto completo, datos geoespaciales, vectores para IA y mucho más — todo en la misma base de datos.
            </blockquote>

            {/* ── 1. EXPLAIN ── */}
            <h2 id="explain">EXPLAIN ANALYZE — diagnóstico de consultas</h2>
            <pre><code>{`-- Siempre analiza antes de optimizar
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT u.nombre, COUNT(p.id) AS pedidos
FROM usuarios u
LEFT JOIN pedidos p ON p.usuario_id = u.id
WHERE u.activo = true
GROUP BY u.id;

-- Nodos del plan más importantes:
-- Seq Scan       → escanea toda la tabla (puede ser OK para tablas pequeñas)
-- Index Scan     → usa un índice para acceder a filas
-- Index Only Scan→ obtiene todos los datos del índice sin tocar la tabla
-- Bitmap Scan    → combina múltiples índices
-- Hash Join      → join con tabla hash en memoria (bueno para tablas grandes)
-- Nested Loop    → join iterativo (bueno si una tabla es pequeña)
-- Sort           → ordenación (costosa si no hay índice)
-- HashAggregate  → GROUP BY con hash
-- Parallel Seq Scan → escaneo paralelo (PostgreSQL 14+)

-- Identificar problemas:
-- rows estimadas << rows reales → ejecutar ANALYZE tabla;
-- Seq Scan en tabla grande → falta un índice
-- Sort en disco (external sort) → work_mem demasiado bajo
-- Nested Loop con muchas iteraciones → falta índice en la tabla interior`}</code></pre>

            {/* ── 2. Índices ── */}
            <h2 id="indices">Índices — tipos y estrategias</h2>
            <pre><code>{`-- B-Tree: el estándar para la mayoría de casos
CREATE INDEX CONCURRENTLY idx_pedidos_usuario_estado
    ON pedidos (usuario_id, estado)
    WHERE estado != 'cancelado';  -- partial + compuesto

-- GIN: arrays y JSONB
CREATE INDEX idx_tags ON articulos USING GIN (tags);
-- Permite: WHERE tags @> ARRAY['python', 'tutorial']

-- GiST: geoespacial con PostGIS
CREATE INDEX idx_ubicaciones ON comercios USING GIST (ubicacion);
-- Permite: ORDER BY ubicacion <-> punto_referencia LIMIT 10

-- BRIN: columnas con correlación física (timestamps de inserción)
CREATE INDEX idx_eventos_fecha ON eventos USING BRIN (fecha_evento)
    WITH (pages_per_range = 128);  -- muy pequeño, bueno para datos de series temporales

-- Ver tamaño de índices
SELECT
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) AS tamaño,
    idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
JOIN pg_indexes USING (indexname)
WHERE tablename = 'pedidos'
ORDER BY pg_relation_size(indexrelid) DESC;

-- Índices no usados (candidatos a eliminar)
SELECT indexrelid::regclass AS indice, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND indexrelid::regclass::text NOT LIKE '%pkey%';`}</code></pre>

            {/* ── 3. CTEs ── */}
            <h2 id="ctes">CTEs y consultas recursivas</h2>
            <pre><code>{`-- CTE básica — legibilidad y reutilización
WITH usuarios_activos AS (
    SELECT id, nombre, email
    FROM usuarios
    WHERE activo = true AND creado_en >= NOW() - INTERVAL '1 year'
),
pedidos_recientes AS (
    SELECT usuario_id, COUNT(*) AS total, SUM(monto) AS facturado
    FROM pedidos
    WHERE creado_en >= NOW() - INTERVAL '30 days'
    GROUP BY usuario_id
)
SELECT
    u.nombre,
    COALESCE(p.total, 0) AS pedidos,
    COALESCE(p.facturado, 0.00) AS facturado
FROM usuarios_activos u
LEFT JOIN pedidos_recientes p ON p.usuario_id = u.id
ORDER BY facturado DESC;

-- CTE recursiva — árbol de categorías / jerarquías
WITH RECURSIVE jerarquia AS (
    -- Caso base: nodos raíz
    SELECT id, nombre, padre_id, 0 AS nivel, nombre AS ruta
    FROM categorias
    WHERE padre_id IS NULL

    UNION ALL

    -- Paso recursivo: hijos
    SELECT c.id, c.nombre, c.padre_id, j.nivel + 1,
           j.ruta || ' > ' || c.nombre
    FROM categorias c
    INNER JOIN jerarquia j ON j.id = c.padre_id
)
SELECT id, nombre, nivel, ruta
FROM jerarquia
ORDER BY ruta;
-- Resultado:
-- 1 | Tecnología       | 0 | Tecnología
-- 3 | Programación     | 1 | Tecnología > Programación
-- 7 | Python           | 2 | Tecnología > Programación > Python

-- CTE para detección de ciclos
WITH RECURSIVE empleados_jerarquia AS (
    SELECT id, nombre, manager_id, ARRAY[id] AS visitados, false AS ciclo
    FROM empleados WHERE manager_id IS NULL

    UNION ALL

    SELECT e.id, e.nombre, e.manager_id,
           h.visitados || e.id,
           e.id = ANY(h.visitados)  -- detectar ciclo
    FROM empleados e
    JOIN empleados_jerarquia h ON h.id = e.manager_id
    WHERE NOT h.ciclo
)
SELECT * FROM empleados_jerarquia WHERE NOT ciclo;`}</code></pre>

            {/* ── 4. Window functions ── */}
            <h2 id="window">Window functions — analytics avanzado</h2>
            <pre><code>{`-- Ranking dentro de grupos
SELECT
    nombre,
    categoria,
    ventas,
    ROW_NUMBER() OVER (PARTITION BY categoria ORDER BY ventas DESC) AS posicion_row,
    RANK()       OVER (PARTITION BY categoria ORDER BY ventas DESC) AS posicion_rank,
    DENSE_RANK() OVER (PARTITION BY categoria ORDER BY ventas DESC) AS posicion_dense
FROM productos;

-- LAG y LEAD — comparar con filas anteriores/siguientes
SELECT
    mes,
    ingresos,
    LAG(ingresos) OVER (ORDER BY mes) AS mes_anterior,
    ingresos - LAG(ingresos) OVER (ORDER BY mes) AS crecimiento,
    ROUND(
        100.0 * (ingresos - LAG(ingresos) OVER (ORDER BY mes)) /
        NULLIF(LAG(ingresos) OVER (ORDER BY mes), 0), 2
    ) AS crecimiento_pct
FROM ingresos_mensuales
ORDER BY mes;

-- Totales acumulados y medias móviles
SELECT
    fecha,
    ventas_dia,
    SUM(ventas_dia) OVER (ORDER BY fecha) AS acumulado,
    AVG(ventas_dia) OVER (
        ORDER BY fecha
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW  -- media móvil 7 días
    ) AS media_7_dias
FROM ventas_diarias;

-- NTILE — dividir en percentiles
SELECT
    cliente_id,
    total_gastado,
    NTILE(4) OVER (ORDER BY total_gastado DESC) AS cuartil,
    PERCENT_RANK() OVER (ORDER BY total_gastado) AS percentil
FROM (
    SELECT cliente_id, SUM(monto) AS total_gastado
    FROM pedidos GROUP BY cliente_id
) t;

-- Top N por grupo sin subconsulta
SELECT * FROM (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY categoria ORDER BY ventas DESC) AS rn
    FROM productos
) t WHERE rn <= 3;  -- top 3 por categoría`}</code></pre>

            {/* ── 5. Particionado ── */}
            <h2 id="partitioning">Particionado de tablas</h2>
            <pre><code>{`-- Particionado por rango — ideal para series temporales
CREATE TABLE eventos (
    id BIGSERIAL,
    tipo VARCHAR(50),
    datos JSONB,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (creado_en);

-- Crear particiones por mes
CREATE TABLE eventos_2026_01 PARTITION OF eventos
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE eventos_2026_02 PARTITION OF eventos
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

-- Los índices se crean en la tabla padre y se propagan
CREATE INDEX ON eventos (creado_en, tipo);

-- Partition pruning — PostgreSQL solo escanea particiones relevantes
EXPLAIN SELECT * FROM eventos
WHERE creado_en BETWEEN '2026-01-15' AND '2026-01-20';
-- Solo accede a eventos_2026_01

-- Particionado por lista
CREATE TABLE pedidos_por_region (
    id BIGSERIAL, region TEXT, monto DECIMAL
) PARTITION BY LIST (region);

CREATE TABLE pedidos_europa PARTITION OF pedidos_por_region
    FOR VALUES IN ('ES', 'FR', 'DE', 'IT', 'PT');
CREATE TABLE pedidos_americas PARTITION OF pedidos_por_region
    FOR VALUES IN ('US', 'CA', 'MX', 'BR');
CREATE TABLE pedidos_otros PARTITION OF pedidos_por_region DEFAULT;

-- Eliminar datos antiguos instantáneamente (DROP PARTITION = 0ms)
DROP TABLE eventos_2025_01;  -- vs DELETE que bloquearía y sería lento`}</code></pre>

            {/* ── 6. JSONB ── */}
            <h2 id="jsonb">JSON y JSONB</h2>
            <pre><code>{`-- JSONB vs JSON: JSONB se almacena en formato binario → más rápido para consultas
-- JSON preserva formato y orden → solo si necesitas exactitud de entrada

-- Operadores básicos
SELECT datos -> 'nombre' AS nombre_json,          -- devuelve JSON
       datos ->> 'nombre' AS nombre_texto,         -- devuelve TEXT
       datos -> 'direccion' -> 'ciudad' AS ciudad, -- anidado
       datos #>> '{contacto, email}' AS email      -- ruta con array
FROM usuarios;

-- Índice GIN para búsquedas flexibles
CREATE INDEX idx_datos_gin ON usuarios USING GIN (datos);

-- @> operador de contención — usa el índice GIN
SELECT * FROM usuarios WHERE datos @> '{"activo": true, "rol": "admin"}';

-- ? operador de existencia de clave
SELECT * FROM usuarios WHERE datos ? 'email_verificado';

-- jsonb_path_query — JSONPath (PostgreSQL 12+)
SELECT jsonb_path_query(datos, '$.tags[*] ? (@ like_regex "python" flag "i")')
FROM articulos;

-- Actualizar JSONB
UPDATE usuarios
SET datos = jsonb_set(datos, '{preferencias, tema}', '"oscuro"')
WHERE id = 1;

-- Eliminar clave
UPDATE usuarios SET datos = datos - 'campo_obsoleto' WHERE id = 1;

-- Agregar JSONB
SELECT
    jsonb_agg(jsonb_build_object('id', id, 'nombre', nombre)) AS lista,
    jsonb_object_agg(id::text, nombre) AS mapa
FROM usuarios LIMIT 10;`}</code></pre>

            {/* ── 7. pgvector ── */}
            <h2 id="pgvector">pgvector — búsqueda semántica</h2>
            <pre><code>{`-- Instalar extensión
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabla con columna de embeddings
CREATE TABLE articulos (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    contenido TEXT,
    embedding vector(1536),  -- dimensiones del modelo (OpenAI text-embedding-3-small)
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Índice HNSW para búsqueda KNN aproximada (más rápido)
CREATE INDEX idx_articulos_embedding ON articulos
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- Índice IVFFlat (alternativa — más preciso pero más lento)
CREATE INDEX idx_articulos_ivf ON articulos
    USING ivfflat (embedding vector_l2_ops)
    WITH (lists = 100);  -- ~sqrt(num_filas)

-- Búsqueda de los 5 artículos más similares semánticamente
SELECT
    titulo,
    1 - (embedding <=> '[0.1, 0.2, ...]'::vector) AS similitud
FROM articulos
ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector  -- cosine distance
LIMIT 5;

-- Operadores de distancia:
-- <->  L2 (euclidiana)
-- <=>  coseno (la más usada para texto)
-- <#>  producto interno (negativo)

-- Búsqueda híbrida — semántica + filtros tradicionales
SELECT titulo, contenido,
       1 - (embedding <=> query_embedding) AS similitud
FROM articulos,
     (SELECT embedding AS query_embedding FROM articulos WHERE id = 42) ref
WHERE categoria = 'python'
  AND creado_en >= NOW() - INTERVAL '6 months'
  AND 1 - (embedding <=> ref.query_embedding) > 0.7
ORDER BY similitud DESC
LIMIT 10;`}</code></pre>

            {/* ── 8. Mantenimiento ── */}
            <h2 id="mantenimiento">Mantenimiento y monitorización</h2>
            <pre><code>{`-- VACUUM y ANALYZE — mantenimiento rutinario
VACUUM ANALYZE usuarios;          -- limpiar filas muertas y actualizar estadísticas
VACUUM FULL usuarios;             -- reescribe la tabla (bloquea, libera espacio al SO)
REINDEX TABLE CONCURRENTLY pedidos;  -- reconstruir índices sin bloquear

-- Tablas más grandes
SELECT tablename, pg_size_pretty(total_bytes) AS total,
       pg_size_pretty(table_bytes) AS tabla,
       pg_size_pretty(index_bytes) AS indices,
       pg_size_pretty(toast_bytes) AS toast
FROM (
    SELECT tablename,
           pg_total_relation_size(tablename::text) AS total_bytes,
           pg_relation_size(tablename::text) AS table_bytes,
           pg_indexes_size(tablename::text) AS index_bytes,
           pg_total_relation_size(tablename::text) - pg_relation_size(tablename::text) -
               pg_indexes_size(tablename::text) AS toast_bytes
    FROM pg_tables WHERE schemaname = 'public'
) t ORDER BY total_bytes DESC LIMIT 10;

-- Consultas más lentas con pg_stat_statements
SELECT query, calls, mean_exec_time,
       total_exec_time, stddev_exec_time,
       rows / calls AS rows_por_llamada
FROM pg_stat_statements
WHERE mean_exec_time > 100  -- más de 100ms en promedio
ORDER BY mean_exec_time DESC
LIMIT 20;

-- Conexiones activas y bloqueadas
SELECT pid, now() - pg_stat_activity.query_start AS duracion,
       query, state, wait_event_type, wait_event
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duracion DESC;

-- Terminar consulta bloqueante
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE query_start < NOW() - INTERVAL '5 minutes'
  AND state = 'active';`}</code></pre>

            <h2>Proyecto final</h2>
            <p>
                Optimizarás una base de datos real de ejemplo con 10 millones de registros: identificarás consultas lentas con <code>pg_stat_statements</code>, añadirás los índices correctos, refactorizarás consultas con CTEs y window functions, y añadirás búsqueda semántica con pgvector. Mejoras de rendimiento medidas antes y después.
            </p>
        </LessonLayout>
    );
}
