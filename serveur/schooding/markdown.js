import { decoderEntites } from '../commun/html.js';

const MARQUE = '\u0000';

function texteBrut(html) {
  return decoderEntites(html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, ''));
}

export function htmlVersMarkdown(html) {
  const blocs = [];
  const garder = (texte) => `${MARQUE}${blocs.push(texte) - 1}${MARQUE}`;
  let texte = html
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi, (_, contenu) => garder(`\n\n\`\`\`\n${texteBrut(contenu).replace(/^\n+|\s+$/g, '')}\n\`\`\`\n\n`))
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_, contenu) => garder(`\`${texteBrut(contenu)}\``))
    .replace(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/gi, (_, source) => garder(`![](${decoderEntites(source)})`))
    .replace(/<a\b[^>]*\bhref="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, lien, contenu) => `[${contenu}](${decoderEntites(lien)})`)
    .replace(/<h([1-6])\b[^>]*>/gi, (_, niveau) => `\n\n${'#'.repeat(Number(niveau))} `)
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<li\b[^>]*>/gi, '\n- ')
    .replace(/<\/(p|div|ul|ol|table|tr)>/gi, '\n\n')
    .replace(/<(p|div|ul|ol|table|tr)\b[^>]*>/gi, '\n')
    .replace(/<\/t[dh]>/gi, ' | ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(b|strong)\b[^>]*>/gi, '**')
    .replace(/<\/?(i|em)\b[^>]*>/gi, '*')
    .replace(/<[^>]*>/g, '');
  texte = decoderEntites(texte)
    .replace(/\*\*(\s*)\*\*/g, '$1')
    .replace(/\*\*([^*\n]*?)\*\*/g, (_, contenu) => {
      const propre = contenu.trim();
      if (!propre) return contenu;
      return `${contenu.match(/^\s*/)[0]}**${propre}**${contenu.match(/\s*$/)[0]}`;
    })
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ');
  return texte
    .replace(new RegExp(`${MARQUE}(\\d+)${MARQUE}`, 'g'), (_, indice) => blocs[Number(indice)])
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function blocCode(code, langage = '') {
  const clotures = code.match(/`{3,}/g)?.map((cloture) => cloture.length) ?? [];
  const cloture = '`'.repeat(Math.max(3, ...clotures.map((taille) => taille + 1)));
  return `${cloture}${langage}\n${code.replace(/\r\n/g, '\n').replace(/\s+$/, '')}\n${cloture}`;
}
