import AppLayout from '@/layouts/AppLayout';
import { Link } from '@/lib/router';
import { Target } from 'lucide-react';
import { PATHS } from '@/data/paths';
import Diploma from '@/components/Diploma';
import { courseBySlug, coursePath } from '@/data/courses';
import { useProgress } from '@/lib/progress';
import { SITE } from '@/site';

/** Un color por línea, como en un plano de metro. Tonos 700: el texto blanco encima supera 4,5:1. */
const LINE_COLORS = ['#047857', '#0369a1', '#b91c1c', '#b45309', '#0e7490', '#a21caf', '#4d7c0f', '#c2410c', '#475569'];

/** En qué líneas (L1, L2…) aparece cada curso: las "correspondencias". */
const lineasDe = new Map<string, number[]>();
PATHS.forEach((p, i) => p.courses.forEach((c) => lineasDe.set(c, [...(lineasDe.get(c) ?? []), i + 1])));

export default function Rutas() {
    const { completed } = useProgress();
    return (
        <AppLayout>
            <title>{`Rutas de aprendizaje — ${SITE.name}`}</title>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Rutas de aprendizaje</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl">
                    Cada ruta es una línea de metro: los cursos son las paradas, en el orden recomendado. Las paradas rellenas son las que ya has completado, y ⇄ indica que ese curso también está en otras líneas.
                </p>
                <div className="space-y-8">
                    {PATHS.map((p, idx) => {
                        const n = idx + 1;
                        const color = LINE_COLORS[idx % LINE_COLORS.length];
                        const courses = p.courses.map(courseBySlug).filter((c) => c !== undefined);
                        const nextSlug = courses.find((c) => !completed.includes(c.slug))?.slug;
                        const done = courses.filter((c) => completed.includes(c.slug)).length;
                        const pct = courses.length ? Math.round((done / courses.length) * 100) : 0;
                        return (
                            <section key={p.slug} id={p.slug} aria-labelledby={`t-${p.slug}`} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 scroll-mt-24">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                                    <div>
                                        <h2 id={`t-${p.slug}`} className="text-xl font-bold mb-1 flex items-center gap-2.5">
                                            <span className="inline-flex items-center justify-center h-8 min-w-8 px-1.5 rounded-lg text-white text-sm font-extrabold" style={{ background: color }} aria-hidden>L{n}</span>
                                            <span className="sr-only">Línea {n}:</span>
                                            {p.title}
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">{p.description}</p>
                                        <p className="flex items-start gap-2 text-sm mt-3"><Target className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden /> <span><strong>Objetivo:</strong> {p.goal}</span></p>
                                    </div>
                                    <div className="sm:text-right shrink-0">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{done} de {courses.length} cursos</p>
                                        <div className="h-2 w-40 bg-gray-200 dark:bg-gray-800 rounded-full mt-2 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Progreso en ${p.title}`}>
                                            <div className="h-full" style={{ width: `${pct}%`, background: color }} />
                                        </div>
                                    </div>
                                </div>
                                <ol className="md:columns-2 md:gap-10" aria-label={`Paradas de la línea L${n}`}>
                                    {courses.map((c, i) => {
                                        const isDone = completed.includes(c.slug);
                                        const isNext = c.slug === nextSlug;
                                        const others = (lineasDe.get(c.slug) ?? []).filter((x) => x !== n);
                                        return (
                                            <li key={c.slug} className="relative break-inside-avoid pl-9">
                                                {/* Tramo de vía: no sobresale antes de la primera ni después de la última parada */}
                                                <span aria-hidden className="absolute left-[13px] w-1.5"
                                                      style={{ background: color, top: i === 0 ? '50%' : 0, bottom: i === courses.length - 1 ? '50%' : 0 }} />
                                                <span aria-hidden className={`absolute left-[7px] top-1/2 -translate-y-1/2 h-[18px] w-[18px] rounded-full border-[4px] ${isDone ? '' : 'bg-white dark:bg-gray-900'}`}
                                                      style={{ borderColor: color, background: isDone ? color : undefined }} />
                                                <Link href={coursePath(c)} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-xl px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                    <span className={`font-medium ${isDone ? 'text-gray-500 dark:text-gray-400' : ''}`}>{c.title}</span>
                                                    {isDone && <span className="sr-only">(completado)</span>}
                                                    {isNext && (
                                                        <span className="text-[0.7rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full text-white" style={{ background: color }}>
                                                            Próxima parada
                                                        </span>
                                                    )}
                                                    {others.length > 0 && (
                                                        <span className="text-[0.7rem] text-gray-500 dark:text-gray-400" title="Este curso también está en otras rutas">
                                                            ⇄ {others.map((o) => `L${o}`).join(' ')}
                                                        </span>
                                                    )}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ol>
                                {courses.length > 0 && done === courses.length && (
                                    <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
                                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">¡Ruta terminada! Llévate tu diploma.</p>
                                        <Diploma path={p.title} courses={courses.map((c) => c.title)} />
                                    </div>
                                )}
                            </section>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
