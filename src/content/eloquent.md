# Eloquent ORM a fondo

> Eloquent es el ORM de Laravel: convierte cada tabla en una clase y cada fila en un objeto. Bien usado, hace el código expresivo y seguro; mal usado, genera cientos de consultas sin que te des cuenta. Este curso cubre ambas caras. Necesitas la base de [Primeros pasos con Laravel](/lecciones/laravel) y de [SQL](/lecciones/sql-basico).

## Modelos y convenciones

```bash
php artisan make:model Post -mfs   # modelo + migración + factory + seeder
```

```php
// database/migrations/xxxx_create_posts_table.php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('title');
    $table->string('slug')->unique();
    $table->text('body');
    $table->timestamp('published_at')->nullable()->index();
    $table->timestamps();
});
```

```php
// app/Models/Post.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = ['title', 'slug', 'body', 'published_at'];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }
}
```

Convenciones que Eloquent asume (y que puedes cambiar si hace falta):

| Convención | Valor por defecto |
| --- | --- |
| Tabla | Plural en snake_case del modelo: `Post` → `posts` |
| Clave primaria | `id`, autoincremental |
| Clave foránea | `<modelo>_id`: `user_id` |
| Marcas de tiempo | `created_at` y `updated_at`, gestionadas solas |

### Asignación masiva

`$fillable` indica qué columnas se pueden rellenar con `create()` o `fill()`. Protege frente a que alguien envíe campos que no esperabas, como `is_admin`:

```php
Post::create($request->validated());   // solo entran los campos validados y fillable
```

## Consultas básicas

```php
Post::all();                                   // todos (¡cuidado en tablas grandes!)
Post::find(1);                                 // por id o null
Post::findOrFail(1);                           // por id o 404 automático
Post::where('slug', $slug)->firstOrFail();

Post::query()
    ->whereNotNull('published_at')
    ->where('published_at', '<=', now())
    ->latest('published_at')
    ->take(10)
    ->get();

Post::where('title', 'like', '%laravel%')->count();
Post::whereIn('id', [1, 2, 3])->pluck('title');   // colección solo con los títulos
Post::whereBetween('created_at', [$desde, $hasta])->exists();
```

Crear, actualizar y borrar:

```php
$post = Post::create(['title' => 'Hola', 'slug' => 'hola', 'body' => '…']);

$post->update(['title' => 'Hola, mundo']);

$post->title = 'Otro título';
$post->isDirty('title');   // true: hay cambios sin guardar
$post->save();

$post->delete();

Post::updateOrCreate(['slug' => 'hola'], ['title' => 'Hola']);
Post::firstOrCreate(['slug' => 'nuevo'], ['title' => 'Nuevo', 'body' => '']);
```

Para ver el SQL que genera una consulta: `->toRawSql()` o `->dd()`.

## Relaciones

### Uno a muchos

```php
// app/Models/User.php
public function posts(): HasMany
{
    return $this->hasMany(Post::class);
}

// app/Models/Post.php
public function author(): BelongsTo
{
    return $this->belongsTo(User::class, 'user_id');
}
```

```php
$user->posts;                         // colección (propiedad dinámica)
$user->posts()->where('published_at', '!=', null)->get();  // consulta sobre la relación
$user->posts()->create(['title' => '…', 'slug' => '…', 'body' => '…']); // asigna user_id solo
$post->author->name;
```

### Muchos a muchos

Un post tiene muchas etiquetas y una etiqueta muchos posts. Necesita una tabla intermedia `post_tag` (nombres en singular y orden alfabético):

```php
Schema::create('post_tag', function (Blueprint $table) {
    $table->foreignId('post_id')->constrained()->cascadeOnDelete();
    $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
    $table->primary(['post_id', 'tag_id']);
});

// Post.php
public function tags(): BelongsToMany
{
    return $this->belongsToMany(Tag::class)->withTimestamps();
}
```

