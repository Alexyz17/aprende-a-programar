/**
 * Sustituto ligero de @inertiajs/react para la versión estática.
 * Las páginas originales importan Head, Link, usePage y router desde Inertia;
 * con este módulo (alias en vite.config.ts y tsconfig.json) siguen funcionando
 * sin servidor.
 */
import type { ReactNode } from 'react';
import { Link as RouterLink, navigate } from './router';
import { SITE } from '@/site';

export const Link = RouterLink;

/**
 * React 19 eleva <title> y <meta> al <head> automáticamente, así que basta
 * con renderizar los hijos. Cambiamos la marca antigua por la actual.
 */
export function Head({ children, title }: { children?: ReactNode; title?: string }) {
    return (
        <>
            {title && <title>{`${title} — ${SITE.name}`}</title>}
            {children}
        </>
    );
}

export function usePage<T = Record<string, unknown>>() {
    return { props: { auth: { user: null }, flash: {} } as unknown as T, url: window.location.pathname };
}

export const router = {
    visit: (to: string) => navigate(to),
    get: (to: string) => navigate(to),
};
