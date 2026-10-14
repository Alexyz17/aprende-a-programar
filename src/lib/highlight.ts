/**
 * Resaltado de sintaxis propio y ligero (sin dependencias).
 * No intenta ser perfecto: distingue comentarios, cadenas, números, palabras clave,
 * llamadas a funciones, etiquetas y variables, que es lo que ayuda a leer código al aprender.
 */

const KEYWORDS = new Set(`
abstract and as async await break case catch class const continue def default defer del do elif else enum export extends
false final finally fn for foreach from func function go if implements import in instanceof interface is lambda let
match module namespace new nil none not null or package private protected public pub readonly return self static
struct super switch this throw throws true try type typeof use val var void when where while with yield
None True False echo fi then done esac local
SELECT FROM WHERE JOIN LEFT RIGHT INNER OUTER ON GROUP BY ORDER HAVING LIMIT INSERT INTO VALUES UPDATE DELETE CREATE TABLE
PRIMARY KEY REFERENCES NOT NULL DEFAULT UNIQUE INDEX AS AND OR IN IS DISTINCT COUNT SUM AVG MIN MAX CASE WHEN THEN ELSE END
BEGIN COMMIT ROLLBACK WITH UNION ALL EXISTS LIKE BETWEEN DESC ASC CHECK CASCADE ALTER DROP ADD COLUMN VIEW
VAR RETURN FROM ENV RUN CMD COPY WORKDIR EXPOSE ENTRYPOINT ARG
`.trim().split(/\s+/));

/** Lenguajes cuyos comentarios de línea empiezan por # */
const HASH = new Set(['bash', 'sh', 'shell', 'zsh', 'python', 'py', 'yaml', 'yml', 'toml', 'ini', 'dockerfile', 'nginx', 'r', 'ruby', 'conf', 'env', 'powershell', 'ps1']);
/** Lenguajes cuyos comentarios de línea empiezan por -- */
const DASH = new Set(['sql', 'psql', 'dax', 'lua', 'haskell']);
/** Bloques que se dejan en texto plano */
const PLAIN = new Set(['text', 'txt', 'csv', 'plain', 'output', 'console']);
/** Marcado: solo etiquetas, cadenas y comentarios (sin palabras clave) */
const MARKUP = new Set(['html', 'xml', 'svg', 'vue', 'blade']);

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function highlight(code: string, lang = ''): string {
    const l = lang.toLowerCase();
    if (PLAIN.has(l)) return escape(code);
    // Sin lenguaje (lecciones antiguas) se aceptan los dos estilos de comentario.
    const hash = !l || HASH.has(l);
    const dash = DASH.has(l);

    const re = new RegExp([
        '(?<c>/\\*[\\s\\S]*?\\*/|<!--[\\s\\S]*?-->|(?<=^|\\s)//.*'
            + (hash ? '|(?<=^|\\s)#(?!\\[)(?=\\s|!|$).*' : '')
            + (dash ? '|(?<=^|\\s)--(?=\\s|$).*' : '') + ')',
        '(?<s>"(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\'|`(?:\\\\.|[^`\\\\])*`)',
        '(?<t></?[A-Za-z][\\w.-]*)',
        '(?<v>\\$[A-Za-z_]\\w*)',
        // Límites de palabra que entienden acentos: \b solo conoce ASCII y partiría "Librerías".
        '(?<n>(?<![\\p{L}\\w])\\d+(?:[.,]\\d+)?(?![\\p{L}\\w]))',
        '(?<f>(?<![\\p{L}\\w.\\/])[A-Za-z_]\\w*(?=\\s*\\())',
        '(?<w>(?<![\\p{L}\\w.\\/\\-])[A-Za-z_]\\w*(?![\\p{L}\\w]))',
    ].join('|'), 'gmu');

    let out = '';
    let last = 0;
    for (const m of code.matchAll(re)) {
        const g = m.groups!;
        const kw = (w: string) => !MARKUP.has(l) && KEYWORDS.has(w) || (dash && KEYWORDS.has(w.toUpperCase()));
        const kind = g.c ? 'c' : g.s ? 's' : g.t ? 't' : g.v ? 'v' : g.n ? 'n' : g.f ? (kw(g.f) ? 'k' : 'f') : kw(g.w) ? 'k' : '';
        if (!kind) continue;
        out += escape(code.slice(last, m.index)) + `<span class="tk-${kind}">${escape(m[0])}</span>`;
        last = m.index + m[0].length;
    }
    return out + escape(code.slice(last));
}

/** Resalta y añade botón de copiar a los bloques de código de un contenedor ya pintado. */
export function enhanceCodeBlocks(root: ParentNode) {
    root.querySelectorAll<HTMLElement>('pre > code:not([data-hl])').forEach((code) => {
        const lang = code.dataset.lang ?? '';
        code.innerHTML = highlight(code.textContent ?? '', lang);
        code.dataset.hl = '1';
        const pre = code.parentElement!;
        if (pre.closest('.md-code, [data-nocopy]')) return;
        pre.classList.add('relative', 'group');
        pre.insertAdjacentHTML('beforeend', '<button type="button" class="md-copy md-copy-float">Copiar</button>');
    });
}

/** Clic delegado en los botones "Copiar" generados. Devuelve true si lo ha gestionado. */
export function handleCopyClick(target: HTMLElement): boolean {
    const btn = target.closest<HTMLButtonElement>('button.md-copy');
    if (!btn) return false;
    const code = btn.closest('.md-code, pre')?.querySelector('code');
    if (!code) return true;
    navigator.clipboard?.writeText(code.textContent ?? '').then(() => {
        btn.textContent = '¡Copiado!';
        setTimeout(() => { btn.textContent = 'Copiar'; }, 1800);
    }).catch(() => { /* sin permiso de portapapeles */ });
    return true;
}
