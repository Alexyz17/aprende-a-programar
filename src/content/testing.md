# Testing para desarrolladores web

> Un test es código que comprueba que otro código hace lo que debe. Los tests te permiten cambiar cosas sin miedo, detectan errores antes que tus usuarios y son una de las primeras cosas que mira un equipo técnico al revisar tu trabajo.

## Por qué escribir tests

Sin tests, cada cambio es una apuesta: arreglas una cosa y rompes otra sin darte cuenta. Con tests:

- **Detectas errores al momento**, no semanas después en producción.
- **Refactorizas con confianza**: si los tests siguen en verde, el comportamiento no ha cambiado.
- **Documentas el comportamiento**: un buen test explica cómo se usa el código y qué casos contempla.
- **Diseñas mejor**: el código difícil de testear suele estar demasiado acoplado.

Un test típico sigue el patrón **AAA**:

```javascript
test('aplica un 10 % de descuento a socios', () => {
  // Arrange (preparar)
  const carrito = { total: 100, esSocio: true };
  // Act (actuar)
  const final = calcularTotal(carrito);
  // Assert (comprobar)
  expect(final).toBe(90);
});
```

## Tipos de tests

```text
          /\        E2E: pocos, lentos, prueban el sistema completo
         /  \       en un navegador real
        /----\
       /      \     Integración: varias piezas juntas
      /--------\    (API + base de datos, componente + estado)
     /          \
    /------------\  Unitarios: muchos, rápidos, una función o clase aislada
```

| Tipo | Qué prueba | Velocidad | Herramientas |
| --- | --- | --- | --- |
| Unitario | Una función o clase | Milisegundos | Vitest, Jest, PHPUnit, Pest, pytest |
| Integración | Varias piezas juntas | Segundos | Las mismas + base de datos de pruebas |
| Componente | Un componente de interfaz | Rápido | Testing Library |
| End-to-end (E2E) | Un flujo completo de usuario | Lento | Playwright, Cypress |

No hace falta obsesionarse con la pirámide: lo importante es tener **confianza** en que lo crítico funciona (pagos, login, cálculos, permisos).

## Tests unitarios con Vitest

Vitest es el estándar en proyectos con Vite (React, Vue) y funciona en cualquier proyecto JavaScript o TypeScript.

```bash
npm install -D vitest
```

```javascript
// src/carrito.js
export function calcularTotal({ lineas, cupon }) {
  const subtotal = lineas.reduce((s, l) => s + l.precio * l.cantidad, 0);
  if (cupon === 'BIENVENIDA' && subtotal >= 50) return subtotal * 0.9;
  return subtotal;
}
```

```javascript
// src/carrito.test.js
import { describe, it, expect } from 'vitest';
import { calcularTotal } from './carrito.js';

describe('calcularTotal', () => {
  const lineas = [
    { precio: 20, cantidad: 2 },
    { precio: 15, cantidad: 1 },
  ];

  it('suma precio por cantidad', () => {
    expect(calcularTotal({ lineas })).toBe(55);
  });

  it('aplica el cupón BIENVENIDA a partir de 50 €', () => {
    expect(calcularTotal({ lineas, cupon: 'BIENVENIDA' })).toBeCloseTo(49.5);
  });

  it('ignora el cupón por debajo de 50 €', () => {
    expect(calcularTotal({ lineas: [{ precio: 10, cantidad: 1 }], cupon: 'BIENVENIDA' })).toBe(10);
  });

  it('devuelve 0 con el carrito vacío', () => {
    expect(calcularTotal({ lineas: [] })).toBe(0);
  });
});
```

```bash
npx vitest          # modo vigilancia: repite los tests al guardar
npx vitest run      # una sola ejecución (para CI)
npx vitest run --coverage
```

### Qué casos probar

Para cada función, piensa en:

- El **caso normal** (camino feliz).
- Los **límites**: 0, vacío, el valor justo en el borde (exactamente 50 €).
- Los **errores**: datos inválidos, nulos, negativos.

Matchers más usados:

```javascript
expect(valor).toBe(3);                      // igualdad estricta
expect(objeto).toEqual({ a: 1 });           // igualdad profunda
expect(lista).toContain('ana');
expect(texto).toMatch(/error/i);
expect(() => dividir(1, 0)).toThrow('No se puede dividir entre cero');
await expect(promesa).rejects.toThrow();
```

