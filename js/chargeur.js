const chargements = new Map();

function garder(cle, creer) {
  if (!chargements.has(cle)) {
    const promesse = creer().catch((erreur) => {
      chargements.delete(cle);
      throw erreur;
    });
    chargements.set(cle, promesse);
  }
  return chargements.get(cle);
}

function ajouterElement(element, avant = null) {
  return new Promise((resoudre, rejeter) => {
    element.addEventListener('load', () => resoudre(), { once: true });
    element.addEventListener('error', () => {
      element.remove();
      rejeter(new Error(`Impossible de charger ${element.src ?? element.href}`));
    }, { once: true });
    document.head.insertBefore(element, avant);
  });
}

export function chargerScript(src) {
  return garder(`script:${src}`, () => {
    if (typeof document === 'undefined') return Promise.reject(new Error('Pas de page'));
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    return ajouterElement(script);
  });
}

export function chargerFeuille(href, { avantLeSite = false } = {}) {
  return garder(`feuille:${href}`, () => {
    if (typeof document === 'undefined') return Promise.resolve();
    if (document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) return Promise.resolve();
    const lien = document.createElement('link');
    lien.rel = 'stylesheet';
    lien.href = href;
    const feuilleDuSite = avantLeSite ? document.querySelector('link[rel="stylesheet"][href="style.css"]') : null;
    return ajouterElement(lien, feuilleDuSite);
  });
}

export function chargerScriptsDansLOrdre(cle, scripts) {
  return garder(`suite:${cle}`, async () => {
    for (const src of scripts) await chargerScript(src);
  });
}
