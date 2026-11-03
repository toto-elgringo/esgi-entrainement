# Synchronisation avec MyGES — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** un encadré « MyGES » sur la page de choix de la matière. Il se connecte à MyGES, montre un aperçu des nouveaux supports, puis, après validation, les télécharge dans le vault Obsidian et lance `claude -p "/obsidian -esgi"` en arrière-plan.

**Architecture :** un dossier `serveur/myges/` de petits modules : lecture du `.env`, connexion, source des supports, noms, matières, suivi, aperçu, archives, supports en attente, lancement de Claude, et un automate `synchro.js` qui les assemble. `serveur.js` reçoit l'objet synchro par injection et expose trois routes POST et une GET, protégées par une vérification d'origine. Côté page, `js/vues/myges.js` affiche l'encadré et interroge l'état toutes les 2 s.

**Tech Stack :** Node 20+ (`http`, `child_process`, `fetch`, `node:test`), modules ES, HTML / CSS / JS sans dépendance.

**Spec :** `docs/superpowers/specs/2026-11-03-synchro-myges-design.md`

## Global Constraints

- Node 20+, **aucune dépendance npm**, modules ES, pas de build.
- Code, noms, textes et messages en **français**, **aucun commentaire** dans le code.
- Tests `node:test`, écrits avant le code, lancés par `npm test`. Aucun test n'appelle le vrai MyGES ni le vrai Claude.
- **Ne jamais commiter ni pousser** pendant l'exécution : Antoine commite lui-même.
- Serveur local seulement (`127.0.0.1`).
- Vault : `C:\Users\totoa\Obsidian\Claude Note\Cours - ESGI\`, modifiable par `ESGI_DOSSIER`.
- Identifiant, mot de passe et jeton n'apparaissent jamais dans une réponse HTTP, un message d'erreur, un journal ou une sortie de script.
- Aucun support de cours ni aucune donnée personnelle dans le dépôt.
- Suppression de fichiers : `trash`, jamais `rm`.
- Seulement l'année scolaire en cours. Rien n'est supprimé du vault.

## Review Focus

1. **Mot de passe avec `:`, accents ou symboles** : l'en-tête Basic encode `identifiant:motdepasse` en UTF-8 puis base64, sans couper au `:` du mot de passe. Test dans la tâche 1.
2. **Double clic ou rechargement pendant une synchro** : une seule synchro tourne et la page retrouve son état. Test dans la tâche 6.
3. **Serveur arrêté au milieu des téléchargements** : le suivi est écrit après **chaque** fichier, pour qu'un fichier déjà reçu ne soit pas retéléchargé. Les fichiers reçus mais non traités apparaissent ensuite « en attente ». Test dans la tâche 6.
4. **Deux documents MyGES qui donnent le même nom de fichier dans une matière** : le second reçoit le suffixe ` (2)` au lieu d'écraser le premier. Test dans la tâche 4.
5. **Un téléchargement échoue (404, réseau)** : les autres continuent, le bilan nomme le fichier raté, et Claude est lancé quand même s'il reste du travail. Test dans la tâche 6.

## Structure des fichiers

| Fichier | Rôle |
|---|---|
| `serveur/myges/env.js` | lit `.env`, extrait les identifiants |
| `serveur/myges/connexion.js` | obtient le jeton Kordis, classe les erreurs |
| `serveur/myges/source.js` | année en cours, liste des supports, téléchargement d'un support (forme fixée par la tâche 2) |
| `serveur/myges/noms.js` | nettoyage Windows, clé de comparaison, chemin sûr |
| `serveur/myges/matieres.js` | correspondance matière MyGES → dossier du vault |
| `serveur/myges/suivi.js` | lecture / écriture de `myges-suivi.json` |
| `serveur/myges/apercu.js` | calcule ce qui sera téléchargé (fonction pure) |
| `serveur/myges/archives.js` | extraction sûre des `.zip` |
| `serveur/myges/attente.js` | supports du vault non traités (via `esgi-sources.mjs`) |
| `serveur/myges/claude.js` | lance Claude, lit le flux `stream-json`, arrêt |
| `serveur/myges/synchro.js` | automate de la synchro (état en mémoire) |
| `serveur/myges/erreurs.js` | `ErreurMyges` |
| `serveur/serveur.js` | routes `myges`, vérification d'origine, fichiers cachés refusés |
| `serveur/index.js` | assemble la synchro avec les vrais chemins |
| `scripts/explorer-myges.js` | exploration de l'API (tâche 2), sortie anonymisée |
| `js/vues/myges.js` | encadré, aperçu, avancement, appels API |
| `js/vues/accueil.js` | insère l'encadré sur la page de choix de la matière |
| `style.css` | style de l'encadré (sur le modèle de `.sauvegarde`) |
| `myges-matieres.json` | correspondance versionnée |
| `.env.exemple`, `.gitignore`, `docs/myges-api.md`, `README.md`, `CLAUDE.md`, `TODO.md` | configuration et documentation |
| `tests/myges-*.test.js`, `tests/aide-myges.js` | tests, faux serveur MyGES, faux Claude |

---

### Task 1 : `.env`, erreurs et connexion

**Files :**
- Create : `serveur/myges/erreurs.js`, `serveur/myges/env.js`, `serveur/myges/connexion.js`, `tests/aide-myges.js`, `tests/myges-connexion.test.js`, `.env.exemple`
- Modify : `.gitignore`

**Interfaces :**
- Produces :
  - `class ErreurMyges extends Error { code }`, avec `code` parmi `'identifiants_manquants' | 'identifiants_refuses' | 'injoignable' | 'reponse_inattendue' | 'claude_introuvable' | 'deja_en_cours' | 'pas_d_apercu'`.
  - `lireEnv(fichier: string) -> Promise<Record<string, string>>` : fichier absent → `{}`. Lignes `CLE=valeur`. Ignore les lignes vides et celles qui commencent par `#`. Retire les guillemets `"…"` ou `'…'` autour de la valeur et coupe seulement au premier `=`.
  - `identifiantsMyges(env) -> { identifiant, motDePasse } | null` : lit `MYGES_IDENTIFIANT` et `MYGES_MOT_DE_PASSE`. `null` si l'un des deux est vide.
  - `obtenirJeton({ identifiant, motDePasse }, { adresseAuth = 'https://authentication.kordis.fr' } = {}) -> Promise<string>` : `GET ${adresseAuth}/oauth/authorize?response_type=token&client_id=skolae-app`, `redirect: 'manual'`, en-tête `Authorization: Basic base64(utf8(identifiant + ':' + motDePasse))`. Le jeton est `access_token` dans le fragment `#` de l'en-tête `Location`. Statut 401 ou 403 → `identifiants_refuses`. Erreur réseau → `injoignable`. Pas de `Location` ou pas de jeton → `reponse_inattendue`.
  - `tests/aide-myges.js` : `demarrerFauxMyges(gestionnaire: (requete, reponse) => void) -> Promise<{ adresse, fermer() }>`, sur `127.0.0.1:0`.

