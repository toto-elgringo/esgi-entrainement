# ESGI Entraînement

## Description

Site d'entraînement pour **tous les cours de l'ESGI** : Maths pour l'informatique, Maths pour le big data, Combinatoire et complexité, Algorithmique avancée (C), Scripting Python, Rust, Rust avancé, Anglais professionnel (TOEIC) et Cours électif (SIG). Chaque chapitre propose un cours résumé, un quiz et des exercices corrigés automatiquement. Dépôt public partagé avec la classe.

- Uniquement en local (`npm start`) : plus de GitHub Pages. Le code des exercices et des exemples du cours est compilé ou lancé par les outils de la machine (cargo, Python 3, gcc), et les erreurs s'affichent en couleur dans la page.
- Les notes sources sont dans le vault Obsidian : `C:\Users\totoa\Obsidian\Claude Note\Cours - ESGI\<matière>\`.

## Stack technique

- Site : HTML / CSS / JavaScript pur (modules ES), **aucune dépendance npm**, pas de build.
- Bibliothèques hébergées dans `vendor/` (plus aucun CDN, le site marche sans internet) : CodeMirror 5.65.16 (éditeur Rust, Python, C ; addons searchcursor, match-highlighter, comment, keymap sublime pour les raccourcis), KaTeX 0.16.9 (formules), marked 12.0.2 (Markdown), highlight.js 11.9.0. CodeMirror, KaTeX et les animations sont chargés seulement quand une page en a besoin (`js/chargeur.js`, `import()` dans `js/animations/index.js`).
- Progression : `localStorage` (clé `esgi-entrainement`) : exercices réussis, meilleurs scores et parties de quiz en cours (`partiesQuiz`), saisies, code, affichage de chaque exercice (`affichages` : indices, solution ouverte, dernier résultat, entrée du programme). Tout est repris quand on revient sur la page. Écritures regroupées (300 ms, immédiates pour réussite / score / thème), relues avant chaque écriture et rechargées sur l'événement `storage` : plusieurs onglets ne s'écrasent plus. Stockage plein → notification (`js/notification.js`). Résultat gardé : 4 000 caractères par texte, 20 tests. Export / import dans un fichier JSON (`{ format, version, progression }`) depuis l'encadré « Sauvegarde » (page de choix de la matière et accueil de chaque matière), pour changer d'ordinateur.
- Menu latéral rangeable (☰ ou Ctrl+B, état gardé dans `menuRange`) ; sur téléphone, ☰ le fait glisser par-dessus.
- Thème sombre par défaut, mode clair avec le bouton ☀/☾ (`theme` dans le stockage, appliqué avant l'affichage par un petit script dans `index.html`). Toutes les couleurs sont des variables CSS redéfinies sous `:root[data-theme="clair"]` (y compris éditeur, couleurs du code highlight.js écrites dans `style.css`, sortie du terminal et accents par matière).
- Exercices de code : Ctrl+S enregistre puis vérifie (dans les exemples du cours : exécute). Raccourcis d'édition façon VS Code dans `js/code/raccourcis.js` (commandes de `keymap/sublime.js` + copie de lignes maison), Alt+clic pour déposer des curseurs, curseurs affichés sur chaque sélection. Toutes les occurrences du texte sélectionné (mot ou plus long, sur une ligne) sont surlignées (addon `match-highlighter`, réglages `SURBRILLANCE_OCCURRENCES` dans `editeur.js`, couleurs `--code-occurrence`).
- Serveur local : Node.js 20+ sans dépendance (`http`, `child_process`).
  - Rust : `cargo clippy` (ou `cargo check`) puis `cargo build` / `cargo test --no-run`, édition 2024, debug.
  - Python : Python 3.8+ (`python`, `py -3` ou `python3`), `-X utf8 -B`, vérification de syntaxe (`compile()`) et exécution dans un seul lancement ; tests = code importé + fonctions `test_…`.
  - C : `gcc -std=c17 -Wall -Wextra -O0`, sortie non tamponnée, plantages expliqués (segmentation, pile, division par zéro) ; tests = `main` de l'élève renommé + `tests.c` avec `VERIFIER_EGAL` / `VERIFIER` / `BILAN`.
  - Résultat des tests : le serveur renvoie `tests` (un enregistrement par test : nom, appel, obtenu, attendu, condition ou erreur) ; la page affiche une carte « Appel (valeur lue) / Sortie obtenue / Attendu » par test raté, puis la sortie complète repliée. Rust : lu dans la panique + le code source ; Python : `assert` relus par le lanceur (`tests.py`) ; C : lignes `@TEST` écrites par les macros.
  - Exécution 10 s max (tout l'arbre de processus est tué, `taskkill /T`), annulée si la page ferme la requête, entrée standard possible (`entree.txt`). Sortie renvoyée coupée à 20 000 caractères. Lignes `RESULTAT` / `@TEST` signées par un marqueur aléatoire (`ESGI_MARQUEUR`) pour Python et C. Programme bloqué par Windows → statut `lancement_bloque`. « Essayer » en Rust : `cargo build` seul ; atelier Rust préchauffé au démarrage.
- Tests : `node:test`.

## Structure du projet

```
index.html, style.css, favicon.svg, favicon.ico (icône du raccourci du bureau)
js/
  app.js            routeur par hash : #/cours/<domaine>/<chapitre>, #/quiz/..., #/exercice/<domaine>/<chapitre>/<id>
  domaines.js       liste des domaines (code : rust, python, c ; réponses : maths, combinatoire, anglais, electif), langages, ordre des matières
  catalogue.js      un appel GET api/sommaire/<domaine> par domaine au démarrage ; quiz chargé à la demande (chargerQuiz),
                    préchargement de l'exercice suivant
  api.js            appel au serveur commun + SERVEUR_ARRETE ; chargeur.js (scripts/CSS à la demande) ; notification.js (toast)
  exercice-commun.js  difficulté, voisins, indices, bascule de la solution (code et réponses)
  synchro-etats.js  ETAPES_ACTIVES, AUCUN_NOUVEAU_COURS (partagé avec le serveur)
  stockage.js       localStorage
  parcours.js       filtrage par matière, voisins, progression (clés « domaine/chapitre/exercice »)
  menu.js, outils.js (Markdown, formules KaTeX, encarts Obsidian)
  animations/       blocs ```anim``` des cours (graphiques, schémas, pas à pas) : index.js (registre, lireBloc,
                    lancement quand le cadre devient visible), outils.js (SVG, curseurs, boucle), maths.js,
                    combinatoire.js, code.js (C, Rust, Python), anglais.js (anglais + SIG) ; styles dans css/animations*.css
  vues/             accueil (choix de la matière, état des outils), cours, quiz
  maths/            exercices à réponses (tous les domaines à réponses) : expression.js, verification.js, validation.js, exercice.js
  code/             exercices de code (tous les langages) : compilateur.js (API locale), editeur.js (CodeMirror),
                    exercice.js, resultat.js (textes par langage), terminal.js (couleurs ANSI → HTML),
                    exemples.js (bouton « Essayer » sur les blocs de code du cours),
                    raccourcis.js (raccourcis façon VS Code, Alt+clic multi-curseurs)
