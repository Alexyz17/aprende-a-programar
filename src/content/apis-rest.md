# APIs REST con Laravel

> Una API permite que otras aplicaciones (un frontend en React, una app móvil, otro servicio) usen tus datos y tu lógica. En este curso diseñarás y construirás una API profesional con Laravel: rutas, validación, recursos, autenticación con Sanctum, autorización, paginación, versionado, límites de uso, documentación y tests.

## Qué es una API REST

REST es un estilo para diseñar APIs sobre HTTP con unas pocas ideas:

- Todo es un **recurso** identificado por una URL: `/api/v1/tasks/42`.
- Se usan los **verbos HTTP** para indicar la acción.
- Las respuestas usan **códigos de estado** estándar.
- Cada petición es **independiente** (sin estado): lleva todo lo necesario, incluida la autenticación.

| Acción | Verbo y ruta | Éxito |
| --- | --- | --- |
| Listar tareas | `GET /api/v1/tasks` | 200 |
| Ver una tarea | `GET /api/v1/tasks/42` | 200 |
| Crear | `POST /api/v1/tasks` | 201 |
| Reemplazar | `PUT /api/v1/tasks/42` | 200 |
| Modificar campos | `PATCH /api/v1/tasks/42` | 200 |
| Borrar | `DELETE /api/v1/tasks/42` | 204 |

Códigos de error que tu API debe usar con coherencia:

| Código | Significa |
| --- | --- |
| 400 | Petición mal formada |
| 401 | No autenticado (falta el token o no es válido) |
| 403 | Autenticado, pero sin permiso |
| 404 | El recurso no existe |
| 422 | Datos que no superan la validación |
| 429 | Demasiadas peticiones |
| 500 | Error del servidor |

### Buen diseño de URLs

- Sustantivos en plural, no verbos: `/tasks`, no `/getTasks`.
- Relaciones anidadas solo un nivel: `/projects/3/tasks`.
- Filtros, orden y paginación en la *query string*: `/tasks?status=done&sort=-created_at&page=2`.
- Acciones que no encajan en CRUD como subrecurso: `POST /tasks/42/complete`.

## Preparar el proyecto

```bash
laravel new api-tareas
cd api-tareas
php artisan install:api      # instala Sanctum y crea routes/api.php
php artisan make:model Task -mfc --api --requests --resource --policy
```

Ese último comando genera de una vez: modelo, migración, factory, controlador de API, Form Requests, API Resource y policy.

```php
// Migración
Schema::create('tasks', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('title');
    $table->text('description')->nullable();
    $table->string('status')->default('pending')->index();
    $table->date('due_date')->nullable();
    $table->timestamps();
});
```

```php
// app/Enums/TaskStatus.php
enum TaskStatus: string
{
    case Pending = 'pending';
    case InProgress = 'in_progress';
    case Done = 'done';
}

// app/Models/Task.php
class Task extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'status', 'due_date'];

    protected function casts(): array
    {
        return ['status' => TaskStatus::class, 'due_date' => 'date'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

## Rutas y controlador

```php
// routes/api.php
use App\Http\Controllers\Api\V1\TaskController;
use App\Http\Controllers\Api\V1\AuthController;

Route::prefix('v1')->group(function () {
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::apiResource('tasks', TaskController::class);
        Route::post('tasks/{task}/complete', [TaskController::class, 'complete']);
    });
});
```

```bash
php artisan route:list --path=api
```

`apiResource` crea las cinco rutas REST (sin las de formularios `create` y `edit`).

```php
// app/Http/Controllers/Api/V1/TaskController.php
class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = $request->user()->tasks()
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return TaskResource::collection($tasks);
    }

    public function store(StoreTaskRequest $request)
    {
        $task = $request->user()->tasks()->create($request->validated());

        return TaskResource::make($task)->response()->setStatusCode(201);
    }

    public function show(Task $task)
    {
        Gate::authorize('view', $task);

        return TaskResource::make($task);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        Gate::authorize('update', $task);
        $task->update($request->validated());

        return TaskResource::make($task);
    }

    public function destroy(Task $task)
    {
        Gate::authorize('delete', $task);
        $task->delete();

        return response()->noContent();
    }

    public function complete(Task $task)
    {
        Gate::authorize('update', $task);
        $task->update(['status' => TaskStatus::Done]);

        return TaskResource::make($task);
    }
}
```

El parámetro `Task $task` usa **route model binding**: Laravel busca la tarea por id y devuelve 404 si no existe.

## Validación con Form Requests

```php
// app/Http/Requests/StoreTaskRequest.php
class StoreTaskRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:160'],
            'description' => ['nullable', 'string', 'max:5000'],
            'status' => ['sometimes', Rule::enum(TaskStatus::class)],
            'due_date' => ['nullable', 'date', 'after_or_equal:today'],
        ];
    }
}