- [ ] **Step 1 : écrire les tests qui échouent** (`tests/myges-connexion.test.js`)
  - `lireEnv` : un fichier contenant `MYGES_IDENTIFIANT=aandre\n# commentaire\nMYGES_MOT_DE_PASSE="a=b:c é"\n` donne `{ MYGES_IDENTIFIANT: 'aandre', MYGES_MOT_DE_PASSE: 'a=b:c é' }`. Fichier absent → `{}`.
  - `identifiantsMyges({ MYGES_IDENTIFIANT: 'x' })` → `null`.
  - `obtenirJeton` contre un faux serveur qui vérifie `authorization === 'Basic ' + Buffer.from('aandre:a=b:c é', 'utf8').toString('base64')`, puis répond 302 avec `Location: comreseaugesskolae:/oauth2redirect#access_token=JETON123&token_type=bearer&expires_in=86400` → renvoie `'JETON123'`.
  - Faux serveur qui répond 401 → rejet avec `code === 'identifiants_refuses'`, et `message` qui ne contient ni l'identifiant ni le mot de passe.
  - `adresseAuth: 'http://127.0.0.1:1'` → `code === 'injoignable'`.
  - 302 sans `access_token` → `code === 'reponse_inattendue'`.
- [ ] **Step 2 : lancer** `node --test tests/myges-connexion.test.js` → ÉCHEC (modules absents).
- [ ] **Step 3 : écrire** `erreurs.js`, `env.js`, `connexion.js` et `aide-myges.js`, avec les signatures ci-dessus.
- [ ] **Step 4 : ajouter** au `.gitignore` les lignes `.env`, `myges-suivi.json` et `synchro-obsidian.json`. Créer `.env.exemple` avec deux lignes, `MYGES_IDENTIFIANT=` et `MYGES_MOT_DE_PASSE=`.
- [ ] **Step 5 : lancer** `npm test` → tout passe.

