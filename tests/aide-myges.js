import http from 'node:http';
import zlib from 'node:zlib';

export const IDENTIFIANTS = { identifiant: 'aandre', motDePasse: 'a=b:c é&x' };

export async function demarrerFauxMyges(gestionnaire) {
  const serveur = http.createServer(gestionnaire);
  await new Promise((resoudre) => serveur.listen(0, '127.0.0.1', resoudre));
  const { port } = serveur.address();
  return {
    adresse: `http://127.0.0.1:${port}`,
    fermer: () => new Promise((resoudre) => {
      serveur.closeAllConnections();
      serveur.close(resoudre);
    }),
  };
}

function echapper(texte) {
  return texte.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export function pageSupports(adresse, matieres) {
  const blocs = matieres.map((matiere, i) => {
    const titre = `<h3 class="ui-accordion-header ui-helper-reset ui-state-default ui-corner-all" role="tab" aria-expanded="false"><span class="ui-icon ui-icon-triangle-1-e"></span>
                                <div class="mg_inherit_color">
                                    ${echapper(matiere.nom)}  <span style="font-size: 11px; color: #5D5D5D">M. PROF</span>  <span style="font-style: italic; font-size: 10px; color: #000;">${matiere.fichiers.length} fichier(s)</span>
                                </div></h3>`;
    if (!matiere.fichiers.length) return `${titre}<div id="coursesFilesForm:coursesWidget:coursesAccordion:${i}:j_idt176" class="ui-accordion-content"></div>`;
    const lignes = matiere.fichiers.map((fichier, j) => `<tr data-ri="${j}" class="ui-widget-content" role="row"><td role="gridcell" style="width:165px;">${fichier.date ?? '13/10/2026 10h17'}</td><td role="gridcell"><img id="x" src="/public/images/mimetypes/${fichier.type ?? 'pdf'}.png?pfdrid_c=true" alt="" style="float: left" /><a href="" onclick="window.open('${adresse}/dl/private/${fichier.id}'); return false;" style="margin-left: 5px">
                                        ${echapper(fichier.nom)}
                                    </a></td><td role="gridcell" style="width:12px;"><button type="button" onclick="window.open('${adresse}/dl/private/${fichier.id}'); return false;;window.open('/alumni/courses-files','_self')"></button></td></tr>`).join('');
    return `${titre}<div class="ui-accordion-content"><div class="ui-datatable"><table role="grid"><thead><tr role="row"><th><span class="ui-column-title">Ajouté le</span></th></tr></thead><tbody class="ui-datatable-data">${lignes}</tbody></table></div></div>`;
  }).join('');
  return `<!DOCTYPE html><html><body><form id="coursesFilesForm" name="coursesFilesForm" method="post" action="/student/courses-files"><select id="coursesFilesForm:j_idt173:periodSelect_input"><option value="1" selected="selected">2026-2027 - ESGI - TEST - Semestre 1</option></select><div id="coursesFilesForm:coursesWidget:coursesAccordion" class="ui-accordion">${blocs}</div></form></body></html>`;
}

function pageConnexion() {
  return `<!DOCTYPE html><html><body><form id="fm1" action="/cas/login;jsessionid=ABC" method="post">
<input id="username" name="username" type="text" value="" />
<input id="password" name="password" type="password" value="" />
<input type="hidden" name="lt" value="LT-1-xyz" />
<input type="hidden" name="execution" value="e1s1" />
<input type="hidden" name="_eventId" value="submit" />
<input name="submit" type="submit" value="SE CONNECTER" />
</form></body></html>`;
}

function lireCorps(requete) {
  return new Promise((resoudre) => {
    let corps = '';
    requete.setEncoding('utf8');
    requete.on('data', (morceau) => { corps += morceau; });
    requete.on('end', () => resoudre(corps));
  });
}

export async function demarrerFauxSiteMyges({ matieres = [], identifiants = IDENTIFIANTS, surTelechargement } = {}) {
  const compteurs = { connexions: 0, listes: 0, telechargements: 0 };
  let adresse = '';
  const faux = await demarrerFauxMyges(async (requete, reponse) => {
    const url = new URL(requete.url, adresse);
    const cookies = requete.headers.cookie ?? '';
    const connecte = cookies.includes('SESSION=ok');
    if (url.pathname === '/cas/login' && requete.method === 'GET') {
      if (cookies.includes('CASTGC=tgc')) {
        reponse.writeHead(302, { Location: `${url.searchParams.get('service') ?? `${adresse}/j_spring_cas_security_check`}?ticket=ST-1` }).end();
        return;
      }
      reponse.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8', 'Set-Cookie': 'JSESSIONID=ABC; Path=/cas' }).end(pageConnexion());
      return;
    }
    if (url.pathname.startsWith('/cas/login;') && requete.method === 'POST') {
      compteurs.connexions += 1;
      const champs = new URLSearchParams(await lireCorps(requete));
      const valides = champs.get('username') === identifiants.identifiant && champs.get('password') === identifiants.motDePasse && champs.get('lt') === 'LT-1-xyz' && champs.get('execution') === 'e1s1';
      if (!valides) {
        reponse.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' }).end(pageConnexion());
        return;
      }
      reponse.writeHead(302, { Location: `${adresse}/j_spring_cas_security_check?ticket=ST-1`, 'Set-Cookie': 'CASTGC=tgc; Path=/; Secure; HttpOnly' }).end();
      return;
    }
    if (url.pathname === '/j_spring_cas_security_check') {
      reponse.writeHead(302, { Location: '/student/home', 'Set-Cookie': 'SESSION=ok; Path=/' }).end();
      return;
    }
    if (!connecte) {
      reponse.writeHead(302, { Location: `${adresse}/cas/login?service=${encodeURIComponent(`${adresse}/j_spring_cas_security_check`)}` }).end();
      return;
    }
    if (url.pathname === '/student/home') {
      reponse.writeHead(200, { 'Content-Type': 'text/html' }).end('<html><body>Accueil</body></html>');
      return;
    }
    if (url.pathname === '/student/courses-files') {
      compteurs.listes += 1;
      reponse.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' }).end(pageSupports(adresse, matieres));
      return;
    }
    const telechargement = /^\/dl\/private\/([\w-]+)$/.exec(url.pathname);
    if (telechargement) {
      compteurs.telechargements += 1;
      const fichier = matieres.flatMap((matiere) => matiere.fichiers).find((f) => f.id === telechargement[1]);
      if (surTelechargement && (await surTelechargement(fichier, reponse)) === false) return;
      if (!fichier) {
        reponse.writeHead(404).end();
        return;
      }
      const nom = fichier.nomFichier ?? `${fichier.nom}.pdf`;
      reponse.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${Buffer.from(nom, 'utf8').toString('latin1')}"`,
      }).end(fichier.contenu ?? `contenu de ${fichier.nom}`);
      return;
    }
    reponse.writeHead(404).end();
  });
  adresse = faux.adresse;
  return { ...faux, compteurs };
}

export function creerZip(entrees) {
  const locaux = [];
  const centraux = [];
  let position = 0;
  for (const { nom, contenu } of entrees) {
    const nomOctets = Buffer.from(nom, 'utf8');
    const donnees = Buffer.from(contenu, 'utf8');
    const crc = zlib.crc32(donnees);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(donnees.length, 18);
    local.writeUInt32LE(donnees.length, 22);
    local.writeUInt16LE(nomOctets.length, 26);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(donnees.length, 20);
    central.writeUInt32LE(donnees.length, 24);
    central.writeUInt16LE(nomOctets.length, 28);
    central.writeUInt32LE(position, 42);
    locaux.push(local, nomOctets, donnees);
    centraux.push(central, nomOctets);
    position += local.length + nomOctets.length + donnees.length;
  }
  const repertoire = Buffer.concat(centraux);
  const fin = Buffer.alloc(22);
  fin.writeUInt32LE(0x06054b50, 0);
  fin.writeUInt16LE(entrees.length, 8);
  fin.writeUInt16LE(entrees.length, 10);
  fin.writeUInt32LE(repertoire.length, 12);
  fin.writeUInt32LE(position, 16);
  return Buffer.concat([...locaux, repertoire, fin]);
}
