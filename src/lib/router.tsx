import { useEffect, useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react';

/**
 * Router mínimo basado en la History API.
 * La web se publica en un subdirectorio (p. ej. /aprende-a-programar/),
 * así que todas las rutas internas se escriben como "/cursos" y aquí se
 * les añade la base del despliegue.
 */
export const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');

export function withBase(path: string): string {
    if (!path.startsWith('/')) return path;
    return `${BASE}${path}`;
}

function stripBase(pathname: string): string {
    if (BASE && pathname.startsWith(BASE)) {
        const rest = pathname.slice(BASE.length);
        return rest === '' ? '/' : rest;
    }
    return pathname;
}

function normalise(path: string): string {
    if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
    return path;
}

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
    listeners.add(cb);
    window.addEventListener('popstate', cb);
    return () => {
        listeners.delete(cb);
        window.removeEventListener('popstate', cb);
    };
}
function getPath() {
    return normalise(stripBase(window.location.pathname));
}

export function usePath(): string {
    return useSyncExternalStore(subscribe, getPath, () => '/');
}

function scrollToHash(hash: string) {
    if (!hash) {
        window.scrollTo({ top: 0 });
        return;
    }
    // Esperamos al render de la nueva página antes de buscar el ancla.
    requestAnimationFrame(() => {
        const el = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

export function navigate(to: string, { replace = false } = {}) {
    const url = new URL(withBase(to), window.location.origin);
    if (replace) window.history.replaceState(null, '', url);
    else window.history.pushState(null, '', url);
    listeners.forEach((l) => l());
    scrollToHash(url.hash);
}

/** Al cargar la página directamente con un #ancla, desplazarse hasta ella. */
export function useInitialHashScroll() {
    useEffect(() => {
        if (window.location.hash) scrollToHash(window.location.hash);
    }, []);
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Link({ href, onClick, target, ...rest }: LinkProps) {
    const isExternal = /^(https?:|mailto:|tel:)/.test(href);
    const isHashOnly = href.startsWith('#');

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || isExternal || target === '_blank') return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        if (isHashOnly) {
            window.history.pushState(null, '', href);
            scrollToHash(href);
            return;
        }
        navigate(href);
    };

    const finalHref = isExternal || isHashOnly ? href : withBase(href);
    const extra = isExternal ? { target: target ?? '_blank', rel: 'noopener noreferrer' } : { target };
    return <a href={finalHref} onClick={handleClick} {...extra} {...rest} />;
}
