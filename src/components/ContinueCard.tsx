import { ArrowRight, BookOpenCheck } from 'lucide-react';
import { Link } from '@/lib/router';
import { courseBySlug, coursePath } from '@/data/courses';
import { useProgress } from '@/lib/progress';

/** "Sigue donde lo dejaste": la última lección abierta y cuánto llevas leído. Solo aparece si has empezado algo. */
export default function ContinueCard() {
    const { last, read, completed } = useProgress();
    const course = last ? courseBySlug(last.slug) : undefined;
    if (!course || completed.includes(course.slug)) return null;
    const leidos = read[course.slug]?.length ?? 0;
    const total = Math.max(last!.sections, 1);
    const pct = Math.min(100, Math.round((leidos / total) * 100));
    const Icon = course.icon;

    return (
        <Link href={coursePath(course)}
              className="group flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-5 mb-6 hover:border-emerald-500 transition-colors">
            <span className={`shrink-0 h-12 w-12 rounded-xl flex items-center justify-center ${course.bg}`}>
                <Icon className={`h-6 w-6 ${course.iconColor}`} aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    <BookOpenCheck className="h-3.5 w-3.5" aria-hidden /> Sigue donde lo dejaste
                </span>
                <span className="block font-bold truncate">{course.title}</span>
                <span className="mt-1.5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="h-1.5 flex-1 max-w-48 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <span className="block h-full bg-emerald-500" style={{ width: `${pct}%` }} />
                    </span>
                    {leidos} de {total} apartados leídos
                </span>
            </span>
            <ArrowRight className="h-5 w-5 text-emerald-700 dark:text-emerald-400 shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden />
        </Link>
    );
}
