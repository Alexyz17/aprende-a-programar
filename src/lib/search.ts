import { COURSES } from '@/data/courses';
import { PATHS } from '@/data/paths';
import { GAMES } from '@/data/games';
import { slugify } from '@/lib/slugify';

/** Buscador de la web: cursos, rutas, juegos y apartados de las lecciones en Markdown. */

export type HitKind = 'Curso' | 'Ruta' | 'Juego' | 'Apartado';
export interface Entry {
    kind: HitKind;
    title: string;
    detail: string;
    href: string;
}

const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

export const STATIC_ENTRIES: Entry[] = [
    ...COURSES.map((c) => ({ kind: 'Curso' as const, title: c.title, detail: `${c.category} · ${c.description}`, href: `/lecciones/${c.slug}` })),
    ...PATHS.map((p) => ({ kind: 'Ruta' as const, title: p.title, detail: p.description, href: `/rutas#${p.slug}` })),
    ...GAMES.map((g) => ({ kind: 'Juego' as const, title: g.title, detail: g.description, href: `/juegos/${g.slug}` })),
];

/** Extrae los "## apartados" de una lección en Markdown. */
export function sectionsOf(slug: string, md: string): Entry[] {
    const course = COURSES.find((c) => c.slug === slug);
    if (!course) return [];
    return [...md.matchAll(/^## (.+)$/gm)].map(([, t]) => {
        const title = t.replace(/`/g, '');
        return { kind: 'Apartado' as const, title, detail: course.title, href: `/lecciones/${slug}#${slugify(t)}` };
    });
}

// shortcut: solo indexa apartados de lecciones en Markdown; las antiguas en TSX se encuentran por título del curso.
const loaders = import.meta.glob<string>('/src/content/*.md', { query: '?raw', import: 'default' });
let sections: Promise<Entry[]> | null = null;
export function loadSections(): Promise<Entry[]> {
    sections ??= Promise.all(Object.entries(loaders).map(async ([file, load]) => {
        const slug = file.split('/').pop()!.replace(/\.md$/, '');
        return sectionsOf(slug, await load());
    })).then((all) => all.flat()).catch(() => []);
    return sections;
}

const KIND_WEIGHT: Record<HitKind, number> = { Curso: 3, Ruta: 2, Juego: 1, Apartado: 0 };

/** Todas las palabras deben aparecer; puntúa más si están en el título. */
export function search(entries: Entry[], query: string, limit = 12): Entry[] {
    const words = fold(query).split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return entries
        .map((e) => {
            const title = fold(e.title);
            const all = `${title} ${fold(e.detail)}`;
            if (!words.every((w) => all.includes(w))) return null;
            const score = words.reduce((s, w) => s + (title.startsWith(w) ? 6 : title.includes(w) ? 4 : 1), 0) + KIND_WEIGHT[e.kind];
            return { e, score };
        })
        .filter((x) => x !== null)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((x) => x.e);
}
