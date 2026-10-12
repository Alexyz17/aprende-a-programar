import LessonLayout from '@/layouts/LessonLayout';
import { Head } from '@inertiajs/react';

const modules = [
    { id: '/lecciones/ia-programacion', title: 'IA en el desarrollo moderno', free: true },
    { id: '/lecciones/ia-programacion#api', title: 'Claude API desde cero', free: false },
    { id: '/lecciones/ia-programacion#prompts', title: 'Prompts y contexto', free: false },
    { id: '/lecciones/ia-programacion#tools', title: 'Tool use y function calling', free: false },
    { id: '/lecciones/ia-programacion#agentes', title: 'Agentes autónomos', free: false },
    { id: '/lecciones/ia-programacion#rag', title: 'RAG con embeddings', free: false },
    { id: '/lecciones/ia-programacion#laravel', title: 'IA en Laravel', free: false },
    { id: '/lecciones/ia-programacion#proyectos', title: 'Proyectos reales', free: false },
];

export default function IAProgramacion() {
    return (
        <LessonLayout
            title="IA aplicada a la programación"
            description="Integra IA generativa en tus proyectos: Claude API, agentes, RAG y herramientas reales."
            duration="4h 20min"
            lessons={22}
            level="Avanzado"
            premium={false}
            modules={modules}
            activeModule="/lecciones/ia-programacion"
            category="IA & Automatización"
            allUnlocked={true}
        >
            <Head>
                <title>IA aplicada a la programación — Aprende a Programar</title>
                <meta name="description" content="Curso completo de IA para desarrolladores: Claude API, tool use, agentes autónomos, RAG y proyectos reales." />
            </Head>

            <h1>IA aplicada a la programación</h1>

            <blockquote>
                En 2026 los desarrolladores que integran IA construyen en días lo que antes llevaba semanas. No se trata de usar IA para escribir código — se trata de <strong>diseñar sistemas donde la IA es una capa funcional</strong>: toma decisiones, procesa información y actúa sobre tus datos reales.
            </blockquote>

            <h2>El ecosistema en 2026</h2>
            <pre><code>{`Modelos principales:
├── Anthropic Claude 4
│   ├── claude-opus-4        # Máxima capacidad, razonamiento complejo
│   ├── claude-sonnet-4-6    # Balance rendimiento/coste (recomendado)
│   └── claude-haiku-4-5     # Velocidad máxima, tareas simples
├── OpenAI gpt-4o / o3       # Multimodal, razonamiento profundo
├── Google Gemini 2.5 Pro    # Contexto de 1M tokens
└── Modelos locales (Ollama) # Privacidad total, sin coste de API
    ├── Llama 3.3 70B
    └── Mistral 7B

Casos de uso en producción:
├── Soporte automático (RAG sobre tu documentación)
├── Generación de contenido personalizado
├── Extracción de datos estructurados de documentos
├── Clasificación y moderación de contenido
├── Resumen de emails, contratos, informes
└── Agentes que interactúan con APIs y bases de datos`}</code></pre>

            <h2 id="api">Claude API desde cero</h2>

            <h3>Instalación — PHP</h3>
            <pre><code>{`composer require anthropics/anthropic-sdk-php`}</code></pre>

            <pre><code>{`# .env
ANTHROPIC_API_KEY=sk-ant-api03-...`}</code></pre>

            <pre><code>{`<?php
use Anthropic\Anthropic;

$client = Anthropic::client(env('ANTHROPIC_API_KEY'));

$response = $client->messages()->create([
    'model'      => 'claude-sonnet-4-6',
    'max_tokens' => 1024,
    'system'     => 'Eres un asistente técnico de CursoHub. Respondes en español.',
    'messages'   => [
        ['role' => 'user', 'content' => '¿Qué es un contenedor Docker?'],
    ],
]);

echo $response->content[0]->text;

// Metadatos
echo $response->usage->input_tokens;   // tokens de entrada consumidos
echo $response->usage->output_tokens;  // tokens de salida generados
echo $response->stop_reason;           // "end_turn" | "max_tokens" | "tool_use"`}</code></pre>

            <h3>Instalación — TypeScript / Node.js</h3>
            <pre><code>{`npm install @anthropic-ai/sdk`}</code></pre>

            <pre><code>{`import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: 'Eres un asistente técnico. Respondes en español.',
    messages: [{ role: 'user', content: '¿Qué es Docker Compose?' }],
});

console.log(message.content[0].text);`}</code></pre>

            <h3>Streaming — respuesta token a token</h3>
            <pre><code>{`<?php
// Laravel — SSE (Server-Sent Events)
use Anthropic\Anthropic;

Route::get('/chat/stream', function (Request $request) {
    $client = Anthropic::client(env('ANTHROPIC_API_KEY'));

    return response()->stream(function () use ($client, $request) {
        $stream = $client->messages()->stream([
            'model'      => 'claude-sonnet-4-6',
            'max_tokens' => 2048,
            'messages'   => [
                ['role' => 'user', 'content' => $request->input('message')],
            ],
        ]);

        foreach ($stream as $event) {
            if ($event->type === 'content_block_delta') {
                echo "data: " . json_encode(['text' => $event->delta->text]) . "\n\n";
                ob_flush();
                flush();
            }
        }
        echo "data: [DONE]\n\n";
    }, 200, [
        'Content-Type'      => 'text/event-stream',
        'Cache-Control'     => 'no-cache',
        'X-Accel-Buffering' => 'no',
    ]);
});`}</code></pre>

            <h2 id="prompts">Prompts y contexto</h2>

            <h3>Anatomía de un buen system prompt</h3>
            <pre><code>{`<?php
$systemPrompt = <<<PROMPT
Eres el asistente de soporte de CursoHub, una plataforma educativa de programación.

ROL Y TONO:
- Responde siempre en español
- Sé conciso pero completo (máximo 300 palabras por respuesta)
- Usa ejemplos de código cuando sea útil
- Si no sabes algo, dilo explícitamente — no inventes

LO QUE PUEDES HACER:
- Responder preguntas sobre los cursos disponibles
- Ayudar con dudas técnicas de Linux, Laravel y Docker
- Explicar conceptos de programación

LO QUE NO DEBES HACER:
- No dar información sobre precios distintos a los oficiales
- No prometer funcionalidades que no existan
- No hablar de temas no relacionados con programación/tecnología

CONTEXTO DE LA PLATAFORMA:
- Plan Pro: 9 € al mes
- Cursos gratuitos: Linux, Comandos Linux, Shell Scripting, Laravel, Seguridad Web
- Cursos Pro: Docker, n8n, IA, Eloquent avanzado, APIs REST
PROMPT;`}</code></pre>

            <h3>Gestión del historial de conversación</h3>
            <pre><code>{`<?php
// Las conversaciones son stateless — debes enviar el historial completo
// Cada llamada incluye todos los mensajes anteriores

$historial = session('chat_history', []);

// Añadir mensaje del usuario
$historial[] = ['role' => 'user', 'content' => $nuevoMensaje];

$response = $client->messages()->create([
    'model'      => 'claude-sonnet-4-6',
    'max_tokens' => 1024,
    'system'     => $systemPrompt,
    'messages'   => $historial,
]);

$respuestaIA = $response->content[0]->text;

// Añadir respuesta al historial
$historial[] = ['role' => 'assistant', 'content' => $respuestaIA];

// Guardar historial (limitar a últimos N mensajes para controlar coste)
session(['chat_history' => array_slice($historial, -20)]);`}</code></pre>

            <h3>Caché de prompts — hasta 90% de ahorro</h3>
            <pre><code>{`<?php
// Los system prompts largos repetidos se pueden cachear
// Anthropic guarda el KV cache por 5 minutos (TTL)

$response = $client->messages()->create([
    'model'      => 'claude-sonnet-4-6',
    'max_tokens' => 1024,
    'system'     => [
        [
            'type' => 'text',
            'text' => $systemPromptLargo,        // p.ej. 50.000 tokens de docs
            'cache_control' => ['type' => 'ephemeral'], // marcar como cacheable
        ],
    ],
    'messages' => $historial,
]);

// Primera llamada: paga por todos los tokens
// Llamadas siguientes en 5 min: 90% de descuento en tokens de entrada`}</code></pre>

            <h2 id="tools">Tool use — conectar IA con tus sistemas</h2>

            <h3>Definir herramientas</h3>
            <pre><code>{`<?php
$tools = [
    [
        'name'        => 'buscar_usuario',
        'description' => 'Busca un usuario en la base de datos por email o ID. Devuelve sus datos y estado de suscripción.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'email' => ['type' => 'string', 'description' => 'Email del usuario'],
                'id'    => ['type' => 'integer', 'description' => 'ID del usuario'],
            ],
        ],
    ],
    [
        'name'        => 'actualizar_rol',
        'description' => 'Actualiza el rol de un usuario (user, premium, admin).',
        'input_schema' => [
            'type'       => 'object',
            'required'   => ['user_id', 'rol'],
            'properties' => [
                'user_id' => ['type' => 'integer'],
                'rol'     => ['type' => 'string', 'enum' => ['user', 'premium', 'admin']],
            ],
        ],
    ],
    [
        'name'        => 'enviar_email',
        'description' => 'Envía un email al usuario.',
        'input_schema' => [
            'type'       => 'object',
            'required'   => ['destinatario', 'asunto', 'mensaje'],
            'properties' => [
                'destinatario' => ['type' => 'string'],
                'asunto'       => ['type' => 'string'],
                'mensaje'      => ['type' => 'string'],
            ],
        ],
    ],
];`}</code></pre>

            <h3>Loop de ejecución de herramientas</h3>
            <pre><code>{`<?php
function ejecutarConHerramientas(array $messages, array $tools): string
{
    $client = Anthropic::client(env('ANTHROPIC_API_KEY'));

    while (true) {
        $response = $client->messages()->create([
            'model'      => 'claude-sonnet-4-6',
            'max_tokens' => 2048,
            'tools'      => $tools,
            'messages'   => $messages,
        ]);

        // Si terminó de responder → devolver texto
        if ($response->stop_reason === 'end_turn') {
            return collect($response->content)
                ->where('type', 'text')
                ->pluck('text')
                ->implode("\n");
        }

        // Si quiere usar herramientas → ejecutarlas
        if ($response->stop_reason === 'tool_use') {
            $messages[] = ['role' => 'assistant', 'content' => $response->content];

            $toolResults = [];
            foreach ($response->content as $block) {
                if ($block->type !== 'tool_use') continue;

                $resultado = ejecutarHerramienta($block->name, $block->input);

                $toolResults[] = [
                    'type'       => 'tool_result',
                    'tool_use_id' => $block->id,
                    'content'    => json_encode($resultado),
                ];
            }

            $messages[] = ['role' => 'user', 'content' => $toolResults];
            // Continuar el loop — Claude procesará los resultados
        }
    }
}

function ejecutarHerramienta(string $nombre, object $input): mixed
{
    return match($nombre) {
        'buscar_usuario'  => User::where('email', $input->email ?? null)
                                ->orWhere('id', $input->id ?? null)
                                ->first()?->toArray(),
        'actualizar_rol'  => User::find($input->user_id)
                                ->update(['role' => $input->rol]),
        'enviar_email'    => Mail::to($input->destinatario)
                                ->send(new GenericMail($input->asunto, $input->mensaje)),
        default           => ['error' => "Herramienta '$nombre' no reconocida"],
    };
}`}</code></pre>

            <h2 id="agentes">Agentes autónomos</h2>

            <h3>Patrón ReAct — Reason + Act</h3>
            <pre><code>{`// El agente sigue este loop:
// 1. THINK  — razona sobre qué hacer
// 2. ACT    — llama a una herramienta
// 3. OBSERVE — procesa el resultado
// 4. Repetir hasta completar el objetivo

// Ejemplo: "Activa el acceso premium al usuario alex@ejemplo.com
//           y envíale un email de bienvenida"

// Iteración 1:
// → Think: Necesito buscar al usuario por email
// → Act: buscar_usuario({ email: "alex@ejemplo.com" })
// → Observe: { id: 42, nombre: "Alex", role: "user" }

// Iteración 2:
// → Think: Tengo el ID. Actualizo el rol a premium
// → Act: actualizar_rol({ user_id: 42, rol: "premium" })
// → Observe: true

// Iteración 3:
// → Think: Ahora envío el email de bienvenida
// → Act: enviar_email({ destinatario: "alex@ejemplo.com",
//          asunto: "¡Bienvenido a CursoHub Pro!",
//          mensaje: "Ya tienes acceso a todos los cursos..." })
// → Observe: true

// Iteración 4:
// → Think: Todo completado.
// → Respuesta final: "He activado el acceso premium para Alex y le he enviado el email."

// Sin instrucciones paso a paso — el agente planifica solo`}</code></pre>

            <h3>Memoria en agentes</h3>
            <pre><code>{`<?php
// Tipos de memoria:
// 1. En contexto — el historial de mensajes (limitado por context window)
// 2. Externa — base de datos, Redis, archivos

// Memoria externa con Redis
use Illuminate\Support\Facades\Redis;

class AgenteConMemoria
{
    public function chat(int $userId, string $mensaje): string
    {
        $key = "agente:memoria:{$userId}";

        // Cargar memoria del usuario
        $memoria = json_decode(Redis::get($key) ?? '[]', true);

        $respuesta = ejecutarConHerramientas([
            ...$memoria,
            ['role' => 'user', 'content' => $mensaje],
        ], $this->tools);

        // Guardar conversación actualizada (últimas 10 interacciones)
        $nuevaMemoria = array_slice([
            ...$memoria,
            ['role' => 'user',      'content' => $mensaje],
            ['role' => 'assistant', 'content' => $respuesta],
        ], -20);

        Redis::setex($key, 86400, json_encode($nuevaMemoria)); // TTL 24h

        return $respuesta;
    }
}`}</code></pre>

            <h2 id="rag">RAG — Retrieval Augmented Generation</h2>

            <h3>¿Qué es RAG?</h3>
            <pre><code>{`// Problema: el modelo no conoce TU documentación
// Solución RAG:
// 1. Indexar — convertir tus docs en vectores (embeddings)
// 2. Buscar — cuando llega una pregunta, buscar los fragmentos más relevantes
// 3. Generar — enviar esos fragmentos + pregunta al modelo

// Flujo:
// Pregunta del usuario
//   → Generar embedding de la pregunta
//   → Buscar en BD vectorial los K fragmentos más similares
//   → Incluir esos fragmentos en el prompt
//   → El modelo responde basándose en TU documentación`}</code></pre>

            <h3>Implementación con pgvector (PostgreSQL)</h3>
            <pre><code>{`# Instalar extensión pgvector
CREATE EXTENSION IF NOT EXISTS vector;

# Tabla de documentos indexados
CREATE TABLE documentos (
    id          SERIAL PRIMARY KEY,
    titulo      TEXT,
    contenido   TEXT,
    embedding   vector(1536),    -- dimensiones del modelo text-embedding-3-small
    created_at  TIMESTAMP DEFAULT NOW()
);

# Índice para búsqueda eficiente
CREATE INDEX ON documentos USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);`}</code></pre>

            <pre><code>{`<?php
use Anthropic\Anthropic;
use OpenAI\Client as OpenAIClient;

class RAGService
{
    public function indexarDocumento(string $titulo, string $contenido): void
    {
        // Generar embedding con OpenAI (Anthropic aún no tiene API de embeddings)
        $openai = OpenAI::client(env('OPENAI_API_KEY'));

        $response = $openai->embeddings()->create([
            'model' => 'text-embedding-3-small',
            'input' => $contenido,
        ]);

        $embedding = $response->embeddings[0]->embedding;

        DB::table('documentos')->insert([
            'titulo'    => $titulo,
            'contenido' => $contenido,
            'embedding' => '[' . implode(',', $embedding) . ']',
        ]);
    }

    public function responder(string $pregunta): string
    {
        $openai = OpenAI::client(env('OPENAI_API_KEY'));
        $anthropic = Anthropic::client(env('ANTHROPIC_API_KEY'));

        // 1. Embedding de la pregunta
        $embPregunta = $openai->embeddings()->create([
            'model' => 'text-embedding-3-small',
            'input' => $pregunta,
        ])->embeddings[0]->embedding;

        $embStr = '[' . implode(',', $embPregunta) . ']';

        // 2. Buscar los 5 fragmentos más relevantes
        $fragmentos = DB::select("
            SELECT titulo, contenido,
                   1 - (embedding <=> ?) AS similitud
            FROM documentos
            ORDER BY embedding <=> ?
            LIMIT 5
        ", [$embStr, $embStr]);

        // 3. Construir contexto
        $contexto = collect($fragmentos)
            ->map(fn ($f) => "### {$f->titulo}\n{$f->contenido}")
            ->implode("\n\n");

        // 4. Llamar al modelo con contexto
        $response = $anthropic->messages()->create([
            'model'      => 'claude-sonnet-4-6',
            'max_tokens' => 1024,
            'system'     => "Responde usando SOLO la siguiente documentación. Si la respuesta no está en ella, dilo explícitamente.\n\n{$contexto}",
            'messages'   => [
                ['role' => 'user', 'content' => $pregunta],
            ],
        ]);

        return $response->content[0]->text;
    }
}`}</code></pre>

            <h2 id="laravel">IA en Laravel — integración completa</h2>

            <h3>Servicio reutilizable</h3>
            <pre><code>{`<?php
// app/Services/IAService.php
namespace App\Services;

use Anthropic\Anthropic;
use Anthropic\Client;

class IAService
{
    private Client $client;

    public function __construct()
    {
        $this->client = Anthropic::client(config('services.anthropic.key'));
    }

    public function clasificar(string $texto, array $categorias): string
    {
        $lista = implode(', ', $categorias);

        $response = $this->client->messages()->create([
            'model'      => 'claude-haiku-4-5',   // Haiku para tareas simples = menor coste
            'max_tokens' => 10,
            'system'     => "Clasifica el texto en UNA de estas categorías: {$lista}. Responde SOLO con el nombre de la categoría.",
            'messages'   => [['role' => 'user', 'content' => $texto]],
        ]);

        return trim($response->content[0]->text);
    }

    public function extraerJSON(string $texto, string $esquema): array
    {
        $response = $this->client->messages()->create([
            'model'      => 'claude-sonnet-4-6',
            'max_tokens' => 512,
            'system'     => "Extrae datos del texto y devuelve SOLO JSON válido con este esquema: {$esquema}",
            'messages'   => [['role' => 'user', 'content' => $texto]],
        ]);

        return json_decode($response->content[0]->text, true) ?? [];
    }

    public function resumir(string $texto, int $maxPalabras = 100): string
    {
        $response = $this->client->messages()->create([
            'model'      => 'claude-haiku-4-5',
            'max_tokens' => 256,
            'system'     => "Resume el siguiente texto en máximo {$maxPalabras} palabras, en español.",
            'messages'   => [['role' => 'user', 'content' => $texto]],
        ]);

        return $response->content[0]->text;
    }
}`}</code></pre>

            <h3>Jobs de Laravel para procesamiento asíncrono</h3>
            <pre><code>{`<?php
// app/Jobs/ProcesarDocumentoConIA.php
class ProcesarDocumentoConIA implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60; // reintentar en 60s si falla (p.ej. rate limit)

    public function __construct(private int $documentoId) {}

    public function handle(IAService $ia): void
    {
        $doc = Documento::findOrFail($this->documentoId);

        $doc->update([
            'resumen'    => $ia->resumir($doc->contenido),
            'categoria'  => $ia->clasificar($doc->contenido, ['Tutorial', 'Referencia', 'Guía']),
            'procesado'  => true,
        ]);
    }

    // Si falla por rate limit → reintentar más tarde
    public function retryUntil(): \DateTime
    {
        return now()->addHours(2);
    }
}

// Uso: cuando se sube un documento
ProcesarDocumentoConIA::dispatch($documento->id)->onQueue('ia');`}</code></pre>

            <h2 id="proyectos">3 proyectos reales</h2>

            <h3>Proyecto 1 — Chatbot de soporte con RAG</h3>
            <pre><code>{`// Stack: Laravel + pgvector + Claude + Inertia.js
// Funcionalidades:
// ✅ Responde preguntas sobre tus cursos usando tu documentación
// ✅ Streaming de respuestas (token a token)
// ✅ Historial persistido por usuario (Redis)
// ✅ Botón "No fue útil" → escala a email humano
// ✅ Panel admin para ver conversaciones y métricas

// Coste estimado: ~0.002$ por conversación (Haiku + caché)
// Tiempo de respuesta: < 1 segundo (streaming)`}</code></pre>

            <h3>Proyecto 2 — Extractor de datos de facturas</h3>
            <pre><code>{`// Stack: Laravel + Claude Vision + Jobs
// Funcionalidades:
// ✅ Subir PDF o imagen de factura
// ✅ Claude extrae: emisor, fecha, importe, líneas de detalle
// ✅ Devuelve JSON estructurado listo para importar
// ✅ Validación automática (sumas, CIF, formato fechas)
// ✅ Export a CSV / integración con contabilidad

// Código clave:
$response = $client->messages()->create([
    'model'      => 'claude-sonnet-4-6',
    'max_tokens' => 1024,
    'system'     => 'Extrae los datos de la factura y devuelve JSON con: emisor, fecha, total, lineas[]',
    'messages'   => [[
        'role'    => 'user',
        'content' => [
            ['type' => 'image', 'source' => [
                'type'       => 'base64',
                'media_type' => 'image/jpeg',
                'data'       => base64_encode(file_get_contents($rutaFactura)),
            ]],
            ['type' => 'text', 'text' => 'Extrae los datos de esta factura'],
        ],
    ]],
]);`}</code></pre>

            <h3>Proyecto 3 — Generador de contenido para CursoHub</h3>
            <pre><code>{`// Stack: Laravel + Claude + Queue + Inertia admin
// Funcionalidades:
// ✅ Generar descripción SEO para cada lección
// ✅ Crear ejercicios prácticos automáticamente
// ✅ Traducir contenido a EN/CA (hreflang)
// ✅ Panel para revisar y aprobar antes de publicar
// ✅ Regenerar con feedback ("más técnico", "más simple")

// Coste por 100 lecciones con Sonnet: ~3$
// Con Haiku: ~0.40$`}</code></pre>

            <h2>Costes de referencia (mayo 2026)</h2>
            <pre><code>{`Modelo               Input/MTok    Output/MTok   Caché input
claude-haiku-4-5     $0.80         $4.00         $0.08
claude-sonnet-4-6    $3.00         $15.00        $0.30
claude-opus-4        $15.00        $75.00        $1.50

Ejemplos reales:
┌─────────────────────────────────────────────────┐
│ 1.000 clasificaciones (Haiku, ~200 tok c/u)     │
│ → $0.16 input + $0.04 output = $0.20 total      │
│                                                 │
│ 500 resúmenes de artículo (Sonnet, ~1.500 tok)  │
│ → $2.25 input + $3.75 output = $6.00 total      │
│                                                 │
│ Chatbot con 10.000 mensajes/mes (caché activa)  │
│ → ~$8-12/mes total                              │
└─────────────────────────────────────────────────┘`}</code></pre>
        </LessonLayout>
    );
}
