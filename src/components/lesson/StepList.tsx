import type { ReactNode } from 'react';

interface Step {
    title: string;
    description: ReactNode;
}

interface StepListProps {
    steps: Step[];
}

export default function StepList({ steps }: StepListProps) {
    return (
        <div className="my-6 space-y-0">
            {steps.map((step, index) => {
                const isLast = index === steps.length - 1;
                return (
                    <div key={index} className="flex gap-5">
                        {/* Step indicator + connector */}
                        <div className="flex flex-col items-center">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                                            bg-indigo-600 text-white text-sm font-bold shadow-md shadow-indigo-900/50
                                            ring-2 ring-indigo-500/30">
                                {index + 1}
                            </div>
                            {!isLast && (
                                <div className="mt-1 w-px flex-1 bg-gradient-to-b from-indigo-600/50 to-indigo-600/10 min-h-[2rem]" />
                            )}
                        </div>

                        {/* Content */}
                        <div className={`flex-1 min-w-0 pb-8 ${isLast ? 'pb-2' : ''}`}>
                            <h4 className="mb-1.5 text-base font-semibold text-slate-100 leading-snug">
                                {step.title}
                            </h4>
                            <div className="text-sm text-slate-700 dark:text-slate-400 leading-relaxed">
                                {step.description}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