// UpdateTaskRequest: las mismas reglas con 'sometimes' para permitir PATCH parciales
```

Si la validación falla en una petición que espera JSON, Laravel responde automáticamente con **422** y los errores por campo:

```json
{
  "message": "The title field is required.",
  "errors": { "title": ["The title field is required."] }
}
```

> **Consejo:** los clientes deben enviar la cabecera `Accept: application/json`. Sin ella, ante un error de validación Laravel intentaría redirigir como en una web normal.

## API Resources: controlar el JSON

Nunca devuelvas el modelo tal cual: expondrías columnas internas y cualquier cambio en la base de datos rompería a tus clientes. Un **Resource** define el contrato de salida:

```php
// app/Http/Resources/TaskResource.php
class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status->value,
            'due_date' => $this->due_date?->toDateString(),
            'is_overdue' => $this->due_date?->isPast() && $this->status !== TaskStatus::Done,
            'owner' => UserResource::make($this->whenLoaded('user')),
            'created_at' => $this->created_at->toIso8601String(),
            'links' => ['self' => route('tasks.show', $this->resource)],
        ];
    }
}
```

`whenLoaded` incluye la relación solo si la cargaste con `with()`, evitando consultas N+1 (ver [Eloquent ORM a fondo](/lecciones/eloquent)).

Con paginación, la colección añade `data`, `links` y `meta` automáticamente:

```json
{
  "data": [{ "id": 1, "title": "Escribir la documentación", "status": "pending" }],
  "links": { "first": "…?page=1", "next": "…?page=2" },
  "meta": { "current_page": 1, "per_page": 15, "total": 42 }
}
```

## Autenticación con Sanctum

Sanctum ofrece dos modos:

1. **Tokens de API** para apps móviles, otros servicios o scripts.
2. **Autenticación por cookie** para un frontend SPA en el mismo dominio (la opción más segura para una web).

### Tokens

```php
// app/Http/Controllers/Api/V1/AuthController.php
class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
            'device_name' => ['required', 'string', 'max:100'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages(['email' => 'Credenciales incorrectas.']);
        }

        $token = $user->createToken($data['device_name'], ['tasks:read', 'tasks:write']);

        return response()->json(['token' => $token->plainTextToken], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }
}
```

El cliente envía el token en cada petición:

```bash
curl https://api.ejemplo.com/api/v1/tasks \
  -H "Accept: application/json" \
  -H "Authorization: Bearer 1|AbCdEf..."
```

Las **abilities** (`tasks:read`, `tasks:write`) limitan lo que puede hacer cada token: `$request->user()->tokenCan('tasks:write')`.

### SPA con cookies

Si tu frontend React vive en `app.ejemplo.com` y la API en `api.ejemplo.com` (o el mismo dominio), configura `SANCTUM_STATEFUL_DOMAINS`, pide primero `GET /sanctum/csrf-cookie` y después haz login normal. La sesión viaja en una cookie `HttpOnly` que JavaScript no puede leer, así que un ataque XSS no puede robarla.

> **Importante:** no guardes tokens de larga duración en `localStorage` en una aplicación web. Para webs, usa el modo cookie; reserva los tokens para clientes que no son navegadores.

## Autorización con policies

Autenticación es "¿quién eres?"; **autorización** es "¿puedes hacer esto?".

```php
// app/Policies/TaskPolicy.php
class TaskPolicy
{
    public function view(User $user, Task $task): bool
    {
        return $task->user_id === $user->id;
    }

    public function update(User $user, Task $task): bool
    {
        return $task->user_id === $user->id;
    }

    public function delete(User $user, Task $task): bool
    {
        return $task->user_id === $user->id || $user->is_admin;
    }
}
```

`Gate::authorize('update', $task)` lanza un **403** si la policy devuelve `false`. Sin esta comprobación, cualquier usuario autenticado podría leer o borrar las tareas de otros cambiando el id en la URL (vulnerabilidad IDOR, de las más frecuentes en APIs).

## Errores consistentes

Configura el formato de las excepciones en `bootstrap/app.php`:

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->shouldRenderJsonWhen(fn (Request $request) => $request->is('api/*'));

    $exceptions->render(function (NotFoundHttpException $e, Request $request) {
        if ($request->is('api/*')) {
            return response()->json(['message' => 'Recurso no encontrado.'], 404);
        }
    });
})
```

