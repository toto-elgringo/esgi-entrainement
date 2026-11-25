# Progression sur hermes : plan de mise en œuvre

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**But :** la progression du site hermes est enregistrée dans un fichier sur hermes, et les quiz de Hermes Agent ne se basent que sur ce fichier.

**Architecture :**
- Une fonction de fusion pure, partagée par la page et le serveur, décide de ce qui est retenu.
- Le serveur garde le fichier et expose `GET`/`POST /api/progression`.
- La page envoie chaque changement, garde ceux qui ne sont pas encore partis et se recale sur le serveur à l'ouverture.

**Technique :** JavaScript pur (modules ES), Node.js 20+ sans dépendance, `node:test`, Python 3 (script de Hermes).

**Conception :** `docs/superpowers/specs/2026-11-25-progression-sur-hermes-design.md` (à lire avant chaque tâche).

## Contraintes générales

- Aucune dépendance npm. Pas de commentaires dans le code. Noms et textes en français.
- Tests avant le code (`npm test`).
- Travail sur la branche `dev`. Une fois `npm test` vert, chaque tâche se termine par un commit sur `dev`, avec un message en français et la ligne `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. **Aucun push, aucune fusion dans `main` et aucun déploiement sans la demande d'Antoine.**
- Les six parties synchronisées : `exercices`, `quiz`, `saisies`, `codes`, `partiesQuiz`, `affichages`. `matiere`, `menuRange` et `theme` restent propres à chaque appareil.
- La fonction n'est active que si `ESGI_PROGRESSION` est réglée. Sans elle, le site se comporte exactement comme aujourd'hui.
- Sur hermes : jamais de `rm` (`gio trash`), jamais de `sudo`, ne pas toucher à RustDesk ni aux autres services.

## Points à surveiller

1. Remise à zéro d'un exercice sur l'appareil A, alors que B est resté ouvert et refait un essai avec une date plus ancienne : l'exercice ne doit pas revenir. Test dans la tâche 1, `ignore un changement plus ancien qu'une remise à zéro`.
2. Deux onglets qui envoient la même valeur d'exercice deux fois : les essais ne doivent pas doubler. Test dans la tâche 1, `renvoyer deux fois ne change rien`.
3. Le serveur redémarre (déploiement) pendant qu'un onglet est ouvert : le 403 doit renouveler le jeton, puis renvoyer une seule fois. Test dans la tâche 4, `renouvelle le jeton sur 403 puis renvoie une fois`.
4. Le serveur ne répond pas : rien n'est perdu, et le site continue. Test dans la tâche 4, `garde les changements en attente si le serveur ne répond pas`.
5. Une requête avec une partie inconnue ou une clé piégée (`__proto__`) : 400, et le fichier n'est pas modifié. Test dans la tâche 2, `refuse une partie inconnue ou une clé dangereuse`.

---

### Tâche 1 : fusion partagée

**Fichiers :**
- Créer : `js/fusion-progression.js`
- Test : `tests/fusion-progression.test.js`

**Interfaces :**
- Produit :
  - `PARTIES` : tableau des six noms.
  - `progressionVide()` : un objet avec les six parties vides.
  - `changementValide(changement) -> boolean` : `partie` dans `PARTIES` ; `cle` est une chaîne non vide, différente de `__proto__`, `constructor` et `prototype` ; `faitLe` est un nombre fini ; `valeur` vaut `null` ou n'importe quelle valeur JSON (objet pour `exercices` et `quiz`).
  - `appliquerChangement(etat, changement) -> { retenu: boolean, valeur }`.
    - `etat = { progression, dates, supprimes }`, où `dates` et `supprimes` sont indexés par `"<partie>/<cle>"`.
    - L'état est modifié en place. `valeur` est ce qui reste pour la clé après l'application (`null` si elle est absente).

- [ ] **Étape 1 : écrire les tests qui échouent**, dans `tests/fusion-progression.test.js` :
  - `supprime la clé et note la remise à zéro` : `{ partie:'exercices', cle:'rust/01/a', valeur:null, faitLe:10 }` → la clé est absente et `supprimes['exercices/rust/01/a'] === 10`.
  - `ignore un changement plus ancien qu'une remise à zéro` : après la remise à zéro du test précédent (faitLe 10), `{ valeur:{essais:6,reussi:true}, faitLe:5 }` → `retenu === false`, la clé reste absente. Avec `faitLe:11`, la valeur est retenue.
  - `exercices : garde le plus grand nombre d'essais et la réussite` : l'existant `{essais:3,reussi:true}` plus le reçu `{essais:2,reussi:false}` donnent `{essais:3,reussi:true}`.
  - `renvoyer deux fois ne change rien` : appliquer deux fois `{essais:4,reussi:false}` donne `{essais:4,reussi:false}`.
  - `quiz : garde le meilleur rapport` : l'existant `{score:3,total:5}` plus le reçu `{score:4,total:10}` donnent `{score:3,total:5}` ; le reçu `{score:5,total:5}` remplace.
  - `autres parties : le plus récent gagne` : `codes` avec `dates` à 20, puis un reçu à 15, n'est pas retenu ; un reçu à 25 remplace et `dates` passe à 25.
  - `changementValide` refuse les parties `theme` et `matiere`, les clés `__proto__` et `''`, et un `faitLe` absent.

