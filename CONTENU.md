# Ajouter du contenu

Le site a deux sortes de domaines :

| Domaine | Dossier | Matière | Exercices |
|---|---|---|---|
| `rust` | `contenu/rust/` | Rust | code Rust compilé par cargo |
| `python` | `contenu/python/` | Scripting Python | code Python lancé par Python 3 |
| `c` | `contenu/c/` | Algorithmique avancée | code C compilé par gcc |
| `maths` | `contenu/maths/` | Maths pour l'informatique, Maths pour le big data | réponses (nombres, expressions…) |
| `combinatoire` | `contenu/combinatoire/` | Combinatoire et complexité | réponses |
| `anglais` | `contenu/anglais/` | Anglais professionnel | réponses (choix, mots à compléter…) |
| `electif` | `contenu/electif/` | Cours électif | réponses |

La liste des domaines est dans `js/domaines.js`. `npm run verifier-contenu` sans argument vérifie tout (compte quelques minutes : chaque solution est compilée ou lancée).

## Domaines de code (Rust, Python, C)

Les trois langages ont **le même format**, seule l'extension des fichiers change : `.rs` (Rust), `.py` (Python), `.c` (C). Les exemples ci-dessous sont en Rust. **Après chaque ajout ou modification, lance `npm run sommaire`** : le site lit la liste des chapitres et des exercices dans `contenu/<langage>/sommaire.json`.

### Arborescence

```
contenu/rust/
└── 02-premiers-pas/                 un chapitre (le numéro donne l'ordre)
    ├── chapitre.json                titre, description, source
    ├── cours.md                     résumé du cours
    ├── quiz.json                    questions à choix multiples
    └── exercices/
        └── 04-tarif/                un exercice (le numéro donne l'ordre)
            ├── exercice.json        titre, difficulté, type, indices
            ├── enonce.md            consigne
            ├── depart.rs            code donné à l'élève
            ├── solution.rs          correction
            ├── tests.rs             tests (type « tests »)
            ├── sortie.txt           sortie attendue (type « sortie »)
            └── entree.txt           facultatif : texte envoyé au programme (input(), scanf…)
```

Les noms de dossiers : minuscules, chiffres et tirets uniquement (`04-tarif`, pas `04_Tarif`).

### `chapitre.json`

```json
{
  "titre": "Premiers pas",
  "description": "Cargo, fonctions, types numériques, match, mutabilité.",
  "source": "cours"
}
```

