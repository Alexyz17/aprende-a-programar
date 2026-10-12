import AppLayout from '@/layouts/AppLayout';
import { Link } from '@/lib/router';
import { useMemo, useState, useRef, useEffect } from 'react';
import { CheckCircle2, XCircle, Trophy, RotateCcw, ChevronRight, ArrowUp, ArrowDown, ArrowLeft, BookOpen } from 'lucide-react';
import { gameBySlug, GAME_TYPE_LABEL, DIFFICULTY_LABEL, type Game, type Question } from '@/data/games';
import { courseBySlug } from '@/data/courses';
import { saveScore } from '@/lib/progress';
import { SITE } from '@/site';
import NotFound from '@/Pages/NotFound';

interface Result {
    correct: boolean;
    given: string;
}

const normalise = (s: string) => s.trim().replace(/\s+/g, ' ').replace(/^["'`]|["'`]$/g, '');

function isCorrect(q: Question, type: Game['type'], value: string | number[]): boolean {
    if (type === 'order_blocks') {
        const order = value as number[];
        return order.every((v, i) => v === i);
    }
    const given = normalise(String(value));
    const valid = [q.answer ?? '', ...(q.accept ?? [])].map(normalise);
    if (type === 'quiz') return valid.includes(given);
    // En código se perdonan los espacios alrededor de símbolos.
    const compact = (s: string) => s.replace(/\s*([(),;[\]{}=>])\s*/g, '$1');
    return valid.some((v) => compact(v) === compact(given) || v.toLowerCase() === given.toLowerCase() && /^(true|false|null)$/i.test(v));
}

/** Barajado determinista para que el orden no sea nunca el correcto. */
function shuffledIndexes(n: number, seed: number): number[] {
    const idx = Array.from({ length: n }, (_, i) => i);
    let s = seed + 1;
    for (let i = n - 1; i > 0; i--) {
        s = (s * 9301 + 49297) % 233280;
        const j = Math.floor((s / 233280) * (i + 1));
        [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    if (idx.every((v, i) => v === i)) idx.reverse();
    return idx;
}

function QuizInput({ q, seed, disabled, onSubmit, result }: { q: Question; seed: number; disabled: boolean; onSubmit: (v: string) => void; result?: Result }) {
    // Las opciones se barajan para que la correcta no esté siempre en el mismo sitio.
    const options = useMemo(() => {
        const opts = q.options ?? [];
        return shuffledIndexes(opts.length, seed * 31 + opts.length).map((i) => opts[i]);
    }, [q, seed]);
    return (
        <div className="space-y-3" role="group" aria-label="Opciones">
            {options.map((opt, i) => {
                const chosen = result?.given === opt;
                const right = disabled && opt === q.answer;
                let cls = 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20';
                if (disabled) {
                    if (right) cls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300';
                    else if (chosen) cls = 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
                    else cls = 'border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-500';
                }
                return (
                    <button key={opt} type="button" disabled={disabled} onClick={() => onSubmit(opt)}
                            className={`w-full text-left px-5 py-3.5 rounded-xl border transition-colors text-sm font-medium flex items-center gap-3 ${cls}`}>
                        <span className="w-6 h-6 rounded-full border border-current text-xs font-bold flex items-center justify-center shrink-0" aria-hidden>
                            {String.fromCharCode(65 + i)}
                        </span>
                        <span className="font-mono">{opt}</span>
                        {disabled && right && <CheckCircle2 className="h-4 w-4 ml-auto shrink-0" aria-label="Respuesta correcta" />}
                        {disabled && chosen && !right && <XCircle className="h-4 w-4 ml-auto shrink-0" aria-label="Tu respuesta" />}
                    </button>
                );
            })}
        </div>
    );
}

function TextInput({ q, type, disabled, onSubmit }: { q: Question; type: Game['type']; disabled: boolean; onSubmit: (v: string) => void }) {
    const [value, setValue] = useState('');
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => { ref.current?.focus(); }, [q]);
    const label = type === 'fill_code' ? 'Escribe lo que va en el hueco ___' : 'Escribe exactamente lo que se imprime';
    return (
        <div>
            <pre className="rounded-xl bg-slate-950 text-slate-100 border border-slate-800 p-4 text-sm overflow-x-auto mb-4 font-mono whitespace-pre">{q.question}</pre>
            <form onSubmit={(e) => { e.preventDefault(); if (value.trim()) onSubmit(value); }} className="flex flex-col sm:flex-row gap-3">
                <label className="sr-only" htmlFor="respuesta">{label}</label>
                <input id="respuesta" ref={ref} value={value} onChange={(e) => setValue(e.target.value)} disabled={disabled}
                       placeholder={label} autoComplete="off" spellCheck={false}
                       className="flex-1 font-mono text-sm px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-indigo-500 outline-none disabled:opacity-60" />
                <button type="submit" disabled={disabled || !value.trim()}
                        className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm disabled:opacity-50">
                    Comprobar
                </button>
            </form>
        </div>
    );
}

function OrderInput({ q, seed, disabled, onSubmit }: { q: Question; seed: number; disabled: boolean; onSubmit: (v: number[]) => void }) {
    const blocks = q.options ?? [];
    const [order, setOrder] = useState(() => shuffledIndexes(blocks.length, seed));
    const move = (pos: number, delta: number) => {
        const next = [...order];
        const target = pos + delta;
        if (target < 0 || target >= next.length) return;
        [next[pos], next[target]] = [next[target], next[pos]];
        setOrder(next);
    };
    return (
        <div>
            <ol className="space-y-2 mb-4">
                {order.map((blockIdx, pos) => {
                    const ok = disabled && blockIdx === pos;
                    return (
                        <li key={blockIdx} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                            disabled ? (ok ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-red-400 bg-red-50 dark:bg-red-900/20')
                                     : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
                            <span className="text-xs font-bold text-gray-500 w-5" aria-hidden>{pos + 1}</span>
                            <code className="flex-1 text-sm font-mono break-all">{blocks[blockIdx]}</code>
                            {!disabled && (
                                <span className="flex gap-1">
                                    <button type="button" onClick={() => move(pos, -1)} disabled={pos === 0} aria-label={`Subir "${blocks[blockIdx]}"`}
                                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                                    <button type="button" onClick={() => move(pos, 1)} disabled={pos === order.length - 1} aria-label={`Bajar "${blocks[blockIdx]}"`}
                                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
            {disabled && !order.every((v, i) => v === i) && (
                <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">Orden correcto:</p>
                    <ol className="list-decimal pl-6 space-y-1 text-sm font-mono">{blocks.map((b) => <li key={b}>{b}</li>)}</ol>
                </div>
            )}
            {!disabled && (
                <button type="button" onClick={() => onSubmit(order)} className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm">
                    Comprobar orden
                </button>
            )}
        </div>
    );
}

function Play({ game }: { game: Game }) {
    const [attempt, setAttempt] = useState(0);
    const [index, setIndex] = useState(0);
    const [results, setResults] = useState<Record<number, Result>>({});
    const [finished, setFinished] = useState<{ score: number; record: boolean } | null>(null);

    const max = useMemo(() => game.questions.reduce((s, q) => s + q.points, 0), [game]);
    const q = game.questions[index];
    const result = results[index];
    const answered = result !== undefined;
    const score = Object.entries(results).reduce((s, [i, r]) => s + (r.correct ? game.questions[Number(i)].points : 0), 0);

    const answer = (value: string | number[]) => {
        if (answered) return;
        setResults((prev) => ({ ...prev, [index]: { correct: isCorrect(q, game.type, value), given: Array.isArray(value) ? value.join(',') : value } }));
    };

    const next = () => {
        if (index < game.questions.length - 1) setIndex(index + 1);
        else setFinished({ score, record: saveScore(game.slug, score, max).isRecord });
    };

    const retry = () => {
        setAttempt((a) => a + 1);
        setIndex(0);
        setResults({});
        setFinished(null);
    };

    if (finished) {
        const pct = Math.round((finished.score / max) * 100);
        const course = courseBySlug(game.course);
        return (
            <div className="text-center max-w-lg mx-auto">
                <Trophy className="h-12 w-12 mx-auto text-amber-500 mb-4" aria-hidden />
                <h2 className="text-2xl font-bold mb-2">{pct >= 80 ? '¡Muy bien!' : pct >= 50 ? '¡Buen intento!' : 'Sigue practicando'}</h2>
                <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400 my-4">{finished.score}<span className="text-xl text-gray-500"> / {max}</span></p>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {Object.values(results).filter((r) => r.correct).length} de {game.questions.length} respuestas correctas ({pct} %).
                </p>
                {finished.record && finished.score > 0 && <p className="text-amber-600 dark:text-amber-400 font-semibold mb-2">¡Nuevo récord personal!</p>}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                    <button type="button" onClick={retry} className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-sm">
                        <RotateCcw className="h-4 w-4" aria-hidden /> Repetir
                    </button>
                    {course && (
                        <Link href={`/lecciones/${course.slug}`} className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm">
                            <BookOpen className="h-4 w-4" aria-hidden /> Repasar: {course.title}
                        </Link>
                    )}
                    <Link href="/juegos" className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-sm">Más juegos</Link>
                </div>
            </div>
        );
    }

    const showsCode = game.type === 'fill_code' || game.type === 'guess_output';

    return (
        <div key={`${attempt}-${index}`}>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span>Pregunta {index + 1} de {game.questions.length}</span>
                <span>{score} puntos</span>
            </div>
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-8"
                 role="progressbar" aria-valuemin={0} aria-valuemax={game.questions.length} aria-valuenow={index + (answered ? 1 : 0)}>
                <div className="h-full bg-indigo-500 transition-all" style={{ width: `${((index + (answered ? 1 : 0)) / game.questions.length) * 100}%` }} />
            </div>

            <h2 className="text-xl font-bold mb-6">
                {showsCode ? (game.type === 'fill_code' ? '¿Qué falta en el hueco ___?' : '¿Qué se imprime?') : q.question}
            </h2>

            {game.type === 'quiz' && <QuizInput q={q} seed={index + attempt * 13 + game.slug.length} disabled={answered} onSubmit={answer} result={result} />}
            {showsCode && <TextInput q={q} type={game.type} disabled={answered} onSubmit={answer} />}
            {game.type === 'order_blocks' && (
                <>
                    <OrderInput q={q} seed={index + attempt * 7} disabled={answered} onSubmit={answer} />
                </>
            )}

            <div aria-live="polite">
                {answered && (
                    <div className={`mt-6 rounded-xl border p-5 ${result.correct ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'border-red-400 bg-red-50 dark:bg-red-900/20'}`}>
                        <p className="flex items-center gap-2 font-bold mb-2">
                            {result.correct
                                ? <><CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden /> ¡Correcto! +{q.points} puntos</>
                                : <><XCircle className="h-5 w-5 text-red-600" aria-hidden /> No es correcto</>}
                        </p>
                        {!result.correct && q.answer && game.type !== 'quiz' && (
                            <p className="text-sm mb-2">Respuesta correcta: <code className="font-mono font-semibold">{q.answer}</code></p>
                        )}
                        <p className="text-sm text-gray-700 dark:text-gray-300">{q.explanation}</p>
                        <button type="button" onClick={next} autoFocus
                                className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm">
                            {index < game.questions.length - 1 ? 'Siguiente pregunta' : 'Ver resultado'} <ChevronRight className="h-4 w-4" aria-hidden />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function JuegosShow({ slug }: { slug: string }) {
    const game = gameBySlug(slug);
    if (!game) return <NotFound />;
    return (
        <AppLayout>
            <title>{`${game.title} — ${SITE.name}`}</title>
            <meta name="description" content={game.description} />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
                <Link href="/juegos" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6">
                    <ArrowLeft className="h-4 w-4" aria-hidden /> Todos los juegos
                </Link>
                <div className="mb-8">
                    <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">{GAME_TYPE_LABEL[game.type]} · Dificultad {DIFFICULTY_LABEL[game.difficulty].toLowerCase()}</p>
                    <h1 className="text-3xl font-extrabold tracking-tight mb-2">{game.title}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{game.description}</p>
                </div>
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-8">
                    <Play game={game} />
                </div>
            </div>
        </AppLayout>
    );
}
