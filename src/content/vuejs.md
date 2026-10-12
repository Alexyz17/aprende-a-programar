# Vue.js 3 con Composition API

> Vue es un framework progresivo para construir interfaces: puedes usarlo para una pequeña parte de una página o para una aplicación completa. Destaca por su curva de aprendizaje suave y su excelente documentación. Es muy popular junto a Laravel. Necesitas [JavaScript moderno](/lecciones/javascript-moderno).

## Crear un proyecto

```bash
npm create vue@latest mi-app
# TypeScript: sí · Vue Router: sí · Pinia: sí · Vitest: sí · ESLint: sí
cd mi-app
npm install
npm run dev
```

Estructura principal:

```text
src/
├── main.ts            # punto de entrada
├── App.vue            # componente raíz
├── components/        # componentes reutilizables
├── views/             # páginas (una por ruta)
├── router/index.ts    # rutas
└── stores/            # estado global con Pinia
```

## Componentes de un solo archivo

Un componente `.vue` reúne lógica, plantilla y estilos:

```vue
<!-- src/components/Saludo.vue -->
<script setup lang="ts">
import { ref } from 'vue';

const nombre = ref('mundo');
</script>

<template>
  <label for="nombre">Tu nombre</label>
  <input id="nombre" v-model="nombre" />
  <p>Hola, {{ nombre }}</p>
</template>

<style scoped>
p { font-weight: 600; }
</style>
```

- `<script setup>` es la forma moderna y concisa de escribir componentes con la **Composition API**.
- `{{ }}` muestra valores en la plantilla.
- `v-model` enlaza el campo con la variable en ambos sentidos.
- `scoped` aplica los estilos solo a este componente.

## Reactividad: ref, reactive y computed

Vue actualiza la interfaz automáticamente cuando cambian los datos **reactivos**.

```vue
<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

const contador = ref(0);                // valores sueltos; en el script se usa .value
const carrito = reactive({              // objetos
  productos: [] as { nombre: string; precio: number }[],
});

const total = computed(() =>           // derivado: se recalcula solo cuando cambian sus dependencias
  carrito.productos.reduce((s, p) => s + p.precio, 0),
);

function sumar() {
  contador.value++;
}

function añadir(nombre: string, precio: number) {
  carrito.productos.push({ nombre, precio });
}
</script>

<template>
  <button @click="sumar">Pulsado {{ contador }} veces</button>
  <button @click="añadir('Libro', 15)">Añadir libro</button>
  <p>Total: {{ total.toFixed(2) }} €</p>
</template>
```

> **Nota:** en la plantilla no hace falta `.value`: Vue lo desenvuelve solo. En el `<script>`, sí.

Para ejecutar efectos cuando algo cambia:

```ts
import { watch } from 'vue';

watch(busqueda, async (nueva, anterior) => {
  if (nueva.length < 2) return;
  resultados.value = await buscar(nueva);
});
```

Si la búsqueda se lanza con cada tecla, conviene añadir un *debounce* (esperar a que la persona deje de escribir), por ejemplo con `watchDebounced` de VueUse.

Prefiere `computed` para valores derivados y reserva `watch` para efectos secundarios (llamadas a APIs, guardar en `localStorage`).

## Directivas de la plantilla

```vue
<template>
  <!-- Condicionales -->
  <p v-if="cargando">Cargando…</p>
  <p v-else-if="error" role="alert">{{ error }}</p>
  <ul v-else>
    <!-- Listas: key es obligatoria y debe ser única -->
    <li v-for="tarea in tareas" :key="tarea.id" :class="{ hecha: tarea.hecha }">
      {{ tarea.titulo }}
    </li>
  </ul>

  <!-- Atributos dinámicos con : (v-bind) -->
  <img :src="usuario.avatar" :alt="`Foto de ${usuario.nombre}`" />

  <!-- Eventos con @ (v-on) y modificadores -->
  <form @submit.prevent="guardar">
    <input v-model.trim="titulo" @keyup.enter="guardar" />
  </form>

  <!-- Mostrar u ocultar sin quitar del DOM -->
  <div v-show="abierto">Menú</div>
</template>
```

