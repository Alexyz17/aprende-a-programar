import LessonLayout from '@/layouts/LessonLayout';
import { Head } from '@inertiajs/react';

const modules = [
    { id: '/lecciones/github-actions', title: 'Conceptos CI/CD y GitHub Actions', free: true },
    { id: '/lecciones/github-actions#primer-workflow', title: 'Tu primer workflow', free: true },
    { id: '/lecciones/github-actions#jobs', title: 'Jobs, steps y runners', free: true },
    { id: '/lecciones/github-actions#secrets', title: 'Secrets y variables', free: true },
    { id: '/lecciones/github-actions#matrix', title: 'Matrix builds', free: true },
    { id: '/lecciones/github-actions#deploy', title: 'Deploy automático', free: true },
    { id: '/lecciones/github-actions#cache', title: 'Caché y artefactos', free: true },
    { id: '/lecciones/github-actions#custom', title: 'Actions y workflows reutilizables', free: true },
];

export default function GitHubActions() {
    return (
        <LessonLayout
            title="GitHub Actions — CI/CD"
            description="Automatiza tests, builds y deploys con GitHub Actions. Workflows profesionales desde cero."
            duration="4h 00min"
            lessons={20}
            level="Intermedio"
            premium={false}
            modules={modules}
            activeModule="/lecciones/github-actions"
            allUnlocked={true}
            category="DevOps"
        >
            <Head>
                <title>GitHub Actions CI/CD — Aprende a Programar</title>
                <meta name="description" content="Curso completo de GitHub Actions: workflows, matrix builds, secrets, deploy y Actions personalizadas." />
            </Head>

            <h1>GitHub Actions — CI/CD</h1>

            <blockquote>
                CI/CD es la práctica más impactante para la calidad del software. GitHub Actions lo hace accesible a cualquier proyecto sin infraestructura adicional. Este curso te lleva desde el primer workflow hasta pipelines de producción completos.
            </blockquote>

            {/* ── 1. Primer workflow ── */}
            <h2 id="primer-workflow">Workflow básico de CI</h2>
            <pre><code>{`# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test -- --coverage
      - run: npm run build`}</code></pre>

            {/* ── 2. Jobs y steps ── */}
            <h2 id="jobs">Jobs, steps y runners</h2>
            <pre><code>{`name: Pipeline Completa

on:
  push:
    branches: [main]

jobs:
  # Job 1: linting y tipos
  calidad:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  # Job 2: tests (en paralelo con calidad)
  tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm test -- --coverage --reporter=junit
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: resultados-tests
          path: coverage/

  # Job 3: build (depende de calidad y tests)
  build:
    needs: [calidad, tests]   # espera a que ambos terminen
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 7

  # Job 4: deploy (solo si build pasó y estamos en main)
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production   # requiere aprobación manual (configurar en repo settings)
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/download-artifact@v4
        with: { name: dist, path: dist/ }
      - name: Deploy a producción
        run: echo "Desplegando..."`}</code></pre>

            {/* ── 3. Secrets ── */}
            <h2 id="secrets">Secrets y variables de entorno</h2>
            <pre><code>{`# Secrets — nunca aparecen en los logs
# Configurar en: Settings → Secrets and variables → Actions

name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      # Variables de entorno del job (visibles en logs)
      NODE_ENV: production
      APP_URL: https://miapp.com

    steps:
      - uses: actions/checkout@v4

      # Los secrets se referencian con \${{ secrets.NOMBRE }}
      - name: Configurar .env de producción
        run: |
          echo "APP_KEY=\${{ secrets.APP_KEY }}" >> .env
          echo "DB_PASSWORD=\${{ secrets.DB_PASSWORD }}" >> .env
          echo "STRIPE_SECRET=\${{ secrets.STRIPE_SECRET }}" >> .env

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.SERVER_HOST }}
          username: \${{ secrets.SERVER_USER }}
          key: \${{ secrets.SSH_PRIVATE_KEY }}
          port: \${{ secrets.SERVER_PORT }}
          script: |
            set -e
            cd /var/www/mi-app
            git fetch origin main
            git reset --hard origin/main
            composer install --no-dev --optimize-autoloader
            npm ci --omit=dev
            npm run build
            php artisan migrate --force
            php artisan config:cache
            php artisan route:cache
            php artisan view:cache
            sudo systemctl reload php8.3-fpm
            sudo systemctl reload nginx
            echo "Deploy completado: \$(date)"

      - name: Notificar Slack
        if: always()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Deploy \${{ job.status }} - \${{ github.repository }} @ \${{ github.sha }}"
            }
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK }}`}</code></pre>

            {/* ── 4. Matrix ── */}
            <h2 id="matrix">Matrix builds — test en múltiples entornos</h2>
            <pre><code>{`name: Tests Matrix

on: [push, pull_request]

jobs:
  tests:
    name: PHP \${{ matrix.php }} / Laravel \${{ matrix.laravel }}
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false  # continuar aunque una combinación falle
      matrix:
        php: ['8.2', '8.3']
        laravel: ['10.*', '11.*']
        include:
          # Combinaciones adicionales con variables extra
          - php: '8.3'
            laravel: '11.*'
            coverage: xdebug   # solo en esta combinación
        exclude:
          # Combinaciones que no tienen sentido
          - php: '8.2'
            laravel: '11.*'

    steps:
      - uses: actions/checkout@v4

      - uses: shivammathur/setup-php@v2
        with:
          php-version: \${{ matrix.php }}
          coverage: \${{ matrix.coverage || 'none' }}

      - run: composer require "laravel/framework:\${{ matrix.laravel }}" --no-update
      - run: composer install
      - run: php artisan test

  # Matrix de Node.js
  frontend:
    runs-on: \${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
      - run: npm ci
      - run: npm test`}</code></pre>

            {/* ── 5. Deploy ── */}
            <h2 id="deploy">Deploy automático — múltiples estrategias</h2>
            <pre><code>{`# ── Estrategia 1: Vercel (frontend) ──
name: Deploy Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci && npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

---
# ── Estrategia 2: AWS S3 + CloudFront (static) ──
jobs:
  deploy-aws:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-1
      - run: aws s3 sync dist/ s3://\${{ secrets.S3_BUCKET }} --delete
      - run: aws cloudfront create-invalidation --distribution-id \${{ secrets.CF_DIST_ID }} --paths "/*"

---
# ── Estrategia 3: Docker + registro + pull en servidor ──
jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/\${{ github.repository }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max`}</code></pre>

            {/* ── 6. Caché ── */}
            <h2 id="cache">Caché y artefactos</h2>
            <pre><code>{`# Caché de dependencias — builds más rápidos
- uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      node_modules
    key: \${{ runner.os }}-node-\${{ hashFiles('package-lock.json') }}
    restore-keys: |
      \${{ runner.os }}-node-

# Caché de Composer
- uses: actions/cache@v4
  with:
    path: vendor
    key: \${{ runner.os }}-composer-\${{ hashFiles('composer.lock') }}

# Caché de pip
- uses: actions/cache@v4
  with:
    path: ~/.cache/pip
    key: \${{ runner.os }}-pip-\${{ hashFiles('requirements.txt') }}

# Artefactos — compartir ficheros entre jobs o descargar después
- uses: actions/upload-artifact@v4
  with:
    name: build-output
    path: dist/
    retention-days: 30

- uses: actions/download-artifact@v4
  with:
    name: build-output
    path: ./dist`}</code></pre>

            {/* ── 7. Actions propias ── */}
            <h2 id="custom">Actions personalizadas y workflows reutilizables</h2>
            <pre><code>{`# ── Action compuesta (action.yml en la raíz del repo) ──
name: 'Deploy Laravel'
description: 'Despliega una app Laravel via SSH'
inputs:
  server-host:
    required: true
  server-user:
    required: true
  ssh-key:
    required: true
  app-path:
    default: '/var/www/app'

runs:
  using: composite
  steps:
    - uses: appleboy/ssh-action@v1
      with:
        host: \${{ inputs.server-host }}
        username: \${{ inputs.server-user }}
        key: \${{ inputs.ssh-key }}
        script: |
          cd \${{ inputs.app-path }}
          git pull
          composer install --no-dev
          php artisan migrate --force
          php artisan optimize

---
# ── Workflow reutilizable ──
# .github/workflows/reusable-deploy.yml
on:
  workflow_call:
    inputs:
      environment:
        type: string
        required: true
    secrets:
      deploy-key:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: \${{ inputs.environment }}
    steps:
      - run: echo "Desplegando en \${{ inputs.environment }}"

# Usar el workflow reutilizable desde otro workflow:
jobs:
  deploy-staging:
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: staging
    secrets:
      deploy-key: \${{ secrets.STAGING_KEY }}`}</code></pre>

            <h2>Pipeline completa de producción</h2>
            <p>
                Al terminar este curso tendrás una pipeline completa que: corre tests en paralelo con matrix build, verifica tipos y linting, construye la imagen Docker, la sube a GitHub Container Registry y la despliega automáticamente en tu servidor — todo en menos de 5 minutos desde el push.
            </p>
        </LessonLayout>
    );
}