contenu/
  rust/, rust-avance/, python/, c/   chapitres (dossier par exercice) + sommaire.json (généré, plus lu par le site)
  maths/, combinatoire/, anglais/, electif/   programme.json + chapitres (chapitre.json, cours.md, quiz.json, exercices.json)
serveur/
  index.js          npm start (port 3000, 127.0.0.1)
  serveur.js        table de routes unique : fichiers statiques (liste blanche), /supports/, API /api/etat[?rafraichir=1],
                    /api/sommaire/<domaine>, /api/<langage>/executer|verifier, /api/<synchro>/…
  processus.js      lancement des programmes, réserve de dossiers de travail, bilans de tests communs
  rust.js, python.js, c.js      compilation / exécution par langage
  tests-rust.js     relit les paniques de `cargo test` et le code source pour donner appel / obtenu / attendu
  contenu-code.js   lecture du contenu, construireSommaire(), sommaires de l'API (cache vidé par fs.watch sur contenu/)
  validation-code.js
  synchro.js        tronc commun des synchros : file d'attente, lancement de Claude, reprise, une seule intégration à la fois (creerVerrou)
  schooding/        synchro Schooding : connexion (CSRF, pauses, 429), pages (lecture des pages), markdown, source (récolte), videos (yt-dlp), synchro
  commun/           partagé par les synchros : session (cookies, délai 60 s), env, claude (lancement), html, noms, archives
                    (.zip via tar : liens et > 500 Mo refusés), erreurs (ErreurSynchro), json (écritures uniques et en file),
                    telechargement (flux sur disque, 500 Mo max)
  myges/            synchro MyGES : connexion (CAS), source (page des supports, téléchargement), matieres, tri (doublons), synchro
scripts/
  sommaire.js           régénère contenu/{rust,python,c}/sommaire.json (facultatif : le serveur calcule le sommaire)
  test-rapide.js        npm run test:rapide (ESGI_SANS_COMPILATION=1)
  verifier-contenu.js   valide tous les domaines (lance chaque solution, vérifie que le départ échoue, contrôle les sommaires)
  lancer.bat            lance le site (raccourci « ESGI Entrainement » du bureau, ouvert dans Windows Terminal avec un titre fixe)