- [ ] **Étape 2 :** `node --test tests/fusion-progression.test.js` → échec (module introuvable).
- [ ] **Étape 3 : écrire `js/fusion-progression.js`.**
  - Une remise à zéro bat tout changement dont `faitLe` est strictement inférieur au sien.
  - Pour `exercices` et `quiz`, la date n'est pas comparée : on fusionne, puis on met `dates` à jour avec le plus grand des deux `faitLe`.
  - Une valeur retenue efface aussi l'entrée `supprimes` de la clé.
- [ ] **Étape 4 :** `node --test tests/fusion-progression.test.js` → tout passe.

### Tâche 2 : fichier et routes sur le serveur

**Fichiers :**
- Créer : `serveur/progression.js`
- Modifier :
  - `serveur/serveur.js` : options de `creerServeur`, et ajout dans `creerRoutes`, avant la route des fichiers statiques ;
  - `serveur/index.js` ;
  - `scripts/hermes/esgi-entrainement.service` ;
  - `scripts/hermes/installer.sh`.
- Tests : `tests/progression-serveur.test.js` et `tests/serveur.test.js` (routes).

**Interfaces :**
- Utilise : `PARTIES`, `progressionVide`, `changementValide`, `appliquerChangement` (tâche 1) ; `lireJson`, `ecrireJson` (`serveur/commun/json.js`).
- Produit :
  - `creerProgression(chemin)` renvoie `{ lire(), appliquer(changements) }` :
    - `lire()` renvoie `Promise<{ existe, progression, dates, supprimes, modifieLe }>` ;
    - `appliquer(changements)` renvoie `Promise<{ retenus: [{ partie, cle, valeur }] }>` et lance `ErreurHttp(400)` si un changement n'est pas valide ou si la liste n'est pas un tableau de 1 à 2000 éléments.
  - Les appels à `appliquer` passent en file : une seule lecture, fusion et écriture à la fois.
  - Format du fichier : `{ format:'esgi-entrainement', version:1, modifieLe, progression, dates, supprimes }`.
  - `creerServeur({ ..., progression })` : `progression` vaut `null` par défaut.
  - Routes :
    - `GET /api/progression` (garde `lecture`) : `{ active:false }` si `progression` vaut `null`, sinon `{ active:true, existe, progression, dates, supprimes }` ;
    - `POST /api/progression` (garde `ecriture`) : corps `{ changements }`, réponse `{ retenus }`, et 404 « Route inconnue » quand la fonction n'est pas active.

- [ ] **Étape 1 : écrire les tests qui échouent.**
  - `tests/progression-serveur.test.js`, avec un dossier temporaire (`creerDossierTemporaire` de `tests/aide.js`) :
    - `lire sans fichier` : `existe === false`, et la progression est vide.
    - `appliquer puis relire` : le fichier contient `format`, `version` et `modifieLe`.
    - `deux appels en même temps ne s'écrasent pas` : `Promise.all` de deux `appliquer` sur deux clés différentes, puis les deux clés sont présentes.
    - `refuse une partie inconnue ou une clé dangereuse` : rejet avec un statut 400, et le fichier est inchangé.
  - `tests/serveur.test.js`, dans un nouveau bloc :
    - sans `progression`, `GET` renvoie `{ active:false }` ;
    - avec `progression`, un `POST` sans cookie renvoie 403 ;
    - avec le cookie, `POST` puis `GET` donnent la valeur retenue.
- [ ] **Étape 2 :** `node --test tests/progression-serveur.test.js tests/serveur.test.js` → échec.
- [ ] **Étape 3 : écrire `serveur/progression.js` et les routes.**
  - `index.js` passe `progression: process.env.ESGI_PROGRESSION ? creerProgression(process.env.ESGI_PROGRESSION) : null`.
  - Le service ajoute `Environment=ESGI_PROGRESSION=%h/.local/share/esgi-entrainement/progression.json`.
  - `installer.sh` ajoute `"$HOME/.local/share/esgi-entrainement"` à son `mkdir -p`.
- [ ] **Étape 4 :** `npm test` → tout passe.

### Tâche 3 : le stockage signale ses changements

**Fichiers :**
- Modifier : `js/stockage.js`
- Test : `tests/stockage.test.js`

