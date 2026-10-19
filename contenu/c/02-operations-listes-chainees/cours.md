# Opérations sur les listes chaînées

Le chapitre précédent a posé la structure, le parcours et l'insertion en début. Voici les autres opérations classiques. Tous les exemples utilisent :

```c
typedef struct cell {
    int value;
    struct cell *next;
} Cell;
```

Dans les schémas, `[v|*]` est un maillon de valeur `v` et `-->` un pointeur `next`.

> [!info] `Cell *` ou `Cell **` ?
> Une fonction qui peut **changer le premier maillon** (supprimer en début, insérer dans une liste vide...) doit recevoir `Cell **start`, l'adresse de la variable de l'appelant. Une fonction qui se contente de **lire** la liste, ou de modifier des maillons **après** le premier, peut recevoir un simple `Cell *`.

## 1. Variantes du parcours : chercher, compter, maximum

Beaucoup d'opérations ne sont qu'un parcours avec un traitement différent à chaque maillon.

### Rechercher une valeur

```c
Cell *rechercher(Cell *start, int valeur) {
    Cell *cur = start;
    while (cur != NULL) {
        if (cur->value == valeur) {
            return cur;
        }
        cur = cur->next;
    }
    return NULL;
}
```

On renvoie le **maillon** trouvé (utile pour le modifier ou insérer après lui), ou `NULL` si la valeur est absente. On s'arrête dès qu'on trouve.

**Complexité** : O(N) au pire. C'est une recherche **linéaire** : même triée, une liste ne permet pas la dichotomie.

### Compter, chercher le maximum

- **Compter** les maillons qui valent `x` : un compteur qui augmente quand `cur->value == x`.
- **Maximum** : on part de la valeur du **premier** maillon (pas de 0, sinon une liste de nombres négatifs donnerait 0), puis on garde la plus grande valeur vue.

> [!warning] Liste vide
> Le maximum d'une liste vide n'existe pas. Soit on interdit ce cas (et on le dit dans la documentation de la fonction), soit on renvoie un code à part.

## 2. Accéder au i-ème maillon

```c
Cell *obtenirElement(Cell *start, int position) {
    Cell *cur = start;
    int i = 0;
    while (cur != NULL && i < position) {
        cur = cur->next;
        i++;
    }
    return cur;
}
```

La position 0 est le premier maillon. Si la position dépasse la fin, `cur` devient `NULL` et on renvoie `NULL`.

**Complexité** : O(N). C'est le point faible de la liste face au tableau (`t[i]` en O(1)).

> [!warning] Pas dans une boucle
> `for (i = 0; i < n; i++) obtenirElement(start, i)` repart du début à chaque tour : O(N²) au total. Pour tout visiter, un seul parcours avec `cur` suffit.

## 3. Supprimer le premier maillon

```text
1) ancien = *start

   start  --> [0|*] --> [1|*] --> [2|*] --> NULL
               ^
   ancien -----+

2) *start = ancien->next

   ancien --> [0|*] --> [1|*] --> [2|*] --> NULL
                         ^
   start ----------------+

3) free(ancien)

   start --> [1|*] --> [2|*] --> NULL
```

```c
void supprimerDebut(Cell **start) {
    if (*start == NULL) {
        return;
    }
    Cell *ancien = *start;
    *start = ancien->next;
    free(ancien);
}
```

**Complexité** : O(1) (un tableau devrait décaler toutes ses cases : O(N)).

> [!warning] Sauvegarder avant `free`
> Après `free(ancien)`, lire `ancien->next` est interdit. On récupère le suivant **avant** de libérer.

> [!warning] Retirer sans libérer = fuite
> `*start = (*start)->next;` tout seul retire bien le maillon de la liste, mais il reste réservé en mémoire sans que personne ne connaisse son adresse.

## 4. Insérer en fin de liste

On avance jusqu'au **dernier** maillon (celui dont `next` vaut `NULL`), puis on accroche le nouveau derrière.

```text
1) cur s'arrête SUR le dernier maillon

   start --> [0|*] --> [1|*] --> [2|*] --> NULL
                                  ^
                                 cur

2) cur->next = nouveau

   start --> [0|*] --> [1|*] --> [2|*] --> [5|*] --> NULL
```

```c
void insererFin(Cell **start, int valeur) {
    Cell *nouveau = creerCell(valeur);
    if (*start == NULL) {
        *start = nouveau;
        return;
    }
    Cell *cur = *start;
    while (cur->next != NULL) {
        cur = cur->next;
    }
    cur->next = nouveau;
}
```

