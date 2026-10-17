// Çok satırlı metni paragraflara böler (boş satır = yeni paragraf).
export const toParagraphs = (text: string): string[] =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
