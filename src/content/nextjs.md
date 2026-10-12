# Next.js con App Router

> Next.js es el framework de React más usado para construir aplicaciones web completas: rutas basadas en carpetas, renderizado en el servidor, carga de datos, formularios con Server Actions, optimización de imágenes y SEO. Necesitas conocer bien React; repasa [React avanzado](/lecciones/react-avanzado) si te hace falta.

## Por qué Next.js

Una aplicación React "pura" (creada con Vite) se ejecuta entera en el navegador: el servidor envía un HTML casi vacío y JavaScript lo construye todo. Funciona, pero:

- El primer contenido tarda más en aparecer, sobre todo en móviles lentos.
- Los buscadores y las redes sociales ven menos contenido.
- Necesitas una API aparte para cualquier dato del servidor.

Next.js permite **renderizar en el servidor** lo que tenga sentido, enviar menos JavaScript y escribir lógica de servidor en el mismo proyecto.

```bash
npx create-next-app@latest mi-app
# TypeScript: sí · ESLint: sí · Tailwind: sí · App Router: sí
cd mi-app
npm run dev
```

## Rutas basadas en carpetas

Dentro de `app/`, cada carpeta es un segmento de la URL y `page.tsx` es la página:

```text
app/
├── layout.tsx              → estructura común (html, body, menú)
├── page.tsx                → /
├── blog/
│   ├── page.tsx            → /blog
│   └── [slug]/
│       └── page.tsx        → /blog/mi-primer-post
├── (marketing)/            → grupo: organiza sin afectar a la URL
│   └── precios/page.tsx    → /precios
└── api/
    └── health/route.ts     → /api/health (endpoint)
```

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Mi blog', template: '%s — Mi blog' },
  description: 'Artículos sobre desarrollo web',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header>…</header>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

Archivos especiales de cada carpeta:

| Archivo | Para qué |
| --- | --- |
| `page.tsx` | La página de esa ruta |
| `layout.tsx` | Envoltorio que se mantiene al navegar entre páginas hijas |
| `loading.tsx` | Interfaz de carga mientras llegan los datos |
| `error.tsx` | Interfaz cuando algo falla (componente de cliente) |
| `not-found.tsx` | Página 404 |
| `route.ts` | Endpoint HTTP (GET, POST…) |

Navegación entre páginas sin recargar:

```tsx
import Link from 'next/link';

<Link href={`/blog/${post.slug}`}>{post.title}</Link>
```

## Server Components y Client Components

En el App Router, **todos los componentes son de servidor por defecto**. Se ejecutan solo en el servidor: pueden leer la base de datos directamente y no envían su código al navegador.

```tsx
// app/blog/page.tsx — Server Component
import { db } from '@/lib/db';

export default async function BlogPage() {
  const posts = await db.post.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}
```

Cuando necesitas interactividad (estado, eventos, efectos, APIs del navegador), marcas el archivo como **componente de cliente**:

```tsx
// components/BotonMeGusta.tsx
'use client';

import { useState } from 'react';

export function BotonMeGusta({ inicial }: { inicial: number }) {
  const [likes, setLikes] = useState(inicial);
  return <button onClick={() => setLikes(likes + 1)}>❤ {likes}</button>;
}
```

| Necesitas… | Usa |
| --- | --- |
| Leer datos, acceder a secretos o a la base de datos | Server Component |
| `useState`, `useEffect`, `onClick` | Client Component |
| Librerías que usan `window` o `localStorage` | Client Component |
| Reducir el JavaScript enviado | Server Component |

> **Consejo:** mantén los componentes de cliente lo más **pequeños y abajo** posible en el árbol. Una página puede ser de servidor y contener solo un botón de cliente.

Un Server Component puede pasar datos a uno de cliente mediante props, siempre que sean serializables (no funciones ni clases).

