import LessonLayout from '@/layouts/LessonLayout';
import { Head, Link } from '@inertiajs/react';

const modules = [
    { id: '/lecciones/laravel', title: 'Instalación y estructura', free: true },
    { id: '/lecciones/laravel#rutas', title: 'Rutas', free: true },
    { id: '/lecciones/laravel#controladores', title: 'Controladores', free: true },
    { id: '/lecciones/laravel#eloquent', title: 'Eloquent básico', free: true },
    { id: '/lecciones/laravel#blade', title: 'Vistas con Blade', free: true },
    { id: '/lecciones/laravel#auth', title: 'Autenticación', free: true },
    { id: '/lecciones/laravel#avanzado', title: 'Eloquent avanzado', free: false },
    { id: '/lecciones/laravel#apis', title: 'APIs REST', free: false },
];

export default function LaravelPrimeros() {
    return (
        <LessonLayout
            title="Primeros pasos con Laravel"
            description="Crea tu primera aplicación web con el framework PHP más popular. Rutas, controladores, Eloquent y Blade."
            duration="3h 15min"
            lessons={18}
            level="Básico"
            premium={false}
            modules={modules}
            activeModule="/lecciones/laravel"
            prevHref="/lecciones/shell-scripting"
            nextHref="/lecciones/seguridad-web"
            category="PHP / Laravel"
        >
            <Head>
                <title>Primeros pasos con Laravel 13 — Aprende a Programar</title>
                <meta name="description" content="Aprende Laravel 13 desde cero: instalación, rutas, controladores, Eloquent ORM y Blade. Gratis y actualizado a 2026." />
            </Head>

            <h1>Primeros pasos con Laravel 13</h1>

            <blockquote>
                Laravel es el framework PHP más descargado del mundo. La versión 13, lanzada el <strong>17 de marzo de 2026</strong>, requiere PHP 8.3+ e introduce el AI SDK nativo, PHP Attributes para rutas y controladores, y JSON:API de primera clase.
            </blockquote>

            <h2>¿Por qué Laravel?</h2>
            <ul>
                <li><strong>Productividad</strong> — de la idea al producto en horas, no semanas</li>
                <li><strong>Ecosistema completo</strong> — auth, queues, mail, events, cache, broadcast incluidos</li>
                <li><strong>Seguridad por defecto</strong> — CSRF, XSS, SQL injection, encriptación</li>
                <li><strong>Comunidad</strong> — la más grande del ecosistema PHP</li>
                <li><strong>Documentación</strong> — la mejor de cualquier framework PHP</li>
            </ul>

            <h2>Instalación</h2>

            <h3>Requisitos previos</h3>
            <pre><code>{`php --version         # PHP 8.3+ (requerido por Laravel 13)
composer --version    # Gestor de dependencias PHP
node --version        # Node.js 20+ para assets con Vite`}</code></pre>

            <h3>Crear proyecto</h3>
            <pre><code>{`# Método recomendado (Laravel Installer)
composer global require laravel/installer
laravel new mi-app

# Alternativa directa con Composer
composer create-project laravel/laravel mi-app

# Arrancar servidor de desarrollo
cd mi-app
php artisan serve
# ✅ http://localhost:8000`}</code></pre>

            <h3>Estructura del proyecto</h3>
            <pre><code>{`mi-app/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # Lógica de la aplicación
│   │   └── Middleware/      # Filtros de peticiones HTTP
│   └── Models/              # Modelos Eloquent
├── config/                  # Configuraciones
├── database/
│   ├── migrations/          # Esquemas de base de datos
│   ├── factories/           # Datos de prueba
│   └── seeders/             # Pobladores de BD
├── public/                  # Punto de entrada web (index.php)
├── resources/
│   ├── css/ js/             # Assets frontend
│   └── views/               # Plantillas Blade
├── routes/
│   ├── web.php              # Rutas web (con sesiones, CSRF)
│   └── api.php              # Rutas API (sin estado)
├── storage/                 # Logs, caché, uploads
├── tests/                   # Tests unitarios y de feature
├── .env                     # Variables de entorno (NO al repositorio)
└── artisan                  # CLI de Laravel`}</code></pre>

            <h3>Configurar .env</h3>
            <pre><code>{`APP_NAME=MiApp
APP_ENV=local
APP_KEY=                     # Se genera con: php artisan key:generate
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mi_app
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525`}</code></pre>

            <h2 id="rutas">Rutas</h2>
            <p>Las rutas definen qué hace tu app cuando llega una petición HTTP. Se definen en <code>routes/web.php</code>.</p>

            <h3>Tipos de rutas</h3>
            <pre><code>{`use App\Http\Controllers\PostController;

// Rutas básicas
Route::get('/', fn() => view('welcome'));
Route::get('/about', fn() => 'Sobre nosotros');

// Rutas con parámetros
Route::get('/posts/{id}', fn(int $id) => "Post $id");
Route::get('/posts/{id?}', fn(?int $id = null) => $id ?? 'todos');

// Rutas de recursos (CRUD completo en una línea)
Route::resource('posts', PostController::class);

// Rutas con nombre (para generar URLs)
Route::get('/dashboard', [PostController::class, 'index'])->name('dashboard');
echo route('dashboard');  // http://localhost:8000/dashboard

// Agrupación con middleware y prefijo
Route::middleware('auth')->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'users']);
    Route::get('/stats', [AdminController::class, 'stats']);
});

// Laravel 13: PHP Attributes en controladores (nueva forma)
// Ya no necesitas declararlas en web.php si usas atributos`}</code></pre>

            <h2 id="controladores">Controladores</h2>
            <pre><code>{`# Crear controlador
php artisan make:controller PostController

# Con todos los métodos CRUD
php artisan make:controller PostController --resource`}</code></pre>

            <pre><code>{`<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::latest()->paginate(10);
        return view('posts.index', compact('posts'));
    }

    public function show(Post $post)   // Route Model Binding automático
    {
        return view('posts.show', compact('post'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body'  => 'required|string',
        ]);

        $post = Post::create($validated + ['user_id' => auth()->id()]);

        return redirect()->route('posts.show', $post)
                         ->with('success', 'Post creado correctamente');
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);   // Policy de autorización
        $post->delete();
        return back()->with('success', 'Post eliminado');
    }
}`}</code></pre>

            <h3>PHP Attributes en Laravel 13 (nueva funcionalidad)</h3>
            <pre><code>{`<?php

use Illuminate\Routing\Attributes\Get;
use Illuminate\Routing\Attributes\Post as PostRoute;
use Illuminate\Routing\Attributes\Middleware;

#[Middleware('auth')]
class PostController extends Controller
{
    #[Get('/posts', name: 'posts.index')]
    public function index()
    {
        return view('posts.index', ['posts' => Post::paginate(10)]);
    }

    #[Get('/posts/{post}', name: 'posts.show')]
    public function show(Post $post)
    {
        return view('posts.show', compact('post'));
    }

    #[PostRoute('/posts', name: 'posts.store')]
    public function store(Request $request) { /* ... */ }
}`}</code></pre>

            <h2 id="eloquent">Eloquent ORM básico</h2>
            <pre><code>{`# Crear modelo con migración
php artisan make:model Post -m`}</code></pre>

            <pre><code>{`<?php
// database/migrations/xxxx_create_posts_table.php

Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('title');
    $table->string('slug')->unique();
    $table->text('body');
    $table->boolean('published')->default(false);
    $table->timestamp('published_at')->nullable();
    $table->timestamps();    // created_at y updated_at automáticos
});`}</code></pre>

            <pre><code>{`<?php
// app/Models/Post.php

class Post extends Model
{
    protected $fillable = ['title', 'slug', 'body', 'published', 'user_id'];

    protected $casts = [
        'published'    => 'boolean',
        'published_at' => 'datetime',
    ];

    // Relaciones
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    // Scope
    public function scopePublished(Builder $query): void
    {
        $query->where('published', true)->whereNotNull('published_at');
    }
}`}</code></pre>

            <pre><code>{`# Ejecutar migraciones
php artisan migrate

# Revertir última migración
php artisan migrate:rollback

# Rehacer todo (cuidado en producción)
php artisan migrate:fresh --seed`}</code></pre>

            <h3>CRUD con Eloquent</h3>
            <pre><code>{`// Leer
$posts = Post::all();
$post  = Post::find(1);
$post  = Post::findOrFail(1);       // Lanza 404 si no existe
$posts = Post::published()->get();  // Usar scope
$posts = Post::where('user_id', auth()->id())
             ->orderBy('created_at', 'desc')
             ->paginate(10);

// Crear
$post = Post::create([
    'title'   => 'Mi primer post',
    'slug'    => Str::slug('Mi primer post'),
    'body'    => 'Contenido...',
    'user_id' => auth()->id(),
]);

// Actualizar
$post->update(['title' => 'Nuevo título']);
$post->title = 'Otro título';
$post->save();

// Eliminar
$post->delete();
Post::where('published', false)->delete(); // Bulk delete`}</code></pre>

            <h2 id="blade">Vistas con Blade</h2>
            <pre><code>{`{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'Mi App')</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    @include('partials.nav')

    <main>
        @if(session('success'))
            <div class="alert-success">{{ session('success') }}</div>
        @endif

        @yield('content')
    </main>

    @stack('scripts')
</body>
</html>`}</code></pre>

            <pre><code>{`{{-- resources/views/posts/index.blade.php --}}
@extends('layouts.app')

@section('title', 'Posts')

@section('content')
    <h1>Posts</h1>

    {{-- Directivas de control --}}
    @forelse($posts as $post)
        <article>
            <h2>{{ $post->title }}</h2>         {{-- Escapado automático XSS --}}
            <p>{{ $post->body }}</p>
            <small>Por {{ $post->user->name }}</small>

            @auth
                @if(auth()->id() === $post->user_id)
                    <a href="{{ route('posts.edit', $post) }}">Editar</a>

                    <form action="{{ route('posts.destroy', $post) }}" method="POST">
                        @csrf
                        @method('DELETE')
                        <button type="submit">Eliminar</button>
                    </form>
                @endif
            @endauth
        </article>
    @empty
        <p>No hay posts todavía.</p>
    @endforelse

    {{-- Paginación automática --}}
    {{ $posts->links() }}
@endsection`}</code></pre>

            <h2 id="auth">Autenticación con Laravel Breeze</h2>
            <pre><code>{`# Instalar Breeze (auth mínima: login, registro, reseteo de contraseña)
composer require laravel/breeze --dev
php artisan breeze:install

# Opciones de stack:
# blade     → Blade puro
# react     → React + Inertia
# vue       → Vue + Inertia
# api       → Solo API (para SPAs externas)
# livewire  → Livewire + Alpine.js

php artisan migrate
npm install && npm run dev`}</code></pre>

            <pre><code>{`{{-- Proteger rutas con middleware --}}

// En routes/web.php
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
});

// En el controlador
public function index()
{
    $user = auth()->user();      // Usuario autenticado
    $userId = auth()->id();      // Solo el ID
    return view('dashboard', compact('user'));
}`}</code></pre>

            <h2>Comandos Artisan esenciales</h2>
            <pre><code>{`php artisan make:model Post -m         # Modelo + migración
php artisan make:controller PostController --resource
php artisan make:middleware CheckAge
php artisan make:request StorePostRequest
php artisan make:seeder PostSeeder
php artisan make:factory PostFactory

php artisan migrate                    # Ejecutar migraciones
php artisan migrate:fresh --seed       # Resetear y popular BD
php artisan db:seed                    # Solo ejecutar seeders

php artisan route:list                 # Ver todas las rutas
php artisan tinker                     # Consola interactiva

php artisan cache:clear
php artisan config:cache               # Cachear configuración (producción)
php artisan route:cache                # Cachear rutas (producción)
php artisan view:cache                 # Cachear vistas (producción)

php artisan health                     # Health check (nuevo en v12+)`}</code></pre>

            <h2>Próximos pasos</h2>
            <p>
                Con esta base puedes crear aplicaciones web completas. Para seguir avanzando, continúa con <Link href="/lecciones/eloquent">Eloquent ORM a fondo</Link> (relaciones, scopes, eager loading), <Link href="/lecciones/apis-rest">APIs REST con Laravel</Link> (validación, recursos, Sanctum y versionado) y <Link href="/lecciones/ia-programacion">Programación con IA</Link>.
            </p>
        </LessonLayout>
    );
}
