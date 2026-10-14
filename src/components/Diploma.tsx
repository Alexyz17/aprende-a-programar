import { useState } from 'react';
import { Award, Download, X } from 'lucide-react';
import { dayKey } from '@/lib/progress';
import { SITE } from '@/site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Diploma en SVG. Se genera en el navegador: el nombre no sale de tu ordenador. */
export function diplomaSvg(name: string, path: string, courses: string[], date: string): string {
    // Corta la lista de cursos en líneas de ~105 caracteres (como mucho 5).
    const lines: string[] = [];
    for (const c of courses) {
        const last = lines.at(-1);
        if (last !== undefined && (last + ' · ' + c).length <= 105) lines[lines.length - 1] = `${last} · ${c}`;
        else lines.push(c);
    }
    lines.splice(5);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1130" viewBox="0 0 1600 1130">
  <rect width="1600" height="1130" fill="#f7faf8"/>
  <rect x="40" y="40" width="1520" height="1050" rx="28" fill="none" stroke="#047857" stroke-width="6"/>
  <rect x="64" y="64" width="1472" height="1002" rx="18" fill="none" stroke="#047857" stroke-width="1.5" stroke-dasharray="2 10"/>
  <g transform="translate(800 210)" fill="#047857">
    <path d="M-70 0 L0 -36 L70 0 L0 36 Z"/><path d="M-42 18 v34 c0 14 84 14 84 0 v-34 L0 40 Z"/><rect x="58" y="2" width="5" height="46"/>
  </g>
  <text x="800" y="330" text-anchor="middle" font-family="Georgia, serif" font-size="30" letter-spacing="10" fill="#065f46">DIPLOMA DE RUTA COMPLETADA</text>
  <text x="800" y="440" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#334155">Se reconoce que</text>
  <text x="800" y="545" text-anchor="middle" font-family="Georgia, serif" font-size="84" font-weight="bold" fill="#0f172a">${esc(name)}</text>
  <line x1="420" y1="580" x2="1180" y2="580" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="800" y="650" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#334155">ha completado la ruta</text>
  <text x="800" y="725" text-anchor="middle" font-family="Georgia, serif" font-size="52" font-style="italic" fill="#047857">${esc(path)}</text>
  ${lines.map((l, i) => `<text x="800" y="${790 + i * 32}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="20" fill="#475569">${esc(l)}</text>`).join('')}
  <text x="200" y="985" font-family="system-ui, sans-serif" font-size="22" fill="#475569">${esc(date)}</text>
  <text x="1400" y="985" text-anchor="end" font-family="system-ui, sans-serif" font-size="22" fill="#475569">${esc(SITE.name)} · ${esc(SITE.url.replace(/^https:\/\//, ''))}</text>
  <text x="800" y="1040" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" fill="#64748b">Diploma autoemitido: acredita el estudio personal de unos cursos abiertos, no es un título oficial.</text>
</svg>`;
}

function download(name: string, href: string) {
    const a = document.createElement('a');
    a.href = href;
    a.download = name;
    a.click();
}

async function toPng(svg: string, file: string) {
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    try {
        const img = new Image();
        img.src = url;
        await img.decode();
        const canvas = document.createElement('canvas');
        canvas.width = 1600;
        canvas.height = 1130;
        canvas.getContext('2d')!.drawImage(img, 0, 0);
        download(`${file}.png`, canvas.toDataURL('image/png'));
    } catch {
        // Si el navegador no puede convertirlo a PNG, se descarga el SVG.
        download(`${file}.svg`, url);
    } finally {
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
}

export default function Diploma({ path, courses }: { path: string; courses: string[] }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const date = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

    if (!open) {
        return (
            <button type="button" onClick={() => setOpen(true)}
                    className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white">
                <Award className="h-4 w-4" aria-hidden /> Conseguir mi diploma
            </button>
        );
    }
    return (
        <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) toPng(diplomaSvg(name.trim(), path, courses, date), `diploma-${dayKey()}`);
        }}>
            <label className="text-sm">
                <span className="block text-gray-600 dark:text-gray-400 mb-1">Tu nombre en el diploma</span>
                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} required autoFocus
                       className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950" />
            </label>
            <button type="submit" className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white">
                <Download className="h-4 w-4" aria-hidden /> Descargar
            </button>
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="h-4 w-4" aria-hidden />
            </button>
        </form>
    );
}