## Mocks y dobles de prueba

Un test unitario no debería llamar a una API real, enviar emails ni depender de la hora actual. Para eso se usan **dobles**:

```javascript
import { vi, it, expect, beforeEach, afterEach } from 'vitest';
import { saludoSegunHora, notificarPedido } from './servicios.js';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it('saluda por la mañana', () => {
  vi.setSystemTime(new Date('2026-10-12T09:00:00'));
  expect(saludoSegunHora()).toBe('Buenos días');
});

it('envía un email al confirmar el pedido', async () => {
  const mailer = { enviar: vi.fn().mockResolvedValue(true) };
  await notificarPedido({ id: 7, email: 'ana@ejemplo.com' }, mailer);
  expect(mailer.enviar).toHaveBeenCalledWith('ana@ejemplo.com', expect.stringContaining('#7'));
});
```

Fíjate en que `notificarPedido` **recibe** el mailer como parámetro (inyección de dependencias). Eso es lo que lo hace fácil de testear.

> **Atención:** no abuses de los mocks. Si un test simula todo, acaba comprobando tus mocks en lugar de tu código. Simula solo lo que es lento, caro o no determinista (red, tiempo, azar, servicios externos).

## Tests de componentes React

Testing Library prueba los componentes **como los usa una persona**: buscando textos, etiquetas y roles, no detalles internos.

```bash
npm install -D @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

```javascript
// vitest.config.js
export default { test: { environment: 'jsdom', setupFiles: ['./test/setup.js'] } };
// test/setup.js
import '@testing-library/jest-dom/vitest';
```

```jsx
// Contador.jsx
import { useState } from 'react';
export function Contador({ max = 3 }) {
  const [n, setN] = useState(0);
  return (
    <div>
      <p>Has pulsado {n} veces</p>
      <button onClick={() => setN(n + 1)} disabled={n >= max}>Sumar</button>
    </div>
  );
}
```

```jsx
// Contador.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { it, expect } from 'vitest';
import { Contador } from './Contador';

it('cuenta las pulsaciones y se desactiva al llegar al máximo', async () => {
  const user = userEvent.setup();
  render(<Contador max={2} />);

  const boton = screen.getByRole('button', { name: 'Sumar' });
  await user.click(boton);
  await user.click(boton);

  expect(screen.getByText('Has pulsado 2 veces')).toBeInTheDocument();
  expect(boton).toBeDisabled();
});
```

Buscar por **rol y nombre accesible** tiene un efecto secundario estupendo: si tu test no encuentra el botón, probablemente un lector de pantalla tampoco.

## Tests en PHP con Pest y PHPUnit

Laravel incluye PHPUnit y Pest (una sintaxis más expresiva sobre PHPUnit).

```php
// tests/Unit/PrecioTest.php (Pest)
use App\Support\Precio;

it('añade el IVA', function () {
    expect(Precio::conIva(100))->toBe(121.0);
});

it('no acepta precios negativos', function () {
    Precio::conIva(-5);
})->throws(InvalidArgumentException::class);
```

### Tests de funcionalidad en Laravel

Laravel permite probar rutas completas con una base de datos de pruebas que se reinicia en cada test:

```php
// tests/Feature/TareasTest.php
use App\Models\User;
use App\Models\Tarea;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('obliga a iniciar sesión para ver las tareas', function () {
    $this->getJson('/api/tareas')->assertUnauthorized();
});

it('crea una tarea para el usuario autenticado', function () {
    $usuario = User::factory()->create();

    $this->actingAs($usuario)
        ->postJson('/api/tareas', ['titulo' => 'Escribir tests'])
        ->assertCreated()
        ->assertJsonPath('data.titulo', 'Escribir tests');

    expect($usuario->tareas()->count())->toBe(1);
});

it('impide ver tareas de otros usuarios', function () {
    $tareaAjena = Tarea::factory()->create();

    $this->actingAs(User::factory()->create())
        ->getJson("/api/tareas/{$tareaAjena->id}")
        ->assertForbidden();
});

