> [!info] Advent of Code 2022, jour 7
> Énigme originale : [adventofcode.com/2022/day/7](https://adventofcode.com/2022/day/7). L'histoire et l'exemple sont réécrits ici avec nos propres données.

Tu veux installer une mise à jour sur ton appareil, mais le disque est **plein**. Tu explores ses dossiers depuis un terminal, et tu récupères tout ce qui s'est affiché :

```text
$ cd /
$ ls
dir docs
21534770 film.mkv
dir jeux
1200 lisezmoi.txt
dir musique
$ cd docs
$ ls
dir archives
45210 cv.pdf
8320 lettre.odt
$ cd archives
$ ls
12002 budget.ods
30125 notes.md
$ cd ..
$ cd ..
$ cd jeux
$ ls
dir archives
4321987 course.iso
9876543 echecs.bin
$ cd archives
$ ls
64000 partie.sav
$ cd ..
$ cd ..
$ cd musique
$ ls
6214775 album.flac
3210440 radio.mp3
```

Les lignes qui commencent par `$` sont les commandes que tu as tapées :

- `cd /` va dans le dossier principal, appelé `/` ;
- `cd ..` remonte dans le dossier parent ;
- `cd nom` entre dans le sous-dossier `nom` du dossier actuel ;
- `ls` affiche le contenu du dossier actuel : `dir nom` pour un sous-dossier, `taille nom` pour un fichier.

L'exemple décrit donc cet arbre :

```text
/
├── docs
│   ├── archives
│   │   ├── budget.ods (12002)
│   │   └── notes.md (30125)
│   ├── cv.pdf (45210)
│   └── lettre.odt (8320)
├── film.mkv (21534770)
├── jeux
│   ├── archives
│   │   └── partie.sav (64000)
│   ├── course.iso (4321987)
│   └── echecs.bin (9876543)
├── lisezmoi.txt (1200)
└── musique
    ├── album.flac (6214775)
    └── radio.mp3 (3210440)
```

La **taille d'un dossier** est la somme de tous les fichiers qu'il contient, y compris ceux de ses sous-dossiers (et des sous-dossiers de ses sous-dossiers…).

| Dossier | Taille |
|---|---|
| `/docs/archives` | 42127 |
| `/docs` | 95657 |
| `/jeux/archives` | 64000 |
| `/jeux` | 14262530 |
| `/musique` | 9425215 |
| `/` | 45319372 |

Attention : il y a **deux** dossiers `archives`, à deux endroits différents. Ce sont deux dossiers distincts.

## Partie 1

Trouve tous les dossiers dont la taille est **au plus 100000**, et additionne leurs tailles. Un fichier peut ainsi être compté plusieurs fois (dans son dossier et dans un dossier parent), c'est voulu.

Dans l'exemple : `/docs/archives`, `/docs` et `/jeux/archives`, soit 42127 + 95657 + 64000 = **201784**.

## Partie 2

Le disque fait **70000000** en tout, et la mise à jour a besoin de **30000000** libres. Tu vas supprimer **un seul** dossier : le plus petit qui libère assez de place. Donne sa taille.

Dans l'exemple, le disque contient 45319372, il reste donc 70000000 − 45319372 = 24680628 de libre : il faut libérer 30000000 − 24680628 = 5319372. Les dossiers assez gros sont `/musique` (9425215), `/jeux` (14262530) et `/` (45319372). Le plus petit est `/musique` : **9425215**.

Écris `partie1(entree)` et `partie2(entree)`.

## L'idée

Un dossier contient des fichiers et d'autres dossiers : c'est un **arbre**. Pas besoin de le construire en entier : lis les lignes une par une en gardant le **chemin actuel** dans une **pile** (`Vec`). `cd nom` empile un nom, `cd ..` retire le dernier, `cd /` vide la pile.

Quand tu lis un fichier, ajoute sa taille à **chaque dossier du chemin** (le dossier actuel et tous ses parents jusqu'à `/`). Range les tailles dans un `HashMap` dont la clé est le **chemin complet** (`/docs/archives`, pas seulement `archives`). À la fin, tu as la taille de chaque dossier, et les deux parties ne sont plus que des filtres.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
