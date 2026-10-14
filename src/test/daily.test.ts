import { describe, expect, it } from 'vitest';
import { questionOfDay } from '@/components/DailyQuestion';
import { diplomaSvg } from '@/components/Diploma';

describe('pregunta del día', () => {
    it('es la misma todo el día y cambia entre días', () => {
        const a = questionOfDay('2026-10-14');
        expect(questionOfDay('2026-10-14').q.question).toBe(a.q.question);
        const distintas = new Set(['2026-10-14', '2026-10-15', '2026-10-16', '2026-10-17', '2026-10-18'].map((d) => questionOfDay(d).q.question));
        expect(distintas.size).toBeGreaterThan(1);
    });
    it('incluye la respuesta correcta entre las opciones', () => {
        const { q, options } = questionOfDay('2026-01-01');
        expect(options).toContain(q.answer);
        expect([...options].sort()).toEqual([...(q.options ?? [])].sort());
    });
});

describe('diploma', () => {
    it('escapa el nombre para que no se pueda inyectar SVG', () => {
        const svg = diplomaSvg('<script>x</script> & "Ana"', 'Ruta', ['A', 'B'], '14 de octubre de 2026');
        expect(svg).not.toContain('<script>');
        expect(svg).toContain('&lt;script&gt;x&lt;/script&gt; &amp; &quot;Ana&quot;');
    });
    it('reparte muchos cursos en varias líneas', () => {
        const courses = Array.from({ length: 15 }, (_, i) => `Curso número ${i + 1} de prueba`);
        const svg = diplomaSvg('Ana', 'Full stack', courses, 'hoy');
        expect((svg.match(/font-size="20"/g) ?? []).length).toBeGreaterThan(2);
    });
});
