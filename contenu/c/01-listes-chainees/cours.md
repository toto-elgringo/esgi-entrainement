# Listes chaînées

## 1. L'idée

Une **liste chaînée** est une autre façon de ranger une suite de valeurs, à côté du tableau. Comme un tableau, c'est un **conteneur séquentiel** : les valeurs ont un ordre (une première, une suivante... une dernière) et on les repère par leur position.

La grande différence est dans la mémoire :

| | Tableau | Liste chaînée |
|---|---|---|
| Place en mémoire | cases **collées** les unes aux autres | éléments **éparpillés** n'importe où |
| Trouver l'élément suivant | il est juste à côté | on suit un **pointeur** |

Puisque les valeurs sont dispersées, chacune emporte avec elle **l'adresse de la suivante**. Les valeurs forment ainsi une **chaîne**.

> [!info] Le maillon
> Chaque élément de la chaîne s'appelle un **maillon** (en anglais *node* ou *cell*). Il contient deux choses : **une valeur** et **un pointeur vers le maillon suivant**.

### En mémoire, pour de vrai

Quatre valeurs rangées dans le désordre (les adresses sont inventées pour l'exemple) :

| Adresse | Valeur | `next` (adresse du suivant) |
|---|---|---|
| `0x100` | 40 | `NULL` |
| `0x200` | 20 | `0x400` |
| `0x300` | 10 | `0x200` |
| `0x400` | 30 | `0x100` |

Une seule variable, `start`, garde l'adresse du **premier** maillon : `0x300`. En suivant les `next` à partir de là : 10, puis 20, puis 30, puis 40, puis `NULL` (fin).

### Comment on la dessine

On dessine les maillons dans l'ordre de la chaîne, même si ce n'est pas leur ordre en mémoire :

```text
start --> [10|*] --> [20|*] --> [30|*] --> [40|*] --> NULL
```

`[10|*]` est un maillon : sa valeur à gauche, son pointeur `next` à droite. Le dernier maillon a `next = NULL` : il n'y a rien après.

> [!info] La liste vide
> Une liste vide, c'est simplement `start == NULL` : aucun maillon.

## 2. Représentation en C

```c
typedef struct cell {
    int value;
    struct cell *next;
} Cell;
```

| Code | Sens |
|---|---|
| `int value;` | la valeur portée par le maillon |
| `struct cell *next;` | l'adresse du maillon suivant (`NULL` pour le dernier) |
| `typedef ... Cell;` | le nom court du type : `Cell` |

On manipule les maillons à travers des **pointeurs** (`Cell *`) et la flèche : `cur->value`, `cur->next`.

> [!warning] Dans le pseudo-code du cours
> Les algorithmes écrivent `Cell start` ou `Cell cur`. En C, ce sont des **pointeurs** : `Cell *start`, `Cell *cur`.

> [!tip] Pourquoi un pointeur dans le maillon ?
> Un maillon qui contiendrait un maillon entier contiendrait lui-même un maillon... à l'infini. Un pointeur, lui, a une taille fixe : 8 octets sur une machine 64 bits. Un `Cell` occupe en général 16 octets (l'`int`, un peu de remplissage, le pointeur), contre 4 pour une case `int` de tableau.

### Créer un maillon

Chaque maillon est réservé sur le tas avec `malloc` :

```c
Cell *creerCell(int valeur) {
    Cell *c = malloc(sizeof(Cell));
    if (c == NULL) {
        exit(EXIT_FAILURE);
    }
    c->value = valeur;
    c->next = NULL;
    return c;
}
```

On met `next` à `NULL` tout de suite : `malloc` ne remplit pas la mémoire, et un `next` laissé au hasard ferait partir le programme n'importe où.

## 3. Parcourir une liste

**Parcourir**, c'est passer sur chaque maillon, du premier au dernier. On ne touche **jamais** à `start` : on avance un second pointeur, `cur` (le maillon *courant*).

```text
Algo : Parcours
Entrée : Cell start

Cell cur = start
Tant que cur est différent de null :
    // utiliser cur.value
    cur = cur.next
```

Les étapes sur la liste `0 -> 1 -> 2` :

```text
1)  start --> [0|*] --> [1|*] --> [2|*] --> NULL
               ^
              cur

2)  start --> [0|*] --> [1|*] --> [2|*] --> NULL
                         ^
                        cur

3)  start --> [0|*] --> [1|*] --> [2|*] --> NULL
                                   ^
                                  cur

4)  start --> [0|*] --> [1|*] --> [2|*] --> NULL
                                             ^
                                            cur  (NULL : on s'arrête)
```

