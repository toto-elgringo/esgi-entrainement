# ESGI Entraînement

## Description

Site d'entraînement pour **tous les cours de l'ESGI** : Maths pour l'informatique, Maths pour le big data, Combinatoire et complexité, Algorithmique avancée (C), Scripting Python, Rust, Anglais professionnel (TOEIC) et Cours électif (SIG). Chaque chapitre propose un cours résumé, un quiz et des exercices corrigés automatiquement. Dépôt public partagé avec la classe.

- Uniquement en local (`npm start`) : plus de GitHub Pages. Le code des exercices et des exemples du cours est compilé ou lancé par les outils de la machine (cargo, Python 3, gcc), et les erreurs s'affichent en couleur dans la page.
- Les notes sources sont dans le vault Obsidian : `C:\Users\totoa\Obsidian\Claude Note\Cours - ESGI\<matière>\`.

## Stack technique

- Site : HTML / CSS / JavaScript pur (modules ES), **aucune dépendance npm**, pas de build.
- CDN : CodeMirror 5.65.16 (éditeur Rust, Python, C ; addons searchcursor, match-highlighter, comment, keymap sublime pour les raccourcis), KaTeX 0.16.9 (formules), marked 12.0.2 (Markdown), highlight.js 11.9.0.
- Progression : `localStorage` (clé `esgi-entrainement`) : exercices réussis, meilleurs scores et parties de quiz en cours (`partiesQuiz`), saisies, code, affichage de chaque exercice (`affichages` : indices, solution ouverte, dernier résultat, entrée du programme). Tout est repris quand on revient sur la page. Export / import dans un fichier JSON (`{ format, version, progression }`) depuis l'encadré « Sauvegarde » (page de choix de la matière et accueil de chaque matière), pour changer d'ordinateur.
- Menu latéral rangeable (☰ ou Ctrl+B, état gardé dans `menuRange`) ; sur téléphone, ☰ le fait glisser par-dessus.
- Thème sombre par défaut, mode clair avec le bouton ☀/☾ (`theme` dans le stockage, appliqué avant l'affichage par un petit script dans `index.html`). Toutes les couleurs sont des variables CSS redéfinies sous `:root[data-theme="clair"]` (y compris éditeur, couleurs du code highlight.js écrites dans `style.css`, sortie du terminal et accents par matière).
- Exercices de code : Ctrl+S enregistre puis vérifie (dans les exemples du cours : exécute). Raccourcis d'édition façon VS Code dans `js/code/raccourcis.js` (commandes de `keymap/sublime.js` + copie de lignes maison), Alt+clic pour déposer des curseurs, curseurs affichés sur chaque sélection. Toutes les occurrences du texte sélectionné (mot ou plus long, sur une ligne) sont surlignées (addon `match-highlighter`, réglages `SURBRILLANCE_OCCURRENCES` dans `editeur.js`, couleurs `--code-occurrence`).
- Serveur local : Node.js 20+ sans dépendance (`http`, `child_process`).
  - Rust : `cargo clippy` (ou `cargo check`) puis `cargo build` / `cargo test --no-run`, édition 2024, debug.
  - Python : Python 3.8+ (`python`, `py -3` ou `python3`), `-X utf8 -B`, vérification de syntaxe puis exécution ; tests = code importé + fonctions `test_…`.
  - C : `gcc -std=c17 -Wall -Wextra -O0`, sortie non tamponnée, plantages expliqués (segmentation, pile, division par zéro) ; tests = `main` de l'élève renommé + `tests.c` avec `VERIFIER_EGAL` / `VERIFIER` / `BILAN`.
  - Résultat des tests : le serveur renvoie `tests` (un enregistrement par test : nom, appel, obtenu, attendu, condition ou erreur) ; la page affiche une carte « Appel (valeur lue) / Sortie obtenue / Attendu » par test raté, puis la sortie complète repliée. Rust : lu dans la panique + le code source ; Python : `assert` relus par le lanceur (`tests.py`) ; C : lignes `@TEST` écrites par les macros.
  - Exécution 10 s max, entrée standard possible (`entree.txt`).
- Tests : `node:test`.

## Structure du projet

```
index.html, style.css, favicon.svg
js/
  app.js            routeur par hash : #/cours/<domaine>/<chapitre>, #/quiz/..., #/exercice/<domaine>/<chapitre>/<id>
  domaines.js       liste des domaines (code : rust, python, c ; réponses : maths, combinatoire, anglais, electif), langages, ordre des matières
  catalogue.js      charge contenu/<domaine>/sommaire.json (code) ou programme.json (réponses)
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
  rust/, python/, c/            chapitres (dossier par exercice) + sommaire.json GÉNÉRÉ
  maths/, combinatoire/, anglais/, electif/   programme.json + chapitres (chapitre.json, cours.md, quiz.json, exercices.json)