En producción, con `APP_DEBUG=false`, Laravel nunca muestra trazas al cliente.

## Límite de peticiones (rate limiting)

```php
// app/Providers/AppServiceProvider.php
public function boot(): void
{
    RateLimiter::for('api', fn (Request $request) =>
        Limit::perMinute(60)->by($request->user()?->id ?: $request->ip())
    );

    RateLimiter::for('login', fn (Request $request) =>
        Limit::perMinute(5)->by($request->input('email') . '|' . $request->ip())
    );
}
```

Al superar el límite, Laravel devuelve **429** con la cabecera `Retry-After`. El límite en el login frena los ataques de fuerza bruta.

## Versionado

Los clientes (sobre todo las apps móviles, que no se actualizan al instante) dependen de tu formato. Cuando necesites un cambio incompatible:

- Mantén `/api/v1` funcionando y crea `/api/v2` con controladores y resources propios.
- Los cambios **compatibles** (añadir un campo nuevo) no necesitan versión nueva.
- Avisa con antelación antes de retirar una versión, por ejemplo con una cabecera `Deprecation`.

```text
app/Http/Controllers/Api/V1/TaskController.php
app/Http/Controllers/Api/V2/TaskController.php
app/Http/Resources/V1/TaskResource.php
app/Http/Resources/V2/TaskResource.php
```

## Documentación

Una API sin documentación no se usa. Opciones populares en Laravel:

- **Scribe**: genera la documentación leyendo tus rutas, Form Requests y Resources (`php artisan scribe:generate`).
- **Scramble**: genera una especificación **OpenAPI** automáticamente y la muestra en `/docs/api`.

Con una especificación OpenAPI, tus clientes pueden generar código para llamar a la API y probarla desde herramientas como Bruno, Insomnia o Postman.

## Tests de la API

```php
// tests/Feature/Api/TaskTest.php
uses(RefreshDatabase::class);

it('lista solo mis tareas', function () {
    $yo = User::factory()->has(Task::factory()->count(3))->create();
    Task::factory()->count(2)->create();   // de otro usuario

    Sanctum::actingAs($yo);

    $this->getJson('/api/v1/tasks')
        ->assertOk()
        ->assertJsonCount(3, 'data');
});

it('crea una tarea', function () {
    Sanctum::actingAs(User::factory()->create());

    $this->postJson('/api/v1/tasks', ['title' => 'Documentar la API'])
        ->assertCreated()
        ->assertJsonPath('data.title', 'Documentar la API')
        ->assertJsonPath('data.status', 'pending');
});

it('valida el título', function () {
    Sanctum::actingAs(User::factory()->create());

    $this->postJson('/api/v1/tasks', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('title');
});

it('no deja borrar tareas ajenas', function () {
    Sanctum::actingAs(User::factory()->create());
    $ajena = Task::factory()->create();

    $this->deleteJson("/api/v1/tasks/{$ajena->id}")->assertForbidden();
    $this->assertModelExists($ajena);
});

it('exige autenticación', function () {
    $this->getJson('/api/v1/tasks')->assertUnauthorized();
});
```

Más técnicas en [Testing para desarrolladores web](/lecciones/testing).

## Lista de comprobación final

- [ ] URLs con sustantivos en plural y versión (`/api/v1`).
- [ ] Códigos de estado correctos (201 al crear, 204 al borrar, 422 al validar).
- [ ] Validación con Form Requests en todas las escrituras.
- [ ] Resources para controlar el JSON de salida.
- [ ] Policies en cada acción sobre un recurso concreto.
- [ ] Paginación en todos los listados.
- [ ] Rate limiting general y estricto en el login.
- [ ] CORS limitado a los orígenes de tus clientes (`config/cors.php`).
- [ ] Documentación OpenAPI generada.
- [ ] Tests de éxito, validación, 401, 403 y 404.

> **Reto:** añade proyectos a la API (`/api/v1/projects/{project}/tasks`), con miembros que pueden ver las tareas del proyecto pero solo el propietario puede borrarlas. Después, consume la API desde un frontend con [React avanzado](/lecciones/react-avanzado) usando TanStack Query.
