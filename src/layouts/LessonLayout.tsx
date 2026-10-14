import AppLayout from '@/layouts/AppLayout';
import { Link } from '@/lib/router';
import { usePath } from '@/lib/router';
import { useEffect, useRef, useState } from 'react';
import { ChevronRight, BookOpen, Clock, CheckCircle2, Circle, ArrowLeft, ArrowRight, Pencil } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';
import { COURSES, coursePath } from '@/data/courses';
import { toggleCompleted, useProgress } from '@/lib/progress';
import { SITE } from '@/site';
import { enhanceCodeBlocks, handleCopyClick } from '@/lib/highlight';

export interface Module {
    id: string;
    title: string;
    /** Se mantiene por compatibilidad: ahora todo el contenido es libre. */
    free?: boolean;
}

interface LessonLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
    duration: string;
    lessons: number;
    level: 'Básico' | 'Intermedio' | 'Avanzado';
    /** Obsoleto: ya no hay contenido de pago. */
    premium?: boolean;
    modules: Module[];
    activeModule: string;
    prevHref?: string;
    nextHref?: string;
    category: string;
    videoId?: string;
    allUnlocked?: boolean;
}

const levelColor = {
    'Básico': 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30',
    'Intermedio': 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30',
    'Avanzado': 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30',
};

/** Estilos del contenido de las lecciones, legibles en tema claro y oscuro. */
const articleClass = `
    max-w-none text-[1.0125rem] text-slate-700 dark:text-slate-300

    [&_h1]:text-3xl sm:[&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:tracking-tight
    [&_h1]:text-slate-900 dark:[&_h1]:text-white [&_h1]:mb-6 [&_h1]:mt-0 [&_h1]:leading-tight

    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:scroll-mt-24
    [&_h2]:text-emerald-800 dark:[&_h2]:text-emerald-300 [&_h2]:mt-12 [&_h2]:mb-4
    [&_h2]:pb-3 [&_h2]:border-b [&_h2]:border-slate-200 dark:[&_h2]:border-slate-800

    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:scroll-mt-24
    [&_h3]:text-slate-900 dark:[&_h3]:text-slate-200 [&_h3]:mt-8 [&_h3]:mb-3

    [&_h4]:text-base [&_h4]:font-semibold
    [&_h4]:text-slate-800 dark:[&_h4]:text-slate-300 [&_h4]:mt-6 [&_h4]:mb-2

    [&_p]:leading-[1.8] [&_p]:mb-4

    [&_strong]:text-slate-900 dark:[&_strong]:text-slate-100 [&_strong]:font-semibold

    [&_ul]:my-4 [&_ul]:space-y-2 [&_ul]:pl-0 [&_ul]:list-none
    [&_ul>li]:relative [&_ul>li]:pl-5 [&_ul>li]:leading-relaxed
    [&_ul>li]:before:content-['▸'] [&_ul>li]:before:text-emerald-600 dark:[&_ul>li]:before:text-emerald-400
    [&_ul>li]:before:absolute [&_ul>li]:before:left-0

    [&_ol]:my-4 [&_ol]:space-y-2 [&_ol]:pl-6 [&_ol]:list-decimal
    [&_ol>li]:leading-relaxed [&_ol>li]:pl-1

    [&_:not(pre)>code]:bg-slate-100 dark:[&_:not(pre)>code]:bg-slate-800
    [&_:not(pre)>code]:text-slate-800 dark:[&_:not(pre)>code]:text-slate-200
    [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:rounded
    [&_:not(pre)>code]:text-[0.85em] [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:break-words

    [&_pre]:my-5 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto
    [&_pre]:bg-slate-950 [&_pre]:text-slate-100 [&_pre]:border [&_pre]:border-slate-800
    [&_pre]:text-[0.85rem] [&_pre]:leading-relaxed [&_pre]:font-mono

    [&_table]:w-full [&_table]:my-6 [&_table]:text-sm [&_table]:border-collapse [&_table]:block sm:[&_table]:table [&_table]:overflow-x-auto
    [&_th]:text-left [&_th]:font-semibold [&_th]:p-2.5 [&_th]:bg-slate-100 dark:[&_th]:bg-slate-800/60
    [&_th]:border [&_th]:border-slate-200 dark:[&_th]:border-slate-700
    [&_td]:p-2.5 [&_td]:align-top [&_td]:border [&_td]:border-slate-200 dark:[&_td]:border-slate-800

    [&_a]:text-emerald-700 dark:[&_a]:text-emerald-400 [&_a]:underline [&_a]:underline-offset-2
    [&_a]:decoration-emerald-600/50 [&_a:hover]:text-emerald-600

    [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-600
    [&_blockquote]:bg-emerald-50 dark:[&_blockquote]:bg-emerald-950/30 [&_blockquote]:px-5 [&_blockquote]:py-3
    [&_blockquote]:rounded-r-xl [&_blockquote]:my-6 [&_blockquote]:not-italic [&_blockquote]:leading-relaxed
    [&_blockquote_p]:mb-0
`;

