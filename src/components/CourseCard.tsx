import { Link } from '@/lib/router';
import { BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import { type Course, coursePath } from '@/data/courses';
import { useProgress } from '@/lib/progress';

const levelClass = {
    'Básico': 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30',
    'Intermedio': 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30',
    'Avanzado': 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30',
};

export default function CourseCard({ course }: { course: Course }) {
    const { completed } = useProgress();
    const done = completed.includes(course.slug);
    const Icon = course.icon;
    return (
        <Link href={coursePath(course)}
              className="group h-full flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:border-emerald-400 dark:hover:border-emerald-700 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
                <span className={`p-2.5 rounded-xl ${course.bg}`}><Icon className={`h-5 w-5 ${course.iconColor}`} aria-hidden /></span>
                <span className="flex items-center gap-2">
                    {done && <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-label="Completado" />}
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${levelClass[course.level]}`}>{course.level}</span>
                </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{course.category}</p>
            <h3 className="font-bold text-lg mb-1.5 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{course.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex-1 leading-relaxed">{course.description}</p>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" aria-hidden />{course.lessons} apartados</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden />{course.duration}</span>
            </div>
        </Link>
    );
}
