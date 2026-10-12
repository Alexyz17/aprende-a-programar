import LessonLayout from '@/layouts/LessonLayout';
import { Head } from '@inertiajs/react';

const modules = [
    { id: '/lecciones/n8n', title: '¿Qué es n8n?', free: true },
    { id: '/lecciones/n8n#interfaz', title: 'Interfaz y conceptos', free: false },
    { id: '/lecciones/n8n#triggers', title: 'Triggers y webhooks', free: false },
    { id: '/lecciones/n8n#http', title: 'Integraciones HTTP/API', free: false },
    { id: '/lecciones/n8n#datos', title: 'Base de datos y archivos', free: false },
    { id: '/lecciones/n8n#ia', title: 'Agentes de IA', free: false },
    { id: '/lecciones/n8n#selfhosted', title: 'n8n Self-hosted', free: false },
    { id: '/lecciones/n8n#produccion', title: 'Flujos de producción', free: false },
];

export default function N8n() {
    return (
        <LessonLayout
            title="Automatización con n8n"
            description="Automatiza flujos de trabajo conectando apps, APIs e IA con n8n."
            duration="3h 40min"
            lessons={20}
            level="Intermedio"
            premium={false}
            modules={modules}
            activeModule="/lecciones/n8n"
            category="Automatización"
            allUnlocked={true}
        >
            <Head>
                <title>Automatización con n8n — Aprende a Programar</title>
                <meta name="description" content="Curso completo de n8n 2026: workflows, webhooks, AI Agent node, MCP Protocol y self-hosting." />
            </Head>

            <h1>Automatización con n8n</h1>

            <blockquote>
                n8n es la plataforma de automatización más potente para desarrolladores. Open source, self-hosteable y con <strong>agentes de IA nativos</strong>. En 2026, el AI Agent node y el MCP Protocol convierten n8n en el centro de control de tus pipelines inteligentes.
            </blockquote>

            <h2>¿Qué es n8n?</h2>
            <p>n8n (nodemation) es una plataforma visual para crear <strong>flujos de trabajo automáticos</strong>. Conectas nodos — cada uno es una app, una API o una operación — y defines qué pasa con los datos entre ellos. Con más de 400 integraciones nativas y la posibilidad de ejecutar código JavaScript o Python en cualquier nodo, cubre el 99% de casos de uso.</p>

            <pre><code>{`n8n vs alternativas:
┌──────────────────┬──────────┬────────┬───────────┐
│                  │  n8n     │ Zapier │   Make    │
├──────────────────┼──────────┼────────┼───────────┤
│ Open Source      │  ✅      │  ❌    │    ❌     │
│ Self-hosted      │  ✅      │  ❌    │    ❌     │
│ Código JS/Python │  ✅      │  ❌    │  parcial  │
│ AI Agent nativo  │  ✅      │  ❌    │    ❌     │
│ MCP Protocol     │  ✅      │  ❌    │    ❌     │
│ Precio self-host │  gratis  │  20$/m │    9$/m   │
└──────────────────┴──────────┴────────┴───────────┘`}</code></pre>

            <h2 id="interfaz">Interfaz y conceptos clave</h2>

            <h3>Anatomía de un workflow</h3>
            <pre><code>{`Workflow
├── Trigger node          — el que inicia todo (webhook, cron, evento)
├── Nodos de operación    — transforman, filtran o enrutan datos
│   ├── IF / Switch       — lógica condicional
│   ├── Code              — JavaScript o Python personalizado
│   ├── Set               — crear o modificar campos
│   ├── Merge             — combinar ramas
│   └── Loop              — iterar sobre arrays
└── Nodos de acción       — hacen algo (enviar email, crear registro...)

Items — la unidad de datos que fluye entre nodos
{
  "json": { "nombre": "Alex", "email": "alex@ejemplo.com" },
  "binary": { "archivo": { ... } }   // para archivos
}

Expresiones — acceder a datos de nodos anteriores
{{ $json.nombre }}                    // dato del nodo actual
{{ $('Webhook').item.json.email }}    // dato de nodo específico
{{ $now.toISO() }}                    // fecha actual
{{ $jmespath($json, "items[*].id") }} // JMESPath`}</code></pre>

            <h3>Tipos de ejecución</h3>
            <pre><code>{`# Manual — ejecutar desde la interfaz para probar
# Trigger automático — webhook, cron, evento
# Sub-workflow — invocado por otro workflow

# Modos de error
# Stop on first error (defecto)
# Continue on error — el workflow sigue aunque un nodo falle
# Retry on fail — reintentar N veces con delay`}</code></pre>

            <h2 id="triggers">Triggers y webhooks</h2>

            <h3>Webhook trigger</h3>
            <pre><code>{`# Configuración del nodo Webhook:
# URL: https://tu-n8n.com/webhook/mi-endpoint
# Method: POST (o GET, PUT, DELETE)
# Authentication: None / Basic / Header Auth

# Probar con curl:
curl -X POST https://tu-n8n.com/webhook/nueva-venta \
     -H "Content-Type: application/json" \
     -H "X-API-Key: mi-secreto" \
     -d '{
       "cliente": "Alex",
       "importe": 150,
       "producto": "Plan Pro CursoHub"
     }'

# El nodo devuelve el body como $json
# Puedes responder de vuelta con "Respond to Webhook" node`}</code></pre>

            <h3>Schedule trigger (cron)</h3>
            <pre><code>{`# Expresiones cron en n8n:
# ┌─────────── minutos (0-59)
# │ ┌───────── horas (0-23)
# │ │ ┌─────── día del mes (1-31)
# │ │ │ ┌───── mes (1-12)
# │ │ │ │ ┌─── día de la semana (0-6, 0=domingo)
# │ │ │ │ │
# 0 8 * * 1-5    → Lunes-Viernes a las 8:00
# 0 */6 * * *    → Cada 6 horas
# 30 9 1 * *     → El día 1 de cada mes a las 9:30
# 0 0 * * 0      → Cada domingo a medianoche`}</code></pre>

            <h3>Triggers de apps</h3>
            <pre><code>{`Triggers nativos disponibles (2026):
- GitHub: push, pull request, issue, release
- GitLab: pipeline, merge request, push
- Slack: mensaje nuevo, reacción, mención
- Gmail: email nuevo, etiqueta aplicada
- Linear: issue creado, estado cambiado
- Notion: página creada/actualizada
- Stripe: pago completado, suscripción cancelada
- Gumroad: venta realizada (via webhook)
- Shopify: pedido nuevo, inventario bajo
- Typeform: respuesta nueva`}</code></pre>

            <h2 id="http">Integraciones HTTP y APIs</h2>

            <h3>HTTP Request node — conectar cualquier API</h3>
            <pre><code>{`# Configuración básica
Method: GET / POST / PUT / PATCH / DELETE
URL: https://api.ejemplo.com/v1/recursos

# Headers
Content-Type: application/json
Authorization: Bearer {{ $env.MI_API_KEY }}

# Body (JSON)
{
  "nombre": "{{ $json.nombre }}",
  "email": "{{ $json.email }}"
}

# Autenticación predefinida:
# - Basic Auth
# - Bearer Token
# - API Key (header o query param)
# - OAuth2 (con refresh automático)
# - Digest Auth`}</code></pre>

            <h3>Paginación automática</h3>
            <pre><code>{`# n8n puede paginar automáticamente APIs:
# Pagination Type: Offset, Cursor, Link Header

# Ejemplo con offset:
# URL: https://api.com/items?page={{ $pageCount + 1 }}&per_page=100
# Continue While: {{ $response.body.has_more === true }}

# Con cursor:
# Siguiente cursor: {{ $response.body.next_cursor }}
# Parar cuando: {{ !$response.body.next_cursor }}`}</code></pre>

            <h3>Workflow real: Notificación de ventas Gumroad → Slack</h3>
            <pre><code>{`Nodos del workflow:
1. Webhook (trigger)
   → Recibe POST de Gumroad en cada venta

2. IF
   → Condición: {{ $json.sale_price }} >= 10
   → TRUE: continuar | FALSE: ignorar

3. Set
   → Crear campos formateados:
     mensaje: "🎉 Venta: {{ $json.product_name }} · {{ $json.sale_price }}€ · {{ $json.email }}"
     fecha: "{{ $now.format('dd/MM/yyyy HH:mm') }}"

4. Slack (Send Message)
   → Channel: #ventas
   → Message: {{ $json.mensaje }}

5. Respond to Webhook
   → Status: 200
   → Body: { "ok": true }`}</code></pre>

            <h2 id="datos">Base de datos y archivos</h2>

            <h3>MySQL / PostgreSQL node</h3>
            <pre><code>{`# Ejecutar query
Operation: Execute Query
Query: SELECT id, email, role FROM users WHERE created_at > NOW() - INTERVAL 7 DAY

# Insertar
Operation: Insert
Table: leads
Columns: nombre, email, fuente
Values: {{ $json.nombre }}, {{ $json.email }}, "n8n-workflow"

# Con parámetros seguros (previene SQL injection)
Query: SELECT * FROM orders WHERE user_id = :userId AND status = :status
Parameters: { "userId": "{{ $json.id }}", "status": "completed" }`}</code></pre>

            <h3>Google Sheets — base de datos sencilla</h3>
            <pre><code>{`# Leer datos de una hoja
Operation: Read Rows
Spreadsheet: [ID de tu spreadsheet]
Sheet: Hoja1
Filters: columna "Estado" = "Pendiente"

# Añadir fila
Operation: Append Row
Values:
  Fecha: {{ $now.format('dd/MM/yyyy') }}
  Cliente: {{ $json.nombre }}
  Importe: {{ $json.importe }}
  Estado: Completado

# Actualizar fila
Operation: Update Row
Row Number: {{ $json.rowNumber }}
Values: { "Estado": "Procesado" }`}</code></pre>

            <h3>Procesar archivos</h3>
            <pre><code>{`# Leer CSV
Nodo: Read/Write Files from Disk
→ Procesar cada fila con Split In Batches

# Descargar archivo de URL
HTTP Request → Binary Data habilitado
→ Guardar con: Write Binary File

# Enviar archivo por email (Gmail)
Nodo: Gmail (Send Email)
Attachments: {{ $binary.data }}
Filename: reporte.pdf`}</code></pre>

            <h2 id="ia">Agentes de IA con n8n</h2>

            <h3>AI Agent node — 2026</h3>
            <pre><code>{`# El AI Agent node puede:
# - Razonar sobre una tarea
# - Decidir qué herramientas usar
# - Ejecutar múltiples pasos de forma autónoma
# - Usar memoria para recordar contexto

# Configuración:
Chat Model: Claude Sonnet 4.6 / GPT-4o / Llama local (Ollama)
System Prompt: |
  Eres un asistente de soporte de CursoHub.
  Tienes acceso a la base de datos de usuarios y tickets.
  Responde en español, de forma concisa y profesional.

# Herramientas disponibles para el agente:
# - Tool: Buscar usuario → MySQL query
# - Tool: Crear ticket → INSERT en tabla tickets
# - Tool: Enviar email → Gmail node
# - Tool: Consultar documentación → HTTP Request a tu API`}</code></pre>

            <h3>Workflow: Soporte automático con IA</h3>
            <pre><code>{`1. Webhook — recibe email/mensaje del usuario
2. AI Agent node
   → Prompt: "El usuario pregunta: {{ $json.message }}"
   → Herramientas: buscar_usuario, buscar_en_docs, crear_ticket
   → El agente decide qué hacer:
      - Si es pregunta → busca en docs y responde
      - Si es bug → crea ticket y notifica al equipo
      - Si necesita datos del usuario → consulta BD
3. IF — ¿el agente pudo resolver?
   → SÍ: responder al usuario con la solución
   → NO: escalar a humano via Slack`}</code></pre>

            <h3>MCP Protocol en n8n</h3>
            <pre><code>{`# MCP (Model Context Protocol) permite que n8n actúe como:
# A) Cliente MCP — usa herramientas de servidores MCP externos
# B) Servidor MCP — expone tus workflows como herramientas para LLMs

# Como cliente — usar herramientas de otro servidor MCP:
Nodo: MCP Client
Server URL: http://mi-servidor-mcp:3000
Tool: buscar_repositorio
Input: { "query": "{{ $json.busqueda }}" }

# Como servidor — que Claude pueda invocar tus workflows:
# n8n expone tus nodos como herramientas MCP
# Claude Code o Claude.ai pueden llamar a tu n8n directamente`}</code></pre>

            <h2 id="selfhosted">n8n Self-hosted con Docker</h2>

            <pre><code>{`# docker-compose.yml para n8n en producción
services:
  n8n:
    image: n8nio/n8n:latest
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=n8n.tudominio.com
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - WEBHOOK_URL=https://n8n.tudominio.com
      - N8N_ENCRYPTION_KEY=\${N8N_ENCRYPTION_KEY}    # clave para credenciales
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=\${POSTGRES_PASSWORD}
      - EXECUTIONS_DATA_PRUNE=true
      - EXECUTIONS_DATA_MAX_AGE=336                   # 14 días
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: n8n
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  n8n_data:
  postgres_data:`}</code></pre>

            <h2 id="produccion">Flujos de producción reales</h2>

            <h3>Workflow 1: Pipeline de onboarding</h3>
            <pre><code>{`Trigger: Webhook (Gumroad venta)
│
├── Actualizar rol en BD (MySQL: UPDATE users SET role='premium')
├── Enviar email bienvenida (Gmail con template HTML)
├── Crear contacto en CRM (HubSpot)
├── Notificar en Slack (#ventas)
└── Añadir a Google Sheets (registro contable)

Tiempo de ejecución: ~2 segundos
Sin intervención humana`}</code></pre>

            <h3>Workflow 2: Informe semanal automático</h3>
            <pre><code>{`Trigger: Schedule (lunes 8:00)
│
├── MySQL: SELECT COUNT(*), SUM(importe) FROM ventas WHERE semana = LAST_WEEK
├── MySQL: SELECT COUNT(*) FROM users WHERE created_at > LAST_WEEK
├── HTTP Request: métricas de Cloudflare (visitas, ancho de banda)
├── Code node: formatear datos en tabla Markdown
├── Gmail: enviar informe a admin@ejemplo.com
└── Slack: resumen en #reportes`}</code></pre>

            <h3>Workflow 3: Monitor de servidor con alerta</h3>
            <pre><code>{`Trigger: Schedule (cada 5 minutos)
│
├── HTTP Request: GET https://ejemplo.com/health → ¿200?
├── IF: status !== 200 OR response_time > 3000ms
│   └── TRUE:
│       ├── Slack: "🔴 ejemplo.com caído ({{ $json.status }})"
│       └── Gmail: alerta urgente a admin@ejemplo.com
└── Guardar métrica en Google Sheets (uptime histórico)`}</code></pre>
        </LessonLayout>
    );
}
