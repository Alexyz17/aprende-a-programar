import { BookMarked } from 'lucide-react';
import type { ReactNode } from 'react';

interface KeyConceptProps {
    term: string;
    definition: ReactNode;
    example?: string;
}

export default function KeyConcept({ term, definition, example }: KeyConceptProps) {
    return (
        <div className="my-5 rounded-xl border border-emerald-600/20 bg-emerald-50 dark:bg-emerald-950/20
                        border-l-4 border-l-emerald-600 overflow-hidden">
            <div className="flex items-start gap-3 px-5 py-4">
                <BookMarked className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800 dark:text-emerald-400" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="font-mono text-sm font-bold text-emerald-800 dark:text-emerald-300">{term}</span>
                        <span className="h-px flex-1 bg-emerald-50 dark:bg-emerald-900/40 hidden sm:block" />
                    </div>
                    <p className="mt-1.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{definition}</p>
                    {example && (
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-500 font-mono bg-slate-100 dark:bg-slate-900/60 rounded px-2.5 py-1.5 inline-block">
                            {example}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
