# Laravel + Inertia + React

> Inertia.js une un backend clásico de Laravel con un frontend de React sin tener que construir una API aparte. Tus controladores siguen devolviendo "páginas", pero esas páginas son componentes de React. En este curso montarás una aplicación full stack completa: rutas, páginas, formularios con validación, datos compartidos, autenticación, paginación y tests.

## Qué problema resuelve Inertia

Hay dos formas clásicas de hacer una aplicación web con Laravel:

| | Blade (servidor) | SPA + API |
| --- | --- | --- |
| Quién pinta el HTML | Laravel | React en el navegador |
| Rutas | `routes/web.php` | Duplicadas: API + router del frontend |
| Autenticación | Sesión y cookies, sencillo | Tokens, CORS, más complejo |
| Experiencia | Recarga la página en cada clic | Fluida, sin recargas |

Inertia toma lo mejor de cada una: **las rutas, los controladores, la validación y la sesión siguen en Laravel**, y **la interfaz es React**, con navegación sin recargas.

¿Cómo funciona?

1. La primera visita devuelve un HTML normal con el componente inicial y sus datos (props) en JSON.
2. Al pulsar un enlace de Inertia, el navegador hace una petición `fetch` con la cabecera `X-Inertia`.
3. Laravel responde con un JSON: `{ component: 'Tareas/Index', props: {...}, url: '/tareas' }`.
4. Inertia cambia el componente de React en pantalla y actualiza la URL. Sin recargar.

> **Nota:** para seguir este curso necesitas la base de [Primeros pasos con Laravel](/lecciones/laravel) y de [React desde cero](/lecciones/react-basico). Inertia es la pieza que los une.

## Crear el proyecto

La forma más rápida es el instalador de Laravel con el **starter kit de React**, que ya incluye Inertia, React, TypeScript, Tailwind y autenticación:

```bash
composer global require laravel/installer
laravel new mi-app
# Elige el starter kit "React" cuando te lo pregunte
cd mi-app
npm install && npm run build
composer run dev
```

`composer run dev` arranca a la vez el servidor de Laravel, Vite y la cola. Abre `http://localhost:8000`.

### Instalación manual (para entender las piezas)

Si añades Inertia a un proyecto existente, estos son los pasos:

```bash
composer require inertiajs/inertia-laravel
php artisan inertia:middleware
npm install @inertiajs/react react react-dom
npm install -D @vitejs/plugin-react
```

Registra el middleware en `bootstrap/app.php`:

```php
use App\Http\Middleware\HandleInertiaRequests;

->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        HandleInertiaRequests::class,
    ]);
})
```

Crea la vista raíz `resources/views/app.blade.php`. Es el único Blade que necesitas:

```blade
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
```

Y el punto de entrada de React, `resources/js/app.tsx`:

```tsx
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';

createInertiaApp({
    title: (title) => (title ? `${title} — Mi App` : 'Mi App'),
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true });
        return pages[`./Pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
```

`resolve` traduce el nombre que devuelve el controlador (`'Tareas/Index'`) al archivo `resources/js/Pages/Tareas/Index.tsx`.

> **Atención:** en Linux (y en tu servidor) las rutas de archivos distinguen mayúsculas. Si la carpeta es `Pages` y en algún sitio escribes `pages`, funcionará en Windows o macOS y fallará en producción.

## Tu primera página

Un modelo de ejemplo para todo el curso:

```bash
php artisan make:model Tarea -mc
```

```php
// database/migrations/xxxx_create_tareas_table.php
Schema::create('tareas', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('titulo');
    $table->boolean('hecha')->default(false);
    $table->timestamps();
});
```

La ruta y el controlador:

```php
// routes/web.php
use App\Http\Controllers\TareaController;

Route::middleware('auth')->group(function () {
    Route::get('/tareas', [TareaController::class, 'index'])->name('tareas.index');
});
```

```php
// app/Http/Controllers/TareaController.php
use Inertia\Inertia;

public function index(Request $request)
{
    return Inertia::render('Tareas/Index', [
        'tareas' => $request->user()->tareas()
            ->latest()
            ->get(['id', 'titulo', 'hecha']),
    ]);
}
```

La página de React recibe esos datos como props:

```tsx
// resources/js/Pages/Tareas/Index.tsx
import { Head } from '@inertiajs/react';

interface Tarea {
    id: number;
    titulo: string;
    hecha: boolean;
}

