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

## Outils pour les exercices de code

| Matière | Outil | Installation |
|---|---|---|
| Rust | cargo (+ clippy) | [rustup](https://rustup.rs), puis `rustup component add clippy` |
| Scripting Python | Python 3.8+ | [python.org](https://www.python.org/downloads/) (coche « Add python.exe to PATH ») |
| Algorithmique avancée | gcc | Windows : `scoop install gcc` ou MSYS2 · macOS : `xcode-select --install` · Linux : `sudo apt install gcc` |

Les matières sans code (maths, combinatoire, anglais, électif) ne demandent rien de plus.