`source` vaut `"cours"` (vu en cours à l'ESGI) ou `"fondamentaux"` (pas encore vu en cours).

### `cours.md`

Du Markdown classique. Les encarts façon Obsidian sont reconnus :

```markdown
> [!tip] Astuce
> Texte de l'astuce.

> [!warning] Piège
> Texte du piège.

> [!info] À savoir
> Texte.
```

Chaque bloc de code du langage du chapitre a un bouton « Essayer » qui l'ouvre dans un éditeur et le lance :

- ` ```rust ` : s'il n'a pas de `fn main`, il est placé dans un `fn main() { … }`.
- ` ```python ` : lancé tel quel.
- ` ```c ` : bouton seulement si le bloc contient un `int main(` (programme complet).

Les autres blocs (` ```text `, ` ```bash `) restent de simples textes. Pas de formules `$…$` dans les cours de code.

### `quiz.json`

```json
[
  {
    "question": "Que renvoie `x + 1;` (avec le point-virgule) ?",
    "choix": ["x + 1", "()", "Une erreur", "Rien du tout"],
    "reponse": 1,
    "explication": "Le `;` transforme l'expression en instruction, qui vaut `()`."
  }
]
```

`reponse` est la position de la bonne réponse dans `choix` (on compte à partir de 0). Le Markdown en ligne (`code`, **gras**) marche dans les questions et les choix.

### `exercice.json`

```json
{
  "titre": "Le tarif du cinéma",
  "difficulte": 1,
  "type": "tests",
  "indices": ["Premier indice", "Deuxième indice, plus précis"]
}
```

- `difficulte` : 1 (facile), 2 (moyen), 3 (difficile).
- `type` :
  - `"tests"` : la plateforme ajoute `tests.<ext>` au code de l'élève et lance les tests.
  - `"sortie"` : la plateforme lance le programme (avec `entree.txt` comme entrée s'il existe) et compare ce qui est affiché avec `sortie.txt`.
- `indices` : affichés un par un, du plus vague au plus précis.

### Les fichiers de code (tous les langages)

- `depart.<ext>` est le code donné à l'élève : les fonctions à écrire sont vides (`todo!()` en Rust, `pass` ou `raise NotImplementedError` en Python, valeur bidon en C), ou le code contient l'erreur à corriger.
- `solution.<ext>` doit réussir **sans aucun avertissement**.
- Uniquement la bibliothèque standard.
- Le programme est arrêté au bout de 10 secondes.
- Le vérificateur contrôle que la solution réussit et que le départ **ne** réussit **pas**.

### Rust

- `depart.rs` et `solution.rs` contiennent **toujours** une fonction `main` (le bouton « Exécuter » la lance).
- Compilation : un projet cargo (édition 2024, `dead_code` autorisé), vérifié par `cargo clippy` (aucun conseil de clippy dans la solution) puis construit en mode debug (un débordement d'entier provoque une panique).
- `tests.rs` :

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn enfant() {
        assert_eq!(tarif(8), 5, "un enfant de 8 ans paie 5 €");
    }
}
```

Mettre un message en français dans chaque `assert` : c'est ce que l'élève verra quand le test échoue.

### Python

- Lancé avec Python 3 (3.8 minimum), en UTF-8. Écrire du code compatible 3.8 (pas de `match`, pas de `list[int]` dans les annotations).
- Le code qui affiche ou lit quelque chose se met sous `if __name__ == "__main__":` : pour les tests, le code de l'élève est **importé** (`from exercice import *`), et ce bloc n'est alors pas exécuté.
- Une erreur de syntaxe est signalée avant de lancer le programme.
- `tests.py` : des fonctions `test_…` sans argument, avec un message en français dans chaque `assert`. Elles sont lancées une par une ; une exception est comptée comme un échec. Les noms qui commencent par `_` ne sont pas importés depuis le code de l'élève.

```python
def test_enfant():
    assert tarif(8) == 5, "un enfant de 8 ans paie 5 €"


def test_adulte():
    assert tarif(30) == 10, "un adulte paie 10 €"
```

### C

- Compilé par `gcc -std=c17 -Wall -Wextra -O0 … -lm` : la solution ne doit produire **aucun avertissement**.
- `depart.c` et `solution.c` contiennent **toujours** `int main(void)` (le bouton « Exécuter » le lance) et leurs propres `#include`.
- Pour les tests, le `main` de l'élève est renommé, puis `tests.c` est ajouté à la fin du même fichier : il a donc accès à toutes les fonctions et structures de l'élève. Il contient son propre `int main(void)` qui utilise deux macros fournies :
  - `VERIFIER(condition, "message")` : compte une vérification réussie ou ratée (le message est affiché dans les deux cas).
  - `VERIFIER_SANS_FUITE()` : vérifie que chaque `malloc` / `calloc` a eu son `free` depuis le début du programme (les appels sont comptés, dans le code de l'élève comme dans les tests). À placer après avoir libéré toutes les listes.
  - `return BILAN();` à la fin du `main`.
- `-Wno-unused-parameter` : un paramètre pas encore utilisé dans le code de départ ne produit pas d'avertissement.
- Une erreur de segmentation, un débordement de pile ou une division par zéro sont expliqués à l'élève.

```c
int main(void) {
    Cell *liste = NULL;
    VERIFIER(somme(liste) == 0, "la somme d'une liste vide vaut 0");
    ajouter_debut(&liste, 4);
    VERIFIER(somme(liste) == 4, "après avoir ajouté 4, la somme vaut 4");
    liberer(liste);
    return BILAN();
}
```

### `sortie.txt`

Le texte exact attendu. Les espaces en fin de ligne et les lignes vides au début ou à la fin sont ignorés.

### Vérifier son contenu

```bash
npm run sommaire                          # met à jour la liste des exercices (les trois langages)
npm run verifier-contenu -- python        # tout le contenu Python
npm run verifier-contenu -- c/01          # seulement les chapitres C qui commencent par 01
```

Pour chaque exercice, le script vérifie que les fichiers sont bien formés, que la solution réussit (sans avertissement) et que le code de départ **ne** réussit **pas**.

## Domaines à réponses (maths, combinatoire, anglais, électif)

Ils ont tous **le même format**. Les exemples sont pris dans les maths (`contenu/maths/`). Après une modification, lance `npm run verifier-contenu -- maths` (ou `-- maths/02` pour un seul chapitre, `-- anglais`, `-- combinatoire`…).

Les formules (`$…$`, KaTeX) sont actives pour `maths` et `combinatoire`, **désactivées** pour `anglais` et `electif` (un `$` y reste un simple dollar : « $500 »).

| Domaine | Identifiant de la matière |
|---|---|
| `maths` | `informatique`, `big-data` |
| `combinatoire` | `combinatoire` |
| `anglais` | `anglais` |
| `electif` | `electif` |

### Arborescence

```
contenu/<domaine>/
├── programme.json                   matières et ordre des chapitres
└── 01-ensembles-et-logique/
    ├── chapitre.json                titre, description, matières
    ├── cours.md                     résumé du cours (Markdown + formules)
    ├── quiz.json                    questions à choix multiples
    └── exercices.json               liste des exercices
```

Un nouveau chapitre doit être ajouté dans la liste `chapitres` de `programme.json`. Les identifiants contiennent uniquement des minuscules, des chiffres et des tirets.

### `programme.json`

```json
{
  "matieres": [
    { "id": "informatique", "titre": "Maths pour l'informatique" },
    { "id": "big-data", "titre": "Maths pour le big data" }
  ],
  "chapitres": ["01-ensembles-et-logique", "02-quantificateurs-et-sommes"]
}
```

### `chapitre.json`

```json
{
  "titre": "Ensembles et logique",
  "description": "Opérations sur les ensembles, relations, logique et méthodes de preuve.",
  "source": "Séance 1",
  "matieres": ["informatique"]
}
```

`source` est le nom de la séance ou du cours d'origine. `matieres` liste les matières concernées (un chapitre peut être dans les deux).

### Les formules (maths et combinatoire)

- En ligne : `$x^2 + 1$`. En bloc : `$$\int_a^b f(x)\,dx$$`.
- Écriture LaTeX, affichée avec KaTeX.
- **Dans les fichiers JSON, chaque `\` doit être doublé** : `"$\\frac{1}{2}$"`, `"$\\neq$"`, `"$\\times$"`. Un `\n`, `\t` ou `\f` oublié casse la formule (le vérificateur le détecte).
- Ne pas utiliser `$` pour autre chose qu'une formule. Pour écrire le symbole dollar : `\$`.

### `cours.md`

Markdown classique + formules. Encarts façon Obsidian : `> [!tip] Titre`, `> [!warning] Titre`, `> [!info] Titre`.

### `quiz.json`

```json
[
  {
    "question": "Que vaut $\\ln(e^3)$ ?",
    "choix": ["$3$", "$e^3$", "$\\ln 3$", "$1$"],
    "reponse": 0,
    "explication": "$\\ln$ et $\\exp$ sont réciproques : $\\ln(e^x) = x$."
  }
]
```

`reponse` est la position de la bonne réponse dans `choix` (on compte à partir de 0). Les choix sont mélangés à l'affichage.

### `exercices.json`

Une liste d'exercices. Chaque exercice a un énoncé commun et une ou plusieurs questions.

```json
[
  {
    "id": "operations-ensembles",
    "titre": "Opérations sur des ensembles",
    "difficulte": 1,
    "enonce": "Soit $A = \\{1, 2, 3, 4\\}$ et $B = \\{3, 4, 5, 6\\}$.",
    "questions": [
      { "intitule": "$A \\cup B$", "type": "ensemble", "reponse": [1, 2, 3, 4, 5, 6] },
      { "intitule": "$A \\cap B$", "type": "ensemble", "reponse": [3, 4] }
    ],
    "indices": ["L'union prend les éléments qui sont dans A **ou** dans B."],
    "correction": "$A \\cup B = \\{1, \\dots, 6\\}$ et $A \\cap B = \\{3, 4\\}$."
  }
]
```

- `difficulte` : 1 (facile), 2 (moyen), 3 (difficile).
- `indices` : affichés un par un, du plus vague au plus précis.
- `correction` : la correction détaillée (Markdown + formules), visible en dernier recours.
- L'exercice est réussi quand **toutes** ses questions sont justes.

### Les types de question

| Type | L'élève écrit | `reponse` | Options |
|---|---|---|---|
| `nombre` | `12`, `2.5`, `1/3`, `ln(2)`, `e^2` | un nombre ou une expression sans variable : `10`, `"ln(2)"`, `"(1+ln(7))/2"` | `tolerance` : écart accepté (par défaut 0.000001). Mettre `0.01` si on demande un arrondi au centième |
| `expression` | `15x^2 - 4x + 1`, `6x e^(3x^2)` | une expression : `"15x^2-4x+1"` | `variable` (par défaut `x`), `points` (valeurs de test), `aUneConstantePres: true` pour une primitive |
| `ensemble` | `{1, 2, 3}` (ordre libre) | une liste : `[1, 2, 3]` ou `["a", "b"]`, `[]` pour l'ensemble vide | |
| `vecteur` | `(2, 3, -5)` (ordre important) | une liste : `[2, 3, -5]` | |
| `choix` | clique sur une option | l'indice de la bonne option | `choix` : la liste des options |
| `texte` | un mot court | la liste des réponses acceptées : `["INTERSECT"]` | majuscules, accents et espaces ignorés |
| `auto` | texte libre (preuve, requête SQL, rédaction) | la réponse modèle (Markdown) | l'élève compare et dit s'il avait bon |

Une expression est comparée en calculant les deux versions en plusieurs points : toutes les écritures équivalentes sont acceptées (`x(15x-4)+1` = `15x^2-4x+1`). Avec `aUneConstantePres`, `2x^3 + 5` est accepté pour une primitive `2x^3`.

Par défaut, les points de test sont positifs (`0.37` à `3.61`), donc `ln(x)` marche. Avec `"variable": "n"` ou `"k"`, ce sont des entiers (1 à 10).

Écriture des expressions : `*` facultatif (`3x`, `2(x+1)`), puissance `^`, fonctions `sqrt`, `ln`, `log` (base 10), `log2`, `exp`, `sin`, `cos`, `tan`, `abs`, constantes `e` et `pi`, factorielle `5!`. Pour une liste, on sépare par des virgules (point pour les décimales) ou par des points-virgules.

#### Tester ses questions

Chaque question peut avoir `acceptes` et `refuses` : des réponses d'élève qui doivent être acceptées ou refusées. Le vérificateur les contrôle.

```json
{
  "intitule": "$f'(x)$",
  "type": "expression",
  "reponse": "15x^2-4x+1",
  "acceptes": ["1 - 4x + 15x^2", "x(15x-4)+1"],
  "refuses": ["15x^2-4x", "5x^3-2x^2+x"]
}
```
