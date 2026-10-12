import LessonLayout from '@/layouts/LessonLayout';
import { Head } from '@inertiajs/react';

const modules = [
    { id: '/lecciones/docker', title: '¿Qué es Docker?', free: true },
    { id: '/lecciones/docker#imagenes', title: 'Imágenes y contenedores', free: false },
    { id: '/lecciones/docker#dockerfile', title: 'Dockerfile paso a paso', free: false },
    { id: '/lecciones/docker#volumenes', title: 'Volúmenes y redes', free: false },
    { id: '/lecciones/docker#compose', title: 'Docker Compose', free: false },
    { id: '/lecciones/docker#produccion', title: 'Docker en producción', free: false },
    { id: '/lecciones/docker#multistage', title: 'Multi-stage builds', free: false },
    { id: '/lecciones/docker#laravel', title: 'Docker con Laravel', free: false },
];

export default function Docker() {
    return (
        <LessonLayout
            title="Docker desde cero"
            description="Contenedores, imágenes, volúmenes y Docker Compose explicados paso a paso."
            duration="4h 50min"
            lessons={24}
            level="Intermedio"
            premium={false}
            modules={modules}
            activeModule="/lecciones/docker"
            category="Servidores"
            allUnlocked={true}
        >
            <Head>
                <title>Docker desde cero — Aprende a Programar</title>
                <meta name="description" content="Curso completo de Docker: contenedores, imágenes, Compose, volúmenes y despliegue en producción." />
            </Head>

            <h1>Docker desde cero</h1>

            <blockquote>
                Docker cambió para siempre cómo desplegamos software. En 2026, <strong>Docker Engine 29</strong> y <strong>Docker Desktop 4.50</strong> traen mejoras masivas de rendimiento — hasta 98% más rápido con virtiofs en Mac — y el nuevo MCP Toolkit para integrar IA en tus pipelines.
            </blockquote>

            <h2>¿Qué es Docker y por qué lo necesitas?</h2>
            <p>Docker es una plataforma de <strong>contenedores</strong>. Un contenedor empaqueta tu aplicación con todas sus dependencias en una unidad portable que se ejecuta igual en cualquier máquina.</p>

            <pre><code>{`# Sin Docker:
"En mi máquina funciona"
→ Diferente versión de PHP/Node
→ Librerías que faltan
→ Variables de entorno distintas

# Con Docker:
"Si el contenedor funciona aquí, funciona en cualquier lado"
→ Siempre PHP 8.3, siempre Alpine 3.21
→ Todas las dependencias incluidas
→ Reproducible en dev, staging y producción`}</code></pre>

            <h3>Instalación en Ubuntu 24.04</h3>
            <pre><code>{`curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

docker --version          # Docker version 29.x.x
docker compose version    # Docker Compose version 2.x.x
docker run hello-world    # Test completo ✅`}</code></pre>

            <h2 id="imagenes">Imágenes y contenedores en profundidad</h2>

            <h3>Ciclo de vida de un contenedor</h3>
            <pre><code>{`# Crear y arrancar
docker run -d -p 8080:80 --name mi-nginx nginx:alpine

# Estados posibles
docker ps                 # Running
docker stop mi-nginx      # → Exited
docker start mi-nginx     # → Running de nuevo
docker pause mi-nginx     # → Paused (congelado en memoria)
docker unpause mi-nginx   # → Running
docker rm mi-nginx        # Eliminar (debe estar parado)
docker rm -f mi-nginx     # Forzar eliminación aunque esté corriendo

# Inspeccionar
docker inspect mi-nginx          # JSON con toda la configuración
docker stats mi-nginx            # CPU, memoria, red en tiempo real
docker top mi-nginx              # Procesos dentro del contenedor
docker logs mi-nginx             # Stdout/stderr del contenedor
docker logs -f --tail 50 mi-nginx  # Seguir últimas 50 líneas`}</code></pre>

            <h3>Gestión de imágenes</h3>
            <pre><code>{`# Buscar y descargar
docker search nginx               # Buscar en Docker Hub
docker pull php:8.3-fpm-alpine    # Descargar imagen
docker pull mysql:8.0             # Con tag específico

# Listar y eliminar
docker images                     # Listar locales
docker image ls --filter dangling=true  # Imágenes huérfanas
docker rmi php:8.3-fpm-alpine     # Eliminar imagen
docker image prune                # Eliminar todas las huérfanas

# Construir y publicar
docker build -t mi-app:1.0 .
docker tag mi-app:1.0 usuario/mi-app:1.0
docker push usuario/mi-app:1.0

# Ver capas de una imagen
docker history php:8.3-fpm-alpine
docker image inspect php:8.3-fpm-alpine`}</code></pre>

            <h3>Ejecutar comandos dentro del contenedor</h3>
            <pre><code>{`# Entrar con shell interactivo
docker exec -it mi-nginx sh       # Alpine usa sh, no bash
docker exec -it mi-app bash       # En imágenes con bash

# Ejecutar comando puntual
docker exec mi-nginx nginx -t     # Verificar config nginx
docker exec mi-app php artisan migrate

# Copiar archivos dentro/fuera
docker cp archivo.txt mi-app:/var/www/html/
docker cp mi-app:/var/www/html/log.txt ./`}</code></pre>

            <h2 id="dockerfile">Dockerfile paso a paso</h2>

            <h3>Instrucciones clave</h3>
            <pre><code>{`FROM php:8.3-fpm-alpine        # Imagen base
LABEL maintainer="admin@ejemplo.com"

# Instalar dependencias del sistema
RUN apk add --no-cache \
    git curl zip unzip \
    libpng-dev libzip-dev

# Instalar extensiones PHP
RUN docker-php-ext-install \
    pdo pdo_mysql zip gd bcmath opcache

# Variables de entorno
ENV APP_ENV=production \
    APP_DEBUG=false

# Directorio de trabajo
WORKDIR /var/www/html

# Copiar Composer
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer

# Copiar dependencias primero (caché de capas)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader

# Copiar código fuente
COPY . .

# Finalizar Composer
RUN composer dump-autoload --optimize

# Configurar OPcache para producción
RUN echo "opcache.enable=1\nopcache.memory_consumption=128\n\
opcache.validate_timestamps=0" > /usr/local/etc/php/conf.d/opcache.ini

# Permisos correctos
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]`}</code></pre>

            <h3>Buenas prácticas de Dockerfile</h3>
            <pre><code>{`# ✅ Usar tags específicos, nunca :latest en producción
FROM php:8.3.6-fpm-alpine3.21

# ✅ Combinar RUN para reducir capas
RUN apk add --no-cache git curl && \
    docker-php-ext-install pdo pdo_mysql

# ✅ .dockerignore para no copiar lo innecesario
# Crea .dockerignore con:
node_modules/
vendor/
.git/
.env
storage/logs/
tests/

# ✅ Orden: lo que cambia menos → primero
COPY composer.json composer.lock ./   # Cambia poco
RUN composer install                   # Cacheado si composer.json no cambia
COPY . .                               # Cambia siempre (al final)

# ✅ USER sin root en producción
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser`}</code></pre>

            <h2 id="multistage">Multi-stage builds</h2>
            <pre><code>{`# Dockerfile multi-stage para Laravel + Vite
# Stage 1: compilar assets frontend
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: imagen PHP de producción
FROM php:8.3-fpm-alpine AS app

RUN apk add --no-cache libpng-dev libzip-dev && \
    docker-php-ext-install pdo pdo_mysql zip gd opcache

COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader

COPY . .
# Traer assets compilados del stage frontend
COPY --from=frontend /app/public/build ./public/build

RUN composer dump-autoload --optimize && \
    chown -R www-data:www-data storage bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]

# Resultado: imagen ~60% más pequeña que sin multi-stage
# node_modules y archivos de build NO están en la imagen final`}</code></pre>

            <h2 id="volumenes">Volúmenes y redes</h2>

            <h3>Volúmenes — persistencia de datos</h3>
            <pre><code>{`# Tipos de montaje
# 1. Named volume (recomendado para datos)
docker run -v mysql_data:/var/lib/mysql mysql:8.0

# 2. Bind mount (recomendado para desarrollo)
docker run -v $(pwd):/var/www/html php:8.3-fpm-alpine

# 3. tmpfs (en memoria, para datos temporales sensibles)
docker run --tmpfs /tmp mi-app

# Gestión de volúmenes
docker volume ls                      # Listar
docker volume inspect mysql_data      # Detalles
docker volume rm mysql_data           # Eliminar (solo si no está en uso)
docker volume prune                   # Eliminar volúmenes huérfanos

# Backup de un volumen
docker run --rm \
  -v mysql_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/mysql_backup.tar.gz /data`}</code></pre>

            <h3>Redes en Docker</h3>
            <pre><code>{`# Tipos de red
# bridge (defecto) — contenedores en la misma red se ven por nombre
# host — el contenedor usa la red del host directamente
# none — sin red

# Crear red personalizada
docker network create mi-red

# Conectar contenedores a la misma red
docker run -d --name db --network mi-red mysql:8.0
docker run -d --name app --network mi-red mi-laravel-app

# Desde 'app', puedes hacer: mysql -h db -u root -p
# Docker resuelve 'db' como el contenedor de MySQL

# Inspeccionar
docker network ls
docker network inspect mi-red`}</code></pre>

            <h2 id="compose">Docker Compose</h2>
            <pre><code>{`# docker-compose.yml completo para Laravel
services:
  app:
    build:
      context: .
      target: app          # Stage del multi-stage build
    restart: unless-stopped
    working_dir: /var/www/html
    volumes:
      - .:/var/www/html
      - vendor_data:/var/www/html/vendor
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    environment:
      - APP_ENV=local
      - DB_HOST=db
      - REDIS_HOST=redis

  nginx:
    image: nginx:1.27-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - .:/var/www/html
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
      - ./docker/nginx/certs:/etc/nginx/certs
    depends_on:
      - app

  db:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: \${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: \${DB_DATABASE}
      MYSQL_USER: \${DB_USERNAME}
      MYSQL_PASSWORD: \${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data

  queue:
    build:
      context: .
      target: app
    command: php artisan queue:work --sleep=3 --tries=3
    restart: unless-stopped
    depends_on:
      - db
      - redis
    volumes:
      - .:/var/www/html

volumes:
  mysql_data:
  redis_data:
  vendor_data:`}</code></pre>

            <pre><code>{`# Comandos esenciales
docker compose up -d              # Levantar en background
docker compose up -d --build      # Reconstruir imágenes antes
docker compose down               # Parar y eliminar contenedores
docker compose down -v            # También eliminar volúmenes
docker compose logs -f            # Logs de todos los servicios
docker compose logs -f app        # Logs de un servicio
docker compose exec app bash      # Entrar en un contenedor
docker compose ps                 # Estado de los servicios
docker compose restart app        # Reiniciar un servicio
docker compose pull               # Actualizar imágenes base`}</code></pre>

            <h2 id="produccion">Docker en producción</h2>

            <h3>Script de deploy con Docker</h3>
            <pre><code>{`#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/mi-app"
REGISTRY="registry.gitlab.com/mi-usuario/mi-app"
VERSION=\$(git rev-parse --short HEAD)

log() { echo "[$(date '+%H:%M:%S')] $1"; }

cd "$APP_DIR"

log "Actualizando código..."
git pull origin main

log "Construyendo imagen $VERSION..."
docker build -t "$REGISTRY/app:$VERSION" -t "$REGISTRY/app:latest" .

log "Subiendo imagen al registry..."
docker push "$REGISTRY/app:$VERSION"
docker push "$REGISTRY/app:latest"

log "Actualizando servicios..."
docker compose pull app
docker compose up -d --no-deps app

log "Ejecutando migraciones..."
docker compose exec -T app php artisan migrate --force

log "Limpiando caché..."
docker compose exec -T app php artisan config:cache
docker compose exec -T app php artisan route:cache
docker compose exec -T app php artisan view:cache

log "✅ Deploy $VERSION completado"`}</code></pre>

            <h3>Nginx config para PHP-FPM</h3>
            <pre><code>{`# docker/nginx/default.conf
server {
    listen 80;
    server_name _;
    root /var/www/html/public;
    index index.php;

    # Seguridad
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \\.php$ {
        fastcgi_pass app:9000;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\\.(?!well-known).* {
        deny all;
    }

    # Caché de assets estáticos
    location ~* \\.(css|js|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}`}</code></pre>

            <h2 id="laravel">Docker con Laravel — stack completo</h2>

            <h3>Estructura de archivos Docker</h3>
            <pre><code>{`mi-laravel-app/
├── docker/
│   ├── nginx/
│   │   └── default.conf
│   └── php/
│       └── php.ini            # Configuración PHP de producción
├── docker-compose.yml         # Desarrollo local
├── docker-compose.prod.yml    # Sobrescritura para producción
├── Dockerfile
└── .dockerignore`}</code></pre>

            <h3>php.ini optimizado para producción</h3>
            <pre><code>{`; docker/php/php.ini
[PHP]
memory_limit = 256M
upload_max_filesize = 20M
post_max_size = 20M
max_execution_time = 60

[opcache]
opcache.enable = 1
opcache.memory_consumption = 128
opcache.interned_strings_buffer = 8
opcache.max_accelerated_files = 10000
opcache.revalidate_freq = 0
opcache.validate_timestamps = 0
opcache.save_comments = 1

[Date]
date.timezone = Europe/Madrid`}</code></pre>

            <h3>Novedades Docker 2026</h3>
            <ul>
                <li><strong>virtiofs en Docker Desktop 4.50</strong> — bind mounts hasta 98% más rápidos en Mac. Actívalo en Settings → General → "Use VirtioFS".</li>
                <li><strong>MCP Toolkit</strong> — conecta tus contenedores con agentes de IA (Claude, Copilot) directamente desde Docker Desktop.</li>
                <li><strong>SBOM automático</strong> — <code>docker buildx build --sbom=true</code> genera un Software Bill of Materials de cada imagen.</li>
                <li><strong>Zero-trust networking</strong> — redes aisladas por defecto, sin acceso cross-compose salvo configuración explícita.</li>
                <li><strong>Docker Scout</strong> — análisis de vulnerabilidades integrado: <code>docker scout cves mi-app:latest</code>.</li>
            </ul>
        </LessonLayout>
    );
}
