import LessonLayout from '@/layouts/LessonLayout';
import { Head, Link } from '@inertiajs/react';

const modules = [
    { id: '/lecciones/shell-scripting', title: '¿Qué es un script?', free: true },
    { id: '/lecciones/shell-scripting#variables', title: 'Variables y tipos', free: true },
    { id: '/lecciones/shell-scripting#control', title: 'Control de flujo', free: true },
    { id: '/lecciones/shell-scripting#funciones', title: 'Funciones', free: true },
    { id: '/lecciones/shell-scripting#pipes', title: 'Pipes y redirecciones', free: true },
    { id: '/lecciones/shell-scripting#practica', title: 'Scripts reales', free: true },
];

export default function ShellScripting() {
    return (
        <LessonLayout
            title="Shell Scripting con Bash"
            description="Automatiza tareas repetitivas escribiendo tus propios scripts de shell."
            duration="3h 10min"
            lessons={15}
            level="Intermedio"
            premium={false}
            modules={modules}
            activeModule="/lecciones/shell-scripting"
            prevHref="/lecciones/comandos-linux"
            nextHref="/lecciones/laravel"
            category="Linux"
        >
            <Head>
                <title>Shell Scripting con Bash — Aprende a Programar</title>
                <meta name="description" content="Aprende a automatizar tareas con Bash: variables, condicionales, bucles, funciones y scripts reales. Gratis y actualizado 2026." />
            </Head>

            <h1>Shell Scripting con Bash</h1>

            <blockquote>
                Un buen script de Bash puede ahorrarte horas de trabajo repetitivo. Los administradores de sistemas y los DevOps que dominan el scripting automatizan backups, deploys, monitorizaciones y más — mientras otros hacen lo mismo a mano cada vez.
            </blockquote>

            <h2>¿Qué es un script de Bash?</h2>
            <p>
                Un script es un archivo de texto con comandos que el shell ejecuta en orden. La primera línea (<strong>shebang</strong>) le dice al sistema qué intérprete usar:
            </p>
            <pre><code>{`#!/usr/bin/env bash
# Este es un comentario
echo "Hola, mundo"

# Ejecutar el script:
chmod +x mi_script.sh   # Dar permiso de ejecución (solo la primera vez)
./mi_script.sh           # Ejecutar`}</code></pre>

            <h2 id="variables">Variables y tipos de datos</h2>
            <pre><code>{`#!/usr/bin/env bash

# Variables (sin espacios alrededor del =)
nombre="Alex"
edad=28
pi=3.14159

# Usar variables con $
echo "Hola, $nombre"
echo "Tienes \${edad} años"    # Las llaves {} son opcionales pero recomendadas

# Variables especiales
echo $0   # Nombre del script
echo $1   # Primer argumento
echo $2   # Segundo argumento
echo $#   # Número de argumentos
echo $@   # Todos los argumentos
echo $?   # Código de salida del último comando (0 = éxito)
echo $$   # PID del proceso actual

# Arrays
frutas=("manzana" "pera" "uva")
echo \${frutas[0]}           # manzana
echo \${frutas[@]}           # todos
echo \${#frutas[@]}          # número de elementos

# Variables de entorno
export API_KEY="abc123"     # Disponible para procesos hijos
echo $HOME                  # /home/alex
echo $PATH                  # Rutas de búsqueda de comandos
echo $USER                  # Usuario actual`}</code></pre>

            <h3>Aritmética</h3>
            <pre><code>{`a=10
b=3

echo $((a + b))    # 13
echo $((a - b))    # 7
echo $((a * b))    # 30
echo $((a / b))    # 3 (división entera)
echo $((a % b))    # 1 (módulo)
echo $((a ** b))   # 1000 (potencia)

# Para decimales usa bc
echo "scale=2; 10/3" | bc   # 3.33`}</code></pre>

            <h2 id="control">Control de flujo</h2>

            <h3>Condicionales if/elif/else</h3>
            <pre><code>{`#!/usr/bin/env bash

archivo="config.env"

if [ -f "$archivo" ]; then
    echo "El archivo existe"
elif [ -d "$archivo" ]; then
    echo "Es un directorio"
else
    echo "No existe"
fi

# Operadores de comparación
# Strings: == != -z (vacío) -n (no vacío)
# Números: -eq -ne -lt -le -gt -ge
# Archivos: -f (archivo) -d (dir) -e (existe) -r (legible) -x (ejecutable)

edad=25
if [ $edad -ge 18 ] && [ $edad -lt 65 ]; then
    echo "Adulto en edad laboral"
fi

# Forma moderna con [[ ]] (más potente, solo Bash)
nombre="Alex"
if [[ "$nombre" == A* ]]; then
    echo "El nombre empieza por A"
fi`}</code></pre>

            <h3>Bucle for</h3>
            <pre><code>{`# Iterar lista
for fruta in manzana pera uva; do
    echo "Fruta: $fruta"
done

# Iterar rango
for i in {1..10}; do
    echo "Número: $i"
done

# Iterar archivos
for archivo in *.log; do
    echo "Procesando: $archivo"
    gzip "$archivo"
done

# Estilo C
for ((i=0; i<5; i++)); do
    echo "i = $i"
done`}</code></pre>

            <h3>Bucle while</h3>
            <pre><code>{`# Leer archivo línea por línea
while IFS= read -r linea; do
    echo "Línea: $linea"
done < archivo.txt

# Contador
contador=0
while [ $contador -lt 5 ]; do
    echo "Contador: $contador"
    ((contador++))
done

# Loop infinito con break
while true; do
    read -p "¿Continuar? (s/n): " respuesta
    if [[ "$respuesta" == "n" ]]; then
        break
    fi
done`}</code></pre>

            <h3>Case</h3>
            <pre><code>{`entorno=$1

case "$entorno" in
    "produccion"|"prod")
        echo "Desplegando en PRODUCCIÓN"
        ;;
    "staging"|"stage")
        echo "Desplegando en staging"
        ;;
    "local"|"dev")
        echo "Entorno local"
        ;;
    *)
        echo "Entorno desconocido: $entorno"
        exit 1
        ;;
esac`}</code></pre>

            <h2 id="funciones">Funciones</h2>
            <pre><code>{`#!/usr/bin/env bash

# Definir función
saludar() {
    local nombre=$1      # local = variable local a la función
    local edad=$2
    echo "Hola, $nombre. Tienes $edad años."
    return 0             # Código de salida
}

# Llamar función
saludar "Alex" 28

# Función con valor de retorno (usando echo)
calcular_suma() {
    local a=$1
    local b=$2
    echo $((a + b))      # "retorno" por stdout
}

resultado=$(calcular_suma 5 3)
echo "5 + 3 = $resultado"

# Función de logging
log() {
    local nivel=$1
    local mensaje=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$nivel] $mensaje" | tee -a app.log
}

log "INFO" "Script iniciado"
log "ERROR" "Algo salió mal"`}</code></pre>

            <h2 id="pipes">Pipes, redirecciones y herramientas clave</h2>

            <h3>Redirecciones</h3>
            <pre><code>{`comando > archivo.txt      # Stdout a archivo (sobreescribe)
comando >> archivo.txt     # Stdout a archivo (añade)
comando 2> errores.txt     # Stderr a archivo
comando 2>&1               # Stderr al mismo destino que stdout
comando > salida.txt 2>&1  # Ambos a archivo
comando < archivo.txt      # Stdin desde archivo
comando &> todo.txt        # Stdout + stderr (Bash 4+)`}</code></pre>

            <h3>Pipes y herramientas esenciales</h3>
            <pre><code>{`# grep — filtrar líneas
cat /var/log/nginx/access.log | grep "404"
grep -i "error" app.log          # Case insensitive
grep -v "DEBUG" app.log          # Excluir líneas
grep -c "error" app.log          # Contar coincidencias

# awk — procesar columnas
ps aux | awk '{print $1, $11}'   # Mostrar usuario y comando
awk -F: '{print $1}' /etc/passwd # Primer campo separado por :
awk '$3 > 1000 {print}' /etc/passwd  # Filtrar por valor

# sed — editar texto
sed 's/viejo/nuevo/g' archivo.txt      # Sustituir global
sed -i 's/debug/info/g' config.conf   # Editar en sitio
sed -n '10,20p' archivo.txt            # Mostrar líneas 10-20
sed '/patron/d' archivo.txt            # Borrar líneas con patrón

# sort, uniq, wc
sort archivo.txt              # Ordenar
sort -u archivo.txt           # Ordenar y eliminar duplicados
sort -n numeros.txt           # Orden numérico
sort -rn numeros.txt          # Orden numérico inverso
uniq -c archivo_ordenado.txt  # Contar repeticiones
wc -l archivo.txt             # Contar líneas
wc -w archivo.txt             # Contar palabras

# xargs — pasar stdout como argumentos
find . -name "*.tmp" | xargs rm
cat urls.txt | xargs curl -O

# tee — bifurcar salida
comando | tee -a log.txt       # Mostrar y guardar a la vez`}</code></pre>

            <h2 id="practica">Scripts reales — Casos de uso</h2>

            <h3>Script 1: Backup automático</h3>
            <pre><code>{`#!/usr/bin/env bash
set -euo pipefail  # Parar ante errores, variables no definidas, pipes fallidos

BACKUP_DIR="/backups"
SOURCE_DIR="/var/www/mi-app"
FECHA=$(date '+%Y%m%d_%H%M%S')
ARCHIVO="backup_\${FECHA}.tar.gz"

log() { echo "[$(date '+%H:%M:%S')] $1"; }

# Crear directorio si no existe
mkdir -p "$BACKUP_DIR"

log "Iniciando backup de $SOURCE_DIR..."
tar -czf "\${BACKUP_DIR}/\${ARCHIVO}" "$SOURCE_DIR"

# Eliminar backups de más de 7 días
find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +7 -delete
log "Backups antiguos eliminados"

log "✅ Backup creado: \${BACKUP_DIR}/\${ARCHIVO}"
log "Tamaño: $(du -sh "\${BACKUP_DIR}/\${ARCHIVO}" | cut -f1)"`}</code></pre>

            <h3>Script 2: Monitor de servicios</h3>
            <pre><code>{`#!/usr/bin/env bash

SERVICIOS=("nginx" "php8.3-fpm" "mysql")
TELEGRAM_TOKEN="\${TELEGRAM_TOKEN:-}"
CHAT_ID="\${CHAT_ID:-}"

enviar_alerta() {
    local mensaje=$1
    if [ -n "$TELEGRAM_TOKEN" ]; then
        curl -s -X POST "https://api.telegram.org/bot\${TELEGRAM_TOKEN}/sendMessage" \
             -d "chat_id=\${CHAT_ID}&text=\${mensaje}" > /dev/null
    fi
    echo "ALERTA: $mensaje"
}

for servicio in "\${SERVICIOS[@]}"; do
    if ! systemctl is-active --quiet "$servicio"; then
        enviar_alerta "❌ Servicio $servicio caído en $(hostname)"
        systemctl restart "$servicio"

        if systemctl is-active --quiet "$servicio"; then
            enviar_alerta "✅ Servicio $servicio reiniciado correctamente"
        else
            enviar_alerta "🔴 CRÍTICO: No se pudo reiniciar $servicio"
        fi
    fi
done`}</code></pre>

            <h3>Script 3: Deploy automático</h3>
            <pre><code>{`#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/mi-laravel-app"
BRANCH="\${1:-main}"

log() { echo "→ $1"; }

cd "$APP_DIR"

log "Actualizando código desde $BRANCH..."
git pull origin "$BRANCH"

log "Instalando dependencias PHP..."
composer install --no-dev --optimize-autoloader

log "Instalando dependencias JS..."
npm ci && npm run build

log "Ejecutando migraciones..."
php artisan migrate --force

log "Limpiando caché..."
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

log "Reiniciando workers..."
php artisan queue:restart

log "✅ Deploy completado en $(date '+%H:%M:%S')"`}</code></pre>

            <h2>Buenas prácticas</h2>
            <ul>
                <li>Siempre empieza con <code>set -euo pipefail</code> para detectar errores</li>
                <li>Usa <code>local</code> dentro de funciones para evitar contaminar el ámbito global</li>
                <li>Comenta el <em>por qué</em>, no el <em>qué</em></li>
                <li>Testea con <code>bash -n script.sh</code> (sintaxis) y <code>shellcheck script.sh</code> (linting)</li>
                <li>Usa <code>"$variable"</code> siempre entre comillas para evitar word splitting</li>
                <li>Guarda los scripts de producción en Git, nunca solo en el servidor</li>
            </ul>

            <h2>Próximos pasos</h2>
            <p>Con Bash dominado, el siguiente salto puede ser <Link href="/lecciones/php-basico">PHP</Link> y <Link href="/lecciones/laravel">Laravel</Link> para crear aplicaciones web completas. O, si prefieres seguir en el mundo DevOps, pasa a <Link href="/lecciones/maquinas-virtuales">Máquinas virtuales</Link> y <Link href="/lecciones/docker">Docker</Link>, donde aprenderás a contenerizar todo lo que has aprendido.</p>
        </LessonLayout>
    );
}
