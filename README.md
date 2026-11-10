# ESGI Entraînement

Cours, quiz et exercices corrigés automatiquement pour les cours de l'ESGI : **Maths pour l'informatique**, **Maths pour le big data**, **Combinatoire et complexité**, **Algorithmique avancée (C)**, **Scripting Python**, **Rust**, **Anglais professionnel (TOEIC)** et **Cours électif**.

Le site tourne sur ton ordinateur : le code des exercices est compilé ou lancé par tes propres outils, et les erreurs s'affichent directement dans la page.

## Lancer le site

Installe [Node.js](https://nodejs.org) (version 20 ou plus), puis :

```bash
git clone https://github.com/toto-elgringo/esgi-entrainement.git
cd esgi-entrainement
npm start
```

Le site s'ouvre sur http://localhost:3000. Ta progression est enregistrée dans ton navigateur.

## Récupérer les nouveaux cours sur MyGES

1. Crée un fichier `.env` à la racine du projet (il n'est jamais envoyé sur GitHub) :

   ```
   MYGES_IDENTIFIANT=ton_identifiant_myges
   MYGES_MOT_DE_PASSE=ton_mot_de_passe
   ```

   L'identifiant est celui de la page de connexion MyGES, pas ton adresse e-mail.
2. Lance le site, puis clique sur « Télécharger les nouveaux cours » sur la page de choix de la matière.

Les supports déjà téléchargés sont ignorés. Les nouveaux sont rangés dans le dossier `Sources` de chaque matière du vault Obsidian, puis Claude Code crée en arrière-plan les notes et les exercices. S'il n'y a rien de nouveau, le site affiche « Aucun nouveau cours ».

## Outils pour les exercices de code

| Matière | Outil | Installation |
|---|---|---|
| Rust | cargo (+ clippy) | [rustup](https://rustup.rs), puis `rustup component add clippy` |
| Scripting Python | Python 3.8+ | [python.org](https://www.python.org/downloads/) (coche « Add python.exe to PATH ») |
| Algorithmique avancée | gcc | Windows : `scoop install gcc` ou MSYS2 · macOS : `xcode-select --install` · Linux : `sudo apt install gcc` |

Les matières sans code (maths, combinatoire, anglais, électif) ne demandent rien de plus.
