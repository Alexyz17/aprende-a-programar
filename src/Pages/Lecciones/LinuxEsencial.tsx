import LessonLayout from '@/layouts/LessonLayout';
import { Head } from '@inertiajs/react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/lesson/Callout';
import StepList from '@/components/lesson/StepList';
import KeyConcept from '@/components/lesson/KeyConcept';
import ComparisonTable from '@/components/lesson/ComparisonTable';

const modules = [
    { id: '/lecciones/linux-esencial', title: '¿Qué es Linux?', free: true },
    { id: '/lecciones/linux-esencial#terminal', title: 'El terminal', free: true },
    { id: '/lecciones/linux-esencial#filesystem', title: 'Sistema de archivos', free: true },
    { id: '/lecciones/linux-esencial#archivos', title: 'Gestión de archivos', free: true },
    { id: '/lecciones/linux-esencial#permisos', title: 'Permisos', free: true },
    { id: '/lecciones/linux-esencial#usuarios', title: 'Usuarios y grupos', free: true },
    { id: '/lecciones/linux-esencial#procesos', title: 'Procesos y servicios', free: true },
    { id: '/lecciones/linux-esencial#redes', title: 'Redes y SSH', free: true },
];

export default function LinuxEsencial() {
    return (
        <LessonLayout
            title="Introducción a Linux"
            description="Aprende a moverte por la terminal, gestionar archivos y entender el sistema operativo más usado en servidores."
            duration="2h 30min"
            lessons={12}
            level="Básico"
            premium={false}
            modules={modules}
            activeModule="/lecciones/linux-esencial"
            nextHref="/lecciones/comandos-linux"
            category="Linux"
        >
            <Head>
                <title>Introducción a Linux — Aprende a Programar</title>
                <meta name="description" content="Aprende Linux desde cero: terminal, archivos, permisos, procesos y redes. Lección gratuita y actualizada 2026." />
            </Head>

            <h1>Introducción a Linux</h1>

            <blockquote>
                Linux ejecuta el <strong>96.4% de los servidores web del mundo</strong>, el 100% de los superordenadores del Top500 y es la base de Android, Docker y la nube. Aprenderlo no es opcional si quieres trabajar en tecnología.
            </blockquote>

            {/* ── 1. Qué es Linux ── */}
            <h2 id="que-es">¿Qué es Linux?</h2>
            <p>
                Linux es un <strong>kernel de sistema operativo</strong> de código abierto creado por Linus Torvalds en 1991. El kernel es la capa de software que comunica los programas con el hardware. Cuando decimos "sistema Linux" nos referimos en realidad a <strong>GNU/Linux</strong>: el kernel Linux más las herramientas GNU (ls, grep, bash…).
            </p>

            <KeyConcept
                term="Kernel"
                definition="El núcleo del sistema operativo. Gestiona la CPU, memoria RAM, dispositivos de entrada/salida y la comunicación entre hardware y software. Ningún programa de usuario accede al hardware directamente — todo pasa por el kernel."
                example="uname -r  →  6.8.0-51-generic"
            />

            <KeyConcept
                term="Distribución (distro)"
                definition="Un sistema operativo completo formado por el kernel Linux + herramientas de sistema GNU + gestor de paquetes + entorno de escritorio opcional. Cada distro toma decisiones diferentes sobre qué incluir y cómo configurarlo."
            />

            <h3>¿Por qué tantos servidores usan Linux?</h3>

            <ComparisonTable
                headers={['Ventaja', 'Descripción']}
                rows={[
                    ['Gratuito', 'Sin licencias de miles de euros por servidor. Ubuntu Server: 0 €.'],
                    ['Estable', 'Servidores con años de uptime sin reinicios. Actualizaciones sin parar servicios.'],
                    ['Seguro', 'Modelo de permisos granular, ampliamente auditado por la comunidad global.'],
                    ['Eficiente', 'Consume muchísimos menos recursos que Windows Server. Ideal para VPS pequeños.'],
                    ['Automatizable', 'Todo se puede scripting desde la terminal. Sin dependencia de GUIs.'],
                    ['Universal', 'Mismo sistema en tu VPS, en Docker, en Raspberry Pi y en los supercomputadores.'],
                ]}
                caption="Por qué Linux domina los servidores"
            />

            <h3>Distribuciones populares en 2026</h3>
            <p>
                Estas son las distros que encontrarás en la práctica real:
            </p>
            <ul>
                <li><strong>Ubuntu 24.04 LTS</strong> — la más usada para desarrollo y servidores (soporte hasta 2029)</li>
                <li><strong>Debian 12 "Bookworm"</strong> — la base estable que usa Ubuntu, ultra conservadora</li>
                <li><strong>Alpine Linux</strong> — ultra ligera, la reina de los contenedores Docker (solo 5 MB)</li>
                <li><strong>CentOS Stream 10</strong> — para entornos enterprise RHEL-compatibles</li>
                <li><strong>Arch Linux</strong> — para usuarios avanzados que quieren control total</li>
            </ul>

            <Callout type="tip" title="¿Qué distro aprender?">
                Para empezar, usa <strong>Ubuntu 24.04 LTS</strong>. Es la más documentada, la que usan la mayoría de tutoriales y la que encontrarás en la mayoría de proveedores cloud (AWS, DigitalOcean, Hetzner). Cuando domines Linux, el salto a otra distro es trivial.
            </Callout>

            {/* ── 2. El terminal ── */}
            <h2 id="terminal">El terminal</h2>
            <p>
                El terminal (o shell) es la interfaz de texto para interactuar con Linux. Es mucho más potente que cualquier interfaz gráfica porque permite automatizar, encadenar comandos y gestionar servidores remotos sin escritorio.
            </p>
            <p>
                El shell más común es <strong>Bash</strong> (Bourne Again SHell). En macOS y muchas distros modernas también verás <strong>Zsh</strong>.
            </p>

            <KeyConcept
                term="Shell"
                definition="Programa que interpreta tus comandos y se los pasa al kernel. El shell lee lo que escribes, lo analiza y ejecuta el programa correspondiente. Bash es el más extendido; Zsh y Fish añaden mejoras de ergonomía."
                example="echo $SHELL  →  /bin/bash"
            />

            <h3>Anatomía de un comando</h3>
            <CodeBlock
                language="bash"
                filename="Estructura de un comando"
                code={`comando [opciones] [argumentos]

ls -la /var/log
│   │    └── argumento: directorio a listar
│   └──────── opciones: -l (formato largo) -a (incluir ocultos)
└──────────── comando: listar archivos`}
            />

            <h3>Orientarte en el sistema</h3>
            <CodeBlock
                language="bash"
                code={`pwd                  # Print Working Directory — dónde estás
ls                   # Listar archivos del directorio actual
ls -la               # Con detalles + archivos ocultos
ls -lh               # Tamaño en formato legible (K, M, G)
ls -lt               # Ordenado por fecha de modificación
cd /var/www          # Cambiar a ruta absoluta
cd carpeta           # Entrar a subcarpeta
cd ..                # Subir un nivel
cd ~                 # Ir al home del usuario
cd -                 # Volver al directorio anterior
which bash           # Ver ruta de un comando`}
            />

            <h3>Ayuda integrada</h3>
            <CodeBlock
                language="bash"
                code={`man ls               # Manual completo del comando (q para salir)
ls --help            # Ayuda resumida
tldr ls              # Ejemplos prácticos (instalar: npm i -g tldr)`}
            />

            <Callout type="info" title="Completado automático con Tab">
                Pulsa <code>Tab</code> para autocompletar comandos, rutas y argumentos. Pulsa dos veces si hay varias opciones — el shell las listará. Este truco multiplica tu velocidad en el terminal.
            </Callout>

            {/* ── 3. Sistema de archivos ── */}
            <h2 id="filesystem">El sistema de archivos de Linux</h2>
            <p>
                Linux usa una jerarquía de directorios estándar definida por el <strong>FHS (Filesystem Hierarchy Standard)</strong>. Todo parte de la raíz <code>/</code> — no hay letras de unidad como en Windows.
            </p>

            <ComparisonTable
                headers={['Directorio', 'Contenido']}
                rows={[
                    ['/etc', 'Archivos de configuración del sistema y servicios'],
                    ['/var/log', 'Logs del sistema, nginx, mysql, aplicaciones…'],
                    ['/var/www', 'Raíz convencional para sitios web (Apache/Nginx)'],
                    ['/home/usuario', 'Directorio personal de cada usuario'],
                    ['/tmp', 'Archivos temporales (se borran en cada reinicio)'],
                    ['/usr/bin', 'Ejecutables del sistema instalados por paquetes'],
                    ['/usr/local/bin', 'Ejecutables instalados manualmente por el admin'],
                    ['/proc', 'Sistema de archivos virtual con info del kernel en tiempo real'],
                    ['/sys', 'Interfaz virtual al kernel para hardware y drivers'],
                ]}
                caption="Directorios importantes del FHS"
            />

            <CodeBlock
                language="bash"
                filename="Explorar el filesystem"
                code={`ls /                 # Ver la raíz del sistema
ls /etc              # Ver configuraciones del sistema
ls /var/log          # Ver directorio de logs
du -sh /var/log/*    # Tamaño de cada log
df -h                # Espacio libre en cada partición`}
            />

            {/* ── 4. Gestión de archivos ── */}
            <h2 id="archivos">Gestión de archivos</h2>

            <h3>Crear y ver archivos</h3>
            <CodeBlock
                language="bash"
                code={`mkdir proyecto          # Crear directorio
mkdir -p a/b/c          # Crear estructura anidada de una vez
touch index.php         # Crear archivo vacío (o actualizar fecha)
echo "Hola" > f.txt     # Crear archivo con contenido (sobreescribe)
echo "Más" >> f.txt     # Añadir al final (append, no sobreescribe)
cat f.txt               # Ver contenido completo
less f.txt              # Ver paginado (q para salir, / para buscar)
head -n 20 f.txt        # Primeras 20 líneas
tail -n 20 f.txt        # Últimas 20 líneas
tail -f /var/log/syslog # Seguir log en tiempo real`}
            />

            <h3>Copiar, mover y eliminar</h3>
            <CodeBlock
                language="bash"
                code={`cp origen.txt destino.txt      # Copiar archivo
cp -r dir_origen dir_destino   # Copiar directorio completo
cp -p archivo.txt copia.txt    # Preservar permisos y fechas
mv origen destino              # Mover o renombrar
rm archivo.txt                 # Eliminar archivo
rm -rf carpeta/                # Eliminar directorio y todo su contenido`}
            />

            <Callout type="danger" title="rm -rf no tiene marcha atrás">
                Linux no tiene papelera de reciclaje en el terminal. <code>rm -rf</code> elimina permanentemente sin confirmación. Antes de ejecutarlo, verifica siempre la ruta exacta con <code>ls</code>. Nunca ejecutes <code>rm -rf /</code> — borra todo el sistema.
            </Callout>

            <h3>Buscar archivos</h3>
            <CodeBlock
                language="bash"
                code={`find / -name "*.log"             # Buscar archivos por nombre
find /var -type f -size +100M   # Archivos mayores de 100 MB
find . -name "*.php" -mtime -7  # PHP modificados en últimos 7 días
find . -name "*.tmp" -delete    # Buscar y borrar de una vez
grep -r "error" /var/log/       # Buscar texto dentro de archivos
grep -rn "función" src/         # Con número de línea`}
            />

            {/* ── 5. Permisos ── */}
            <h2 id="permisos">Permisos en Linux</h2>
            <p>
                Linux usa un sistema de permisos basado en tres tipos de acceso (<strong>r</strong>ead, <strong>w</strong>rite, e<strong>x</strong>ecute) para tres categorías de usuarios (propietario, grupo, otros).
            </p>

            <h3>Leer los permisos</h3>
            <CodeBlock
                language="bash"
                filename="Interpretar ls -la"
                code={`ls -la
# -rwxr-xr-- 1 alex devs archivo.txt
# │└──┘└──┘└──┘
# │  │   │   └── Otros:       r-- = solo lectura (4)
# │  │   └────── Grupo:       r-x = lectura + ejecución (5)
# │  └────────── Propietario: rwx = todo (7)
# └──────────── Tipo: - archivo, d directorio, l symlink`}
            />

            <h3>Cambiar permisos con chmod</h3>
            <CodeBlock
                language="bash"
                code={`# Notación numérica: r=4, w=2, x=1
chmod 755 script.sh    # rwxr-xr-x → propietario todo, grupo y otros leer+ejecutar
chmod 644 config.php   # rw-r--r-- → propietario leer+escribir, resto solo leer
chmod 600 .env         # rw------- → solo el propietario puede leer/escribir
chmod +x deploy.sh     # Añadir permiso de ejecución
chmod -w readonly.txt  # Quitar permiso de escritura
chmod -R 755 public/   # Aplicar recursivamente`}
            />

            <ComparisonTable
                headers={['Octal', 'Binario', 'Permisos', 'Uso típico']}
                rows={[
                    ['777', 'rwxrwxrwx', 'Todos pueden todo', 'Nunca usar en producción'],
                    ['755', 'rwxr-xr-x', 'Propietario todo, resto leer+ejecutar', 'Directorios, scripts públicos'],
                    ['644', 'rw-r--r--', 'Propietario leer+escribir, resto solo leer', 'Archivos de contenido web'],
                    ['600', 'rw-------', 'Solo propietario puede leer y escribir', 'Claves SSH, .env, secretos'],
                    ['400', 'r--------', 'Solo propietario puede leer', 'Claves privadas SSH'],
                ]}
                caption="Permisos más comunes"
            />

            <h3>Cambiar propietario con chown</h3>
            <CodeBlock
                language="bash"
                code={`chown alex archivo.txt          # Cambiar propietario
chown alex:developers f.txt    # Cambiar propietario y grupo
chown -R www-data /var/www/    # Recursivo (típico en servidores web)
sudo chown root:root /etc/hosts`}
            />

            <Callout type="tip" title="www-data en servidores web">
                Nginx y Apache corren como el usuario <code>www-data</code>. Los archivos de tu aplicación web deben pertenecer a este usuario para que el servidor pueda leerlos. Usa <code>chown -R www-data:www-data /var/www/mi-app</code> después de subir archivos.
            </Callout>

            {/* ── 6. Usuarios y grupos ── */}
            <h2 id="usuarios">Usuarios y grupos</h2>
            <p>
                Linux es un sistema multiusuario. Cada proceso corre con los permisos de un usuario concreto. El usuario <strong>root</strong> tiene acceso total — evita usarlo directamente en favor de <code>sudo</code>.
            </p>

            <KeyConcept
                term="sudo"
                definition="Permite ejecutar un comando concreto con privilegios de root sin iniciar sesión como root. Cada uso queda registrado en los logs del sistema, lo que mejora la auditoría de seguridad."
                example="sudo systemctl restart nginx"
            />

            <CodeBlock
                language="bash"
                filename="Gestión de usuarios"
                code={`whoami                         # Ver con qué usuario estoy
id                             # UID, GID y grupos del usuario actual
id alex                        # Info de otro usuario
groups                         # Grupos del usuario actual

# Gestionar usuarios (requiere sudo)
sudo adduser alex              # Crear usuario interactivo (Ubuntu)
sudo useradd -m alex           # Crear usuario (más bajo nivel)
sudo passwd alex               # Cambiar contraseña
sudo userdel -r alex           # Eliminar usuario y su home

# Gestionar grupos
sudo groupadd developers       # Crear grupo
sudo usermod -aG docker alex   # Añadir alex al grupo docker (sin quitar otros)
sudo gpasswd -d alex docker    # Eliminar alex del grupo docker`}
            />

            <CodeBlock
                language="bash"
                filename="Escalar privilegios"
                code={`sudo comando               # Ejecutar como root
sudo -u www-data comando   # Ejecutar como otro usuario
sudo -i                    # Shell interactivo como root (usar con cuidado)
su - alex                  # Cambiar al usuario alex
exit                       # Volver al usuario anterior`}
            />

            <StepList
                steps={[
                    {
                        title: 'Crea un usuario para tu aplicación',
                        description: (
                            <p>
                                Nunca corras tu app como root. Crea un usuario específico con <code>sudo adduser appuser</code> y solo dale los permisos estrictamente necesarios.
                            </p>
                        ),
                    },
                    {
                        title: 'Añádelo al grupo sudo solo si es necesario',
                        description: (
                            <p>
                                <code>sudo usermod -aG sudo appuser</code>. El grupo <code>sudo</code> permite usar sudo. En servidores de producción, limita quién tiene acceso sudo.
                            </p>
                        ),
                    },
                    {
                        title: 'Configura autenticación por clave SSH',
                        description: (
                            <p>
                                Deshabilita el login por contraseña. Solo claves SSH. Edita <code>/etc/ssh/sshd_config</code> y establece <code>PasswordAuthentication no</code>.
                            </p>
                        ),
                    },
                    {
                        title: 'Aplica el principio de mínimo privilegio',
                        description: (
                            <p>
                                Cada usuario y servicio solo debe tener acceso a lo que necesita para funcionar. Ni más ni menos.
                            </p>
                        ),
                    },
                ]}
            />

            {/* ── 7. Procesos ── */}
            <h2 id="procesos">Procesos y servicios</h2>

            <KeyConcept
                term="PID"
                definition="Process ID — número único que el kernel asigna a cada proceso en ejecución. El proceso inicial (init o systemd) siempre tiene PID 1. Todo proceso tiene un PID padre (PPID)."
                example="ps aux | grep nginx  →  muestra el PID de cada proceso nginx"
            />

            <h3>Ver procesos</h3>
            <CodeBlock
                language="bash"
                code={`ps aux                  # Listar todos los procesos
ps aux | grep nginx     # Filtrar por nombre
top                     # Monitor dinámico (q para salir, k para matar)
htop                    # Monitor mejorado y visual (apt install htop)
pgrep nginx             # Solo los PIDs de procesos por nombre`}
            />

            <h3>Controlar procesos</h3>
            <CodeBlock
                language="bash"
                code={`kill 1234               # Enviar SIGTERM al proceso (pídele que acabe)
kill -9 1234            # SIGKILL: forzar terminación inmediata (sin cleanup)
pkill nginx             # Terminar todos los procesos por nombre
killall php-fpm         # Similar a pkill

# Procesos en background
comando &               # Ejecutar en segundo plano
Ctrl+Z                  # Suspender proceso actual
bg                      # Reanudar en background
fg                      # Traer al foreground
jobs                    # Ver procesos en background de la sesión`}
            />

            <h3>Servicios con systemd</h3>
            <p>
                Las distribuciones modernas usan <strong>systemd</strong> para gestionar los servicios del sistema. Es el proceso con PID 1 y arranca todo lo demás.
            </p>
            <CodeBlock
                language="bash"
                code={`systemctl start nginx       # Iniciar servicio
systemctl stop nginx        # Parar servicio
systemctl restart nginx     # Reiniciar (parar + arrancar)
systemctl reload nginx      # Recargar config sin cortar conexiones
systemctl status nginx      # Ver estado y logs recientes
systemctl enable nginx      # Arrancar automáticamente al iniciar el sistema
systemctl disable nginx     # Deshabilitar arranque automático
journalctl -u nginx -f      # Ver logs del servicio en tiempo real
journalctl -u nginx --since "1 hour ago"  # Logs de la última hora`}
            />

            <Callout type="info" title="restart vs reload">
                <code>restart</code> para el servicio y lo vuelve a arrancar — corta conexiones activas momentáneamente. <code>reload</code> le pide que relea su configuración sin parar — ideal para nginx o apache cuando cambias la config. Úsalo en producción siempre que sea posible.
            </Callout>

            {/* ── 8. Redes y SSH ── */}
            <h2 id="redes">Redes y SSH</h2>

            <h3>Información de red</h3>
            <CodeBlock
                language="bash"
                code={`ip addr                    # Ver interfaces y direcciones IP
ip route                   # Ver tabla de rutas
ss -tlnp                   # Ver puertos TCP en escucha (reemplaza netstat)
ss -ulnp                   # Ver puertos UDP en escucha
ping google.com            # Test conectividad básica
curl ifconfig.me           # Ver tu IP pública`}
            />

            <h3>Descargar y consumir APIs con curl</h3>
            <CodeBlock
                language="bash"
                code={`curl https://api.example.com              # Petición GET
curl -I https://example.com               # Solo las cabeceras HTTP
curl -X POST -d '{"key":"val"}' url       # POST con datos
curl -H "Authorization: Bearer TOKEN" url # Con cabecera de autenticación
curl -o archivo.zip https://url/f.zip     # Guardar respuesta en archivo
curl -L https://url.com                   # Seguir redirecciones
wget https://example.com/archivo.zip      # Alternativa para descargar`}
            />

            <h3>SSH — Acceso remoto seguro</h3>
            <CodeBlock
                language="bash"
                code={`ssh usuario@192.168.1.10            # Conectar por IP
ssh usuario@miservidor.com          # Conectar por dominio
ssh -p 2222 usuario@host            # Puerto personalizado
ssh -i ~/.ssh/mi_clave usuario@host # Con clave privada específica

# Copiar archivos entre local y remoto
scp archivo.txt usuario@host:/ruta/remota/
scp -r carpeta/ usuario@host:/ruta/
scp usuario@host:/ruta/archivo.txt ./local/

# Generar par de claves SSH (recomendado Ed25519 en 2026)
ssh-keygen -t ed25519 -C "tu@email.com"
ssh-copy-id usuario@host            # Copiar clave pública al servidor`}
            />

            <StepList
                steps={[
                    {
                        title: 'Genera un par de claves Ed25519',
                        description: (
                            <p>
                                <code>ssh-keygen -t ed25519 -C "tu@email.com"</code>. Guarda la clave privada de forma segura — nunca la compartas.
                            </p>
                        ),
                    },
                    {
                        title: 'Copia tu clave pública al servidor',
                        description: (
                            <p>
                                <code>ssh-copy-id usuario@servidor</code> añade tu clave pública a <code>~/.ssh/authorized_keys</code> en el servidor.
                            </p>
                        ),
                    },
                    {
                        title: 'Desactiva el login por contraseña',
                        description: (
                            <p>
                                En <code>/etc/ssh/sshd_config</code> establece <code>PasswordAuthentication no</code> y <code>PermitRootLogin no</code>. Luego <code>systemctl reload sshd</code>.
                            </p>
                        ),
                    },
                    {
                        title: 'Cambia el puerto SSH por defecto (opcional)',
                        description: (
                            <p>
                                Cambiar de 22 a otro puerto reduce el ruido de bots automatizados. No es seguridad real, pero baja el ruido en los logs.
                            </p>
                        ),
                    },
                ]}
            />

            <Callout type="warning" title="Los ataques de fuerza bruta son constantes">
                Cualquier servidor con el puerto 22 abierto recibe miles de intentos de login al día. Usa siempre claves SSH, deshabilita login por contraseña y considera herramientas como <strong>fail2ban</strong> para banear IPs con demasiados intentos fallidos.
            </Callout>

            <h2>Próximos pasos</h2>
            <p>
                Ahora que conoces los fundamentos de Linux — sistema de archivos, permisos, procesos y redes — el siguiente curso te enseña los <strong>comandos esenciales que usarás cada día</strong>: grep, awk, sed, pipes, redirecciones y mucho más. Todo lo que necesitas para ser verdaderamente productivo en cualquier servidor Linux.
            </p>
        </LessonLayout>
    );
}
