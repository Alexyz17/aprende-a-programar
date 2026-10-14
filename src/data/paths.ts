export interface LearningPath {
    slug: string;
    title: string;
    description: string;
    goal: string;
    courses: string[];
}

/** Itinerarios recomendados. Los cursos se muestran en este orden. */
export const PATHS: LearningPath[] = [
    {
        slug: 'desde-cero',
        title: 'Nunca he programado',
        description: 'Para quien parte de cero absoluto: qué es programar, cómo piensa un ordenador y tus primeras herramientas.',
        goal: 'Entender los conceptos básicos y escribir tus primeros programas con confianza.',
        courses: ['programar-desde-cero', 'linux-esencial', 'git-esencial', 'python-basico', 'html-css'],
    },
    {
        slug: 'frontend',
        title: 'Desarrollo frontend',
        description: 'Construye interfaces web modernas, accesibles y rápidas.',
        goal: 'Crear aplicaciones web con React y TypeScript listas para producción.',
        courses: ['html-css', 'tailwind-css', 'accesibilidad-web', 'javascript-moderno', 'typescript-basico', 'react-basico', 'react-avanzado', 'nextjs', 'vuejs', 'testing'],
    },
    {
        slug: 'backend-php',
        title: 'Backend con PHP y Laravel',
        description: 'Desde PHP puro hasta APIs profesionales con Laravel.',
        goal: 'Desarrollar y desplegar una API REST con autenticación, base de datos y tests.',
        courses: ['php-basico', 'sql-basico', 'laravel', 'eloquent', 'apis-rest', 'laravel-inertia-react', 'seguridad-web', 'testing'],
    },
    {
        slug: 'full-stack',
        title: 'Full stack Laravel + React',
        description: 'El camino completo: base de datos, API, interfaz y despliegue.',
        goal: 'Llevar una aplicación de punta a punta, del modelo de datos al servidor.',
        courses: ['html-css', 'tailwind-css', 'javascript-moderno', 'typescript-basico', 'react-basico', 'php-basico', 'sql-basico', 'laravel', 'eloquent', 'laravel-inertia-react', 'apis-rest', 'react-avanzado', 'testing', 'git-esencial', 'docker'],
    },
    {
        slug: 'backend-node',
        title: 'Backend con Node.js',
        description: 'JavaScript también en el servidor.',
        goal: 'Crear APIs con Node.js y Express y conectarlas a una base de datos.',
        courses: ['javascript-moderno', 'typescript-basico', 'node-express', 'sql-basico', 'mongodb', 'postgresql-avanzado', 'redis-cache', 'testing'],
    },
    {
        slug: 'devops',
        title: 'DevOps y despliegue',
        description: 'Servidores, contenedores, integración continua y orquestación.',
        goal: 'Automatizar el despliegue de una aplicación y operarla en producción.',
        courses: ['linux-esencial', 'comandos-linux', 'shell-scripting', 'maquinas-virtuales', 'docker', 'github-actions', 'kubernetes', 'microservicios-diseno'],
    },
    {
        slug: 'datos-ia',
        title: 'Datos e inteligencia artificial',
        description: 'Python para datos, machine learning y modelos de lenguaje.',
        goal: 'Entrenar modelos sencillos e integrar IA en tus aplicaciones.',
        courses: ['python-basico', 'python-avanzado', 'sql-basico', 'excel-datos', 'power-bi', 'machine-learning', 'ia-programacion', 'fine-tuning', 'n8n'],
    },
    {
        slug: 'mobile',
        title: 'Apps móviles',
        description: 'Aplicaciones nativas para Android e iOS.',
        goal: 'Publicar tu primera app móvil.',
        courses: ['programar-desde-cero', 'git-esencial', 'kotlin-android', 'swift-ios'],
    },
    {
        slug: 'entrevistas',
        title: 'Preparar entrevistas técnicas',
        description: 'Lo que suelen preguntar en procesos para puestos junior.',
        goal: 'Resolver problemas de código y explicar tus decisiones con claridad.',
        courses: ['algoritmos', 'expresiones-regulares', 'git-esencial', 'sql-basico', 'seguridad-web', 'testing'],
    },
];