```php
$post->tags()->attach($tagId);
$post->tags()->detach($tagId);
$post->tags()->sync([1, 2, 5]);          // deja exactamente esas
$post->tags()->toggle([3]);
```

### Otras relaciones

| Relación | Ejemplo |
| --- | --- |
| `hasOne` / `belongsTo` | Un usuario tiene un perfil |
| `hasManyThrough` | Un país tiene muchos posts a través de sus usuarios |
| `morphMany` / `morphTo` | Comentarios que pueden pertenecer a posts o a vídeos |
| `hasOne(...)->latestOfMany()` | El último pedido de un cliente |

## El problema N+1 y la carga anticipada

Este código parece inocente:

```php
$posts = Post::latest()->take(50)->get();

foreach ($posts as $post) {
    echo $post->author->name;   // ¡una consulta por cada post!
}
```

Ejecuta **51 consultas**: una para los posts y otra por cada autor. Es el problema **N+1**, la causa más común de lentitud en aplicaciones Laravel.

La solución es la **carga anticipada** (*eager loading*) con `with()`:

```php
$posts = Post::with('author')->latest()->take(50)->get();   // 2 consultas en total
```

```php
Post::with(['author', 'tags', 'comments.author'])->get();     // relaciones anidadas
Post::with(['comments' => fn ($q) => $q->latest()->limit(3)])->get();
Post::withCount('comments')->get();     // $post->comments_count sin cargar los comentarios
Post::withSum('lineas', 'importe')->get();
$post->load('tags');                    // carga diferida sobre un modelo ya obtenido
```

Haz que Laravel te avise en desarrollo cuando olvides el `with()`:

```php
// app/Providers/AppServiceProvider.php
public function boot(): void
{
    Model::preventLazyLoading(! app()->isProduction());
}
```

> **Consejo:** instala Laravel Debugbar o Telescope en local. Ver el número de consultas de cada página es la forma más rápida de detectar problemas N+1.

## Filtrar por relaciones

```php
// Usuarios que tienen al menos un post publicado
User::whereHas('posts', fn ($q) => $q->whereNotNull('published_at'))->get();

// Usuarios sin posts
User::doesntHave('posts')->get();

// Posts con la etiqueta "laravel"
Post::whereRelation('tags', 'name', 'laravel')->get();
```

## Scopes: consultas con nombre

Un **scope** encapsula una condición reutilizable:

```php
// Post.php
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

#[Scope]
protected function published(Builder $query): void
{
    $query->whereNotNull('published_at')->where('published_at', '<=', now());
}

#[Scope]
protected function byAuthor(Builder $query, User $user): void
{
    $query->where('user_id', $user->id);
}
```

```php
Post::published()->byAuthor($user)->latest()->paginate(15);
```

> **Nota:** en versiones anteriores de Laravel los scopes se escriben como métodos `scopePublished(Builder $query)`. Ambas formas funcionan; se usan igual.

Un **scope global** se aplica a todas las consultas del modelo (por ejemplo, filtrar por el equipo del usuario en una aplicación multi-tenant). `SoftDeletes` usa uno para ocultar los registros borrados.

## Accessors, mutators y casts

Los **casts** convierten tipos automáticamente al leer y escribir:

```php
protected function casts(): array
{
    return [
        'published_at' => 'datetime',
        'is_featured' => 'boolean',
        'settings' => 'array',               // JSON en la base de datos, array en PHP
        'status' => PostStatus::class,       // enum de PHP
        'password' => 'hashed',
    ];
}
```

Los **accessors y mutators** transforman un atributo:

```php
use Illuminate\Database\Eloquent\Casts\Attribute;

protected function title(): Attribute
{
    return Attribute::make(
        get: fn (string $value) => ucfirst($value),
        set: fn (string $value) => trim($value),
    );
}

protected function readingTime(): Attribute
{
    return Attribute::get(fn () => max(1, (int) ceil(str_word_count($this->body) / 200)));
}
```

```php
$post->reading_time;   // atributo calculado
```

## Eventos y observers