export default function Index({ tareas }: { tareas: Tarea[] }) {
    return (
        <>
            <Head title="Mis tareas" />
            <h1 className="text-2xl font-bold">Mis tareas</h1>
            <ul className="mt-4 space-y-2">
                {tareas.map((t) => (
                    <li key={t.id} className={t.hecha ? 'line-through text-gray-400' : ''}>
                        {t.titulo}
                    </li>
                ))}
            </ul>
        </>
    );
}
```

No hay `fetch`, ni `useEffect`, ni estado de carga: los datos llegan listos desde el controlador.

> **Importante:** todo lo que pasas como prop acaba en el HTML de la página y cualquiera puede verlo con "Ver código fuente". Selecciona siempre las columnas (`get(['id', 'titulo', 'hecha'])`) o usa API Resources. Nunca envíes un modelo entero con campos sensibles.

## Navegación con Link

Para navegar sin recargar la página usa `Link` en lugar de `<a>`:

```tsx
import { Link } from '@inertiajs/react';

<nav className="flex gap-4">
    <Link href="/tareas">Tareas</Link>
    <Link href="/perfil" prefetch>Perfil</Link>
</nav>
```

`Link` también puede hacer peticiones con otros métodos HTTP:

```tsx
<Link href={`/tareas/${tarea.id}`} method="delete" as="button" preserveScroll>
    Borrar
</Link>
```

Para navegar desde código usa el objeto `router`:

```tsx
import { router } from '@inertiajs/react';

router.visit('/tareas');
router.patch(`/tareas/${id}`, { hecha: true }, { preserveScroll: true });
router.delete(`/tareas/${id}`, {
    onBefore: () => confirm('¿Seguro que quieres borrar la tarea?'),
});
```

- `preserveScroll` mantiene la posición de la página tras la petición.
- `preserveState` conserva el estado de React de la página (útil en filtros y búsquedas).

## Formularios con useForm

`useForm` es el hook que más usarás. Guarda los datos del formulario, envía la petición, gestiona el estado de envío y recoge los errores de validación de Laravel:

```tsx
import { useForm } from '@inertiajs/react';

export function FormularioTarea() {
    const { data, setData, post, processing, errors, reset } = useForm({
        titulo: '',
    });

    function enviar(e: React.FormEvent) {
        e.preventDefault();
        post('/tareas', {
            preserveScroll: true,
            onSuccess: () => reset('titulo'),
        });
    }

    return (
        <form onSubmit={enviar} className="flex gap-2">
            <div className="flex-1">
                <input
                    value={data.titulo}
                    onChange={(e) => setData('titulo', e.target.value)}
                    className="w-full rounded border px-3 py-2"
                    placeholder="Nueva tarea"
                    aria-invalid={!!errors.titulo}
                />
                {errors.titulo && <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>}
            </div>
            <button disabled={processing} className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50">
                {processing ? 'Guardando…' : 'Añadir'}
            </button>
        </form>
    );
}
```

En Laravel validas exactamente igual que con Blade y rediriges:

```php
// routes/web.php (dentro del grupo auth)
Route::post('/tareas', [TareaController::class, 'store'])->name('tareas.store');
Route::patch('/tareas/{tarea}', [TareaController::class, 'update'])->name('tareas.update');
Route::delete('/tareas/{tarea}', [TareaController::class, 'destroy'])->name('tareas.destroy');
```

```php
public function store(Request $request)
{
    $datos = $request->validate([
        'titulo' => ['required', 'string', 'max:255'],
    ]);

    $request->user()->tareas()->create($datos);

    return back()->with('success', 'Tarea creada');
}
```

Si la validación falla, Laravel redirige de vuelta e Inertia coloca los mensajes en `errors` automáticamente. Si va bien, la página se recarga con las nuevas props y la tarea aparece en la lista.

> **Consejo:** para formularios grandes, mueve la validación a un Form Request (`php artisan make:request StoreTareaRequest`). El controlador queda más limpio y las reglas se pueden testear por separado.

## Autorización: que cada uno toque solo lo suyo

Un error muy común: comprobar el login pero no el **dueño** del recurso. Si `update` hace `Tarea::find($id)->update(...)`, cualquier usuario conectado puede modificar tareas ajenas cambiando el id en la petición.

Crea una policy:

```bash
php artisan make:policy TareaPolicy --model=Tarea
```

```php
// app/Policies/TareaPolicy.php
public function update(User $user, Tarea $tarea): bool
{
    return $tarea->user_id === $user->id;
}