Le `Cell **` sert pour la liste vide : le nouveau maillon devient alors le premier.

**Complexité** : O(N), à cause de la marche jusqu'au bout.

> [!warning] `cur->next != NULL` et pas `cur != NULL`
> On veut s'arrêter **sur** le dernier maillon pour modifier son `next`. Avec `cur != NULL`, on sort de la boucle avec `cur == NULL` : trop tard.

> [!tip] En O(1) avec un pointeur de fin
> En gardant en plus un pointeur `fin` sur le dernier maillon, l'insertion en fin devient `fin->next = nouveau; fin = nouveau;`. C'est ainsi qu'on fait une **file d'attente** (premier arrivé, premier servi) avec une liste chaînée.

## 5. Insérer après un maillon donné

```text
1) nouveau->next = maillon->next

   start --> [1|*] --> [2|*] --> NULL
                        ^
             [4|*] -----+

2) maillon->next = nouveau

   start --> [1|*] --> [4|*] --> [2|*] --> NULL
```

```c
void insererApres(Cell *maillon, int valeur) {
    Cell *nouveau = creerCell(valeur);
    nouveau->next = maillon->next;
    maillon->next = nouveau;
}
```

**Complexité** : O(1) une fois qu'on a le maillon (le trouver coûte O(N)). Même règle qu'en début de liste : **accrocher d'abord** la suite au nouveau maillon, **modifier ensuite** le maillon d'avant.

## 6. Insérer dans une liste triée

Pour garder une liste triée par ordre croissant, on insère la valeur **avant le premier maillon plus grand qu'elle**. Comme pour toute insertion au milieu, il faut le maillon **d'avant**.

```text
Algo : InsertionTriee
Si la liste est vide ou valeur <= premier.value :
    insérer en début
Sinon :
    prev = premier
    Tant que prev.next n'est pas null et prev.next.value < valeur :
        prev = prev.next
    insérer après prev
```

**Complexité** : O(N).

## 7. Supprimer une valeur au milieu

Pour retirer un maillon, il faut modifier le `next` de **celui d'avant**. On avance donc un pointeur `prev` qui regarde un cran plus loin (`prev->next`).

```text
1) prev s'arrête juste avant la cible

   start --> [1|*] --> [4|*] --> [2|*] --> [5|*] --> NULL
                        ^         ^
                       prev     cible

2) prev->next = cible->next  (on saute la cible)

   start --> [1|*] --> [4|*] ----------> [5|*] --> NULL

3) free(cible)
```

```c
void supprimerValeur(Cell **start, int valeur) {
    if (*start == NULL) {
        return;
    }
    if ((*start)->value == valeur) {
        supprimerDebut(start);
        return;
    }
    Cell *prev = *start;
    while (prev->next != NULL && prev->next->value != valeur) {
        prev = prev->next;
    }
    if (prev->next != NULL) {
        Cell *cible = prev->next;
        prev->next = cible->next;
        free(cible);
    }
}
```

Trois cas : liste vide (rien à faire), valeur dans le **premier** maillon (le début change), valeur plus loin (on cherche le précédent). Si la valeur est absente, `prev` arrive au dernier maillon et on ne fait rien.

**Complexité** : O(N).

## 8. Libérer toute la liste

```c
void libererListe(Cell **start) {
    Cell *cur = *start;
    while (cur != NULL) {
        Cell *suivant = cur->next;
        free(cur);
        cur = suivant;
    }
    *start = NULL;
}
```

Avec `Cell **`, la fonction remet aussi la variable de l'appelant à `NULL` : elle ne garde pas une adresse devenue invalide.

> [!warning] Le piège classique
> `free(cur); cur = cur->next;` lit dans un maillon **déjà rendu**. Il faut garder `suivant` **avant** le `free`.

**Complexité** : O(N).

> [!info] La plateforme vérifie les fuites
> Dans les exercices qui créent ou suppriment des maillons, les tests comptent chaque `malloc` et chaque `free`. À la fin, la vérification « toute la mémoire allouée a été libérée » échoue s'il reste un maillon jamais rendu : supprimer un maillon de la liste sans `free`, ou vider la liste en mettant juste `start = NULL`, fait rater l'exercice.

## 9. Inverser une liste

On veut retourner tous les `next` sans créer de maillon. On avance avec trois pointeurs : `prev` (la partie déjà inversée), `cur` (le maillon traité) et `suivant` (le reste, à ne pas perdre).

