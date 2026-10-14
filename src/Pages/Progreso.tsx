import AppLayout from '@/layouts/AppLayout';
import { Link } from '@/lib/router';
import { useState } from 'react';
import { CheckCircle2, Trophy, Trash2, Info, Flame } from 'lucide-react';
import { COURSES, coursePath } from '@/data/courses';
import { GAMES } from '@/data/games';
import { useProgress, resetProgress, streak, dayKey } from '@/lib/progress';
import { SITE } from '@/site';

export default function Progreso() {
    const { completed, scores, days } = useProgress();
    const racha = streak(days);
    // Últimas 4 semanas, de la más antigua a hoy.
    const recent = Array.from({ length: 28 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (27 - i));
        return { key: dayKey(d), label: d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) };
    });
    const daySet = new Set(days);
    const [confirm, setConfirm] = useState(false);
    const done = COURSES.filter((c) => completed.includes(c.slug));
    const played = GAMES.filter((g) => scores[g.slug]);
    const pct = Math.round((done.length / COURSES.length) * 100);

    return (
        <AppLayout>
            <title>{`Mi progreso — ${SITE.name}`}</title>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Mi progreso</h1>
                <p className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 mb-10 max-w-2xl">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" aria-hidden />
                    Se guarda solo en este navegador. Si cambias de dispositivo o borras los datos del navegador, empezarás de cero.
                </p>

                <section aria-labelledby="t-racha" className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 mb-4 flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="shrink-0">
                        <p id="t-racha" className="text-sm text-gray-500 dark:text-gray-400">Racha</p>
                        <p className="text-3xl font-bold inline-flex items-center gap-2">
                            <Flame className={`h-7 w-7 ${racha ? 'text-orange-500' : 'text-gray-400'}`} aria-hidden />
                            {racha} {racha === 1 ? 'día' : 'días'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{days.length} días estudiando en total</p>
                    </div>
                    <ol className="grid grid-cols-7 md:grid-cols-14 gap-1.5 sm:ml-auto w-fit" aria-label="Actividad de las últimas cuatro semanas">
                        {recent.map(({ key, label }) => {
                            const on = daySet.has(key);
                            return (
                                <li key={key} title={label} aria-label={`${label}: ${on ? 'con actividad' : 'sin actividad'}`}
                                    className={`h-5 w-5 rounded-full ${on ? 'bg-emerald-500 ring-2 ring-emerald-500/30' : 'bg-gray-200 dark:bg-gray-800'} ${key === dayKey() ? 'outline-2 outline-offset-2 outline-dashed outline-emerald-600' : ''}`} />
                            );
                        })}
                    </ol>
                </section>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Cursos completados</p>
                        <p className="text-3xl font-bold">{done.length}<span className="text-base text-gray-500"> / {COURSES.length}</span></p>
                        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full mt-3 overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} /></div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Juegos jugados</p>
                        <p className="text-3xl font-bold">{played.length}<span className="text-base text-gray-500"> / {GAMES.length}</span></p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Puntos (mejores marcas)</p>
                        <p className="text-3xl font-bold">{Object.values(scores).reduce((s, e) => s + e.best, 0)}</p>
                    </div>
                </div>

                <section className="mb-12">
                    <h2 className="text-xl font-bold mb-4">Cursos completados</h2>
                    {done.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400">Todavía ninguno. Al terminar un curso, pulsa "Marcar como completado". <Link href="/rutas" className="text-emerald-700 dark:text-emerald-400 underline">Elige una ruta</Link> para empezar.</p>
                    ) : (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {done.map((c) => (
                                <li key={c.slug}>
                                    <Link href={coursePath(c)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden /> {c.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="mb-12">
                    <h2 className="text-xl font-bold mb-4">Récords en los juegos</h2>
                    {played.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400">Aún no has jugado. <Link href="/juegos" className="text-emerald-700 dark:text-emerald-400 underline">Prueba un juego</Link>.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead><tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-800"><th className="py-2 font-medium">Juego</th><th className="py-2 font-medium">Récord</th><th className="py-2 font-medium hidden sm:table-cell">Partidas</th></tr></thead>
                            <tbody>
                                {played.map((g) => {
                                    const s = scores[g.slug];
                                    return (
                                        <tr key={g.slug} className="border-b border-gray-100 dark:border-gray-800">
                                            <td className="py-2.5"><Link href={`/juegos/${g.slug}`} className="hover:underline">{g.title}</Link></td>
                                            <td className="py-2.5"><span className="inline-flex items-center gap-1"><Trophy className="h-3.5 w-3.5 text-amber-500" aria-hidden />{s.best} / {s.max}</span></td>
                                            <td className="py-2.5 hidden sm:table-cell">{s.plays}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </section>

                {(done.length > 0 || played.length > 0) && (
                    confirm ? (
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm">¿Seguro? No se puede deshacer.</span>
                            <button type="button" onClick={() => { resetProgress(); setConfirm(false); }} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold">Sí, borrar</button>
                            <button type="button" onClick={() => setConfirm(false)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm">Cancelar</button>
                        </div>
                    ) : (
                        <button type="button" onClick={() => setConfirm(true)} className="inline-flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:underline">
                            <Trash2 className="h-4 w-4" aria-hidden /> Borrar mi progreso
                        </button>
                    )
                )}
            </div>
        </AppLayout>
    );
}
