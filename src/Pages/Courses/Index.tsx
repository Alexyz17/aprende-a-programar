import AppLayout from '@/layouts/AppLayout';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { COURSES, CATEGORIES, type Level } from '@/data/courses';
import CourseCard from '@/components/CourseCard';
import { SITE } from '@/site';
import { Link } from '@/lib/router';

const LEVELS: (Level | 'Todos')[] = ['Todos', 'Básico', 'Intermedio', 'Avanzado'];

function readParam(name: string) {
    return new URLSearchParams(window.location.search).get(name) ?? '';
}

export default function CoursesIndex() {
    const [query, setQuery] = useState(readParam('q'));
    const [category, setCategory] = useState(readParam('categoria') || 'Todas');
    const [level, setLevel] = useState<Level | 'Todos'>('Todos');

    const categories = ['Todas', ...CATEGORIES.filter((c) => COURSES.some((x) => x.category === c))];

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
        return COURSES.filter((c) => {
            if (category !== 'Todas' && c.category !== category) return false;
            if (level !== 'Todos' && c.level !== level) return false;
            if (!q) return true;
            const hay = `${c.title} ${c.description} ${c.category}`.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
            return q.split(/\s+/).every((w) => hay.includes(w));
        });
    }, [query, category, level]);

    return (
        <AppLayout>
            <title>{`Todos los cursos — ${SITE.name}`}</title>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Todos los cursos</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
                    {COURSES.length} cursos gratuitos y abiertos. Si no sabes por dónde empezar, mira las <Link href="/rutas" className="text-indigo-600 dark:text-indigo-400 underline">rutas de aprendizaje</Link>.
                </p>

                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
                        <label htmlFor="buscar" className="sr-only">Buscar cursos</label>
                        <input id="buscar" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar: docker, react, sql…"
                               className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-indigo-500 outline-none" />
                    </div>
                    <div className="flex gap-2" role="group" aria-label="Nivel">
                        {LEVELS.map((l) => (
                            <button key={l} type="button" onClick={() => setLevel(l)} aria-pressed={level === l}
                                    className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors ${level === l
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Categoría">
                    {categories.map((c) => (
                        <button key={c} type="button" onClick={() => setCategory(c)} aria-pressed={category === c}
                                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${category === c
                                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-medium'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                            {c}
                        </button>
                    ))}
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4" aria-live="polite">{filtered.length} cursos</p>
                {filtered.length === 0 ? (
                    <p className="py-16 text-center text-gray-500">No hay cursos que coincidan con la búsqueda.</p>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map((c) => <li key={c.slug}><CourseCard course={c} /></li>)}
                    </ul>
                )}
            </div>
        </AppLayout>
    );
}