Eloquent lanza eventos en el ciclo de vida del modelo: `creating`, `created`, `updating`, `updated`, `deleting`, `deleted`…

```php
// Generar el slug automáticamente
protected static function booted(): void
{
    static::creating(function (Post $post) {
        $post->slug ??= Str::slug($post->title);
    });
}
```

Para lógica más extensa, un **observer**:

```bash
php artisan make:observer PostObserver --model=Post
```

```php
#[ObservedBy(PostObserver::class)]
class Post extends Model { /* … */ }

class PostObserver
{
    public function updated(Post $post): void
    {
        if ($post->wasChanged('published_at') && $post->published_at) {
            Cache::forget('home.posts');
        }
    }
}
```

> **Atención:** los eventos no se disparan con actualizaciones masivas como `Post::where(...)->update([...])`, porque no se cargan los modelos. Tenlo en cuenta si dependes de ellos.

## Paginación y grandes volúmenes

```php
Post::published()->paginate(15);          // con total de páginas (hace un COUNT)
Post::published()->simplePaginate(15);    // solo "anterior / siguiente"
Post::published()->cursorPaginate(15);    // el más eficiente en tablas enormes
```

Para procesar muchas filas sin agotar la memoria:

```php
Post::where('published_at', '<', now()->subYear())
    ->chunkById(500, function ($posts) {
        foreach ($posts as $post) {
            $post->archive();
        }
    });

foreach (User::lazy() as $user) {        // cursor perezoso
    // …
}
```

## Borrado lógico y transacciones

```php
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use SoftDeletes;   // necesita la columna deleted_at: $table->softDeletes();
}
```

```php
$post->delete();               // rellena deleted_at; desaparece de las consultas normales
Post::withTrashed()->find(1);
$post->restore();
$post->forceDelete();
```

Agrupa operaciones que deben ir juntas en una **transacción**:

```php
DB::transaction(function () use ($cart, $user) {
    $order = $user->orders()->create(['total' => $cart->total()]);
    foreach ($cart->items as $item) {
        $order->lines()->create($item->toArray());
        $item->product->decrement('stock', $item->quantity);
    }
});
```

Si algo lanza una excepción dentro, se deshace todo.

## Factories y seeders

Las **factories** generan datos de prueba realistas:

```php
// database/factories/PostFactory.php
public function definition(): array
{
    $title = fake()->sentence();
    return [
        'user_id' => User::factory(),
        'title' => $title,
        'slug' => Str::slug($title) . '-' . fake()->unique()->numberBetween(1, 99999),
        'body' => fake()->paragraphs(5, true),
        'published_at' => fake()->optional()->dateTimeBetween('-1 year'),
    ];
}

public function published(): static
{
    return $this->state(fn () => ['published_at' => now()->subDay()]);
}
```

```php
User::factory()
    ->has(Post::factory()->count(5)->published())
    ->create();
```

Son la base de los tests (ver [Testing para desarrolladores web](/lecciones/testing)) y de los seeders para tener una base de datos de desarrollo con contenido.

## Buenas prácticas

- **Siempre `with()`** cuando vayas a recorrer relaciones. Activa `preventLazyLoading` en desarrollo.
- **Selecciona solo lo necesario** en listados grandes: `->select(['id', 'title', 'slug'])`.
- **Índices** en las columnas por las que filtras y ordenas, empezando por las claves foráneas.
- **No metas lógica de negocio compleja en el modelo**: si crece, llévala a clases de acción o servicios.
- **Valida antes de guardar** con Form Requests; `$fillable` es una segunda barrera, no la primera.
- **`firstOrFail()` / `findOrFail()`** en controladores: devuelven un 404 limpio.

> **Reto:** construye un blog con usuarios, posts, etiquetas y comentarios. Crea una página de inicio que muestre los 10 últimos posts con autor, etiquetas y número de comentarios en **3 consultas como máximo**. Compruébalo con Debugbar.

Sigue con [APIs REST con Laravel](/lecciones/apis-rest).