public function delete(User $user, Tarea $tarea): bool
{
    return $tarea->user_id === $user->id;
}
```

Y úsala en el controlador:

```php
use Illuminate\Support\Facades\Gate;

public function update(Request $request, Tarea $tarea)
{
    Gate::authorize('update', $tarea);

    $tarea->update($request->validate(['hecha' => ['required', 'boolean']]));

    return back();
}

public function destroy(Tarea $tarea)
{
    Gate::authorize('delete', $tarea);
    $tarea->delete();

    return back()->with('success', 'Tarea borrada');
}
```

> **Atención:** ocultar el botón "Borrar" en React no protege nada. La comprobación de permisos tiene que estar siempre en el servidor. Más ejemplos en [Seguridad básica en la web](/lecciones/seguridad-web).

## Datos compartidos: usuario y mensajes flash

Hay datos que necesitan todas las páginas: el usuario conectado, los mensajes flash, el nombre de la app. Se definen una sola vez en el middleware `HandleInertiaRequests`:

```php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'auth' => [
            'user' => $request->user()?->only('id', 'name', 'email'),
        ],
        'flash' => [
            'success' => fn () => $request->session()->get('success'),
        ],
    ];
}
```

Las funciones (`fn () => ...`) se evalúan solo cuando hacen falta, así que no cuestan nada si no se usan.

En React se leen con `usePage`. Lo normal es usarlos en un layout común:

```tsx
// resources/js/Layouts/AppLayout.tsx
import { Link, usePage } from '@inertiajs/react';

interface PageProps {
    auth: { user: { id: number; name: string; email: string } | null };
    flash: { success: string | null };
    [key: string]: unknown;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { auth, flash } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
                <Link href="/" className="font-bold">Mi App</Link>
                {auth.user ? (
                    <div className="flex items-center gap-4">
                        <span>{auth.user.name}</span>
                        <Link href="/logout" method="post" as="button">Salir</Link>
                    </div>
                ) : (
                    <Link href="/login">Entrar</Link>
                )}
            </header>
            {flash.success && (
                <p role="status" className="bg-green-100 px-6 py-3 text-green-800">{flash.success}</p>
            )}
            <main className="mx-auto max-w-3xl p-6">{children}</main>
        </div>
    );
}
```

Para que el layout **no se vuelva a montar** al cambiar de página (y conserve, por ejemplo, el estado de un menú), asígnalo como layout persistente:

```tsx
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ tareas }: { tareas: Tarea[] }) { /* ... */ }

Index.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
```

## Paginación, filtros y recargas parciales

Laravel pagina y Inertia pasa el resultado tal cual:

```php
public function index(Request $request)
{
    $buscar = $request->string('buscar')->toString();

    return Inertia::render('Tareas/Index', [
        'tareas' => $request->user()->tareas()
            ->when($buscar, fn ($q) => $q->where('titulo', 'like', "%{$buscar}%"))
            ->latest()
            ->paginate(10, ['id', 'titulo', 'hecha'])
            ->withQueryString(),
        'filtros' => ['buscar' => $buscar],
    ]);
}
```

El paginador llega a React como un objeto con `data` (los elementos) y `links` (los enlaces de página):

```tsx
interface Paginado<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
}

function Paginacion({ links }: { links: Paginado<unknown>['links'] }) {
    return (
        <nav className="mt-6 flex flex-wrap gap-1" aria-label="Paginación">
            {links.map((l, i) =>
                l.url ? (
                    <Link
                        key={i}
                        href={l.url}
                        preserveScroll
                        className={`rounded px-3 py-1 ${l.active ? 'bg-indigo-600 text-white' : 'bg-white'}`}
                        dangerouslySetInnerHTML={{ __html: l.label }}
                    />
                ) : (
                    <span key={i} className="px-3 py-1 text-gray-400" dangerouslySetInnerHTML={{ __html: l.label }} />
                ),
            )}
        </nav>
    );
}
```

> **Nota:** aquí `dangerouslySetInnerHTML` es aceptable porque las etiquetas (`&laquo; Anterior`, números) las genera Laravel, no el usuario.

Un buscador que actualiza la URL sin perder el foco del input:

```tsx
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function Buscador({ inicial }: { inicial: string }) {
    const [buscar, setBuscar] = useState(inicial);

    useEffect(() => {
        if (buscar === inicial) return;
        const id = setTimeout(() => {
            router.get('/tareas', { buscar }, { preserveState: true, replace: true, only: ['tareas', 'filtros'] });
        }, 300);
        return () => clearTimeout(id);
    }, [buscar]);

    return <input value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Buscar tarea…" />;
}
```

- El `setTimeout` evita lanzar una petición por cada tecla (*debounce*).
- `only: ['tareas', 'filtros']` es una **recarga parcial**: Laravel solo calcula esas props. Para que funcione con props costosas, pásalas como función en el controlador (`'estadisticas' => fn () => ...`); así no se calculan si no se piden.
- `replace: true` evita llenar el historial del navegador con cada búsqueda.

## Tests de páginas Inertia

Laravel incluye aserciones específicas para Inertia. Comprueban qué componente se renderiza y con qué props, sin abrir un navegador:

```php
// tests/Feature/TareaTest.php
use App\Models\Tarea;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

