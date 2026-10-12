import AppLayout from '@/layouts/AppLayout';
import { Link } from '@/lib/router';
import { Home, Search } from 'lucide-react';
import { SITE } from '@/site';

export default function NotFound() {
    return (
        <AppLayout>
            <title>{`Página no encontrada — ${SITE.name}`}</title>
            <meta name="robots" content="noindex" />
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500 mb-4 leading-none">404</p>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-3">Página no encontrada</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">La página que buscas no existe o ha cambiado de dirección.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"><Home className="h-4 w-4" aria-hidden /> Ir al inicio</Link>
                        <Link href="/cursos" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 font-semibold"><Search className="h-4 w-4" aria-hidden /> Buscar un curso</Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
