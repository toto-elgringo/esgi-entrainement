# Rappels : pointeurs et mémoire

Les listes chaînées reposent sur trois outils du C : les **pointeurs**, les **structures** (`struct`) et la **mémoire dynamique** (`malloc` / `free`). Ce chapitre les remet à plat avant de s'en servir.

## 1. Adresses et pointeurs

Chaque variable est rangée quelque part dans la mémoire, à une **adresse** (un numéro de case). Un **pointeur** est une variable qui contient une adresse.

```c
int n = 42;
int *p = &n;
*p = 50;
```

| Écriture | Sens |
|---|---|
| `int *p` | `p` est un pointeur vers un `int` (il contient une adresse) |
| `&n` | l'adresse de la variable `n` |
| `*p` | la variable qui se trouve à l'adresse contenue dans `p` (ici `n`) |

Après `*p = 50;`, c'est bien `n` qui vaut 50 : on a écrit **à travers** le pointeur.

```text
   n                     p
+------+              +---------+
|  50  |  <---------- | adr. n  |
+------+              +---------+
```

> [!info] `int *p` ou `int* p` ?
> C'est la même chose. On voit les deux écritures (la fiche du cours écrit `Cell* start`, ce site écrit `Cell *start`).

> [!warning] Deux sens pour l'étoile
> Dans une **déclaration** (`int *p`), l'étoile dit « p est un pointeur ». Dans une **instruction** (`*p = 50`), elle veut dire « va à l'adresse contenue dans p ».

## 2. Modifier une variable depuis une fonction