serveur/
  index.js          npm start (port 3000, 127.0.0.1)
  serveur.js        fichiers statiques + API /api/etat, /api/<langage>/executer, /api/<langage>/verifier
  processus.js      lancement des programmes, réserve de dossiers de travail, bilans de tests communs
  rust.js, python.js, c.js      compilation / exécution par langage
  tests-rust.js     relit les paniques de `cargo test` et le code source pour donner appel / obtenu / attendu
  contenu-code.js   lecture du contenu de code, construireSommaire()
  validation-code.js
  myges/            synchro MyGES : session (cookies), connexion (CAS), source (page des supports, téléchargement),
                    noms, matieres, tri (doublons), archives (.zip via tar), claude (lancement en arrière-plan), synchro (enchaînement)
scripts/
  sommaire.js           régénère contenu/{rust,python,c}/sommaire.json
  verifier-contenu.js   valide tous les domaines (lance chaque solution, vérifie que le départ échoue, contrôle les sommaires)
tests/
CONTENU.md          format exact du contenu (code et réponses)
```

## Architecture

- Matières : une par domaine de code (`rust`, `python`, `algo-avancee` pour le domaine `c`), et celles déclarées dans les `programme.json` (`informatique`, `big-data`, `combinatoire`, `anglais`, `electif`). Les chapitres maths 04 et 05 sont communs à l'informatique et au big data. Un domaine sans contenu est masqué.
- `GET api/etat` renvoie les versions de cargo, clippy, Python et gcc : l'accueil d'une matière de code prévient si l'outil manque ou si le serveur ne répond plus.
- Dossiers de travail dans `<tmp>/esgi-entrainement-<outil>/<pid>/atelier-N`, réutilisés et supprimés à l'arrêt du processus.
- Supports originaux (PDF, HTML des profs) : jamais copiés dans le dépôt public. Déclarés dans `chapitre.json` (`supports`), servis par `/supports/<chemin>` depuis `DOSSIER_SUPPORTS` (par défaut le vault Obsidian `Cours - ESGI`), affichés dans la vue `#/supports/<domaine>/<chapitre>` (`js/vues/supports.js`, `js/supports.js`).
- Synchro MyGES (bouton « Télécharger les nouveaux cours » sur la page de choix de la matière, `js/vues/myges.js`) : connexion au site myges.fr avec `.env` (`MYGES_IDENTIFIANT` = identifiant MyGES, pas l'e-mail, et `MYGES_MOT_DE_PASSE`), lecture de `student/courses-files`, téléchargement des nouveaux supports dans `<vault>/<Matière>/Sources/` (`.zip` extraits), puis `claude -p "/obsidian -esgi …"` en arrière-plan avec la liste des fichiers. Rien de nouveau : « Aucun nouveau cours », Claude n'est pas lancé. Méthode détaillée : `docs/myges-api.md`.
  - Doublons : `myges-suivi.json` (non versionné, identifiant MyGES → chemin) et comparaison des noms déjà présents dans `Sources\` (casse, accents, ponctuation et `[Mot] X` / `Mot - X` ignorés).
  - `myges-matieres.json` (versionné) : matière MyGES sans préfixe `T1 - ` → dossier du vault. Matière inconnue : dossier créé et ajouté.
  - Routes `POST api/myges/synchroniser`, `POST api/myges/arreter`, `GET api/myges/etat` : `Host` et `Origin` locaux obligatoires, JSON obligatoire. Le serveur ne sert jamais les fichiers commençant par `.` (`.env`, `.git`) ni `myges-suivi.json` / `synchro-obsidian.json`.
  - `ESGI_CLAUDE=tests/faux-claude.js` remplace Claude pour essayer sans lancer le vrai. Journal de Claude : `<tmp>/esgi-entrainement-myges/`.
- Formules KaTeX actives pour `maths` et `combinatoire` seulement (l'anglais contient des prix en `$`).
- `body[data-domaine]` change la couleur d'accent de chaque domaine.
- Correction des maths : expressions comparées en plusieurs points, `aUneConstantePres` pour les primitives, aperçu « Lu comme » en LaTeX.

## Conventions

- Code, noms et textes en **français**, pas de commentaires dans le code.
- Après toute modification du contenu de code : `npm run sommaire`.
- Solutions sans aucun avertissement (cargo + clippy, gcc `-Wall -Wextra`) ; LaTeX des JSON avec `\` doublés.
- Contenu reformulé à partir des cours (dépôt public), jamais recopié mot pour mot.

## Commandes utiles

| Commande | Rôle |
|---|---|
| `npm start` | site local avec compilation (http://localhost:3000) |
| `npm test` | tests unitaires |
| `npm run sommaire` | régénère les `sommaire.json` des domaines de code |
| `npm run verifier-contenu [-- <domaine> \| <domaine>/<chapitre>[/<exercice>]]` | valide le contenu (préfixes acceptés) |

## Installation des outils (Windows)

- Rust : rustup. Python : python.org (cocher « Add to PATH »). gcc : `scoop install gcc` (installé le 18/10/2026, dans `~\scoop\apps\gcc\current\bin`, ouvrir un nouveau terminal).

## État actuel

- Idées : `TODO.md`.