| Directiva | Uso |
| --- | --- |
| `v-if` / `v-else` | Renderizado condicional |
| `v-show` | Alternar visibilidad (más barato si cambia a menudo) |
| `v-for` | Repetir elementos |
| `v-bind` / `:` | Atributos dinámicos |
| `v-on` / `@` | Eventos |
| `v-model` | Enlace bidireccional con formularios |

## Comunicación entre componentes

**Props** (de padre a hijo) y **eventos** (de hijo a padre):

```vue
<!-- TareaItem.vue -->
<script setup lang="ts">
const props = defineProps<{
  titulo: string;
  hecha: boolean;
}>();

const emit = defineEmits<{
  alternar: [];
  borrar: [];
}>();
</script>

<template>
  <li>
    <label>
      <input type="checkbox" :checked="props.hecha" @change="emit('alternar')" />
      {{ props.titulo }}
    </label>
    <button @click="emit('borrar')" :aria-label="`Borrar ${props.titulo}`">✕</button>
  </li>
</template>
```

```vue
<!-- ListaTareas.vue -->
<TareaItem
  v-for="t in tareas"
  :key="t.id"
  :titulo="t.titulo"
  :hecha="t.hecha"
  @alternar="t.hecha = !t.hecha"
  @borrar="borrar(t.id)"
/>
```

`defineModel` simplifica los componentes que deben funcionar con `v-model`:

```vue
<!-- CampoBusqueda.vue -->
<script setup lang="ts">
const valor = defineModel<string>({ default: '' });
</script>

<template>
  <input v-model="valor" type="search" placeholder="Buscar…" />
</template>

<!-- Uso: <CampoBusqueda v-model="busqueda" /> -->
```

Los **slots** permiten que el padre inyecte contenido:

```vue
<!-- Tarjeta.vue -->
<template>
  <section class="tarjeta">
    <header><slot name="titulo" /></header>
    <slot />
  </section>
</template>

<!-- Uso -->
<Tarjeta>
  <template #titulo><h2>Perfil</h2></template>
  <p>Contenido de la tarjeta</p>
</Tarjeta>
```

## Ciclo de vida

```ts
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
  // el componente ya está en el DOM: buen momento para cargar datos o medir elementos
});

onUnmounted(() => {
  // limpia temporizadores, suscripciones y listeners
});
```

## Composables: lógica reutilizable

Un **composable** es una función que encapsula lógica con estado reactivo. Es el equivalente de los hooks personalizados de React.

```ts
// src/composables/useFetch.ts
import { ref, watchEffect, toValue, type MaybeRefOrGetter } from 'vue';

export function useFetch<T>(url: MaybeRefOrGetter<string>) {
  const datos = ref<T | null>(null);
  const error = ref<string | null>(null);
  const cargando = ref(false);

  watchEffect(async () => {
    cargando.value = true;
    error.value = null;
    try {
      const res = await fetch(toValue(url));
      if (!res.ok) throw new Error(`Error ${res.status}`);
      datos.value = await res.json();
    } catch (e) {
      error.value = (e as Error).message;
    } finally {
      cargando.value = false;
    }
  });

  return { datos, error, cargando };
}
```

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useFetch } from '@/composables/useFetch';

const pagina = ref(1);
const { datos: posts, cargando, error } = useFetch<Post[]>(() => `/api/posts?page=${pagina.value}`);
</script>
```

Al cambiar `pagina`, la URL cambia y la petición se repite sola. La librería **VueUse** ofrece cientos de composables listos (`useLocalStorage`, `useDebounceFn`, `useDark`…).

## Vue Router

```ts
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import Inicio from '@/views/Inicio.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'inicio', component: Inicio },
    { path: '/productos/:id', name: 'producto', component: () => import('@/views/Producto.vue'), props: true },
    { path: '/panel', component: () => import('@/views/Panel.vue'), meta: { requiereLogin: true } },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/NoEncontrado.vue') },
  ],
  scrollBehavior: () => ({ top: 0 }),
});
```

`() => import(...)` carga cada página solo cuando se visita (*lazy loading*).

```vue
<template>
  <nav>
    <RouterLink to="/">Inicio</RouterLink>
    <RouterLink :to="{ name: 'producto', params: { id: 7 } }">Producto 7</RouterLink>
  </nav>
  <RouterView />
