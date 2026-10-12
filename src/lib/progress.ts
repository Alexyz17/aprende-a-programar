import { useSyncExternalStore } from 'react';

/**
 * Progreso y récords guardados solo en el navegador (localStorage).
 * No hay cuentas ni servidor: nada sale del ordenador de quien estudia.
 */

const KEY_DONE = 'aap:completed';
const KEY_SCORES = 'aap:scores';

export interface ScoreEntry {
    best: number;
    max: number;
    plays: number;
    lastPlayed: string;
}

function read<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

function write(key: string, value: unknown) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* modo privado o almacenamiento bloqueado: el progreso no se guarda */
    }
    emit();
}

const listeners = new Set<() => void>();
function emit() {
    snapshot = load();
    listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
    listeners.add(cb);
    const onStorage = () => emit();
    window.addEventListener('storage', onStorage);
    return () => {
        listeners.delete(cb);
        window.removeEventListener('storage', onStorage);
    };
}

interface Snapshot {
    completed: string[];
    scores: Record<string, ScoreEntry>;
}
function load(): Snapshot {
    return { completed: read<string[]>(KEY_DONE, []), scores: read<Record<string, ScoreEntry>>(KEY_SCORES, {}) };
}
let snapshot: Snapshot = typeof window === 'undefined' ? { completed: [], scores: {} } : load();

export function useProgress() {
    return useSyncExternalStore(subscribe, () => snapshot, () => snapshot);
}

export function toggleCompleted(slug: string) {
    const set = new Set(snapshot.completed);
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);
    write(KEY_DONE, [...set]);
}

export function saveScore(gameSlug: string, score: number, max: number) {
    const prev = snapshot.scores[gameSlug];
    const entry: ScoreEntry = {
        best: Math.max(prev?.best ?? 0, score),
        max,
        plays: (prev?.plays ?? 0) + 1,
        lastPlayed: new Date().toISOString(),
    };
    write(KEY_SCORES, { ...snapshot.scores, [gameSlug]: entry });
    return { isRecord: !prev || score > prev.best, entry };
}

export function resetProgress() {
    write(KEY_DONE, []);
    write(KEY_SCORES, {});
}
