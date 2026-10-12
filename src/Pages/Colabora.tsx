import AppLayout from '@/layouts/AppLayout';
import { Bug, FilePlus2, Share2, GitMerge } from 'lucide-react';
import { SITE } from '@/site';

const WAYS = [
    { icon: Bug, title: 'Avisa de un error', text: 'Si algo está mal explicado, desactualizado o no funciona, abre una incidencia describiendo dónde está.', cta: 'Abrir incidencia', href: `${SITE.repo}/-/issues/new` },
    { icon: GitMerge, title: 'Mejora una lección', text: 'Cada lección es un archivo del repositorio. Puedes editarlo desde la web de GitLab y enviar una merge request.', cta: 'Ver el código', href: SITE.repo },
    { icon: FilePlus2, title: 'Propón un curso nuevo', text: '¿Echas en falta un tema? Abre una incidencia con la propuesta o escribe tú la lección siguiendo la estructura de las demás.', cta: 'Proponer un tema', href: `${SITE.repo}/-/issues/new?issue[title]=${encodeURIComponent('Propuesta de curso: ')}` },
    { icon: Share2, title: 'Compártelo', text: 'Si te ha servido, compártelo con quien esté empezando. Es la mejor forma de que llegue a más gente.', cta: 'Copiar enlace', href: SITE.url },
];

export default function Colabora() {
    return (
        <AppLayout>
            <title>{`Colabora — ${SITE.name}`}</title>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Colabora</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl">
                    {SITE.name} es un proyecto abierto y sin ánimo de lucro. El contenido se publica con licencia {SITE.license}, así que puedes usarlo, adaptarlo y compartirlo citando la fuente.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {WAYS.map(({ icon: Icon, title, text, cta, href }) => (
                        <li key={title} className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col">
                            <Icon className="h-6 w-6 text-indigo-500 mb-3" aria-hidden />
                            <h2 className="font-bold text-lg mb-1.5">{title}</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex-1 mb-4">{text}</p>
                            {cta === 'Copiar enlace' ? (
                                <button type="button" onClick={(e) => { navigator.clipboard?.writeText(href); e.currentTarget.textContent = 'Enlace copiado'; }}
                                        className="self-start text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">{cta}</button>
                            ) : (
                                <a href={href} target="_blank" rel="noopener noreferrer" className="self-start text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">{cta} ↗</a>
                            )}
                        </li>
                    ))}
                </ul>

                <section className="mt-14">
                    <h2 className="text-xl font-bold mb-3">Cómo está hecho</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Es una web estática hecha con React, TypeScript, Vite y Tailwind CSS, publicada en GitLab Pages. No tiene servidor, base de datos ni cookies:
                        cada lección es un componente en <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">src/Pages/Lecciones</code> y el catálogo está en <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">src/data/courses.ts</code>.
                    </p>
                </section>
            </div>
        </AppLayout>
    );
}
