import AppLayout from '@/layouts/AppLayout';
import { SITE } from '@/site';

export default function Privacidad() {
    return (
        <AppLayout>
            <title>{`Privacidad — ${SITE.name}`}</title>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-5 text-gray-700 dark:text-gray-300 leading-relaxed">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Privacidad</h1>
                <p><strong>Esta web no recoge datos personales.</strong> No hay registro, formularios, cookies de seguimiento, analítica ni publicidad.</p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">Qué se guarda en tu navegador</h2>
                <p>Para recordar tus preferencias y tu avance se usa el almacenamiento local del navegador (localStorage). Contiene solo:</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>el tema elegido (claro u oscuro),</li>
                    <li>los cursos que marcas como completados,</li>
                    <li>tus mejores puntuaciones en los juegos.</li>
                </ul>
                <p>Estos datos nunca salen de tu dispositivo. Puedes borrarlos desde "Mi progreso" o limpiando los datos del sitio en tu navegador.</p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">Servicios de terceros</h2>
                <p>La web se aloja en GitLab Pages, que puede registrar datos técnicos de las visitas (como la dirección IP) según su propia política de privacidad. La tipografía se sirve desde Bunny Fonts, que no usa cookies. Si una lección incluye un vídeo de YouTube, se carga solo al visitar esa lección.</p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">Contacto</h2>
                <p>Para cualquier duda, abre una incidencia en el <a href={SITE.repo} className="text-emerald-700 dark:text-emerald-400 underline" target="_blank" rel="noopener noreferrer">repositorio del proyecto</a>.</p>
            </div>
        </AppLayout>
    );
}
