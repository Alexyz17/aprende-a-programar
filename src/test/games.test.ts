import { describe, expect, it } from 'vitest';
import { isCorrect } from '@/Pages/Juegos/Show';
import { GAMES } from '@/data/games';
import { COURSES } from '@/data/courses';
import { PATHS } from '@/data/paths';
import { withBase } from '@/lib/router';

describe('isCorrect', () => {
    const q = { question: '', answer: 'console.log(x)', accept: ['print(x)'], explanation: '', points: 1 };
    it('quiz: coincidencia exacta tras normalizar espacios', () => {
        expect(isCorrect({ ...q, answer: 'El Pod' }, 'quiz', '  El   Pod ')).toBe(true);
        expect(isCorrect({ ...q, answer: 'El Pod' }, 'quiz', 'El nodo')).toBe(false);
    });
    it('fill_code: perdona espacios alrededor de símbolos y acepta alternativas', () => {
        expect(isCorrect(q, 'fill_code', 'console.log( x )')).toBe(true);
        expect(isCorrect(q, 'fill_code', 'print(x)')).toBe(true);
        expect(isCorrect(q, 'fill_code', 'console.log(y)')).toBe(false);
    });
    it('order_blocks: solo el orden original es correcto', () => {
        expect(isCorrect(q, 'order_blocks', [0, 1, 2])).toBe(true);
        expect(isCorrect(q, 'order_blocks', [1, 0, 2])).toBe(false);
    });
});

describe('integridad del catálogo', () => {
    it('slugs únicos en cursos y juegos', () => {
        expect(new Set(COURSES.map((c) => c.slug)).size).toBe(COURSES.length);
        expect(new Set(GAMES.map((g) => g.slug)).size).toBe(GAMES.length);
    });
    it('cada juego y cada ruta apuntan a cursos que existen', () => {
        const slugs = new Set(COURSES.map((c) => c.slug));
        GAMES.forEach((g) => expect(slugs, g.slug).toContain(g.course));
        PATHS.forEach((p) => p.courses.forEach((c) => expect(slugs, p.slug).toContain(c)));
    });
    it('en los test la respuesta está entre las opciones y no hay opciones repetidas', () => {
        GAMES.filter((g) => g.type === 'quiz').forEach((g) => g.questions.forEach((q) => {
            expect(q.options, q.question).toContain(q.answer);
            expect(new Set(q.options).size, q.question).toBe(q.options!.length);
        }));
    });
    it('order_blocks no tiene bloques repetidos', () => {
        GAMES.filter((g) => g.type === 'order_blocks').forEach((g) => g.questions.forEach((q) => {
            expect(new Set(q.options).size, q.question).toBe(q.options!.length);
        }));
    });
});

describe('router', () => {
    it('withBase deja intactas las rutas externas y relativas', () => {
        expect(withBase('https://x.dev')).toBe('https://x.dev');
        expect(withBase('#a')).toBe('#a');
        expect(withBase('/cursos').endsWith('/cursos')).toBe(true);
    });
});
