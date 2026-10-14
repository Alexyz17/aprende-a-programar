import AppLayout from '@/layouts/AppLayout';
import { Link } from '@/lib/router';
import { ArrowRight, BookOpen, Gamepad2, Unlock, UserX, HeartHandshake, Map, Accessibility } from 'lucide-react';
import { COURSES, CATEGORIES } from '@/data/courses';
import { GAMES } from '@/data/games';
import { PATHS } from '@/data/paths';
import CourseCard from '@/components/CourseCard';
import { SITE } from '@/site';

const FEATURED = ['programar-desde-cero', 'html-css', 'javascript-moderno', 'python-basico', 'laravel', 'docker'];

const PRINCIPLES = [
    { icon: Unlock, title: 'Todo gratis, siempre', text: 'No hay planes de pago ni contenido bloqueado. Cada lección está completa.' },
    { icon: UserX, title: 'Sin registro', text: 'Entra y aprende. Tu progreso se guarda solo en tu navegador.' },
    { icon: Accessibility, title: 'Para todo el mundo', text: 'Lenguaje claro, explicaciones desde cero y una web accesible con teclado y lector de pantalla.' },
    { icon: HeartHandshake, title: 'Abierto', text: 'El contenido tiene licencia libre: puedes usarlo, compartirlo y mejorarlo.' },
];

export default function Home() {
    const featured = FEATURED.map((s) => COURSES.find((c) => c.slug === s)).filter((c) => c !== undefined);
    const categories = CATEGORIES.filter((cat) => COURSES.some((c) => c.category === cat));

    return (
        <AppLayout>
            <title>{`${SITE.name} — cursos de programación gratuitos y abiertos`}</title>

            {/* Portada */}
            <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.16),transparent_60%)]" aria-hidden />
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
                    <p className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full mb-6">
                        Gratis · Sin registro · Contenido abierto
                    </p>
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6">
                        Aprende a programar <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">desde cero</span>, a tu ritmo
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
                        {COURSES.length} cursos en español: de tu primer programa a desplegar aplicaciones en la nube. Sin pagos, sin anuncios y sin cuentas.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/lecciones/programar-desde-cero" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold">
                            Empieza aquí <ArrowRight className="h-4 w-4" aria-hidden />
                        </Link>
                        <Link href="/rutas" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold">
                            <Map className="h-4 w-4" aria-hidden /> Elige una ruta
                        </Link>
                    </div>
                    <dl className="mt-14 grid grid-cols-3 max-w-lg mx-auto gap-4">
                        <div><dt className="text-sm text-gray-500 dark:text-gray-400">Cursos</dt><dd className="text-3xl font-bold">{COURSES.length}</dd></div>
                        <div><dt className="text-sm text-gray-500 dark:text-gray-400">Rutas</dt><dd className="text-3xl font-bold">{PATHS.length}</dd></div>
                        <div><dt className="text-sm text-gray-500 dark:text-gray-400">Juegos</dt><dd className="text-3xl font-bold">{GAMES.length}</dd></div>
                    </dl>
                </div>
            </section>

            {/* Principios */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="sr-only">Cómo funciona</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PRINCIPLES.map(({ icon: Icon, title, text }) => (
                        <li key={title} className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                            <Icon className="h-6 w-6 text-emerald-600 mb-3" aria-hidden />
                            <h3 className="font-bold mb-1.5">{title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{text}</p>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Destacados */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-end justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Por dónde empezar</h2>
                        <p className="text-gray-600 dark:text-gray-400">Una selección para dar los primeros pasos.</p>
                    </div>
                    <Link href="/cursos" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline shrink-0">
                        Ver los {COURSES.length} cursos <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {featured.map((c) => <li key={c.slug}><CourseCard course={c} /></li>)}
                </ul>
            </section>

            {/* Categorías */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-2xl sm:text-3xl font-bold mb-8">Explora por tema</h2>
                <ul className="flex flex-wrap gap-3">
                    {categories.map((cat) => (
                        <li key={cat}>
                            <Link href={`/cursos?categoria=${encodeURIComponent(cat)}`}
                                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                                <BookOpen className="h-4 w-4 text-emerald-600" aria-hidden />
                                <span className="font-medium">{cat}</span>
                                <span className="text-xs text-gray-500">{COURSES.filter((c) => c.category === cat).length}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Juegos y colaborar */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-3xl bg-emerald-700 text-white p-8 sm:p-10">
                    <Gamepad2 className="h-8 w-8 mb-4" aria-hidden />
                    <h2 className="text-2xl font-bold mb-2">Practica con juegos</h2>
                    <p className="text-emerald-100 mb-6">Tests, código para completar y retos de "adivina la salida" con la explicación de cada respuesta.</p>
                    <Link href="/juegos" className="inline-flex items-center gap-2 bg-white text-emerald-800 font-semibold px-5 py-3 rounded-xl hover:bg-emerald-50">
                        Jugar <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                </div>
                <div className="rounded-3xl border border-gray-200 dark:border-gray-800 p-8 sm:p-10">
                    <HeartHandshake className="h-8 w-8 mb-4 text-emerald-600" aria-hidden />
                    <h2 className="text-2xl font-bold mb-2">Un proyecto abierto</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">¿Has encontrado un error o quieres añadir una lección? Todo el contenido está en un repositorio público y cualquiera puede proponer mejoras.</p>
                    <Link href="/colabora" className="inline-flex items-center gap-2 font-semibold px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                        Cómo colaborar <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                </div>
            </section>
        </AppLayout>
    );
}