### Task 2 : exploration de l'API MyGES (point d'arrêt)

Le reste du plan dépend du résultat. Cette tâche utilise le vrai compte d'Antoine.

**Files :**
- Create : `scripts/explorer-myges.js`, `docs/myges-api.md`, `myges-matieres.json`

**Interfaces :**
- Consumes : `lireEnv`, `identifiantsMyges`, `obtenirJeton` (tâche 1).
- Produces : `docs/myges-api.md`, qui décrit sans aucune donnée personnelle :
  1. comment trouver l'année en cours ;
  2. l'adresse qui liste les supports de cours, avec les champs utiles (identifiant du document, matière, nom du fichier, adresse de téléchargement, date ou taille si elles existent) ;
  3. comment télécharger un fichier.

  Et `myges-matieres.json` : `{ "<nom de la matière sur MyGES>": "<dossier du vault>" }` pour les huit matières actuelles (`Algorithmique avancée`, `Anglais professionnel`, `Combinatoire et complexité`, `Cours Électif`, `Maths pour l'informatique`, `Maths pour le big data`, `Rust`, `Scripting Python`).

- [ ] **Step 1 : vérifier** que `.env` existe et contient les deux variables, sans afficher son contenu : `node -e "…"` affiche `ok` ou `manquant`. S'il manque, s'arrêter et demander à Antoine de le remplir (il retrouve ses identifiants sur passwords.google.com).
- [ ] **Step 2 : écrire** `scripts/explorer-myges.js <chemin API>`. Il obtient le jeton, fait un `GET https://api.kordis.fr<chemin>` et affiche la réponse **anonymisée** :
  - les valeurs des clés dont le nom contient `name`, `firstname`, `lastname`, `mail`, `email`, `phone`, `birth`, `address`, `uid`, `student`, `grade`, `note`, `mark` deviennent `"…"` ;
  - les noms de matières et de fichiers restent visibles ;
  - les liens `links` restent visibles, pour continuer à explorer.
- [ ] **Step 3 : explorer.** Commencer par `/me/profile`, puis `/me/years` (ou ce que renvoient les liens), puis `/me/{année}/courses`, et suivre les liens `links` des cours jusqu'aux fichiers. Si aucune adresse de l'API ne donne les supports, passer au plan B : se connecter au site `https://myges.fr` (formulaire de connexion, cookies de session) et lire `student/courses-files`. Décrire alors cette méthode dans `docs/myges-api.md`. Si rien ne marche, **s'arrêter** et faire un retour à Antoine.
- [ ] **Step 4 : écrire** `docs/myges-api.md` et `myges-matieres.json`. Le fichier `docs/myges-api.md` ne contient que des noms de champs et des exemples inventés.
- [ ] **Step 5 : vérifier** qu'aucun nom de personne, e-mail ni identifiant d'élève ne figure dans les fichiers créés (`git diff` relu à la main).

### Task 3 : source des supports

**Files :**
- Create : `serveur/myges/source.js`, `tests/myges-source.test.js`
- Modify : `tests/aide-myges.js` (ajouter un faux MyGES qui imite les réponses décrites dans `docs/myges-api.md`)