En C, une fonction reçoit toujours une **copie** de ses paramètres (on dit qu'ils sont passés **par valeur**). Modifier la copie ne change rien chez l'appelant.

Pour qu'une fonction modifie une variable de l'appelant, on lui donne **l'adresse** de cette variable (passage **par adresse**) :

```c
#include <stdio.h>

void plusUnCopie(int x) {
    x = x + 1;
}

void plusUnAdresse(int *x) {
    *x = *x + 1;
}

int main(void) {
    int n = 5;
    plusUnCopie(n);
    printf("après plusUnCopie : %d\n", n);
    plusUnAdresse(&n);
    printf("après plusUnAdresse : %d\n", n);
    return 0;
}
```

La première fonction ne change rien (elle travaille sur une copie), la seconde fait passer `n` à 6.

> [!tip] Renvoyer plusieurs résultats
> Une fonction C ne renvoie qu'une valeur avec `return`. Pour en « renvoyer » plusieurs, on passe des adresses où la fonction écrira ses résultats : `void diviser(int a, int b, int *quotient, int *reste)`.

## 3. `NULL` : le pointeur qui ne pointe sur rien

`NULL` est une adresse spéciale qui veut dire « aucune case ». On s'en sert pour dire « pas encore de valeur », « pas trouvé » ou « fin de la liste ».

> [!warning] Ne jamais suivre `NULL`
> `*p` quand `p` vaut `NULL` fait planter le programme (**erreur de segmentation** : accès à une zone mémoire interdite). Avant de suivre un pointeur qui **peut** être `NULL`, on teste `if (p != NULL)`.

## 4. Les structures

Une **structure** regroupe plusieurs valeurs (les **champs**) sous un même nom.

```c
typedef struct {
    int x;
    int y;
} Point;

Point a = {3, 4};
a.x = 10;
```

`typedef` donne un nom court au type : on écrit `Point` au lieu de `struct ...`.

### Le point ou la flèche

| On a | On écrit | Exemple |
|---|---|---|
| une structure | `.` | `a.x` |
| un **pointeur** vers une structure | `->` | `p->x` |

`p->x` est un raccourci pour `(*p).x` : « va à la structure pointée par `p` et prends son champ `x` ».

```c
void deplacer(Point *p, int dx, int dy) {
    p->x = p->x + dx;
    p->y = p->y + dy;
}
```

Appel : `deplacer(&a, 1, 2);` (on passe l'adresse de `a` pour pouvoir la modifier).

### Une structure qui désigne une autre structure du même type

C'est la base des listes chaînées :

```c
typedef struct cell {
    int value;
    struct cell *next;
} Cell;
```

Le champ `next` est un **pointeur** vers une autre `struct cell`. Il faut écrire `struct cell` (et pas `Cell`) à l'intérieur, car le nom court `Cell` n'existe qu'après la dernière ligne.

## 5. La mémoire dynamique : `malloc` et `free`

Les variables locales d'une fonction vivent sur la **pile** : elles disparaissent quand la fonction se termine. Pour créer quelque chose qui **survit** à la fonction (comme un maillon de liste), on réserve de la mémoire sur le **tas** avec `malloc` (il faut `#include <stdlib.h>`).

```c
Point *p = malloc(sizeof(Point));
if (p == NULL) {
    exit(EXIT_FAILURE);
}
p->x = 1;
p->y = 2;
free(p);
p = NULL;
```

| Étape | Rôle |
|---|---|
| `malloc(sizeof(Point))` | réserve la place d'un `Point` et renvoie son adresse |
| `if (p == NULL)` | `malloc` renvoie `NULL` s'il n'y a plus de mémoire |
| `free(p)` | rend la mémoire : on ne doit plus jamais l'utiliser ensuite |
| `p = NULL` | évite de réutiliser par erreur une adresse rendue |

Pour un tableau de `n` entiers : `int *t = malloc(n * sizeof(int));`, puis on l'utilise comme un tableau normal (`t[0]`, `t[1]`...).

> [!warning] Les 4 erreurs classiques
> - **Fuite mémoire** : oublier `free`. La mémoire reste réservée pour rien jusqu'à la fin du programme.
> - **Utilisation après `free`** : lire ou écrire dans une zone déjà rendue. Comportement imprévisible.
> - **Double `free`** : libérer deux fois la même adresse. Plantage fréquent.
> - **Mémoire non initialisée** : `malloc` ne met pas la mémoire à zéro. Un champ qu'on n'a pas rempli contient n'importe quoi.

> [!tip] Une règle simple
> Chaque `malloc` doit avoir **exactement un** `free`, au moment où on n'a plus besoin de la donnée.

> [!info] Les fuites sont vérifiées
> Dans les exercices, la plateforme compte chaque `malloc`, `calloc` et `free` pendant les tests. S'il reste de la mémoire réservée à la fin, la vérification « toute la mémoire allouée a été libérée » échoue : une fuite mémoire fait donc rater l'exercice, même si les valeurs sont justes.

## 6. Programme complet

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int x;
    int y;
} Point;

Point *creerPoint(int x, int y) {
    Point *p = malloc(sizeof(Point));
    if (p == NULL) {
        exit(EXIT_FAILURE);
    }
    p->x = x;
    p->y = y;
    return p;
}

void deplacer(Point *p, int dx, int dy) {
    p->x = p->x + dx;
    p->y = p->y + dy;
}

int main(void) {
    Point *a = creerPoint(3, 4);
    deplacer(a, 1, -2);
    printf("a = (%d, %d)\n", a->x, a->y);
    free(a);
    a = NULL;
    return 0;
}
```

Ici `a` est déjà un pointeur (renvoyé par `creerPoint`) : on le passe directement à `deplacer`, sans `&`.

## À retenir

- `&x` = adresse de `x` ; `*p` = la variable pointée par `p`.
- Les paramètres sont **copiés** : pour modifier une variable de l'appelant, on passe son **adresse**.
- `NULL` = « pointe sur rien ». Ne jamais faire `p->...` si `p` peut valoir `NULL`.
- Structure : `.` sur une structure, `->` sur un pointeur vers une structure.
- `malloc` réserve sur le tas (vérifier `NULL`), `free` rend. Un `malloc`, un `free`.
