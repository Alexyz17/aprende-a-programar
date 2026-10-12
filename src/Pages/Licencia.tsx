import AppLayout from '@/layouts/AppLayout';
import { SITE } from '@/site';

export default function Licencia() {
    return (
        <AppLayout>
            <title>{`Licencia — ${SITE.name}`}</title>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-5 text-gray-700 dark:text-gray-300 leading-relaxed">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Licencia</h1>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-2">Contenido de los cursos: {SITE.license}</h2>
                <p>
                    Los textos, ejemplos y ejercicios se publican con licencia <a href={SITE.licenseUrl} className="text-indigo-600 dark:text-indigo-400 underline" target="_blank" rel="noopener noreferrer">Creative Commons Atribución-CompartirIgual 4.0 Internacional</a>. Puedes:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Compartir</strong>: copiar y redistribuir el material en cualquier medio o formato.</li>
                    <li><strong>Adaptar</strong>: remezclar, transformar y crear a partir del material, incluso con fines comerciales.</li>
                </ul>
                <p>Siempre que <strong>cites la fuente</strong> ({SITE.name}, {SITE.url}) y compartas tus cambios con la misma licencia.</p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">Código de la web: MIT</h2>
                <p>El código fuente de la plataforma se publica con licencia MIT. Puedes reutilizarlo libremente conservando el aviso de copyright.</p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">Marcas</h2>
                <p>Los nombres de lenguajes, frameworks y productos (Linux, Docker, React, Laravel, etc.) pertenecen a sus respectivos propietarios y se usan solo para identificar la tecnología que se enseña.</p>
            </div>
        </AppLayout>
    );
}
