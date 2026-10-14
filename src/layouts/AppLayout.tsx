import { Link, usePath } from '@/lib/router';
import { GraduationCap, Menu, X, Sun, Moon, Gamepad2, BookOpen, BarChart3, HeartHandshake, Map, Search } from 'lucide-react';
import { lazy, Suspense, useEffect, useState } from 'react';

const SearchPalette = lazy(() => import('@/components/SearchPalette'));
import { SITE } from '@/site';

function useTheme() {
    const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
    const toggle = () => {
        const next = !dark;
        document.documentElement.classList.toggle('dark', next);
        try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch { /* sin almacenamiento */ }
        setDark(next);
    };
    return { dark, toggle };
}

const NAV = [
    { href: '/cursos', label: 'Cursos', icon: BookOpen },
    { href: '/rutas', label: 'Rutas', icon: Map },
    { href: '/juegos', label: 'Juegos', icon: Gamepad2 },
    { href: '/progreso', label: 'Mi progreso', icon: BarChart3 },
    { href: '/colabora', label: 'Colabora', icon: HeartHandshake },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { dark, toggle } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const path = usePath();
    const isActive = (href: string) => path === href || path.startsWith(href + '/');
    const [searchOpen, setSearchOpen] = useState(false);

    // Ctrl+K / Cmd+K o "/" abren el buscador desde cualquier página.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const typing = (e.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]');
            if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
            <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] bg-emerald-700 text-white px-3 py-2 rounded-lg">
                Saltar al contenido
            </a>
            <header className="border-b border-gray-200 dark:border-gray-800 bg-white/85 dark:bg-gray-950/85 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
                            <GraduationCap className="h-6 w-6 text-emerald-600" aria-hidden />
                            <span>{SITE.name}</span>
                        </Link>

                        <nav aria-label="Principal" className="hidden md:flex items-center gap-1">
                            {NAV.map(({ href, label, icon: Icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    aria-current={isActive(href) ? 'page' : undefined}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                                        isActive(href)
                                            ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 font-medium'
                                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" aria-hidden />
                                    {label}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setSearchOpen(true)}
                                aria-label="Buscar (Ctrl + K)"
                                className="flex items-center gap-2 p-2 lg:pl-3 lg:pr-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 lg:border lg:border-gray-200 lg:dark:border-gray-800 transition-colors"
                            >
                                <Search className="h-5 w-5 lg:h-4 lg:w-4" aria-hidden />
                                <span className="hidden lg:inline text-sm">Buscar</span>
                                <kbd className="hidden lg:inline text-[0.65rem] font-mono border border-gray-300 dark:border-gray-700 rounded px-1">Ctrl K</kbd>
                            </button>
                            <button
                                type="button"
                                onClick={toggle}
                                aria-label={dark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>
                            <button
                                type="button"
                                className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                onClick={() => setMenuOpen(!menuOpen)}
                                aria-expanded={menuOpen}
                                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                            >
                                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {menuOpen && (
                    <nav aria-label="Principal (móvil)" className="md:hidden border-t border-gray-200 dark:border-gray-800 py-3 px-4 space-y-1 bg-white dark:bg-gray-950">
                        {NAV.map(({ href, label, icon: Icon }) => (
                            <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                                <Icon className="h-4 w-4" aria-hidden /> {label}
                            </Link>
                        ))}
                    </nav>
                )}
            </header>

            {searchOpen && <Suspense fallback={null}><SearchPalette onClose={() => setSearchOpen(false)} /></Suspense>}

            <main id="contenido" className="flex-1">{children}</main>

            <footer className="border-t border-gray-200 dark:border-gray-800 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
                        <div>
                            <div className="flex items-center gap-2 font-bold text-lg mb-3">
                                <GraduationCap className="h-5 w-5 text-emerald-600" aria-hidden />
                                <span>{SITE.name}</span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
                                {SITE.tagline} Sin registro, sin pagos y sin publicidad.
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">Aprende</p>
                            <ul className="space-y-2 text-sm">
                                {NAV.map(({ href, label }) => (
                                    <li key={href}><Link href={href} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">{label}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">Proyecto abierto</p>
                            <ul className="space-y-2 text-sm">
                                <li><a href={SITE.repo} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Código fuente</a></li>
                                <li><Link href="/privacidad" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Privacidad</Link></li>
                                <li><Link href="/licencia" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Licencia</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <p>
                            Contenido bajo licencia <a href={SITE.licenseUrl} className="underline" target="_blank" rel="noopener noreferrer">{SITE.license}</a> · código MIT
                        </p>
                        <p>Hecho por <a href={SITE.authorUrl} className="underline" target="_blank" rel="noopener noreferrer">{SITE.author}</a></p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
