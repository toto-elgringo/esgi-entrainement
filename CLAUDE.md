# ESGI Entraînement

## Description

Site d'entraînement pour **tous les cours de l'ESGI** : Maths pour l'informatique, Maths pour le big data, Combinatoire et complexité, Algorithmique avancée (C), Scripting Python, Rust, Anglais professionnel (TOEIC) et Cours électif (SIG). Chaque chapitre propose un cours résumé, un quiz et des exercices corrigés automatiquement. Dépôt public partagé avec la classe.

- Uniquement en local (`npm start`) : plus de GitHub Pages. Le code des exercices et des exemples du cours est compilé ou lancé par les outils de la machine (cargo, Python 3, gcc), et les erreurs s'affichent en couleur dans la page.
- Les notes sources sont dans le vault Obsidian : `C:\Users\totoa\Obsidian\Claude Note\Cours - ESGI\<matière>\`.

## Stack technique

- Site : HTML / CSS / JavaScript pur (modules ES), **aucune dépendance npm**, pas de build.
- CDN : CodeMirror 5.65.16 (éditeur Rust, Python, C ; addons searchcursor, comment, keymap sublime pour les raccourcis), KaTeX 0.16.9 (formules), marked 12.0.2 (Markdown), highlight.js 11.9.0.
- Progression : `localStorage` (clé `esgi-entrainement`) : exercices réussis, meilleurs scores et parties de quiz en cours (`partiesQuiz`), saisies, code, affichage de chaque exercice (`affichages` : indices, solution ouverte, dernier résultat, entrée du programme). Tout est repris quand on revient sur la page.
- Exercices de code : Ctrl+S enregistre puis vérifie (dans les exemples du cours : exécute). Raccourcis d'édition façon VS Code dans `js/code/raccourcis.js` (commandes de `keymap/sublime.js` + copie de lignes maison), Alt+clic pour déposer des curseurs, curseurs affichés sur chaque sélection.
- Serveur local : Node.js 20+ sans dépendance (`http`, `child_process`).
  - Rust : `cargo clippy` (ou `cargo check`) puis `cargo build` / `cargo test --no-run`, édition 2024, debug.
  - Python : Python 3.8+ (`python`, `py -3` ou `python3`), `-X utf8 -B`, vérification de syntaxe puis exécution ; tests = code importé + fonctions `test_…`.
  - C : `gcc -std=c17 -Wall -Wextra -O0`, sortie non tamponnée, plantages expliqués (segmentation, pile, division par zéro) ; tests = `main` de l'élève renommé + `tests.c` avec `VERIFIER` / `BILAN`.
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
  contenu-code.js   lecture du contenu de code, construireSommaire()
  validation-code.js
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
| `npm run verifier-contenu [-- <domaine> \| <domaine>/<chapitre>]` | valide le contenu |

## Installation des outils (Windows)

- Rust : rustup. Python : python.org (cocher « Add to PATH »). gcc : `scoop install gcc` (installé le 18/10/2026, dans `~\scoop\apps\gcc\current\bin`, ouvrir un nouveau terminal).

## État actuel

- Idées : `TODO.md`.
