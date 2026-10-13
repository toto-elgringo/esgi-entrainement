const TITRES_ENCARTS = {
  tip: 'Astuce',
  warning: 'Attention',
  info: 'À savoir',
};

const TYPES_ENCARTS = {
  tip: 'tip',
  astuce: 'tip',
  success: 'tip',
  example: 'tip',
  warning: 'warning',
  attention: 'warning',
  danger: 'warning',
  caution: 'warning',
};

export function echapper(texte = '') {
  return String(texte)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function rendreLatex(tex, enBloc = false) {
  if (!window.katex) return `<code>${echapper(tex)}</code>`;
  return window.katex.renderToString(tex, { displayMode: enBloc, throwOnError: false });
}

function protegerFormules(texte) {
  const formules = [];
  let resultat = '';
  let i = 0;
  const garder = (fin) => {
    resultat += texte.slice(i, fin);
    i = fin;
  };

  while (i < texte.length) {
    if (texte.startsWith('```', i)) {
      const fin = texte.indexOf('```', i + 3);
      garder(fin === -1 ? texte.length : fin + 3);
    } else if (texte[i] === '`') {
      const fin = texte.indexOf('`', i + 1);
      garder(fin === -1 ? i + 1 : fin + 1);
    } else if (texte[i] === '\\' && texte[i + 1] === '$') {
      resultat += '$';
      i += 2;
    } else if (texte.startsWith('$$', i) && texte.indexOf('$$', i + 2) !== -1) {
      const fin = texte.indexOf('$$', i + 2);
      formules.push({ tex: texte.slice(i + 2, fin), enBloc: true });
      resultat += `⟦${formules.length - 1}⟧`;
      i = fin + 2;
    } else if (texte[i] === '$' && texte.indexOf('$', i + 1) !== -1 && !texte.slice(i + 1, texte.indexOf('$', i + 1)).includes('\n')) {
      const fin = texte.indexOf('$', i + 1);
      formules.push({ tex: texte.slice(i + 1, fin), enBloc: false });
      resultat += `⟦${formules.length - 1}⟧`;
      i = fin + 1;
    } else {
      garder(i + 1);
    }
  }
  return { texte: resultat, formules };
}

function restaurerFormules(html, formules) {
  return html.replace(/⟦(\d+)⟧/g, (_, index) => rendreLatex(formules[index].tex, formules[index].enBloc));
}

function appliquerEncarts(html) {
  const modele = document.createElement('template');
  modele.innerHTML = html;
  for (const citation of modele.content.querySelectorAll('blockquote')) {
    const paragraphe = citation.querySelector('p');
    const correspondance = paragraphe && /^\s*\[!(\w+)\][ \t]*([^\n]*)\n?/.exec(paragraphe.innerHTML);
    if (!correspondance) continue;
    const type = TYPES_ENCARTS[correspondance[1].toLowerCase()] ?? 'info';
    const titre = correspondance[2].trim() || TITRES_ENCARTS[type];
    citation.classList.add(`encart-${type}`);
    paragraphe.innerHTML = `<span class="encart-titre">${titre}</span>${paragraphe.innerHTML.slice(correspondance[0].length)}`;
  }
  return modele.innerHTML;
}

function preparer(texte, avecFormules) {
  return avecFormules ? protegerFormules(String(texte)) : { texte: String(texte), formules: [] };
}

export function rendreMarkdown(texte = '', { formules: avecFormules = true } = {}) {
  const { texte: protege, formules } = preparer(texte, avecFormules);
  if (!window.marked) return `<p>${restaurerFormules(echapper(protege), formules).replace(/\n\n/g, '</p><p>')}</p>`;
  return appliquerEncarts(restaurerFormules(window.marked.parse(protege), formules));
}

export function rendreMarkdownEnLigne(texte = '', { formules: avecFormules = true } = {}) {
  const { texte: protege, formules } = preparer(texte, avecFormules);
  const html = window.marked ? window.marked.parseInline(protege) : echapper(protege);
  return restaurerFormules(html, formules);
}

export function colorerCode(element, langueParDefaut) {
  if (!window.hljs || !element) return;
  for (const bloc of element.querySelectorAll('pre code')) {
    if (!bloc.className && langueParDefaut) bloc.classList.add(`language-${langueParDefaut}`);
    window.hljs.highlightElement(bloc);
  }
}