```text
Au départ : prev = NULL, cur = start

   NULL     [1|*] --> [2|*] --> [3|*] --> NULL
    ^         ^
   prev      cur

Après un tour (cur->next = prev, puis tout le monde avance) :

   NULL <-- [1|*]     [2|*] --> [3|*] --> NULL
              ^         ^
             prev      cur

À la fin : cur vaut NULL et prev est le nouveau premier maillon

   NULL <-- [1|*] <-- [2|*] <-- [3|*]
                                  ^
                                 prev
```

À chaque tour : `suivant = cur->next; cur->next = prev; prev = cur; cur = suivant;`. On renvoie `prev`.

**Complexité** : O(N) en temps, aucune mémoire en plus.

## 10. Afficher à l'envers grâce à la récursivité

Pour afficher `3 2 1` à partir de `1 -> 2 -> 3` sans modifier la liste, on affiche **d'abord le reste**, **puis** le maillon courant :

```c
void afficherEnvers(Cell *c) {
    if (c == NULL) {
        return;
    }
    afficherEnvers(c->next);
    printf("%d ", c->value);
}
```

En échangeant les deux dernières lignes, on obtient l'affichage dans l'ordre normal.

## 11. Récapitulatif

| Opération | Liste chaînée | Tableau |
|---|---|---|
| Parcours, somme, taille, recherche, maximum | O(N) | O(N) |
| Accès au i-ème élément | O(N) | O(1) |
| Insertion / suppression en début | O(1) | O(N) |
| Insertion en fin | O(N), ou O(1) avec un pointeur de fin | O(1) s'il reste de la place |
| Insertion après un maillon connu | O(1) | O(N) |
| Suppression d'une valeur | O(N) | O(N) |
| Inversion | O(N) | O(N) |

## 12. Programme complet

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

void afficherListe(Cell *start) {
    for (Cell *cur = start; cur != NULL; cur = cur->next) {
        printf("%d -> ", cur->value);
    }
    printf("NULL\n");
}

void insererFin(Cell **start, int valeur) {
    Cell *nouveau = creerCell(valeur);
    if (*start == NULL) {
        *start = nouveau;
        return;
    }
    Cell *cur = *start;
    while (cur->next != NULL) {
        cur = cur->next;
    }
    cur->next = nouveau;
}

void supprimerDebut(Cell **start) {
    if (*start == NULL) {
        return;
    }
    Cell *ancien = *start;
    *start = ancien->next;
    free(ancien);
}

void supprimerValeur(Cell **start, int valeur) {
    if (*start == NULL) {
        return;
    }
    if ((*start)->value == valeur) {
        supprimerDebut(start);
        return;
    }
    Cell *prev = *start;
    while (prev->next != NULL && prev->next->value != valeur) {
        prev = prev->next;
    }
    if (prev->next != NULL) {
        Cell *cible = prev->next;
        prev->next = cible->next;
        free(cible);
    }
}

Cell *inverser(Cell *start) {
    Cell *prev = NULL;
    Cell *cur = start;
    while (cur != NULL) {
        Cell *suivant = cur->next;
        cur->next = prev;
        prev = cur;
        cur = suivant;
    }
    return prev;
}

void libererListe(Cell **start) {
    Cell *cur = *start;
    while (cur != NULL) {
        Cell *suivant = cur->next;
        free(cur);
        cur = suivant;
    }
    *start = NULL;
}

int main(void) {
    Cell *liste = NULL;
    for (int i = 1; i <= 5; i++) {
        insererFin(&liste, i * 10);
    }
    afficherListe(liste);
    supprimerDebut(&liste);
    supprimerValeur(&liste, 40);
    afficherListe(liste);
    liste = inverser(liste);
    afficherListe(liste);
    libererListe(&liste);
    afficherListe(liste);
    return 0;
}
```

## À retenir

- Chercher, compter, maximum : un **parcours** avec un traitement par maillon. O(N).
- Si le premier maillon peut changer : paramètre **`Cell **start`**.
- Pour insérer ou supprimer au milieu, il faut le maillon **d'avant** (`prev`).
- Insertion : **accrocher d'abord**, modifier le maillon d'avant **ensuite**.
- Suppression : relier le précédent au suivant, **puis** `free`. Sauvegarder `next` avant tout `free`.
- Insertion en fin O(N) (O(1) avec un pointeur de fin), inversion O(N) avec `prev`, `cur`, `suivant`.
