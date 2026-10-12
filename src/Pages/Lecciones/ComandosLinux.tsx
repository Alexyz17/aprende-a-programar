import LessonLayout from '@/layouts/LessonLayout';
import { Head } from '@inertiajs/react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/lesson/Callout';
import KeyConcept from '@/components/lesson/KeyConcept';
import ComparisonTable from '@/components/lesson/ComparisonTable';

const modules = [
    { id: '/lecciones/comandos-linux', title: 'Navegación y exploración', free: true },
    { id: '/lecciones/comandos-linux#archivos', title: 'Manipulación de archivos', free: true },
    { id: '/lecciones/comandos-linux#busqueda', title: 'Búsqueda avanzada', free: true },
    { id: '/lecciones/comandos-linux#texto', title: 'Procesamiento de texto', free: true },
    { id: '/lecciones/comandos-linux#pipes', title: 'Pipes y redirecciones', free: true },
    { id: '/lecciones/comandos-linux#red', title: 'Diagnóstico de red', free: true },
    { id: '/lecciones/comandos-linux#sistema', title: 'Monitorización del sistema', free: true },
    { id: '/lecciones/comandos-linux#atajos', title: 'Atajos y productividad', free: true },
];

export default function ComandosLinux() {
    return (
        <LessonLayout
            title="Comandos Linux esenciales"
            description="Domina los comandos de terminal que todo desarrollador y sysadmin necesita conocer."
            duration="2h 45min"
            lessons={14}
            level="Básico"
            premium={false}
            modules={modules}
            activeModule="/lecciones/comandos-linux"
            prevHref="/lecciones/linux-esencial"
            nextHref="/lecciones/shell-scripting"
            category="Linux"
        >
            <Head>
                <title>Comandos Linux esenciales — Aprende a Programar</title>
                <meta name="description" content="Guía completa de comandos Linux: navegación, archivos, búsqueda, texto, red y sistema. Gratis y actualizado 2026." />
            </Head>

            <h1>Comandos Linux esenciales</h1>

            <blockquote>
                El terminal de Linux parece intimidante al principio, pero con unos 30-40 comandos dominados puedes gestionar servidores completos, automatizar tareas y moverte más rápido que con cualquier interfaz gráfica. Esta guía te lleva de cero a productivo.
            </blockquote>

            {/* ── 1. Navegación ── */}
            <h2>Navegación y exploración del sistema</h2>

            <h3>Orientación básica</h3>
            <CodeBlock
                language="bash"
                code={`pwd                   # Print Working Directory — dónde estás ahora
ls                    # Listar archivos del directorio actual
ls -la                # Listar con detalles y archivos ocultos
ls -lh                # Tamaños en formato legible (K, M, G)
ls -lt                # Ordenar por fecha de modificación
ls -R                 # Listar recursivamente

cd /ruta/absoluta     # Ir a ruta absoluta
cd ruta/relativa      # Ir a ruta relativa
cd ~                  # Ir al directorio home
cd -                  # Volver al directorio anterior
cd ..                 # Subir un nivel
cd ../..              # Subir dos niveles`}
            />

            <h3>Explorar contenido de archivos</h3>
            <CodeBlock
                language="bash"
                code={`cat archivo.txt           # Mostrar contenido completo
less archivo.txt          # Paginador interactivo (q para salir, /texto para buscar)
head -n 20 archivo.txt    # Primeras 20 líneas (defecto: 10)
tail -n 20 archivo.txt    # Últimas 20 líneas
tail -f app.log           # Seguir archivo en tiempo real (logs)
file imagen.png           # Detectar tipo de archivo real
stat archivo.txt          # Metadatos: tamaño, permisos, fechas`}
            />

            <Callout type="tip" title="less es más potente que cat">
                Para archivos largos siempre usa <code>less</code> en lugar de <code>cat</code>. Puedes buscar con <code>/término</code>, navegar con las flechas, ir al final con <code>G</code> y al inicio con <code>g</code>. Mucho más cómodo para logs grandes.
            </Callout>

            <h3>Rutas del sistema importantes</h3>
            <CodeBlock
                language="bash"
                filename="Directorios clave del FHS"
                code={`/                     # Raíz del sistema
/home/usuario/        # Directorio personal del usuario
/etc/                 # Archivos de configuración del sistema
/var/log/             # Logs del sistema y servicios
/var/www/             # Web servers (nginx/apache)
/tmp/                 # Temporales (se borran en reinicio)
/usr/bin/             # Ejecutables del sistema
/usr/local/bin/       # Ejecutables instalados manualmente
/proc/                # Información del kernel (virtual, no ocupa disco)`}
            />

            {/* ── 2. Archivos ── */}
            <h2 id="archivos">Manipulación de archivos y directorios</h2>

            <h3>Crear, copiar, mover y borrar</h3>
            <CodeBlock
                language="bash"
                code={`# Crear
touch archivo.txt           # Crear archivo vacío (o actualizar fecha)
mkdir mi-directorio         # Crear directorio
mkdir -p padre/hijo/nieto   # Crear árbol de directorios de una vez

# Copiar
cp origen.txt destino.txt             # Copiar archivo
cp -r directorio/ copia/             # Copiar directorio recursivamente
cp -p archivo.txt copia.txt          # Preservar permisos y fechas
cp -u *.log /backups/                # Copiar solo si es más nuevo

# Mover / renombrar
mv viejo.txt nuevo.txt               # Renombrar
mv archivo.txt /otra/ruta/           # Mover a otro directorio
mv *.log /var/log/app/               # Mover múltiples archivos

# Borrar
rm archivo.txt                       # Borrar archivo
rm -r directorio/                    # Borrar directorio recursivo
rm -rf directorio/                   # Forzar sin confirmación
rmdir directorio/                    # Borrar solo si está vacío`}
            />

            <Callout type="danger" title="rm -rf no tiene deshacer">
                No hay papelera en el terminal. <code>rm -rf</code> es permanente e instantáneo. Verifica siempre la ruta antes de ejecutarlo. En entornos críticos, usa <code>trash-cli</code> como alternativa segura.
            </Callout>

            <h3>Ver y seguir logs en tiempo real</h3>
            <CodeBlock
                language="bash"
                code={`# Logs del sistema con journalctl (systemd)
journalctl -f                         # Todos los logs en tiempo real
journalctl -u nginx -f                # Logs de un servicio específico
journalctl --since "1 hour ago"       # Logs recientes
journalctl -p err                     # Solo errores
journalctl --disk-usage               # Espacio que ocupan los logs

# Logs clásicos con tail
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Combinar con grep para filtrar en tiempo real
tail -f app.log | grep "ERROR"
tail -f app.log | grep -v "DEBUG"     # Excluir líneas DEBUG`}
            />

            <h3>Permisos y propietario</h3>
            <CodeBlock
                language="bash"
                code={`# Cambiar permisos
chmod 755 script.sh          # rwxr-xr-x
chmod 644 archivo.txt        # rw-r--r--
chmod +x script.sh           # Añadir bit de ejecución
chmod -w archivo.txt         # Quitar escritura
chmod -R 755 directorio/     # Aplicar recursivamente

# Cambiar propietario
chown alex archivo.txt              # Cambiar usuario propietario
chown alex:www-data archivo.txt     # Cambiar usuario y grupo
chown -R www-data:www-data /var/www/mi-app`}
            />

            {/* ── 3. Búsqueda ── */}
            <h2 id="busqueda">Búsqueda avanzada</h2>

            <KeyConcept
                term="find"
                definition="Comando para buscar archivos y directorios en el sistema de archivos por nombre, tipo, tamaño, fecha, permisos o cualquier combinación. Es muy potente y puede ejecutar acciones sobre los resultados."
                example="find /var/www -name '*.php' -mtime -7"
            />

            <h3>find — buscar archivos y directorios</h3>
            <CodeBlock
                language="bash"
                code={`# Buscar por nombre
find /var/www -name "*.php"              # Por extensión en un directorio
find . -name "config.*"                 # Cualquier extensión con ese nombre
find / -name "nginx.conf" 2>/dev/null   # Suprimir errores de permiso

# Buscar por tipo
find . -type f          # Solo archivos regulares
find . -type d          # Solo directorios
find . -type l          # Solo enlaces simbólicos

# Buscar por tamaño
find /var -size +100M   # Archivos mayores de 100 MB
find . -size -1k        # Archivos menores de 1 KB

# Buscar por fecha de modificación
find /tmp -mtime +7           # Modificados hace más de 7 días
find . -newer referencia.txt  # Más nuevos que otro archivo

# Ejecutar acciones sobre resultados
find . -name "*.log" -delete                    # Borrar todos los .log
find . -name "*.tmp" -exec rm {} \;            # Ejecutar comando por archivo
find . -name "*.php" | xargs grep "password"   # Buscar contraseñas en código`}
            />

            <KeyConcept
                term="grep"
                definition="Busca un patrón de texto dentro de archivos o en la entrada estándar. El nombre viene de 'globally search a regular expression and print'. Es uno de los comandos más usados en Linux."
                example="grep -rn 'TODO' ./src/"
            />

            <h3>grep — buscar dentro de archivos</h3>
            <CodeBlock
                language="bash"
                code={`grep "patron" archivo.txt          # Buscar patrón literal
grep -i "error" app.log            # Case insensitive (ignora mayúsculas)
grep -r "TODO" ./src/              # Buscar recursivamente en directorio
grep -n "function" index.php       # Mostrar número de línea
grep -c "404" access.log           # Contar coincidencias (solo el número)
grep -v "DEBUG" app.log            # Invertir — excluir líneas que coinciden
grep -l "error" *.log              # Solo nombres de archivos con match
grep -A 3 "ERROR" app.log          # 3 líneas DESPUÉS del match (After)
grep -B 3 "ERROR" app.log          # 3 líneas ANTES del match (Before)
grep -C 3 "ERROR" app.log          # 3 líneas de contexto (Before + After)

# Expresiones regulares
grep "^ERROR" app.log              # Líneas que empiezan por ERROR
grep "\.php$" archivo.txt          # Líneas que terminan en .php
grep -E "error|warning" app.log    # OR: error o warning`}
            />

            <Callout type="tip" title="ripgrep es grep pero 10x más rápido">
                <code>rg</code> (ripgrep) es una alternativa moderna a grep escrita en Rust. Ignora automáticamente <code>.gitignore</code>, es mucho más rápida en repositorios grandes y tiene sintaxis similar. Instala con <code>apt install ripgrep</code> o <code>brew install ripgrep</code>.
            </Callout>

            {/* ── 4. Texto ── */}
            <h2 id="texto">Procesamiento de texto</h2>

            <KeyConcept
                term="awk"
                definition="Lenguaje de procesamiento de texto orientado a columnas. Lee línea a línea y permite filtrar, reformatear y calcular sobre campos delimitados. Imprescindible para procesar logs y archivos CSV."
                example="awk -F: '{print $1}' /etc/passwd  # Listar todos los usuarios"
            />

            <h3>awk — procesar columnas y datos estructurados</h3>
            <CodeBlock
                language="bash"
                code={`# Imprimir columnas específicas
ps aux | awk '{print $1, $11}'            # Usuario y nombre del proceso
awk '{print $1}' access.log              # Primera columna (IP)
awk -F: '{print $1, $3}' /etc/passwd     # Separador : → usuario y UID

# Filtrar filas por condición
awk '$3 > 50 {print}' datos.txt          # Mostrar si columna 3 > 50
awk 'NR==5,NR==10 {print}' archivo.txt  # Solo líneas 5 a 10

# Calcular
awk '{sum += $2} END {print "Total:", sum}' numeros.txt

# Formato de salida alineado
awk '{printf "%-20s %s\n", $1, $2}' archivo.txt`}
            />

            <KeyConcept
                term="sed"
                definition="Stream EDitor — edita texto línea a línea sin abrir un editor. Ideal para sustituir texto, borrar líneas y transformar archivos en scripts y pipelines."
                example="sed -i 's/debug/production/g' config.env"
            />

            <h3>sed — editar y transformar texto</h3>
            <CodeBlock
                language="bash"
                code={`sed 's/viejo/nuevo/g' archivo.txt         # Sustituir todas las ocurrencias
sed -i 's/debug/info/g' config.conf       # Editar archivo en su sitio (-i)
sed -i.bak 's/debug/info/g' config.conf  # Editar con backup (config.conf.bak)
sed -n '10,20p' archivo.txt               # Mostrar solo líneas 10-20
sed '/patron/d' archivo.txt               # Borrar líneas que contienen el patrón
sed 's/^/    /' archivo.txt              # Añadir 4 espacios al inicio de cada línea
sed '1d' archivo.txt                      # Borrar primera línea
sed '$d' archivo.txt                      # Borrar última línea`}
            />

            <h3>sort, uniq, cut, tr</h3>
            <CodeBlock
                language="bash"
                code={`# sort — ordenar líneas
sort archivo.txt              # Orden alfabético
sort -n numeros.txt           # Orden numérico
sort -rn numeros.txt          # Inverso numérico (mayor primero)
sort -k2 tabla.txt            # Ordenar por columna 2
sort -u archivo.txt           # Ordenar y eliminar duplicados

# uniq — eliminar/contar duplicados (requiere entrada ordenada)
sort archivo.txt | uniq        # Eliminar duplicados
sort archivo.txt | uniq -c    # Contar repeticiones de cada línea
sort archivo.txt | uniq -d    # Solo las líneas duplicadas

# cut — extraer columnas o caracteres
cut -d: -f1 /etc/passwd       # Primera columna (separador :)
cut -d, -f1,3 datos.csv       # Columnas 1 y 3 de CSV
cut -c1-10 archivo.txt        # Caracteres del 1 al 10

# tr — transformar o eliminar caracteres
echo "hola" | tr 'a-z' 'A-Z'  # Convertir a mayúsculas
echo "a,b,c" | tr ',' '\n'    # Reemplazar coma por salto de línea
cat archivo.txt | tr -d '\r'  # Eliminar retornos de carro (archivos Windows)`}
            />

            {/* ── 5. Pipes ── */}
            <h2 id="pipes">Pipes y redirecciones</h2>
            <p>
                Los pipes y redirecciones son la esencia del poder del terminal Linux. Permiten encadenar comandos simples para construir operaciones complejas.
            </p>

            <KeyConcept
                term="Pipe |"
                definition="Conecta la salida estándar (stdout) de un comando con la entrada estándar (stdin) del siguiente. Permite encadenar comandos para construir pipelines de procesamiento de datos."
                example="cat access.log | grep '404' | awk '{print $1}' | sort | uniq -c | sort -rn"
            />

            <ComparisonTable
                headers={['Operador', 'Función', 'Ejemplo']}
                rows={[
                    ['|', 'Pipe: stdout → stdin del siguiente', 'ls -la | grep ".php"'],
                    ['>', 'Redirigir stdout a archivo (sobreescribe)', 'ls > lista.txt'],
                    ['>>', 'Redirigir stdout a archivo (append)', 'echo "log" >> app.log'],
                    ['2>', 'Redirigir stderr a archivo', 'comando 2> errores.log'],
                    ['2>&1', 'Redirigir stderr a stdout', 'comando > out.log 2>&1'],
                    ['<', 'Redirigir archivo a stdin', 'mysql db < dump.sql'],
                    ['<<EOF', 'Here-document: texto multilínea como stdin', 'cat <<EOF ... EOF'],
                ]}
                caption="Pipes y redirecciones"
            />

            <CodeBlock
                language="bash"
                filename="Ejemplos prácticos de pipelines"
                code={`# Top 10 IPs que más peticiones hacen a nginx
cat /var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10

# Buscar procesos que consumen más CPU
ps aux | sort -k3 -rn | head -5

# Contar líneas de código PHP en un proyecto
find . -name "*.php" | xargs wc -l | sort -rn | head

# Errores únicos en un log
grep "ERROR" app.log | sed 's/[0-9]//g' | sort | uniq -c | sort -rn

# Ver los 10 archivos más grandes en /var
du -ah /var 2>/dev/null | sort -rh | head -10`}
            />

            {/* ── 6. Red ── */}
            <h2 id="red">Diagnóstico de red</h2>

            <h3>Conectividad y DNS</h3>
            <CodeBlock
                language="bash"
                code={`# Conectividad básica
ping google.com                    # Test ICMP básico
ping -c 4 8.8.8.8                 # Solo 4 paquetes
traceroute google.com              # Ruta de paquetes
mtr google.com                     # traceroute interactivo y continuo

# DNS
nslookup dominio.com               # Resolución DNS básica
dig dominio.com                    # Resolución DNS detallada
dig dominio.com MX                 # Registros de correo
dig +short dominio.com             # Solo la IP
host dominio.com                   # Resolución rápida`}
            />

            <h3>Puertos y conexiones activas</h3>
            <CodeBlock
                language="bash"
                code={`ss -tlnp                           # Puertos TCP en escucha con PID
ss -ulnp                           # Puertos UDP en escucha
ss -tlnp | grep :80                # Ver si el puerto 80 está abierto
lsof -i :80                        # Qué proceso usa el puerto 80
lsof -i :3306                      # Qué usa MySQL
netstat -tlnp                      # Alternativa clásica a ss

# Probar conectividad a un puerto específico
nc -zv servidor.com 22             # Test TCP al puerto SSH
nc -zv servidor.com 443            # Test HTTPS`}
            />

            <h3>Transferencia de archivos y APIs</h3>
            <CodeBlock
                language="bash"
                code={`# curl — peticiones HTTP completas
curl https://api.ejemplo.com/datos           # GET básico
curl -I https://ejemplo.com                  # Solo headers (método HEAD)
curl -o archivo.zip https://url.com/f.zip   # Descargar a archivo
curl -L https://url.com                      # Seguir redirecciones automáticamente
curl -X POST -H "Content-Type: application/json" \
     -d '{"key":"value"}' https://api.com/endpoint

# wget — descarga de archivos
wget https://url.com/archivo.tar.gz          # Descargar
wget -c https://url.com/grande.zip           # Reanudar descarga interrumpida
wget -P /destino/ https://url.com/arch.deb  # Guardar en directorio específico

# scp — copiar via SSH
scp archivo.txt usuario@servidor:/ruta/      # Local → remoto
scp usuario@servidor:/ruta/archivo.txt .     # Remoto → local
scp -r directorio/ usuario@servidor:/ruta/   # Directorio completo`}
            />

            <Callout type="info" title="rsync para sincronización eficiente">
                Para copiar grandes cantidades de archivos entre servidores, usa <code>rsync</code> en lugar de <code>scp</code>. Solo transfiere los cambios, comprime los datos y puede reanudar transferencias interrumpidas.
                <br />
                <code>rsync -avz --progress ./src/ usuario@servidor:/var/www/app/</code>
            </Callout>

            {/* ── 7. Sistema ── */}
            <h2 id="sistema">Monitorización del sistema</h2>

            <h3>Recursos en tiempo real</h3>
            <CodeBlock
                language="bash"
                code={`top                           # Monitor de procesos clásico (q para salir, k para kill)
htop                          # Monitor interactivo mejorado (apt install htop)
btop                          # Monitor moderno con gráficas (apt install btop)
glances                       # Vista completa del sistema en una pantalla

# Procesos específicos
ps aux                        # Todos los procesos con detalle
ps aux | grep nginx           # Filtrar por nombre
pgrep nginx                   # Solo los PIDs
pkill nginx                   # Enviar SIGTERM a todos los nginx
kill -9 1234                  # SIGKILL a un PID concreto`}
            />

            <h3>Memoria y CPU</h3>
            <CodeBlock
                language="bash"
                code={`free -h                       # Memoria RAM y swap en formato legible
cat /proc/meminfo             # Información detallada de memoria
vmstat 1 5                    # Estadísticas de VM cada 1s, 5 veces
lscpu                         # Información detallada de la CPU
nproc                         # Número de núcleos disponibles
uptime                        # Tiempo encendido y carga media del sistema`}
            />

            <h3>Disco y espacio</h3>
            <CodeBlock
                language="bash"
                code={`# Espacio disponible en particiones
df -h                         # Todas las particiones en formato legible
df -h /                       # Solo partición raíz
df -i                         # Inodos (útil si hay "no space left" sin espacio)

# Tamaño de directorios
du -sh /var/www/              # Tamaño total del directorio
du -sh *                      # Tamaño de cada elemento en el directorio actual
du -ah /var | sort -rh | head -20   # Top 20 directorios/archivos más grandes

# Archivos grandes
find / -size +500M 2>/dev/null       # Archivos mayores de 500 MB

# I/O de disco
iotop                         # E/S de disco por proceso (apt install iotop)
iostat -x 1                   # Estadísticas de I/O cada 1 segundo`}
            />

            <ComparisonTable
                headers={['Comando', 'Para qué sirve', 'Cuándo usarlo']}
                rows={[
                    ['df -h', 'Espacio libre en particiones', 'Disco lleno, planificar capacidad'],
                    ['du -sh *', 'Tamaño de cada carpeta', 'Encontrar qué ocupa espacio'],
                    ['free -h', 'RAM disponible', 'Lentitud, OOM killer activo'],
                    ['top / htop', 'CPU y procesos en vivo', 'Alta carga, proceso runaway'],
                    ['iotop', 'I/O de disco por proceso', 'Disco al 100%, lentitud E/S'],
                    ['ss -tlnp', 'Puertos en escucha', 'Debug de red, seguridad'],
                ]}
                caption="Herramientas de diagnóstico — referencia rápida"
            />

            <h3>Servicios con systemd</h3>
            <CodeBlock
                language="bash"
                code={`# Control de servicios
systemctl start nginx          # Iniciar servicio
systemctl stop nginx           # Parar servicio
systemctl restart nginx        # Parar + arrancar
systemctl reload nginx         # Recargar config sin parar el servicio
systemctl status nginx         # Estado detallado + últimas líneas de log

# Arranque automático
systemctl enable nginx         # Habilitar en arranque del sistema
systemctl disable nginx        # Deshabilitar en arranque
systemctl is-enabled nginx     # ¿Está habilitado?
systemctl is-active nginx      # ¿Está corriendo ahora?

# Ver todos los servicios
systemctl list-units --type=service          # Solo los activos
systemctl list-units --type=service --all   # Todos, incluyendo inactivos

# Logs de servicio
journalctl -u nginx            # Todos los logs históricos de nginx
journalctl -u nginx -f         # Seguir en tiempo real
journalctl -u nginx --since today   # Solo hoy
journalctl -u nginx -p err     # Solo errores`}
            />

            {/* ── 8. Atajos ── */}
            <h2 id="atajos">Atajos y productividad en el terminal</h2>

            <ComparisonTable
                headers={['Atajo', 'Acción']}
                rows={[
                    ['Tab', 'Autocompletar comando, ruta o argumento'],
                    ['Tab Tab', 'Listar todas las opciones de autocompletado'],
                    ['Ctrl+C', 'Cancelar proceso en ejecución (SIGINT)'],
                    ['Ctrl+Z', 'Suspender proceso (bg/fg para reanudar)'],
                    ['Ctrl+D', 'Cerrar sesión o señal EOF'],
                    ['Ctrl+L', 'Limpiar pantalla (igual que clear)'],
                    ['Ctrl+A', 'Ir al inicio de la línea'],
                    ['Ctrl+E', 'Ir al final de la línea'],
                    ['Ctrl+U', 'Borrar desde cursor hasta el inicio'],
                    ['Ctrl+K', 'Borrar desde cursor hasta el final'],
                    ['Ctrl+W', 'Borrar la palabra anterior'],
                    ['Ctrl+R', 'Buscar en el historial de comandos'],
                    ['!!', 'Repetir el último comando'],
                    ['sudo !!', 'Repetir el último comando con sudo'],
                    ['!nginx', 'Repetir el último comando que empieza por "nginx"'],
                ]}
                caption="Atajos de teclado esenciales"
            />

            <h3>Historial de comandos</h3>
            <CodeBlock
                language="bash"
                code={`history                     # Ver historial completo
history | grep docker       # Buscar en el historial
history 20                  # Ver últimos 20 comandos
!142                        # Ejecutar el comando número 142 del historial

# Ctrl+R para búsqueda interactiva:
# Pulsa Ctrl+R y escribe parte del comando
# Sigue pulsando Ctrl+R para ir al anterior
# Enter para ejecutar, Ctrl+C para cancelar`}
            />

            <h3>Alias útiles para tu .bashrc o .zshrc</h3>
            <CodeBlock
                language="bash"
                filename="~/.bashrc"
                code={`# Navegación
alias ll='ls -lah'
alias la='ls -A'
alias ..='cd ..'
alias ...='cd ../..'
alias ~='cd ~'

# Git
alias gs='git status'
alias gl='git log --oneline --graph --decorate'
alias gp='git push'
alias gc='git commit -m'

# Disco y sistema
alias df='df -h'
alias du='du -h'
alias free='free -h'

# Búsqueda con color
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

# Seguridad — confirmación en operaciones destructivas
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# Cargar cambios sin reiniciar el terminal
source ~/.bashrc`}
            />

            <Callout type="tip" title="Guarda tus dotfiles en Git">
                Los archivos de configuración (<code>.bashrc</code>, <code>.zshrc</code>, <code>.vimrc</code>…) se llaman <em>dotfiles</em>. Guárdalos en un repositorio Git y podrás replicar tu entorno en cualquier servidor en minutos. Hay muchos repositorios públicos de dotfiles en GitHub para inspirarte.
            </Callout>

            <h2>Próximos pasos</h2>
            <p>
                Con estos comandos dominados, el siguiente nivel es <strong>Shell Scripting</strong> — combinar comandos en scripts que se ejecutan automáticamente, con variables, bucles, condicionales y funciones. Después, <strong>Docker</strong> donde aplicarás todo esto para gestionar contenedores en producción.
            </p>
        </LessonLayout>
    );
}
