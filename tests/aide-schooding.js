import http from 'node:http';

export const IDENTIFIANTS_SCHOODING = { identifiant: 'eleve42', motDePasse: 'mot&de=passe é' };
const JETON = 'jeton-csrf-123';

const js = (texte) => JSON.stringify(texte).slice(1, -1).replace(/[<>&'=]/g, (caractere) => `\\u${caractere.charCodeAt(0).toString(16).padStart(4, '0')}`);

export function pageConnexion() {
  return `<html><body><form class="form-signin" method="post" action="/login/"><input type="hidden" name="csrfmiddlewaretoken" value="${JETON}"><input type="text" id="id_username" name="username"><input type="password" id="id_password" name="password"><input type="hidden" name="next" value="" /></form></body></html>`;
}

export function pageAccueil() {
  return `<html><body><nav><ul><li class="nav-item dropdown" id="navStudentCourseDrop"><a href="#">Cours</a><div class="dropdown-menu"><div class="dropdown-header">3A (2026)</div><a class="dropdown-item langvar" id="firstNavCourseItem" href="/course/1/">$TR$fr Python</a><a class="dropdown-item langvar" href="/course/2/">Algo Avancée</a></div></li></ul></nav><div class="course"><a href="/course/1/"><h3 class="card-title langvar"> $TR$fr Python</h3></a></div></body></html>`;
}

function lienSeance(id, contenu) {
  return `<a class="session list-group-item list-group-item-action row " data-toggle="list" href="#list-session${id}" id="listitem-session${id}" role="tab" data-session="${id}" aria-controls="session${id}"><div class="progress progress-background"><div class="progress-bar" data-session="${id}" role="progressbar"></div><div class="progress-text" data-session="${id}">${contenu}</div></div></a>`;
}

export function pageCours(id) {
  const seances = id === '1'
    ? [
        lienSeance('11', '<strong> #1 : <span class="langvar">Bases$TR$fr Les bases</span></strong><div class="subtitle"><small> Deadline : 1 octobre 2026 </small></div>'),
        lienSeance('12', '<strong> #2 : <span class="langvar">Fonctions</span></strong>'),
        '<h4 class="list-group-item">Examens passés:</h4>',
        lienSeance('13', '<strong><span class="langvar">QCM de rentrée</span></strong><div class="subtitle"><small> 1 septembre 2026 </small></div>'),
      ]
    : [lienSeance('21', '<strong> #1 : <span class="langvar">Tableaux</span></strong>')];
  return `<html><body><div id="sessionslist"><div class=" list-group" id="session-list-tab" role="tablist"><h3>TPs</h3>${seances.join('')}</div></div><div id="sessiondetail"></div></body></html>`;
}

function elementExercice({ id, titre, classe = 'text-success', icone = 'sentiment_very_satisfied', seance, solution = false }) {
  return `<div class="list-group-item">${solution ? `<a href="#" class="float-right ml-2" onclick="show_in_iframe('Solution','/codingtest/solution/exocourse/${id}/1/?headless=1&minimal=1')" > Solution</a>` : ''}<a onclick="show_in_iframe('Ranking','/ranking/exercice/${id}/1?headless=1')" href="#" class=" float-right"><span class="material-icons">hotel_class</span></a><a href="/codingtest/${id}/?next=/session/${seance}/&session=${seance}" class=" ${classe}"><span class="material-icons float-right">${icone}</span><span class="material-icons">code</span> &nbsp;<strong class="langvar">${titre}</strong>&nbsp; </a></div>`;
}

function carte(titre, elements) {
  return `<div class="card exercices"><h5 class="card-header"> ${titre} </h5><div class="card-body list-group list-group-flush">${elements.join('')}</div> <!-- list group --> </div> <!-- card -->`;
}

export function pageSeance(id, { etatExercice = { classe: 'text-success', icone: 'sentiment_very_satisfied' } } = {}) {
  if (id === '12') {
    return `<div class="mr-2"><h3 class="ml-3 mt-2"> #2 : <span class="langvar">Fonctions</span></h3><div class="list-group-item list-group-item-info"><h3><span class="material-icons">lock</span></h3><p class="text-center"> Pour débloquer cette session, terminez la précédente. </p></div></div>`;
  }
  if (id === '13') {
    return `<div class="mr-2"><h3 class="ml-3 mt-2"><span class="langvar">QCM de rentrée</span></h3>${carte('Exercices', [`<div class="list-group-item"><a href="#" class="text-warning" onclick="show_in_iframe('Correction','/lastresult/9/301?headless=1&minimal=1')"><span class="material-icons">check_box</span> &nbsp;<strong class="langvar">QCM Python</strong>&nbsp;</a><span class="float-right"> 50% pour 1 point(s)</span></div>`])}</div>`;
  }
  const documents = id === '11'
    ? '{ id: 101, title: getLang("Cours : les variables","fr")}, { id: 102, title: getLang("Vidéo : l&#x27;affectation","fr")}, { id: 103, title: getLang("Slides de base$TR$fr Diapos de base","fr")}, '
    : '{ id: 104, title: getLang("Poly tableaux","fr")}, { id: 101, title: getLang("Cours : les variables","fr")}, ';
  const exercices = id === '11'
    ? carte('Exercices', [elementExercice({ id: '201', titre: 'Somme de deux entiers', seance: id, solution: true, ...etatExercice })]) + carte('Devoirs Maison', [elementExercice({ id: '202', titre: 'Table de multiplication', seance: id, classe: 'text-danger', icone: 'sentiment_dissatisfied' })])
    : carte('Exercices', [elementExercice({ id: '203', titre: 'Minimum d’un tableau', seance: id })]);
  const numero = id === '11' ? 1 : 1;
  const titre = id === '11' ? 'Bases$TR$fr Les bases' : 'Tableaux';
  return `<div class="float-left"><div class="card docsCard" id="docsCard${id}"></div><script> generateDocBox($("#docsCard${id}"), [${documents}]); </script></div><div class="mr-2 fitToBottom yscroller"><h3 class="ml-3 mt-2"><div class="dropdown"><a class="dropdown-item " href="/examen/fake/${id}/"> Tester en mode exam</a></div> #${numero} : <span class="langvar">${titre}</span></h3><div class="card mb-3 description"><div class="card-body"><h5 class="card-title"> Description </h5><div class="mb-3 langvarhtml">$TR$fr <p>Dans cette session, on découvre <b>les bases</b>.</p></div> </div> </div>${exercices}</div>`;
}

export function pageExercice(id, { code = 'def somme(a, b):\r\n    return a + b', historique = true } = {}) {
  const titres = { 201: 'Somme de deux entiers', 202: 'Table de multiplication', 203: 'Minimum d’un tableau' };
  const essais = historique ? ' addHistory(5001, "1 octobre 2026 10:00", 50, "Python 3");\n addHistory(5002, "1 octobre 2026 10:05", 100, "Python 3");\n' : '';
  const outils = id === '203' ? ' $("#tools").html(generateDoc({"functions": [{"name": "void debug(value)", "desc": "Affiche la valeur sur la sortie d\'erreur."}], "classes": []}));\n' : ' $(".toolsCard").hide();\n';
  return `<html><body><div id="wordingCard"><div tabindex="0" class="card-body yscroller wording" id="wording" aria-labelledby="wording"><h5 class="langvarhtml">${titres[id]}</h5><div class="langvarhtml"><p>Écrire une fonction qui fait le travail demandé.</p><pre>entrée : 2 3\nsortie : 5</pre></div><div class="langvarhtml">$TR$fr <p>Pensez aux <b>cas limites</b>.</p></div><div id="specWording"></div></div></div><div id="idecontainer"><div class="alert alert-info" role="alert">Exercice non commencé</div></div><script>
 let ide;
 function initCodingTestIDE(fontSize, theme, code, aceMode){
 ide = generateIDE($("#idecontainer"), "");
 }
 initCodingTestIDE(15, "eclipse", "${js(code)}", "${id === '203' ? 'c_cpp' : 'python'}")
${outils} function addHistory(id, date, progression, language) {
 }
${essais} </script></body></html>`;
}

export function pageSolution() {
  return `<html><body><div id="wording"></div><script> function initCodingTestIDE(fontSize, theme, code, aceMode){ } initCodingTestIDE(15, "eclipse", "${js('def somme(a, b):\r\n    return a + b  # officielle')}", "python") </script></body></html>`;
}

export function pageCorrection() {
  const choix = (couleur, coche, texte) => `<div class="list-group-item list-group-item-${couleur}"><span class="material-icons">${coche ? 'check_box' : 'check_box_outline_blank'}</span><div class="langvarhtml">\n ${texte}\n </div></div>`;
  const question = (numero, intitule, lignes) => `<div class="form-group"><div class="card card-default"><div class="card-header">Question #${numero}</div><div class="card-body langvarhtml">\n ${intitule}\n </div><div class="list-group">${lignes.join('')}</div></div></div>`;
  return `<html><body class="full headless"><div id="mainContainer" class="main schoodiv"><div class="page-header"><h1>QCM Python</h1><h2> de Élève </h2></div><div>${question(1, 'Que vaut <code>len("abc")</code> ?', [choix('success', true, '3'), choix('success', false, '2')])}${question(2, 'Quels types sont modifiables ?', [choix('danger', true, 'tuple'), choix('danger', false, 'list'), choix('success', false, '$TR$fr str')])}</div></div></body></html>`;
}

export function pageDocumentMarkdown() {
  return `<html><body style="padding:20px"><div id="body"></div><script> md_update("${js('## Les variables\nUne variable **nomme** une valeur.\n\n```python\nx = 1\n```')}"); </script></body></html>`;
}

export function pageDiaporama() {
  const svg = (texte) => `\\x3csvg viewBox\\x3d\\x220 0 960 540\\x22\\x3e\\x3cg aria-label\\x3d\\x22${texte}\\x22\\x3e\\x3cpath d\\x3d\\x22m0 0\\x22\\/\\x3e\\x3c\\/g\\x3e\\x3c\\/svg\\x3e`;
  return `<html><head><title>Cours de base - Google Slides</title></head><body><script>SK_svgData = '${svg('Python\\x26#xa;Notions de base')}';</script><script>SK_svgData = '${svg('Les listes\\x26#xa;Une liste est modifiable')}';</script></body></html>`;
}

function lireCorps(requete) {
  return new Promise((resoudre) => {
    let corps = '';
    requete.setEncoding('utf8');
    requete.on('data', (morceau) => { corps += morceau; });
    requete.on('end', () => resoudre(corps));
  });
}

export async function demarrerFauxSchooding({ identifiants = IDENTIFIANTS_SCHOODING, limiteSur = null, etatExercice, codeExercice } = {}) {
  const compteurs = { connexions: 0, pages: {}, limites: 0 };
  const dejaLimite = new Set();
  let adresse = '';
  const envoyer = (reponse, statut, contenu, entetes = {}) => {
    reponse.writeHead(statut, { 'Content-Type': 'text/html; charset=utf-8', ...entetes });
    reponse.end(contenu);
  };
  const serveur = http.createServer(async (requete, reponse) => {
    const url = new URL(requete.url, adresse);
    const chemin = url.pathname;
    compteurs.pages[chemin] = (compteurs.pages[chemin] ?? 0) + 1;
    const cookies = requete.headers.cookie ?? '';
    if (limiteSur && chemin === limiteSur && !dejaLimite.has(chemin)) {
      dejaLimite.add(chemin);
      compteurs.limites += 1;
      return envoyer(reponse, 429, '<html><title>429 Too Many Requests</title></html>');
    }
    if (chemin === '/accounts/login/') return envoyer(reponse, 200, pageConnexion(), { 'Set-Cookie': 'csrftoken=abc; Path=/' });
    if (chemin === '/login/' && requete.method === 'POST') {
      compteurs.connexions += 1;
      const champs = new URLSearchParams(await lireCorps(requete));
      const valides = champs.get('csrfmiddlewaretoken') === JETON && cookies.includes('csrftoken=abc') && requete.headers.referer
        && champs.get('username') === identifiants.identifiant && champs.get('password') === identifiants.motDePasse;
      if (!valides) return envoyer(reponse, 200, pageConnexion());
      reponse.writeHead(302, { Location: '/home/', 'Set-Cookie': 'sessionid=ok; Path=/' });
      return reponse.end();
    }
    if (!cookies.includes('sessionid=ok')) {
      reponse.writeHead(302, { Location: `/accounts/login/?next=${chemin}` });
      return reponse.end();
    }
    if (chemin === '/home/') return envoyer(reponse, 200, pageAccueil());
    let trouve;
    if ((trouve = /^\/course\/(\d+)\/$/.exec(chemin))) return envoyer(reponse, 200, pageCours(trouve[1]));
    if ((trouve = /^\/session\/(\d+)\/$/.exec(chemin))) return envoyer(reponse, 200, pageSeance(trouve[1], { etatExercice: etatExercice?.() }));
    if ((trouve = /^\/codingtest\/solution\/exocourse\/(\d+)\/\d+\/$/.exec(chemin))) return envoyer(reponse, 200, pageSolution());
    if ((trouve = /^\/codingtest\/(\d+)\/$/.exec(chemin))) return envoyer(reponse, 200, pageExercice(trouve[1], { code: codeExercice?.(trouve[1]) }));
    if (chemin === '/lastresult/9/301') {
      reponse.writeHead(302, { Location: '/qcm/lastresult/301/9/?headless=1&minimal=1' });
      return reponse.end();
    }
    if (chemin === '/qcm/lastresult/301/9/') return envoyer(reponse, 200, pageCorrection());
    if (chemin === '/documents/show/101/') return envoyer(reponse, 200, pageDocumentMarkdown());
    if (chemin === '/documents/show/102/') {
      reponse.writeHead(302, { Location: 'https://www.youtube.com/embed/VIDEO-test1' });
      return reponse.end();
    }
    if (chemin === '/documents/show/103/') {
      reponse.writeHead(302, { Location: '/presentation/d/e/2PACX-test/embed?start=false' });
      return reponse.end();
    }
    if (chemin === '/presentation/d/e/2PACX-test/embed') return envoyer(reponse, 200, pageDiaporama());
    if (chemin === '/documents/show/104/') {
      reponse.writeHead(200, { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="poly-tableaux.pdf"' });
      return reponse.end('%PDF-1.4 faux');
    }
    envoyer(reponse, 404, 'introuvable');
  });
  await new Promise((resoudre) => serveur.listen(0, '127.0.0.1', resoudre));
  adresse = `http://127.0.0.1:${serveur.address().port}`;
  return {
    adresse,
    compteurs,
    fermer: () => new Promise((resoudre) => {
      serveur.closeAllConnections();
      serveur.close(resoudre);
    }),
  };
}