export default function LessonLayout({
    children, title, description, duration, lessons, level,
    modules, activeModule, prevHref, nextHref, category, videoId,
}: LessonLayoutProps) {
    const path = usePath();
    const slug = path.replace(/^\/lecciones\//, '');
    const { completed } = useProgress();
    const isDone = completed.includes(slug);

    // Las lecciones se cargan bajo demanda: al llegar con #ancla, desplazarse cuando ya están pintadas.
    useEffect(() => {
        const hash = decodeURIComponent(window.location.hash.slice(1));
        if (hash) document.getElementById(hash)?.scrollIntoView({ block: 'start' });
    }, [slug]);

    // Resaltado de sintaxis y botón de copiar en todos los bloques de código (Markdown y TSX).
    const articleRef = useRef<HTMLElement>(null);
    useEffect(() => { if (articleRef.current) enhanceCodeBlocks(articleRef.current); }, [slug]);

    // Resalta en el índice el apartado que se está leyendo.
    const [current, setCurrent] = useState<string | null>(null);
    useEffect(() => {
        const headings = Array.from(document.querySelectorAll<HTMLElement>('article h2[id]'));
        if (!headings.length) return;
        const obs = new IntersectionObserver((entries) => {
            const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
            if (visible[0]) setCurrent(visible[0].target.id);
        }, { rootMargin: '-80px 0px -70% 0px' });
        headings.forEach((h) => obs.observe(h));
        return () => obs.disconnect();
    }, [slug]);
    const activeId = (current && modules.find((m) => m.id.endsWith('#' + current))?.id) ?? (current === null ? activeModule : modules[0]?.id);

    // Anterior / siguiente: si la lección no los indica, se usa el orden del catálogo.
    const sameCategory = COURSES.filter((c) => c.category === category);
    const idx = sameCategory.findIndex((c) => c.slug === slug);
    const prev = prevHref ?? (idx > 0 ? coursePath(sameCategory[idx - 1]) : undefined);
    const next = nextHref ?? (idx >= 0 && idx < sameCategory.length - 1 ? coursePath(sameCategory[idx + 1]) : undefined);
    const prevTitle = COURSES.find((c) => coursePath(c) === prev)?.title;
    const nextTitle = COURSES.find((c) => coursePath(c) === next)?.title;

    const courseSchema = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: title,
        description,
        provider: { '@type': 'Person', name: SITE.author, url: SITE.authorUrl },
        inLanguage: 'es',
        isAccessibleForFree: true,
        license: SITE.licenseUrl,
        hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: `PT${duration.replace(/\s/g, '').toUpperCase()}` },
        about: { '@type': 'Thing', name: category },
    };

    return (
        <AppLayout>
            <script type="application/ld+json">{JSON.stringify(courseSchema)}</script>

            {/* Migas de pan */}
            <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
                <nav aria-label="Migas de pan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">Inicio</Link>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    <Link href="/cursos" className="hover:text-gray-900 dark:hover:text-white transition-colors">Cursos</Link>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span className="text-gray-700 dark:text-gray-200 font-medium truncate">{title}</span>
                </nav>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* ── Barra lateral ── */}
                    <aside className="lg:w-72 shrink-0">
                        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 lg:sticky lg:top-24">
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${levelColor[level]}`}>{level}</span>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{category}</span>
                            </div>
                            <p className="font-bold text-base mb-1.5 leading-snug">{title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" aria-hidden />{lessons} apartados</span>
                                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden />{duration}</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => toggleCompleted(slug)}
                                aria-pressed={isDone}
                                className={`w-full mb-4 flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl transition-colors ${
                                    isDone
                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                        : 'border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                            >
                                {isDone ? <CheckCircle2 className="h-4 w-4" aria-hidden /> : <Circle className="h-4 w-4" aria-hidden />}
                                {isDone ? 'Curso completado' : 'Marcar como completado'}
                            </button>

                            {modules.length > 0 && (
                                <nav aria-label="Índice del curso" className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Índice</p>
                                    {modules.map((mod) => {
                                        const isActive = mod.id === activeId;
                                        return (
                                            <Link
                                                key={mod.id}
                                                href={mod.id}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                                    isActive
                                                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-medium'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                            >
                                                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
                                                <span className="truncate">{mod.title}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                            )}
                        </div>
                    </aside>

                    {/* ── Contenido ── */}
                    <div className="flex-1 min-w-0">
                        {videoId && <VideoPlayer videoId={videoId} title={title} />}
                        <article ref={articleRef} className={articleClass} onClick={(e) => handleCopyClick(e.target as HTMLElement)}>{children}</article>

                        <div className="mt-12 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-5 text-sm text-gray-600 dark:text-gray-400 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                            <span>¿Has visto un error o quieres ampliar esta lección? El contenido es abierto.</span>
                            <a href={`${SITE.repo}/-/issues/new?issue[title]=${encodeURIComponent('Lección: ' + title)}`} target="_blank" rel="noopener noreferrer"
                               className="inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400 hover:underline shrink-0">
                                <Pencil className="h-4 w-4" aria-hidden /> Proponer una mejora
                            </a>
                        </div>
                    </div>
                </div>

                {(prev || next) && (
                    <nav aria-label="Navegación entre cursos" className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {prev ? (
                            <Link href={prev} className="group rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-emerald-400 transition-colors">
                                <span className="flex items-center gap-1.5 text-xs text-gray-500"><ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Anterior</span>
                                <span className="block font-medium mt-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{prevTitle ?? 'Curso anterior'}</span>
                            </Link>
                        ) : <div className="hidden sm:block" />}
                        {next && (
                            <Link href={next} className="group rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-right hover:border-emerald-400 transition-colors">
                                <span className="flex items-center justify-end gap-1.5 text-xs text-gray-500">Siguiente <ArrowRight className="h-3.5 w-3.5" aria-hidden /></span>
                                <span className="block font-medium mt-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{nextTitle ?? 'Siguiente curso'}</span>
                            </Link>
                        )}
                    </nav>
                )}
            </div>
        </AppLayout>
    );
}