**Interfaces :**
- Utilise : `PARTIES` (tâche 1).
- Produit, sur l'objet de `creerStockage` :
  - `surChangementLocal(ecouteur)` : `ecouteur(touches, { immediat })` est appelé après chaque écriture réussie dans le `localStorage`. `touches` est un tableau `[{ partie, cle, valeur }]`, avec `valeur` lue dans l'état écrit (`null` si la clé est absente), sans doublons.
  - `remplacerParties(parties)` : remplace les six parties par `parties` (copie), écrit tout de suite, ne déclenche pas `surChangementLocal`, puis appelle les écouteurs de `surChangementExterne`.

- [ ] **Étape 1 : écrire les tests qui échouent**, dans `tests/stockage.test.js` (stockage créé par `creerStockage({ memoire: fausseMemoire(), delai: 0 })`) :
  - `enregistrerEssai signale exercices/<cle> avec la valeur entière, tout de suite`.
  - `enregistrerCode signale codes/<cle> après le délai`, et deux appels rapprochés donnent une seule touche.
  - `reinitialiserExercice signale les quatre parties de la clé avec la valeur null`.
  - `reinitialiser signale null pour chaque clé qui existait`.
  - `importer signale chaque clé du fichier importé, sans aucun null`.
  - `choisirTheme et choisirMatiere ne signalent rien`.
  - `remplacerParties ne signale rien et garde theme, matiere et menuRange`.
- [ ] **Étape 2 :** `node --test tests/stockage.test.js` → échec.
- [ ] **Étape 3 : modifier `js/stockage.js`.**
  - `modifier(changer, { immediat, touches })` prend la liste `[{ partie, cle }]`. Chaque méthode d'enregistrement donne la sienne.
  - `importer` ne garde que les clés du fichier et ne produit pas de `null`. Après l'import, la page se recharge (`app.js`), puis la synchronisation remet les clés de hermes que le fichier n'a pas.
- [ ] **Étape 4 :** `npm test` → tout passe.

### Tâche 4 : synchronisation de la page

**Fichiers :**
- Créer : `js/synchro-progression.js`
- Modifier :
  - `js/app.js` : démarrage, à côté de `stockage.surErreurEcriture` ;
  - `CLAUDE.md` du projet : section « Stack technique », ligne Progression ;
  - `TODO.md`.
- Test : `tests/synchro-progression.test.js`

**Interfaces :**
- Utilise :
  - `appliquerChangement`, `progressionVide` (tâche 1) ;
  - `surChangementLocal`, `remplacerParties`, `progression()` (tâche 3) ;
  - les routes de la tâche 2.