</template>
```

Proteger rutas con un *guard*:

```ts
router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiereLogin && !auth.usuario) {
    return { path: '/login', query: { redirect: to.fullPath } };
  }
});
```

## Estado global con Pinia

Cuando varios componentes alejados comparten datos (usuario, carrito), usa un **store**:

```ts
// src/stores/carrito.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCarritoStore = defineStore('carrito', () => {
  const lineas = ref<{ id: number; nombre: string; precio: number; cantidad: number }[]>([]);

  const total = computed(() => lineas.value.reduce((s, l) => s + l.precio * l.cantidad, 0));
  const unidades = computed(() => lineas.value.reduce((s, l) => s + l.cantidad, 0));

  function añadir(producto: { id: number; nombre: string; precio: number }) {
    const linea = lineas.value.find((l) => l.id === producto.id);
    if (linea) linea.cantidad++;
    else lineas.value.push({ ...producto, cantidad: 1 });
  }

  function vaciar() {
    lineas.value = [];
  }

  return { lineas, total, unidades, añadir, vaciar };
});
```

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCarritoStore } from '@/stores/carrito';

const carrito = useCarritoStore();
const { unidades, total } = storeToRefs(carrito);   // mantiene la reactividad al desestructurar
</script>

<template>
  <span>🛒 {{ unidades }} · {{ total.toFixed(2) }} €</span>
</template>
```

> **Consejo:** no metas todo en Pinia. El estado que solo usa un componente vive en el componente; los datos del servidor se gestionan mejor con una librería como TanStack Query (tiene versión para Vue).

## Formularios y validación

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue';

const form = reactive({ email: '', password: '' });
const errores = ref<Record<string, string>>({});
const enviando = ref(false);

async function enviar() {
  errores.value = {};
  if (!form.email.includes('@')) errores.value.email = 'Introduce un correo válido';
  if (form.password.length < 8) errores.value.password = 'Mínimo 8 caracteres';
  if (Object.keys(errores.value).length) return;

  enviando.value = true;
  try {
    await api.login(form);
  } catch {
    errores.value.general = 'Credenciales incorrectas';
  } finally {
    enviando.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="enviar" novalidate>
    <p v-if="errores.general" role="alert">{{ errores.general }}</p>

    <label for="email">Correo</label>
    <input id="email" v-model="form.email" type="email" :aria-invalid="!!errores.email" aria-describedby="error-email" />
    <p v-if="errores.email" id="error-email">{{ errores.email }}</p>

    <label for="password">Contraseña</label>
    <input id="password" v-model="form.password" type="password" :aria-invalid="!!errores.password" />
    <p v-if="errores.password">{{ errores.password }}</p>

    <button :disabled="enviando">{{ enviando ? 'Entrando…' : 'Entrar' }}</button>
  </form>
</template>
```

Para formularios grandes, librerías como **VeeValidate** con esquemas de Zod ahorran mucho código.

## Vue con Laravel y Nuxt

- **Laravel + Inertia + Vue**: construyes páginas Vue y Laravel les pasa los datos como props, sin escribir una API. Es el stack del *starter kit* oficial de Laravel con Vue y una forma muy productiva de hacer aplicaciones full stack.
- **Nuxt**: el equivalente de Next.js para Vue. Añade rutas basadas en archivos, renderizado en el servidor, generación estática y endpoints de servidor. Si necesitas SEO o un sitio con mucho contenido, empieza con Nuxt.

## Tests de componentes

```ts
// src/components/__tests__/Contador.spec.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Contador from '../Contador.vue';

describe('Contador', () => {
  it('incrementa al pulsar', async () => {
    const wrapper = mount(Contador);
    await wrapper.get('button').trigger('click');
    expect(wrapper.text()).toContain('Pulsado 1 veces');
  });
});
```

Más en [Testing para desarrolladores web](/lecciones/testing).

## Proyecto

Construye una aplicación de gestión de gastos personales:

1. Vista de listado con filtros por categoría y mes (`computed`).
2. Formulario para añadir y editar gastos con validación.
3. Store de Pinia que persista los datos en `localStorage`.
4. Rutas: listado, detalle de gasto y estadísticas, con lazy loading.
5. Un composable `useGastosPorCategoria` que agrupe los datos para un gráfico.
6. Tests de los componentes principales.

> **Reto:** sustituye `localStorage` por una API hecha con [APIs REST con Laravel](/lecciones/apis-rest) y autenticación con Sanctum en modo SPA.
