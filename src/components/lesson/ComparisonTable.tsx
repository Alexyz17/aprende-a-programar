interface ComparisonTableProps {
    headers: string[];
    rows: string[][];
    caption?: string;
}

export default function ComparisonTable({ headers, rows, caption }: ComparisonTableProps) {
    return (
        <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg">
            <table className="w-full min-w-max text-sm">
                {caption && (
                    <caption className="mb-3 text-left text-xs font-medium uppercase tracking-widest text-slate-600 dark:text-slate-500 px-4 pt-3">
                        {caption}
                    </caption>
                )}
                <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                        {headers.map((header, i) => (
                            <th
                                key={i}
                                className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider
                                            ${i === 0 ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-400'}`}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-[#0d1117] divide-y divide-slate-200 dark:divide-slate-800/60">
                    {rows.map((row, ri) => (
                        <tr
                            key={ri}
                            className="transition-colors hover:bg-slate-800/40 group"
                        >
                            {row.map((cell, ci) => (
                                <td
                                    key={ci}
                                    className={`px-5 py-3.5 leading-relaxed
                                                ${ci === 0
                                                    ? 'font-mono text-indigo-700 dark:text-indigo-300 font-medium text-xs'
                                                    : 'text-slate-700 dark:text-slate-300'
                                                }`}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