### Exemple : la somme

```c
int somme(Cell *start) {
    Cell *cur = start;
    int resultat = 0;
    while (cur != NULL) {
        resultat += cur->value;
        cur = cur->next;
    }
    return resultat;
}
```

| Tour | `cur` sur | `resultat` |
|---|---|---|
| 1 | 0 | 0 |
| 2 | 1 | 1 |
| 3 | 2 | 3 |
| fin | `NULL` | renvoie 3 |

Sur une liste vide, on n'entre jamais dans la boucle : la somme vaut 0. Le même squelette sert à **compter** les maillons (la taille) ou à **afficher** la liste.

**Complexité** : chaque maillon est visité une fois, donc **O(N)** pour N maillons.

### Version récursive

Une liste, c'est **un premier maillon suivi d'une liste plus courte** (le reste). On peut donc traiter le premier maillon, puis laisser la fonction s'appeler elle-même sur le reste.

```text
Algo : ParcoursRec
Entrée : Cell c

Si c vaut null :
    Quitter               // cas d'arrêt : liste vide
// utiliser c.value
ParcoursRec(c.next)       // traiter le reste
```

```c
int sommeRec(Cell *c) {
    if (c == NULL) {
        return 0;
    }
    return c->value + sommeRec(c->next);
}
```

```text
sommeRec(0 -> 1 -> 2) = 0 + sommeRec(1 -> 2)
                      = 0 + 1 + sommeRec(2)
                      = 0 + 1 + 2 + sommeRec(NULL)
                      = 0 + 1 + 2 + 0 = 3
```

| | Boucle `while` | Récursif |
|---|---|---|
| Temps | O(N) | O(N) |
| Mémoire en plus | presque rien | un appel en attente par maillon : O(N) |
| Liste d'un million de maillons | aucun souci | risque de **débordement de pile** |

> [!warning] Le cas d'arrêt d'abord
> Une fonction récursive sur une liste commence **toujours** par le cas `c == NULL`. Sans lui, on finit par lire `c->value` sur `NULL` : erreur de segmentation.

## 4. Insérer en début de liste

Ajouter une valeur **devant** le premier maillon ne demande aucun parcours.

```text
Algo : InsertionDebut
Entrée : Cell start, Entier valeur

Cell nouveau = creerCell(valeur)
nouveau.next = start      // le nouveau maillon pointe sur l'ancien premier
start = nouveau           // le nouveau maillon devient le premier
```

Les étapes (on ajoute 3 devant `0 -> 1 -> 2`) :

```text
1) Création du maillon, relié à rien.

   start   --> [0|*] --> [1|*] --> [2|*] --> NULL
   nouveau --> [3| ]

2) nouveau.next = start

   start   --> [0|*] --> [1|*] --> [2|*] --> NULL
                ^
   nouveau --> [3|*]

3) start = nouveau

   start --> [3|*] --> [0|*] --> [1|*] --> [2|*] --> NULL
```

**Complexité** : trois instructions quelle que soit la longueur de la liste : **O(1)**.

> [!warning] L'ordre des deux dernières lignes compte
> Si on écrit `start = nouveau` **avant** `nouveau->next = start`, le nouveau maillon pointe sur **lui-même** et l'ancienne liste est perdue (plus personne ne connaît son adresse). Règle : **accrocher d'abord**, **déplacer la tête ensuite**.

### En C : le piège de la copie

Une fonction C reçoit une **copie** de `start`. Écrire `start = nouveau;` dans la fonction ne modifie que cette copie : le `start` de l'appelant ne bouge pas. Deux solutions.

**Renvoyer le nouveau début** :

```c
Cell *insererDebut(Cell *start, int valeur) {
    Cell *nouveau = creerCell(valeur);
    nouveau->next = start;
    return nouveau;
}
```

Appel : `start = insererDebut(start, 3);` (sans le `start =`, le maillon est créé mais perdu).

**Passer l'adresse de `start`** (un pointeur de pointeur, `Cell **`) :

```c
void insererDebutPtr(Cell **start, int valeur) {
    Cell *nouveau = creerCell(valeur);
    nouveau->next = *start;
    *start = nouveau;
}
```

Appel : `insererDebutPtr(&start, 3);`

| Écriture | Sens |
|---|---|
| `Cell **start` | l'adresse de la variable qui contient l'adresse du premier maillon |
| `*start` | cette variable elle-même : on peut la changer |
| `&start` | côté appelant : l'adresse de la variable `start` |

## 5. Tableau ou liste chaînée ?

