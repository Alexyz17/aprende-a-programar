import { describe, expect, it } from 'vitest';
import { highlight } from '@/lib/highlight';

describe('highlight', () => {
    it('escapa HTML y marca etiquetas', () => {
        expect(highlight('<div class="a">x</div>', 'html')).toBe('<span class="tk-t">&lt;div</span> class=<span class="tk-s">"a"</span>&gt;x<span class="tk-t">&lt;/div</span>&gt;');
    });
    it('distingue palabras clave, funciones, números y comentarios', () => {
        const out = highlight('const total = sumar(2, 3); // suma', 'js');
        expect(out).toContain('<span class="tk-k">const</span>');
        expect(out).toContain('<span class="tk-f">sumar</span>');
        expect(out).toContain('<span class="tk-n">2</span>');
        expect(out).toContain('<span class="tk-c">// suma</span>');
    });
    it('no toma una URL por comentario ni un color CSS por comentario', () => {
        expect(highlight('curl https://x.dev/a', 'bash')).not.toContain('tk-c');
        expect(highlight('color: #fff;', 'css')).not.toContain('tk-c');
        expect(highlight('ls -la # lista', 'bash')).toContain('<span class="tk-c"># lista</span>');
    });
    it('reconoce SQL en minúsculas y comentarios con --', () => {
        const out = highlight('select * from t -- todo', 'sql');
        expect(out).toContain('<span class="tk-k">select</span>');
        expect(out).toContain('<span class="tk-c">-- todo</span>');
    });
    it('deja el texto plano tal cual', () => {
        expect(highlight('a,b\n1,<2>', 'csv')).toBe('a,b\n1,&lt;2&gt;');
    });
    it('conserva el texto original al quitar las etiquetas', () => {
        const src = 'function f($a) { return "x" + 1; } /* fin */';
        const div = document.createElement('div');
        div.innerHTML = highlight(src, 'php');
        expect(div.textContent).toBe(src);
    });
});

describe('highlight con acentos y URLs', () => {
    it('no parte palabras con tildes ni resalta trozos de URL', () => {
        expect(highlight('Librerías que faltan', 'bash')).not.toContain('tk-k');
        expect(highlight('curl https://get.docker.com | sh', 'bash')).not.toContain('tk-k');
    });
});
