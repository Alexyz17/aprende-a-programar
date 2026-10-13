import AppLayout from '@/layouts/AppLayout';
import { Link } from '@/lib/router';
import { Gamepad2, Trophy, ListChecks, Code2, ArrowUpDown, Terminal } from 'lucide-react';
import { GAMES, GAME_TYPE_LABEL, DIFFICULTY_LABEL, type GameType } from '@/data/games';
import { useProgress } from '@/lib/progress';
import { SITE } from '@/site';

const TYPE_ICON: Record<GameType, typeof Code2> = {
    quiz: ListChecks,
    fill_code: Code2,
    order_blocks: ArrowUpDown,
    guess_output: Terminal,
};

const DIFF_CLASS = {
    easy: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30',
    medium: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30',
    hard: 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30',
};

export default function JuegosIndex() {
    const { scores } = useProgress();
    const totalBest = Object.values(scores).reduce((s, e) => s + e.best, 0);

    return (
        <AppLayout>
            <title>{`Juegos para practicar — ${SITE.name}`}</title>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                    <div>
                        <p className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-sm mb-2">
                            <Gamepad2 className="h-4 w-4" aria-hidden /> Practica jugando
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Juegos</h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            Tests, código para completar, bloques para ordenar y retos de "adivina la salida".
                            Cada respuesta se corrige al momento con su explicación. Sin tiempo límite y sin registro.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-amber-300/60 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-900/20 px-5 py-4 shrink-0">
                        <p className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-300"><Trophy className="h-4 w-4" aria-hidden /> Tus mejores puntuaciones</p>
                        <p className="text-2xl font-bold">{totalBest} puntos</p>
                    </div>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {GAMES.map((g) => {
                        const Icon = TYPE_ICON[g.type];
                        const max = g.questions.reduce((s, q) => s + q.points, 0);
                        const best = scores[g.slug]?.best;
                        return (
                            <li key={g.slug}>
                                <Link href={`/juegos/${g.slug}`}
                                      className="group h-full flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:border-emerald-400 dark:hover:border-emerald-700 hover:shadow-lg transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
                                            <Icon className="h-3.5 w-3.5" aria-hidden /> {GAME_TYPE_LABEL[g.type]}
                                        </span>
                                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${DIFF_CLASS[g.difficulty]}`}>{DIFFICULTY_LABEL[g.difficulty]}</span>
                                    </div>
                                    <h2 className="font-bold text-lg mb-1.5 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{g.title}</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 flex-1">{g.description}</p>
                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                        <span>{g.questions.length} preguntas · {max} puntos</span>
                                        {best !== undefined && <span className="font-semibold text-amber-600 dark:text-amber-400">Récord: {best}</span>}
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </AppLayout>
    );
}
