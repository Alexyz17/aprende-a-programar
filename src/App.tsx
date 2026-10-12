import { Suspense, lazy, type ComponentType } from 'react';
import { usePath, useInitialHashScroll } from '@/lib/router';
import { COURSES, coursePath } from '@/data/courses';
import AppLayout from '@/layouts/AppLayout';

const Home = lazy(() => import('@/Pages/Home'));
const CoursesIndex = lazy(() => import('@/Pages/Courses/Index'));
const Rutas = lazy(() => import('@/Pages/Rutas'));
const JuegosIndex = lazy(() => import('@/Pages/Juegos/Index'));
const JuegosShow = lazy(() => import('@/Pages/Juegos/Show'));
const Progreso = lazy(() => import('@/Pages/Progreso'));
const Colabora = lazy(() => import('@/Pages/Colabora'));
const Privacidad = lazy(() => import('@/Pages/Privacidad'));
const Licencia = lazy(() => import('@/Pages/Licencia'));
const NotFound = lazy(() => import('@/Pages/NotFound'));

const STATIC_ROUTES: Record<string, ComponentType> = {
    '/': Home,
    '/cursos': CoursesIndex,
    '/rutas': Rutas,
    '/juegos': JuegosIndex,
    '/progreso': Progreso,
    '/colabora': Colabora,
    '/privacidad': Privacidad,
    '/licencia': Licencia,
};

const LESSON_ROUTES: Record<string, ComponentType> = Object.fromEntries(COURSES.map((c) => [coursePath(c), c.page]));

function resolve(path: string): { Page: ComponentType; params: Record<string, string> } {
    if (STATIC_ROUTES[path]) return { Page: STATIC_ROUTES[path], params: {} };
    if (LESSON_ROUTES[path]) return { Page: LESSON_ROUTES[path], params: {} };
    const game = path.match(/^\/juegos\/([\w-]+)$/);
    if (game) return { Page: JuegosShow as unknown as ComponentType, params: { slug: game[1] } };
    return { Page: NotFound, params: {} };
}

function Loading() {
    return (
        <AppLayout>
            <div className="min-h-[50vh] flex items-center justify-center" role="status" aria-live="polite">
                <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                <span className="sr-only">Cargando…</span>
            </div>
        </AppLayout>
    );
}

export default function App() {
    const path = usePath();
    useInitialHashScroll();
    const { Page, params } = resolve(path);
    const AnyPage = Page as ComponentType<Record<string, string>>;
    return (
        <Suspense fallback={<Loading />}>
            <AnyPage key={path} {...params} />
        </Suspense>
    );
}
