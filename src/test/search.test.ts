import { describe, expect, it } from 'vitest';
import { search, sectionsOf, STATIC_ENTRIES } from '@/lib/search';
import { slugify } from '@/lib/slugify';

describe('search', () => {
    it('encuentra cursos sin importar tildes ni mayúsculas', () => {
        const hits = search(STATIC_ENTRIES, 'pyTHON desde');
        expect(hits[0].href).toBe('/lecciones/python-basico');
    });
    it('exige todas las palabras', () => {
        expect(search(STATIC_ENTRIES, 'docker zzzz')).toEqual([]);
    });
    it('prioriza el título sobre la descripción', () => {
        expect(search(STATIC_ENTRIES, 'power bi')[0].title).toBe('Power BI desde cero');
    });
    it('vacío no devuelve nada', () => {
        expect(search(STATIC_ENTRIES, '   ')).toEqual([]);
    });
});

describe('sectionsOf', () => {
    it('saca los apartados con el ancla que usa la lección', () => {
        const s = sectionsOf('sql-basico', '# T\n\n## Crear tablas\n\ntexto\n\n## Qué es `JOIN`?\n');
        expect(s.map((x) => x.href)).toEqual(['/lecciones/sql-basico#crear-tablas', '/lecciones/sql-basico#que-es-join']);
        expect(s[1].title).toBe('Qué es JOIN?');
    });
    it('ignora archivos que no son cursos', () => {
        expect(sectionsOf('no-existe', '## A')).toEqual([]);
    });
    it('slugify quita tildes y símbolos', () => {
        expect(slugify('¿Qué es Docker y por qué?')).toBe('que-es-docker-y-por-que');
    });
});