- Produit : `creerSynchroProgression({ stockage, memoire, requete, renouvelerJeton, maintenant, signalerErreur })` renvoie `{ demarrer(), envoyer({ keepalive }) }` :
  - `requete(methode, corps, { keepalive })` renvoie `Promise<{ statut, donnees }>` et lance une erreur si le réseau ne répond pas. Dans `app.js`, c'est un `fetch('api/progression', …)`.
  - `renouvelerJeton()` vaut `fetch('./', { cache:'no-store' })` dans `app.js`.
  - Clés du `localStorage` :
    - `esgi-entrainement-attente` : un tableau `[{ partie, cle, valeur, faitLe }]`, avec une seule entrée par `partie/cle` (la plus récente) ;
    - `esgi-entrainement-synchronise` : `'1'`.
  - `demarrer()` :
    1. `GET` ; si `active` vaut faux, s'arrêter là. Rien d'autre ne se passe ensuite, ni écouteur ni envoi.
    2. Si `synchronise` est absent : mettre en attente chaque clé locale des six parties (`faitLe` = maintenant), puis noter `synchronise`.
    3. Partir de l'état du serveur, réappliquer l'attente par `appliquerChangement`, puis `stockage.remplacerParties(...)`.
    4. `envoyer()`.
    5. Brancher `surChangementLocal` : mettre en attente, puis `envoyer()` (tout de suite si `immediat`, sinon dans les 300 ms).
    6. Relancer les étapes 1, 3 et 4 quand la page redevient visible.
  - `envoyer()` :
    - envoie toute l'attente (2000 changements au plus par requête) ;
    - sur 200, retire de l'attente les entrées envoyées qui n'ont pas changé entre-temps, et recopie les `retenus` dans le stockage (par `remplacerParties` sur l'état local mis à jour) ;
    - sur 403, appelle `renouvelerJeton()` puis renvoie une seule fois ;
    - sur un autre échec, garde l'attente et appelle `signalerErreur()` une seule fois par session (`notifier('Progression non enregistrée sur hermes : elle sera renvoyée au prochain changement.')`).
    - `pagehide` et `visibilitychange` (passage à caché) appellent `envoyer({ keepalive:true })`.

- [ ] **Étape 1 : écrire les tests qui échouent**, dans `tests/synchro-progression.test.js` (faux `requete`, fausse mémoire, `maintenant` fixe) :
  - `ne fait rien si le serveur répond active:false`.
  - `première synchronisation : envoie tout le contenu local, puis note synchronise`.
  - `à l'ouverture, l'état du serveur remplace l'état local, avec l'attente réappliquée par-dessus`.
  - `un exercice remis à zéro sur le serveur ne revient pas d'un appareil déjà synchronisé`.
  - `garde les changements en attente si le serveur ne répond pas`, et `signalerErreur` n'est appelé qu'une fois pour deux échecs.
  - `renouvelle le jeton sur 403 puis renvoie une fois` : deux 403 de suite donnent `renouvelerJeton` appelé une fois, et l'attente est gardée.
  - `vide l'attente après un 200, sauf une clé modifiée pendant l'envoi`.
- [ ] **Étape 2 :** `node --test tests/synchro-progression.test.js` → échec.
- [ ] **Étape 3 : écrire `js/synchro-progression.js` et le brancher dans `app.js`** (`demarrer()` sans attendre l'affichage, erreurs attrapées). Mettre à jour `CLAUDE.md` (progression enregistrée sur hermes par `ESGI_PROGRESSION`) et `TODO.md`.
- [ ] **Étape 4 :** `npm test` → tout passe.
- [ ] **Étape 5 : essai local.**
  - Lancer `ESGI_PROGRESSION=<dossier temporaire>/progression.json PORT=3100 node serveur/index.js --sans-navigateur`.
  - Ouvrir `http://localhost:3100/`, réussir un exercice, puis vérifier que le fichier contient `exercices/<cle>` avec `reussi:true`.
  - Remettre l'exercice à zéro, et vérifier que la clé disparaît et qu'elle est notée dans `supprimes`.

### Tâche 5 : quiz de Hermes branchés sur le fichier (après le déploiement)

À faire seulement quand Antoine a fusionné et déployé (`/commit -merge`), puis ouvert `http://hermes/esgi-entrainement/` dans son navigateur, ce qui remplit le fichier.

**Fichiers sur hermes (hors dépôt) :**
- Modifier :
  - `~/.hermes/scripts/esgi-quiz.py` (copie `esgi-quiz.py.bak-2026-11-25` avant) ;
  - `~/.hermes/skills/productivity/study-revision-quizzes/references/esgi-quiz-setup.md`.
- Corbeille : `~/dev/esgi-entrainement/esgi-entrainement-2026-11-23.json` et `esgi-entrainement-2026-11-24.json`.

- [ ] **Étape 1 : vérifier que le fichier est rempli** : `ssh hermes 'python3 -c "import json;p=json.load(open(\"/home/hermes/.local/share/esgi-entrainement/progression.json\"))[\"progression\"];print(sorted(p[\"quiz\"]))"'` affiche au moins les chapitres de l'export du 24/11 (maths/01, combinatoire/01, rust/01 à 04 et 08).
- [ ] **Étape 2 : modifier `esgi-quiz.py`.**
  - `charger_export` est remplacé par `charger_progression()`, qui lit `ESGI_QUIZ_PROGRESSION` ou `~/.local/share/esgi-entrainement/progression.json`.
  - `PROGRESSION` vaut `{}` si le fichier est absent, donc `TRAVAILLES` est un ensemble vide et jamais `None`. Retirer `vu_en_cours` et le repli « fondamentaux ».
  - La ligne `AVANCEMENT` est toujours écrite :
    - `AVANCEMENT : progression du site hermes du <modifieLe[:10]>`, ou `AVANCEMENT : aucune progression enregistrée sur hermes` ;
    - suivie de la liste des matières en pause.
  - Mettre à jour la docstring.
- [ ] **Étape 3 : faire trois essais à blanc.**
  - Lancer `ESGI_QUIZ_ETAT=/tmp/essai-etat.json python3 ~/.hermes/scripts/esgi-quiz.py | head -5`.
  - Attendu : la ligne `AVANCEMENT` cite la date du fichier, et les chapitres tirés font partie des chapitres travaillés.
  - Avec `ESGI_QUIZ_PROGRESSION=/tmp/absent.json`, seul l'anglais est proposé.
  - Mettre `/tmp/essai-etat.json` à la corbeille avec `gio trash`.
- [ ] **Étape 4 : mettre à jour `esgi-quiz-setup.md`** (section « Only chapters the user has already worked on ») : source unique `~/.local/share/esgi-entrainement/progression.json`, relue à chaque tirage, plus d'export et plus de repli.
- [ ] **Étape 5 :** `gio trash` des deux exports, puis `ls ~/dev/esgi-entrainement/esgi-entrainement-*.json` → aucun fichier.
