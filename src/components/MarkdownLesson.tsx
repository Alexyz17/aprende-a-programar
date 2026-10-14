import { useMemo, type MouseEvent } from 'react';
import { Marked } from 'marked';
import LessonLayout from '@/layouts/LessonLayout';
import { courseBySlug, coursePath } from '@/data/courses';
import { navigate, withBase } from '@/lib/router';
import { SITE } from '@/site';

/**
 * Lecciones escritas en Markdown (src/content/<slug>.md).
 * Es el formato recomendado para lecciones nuevas: más fácil de escribir y de revisar.
 * - Cada "## Título" se convierte en un apartado del índice lateral.
 * - Los enlaces que empiezan por "/" son internos (p. ej. /lecciones/docker).
 * - Los bloques ```lenguaje se muestran como código.
 * - Las citas que empiezan por "> **Consejo:**", "> **Atención:**" o "> **Nota:**" se destacan.
 */

const slugify = (text: string) =>
    text.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
        .replace(/<[^>]+>/g, '').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

interface Parsed {
    title: string;
    html: string;
    sections: { id: string; title: string }[];
}

function parse(md: string): Parsed {
    const sections: { id: string; title: string }[] = [];
    let title = '';
    const used = new Map<string, number>();
    const marked = new Marked({ gfm: true });
    marked.use({
        renderer: {
            heading({ tokens, depth, text }) {
                const inner = this.parser.parseInline(tokens);
                if (depth === 1) {
                    title = text;
                    return `<h1>${inner}</h1>`;
                }
                let id = slugify(text);
                const n = used.get(id) ?? 0;
                used.set(id, n + 1);
                if (n) id = `${id}-${n}`;
                if (depth === 2) sections.push({ id, title: text.replace(/`/g, '') });
                return `<h${depth} id="${id}">${inner}</h${depth}>`;
            },
            code({ text, lang }) {
                const l = escapeHtml((lang ?? '').split(/\s/)[0]);
                return `<div class="md-code"><div class="md-code-bar"><span>${l || 'código'}</span><button type="button" class="md-copy">Copiar</button></div>`
                    + `<pre><code data-lang="${l}">${escapeHtml(text)}</code></pre></div>`;
            },
            link({ href, title: t, tokens }) {
                const inner = this.parser.parseInline(tokens);
                const internal = href.startsWith('/');
                const finalHref = internal ? withBase(href) : href;
                const attrs = internal ? ' data-internal="true"' : ' target="_blank" rel="noopener noreferrer"';
                return `<a href="${finalHref}"${t ? ` title="${escapeHtml(t)}"` : ''}${attrs}>${inner}</a>`;
            },
            table(token) {
                // Envolvemos las tablas para que hagan scroll horizontal en móvil.
                const head = token.header.map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`).join('');
                const body = token.rows.map((r) => `<tr>${r.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join('')}</tr>`).join('');
                return `<div class="md-table"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
            },
        },
    });
    let html = marked.parse(md, { async: false }) as string;
    html = html.replace(/<blockquote>\s*<p><strong>(Consejo|Atención|Nota|Importante|Ejercicio|Reto):?<\/strong>:?/g,
        (_, kind: string) => `<blockquote class="md-callout md-${kind.toLowerCase()}"><p><strong>${kind}:</strong>`);
    return { title, html, sections };
}

function onInternalLinkClick(e: MouseEvent<HTMLDivElement>) {
    const a = (e.target as HTMLElement).closest('a');
    if (!a || a.dataset.internal !== 'true') return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const url = new URL(a.href);
    const path = url.pathname.replace(withBase('/').replace(/\/$/, ''), '') || '/';
    navigate(path + url.hash);
}

/** Bloque de Markdown suelto dentro de una lección escrita en TSX. */
export function MarkdownContent({ md }: { md: string }) {
    const { html } = useMemo(() => parse(md), [md]);
    return <div className="md-lesson contents" onClick={onInternalLinkClick} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function MarkdownLesson({ slug, md }: { slug: string; md: string }) {
    const course = courseBySlug(slug);
    const { title, html, sections } = useMemo(() => parse(md), [md]);
    const base = course ? coursePath(course) : `/lecciones/${slug}`;

    const pageTitle = course?.title ?? title;
    return (
        <LessonLayout
            title={pageTitle}
            description={course?.description ?? ''}
            duration={course?.duration ?? ''}
            lessons={course?.lessons ?? sections.length}
            level={course?.level ?? 'Básico'}
            category={course?.category ?? ''}
            modules={sections.map((s, i) => ({ id: i === 0 ? base : `${base}#${s.id}`, title: s.title }))}
            activeModule={base}
        >
            <title>{`${pageTitle} — ${SITE.name}`}</title>
            {course && <meta name="description" content={course.description} />}
            <div className="md-lesson contents" onClick={onInternalLinkClick} dangerouslySetInnerHTML={{ __html: html }} />
        </LessonLayout>
    );
}
