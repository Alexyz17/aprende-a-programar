// Tras `vite build`: genera una copia de index.html por ruta (con su título y
// descripción), 404.html para GitLab Pages, sitemap.xml y robots.txt.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const html = readFileSync(join(dist, 'index.html'), 'utf8');

const site = readFileSync(join(root, 'src/site.ts'), 'utf8');
const siteName = site.match(/name:\s*'([^']+)'/)[1];
const siteUrl = (process.env.CI_PAGES_URL ?? site.match(/url:\s*'([^']+)'/)[1]).replace(/\/$/, '');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const routes = [
    { path: '/cursos', title: 'Todos los cursos', description: 'Catálogo completo de cursos de programación gratuitos y abiertos.' },
    { path: '/rutas', title: 'Rutas de aprendizaje', description: 'Itinerarios recomendados para aprender desarrollo web, backend, frontend, DevOps o IA desde cero.' },
    { path: '/juegos', title: 'Juegos para practicar', description: 'Quizzes y retos de código para repasar lo aprendido.' },
    { path: '/progreso', title: 'Mi progreso', description: 'Tu progreso guardado en este navegador.' },
    { path: '/colabora', title: 'Colabora', description: 'Proyecto abierto: cómo proponer mejoras, corregir errores o añadir lecciones.' },
    { path: '/privacidad', title: 'Privacidad', description: 'Esta web no usa cookies de seguimiento ni recoge datos personales.' },
    { path: '/licencia', title: 'Licencia', description: 'El contenido se publica con licencia CC BY-SA 4.0 y el código con licencia MIT.' },
];

// Cursos: se leen del catálogo (slug, title, description).
const coursesSrc = readFileSync(join(root, 'src/data/courses.ts'), 'utf8');
for (const m of coursesSrc.matchAll(/slug: '([^']+)', title: '([^']+)', description: '((?:[^'\\]|\\.)+)'/g)) {
    routes.push({ path: `/lecciones/${m[1]}`, title: m[2], description: m[3].replace(/\\'/g, "'") });
}
// Juegos
const gamesSrc = existsSync(join(root, 'src/data/games.ts')) ? readFileSync(join(root, 'src/data/games.ts'), 'utf8') : '';
for (const m of gamesSrc.matchAll(/slug: '([^']+)',\s*title: '([^']+)',\s*description: '((?:[^'\\]|\\.)+)'/g)) {
    routes.push({ path: `/juegos/${m[1]}`, title: m[2], description: m[3].replace(/\\'/g, "'") });
}

function page({ title, description }) {
    return html
        .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)} — ${esc(siteName)}</title>`)
        .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${esc(description)}"`);
}

for (const r of routes) {
    const dir = join(dist, r.path);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), page(r));
}
writeFileSync(join(dist, '404.html'), page({ title: 'Página no encontrada', description: 'La página que buscas no existe.' }));

const today = new Date().toISOString().slice(0, 10);
const urls = ['/', ...routes.map((r) => r.path)]
    .map((p) => `  <url><loc>${siteUrl}${p === '/' ? '/' : p + '/'}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n');
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);

console.log(`postbuild: ${routes.length} rutas prerenderizadas, sitemap y 404 generados.`);
