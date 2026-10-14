import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Search, BookOpen, Map, Gamepad2, Hash, CornerDownLeft } from 'lucide-react';
import { navigate } from '@/lib/router';
import { STATIC_ENTRIES, loadSections, search, type Entry, type HitKind } from '@/lib/search';

const KIND: Record<HitKind, { icon: typeof BookOpen; cls: string }> = {
    Curso: { icon: BookOpen, cls: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/40' },
    Ruta: { icon: Map, cls: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-900/40' },
    Juego: { icon: Gamepad2, cls: 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/40' },
    Apartado: { icon: Hash, cls: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800' },
};

const IDEAS = ['empezar desde cero', 'docker compose', 'useEffect', 'JOIN', 'DAX', 'git rebase'];

export default function SearchPalette({ onClose }: { onClose: () => void }) {
    const [q, setQ] = useState('');
    const [active, setActive] = useState(0);
    const [entries, setEntries] = useState<Entry[]>(STATIC_ENTRIES);
    const input = useRef<HTMLInputElement>(null);
    const listId = useId();

    useEffect(() => {
        const prev = document.activeElement as HTMLElement | null;
        input.current?.focus();
        loadSections().then((s) => setEntries([...STATIC_ENTRIES, ...s]));
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; prev?.focus(); };
    }, []);

    const hits = useMemo(() => search(entries, q), [entries, q]);
    useEffect(() => setActive(0), [q]);

    const go = (e: Entry | undefined) => {
        if (!e) return;
        onClose();
        navigate(e.href);
    };

    const onKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, hits.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
        else if (e.key === 'Enter') { e.preventDefault(); go(hits[active]); }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[12vh] bg-slate-950/60 backdrop-blur-sm"
             onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div role="dialog" aria-modal="true" aria-label="Buscar en la web" onKeyDown={onKey}
                 className="w-full max-w-xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-800">
                    <Search className="h-5 w-5 text-emerald-600 shrink-0" aria-hidden />
                    <input ref={input} value={q} onChange={(e) => setQ(e.target.value)}
                           role="combobox" aria-expanded={hits.length > 0} aria-controls={listId}
                           aria-activedescendant={hits.length ? `${listId}-${active}` : undefined}
                           aria-label="¿Qué quieres aprender hoy?" placeholder="¿Qué quieres aprender hoy?"
                           className="flex-1 bg-transparent py-4 text-base outline-none placeholder:text-gray-500" />
                    <kbd className="hidden sm:block text-[0.7rem] font-mono text-gray-500 border border-gray-300 dark:border-gray-700 rounded px-1.5 py-0.5">Esc</kbd>
                </div>

                {q.trim() === '' ? (
                    <div className="p-5 text-sm text-gray-600 dark:text-gray-400">
                        <p className="mb-3">Busca cursos, rutas, juegos o un apartado concreto de una lección. Prueba con:</p>
                        <div className="flex flex-wrap gap-2">
                            {IDEAS.map((i) => (
                                <button key={i} type="button" onClick={() => setQ(i)}
                                        className="px-3 py-1.5 rounded-full border border-dashed border-gray-300 dark:border-gray-700 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300">
                                    {i}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : hits.length === 0 ? (
                    <p className="p-5 text-sm text-gray-600 dark:text-gray-400" role="status">
                        Nada con «{q}». Prueba con otra palabra o <button type="button" className="underline text-emerald-700 dark:text-emerald-400" onClick={() => go({ kind: 'Curso', title: '', detail: '', href: '/cursos' })}>mira todos los cursos</button>.
                    </p>
                ) : (
                    <ul id={listId} role="listbox" aria-label="Resultados" className="max-h-[60vh] overflow-y-auto p-2">
                        {hits.map((h, i) => {
                            const { icon: Icon, cls } = KIND[h.kind];
                            return (
                                <li key={h.href + h.title} id={`${listId}-${i}`} role="option" aria-selected={i === active}
                                    onMouseMove={() => setActive(i)} onClick={() => go(h)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer ${i === active ? 'bg-emerald-50 dark:bg-emerald-900/25' : ''}`}>
                                    <span className={`shrink-0 inline-flex items-center gap-1 text-[0.7rem] font-semibold px-2 py-1 rounded-md ${cls}`}>
                                        <Icon className="h-3.5 w-3.5" aria-hidden />{h.kind}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block font-medium truncate">{h.title}</span>
                                        <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">{h.detail}</span>
                                    </span>
                                    {i === active && <CornerDownLeft className="h-4 w-4 text-gray-400 shrink-0" aria-hidden />}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
