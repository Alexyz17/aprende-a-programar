/** Ancla de un título: minúsculas, sin tildes ni símbolos, con guiones. */
export const slugify = (text: string) =>
    text.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
        .replace(/<[^>]+>/g, '').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