vendor/             CodeMirror, KaTeX (+ polices), marked, highlight.js avec leurs licences
tests/
.github/workflows/tests.yml   npm run test:rapide à chaque push
CONTENU.md          format exact du contenu (code et réponses)
```

## Architecture

- Matières : une par domaine de code (`rust`, `rust-avance`, `python`, `algo-avancee` pour le domaine `c`), et celles déclarées dans les `programme.json` (`informatique`, `big-data`, `combinatoire`, `anglais`, `electif`). Les chapitres maths 04 et 05 sont communs à l'informatique et au big data. Un domaine sans contenu est masqué.
- `rust-avance` est un domaine distinct qui utilise le langage Rust : `DOMAINES_CODE` donne un `langage` par domaine (`langageDe(domaine)`), les routes `api/<langage>/verifier` reçoivent aussi le `domaine` pour trouver le dossier. Contenu en Rust std seule (aucune crate : tokio, rayon, axum, Loco, PyO3 sont seulement décrits en blocs `text`/`toml`). 10 chapitres : pointeurs intelligents, mutabilité intérieure, traits avancés, programmation par les types, concurrence, async, macros, unsafe et FFI, web et Loco, concepts fonctionnels.
- Supports : fichiers locaux (`fichier`, PDF/HTML du vault) ou liens web (`url` en https, `integrer: true` pour afficher la page dans le site, sinon bouton « Ouvrir »).
- Sécurité du serveur : Host local obligatoire sur toutes les requêtes ; chaque POST exige Origin locale (si envoyée), `Content-Type: application/json` et le jeton de session (cookie `esgi_jeton_<port>`, HttpOnly, SameSite=Strict, posé en servant `/`). Serveur redémarré → « Session expirée : recharge la page ». Fichiers servis en liste blanche (`index.html`, `style.css`, `favicon.*`, `css/`, `js/`, `contenu/`, `vendor/`), chemins avec `~`, `:` ou `.xxx` refusés. CSP stricte (script du thème autorisé par empreinte sha256), nosniff, no-referrer, frame-ancestors 'self'. Supports HTML servis avec `CSP: sandbox`, supports en flux avec `Range`. Erreur 500 = message fixe.
- `GET api/etat` renvoie les versions de cargo, clippy, Python et gcc : l'accueil d'une matière de code prévient si l'outil manque ou si le serveur ne répond plus.
- Dossiers de travail dans `<tmp>/esgi-entrainement-<outil>/<pid>/atelier-N`, réutilisés et supprimés à l'arrêt du processus.
- Supports originaux (PDF, HTML des profs) : jamais copiés dans le dépôt public. Déclarés dans `chapitre.json` (`supports`), servis par `/supports/<chemin>` depuis `DOSSIER_SUPPORTS` (par défaut le vault Obsidian `Cours - ESGI`), affichés dans la vue `#/supports/<domaine>/<chapitre>` (`js/vues/supports.js`, `js/supports.js`).
- Synchro MyGES (bouton « Télécharger les nouveaux cours » sur la page de choix de la matière, `js/vues/myges.js`) : connexion au site myges.fr avec `.env` (`MYGES_IDENTIFIANT` = identifiant MyGES, pas l'e-mail, et `MYGES_MOT_DE_PASSE`), lecture de `student/courses-files`, téléchargement des nouveaux supports dans `<vault>/<Matière>/Sources/` (`.zip` extraits), puis `claude -p "/obsidian -esgi …"` en arrière-plan avec la liste des fichiers (`--permission-mode acceptEdits`, listes `OUTILS_AUTORISES_CLAUDE` / `OUTILS_INTERDITS_CLAUDE` dans `serveur/synchro.js` : pas de WebFetch, curl, git push ni lecture de `.env` ; `.claude/settings.json` du projet interdit aussi la lecture des secrets). Journaux : 20 gardés. Rien de nouveau : « Aucun nouveau cours », Claude n'est pas lancé. Méthode détaillée : `docs/myges-api.md`.
  - Doublons : `myges-suivi.json` (non versionné, identifiant MyGES → chemin) et comparaison des noms déjà présents dans `Sources\` (casse, accents, ponctuation et `[Mot] X` / `Mot - X` ignorés).
  - Reprise après coupure : `myges-a-integrer.json` (non versionné, jamais servi) liste les fichiers téléchargés pas encore intégrés (ajout après chaque téléchargement, `tentatives`, `arretee`). Il n'est vidé que si Claude finit sans erreur, écrit `SYNCHRO TERMINÉE` dans sa réponse finale et n'a aucun sous-agent coupé (`subagent_stats.killed`). Sinon : reprise automatique au `npm start` suivant (`reprendreAuDemarrage`, consigne « Reprise : … » dans le prompt), sauf après « Arrêter » ou 3 tentatives ; bouton « Reprendre l'intégration » (`POST api/myges/reprendre`). Un « Télécharger » sans nouveau cours intègre aussi les fichiers en attente. Ctrl+C sur le serveur coupe Claude sans le marquer arrêté.
  - `myges-matieres.json` (versionné) : matière MyGES sans préfixe `T1 - ` → dossier du vault. Matière inconnue : dossier créé et ajouté.
  - Routes `POST api/myges/synchroniser`, `POST api/myges/reprendre`, `POST api/myges/arreter`, `GET api/myges/etat`, créées à partir de `synchros: { myges, schooding }` (chaque synchro expose `nom` et `fichiersPrives`).
  - `ESGI_CLAUDE=tests/faux-claude.js` remplace Claude pour essayer sans lancer le vrai. Journal de Claude : `<tmp>/esgi-entrainement-myges/` (et `-schooding/`).
- Synchro Schooding (bouton séparé « Télécharger depuis Schooding », même vue `js/vues/myges.js` avec `SOURCES`) : `.env` (`SCHOODING_IDENTIFIANT` = login, pas l'e-mail, et `SCHOODING_MOT_DE_PASSE`). Lit cours, séances, documents (Markdown, slides Google en SVG + texte, vidéos YouTube), exercices (énoncé, mon code, solution officielle) et QCM corrigés des examens passés, écrits dans `<vault>/<Matière>/Sources/Schooding/`. Suivi `schooding-suivi.json` et attente `schooding-a-integrer.json` (non versionnés, jamais servis), `schooding-matieres.json` versionné. Vidéos `.mp4` seulement si `yt-dlp` est installé (sinon lien, retéléchargé plus tard). Routes `api/schooding/…` comme MyGES. Une seule intégration Claude à la fois entre les deux synchros. Méthode détaillée : `docs/schooding.md`.
- Formules KaTeX actives pour `maths` et `combinatoire` seulement (l'anglais contient des prix en `$`).
- `body[data-domaine]` change la couleur d'accent de chaque domaine.
- Correction des maths : expressions comparées en plusieurs points, `aUneConstantePres` pour les primitives, aperçu « Lu comme » en LaTeX.

## Conventions

- Code, noms et textes en **français**, pas de commentaires dans le code.
- Après toute modification du contenu de code : `npm run sommaire` (garde les `sommaire.json` à jour pour `verifier-contenu`, le site calcule le sien).
- Solutions sans aucun avertissement (cargo + clippy, gcc `-Wall -Wextra`) ; LaTeX des JSON avec `\` doublés.
- Contenu reformulé à partir des cours (dépôt public), jamais recopié mot pour mot.

## Commandes utiles

| Commande | Rôle |
|---|---|
| `npm start` | site local avec compilation (http://localhost:3000) |
| `npm test` | tests unitaires |
| `npm run test:rapide` | tests sans compilation réelle |
| `npm run couverture` | tests avec couverture |
| `npm run sommaire` | régénère les `sommaire.json` des domaines de code |
| `npm run verifier-contenu [-- <domaine> \| <domaine>/<chapitre>[/<exercice>]]` | valide le contenu (préfixes acceptés) |

## Installation des outils (Windows)

- Rust : rustup. Python : python.org (cocher « Add to PATH »). gcc : `winget install BrechtSanders.WinLibs.POSIX.UCRT` (gcc 16.2, installé le 18/11/2026, dans `%LOCALAPPDATA%\Microsoft\WinGet\Packages\BrechtSanders.WinLibs.POSIX.UCRT_…\mingw64\bin`, ajouté au PATH, ouvrir un nouveau terminal).

## État actuel

- Idées : `TODO.md`.
- Contenu de code (18/11/2026) : Rust 15 chapitres / 142 exercices, Rust avancé 10 / 79, Python 6 / 97, Algo avancée (C) 11 / 101 (tableaux, tris simples, fusion, rapide, tas, piles, files, listes chaînées). Les quiz finissent par des questions de style évaluation, sur le modèle des QCM Schooding.
- Problème connu (10/11/2026) : le Smart App Control de Windows est actif et bloque au hasard les programmes compilés (« spawn UNKNOWN », os error 4551) : tests Rust / serveur et `verifier-contenu -- rust` échouent par moments sans que le contenu soit en cause.
