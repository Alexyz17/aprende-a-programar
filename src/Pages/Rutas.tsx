import AppLayout from '@/layouts/AppLayout';
import { Link } from '@/lib/router';
import { CheckCircle2, Circle, Target } from 'lucide-react';
import { PATHS } from '@/data/paths';
import { courseBySlug, coursePath } from '@/data/courses';
import { useProgress } from '@/lib/progress';
import { SITE } from '@/site';

export default function Rutas() {
    const { completed } = useProgress();
    return (
        <AppLayout>
            <title>{`Rutas de aprendizaje — ${SITE.name}`}</title>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Rutas de aprendizaje</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl">
                    Itinerarios con los cursos en el orden recomendado. Marca cada curso como completado y verás tu avance aquí.
                </p>
                <div className="space-y-8">
                    {PATHS.map((p) => {
                        const courses = p.courses.map(courseBySlug).filter((c) => c !== undefined);
                        const done = courses.filter((c) => completed.includes(c.slug)).length;
                        const pct = courses.length ? Math.round((done / courses.length) * 100) : 0;
                        return (
                            <section key={p.slug} id={p.slug} aria-labelledby={`t-${p.slug}`} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 scroll-mt-24">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                                    <div>
                                        <h2 id={`t-${p.slug}`} className="text-xl font-bold mb-1">{p.title}</h2>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">{p.description}</p>
                                        <p className="flex items-start gap-2 text-sm mt-3"><Target className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" aria-hidden /> <span><strong>Objetivo:</strong> {p.goal}</span></p>
                                    </div>
                                    <div className="sm:text-right shrink-0">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{done} de {courses.length} cursos</p>
                                        <div className="h-2 w-40 bg-gray-200 dark:bg-gray-800 rounded-full mt-2 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Progreso en ${p.title}`}>
                                            <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                </div>
                                <ol className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {courses.map((c, i) => {
                                        const isDone = completed.includes(c.slug);
                                        return (
                                            <li key={c.slug}>
                                                <Link href={coursePath(c)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                    <span className="text-xs font-bold text-gray-500 w-5 text-right">{i + 1}</span>
                                                    {isDone ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" aria-label="Completado" /> : <Circle className="h-4 w-4 text-gray-400 shrink-0" aria-hidden />}
                                                    <span className="font-medium">{c.title}</span>
                                                    <span className="ml-auto text-xs text-gray-500 hidden sm:inline">{c.level}</span>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ol>
                            </section>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
