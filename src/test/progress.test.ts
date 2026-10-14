import { beforeEach, describe, expect, it } from 'vitest';
import { dayKey, streak, toggleRead, toggleCompleted, saveScore, resetProgress, answerDaily } from '@/lib/progress';

const read = (k: string) => JSON.parse(localStorage.getItem(k) ?? 'null');

describe('streak', () => {
    const today = new Date(2026, 9, 14);
    it('cuenta días seguidos hasta hoy', () => {
        expect(streak(['2026-10-12', '2026-10-13', '2026-10-14'], today)).toBe(3);
    });
    it('si hoy no hay actividad, la racha de ayer sigue viva', () => {
        expect(streak(['2026-10-12', '2026-10-13'], today)).toBe(2);
    });
    it('un hueco corta la racha', () => {
        expect(streak(['2026-10-10', '2026-10-14'], today)).toBe(1);
        expect(streak(['2026-10-11', '2026-10-12'], today)).toBe(0);
    });
    it('cruza meses', () => {
        expect(streak(['2026-09-30', '2026-10-01'], new Date(2026, 9, 1))).toBe(2);
    });
});

describe('progreso en localStorage', () => {
    beforeEach(() => { localStorage.clear(); resetProgress(); });

    it('marca y desmarca apartados leídos y apunta el día', () => {
        toggleRead('sql-basico', '/lecciones/sql-basico#joins');
        expect(read('aap:read')).toEqual({ 'sql-basico': ['/lecciones/sql-basico#joins'] });
        expect(read('aap:days')).toEqual([dayKey()]);
        toggleRead('sql-basico', '/lecciones/sql-basico#joins');
        expect(read('aap:read')).toEqual({ 'sql-basico': [] });
    });
    it('completar un curso alterna y no duplica días', () => {
        toggleCompleted('docker');
        toggleCompleted('git-esencial');
        expect(read('aap:completed')).toEqual(['docker', 'git-esencial']);
        expect(read('aap:days')).toHaveLength(1);
        toggleCompleted('docker');
        expect(read('aap:completed')).toEqual(['git-esencial']);
    });
    it('guarda solo la mejor marca', () => {
        expect(saveScore('quiz-sql', 100, 300).isRecord).toBe(true);
        expect(saveScore('quiz-sql', 50, 300).isRecord).toBe(false);
        expect(read('aap:scores')['quiz-sql']).toMatchObject({ best: 100, plays: 2 });
    });
    it('la pregunta del día guarda fecha y acierto', () => {
        answerDaily('O(n)', true);
        expect(read('aap:daily')).toEqual({ date: dayKey(), given: 'O(n)', correct: true });
    });
});
