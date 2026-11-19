# ESGI Entraînement

Cours, quiz et exercices corrigés automatiquement pour les cours de l'ESGI : **Maths pour l'informatique**, **Maths pour le big data**, **Combinatoire et complexité**, **Algorithmique avancée (C)**, **Scripting Python**, **Rust**, **Rust avancé**, **Anglais professionnel (TOEIC)** et **Cours électif (SIG)**.

Le site tourne sur ton ordinateur : le code des exercices est compilé ou lancé par tes propres outils, et les erreurs s'affichent directement dans la page. Il marche sans internet (les bibliothèques sont dans `vendor/`).

## Lancer le site

Installe [Node.js](https://nodejs.org) (version 20 ou plus), puis :

```bash
git clone https://github.com/toto-elgringo/esgi-entrainement.git
cd esgi-entrainement
npm start
```

Le site s'ouvre sur http://localhost:3000. Ta progression est enregistrée dans ton navigateur ; l'encadré « Sauvegarde » permet de l'exporter dans un fichier pour changer d'ordinateur.

Sous Windows, `scripts/lancer.bat` lance le site en un double-clic (pratique pour un raccourci sur le bureau).

## Réglages (variables d'environnement)

| Variable | Rôle | Par défaut |
|---|---|---|
| `PORT` | port du site | `3000` |
| `DOSSIER_SUPPORTS` | dossier des supports originaux (PDF, HTML des profs) affichés dans le site | `~/Obsidian/Claude Note/Cours - ESGI` |
| `ESGI_CLAUDE` | commande lancée à la place de Claude Code (pour essayer la synchro, ex. `tests/faux-claude.js`) | `claude` |

Exemple : `PORT=3001 DOSSIER_SUPPORTS="D:/Cours" npm start`.

## Récupérer les nouveaux cours (MyGES et Schooding)

1. Copie `.env.exemple` en `.env` à la racine du projet (il n'est jamais envoyé sur GitHub) et remplis-le :

   ```
   MYGES_IDENTIFIANT=ton_identifiant_myges
   MYGES_MOT_DE_PASSE=ton_mot_de_passe
   SCHOODING_IDENTIFIANT=ton_login_schooding
   SCHOODING_MOT_DE_PASSE=ton_mot_de_passe
   ```

   Les identifiants sont ceux des pages de connexion, pas ton adresse e-mail.
2. Lance le site, puis clique sur « Télécharger les nouveaux cours » (MyGES) ou « Télécharger depuis Schooding » sur la page de choix de la matière.

Les supports déjà téléchargés sont ignorés. Les nouveaux sont rangés dans le dossier `Sources` de chaque matière du vault Obsidian, puis Claude Code crée en arrière-plan les notes et les exercices. S'il n'y a rien de nouveau, le site affiche « Aucun nouveau cours ». Les vidéos Schooding sont téléchargées seulement si [yt-dlp](https://github.com/yt-dlp/yt-dlp) est installé.

Si l'ordinateur s'éteint (ou si Claude s'arrête) avant la fin, les cours téléchargés restent notés comme « pas encore intégrés » : au prochain `npm start`, Claude reprend tout seul là où il en était. Après 3 essais ratés, ou si tu as cliqué sur « Arrêter », il attend que tu cliques sur « Reprendre l'intégration ».

### À savoir sur Claude Code

La synchro lance [Claude Code](https://claude.com/claude-code) sans te demander de confirmation : il peut lire et modifier les fichiers du projet et du vault, et lancer les commandes de la liste autorisée (npm, node, cargo, python, gcc…). Internet (WebFetch, curl), `git push` et la lecture de `.env` lui sont interdits. Il lit des fichiers venus de MyGES et Schooding : ne lance la synchro que sur ton propre compte.

## Outils pour les exercices de code

| Matière | Outil | Installation (Windows) |
|---|---|---|
| Rust, Rust avancé | cargo (+ clippy) | [rustup](https://rustup.rs), puis `rustup component add clippy` |
| Scripting Python | Python 3.8+ | [python.org](https://www.python.org/downloads/) (coche « Add python.exe to PATH ») |
| Algorithmique avancée | gcc | `winget install BrechtSanders.WinLibs.POSIX.UCRT` puis ouvre un nouveau terminal · macOS : `xcode-select --install` · Linux : `sudo apt install gcc` |

Les matières sans code (maths, combinatoire, anglais, électif) ne demandent rien de plus. Après avoir installé un outil, clique sur « Revérifier les outils » dans la page de la matière.

## Tests

| Commande | Rôle |
|---|---|
| `npm test` | tous les tests (ceux qui compilent se sautent si l'outil manque) |
| `npm run test:rapide` | tests sans compilation réelle |
| `npm run couverture` | tests avec la couverture du code |
| `npm run verifier-contenu` | vérifie tout le contenu (lance chaque solution) |
