import LessonLayout from '@/layouts/LessonLayout';
import { Head } from '@inertiajs/react';

const modules = [
    { id: '/lecciones/git-esencial', title: '¿Qué es Git y por qué?', free: true },
    { id: '/lecciones/git-esencial#basico', title: 'Init, add, commit', free: true },
    { id: '/lecciones/git-esencial#remoto', title: 'Push, pull y remotos', free: true },
    { id: '/lecciones/git-esencial#ramas', title: 'Branches y merge', free: true },
    { id: '/lecciones/git-esencial#conflictos', title: 'Resolver conflictos', free: true },
    { id: '/lecciones/git-esencial#flujo', title: 'Flujo de trabajo en equipo', free: true },
];

export default function GitEsencial() {
    return (
        <LessonLayout
            title="Git esencial"
            description="Control de versiones desde cero: init, commit, push, branches, merge y flujo de trabajo en equipo con GitHub."
            duration="2h 15min"
            lessons={11}
            level="Básico"
            premium={false}
            modules={modules}
            activeModule="/lecciones/git-esencial"
            category="Git"
        >
            <Head>
                <title>Git esencial — Aprende a Programar</title>
                <meta name="description" content="Aprende Git desde cero: commits, ramas, push, pull y flujo de trabajo en equipo. Curso gratuito 2026." />
            </Head>

            <h1>Git esencial</h1>

            <blockquote>
                Git es la herramienta más usada en el desarrollo de software — el 93% de los desarrolladores lo usan según Stack Overflow. No es opcional. Es el sistema que permite trabajar en equipo sin pisarse, volver atrás cuando algo se rompe y entender la historia de un proyecto.
            </blockquote>

            {/* ── 1. Qué es Git ── */}
            <h2 id="intro">¿Qué es Git y por qué usarlo?</h2>
            <p>
                Git es un <strong>sistema de control de versiones distribuido</strong>. Registra cada cambio en tu código a lo largo del tiempo, permitiéndote volver a cualquier estado anterior, trabajar en paralelo con tu equipo y entender quién cambió qué y por qué.
            </p>

            <h3>Conceptos fundamentales</h3>
            <ul>
                <li><strong>Repositorio (repo)</strong> — carpeta del proyecto con todo su historial de cambios</li>
                <li><strong>Commit</strong> — instantánea del código en un momento concreto con un mensaje explicativo</li>
                <li><strong>Branch (rama)</strong> — línea de desarrollo independiente, para trabajar sin afectar a main</li>
                <li><strong>Merge</strong> — incorporar los cambios de una rama a otra</li>
                <li><strong>Remote</strong> — copia del repositorio en un servidor (GitHub, GitLab, Bitbucket)</li>
                <li><strong>Clone</strong> — descargar una copia completa de un repositorio remoto</li>
            </ul>

            <h3>Configuración inicial (una sola vez)</h3>
            <pre><code>{`git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
git config --global core.editor "code --wait"    # VS Code como editor
git config --global init.defaultBranch main       # rama inicial = main
git config --global pull.rebase false             # merge al hacer pull

# Ver configuración actual
git config --list`}</code></pre>

            {/* ── 2. Init, add, commit ── */}
            <h2 id="basico">Init, add y commit — el ciclo básico</h2>

            <h3>Las tres zonas de Git</h3>
            <pre><code>{`# Working Directory → Staging Area → Repository
#
# Working Directory: archivos en tu carpeta (modificados, nuevos, eliminados)
# Staging Area:      archivos preparados para el próximo commit (git add)
# Repository:        historial de commits guardados (git commit)`}</code></pre>

            <h3>Crear o clonar un repositorio</h3>
            <pre><code>{`# Inicializar nuevo repo en la carpeta actual
git init

# Clonar repositorio existente
git clone https://github.com/usuario/proyecto.git
git clone https://github.com/usuario/proyecto.git mi-carpeta  # nombre personalizado

# Estado actual del repo
git status                    # archivos modificados, staged, sin seguimiento
git status -s                 # formato corto (M = modified, A = added, ? = untracked)`}</code></pre>

            <h3>Añadir archivos al staging y hacer commit</h3>
            <pre><code>{`# Añadir al staging
git add archivo.ts            # un archivo
git add src/                  # toda una carpeta
git add *.php                 # por patrón
git add .                     # todo lo modificado en el directorio actual
git add -p                    # interactivo: elegir qué partes añadir

# Ver qué está en staging
git diff --staged             # diferencia entre staging y último commit
git diff                      # diferencia entre working dir y staging

# Hacer commit
git commit -m "feat: añadir autenticación con JWT"
git commit                    # abre el editor (más espacio para el mensaje)

# Añadir y hacer commit en un paso (solo archivos ya rastreados)
git commit -am "fix: corregir validación de email"

# Estructura recomendada para mensajes (Conventional Commits)
# <tipo>(<ámbito>): <descripción>
# feat:     nueva funcionalidad
# fix:      corrección de bug
# docs:     documentación
# style:    formato sin cambios de lógica
# refactor: refactorización
# test:     añadir tests
# chore:    tareas de mantenimiento`}</code></pre>

            <h3>Ver el historial</h3>
            <pre><code>{`git log                       # historial completo
git log --oneline             # una línea por commit
git log --oneline --graph     # con árbol de ramas
git log -10                   # últimos 10 commits
git log --author="Ana"        # filtrar por autor
git log --since="2026-01-01"  # desde una fecha
git log -- src/archivo.ts     # commits que tocaron ese archivo

# Ver un commit concreto
git show abc1234              # cambios del commit con ese hash
git show HEAD                 # el commit más reciente
git show HEAD~2               # el commit de hace 2 posiciones`}</code></pre>

            {/* ── 3. Push y pull ── */}
            <h2 id="remoto">Push, pull y repositorios remotos</h2>
            <pre><code>{`# Conectar con un remoto (tras git init)
git remote add origin https://github.com/usuario/proyecto.git
git remote -v                 # ver remotos configurados

# Subir cambios al remoto
git push origin main          # empujar rama main
git push -u origin main       # -u establece el tracking (solo la primera vez)
git push                      # después de -u, basta con esto

# Descargar cambios del remoto
git pull                      # fetch + merge (o rebase si configurado)
git fetch origin              # descargar sin fusionar
git fetch --all               # descargar todos los remotos

# Ver diferencia entre local y remoto
git log origin/main..main     # commits locales no subidos
git log main..origin/main     # commits remotos no descargados`}</code></pre>

            {/* ── 4. Branches ── */}
            <h2 id="ramas">Branches — ramas de desarrollo</h2>
            <pre><code>{`# Listar ramas
git branch                    # ramas locales
git branch -r                 # ramas remotas
git branch -a                 # todas

# Crear y cambiar de rama
git branch feature/login      # crear rama
git checkout feature/login    # cambiar a ella
git checkout -b feature/login # crear y cambiar en un paso (clásico)
git switch -c feature/login   # moderno (Git 2.23+)
git switch main               # volver a main

# Eliminar ramas
git branch -d feature/login   # eliminar (solo si ya está mergeada)
git branch -D feature/login   # forzar eliminación
git push origin --delete feature/login  # eliminar en el remoto

# Renombrar rama
git branch -m viejo-nombre nuevo-nombre

# Estrategia de ramas recomendada (GitHub Flow)
# main                — siempre desplegable, protegida
# feature/descripcion — nueva funcionalidad
# fix/descripcion     — corrección de bug
# hotfix/descripcion  — corrección urgente en producción`}</code></pre>

            {/* ── 5. Conflictos ── */}
            <h2 id="conflictos">Merge y resolución de conflictos</h2>
            <pre><code>{`# Merge — incorporar cambios de una rama a otra
git switch main
git merge feature/login       # incorporar feature/login en main
git merge --no-ff feature/login  # siempre crear merge commit

# Cuando hay conflictos, Git marca los archivos:
# <<<<<<< HEAD
# código de tu rama actual (main)
# =======
# código de la rama que estás mergeando
# >>>>>>> feature/login

# Pasos para resolver:
# 1. git status  — ver archivos en conflicto
# 2. Editar cada archivo: decidir qué código conservar
# 3. git add <archivo>  — marcar como resuelto
# 4. git commit  — finalizar el merge

# Abortar un merge en medio de conflictos
git merge --abort

# Rebase — alternativa al merge (historial más limpio)
git switch feature/login
git rebase main      # aplica tus commits encima de main
# resuelve conflictos si los hay, luego:
git rebase --continue
# o para abortar:
git rebase --abort`}</code></pre>

            {/* ── 6. Flujo de trabajo ── */}
            <h2 id="flujo">Flujo de trabajo en equipo</h2>
            <pre><code>{`# Flujo típico con GitHub Flow

# 1. Actualizar main antes de empezar
git switch main
git pull

# 2. Crear rama para la nueva funcionalidad
git switch -c feature/registro-usuarios

# 3. Trabajar — múltiples commits pequeños y descriptivos
git add src/RegisterForm.tsx
git commit -m "feat: añadir formulario de registro"

git add src/api/auth.ts
git commit -m "feat: endpoint POST /api/register"

git add tests/register.test.ts
git commit -m "test: cobertura del flujo de registro"

# 4. Subir la rama al remoto y crear Pull Request
git push -u origin feature/registro-usuarios
# Luego abrir PR en GitHub para code review

# 5. Después de aprobación, merge y limpieza
git switch main
git pull
git branch -d feature/registro-usuarios

# Comandos útiles del día a día
git stash                     # guardar cambios sin hacer commit (trabajo en progreso)
git stash pop                 # recuperar los cambios guardados
git stash list                # ver todos los stashes

git reset HEAD~1              # deshacer el último commit (cambios vuelven a staging)
git reset --hard HEAD~1       # deshacer commit Y cambios (¡destructivo!)
git revert abc1234            # crear commit que deshace otro (seguro, sin reescribir historia)

# Ver quién cambió cada línea
git blame src/app.ts

# Buscar el commit que introdujo un bug
git bisect start
git bisect bad                # el commit actual tiene el bug
git bisect good v1.0          # en v1.0 funcionaba
# Git va haciendo bisección — marca cada punto como good/bad
git bisect reset              # salir`}</code></pre>

            <h3>Archivo .gitignore</h3>
            <pre><code>{`# .gitignore — archivos que Git debe ignorar

# Dependencias
node_modules/
vendor/

# Variables de entorno y secretos
.env
.env.local
*.env

# Archivos de build
dist/
build/
/public/hot

# Caché y logs
.cache/
*.log
storage/logs/

# Archivos del sistema operativo
.DS_Store
Thumbs.db

# IDEs
.idea/
.vscode/
*.swp`}</code></pre>

            <blockquote>
                <strong>Regla de oro:</strong> Haz commits pequeños y frecuentes con mensajes claros. Un commit que dice "fix bug" no te dice nada seis meses después. Un commit que dice "fix: prevenir XSS en comentarios del blog escapando el input del usuario" sí.
            </blockquote>

            <h2>Próximos pasos</h2>
            <p>
                Con Git básico dominado, el siguiente nivel es <strong>GitHub Actions</strong>: automatiza tests, builds y deploys cada vez que haces push o abres un Pull Request. CI/CD desde cero sin servidores que configurar.
            </p>
        </LessonLayout>
    );
}
