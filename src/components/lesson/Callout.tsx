import { Info, AlertTriangle, Lightbulb, AlertOctagon } from 'lucide-react';
import type { ReactNode } from 'react';

type CalloutType = 'info' | 'warning' | 'tip' | 'danger';

interface CalloutProps {
    type?: CalloutType;
    title?: string;
    children: ReactNode;
}

const CONFIG: Record<CalloutType, {
    icon: typeof Info;
    label: string;
    border: string;
    bg: string;
    iconColor: string;
    titleColor: string;
}> = {
    info: {
        icon: Info,
        label: 'Nota',
        border: 'border-blue-500/40',
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        iconColor: 'text-blue-700 dark:text-blue-400',
        titleColor: 'text-blue-700 dark:text-blue-300',
    },
    warning: {
        icon: AlertTriangle,
        label: 'Atención',
        border: 'border-amber-500/40',
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        iconColor: 'text-amber-700 dark:text-amber-400',
        titleColor: 'text-amber-700 dark:text-amber-300',
    },
    tip: {
        icon: Lightbulb,
        label: 'Consejo',
        border: 'border-emerald-500/40',
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        iconColor: 'text-emerald-700 dark:text-emerald-400',
        titleColor: 'text-emerald-700 dark:text-emerald-300',
    },
    danger: {
        icon: AlertOctagon,
        label: 'Peligro',
        border: 'border-red-500/40',
        bg: 'bg-red-50 dark:bg-red-950/30',
        iconColor: 'text-red-700 dark:text-red-400',
        titleColor: 'text-red-700 dark:text-red-300',
    },
};

export default function Callout({ type = 'info', title, children }: CalloutProps) {
    const { icon: Icon, label, border, bg, iconColor, titleColor } = CONFIG[type];

    return (
        <div className={`my-6 flex gap-4 rounded-xl border ${border} ${bg} px-5 py-4`}>
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} aria-hidden="true" />
            <div className="min-w-0 flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <p className={`mb-1 font-semibold ${titleColor}`}>
                    {title ?? label}
                </p>
                {children}
            </div>
        </div>
    );
}
