import { useSyncExternalStore } from 'react';

/**
 * Progreso y récords guardados solo en el navegador (localStorage).
 * No hay cuentas ni servidor: nada sale del ordenador de quien estudia.
 */

const KEY_DONE = 'aap:completed';
const KEY_SCORES = 'aap:scores';
const KEY_READ = 'aap:read';
const KEY_DAYS = 'aap:days';
const KEY_DAILY = 'aap:daily';

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

export interface DailyAnswer {
    date: string;
    given: string;
    correct: boolean;
}

interface Snapshot {
    completed: string[];
    scores: Record<string, ScoreEntry>;
    /** Apartados leídos por curso (ids de los enlaces del índice). */
    read: Record<string, string[]>;
    /** Días con actividad, en formato AAAA-MM-DD de la hora local. */
    days: string[];
    daily: DailyAnswer | null;
}
function load(): Snapshot {
    return {
        completed: read<string[]>(KEY_DONE, []),
        scores: read<Record<string, ScoreEntry>>(KEY_SCORES, {}),
        read: read<Record<string, string[]>>(KEY_READ, {}),
        days: read<string[]>(KEY_DAYS, []),
        daily: read<DailyAnswer | null>(KEY_DAILY, null),
    };
}
const EMPTY: Snapshot = { completed: [], scores: {}, read: {}, days: [], daily: null };
let snapshot: Snapshot = typeof window === 'undefined' ? EMPTY : load();

/** Fecha local AAAA-MM-DD (no UTC: a las 00:30 en Madrid ya es "hoy"). */
export function dayKey(d = new Date()): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Días seguidos con actividad que terminan hoy o ayer (si hoy aún no has estudiado, la racha sigue viva). */
export function streak(days: string[], today = new Date()): number {
    const set = new Set(days);
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
    let n = 0;
    while (set.has(dayKey(d))) {
        n++;
        d.setDate(d.getDate() - 1);
    }
    return n;
}

/** Apunta que hoy has estudiado. Se guardan como mucho 400 días. */
export function markActive() {
    const today = dayKey();
    if (snapshot.days.includes(today)) return;
    write(KEY_DAYS, [...snapshot.days, today].slice(-400));
}

export function toggleRead(slug: string, id: string) {
    const current = new Set(snapshot.read[slug] ?? []);
    if (current.has(id)) current.delete(id);
    else {
        current.add(id);
        markActive();
    }
    write(KEY_READ, { ...snapshot.read, [slug]: [...current] });
}

export function answerDaily(given: string, correct: boolean) {
    write(KEY_DAILY, { date: dayKey(), given, correct });
    markActive();
}

export function useProgress() {
    return useSyncExternalStore(subscribe, () => snapshot, () => snapshot);
}

export function toggleCompleted(slug: string) {
    const set = new Set(snapshot.completed);
    if (set.has(slug)) set.delete(slug);
    else {
        set.add(slug);
        markActive();
    }
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
    markActive();
    write(KEY_SCORES, { ...snapshot.scores, [gameSlug]: entry });
    return { isRecord: !prev || score > prev.best, entry };
}

export function resetProgress() {
    write(KEY_DONE, []);
    write(KEY_SCORES, {});
    write(KEY_READ, {});
    write(KEY_DAYS, []);
    write(KEY_DAILY, null);
}