public function test_el_usuario_ve_solo_sus_tareas(): void
{
    $ana = User::factory()->create();
    $otro = User::factory()->create();
    Tarea::factory()->count(3)->for($ana)->create();
    Tarea::factory()->count(2)->for($otro)->create();

    $this->actingAs($ana)
        ->get('/tareas')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Tareas/Index')
            ->has('tareas.data', 3)
            ->has('tareas.data.0', fn (Assert $tarea) => $tarea
                ->hasAll(['id', 'titulo', 'hecha'])
            )
        );
}

public function test_no_se_puede_borrar_una_tarea_ajena(): void
{
    $tarea = Tarea::factory()->create();

    $this->actingAs(User::factory()->create())
        ->delete("/tareas/{$tarea->id}")
        ->assertForbidden();

    $this->assertModelExists($tarea);
}

public function test_crear_tarea_valida_el_titulo(): void
{
    $this->actingAs(User::factory()->create())
        ->post('/tareas', ['titulo' => ''])
        ->assertSessionHasErrors('titulo');
}
```

`hasAll` con la lista exacta de campos también te protege de enviar columnas de más por accidente. Más sobre tests en [Testing para desarrolladores web](/lecciones/testing).

## Despliegue

Antes de subir a producción:

```bash
composer install --no-dev --optimize-autoloader
npm ci && npm run build
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Lista de comprobación:

- `APP_ENV=production` y `APP_DEBUG=false`. Con el debug activado, un error muestra variables de entorno y rutas internas.
- `APP_KEY` generada (`php artisan key:generate`) y guardada fuera del repositorio.
- Los archivos de `public/build` se generan en el servidor o en el CI, no se suben al repositorio.
- Si cambias los assets, Inertia detecta la nueva versión y fuerza una recarga completa para que nadie se quede con el JavaScript antiguo (lo controla el método `version()` del middleware).

> **Consejo:** empaqueta la aplicación con [Docker](/lecciones/docker) y automatiza los tests y el despliegue con [GitHub Actions](/lecciones/github-actions). Es justo lo que se espera de un perfil full stack.

> **Nota:** Inertia admite **SSR** (renderizado en el servidor con Node) si necesitas que los buscadores vean el contenido sin ejecutar JavaScript. Para paneles privados y aplicaciones con login normalmente no hace falta.

## Proyecto: gestor de tareas full stack

Construye la aplicación completa paso a paso:

1. Proyecto con el starter kit de React (registro, login y perfil ya incluidos).
2. Modelo `Tarea` con migración, factory y relación `User hasMany Tarea`.
3. Página de listado con paginación de 10 en 10, buscador con debounce y filtro "Todas / Pendientes / Hechas" en la URL.
4. Formulario de creación con `useForm`, validación en un Form Request y mensaje flash de éxito.
5. Marcar como hecha y borrar con `router.patch` y `Link method="delete"`, protegidos con una policy.
6. Layout persistente con el usuario conectado y los mensajes flash.
7. Al menos 6 tests de feature: listado, creación, validación, actualización, borrado y acceso denegado a tareas ajenas.

> **Ejercicio:** abre las herramientas de desarrollo del navegador, pestaña Red, y observa la respuesta JSON de Inertia al navegar entre páginas. Comprueba que no viaja ningún campo que no uses en la interfaz.

> **Reto:** añade un panel de administración con un rol `admin` (middleware + policy) que muestre estadísticas de todos los usuarios, cargadas como prop diferida con `Inertia::defer(fn () => ...)` para que la página aparezca al instante y las cifras lleguen después.