| Opération | Tableau | Liste chaînée |
|---|---|---|
| Accès à la position i (« accès aléatoire ») | O(1) | O(N) |
| Insertion en début | O(N) | O(1) |
| Suppression en début | O(N) | O(1) |
| Recherche d'une valeur | O(log N) si trié, O(N) sinon | O(N) |

- **Accès à la position i** : un tableau calcule directement l'adresse de `t[i]`. Une liste doit suivre i flèches depuis `start`. « Aléatoire » veut dire « n'importe quelle position », pas « au hasard ».
- **Insertion / suppression en début** : le tableau doit **décaler toutes ses cases** ; la liste change seulement un ou deux pointeurs.
- **Recherche** : la recherche par dichotomie (couper en deux à chaque étape) a besoin de sauter au milieu d'un coup. C'est impossible sur une liste, même triée : on regarde les maillons un par un.

> [!tip] Comment choisir
> Beaucoup d'accès par position : **tableau**. Beaucoup d'ajouts et de retraits, surtout au début, et une taille qui change tout le temps : **liste chaînée**.

## 6. Programme complet

Ce programme construit une liste, l'affiche, calcule sa taille et sa somme, puis rend toute la mémoire (la libération est détaillée au chapitre suivant).

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct cell {
    int value;
    struct cell *next;
} Cell;

Cell *creerCell(int valeur) {
    Cell *c = malloc(sizeof(Cell));
    if (c == NULL) {
        exit(EXIT_FAILURE);
    }
    c->value = valeur;
    c->next = NULL;
    return c;
}

Cell *insererDebut(Cell *start, int valeur) {
    Cell *nouveau = creerCell(valeur);
    nouveau->next = start;
    return nouveau;
}

void afficherListe(Cell *start) {
    Cell *cur = start;
    while (cur != NULL) {
        printf("%d -> ", cur->value);
        cur = cur->next;
    }
    printf("NULL\n");
}

int taille(Cell *start) {
    int n = 0;
    Cell *cur = start;
    while (cur != NULL) {
        n++;
        cur = cur->next;
    }
    return n;
}

int sommeRec(Cell *c) {
    if (c == NULL) {
        return 0;
    }
    return c->value + sommeRec(c->next);
}

void libererListe(Cell *start) {
    while (start != NULL) {
        Cell *suivant = start->next;
        free(start);
        start = suivant;
    }
}

int main(void) {
    Cell *start = NULL;
    afficherListe(start);
    start = insererDebut(start, 2);
    start = insererDebut(start, 1);
    start = insererDebut(start, 0);
    afficherListe(start);
    printf("taille = %d, somme = %d\n", taille(start), sommeRec(start));
    libererListe(start);
    start = NULL;
    return 0;
}
```

Remarque : en insérant 2, puis 1, puis 0 **en début**, on obtient `0 -> 1 -> 2` : l'ordre est inversé par rapport à l'ordre des appels.

> [!info] Un `malloc` par maillon, un `free` par maillon
> Les tests des exercices comptent les `malloc` et les `free` : un maillon créé puis perdu (fuite mémoire) fait échouer la vérification « toute la mémoire allouée a été libérée ».

## 7. Pièges

> [!warning] Perdre la tête
> Ne jamais avancer `start` pour parcourir : on perd l'accès au début. On utilise un pointeur à part (`cur`).

> [!warning] Suivre `NULL`
> `cur->value` ou `cur->next` avec `cur == NULL` provoque une erreur de segmentation. Vérifier `cur != NULL` avant, et penser à la liste vide.

> [!warning] `next` non initialisé
> Un maillon réservé avec `malloc` sans mettre `next = NULL` peut faire partir le parcours dans une zone mémoire au hasard.

> [!warning] Oublier le `start =`
> `insererDebut(start, 3);` tout seul crée un maillon que plus personne ne connaît (fuite mémoire). C'est `start = insererDebut(start, 3);`.

## À retenir

- Liste chaînée = maillons éparpillés en mémoire ; chaque maillon = **valeur + `next`**.
- `start` pointe sur le premier maillon, le dernier a `next = NULL`, la liste vide est `start == NULL`.
- Parcours : `cur = start`, puis `cur = cur->next` tant que `cur != NULL`. O(N). Version récursive : cas d'arrêt `c == NULL`.
- Insertion en début : créer, `nouveau->next = start`, puis `start = nouveau`. O(1), et l'ordre compte.
- Pour changer `start` dans une fonction : **renvoyer** le nouveau début ou passer **`Cell **`**.
- Tableau : accès par position O(1). Liste : insertion et suppression en début O(1), accès et recherche O(N).
