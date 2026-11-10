const ENTITES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

export function decoderEntites(texte) {
  return texte.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (tout, code) => {
    if (code[0] === '#') {
      const nombre = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : Number(code.slice(1));
      return Number.isFinite(nombre) ? String.fromCodePoint(nombre) : tout;
    }
    return ENTITES[code.toLowerCase()] ?? tout;
  });
}

export function texteSimple(html) {
  return decoderEntites(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}
