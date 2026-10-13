# ESGI Entraînement

## Description

Site d'entraînement pour les cours de l'ESGI : **Rust**, **Maths pour l'informatique** et **Maths pour le big data**. Chaque chapitre propose un cours résumé, un quiz et des exercices corrigés automatiquement. Publié avec GitHub Pages (https://toto-elgringo.github.io/esgi-entrainement/) et partagé avec la classe.

- En ligne : tout marche (cours, quiz, exercices de maths, écriture du code Rust), sauf la compilation Rust.
- En local (`npm start`) : le même site, plus la compilation et la vérification des exercices Rust par le `rustc` de la machine.

## Stack technique

- Site : HTML / CSS / JavaScript pur (modules ES), **aucune dépendance npm**, pas de build.
- CDN : CodeMirror 5.65.16 (éditeur Rust), KaTeX 0.16.9 (formules), marked 12.0.2 (Markdown), highlight.js 11.9.0.
- Progression : `localStorage` (clé `esgi-entrainement`) : exercices réussis, quiz, saisies de maths, code Rust.
- Serveur local : Node.js 20+ sans dépendance (`http`, `child_process`), compile avec `rustc --edition 2024 -A dead_code` (debug, 10 s max).
- Tests : `node:test`.

## Structure du projet

```
index.html, style.css, favicon.svg, .nojekyll
js/
  app.js            routeur par hash : #/cours/<domaine>/<chapitre>, #/quiz/..., #/exercice/<domaine>/<chapitre>/<id>
  catalogue.js      charge contenu/rust/sommaire.json et contenu/maths/programme.json (+ fichiers des chapitres)
  stockage.js       localStorage
  parcours.js       filtrage par matière, voisins, progression (clés « domaine/chapitre/exercice »)
  menu.js, outils.js (Markdown, formules KaTeX, encarts Obsidian)
  vues/             accueil (choix de la matière), cours, quiz
  maths/            expression.js (lecture et calcul d'expressions), verification.js (correction par type), validation.js, exercice.js
  rust/             compilateur.js (appels à l'API locale), editeur.js (CodeMirror), exercice.js
contenu/
  rust/             13 chapitres (dossier par exercice : enonce.md, depart.rs, solution.rs, tests.rs ou sortie.txt) + sommaire.json GÉNÉRÉ
  maths/            programme.json + 5 chapitres (chapitre.json, cours.md, quiz.json, exercices.json)
serveur/
  index.js          npm start (port 3000, 127.0.0.1)
  serveur.js        fichiers statiques + API /api/etat, /api/rust/executer, /api/rust/verifier
  rust.js           compilation et exécution
  contenu-rust.js   lecture du contenu Rust, construireSommaire()
  validation-rust.js
scripts/
  sommaire-rust.js      régénère contenu/rust/sommaire.json
  verifier-contenu.js   valide maths et Rust (compile chaque solution, vérifie que le départ échoue, contrôle le sommaire)
tests/
CONTENU.md          format exact du contenu (Rust et maths)
```

## Architecture

- Matières : `rust` (domaine rust), `informatique` et `big-data` (domaine maths). Les chapitres maths 04 et 05 sont communs aux deux matières.
- Le site détecte le serveur local avec `GET api/etat` (chemin relatif). Sur GitHub Pages, la requête échoue : les boutons Exécuter / Vérifier affichent la marche à suivre pour lancer en local.
- `body[data-domaine]` change la couleur d'accent (orange Rust, bleu maths).
- Correction des maths : expressions comparées en plusieurs points, `aUneConstantePres` pour les primitives, aperçu « Lu comme » en LaTeX.
- Le Markdown Rust est rendu sans formules (pas de traitement des `$`).

## Conventions

- Code, noms et textes en **français**, pas de commentaires dans le code.
- Après toute modification du contenu Rust : `npm run sommaire`.
- Solutions Rust sans aucun avertissement ; LaTeX des JSON avec `\` doublés.
- Contenu reformulé à partir des cours (dépôt public).

## Commandes utiles

| Commande | Rôle |
|---|---|
| `npm start` | site local avec compilation Rust (http://localhost:3000) |
| `npm test` | tests unitaires |
| `npm run sommaire` | régénère `contenu/rust/sommaire.json` |
| `npm run verifier-contenu [-- maths \| rust \| rust/03]` | valide le contenu |

## État actuel

- Rust : 13 chapitres, 98 exercices. Maths : 5 chapitres, 70 exercices.
- Publication : GitHub Pages depuis `main`, racine du dépôt. Chaque push republie le site.
- Remplace les anciens dépôts `rust-entrainement` et `maths-entrainement`.
- Idées : `TODO.md`.