## Rutas dinámicas y metadatos

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPost, getAllSlugs } from '@/lib/posts';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return post
    ? { title: post.title, description: post.excerpt, openGraph: { images: [post.cover] } }
    : {};
}

// Genera estas páginas en el build (generación estática)
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}
```

> **Nota:** desde Next.js 15, `params` y `searchParams` son promesas y se leen con `await`. En código de versiones anteriores verás `params.slug` directamente.

## Carga de datos y caché

En un Server Component puedes usar `fetch` o tu ORM directamente. Lo importante es decidir **cuándo** se genera la página:

| Estrategia | Cómo | Ideal para |
| --- | --- | --- |
| Estática | La página se genera en el build | Documentación, blogs, marketing |
| Revalidación (ISR) | Estática, pero se regenera cada cierto tiempo o bajo demanda | Catálogos, noticias |
| Dinámica | Se genera en cada petición | Paneles personales, datos en tiempo real |

```tsx
// Regenerar como máximo cada 10 minutos
export const revalidate = 600;

// O por petición concreta:
const res = await fetch('https://api.ejemplo.com/productos', { next: { revalidate: 600, tags: ['productos'] } });
```

Al leer cookies o cabeceras (`cookies()`, `headers()`), la página pasa a ser dinámica automáticamente.

Invalida la caché cuando cambian los datos:

```ts
import { revalidatePath, revalidateTag } from 'next/cache';

revalidatePath('/blog');
revalidateTag('productos');
```

### Cargas en paralelo y streaming

```tsx
import { Suspense } from 'react';

export default function Panel() {
  return (
    <>
      <h1>Panel</h1>
      <Suspense fallback={<p>Cargando ventas…</p>}>
        <Ventas />          {/* componente async lento */}
      </Suspense>
      <Suspense fallback={<p>Cargando pedidos…</p>}>
        <UltimosPedidos />
      </Suspense>
    </>
  );
}
```

La página se envía al momento y cada bloque aparece cuando sus datos están listos (*streaming*).

## Server Actions: formularios sin API

Una **Server Action** es una función que se ejecuta en el servidor y se puede llamar desde un formulario:

```tsx
// app/contacto/actions.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

const Esquema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Correo no válido'),
  mensaje: z.string().min(10, 'Cuéntanos un poco más'),
});

export type Estado = { ok?: boolean; errores?: Record<string, string[]> };

export async function enviarMensaje(_prev: Estado, formData: FormData): Promise<Estado> {
  const datos = Esquema.safeParse(Object.fromEntries(formData));
  if (!datos.success) return { errores: datos.error.flatten().fieldErrors };

  await db.mensaje.create({ data: datos.data });
  revalidatePath('/admin/mensajes');
  return { ok: true };
}
```

```tsx
// app/contacto/Formulario.tsx
'use client';

import { useActionState } from 'react';
import { enviarMensaje, type Estado } from './actions';

export function Formulario() {
  const [estado, accion, pendiente] = useActionState<Estado, FormData>(enviarMensaje, {});

  if (estado.ok) return <p role="status">¡Mensaje enviado!</p>;

  return (
    <form action={accion}>
      <label htmlFor="nombre">Nombre</label>
      <input id="nombre" name="nombre" />
      {estado.errores?.nombre && <p role="alert">{estado.errores.nombre[0]}</p>}

      <label htmlFor="email">Correo</label>
      <input id="email" name="email" type="email" />
      {estado.errores?.email && <p role="alert">{estado.errores.email[0]}</p>}

      <label htmlFor="mensaje">Mensaje</label>
      <textarea id="mensaje" name="mensaje" />
      {estado.errores?.mensaje && <p role="alert">{estado.errores.mensaje[0]}</p>}

      <button disabled={pendiente}>{pendiente ? 'Enviando…' : 'Enviar'}</button>
    </form>
  );
}
```

> **Importante:** una Server Action es un endpoint público aunque no lo parezca. **Valida siempre los datos y comprueba la autenticación y los permisos** dentro de la acción, igual que en cualquier API.

## Route Handlers

Para endpoints REST (webhooks, una API para una app móvil):

```ts
// app/api/productos/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') ?? '';
  const productos = await buscarProductos(q);
  return NextResponse.json(productos);
}