it('valida el título', function () {
    $this->actingAs(User::factory()->create())
        ->postJson('/api/tareas', ['titulo' => ''])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('titulo');
});
```

```bash
php artisan test
php artisan test --filter=Tareas
php artisan test --coverage
```

Laravel también trae *fakes* para lo externo: `Mail::fake()`, `Queue::fake()`, `Http::fake()`, `Storage::fake()`, `Event::fake()`.

```php
it('envía el email de bienvenida al registrarse', function () {
    Mail::fake();

    $this->post('/register', [
        'name' => 'Ana', 'email' => 'ana@ejemplo.com',
        'password' => 'secreto123', 'password_confirmation' => 'secreto123',
    ]);

    Mail::assertSent(BienvenidaMail::class, fn ($mail) => $mail->hasTo('ana@ejemplo.com'));
});
```

## Tests de APIs

La idea es la misma en cualquier tecnología: hacer peticiones HTTP a tu aplicación y comprobar **código de estado**, **cuerpo** y **efectos** (qué cambió en la base de datos).

Casos que todo endpoint debería cubrir:

- Respuesta correcta con datos válidos.
- Error de validación (422) con datos inválidos.
- Sin autenticación (401).
- Sin permiso sobre el recurso (403).
- Recurso inexistente (404).

Ejemplos en Node con `supertest` en [Node.js y Express](/lecciones/node-express).

## Tests end-to-end con Playwright

Playwright controla un navegador real y prueba flujos completos:

```bash
npm init playwright@latest
```

```javascript
// e2e/login.spec.js
import { test, expect } from '@playwright/test';

test('una persona puede iniciar sesión y ver su panel', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Correo electrónico').fill('demo@ejemplo.com');
  await page.getByLabel('Contraseña').fill('demo1234');
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page).toHaveURL(/panel/);
  await expect(page.getByRole('heading', { name: 'Hola, Demo' })).toBeVisible();
});
```

Reserva los E2E para los **flujos críticos** (registro, compra, login): son lentos y más frágiles que los unitarios.

## TDD: primero el test

*Test-Driven Development* es un ciclo corto:

1. **Rojo**: escribe un test para algo que todavía no existe. Falla.
2. **Verde**: escribe el código mínimo para que pase.
3. **Refactoriza**: mejora el código con los tests como red de seguridad.

Ejemplo: validar una contraseña.

```javascript
// 1. Rojo
it('exige al menos 8 caracteres', () => {
  expect(validarPassword('abc')).toEqual({ valida: false, error: 'Mínimo 8 caracteres' });
});

// 2. Verde
export function validarPassword(p) {
  if (p.length < 8) return { valida: false, error: 'Mínimo 8 caracteres' };
  return { valida: true };
}

// 3. Siguiente test (rojo de nuevo)
it('exige al menos un número', () => {
  expect(validarPassword('abcdefgh').valida).toBe(false);
});
```

TDD no es obligatorio, pero es muy útil para lógica con muchas reglas y para corregir bugs: **antes de arreglar un error, escribe un test que lo reproduzca**. Así no vuelve a aparecer.

## Tests en integración continua

Los tests valen poco si nadie los ejecuta. Configura tu repositorio para que se ejecuten en cada push:

```yaml
# .github/workflows/tests.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx vitest run
```

```yaml
# .gitlab-ci.yml
test:
  image: node:22
  script:
    - npm ci
    - npx vitest run
```

Más en [GitHub Actions: CI/CD](/lecciones/github-actions).

## Buenas prácticas

- **Un test, un comportamiento.** Si falla, su nombre debe decirte qué se ha roto.
- **Nombres descriptivos**: "rechaza el pedido sin stock", no "test 3".
- **Tests independientes**: ninguno depende del orden ni del resultado de otro.
- **Deterministas**: nada de fechas reales, azar o red sin controlar.
- **Prueba comportamiento, no implementación**: si cambias cómo funciona por dentro sin cambiar el resultado, los tests no deberían romperse.
- **La cobertura es una pista, no un objetivo.** Un 100 % de cobertura con tests sin `expect` útiles no sirve de nada. Asegura primero lo crítico.

> **Reto:** coge un proyecto tuyo sin tests y escribe cinco: dos unitarios para la lógica más importante, dos de integración para tus endpoints principales y uno E2E para el flujo más crítico. Añádelos a la CI. Es una de las mejoras que más valor aporta a un portfolio.

Practica con [Completa el código React](/juegos/completa-react) y sigue con [GitHub Actions](/lecciones/github-actions).
