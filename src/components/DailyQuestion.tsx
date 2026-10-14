import { useMemo } from 'react';
import { CalendarDays, CheckCircle2, XCircle, Flame, ArrowRight } from 'lucide-react';
import { Link } from '@/lib/router';
import { GAMES, type Question } from '@/data/games';
import { courseBySlug, coursePath } from '@/data/courses';
import { answerDaily, dayKey, streak, useProgress } from '@/lib/progress';

/** Número estable a partir de un texto: la misma fecha da siempre la misma pregunta. */
function hash(s: string): number {
    let h = 2166136261;
    for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    return h >>> 0;
}

const POOL = GAMES.flatMap((g) => g.type === 'quiz' ? g.questions.map((q) => ({ q, game: g })) : []);

export function questionOfDay(date: string): { q: Question; game: (typeof GAMES)[number]; options: string[] } {
    const { q, game } = POOL[hash(date) % POOL.length];
    const seed = hash(date + q.question);
    const options = [...(q.options ?? [])].sort((a, b) => (hash(a + seed) % 997) - (hash(b + seed) % 997));
    return { q, game, options };
}

export default function DailyQuestion() {
    const today = dayKey();
    const { daily, days } = useProgress();
    const { q, game, options } = useMemo(() => questionOfDay(today), [today]);
    const answered = daily?.date === today ? daily : null;
    const course = courseBySlug(game.course);
    const racha = streak(days);

    return (
        <section aria-labelledby="pregunta-dia" className="rounded-3xl border-2 border-emerald-600/30 dark:border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                    <CalendarDays className="h-4 w-4" aria-hidden />
                    <span id="pregunta-dia">Pregunta del día</span>
                    <span className="font-normal text-gray-600 dark:text-gray-400">· {game.title.replace(/^Test de /, '')}</span>
                </p>
                <p className="inline-flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300" title="Días seguidos estudiando">
                    <Flame className={`h-4 w-4 ${racha ? 'text-orange-500' : 'text-gray-400'}`} aria-hidden />
                    {racha ? `Racha de ${racha} ${racha === 1 ? 'día' : 'días'}` : 'Empieza tu racha hoy'}
                </p>
            </div>
            <p className="text-lg sm:text-xl font-bold mb-5">{q.question}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {options.map((o) => {
                    const isAnswer = o === q.answer;
                    const picked = answered?.given === o;
                    const cls = !answered
                        ? 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-emerald-500'
                        : isAnswer ? 'border-emerald-600 bg-emerald-100 dark:bg-emerald-900/40'
                            : picked ? 'border-red-500 bg-red-50 dark:bg-red-950/40' : 'border-gray-200 dark:border-gray-800 opacity-60';
                    return (
                        <button key={o} type="button" disabled={!!answered} onClick={() => answerDaily(o, isAnswer)}
                                className={`text-left px-4 py-3 rounded-xl border-2 transition-colors flex items-center gap-2 ${cls}`}>
                            {answered && isAnswer && <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400 shrink-0" aria-label="Correcta" />}
                            {answered && picked && !isAnswer && <XCircle className="h-4 w-4 text-red-600 shrink-0" aria-label="Tu respuesta" />}
                            <span>{o}</span>
                        </button>
                    );
                })}
            </div>
            {answered && (
                <div className="mt-5" role="status">
                    <p className="font-semibold mb-1">{answered.correct ? '¡Correcto!' : 'Esta vez no.'} <span className="font-normal text-gray-700 dark:text-gray-300">{q.explanation}</span></p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Mañana hay otra.{' '}
                        {course && <Link href={coursePath(course)} className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400 hover:underline">Repasa {course.title} <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>}
                    </p>
                </div>
            )}
        </section>
    );
}