export async function POST(request: Request) {
  const body = await request.json();
  // validar, autenticar…
  return NextResponse.json(await crearProducto(body), { status: 201 });
}
```

## Middleware y autenticación

El **middleware** se ejecuta antes de cada petición que coincida. Es útil para redirecciones y comprobaciones rápidas:

```ts
// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sesion = request.cookies.get('sesion');
  if (!sesion) {
    return NextResponse.redirect(new URL(`/login?next=${request.nextUrl.pathname}`, request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/panel/:path*'] };
```

Para la autenticación completa, usa una librería probada (Auth.js, Better Auth, Clerk…) en lugar de escribirla desde cero. Y recuerda: el middleware es un primer filtro; **vuelve a comprobar los permisos** en las páginas y acciones que acceden a datos.

## Imágenes, fuentes y SEO

```tsx
import Image from 'next/image';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

<Image src="/portada.jpg" alt="Equipo trabajando" width={1200} height={630} priority />
```

- `next/image` sirve tamaños y formatos modernos (WebP, AVIF) según el dispositivo y evita saltos de diseño.
- `next/font` descarga la fuente en el build y la sirve desde tu dominio: más rápido y sin rastreo de terceros.

SEO automático con archivos especiales:

```ts
// app/sitemap.ts
export default async function sitemap() {
  const posts = await getAllPosts();
  return [
    { url: 'https://ejemplo.com', lastModified: new Date() },
    ...posts.map((p) => ({ url: `https://ejemplo.com/blog/${p.slug}`, lastModified: p.updatedAt })),
  ];
}

// app/robots.ts
export default function robots() {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: 'https://ejemplo.com/sitemap.xml' };
}
```

## Despliegue

Opciones habituales:

- **Vercel**: la empresa que desarrolla Next.js; despliegue con un clic desde Git.
- **Netlify, Cloudflare**: también lo soportan.
- **Tu propio servidor o Docker**: con `output: 'standalone'` en `next.config.ts`, el build genera un servidor Node mínimo.
- **Exportación estática**: con `output: 'export'`, si no usas funciones de servidor, genera HTML que puedes subir a cualquier hosting estático (GitHub Pages, GitLab Pages).

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
```

## Errores frecuentes

| Error | Causa | Solución |
| --- | --- | --- |
| "useState only works in Client Components" | Hook en un componente de servidor | Añade `'use client'` o mueve la parte interactiva a otro componente |
| "window is not defined" | Código de navegador ejecutado en el servidor | Muévelo a un `useEffect` o a un componente de cliente |
| Datos que no se actualizan | La página se generó de forma estática | `revalidate`, `revalidatePath` o hacerla dinámica |
| Hydration mismatch | El HTML del servidor y el del cliente difieren (fechas, `Math.random`) | Genera esos valores solo en el cliente o pásalos desde el servidor |
| Secretos en el navegador | Variable de entorno con prefijo `NEXT_PUBLIC_` | Solo las públicas llevan ese prefijo; el resto, nunca |

## Proyecto

Construye un blog con:

1. Listado y páginas de post generadas estáticamente desde archivos Markdown o una base de datos.
2. Metadatos y Open Graph por post, sitemap y robots.
3. Un formulario de contacto con Server Action, validación con Zod y mensajes de error accesibles.
4. Un panel `/panel` protegido con autenticación.
5. Despliegue en Vercel o en un contenedor Docker.

> **Reto:** mide tu blog con Lighthouse (pestaña de las herramientas del navegador) y consigue más de 90 en rendimiento, accesibilidad, buenas prácticas y SEO. Después, compáralo con la misma web hecha solo con Vite y React.
