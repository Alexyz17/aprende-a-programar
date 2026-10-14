/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

// En GitLab Pages la web vive en /<nombre-del-proyecto>/. CI_PAGES_URL lo calcula GitLab.
const base = process.env.BASE_PATH ?? (process.env.CI_PAGES_URL ? new URL(process.env.CI_PAGES_URL).pathname.replace(/\/?$/, '/') : '/');

export default defineConfig({
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@inertiajs/react': fileURLToPath(new URL('./src/lib/inertia.tsx', import.meta.url)),
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    test: { environment: 'jsdom' },
});