**Interfaces :**
- Consumes : `ErreurMyges` (tâche 1), `docs/myges-api.md` (tâche 2).
- Produces :
  - `Support = { id: string, matiere: string, nom: string, adresse: string, version: string | null }`. `version` vaut la date ou la taille donnée par MyGES (`null` si MyGES n'en donne pas).
  - `creerSource({ jeton, adresseApi = 'https://api.kordis.fr' }) -> { anneeEnCours(): Promise<string>, listerSupports(annee): Promise<Support[]>, telecharger(support, fichier): Promise<void> }`.
  - `telecharger` écrit d'abord dans `fichier + '.partiel'`, puis renomme. En cas d'échec, il supprime le fichier `.partiel` et rejette.
  - Statut 401 → `identifiants_refuses`. Erreur réseau → `injoignable`. Forme de réponse inconnue → `reponse_inattendue`.

  Si la tâche 2 a retenu le plan B, garder les mêmes trois fonctions, avec `creerSource({ cookies, adresseSite })`, et ajouter `connecterSite(identifiants)` dans `connexion.js`.

- [ ] **Step 1 : écrire les tests qui échouent**
  - `anneeEnCours()` renvoie l'année la plus récente qui contient au moins un cours.
  - `listerSupports(annee)` renvoie des `Support` complets pour deux matières.
  - Le jeton est envoyé en `Authorization: bearer <jeton>`.
  - `telecharger` écrit les octets exacts reçus. Sur une réponse 404 : rejet, sans fichier final ni `.partiel` dans le dossier.
- [ ] **Step 2 : lancer** `node --test tests/myges-source.test.js` → ÉCHEC.
- [ ] **Step 3 : écrire** `source.js`.
- [ ] **Step 4 : lancer** `npm test` → tout passe.

### Task 4 : noms, matières, suivi et aperçu

**Files :**
- Create : `serveur/myges/noms.js`, `serveur/myges/matieres.js`, `serveur/myges/suivi.js`, `serveur/myges/apercu.js`, `tests/myges-apercu.test.js`

**Interfaces :**
- Consumes : `Support` (tâche 3).
- Produces :
  - `nettoyerNom(nom) -> string` : remplace `\ / : * ? " < > |` et les caractères de contrôle par `-`, retire les points et espaces en fin de nom. Interdit `.`, `..` et les noms réservés Windows (`CON`, `PRN`, `AUX`, `NUL`, `COM1`… `LPT9`) en leur ajoutant `_`. Vide → `document`.
  - `cleDeComparaison(nom) -> string` : minuscules, accents retirés (`normalize('NFD')`), espaces regroupés, extension `.pdf`, `.html` ou `.zip` retirée. `[Mot] X` et `Mot - X` donnent la même clé (`mot - x`). Le mot n'est jamais retiré.
  - `cheminSur(dossier, nom) -> string` : `path.join(dossier, nettoyerNom(nom))`. Lève une erreur si le résultat sort de `dossier`.
  - `lireCorrespondance(fichier) -> Promise<Record<string, string>>` et `ecrireCorrespondance(fichier, correspondance)` : JSON trié, 2 espaces, retour à la ligne final.
  - `dossierDeMatiere(correspondance, matiereMyges) -> { dossier: string, nouvelle: boolean }` : inconnue → `{ dossier: nettoyerNom(matiereMyges), nouvelle: true }`.
  - `lireSuivi(fichier) -> Promise<Suivi>` (absent → `{}`), `enregistrerSuivi(fichier, suivi)`. `Suivi = Record<string, { chemin: string, version: string | null, le: string }>`, avec la clé `support.id` (sinon `matiere + '/' + nom`) et `chemin` relatif au vault.
  - `preparerApercu({ supports, suivi, correspondance, fichiersParDossier: Record<string, string[]>, enAttente: string[] }) -> Apercu`, avec :
    - `Apercu = { documents: Document[], matieresNouvelles: string[], dejaPresents: Document[], enAttente: string[] }` ;
    - `Document = { support, dossier, nomFichier, chemin, raison: 'nouveau' | 'mis_a_jour' }` ;
    - `chemin` relatif au vault : `<dossier>/Sources/<nomFichier>` (`nomFichier` sans `.zip` pour une archive).

  Règles de `preparerApercu` :
  1. Dans le suivi avec la même `version` (ou `version` nulle) → ignoré.
  2. Dans le suivi avec une `version` différente → `mis_a_jour`, au même `chemin`.
  3. Absent du suivi, mais un fichier de même `cleDeComparaison` existe dans `fichiersParDossier[dossier]` → `dejaPresents`, c'est-à-dire ajouté au suivi sans téléchargement.
  4. Sinon → `nouveau`. Si `nomFichier` est déjà pris (dans le dossier ou par un autre document de l'aperçu), ajouter ` (2)`, ` (3)`… avant l'extension.

- [ ] **Step 1 : écrire les tests qui échouent**
  - `nettoyerNom('a:b?.pdf') === 'a-b-.pdf'`, `nettoyerNom('CON') === 'CON_'`, `nettoyerNom('rapport. ') === 'rapport'`.
  - `cleDeComparaison('[Slides] Ownership.html') === cleDeComparaison('slides - ownership.pdf')`, et `cleDeComparaison('Slides - Ownership.pdf') !== cleDeComparaison('Support - Ownership.pdf')`.
  - `cheminSur('C:/v/Rust/Sources', '../../x')` reste dans le dossier, car le nom est nettoyé en `..-..-x`. `cheminSur` lève une erreur si on lui passe un chemin qui sort du dossier.
  - `dossierDeMatiere({ 'Programmation Rust': 'Rust' }, 'Programmation Rust')` → `{ dossier: 'Rust', nouvelle: false }`. `'Big: Data'` → `{ dossier: 'Big- Data', nouvelle: true }`.
  - `preparerApercu` : un cas par règle 1 à 4, plus les deux documents `Cours.pdf` de la même matière qui deviennent `Cours.pdf` et `Cours (2).pdf` (Review Focus 4). Une matière inconnue apparaît dans `matieresNouvelles`. `enAttente` est recopié tel quel.
- [ ] **Step 2 : lancer** `node --test tests/myges-apercu.test.js` → ÉCHEC.
- [ ] **Step 3 : écrire** les quatre modules.
- [ ] **Step 4 : lancer** `npm test` → tout passe.

### Task 5 : archives, supports en attente et lancement de Claude

**Files :**
- Create : `serveur/myges/archives.js`, `serveur/myges/attente.js`, `serveur/myges/claude.js`, `tests/myges-outils.test.js`, `tests/faux-claude.js`

**Interfaces :**
- Consumes : `ErreurMyges` (tâche 1).
- Produces :
  - `extraireZip(fichierZip, dossier) -> Promise<void>` :
    - liste d'abord le contenu avec `tar -tf` (présent sur Windows 11) ;
    - refuse toute entrée absolue, qui contient `..` ou qui commence par une lettre de lecteur, et rejette avec un message clair ;
    - sinon `tar -xf <zip> -C <dossier>` ;
    - envoie ensuite le `.zip` à la corbeille avec `trash`, et le laisse en place si `trash` est absent.
  - `supportsEnAttente({ script, env }) -> Promise<string[] | null>` :
    - lance `node <script> etat` avec `env` (pour `ESGI_DOSSIER`) ;
    - garde, dans `nouveaux` et `modifies` de chaque matière, les clés qui contiennent `/Sources/` ;
    - script absent ou sortie illisible → `null`.
  - `lancerClaude({ commande, args, dossier, delai = 2 * 60 * 60 * 1000, surLigne }) -> { fin: Promise<{ code, bilan: string | null, erreur: string | null }>, arreter(): void }` :
    - lit `stdout` ligne par ligne, en JSON ;
    - pour `type: 'assistant'`, chaque bloc `text` de `message.content` appelle `surLigne(texte)` ;
    - pour `type: 'result'`, `bilan = result` et `erreur = is_error ? result : null` ;
    - `ENOENT` → `fin` rejette `ErreurMyges('claude_introuvable')` ;
    - `arreter()` sur Windows fait `taskkill /pid <pid> /T /F`, ailleurs `kill()` ; le délai dépassé fait de même ;
    - écrit toute la sortie dans un journal `os.tmpdir()/esgi-entrainement-myges/claude-<date>.log`.
  - Arguments réels (utilisés par la tâche 7) : `['-p', '/obsidian -esgi', '--add-dir', <dossier parent du vault « Claude Note »>, '--permission-mode', 'bypassPermissions', '--output-format', 'stream-json', '--verbose']`.
  - `tests/faux-claude.js` : écrit trois lignes `stream-json` (un `system`, un `assistant` avec le texte `Je lis les sources`, un `result` avec `result: 'Bilan : 2 notes'`). Avec l'argument `--attendre`, il ne se termine pas.

- [ ] **Step 1 : écrire les tests qui échouent**
  - `extraireZip` sur un zip créé dans le test avec `tar -a -cf x.zip -C <dossier> a.txt` → `a.txt` extrait. Un zip qui contient `../evil.txt` → rejet, et rien n'est écrit hors du dossier. Si `tar` ne sait pas créer ce zip piégé, le construire octet par octet dans `aide-myges.js` (en-tête local + répertoire central, méthode 0).
  - `supportsEnAttente` avec un faux script qui affiche `{"matieres":{"Rust":{"nouveaux":["Rust/Sources/a.pdf","Rust/Rust.md"],"modifies":[],"supprimes":[]}}}` → `['Rust/Sources/a.pdf']`. Script absent → `null`.
  - `lancerClaude` avec `commande: process.execPath, args: ['tests/faux-claude.js']` → `surLigne` reçoit `'Je lis les sources'`, et `fin` donne `{ code: 0, bilan: 'Bilan : 2 notes', erreur: null }`.
  - `lancerClaude` avec `--attendre` puis `arreter()` → `fin` se termine en moins de 5 s.
  - `commande: 'commande-qui-n-existe-pas'` → rejet `claude_introuvable`.
- [ ] **Step 2 : lancer** `node --test tests/myges-outils.test.js` → ÉCHEC.
- [ ] **Step 3 : écrire** les trois modules et le faux Claude.
- [ ] **Step 4 : lancer** `npm test` → tout passe.

### Task 6 : automate de la synchro

**Files :**
- Create : `serveur/myges/synchro.js`, `tests/myges-synchro.test.js`

**Interfaces :**
- Consumes : tout ce qui précède.
- Produces : `creerSynchro(options) -> { demarrer(): Etat, valider(): Etat, arreter(): Etat, etat(): Etat }`, où :
  - `options = { vault, fichierEnv, fichierSuivi, fichierMatieres, scriptSources, claude: { commande, args }, adresseAuth?, adresseApi?, horloge? = () => new Date() }` ;
  - `Etat = { etape: 'repos' | 'connexion' | 'liste' | 'apercu' | 'telechargement' | 'claude' | 'terminee' | 'erreur', apercu: Apercu | null, telecharges: string[], rates: { chemin, raison }[], matieresCreees: string[], lignes: string[], bilan: string | null, erreur: { code, message } | null, debut: string | null, fin: string | null }` ;
  - `lignes` garde les 30 dernières lignes de Claude.

  Comportement :
  - `demarrer()` :
    - déjà dans une étape active (`connexion`, `liste`, `telechargement`, `claude`) → renvoie l'état sans rien relancer ;
    - sinon, l'étape passe tout de suite à `connexion` et le reste tourne en tâche de fond : identifiants, jeton, année, liste des supports, lecture des dossiers `Sources\` du vault, attente, `preparerApercu` ;
    - les supports `dejaPresents` sont ajoutés au suivi à ce moment-là ;
    - fin en `apercu` ;
    - identifiants absents → `erreur` avec `identifiants_manquants`.
  - `valider()` :
    - hors de l'étape `apercu` → lève `ErreurMyges('pas_d_apercu')` ;
    - crée les dossiers `<matière>/Sources` des matières nouvelles et les ajoute à `myges-matieres.json` ;
    - télécharge chaque document l'un après l'autre et **enregistre le suivi après chaque fichier réussi**. Un fichier `.zip` est extrait. Un échec va dans `rates`, puis on continue ;
    - lance Claude si `telecharges.length + apercu.enAttente.length > 0` ; sinon passe à `terminee` avec `bilan: 'Tout est à jour'` ;
    - fin de Claude → `terminee` (ou `erreur` si `erreur` n'est pas nul).
  - `arreter()` : arrête Claude ou le téléchargement en cours, et passe à `terminee` avec `bilan: 'Synchro arrêtée'`.

- [ ] **Step 1 : écrire les tests qui échouent.** Chaque test monte un vault temporaire, un faux MyGES (tâche 3) et le faux Claude.
  - Parcours complet : `demarrer` → attendre `apercu` (2 documents, 1 matière nouvelle) → `valider` → attendre `terminee`. Ensuite, les fichiers sont dans le vault, le suivi a 2 entrées, `myges-matieres.json` contient la nouvelle matière, et `bilan === 'Bilan : 2 notes'`.
  - Deux `demarrer()` de suite : le faux MyGES ne reçoit qu'une demande de jeton (Review Focus 2).
  - `valider()` sans aperçu → `pas_d_apercu`.
  - Un des deux téléchargements répond 404 : `rates` contient 1 élément, `telecharges` 1, et Claude est lancé (Review Focus 5).
  - Le faux MyGES bloque le second téléchargement : après le premier, `myges-suivi.json` contient déjà son entrée (Review Focus 3).
  - Aucun nouveau document et `enAttente` vide → `terminee` avec `'Tout est à jour'`, sans lancer Claude.
  - `.env` vide → `erreur.code === 'identifiants_manquants'`.
  - `JSON.stringify(etat())` ne contient jamais le mot de passe ni le jeton, à toutes les étapes.
- [ ] **Step 2 : lancer** `node --test tests/myges-synchro.test.js` → ÉCHEC.
- [ ] **Step 3 : écrire** `synchro.js`.
- [ ] **Step 4 : lancer** `npm test` → tout passe.

### Task 7 : routes du serveur et sécurité

**Files :**
- Modify : `serveur/serveur.js`, `serveur/index.js`
- Test : `tests/serveur.test.js`

**Interfaces :**
- Consumes : `creerSynchro` (tâche 6).
- Produces :
  - `creerServeur({ racine, dossierContenu, synchro? })`. Sans `synchro`, les routes `myges` répondent 503 avec le message `La synchro MyGES n'est pas disponible`.
  - Routes :
    - `POST /api/myges/synchroniser` → `synchro.demarrer()` ;
    - `POST /api/myges/valider` → `synchro.valider()` (`pas_d_apercu` → 409) ;
    - `POST /api/myges/arreter` → `synchro.arreter()` ;
    - `GET /api/myges/etat` → `synchro.etat()`.
  - `origineLocale(requete) -> boolean`. Pour toute route `/api/myges/` :
    - l'en-tête `Host` doit être `localhost:<port>` ou `127.0.0.1:<port>` (port du serveur) ;
    - `Origin`, s'il est présent, doit être `http://` suivi de l'un de ces deux hôtes ;
    - pour les POST, `Content-Type` doit commencer par `application/json` ;
    - sinon → 403 `Requête refusée`.
  - `servirFichier` répond 404 si un morceau du chemin commence par `.`, ou si le nom vaut `myges-suivi.json` ou `synchro-obsidian.json`.
  - `index.js` construit la synchro :
    - `vault` : `process.env.ESGI_DOSSIER ?? 'C:/Users/totoa/Obsidian/Claude Note/Cours - ESGI'` ;
    - fichiers à la racine du projet : `.env`, `myges-suivi.json`, `myges-matieres.json` ;
    - `scriptSources` : `path.join(os.homedir(), '.claude/scripts/esgi-sources.mjs')` ;
    - `claude` : la commande `process.env.ESGI_CLAUDE` (si elle finit par `.js` ou `.mjs`, `commande: process.execPath` et le script en premier argument), sinon `'claude'`, avec les arguments réels de la tâche 5.

- [ ] **Step 1 : écrire les tests qui échouent**, avec une fausse synchro injectée qui compte les appels.
  - `GET /.env` → 404, `GET /.git/config` → 404, `GET /myges-suivi.json` → 404, en créant ces fichiers dans la racine de test.
  - `POST /api/myges/synchroniser` avec `Origin: http://exemple.com` → 403, et la fausse synchro n'est pas appelée.
  - Même requête avec un `Content-Type: text/plain` → 403.
  - Même requête depuis l'adresse du test (`Host` correct, JSON) → 200 et l'état renvoyé.
  - `POST /api/myges/valider` qui lève `pas_d_apercu` → 409.
  - Serveur sans `synchro` → 503.
- [ ] **Step 2 : lancer** `node --test tests/serveur.test.js` → ÉCHEC sur les nouveaux tests.
- [ ] **Step 3 : modifier** `serveur.js` et `index.js`.
- [ ] **Step 4 : lancer** `npm test` → tout passe, anciens tests compris.

### Task 8 : encadré MyGES sur la page

**Files :**
- Create : `js/vues/myges.js`, `tests/myges-vue.test.js`
- Modify : `js/vues/accueil.js` (page de choix de la matière seulement, juste après `${BLOC_SAUVEGARDE}`), `style.css` (`.myges` sur le modèle de `.sauvegarde`, avec les variables de couleur existantes pour que le thème clair marche)

**Interfaces :**
- Consumes : routes de la tâche 7.
- Produces :
  - `rendreEtatMyges(etat: Etat) -> string` (HTML, texte échappé avec `echapper`), fonction pure et testée :
    - `repos` : bouton `Synchroniser avec MyGES` ;
    - `connexion` et `liste` : `Connexion à MyGES…` / `Recherche des nouveaux supports…` ;
    - `apercu` : documents groupés par matière, avec la mention `mis à jour` quand il le faut, la liste `Nouvelles matières`, la liste `En attente de traitement`, et les boutons `Valider` / `Annuler`. Si rien n'est à faire : `Tout est à jour` ;
    - `telechargement` : `Téléchargement…` suivi de `n / total` ;
    - `claude` : `Claude crée les notes et les exercices…`, les 5 dernières lignes et un bouton `Arrêter` ;
    - `terminee` : le bilan, les fichiers ratés, et un bouton `Recharger le site` ;
    - `erreur` : un message clair selon le code (`identifiants_manquants` → « Remplis MYGES_IDENTIFIANT et MYGES_MOT_DE_PASSE dans le fichier .env du projet (modèle : .env.exemple) », `identifiants_refuses`, `injoignable`, `claude_introuvable`).
  - `brancherMyges(conteneur)` : récupère l'état au chargement, interroge `api/myges/etat` toutes les 2 s tant que l'étape est active, et arrête de le faire quand la page change (`hashchange`). Ses boutons appellent les routes POST avec `Content-Type: application/json`. `Annuler` remet l'affichage à l'état `repos` sans appeler le serveur. Si le serveur ne répond pas, il affiche le message `SERVEUR_ARRETE` de `compilateur.js`.

- [ ] **Step 1 : écrire les tests qui échouent** pour `rendreEtatMyges` : un test par étape avec le texte attendu ci-dessus. Un nom de fichier `<img>` est échappé, et l'aperçu vide affiche `Tout est à jour`.
- [ ] **Step 2 : lancer** `node --test tests/myges-vue.test.js` → ÉCHEC.
- [ ] **Step 3 : écrire** `myges.js`, puis brancher l'encadré dans `accueil.js` et ajouter le style.
- [ ] **Step 4 : lancer** `npm test` → tout passe.
- [ ] **Step 5 : vérifier dans le vrai site**, avec `npm start` et le faux Claude (`ESGI_CLAUDE=tests/faux-claude.js`) :
  - l'encadré s'affiche en thème sombre et en thème clair, et sur téléphone (fenêtre étroite) ;
  - le clic donne l'aperçu, avec le vrai compte ;
  - **Annuler, sans valider** ;
  - recharger la page pendant `liste` reprend l'affichage.

### Task 9 : documentation et vérification finale

**Files :**
- Modify : `README.md` (section « Synchroniser avec MyGES » : remplir `.env`, cliquer, valider), `CLAUDE.md` (structure `serveur/myges/`, routes, fichiers `.env` / `myges-suivi.json` / `myges-matieres.json`, sécurité), `TODO.md`

- [ ] **Step 1 : mettre à jour** la documentation.
- [ ] **Step 2 : lancer** `npm test` et `npm run verifier-contenu` → 0 échec, 0 problème.
- [ ] **Step 3 : vérifier** que `git status` ne montre ni `.env`, ni `myges-suivi.json`, ni aucun PDF, et que `git diff` ne contient aucune donnée personnelle.
- [ ] **Step 4 : première vraie synchro, avec Antoine** : il clique, relit l'aperçu, valide. Contrôler ensuite le bilan, les fichiers dans le vault et les nouveaux chapitres du site.
