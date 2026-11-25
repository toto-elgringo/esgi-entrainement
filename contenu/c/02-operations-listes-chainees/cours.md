# Opérations sur les listes chaînées

Le chapitre précédent a posé la structure, le parcours et l'insertion en début. Voici les autres opérations classiques, vues pendant les deux séances de cours sur les listes chaînées : insertion et suppression aux deux bouts, insertion à une position, recherche, inversion, fusion de listes triées et insertion dans une liste triée. Tous les exemples utilisent :

```c
typedef struct cell {
    int value;
    struct cell *next;
} Cell;
```

Dans les schémas, `[v|*]` est un maillon de valeur `v` et `-->` un pointeur `next`.

> [!info] `Cell *` ou `Cell **` ?
> Une fonction qui peut **changer le premier maillon** (supprimer en début, insérer dans une liste vide...) doit recevoir `Cell **start`, l'adresse de la variable de l'appelant. Une fonction qui se contente de **lire** la liste, ou de modifier des maillons **après** le premier, peut recevoir un simple `Cell *`.

> [!tip] L'autre écriture : renvoyer le nouveau début
> Les exercices du cours écrivent souvent ces fonctions sous la forme `Cell *operation(Cell *start, ...)`, qui **renvoie** le nouveau premier maillon. C'est équivalent, à condition de ne jamais oublier de ranger le résultat : `start = supprimerFin(start);`. Oublier le `start =` est l'erreur la plus fréquente, même chez les personnes qui ont l'habitude.

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

Quand on veut seulement savoir **si** la valeur est là (réponse 1 ou 0), il suffit de comparer le résultat à `NULL` : `return rechercher(start, valeur) != NULL;`.

**Exemple pas à pas :** `rechercher(start, 7)` dans `3 -> 7 -> 5 -> 7`.

| Tour | `cur` est sur le maillon | `cur->value == 7` ? | Ce qui se passe |
|---|---|---|---|
| 1 | 1er (valeur 3) | non | `cur = cur->next` |
| 2 | 2e (valeur 7) | **oui** | `return cur;` : on renvoie l'adresse du 2e maillon |

Le 4e maillon vaut aussi 7, mais on ne va jamais jusque-là : on renvoie le **premier** trouvé. Avec `rechercher(start, 9)`, les 4 tours répondent « non », `cur` devient `NULL`, la boucle s'arrête et on arrive au `return NULL;` du bas.

**À retenir :** `return cur;` dans la boucle dès qu'on trouve, `return NULL;` après la boucle (on a tout vu sans trouver).

### Compter les maillons qui conviennent

Même parcours, mais on ne s'arrête pas : on va jusqu'au bout et on augmente un compteur à chaque maillon qui respecte la condition. Exemple : compter les maillons **plus grands qu'un seuil**.

```c
int compterPlusGrands(Cell *start, int seuil) {
    int total = 0;
    for (Cell *cur = start; cur != NULL; cur = cur->next) {
        if (cur->value > seuil) {
            total++;
        }
    }
    return total;
}
```

**Exemple pas à pas :** `compterPlusGrands(start, 5)` dans `6 -> 2 -> 9 -> 5`.

| Maillon lu | Plus grand que 5 ? | `total` après |
|---|---|---|
| 6 | oui | 1 |
| 2 | non | 1 |
| 9 | oui | 2 |
| 5 | non (5 n'est pas **strictement** plus grand) | 2 |
| (`cur` vaut `NULL`) | fin de la boucle | on renvoie **2** |

Sur une liste vide, la boucle ne fait aucun tour : on renvoie 0, ce qui est juste. Pour compter les maillons **égaux** à une valeur, seule la condition change (`==` au lieu de `>`).

**À retenir :** compteur à 0 avant la boucle, `+1` à chaque maillon qui convient, pas de `return` dans la boucle.

### Chercher le maximum (ou le minimum)

On part de la valeur du **premier** maillon (pas de 0, sinon une liste de nombres négatifs donnerait 0), puis on garde la plus grande valeur vue. Le minimum se calcule exactement pareil, avec `<` au lieu de `>` :

```c
int minimum(Cell *start) {
    int min = start->value;
    for (Cell *cur = start->next; cur != NULL; cur = cur->next) {
        if (cur->value < min) {
            min = cur->value;
        }
    }
    return min;
}
```

**Exemple pas à pas :** le maximum de `-5 -> -1 -> -9`.

| Étape | Maillon lu | Plus grand que `max` ? | `max` après |
|---|---|---|---|
| départ | 1er (valeur -5) | (on le prend d'office) | -5 |
| tour 1 | -1 | oui (-1 > -5) | -1 |
| tour 2 | -9 | non | -1 |

Résultat : **-1**. Si on avait commencé avec `max = 0`, aucun maillon n'aurait été plus grand que 0 et on aurait renvoyé 0, une valeur qui n'est même pas dans la liste. Même piège pour le minimum de `4 -> 8` démarré à 0 : on renverrait 0 au lieu de 4.

**À retenir :** le maximum (ou le minimum) démarre à la valeur du premier maillon, puis on compare avec tous les autres.

> [!warning] Liste vide
> Le maximum d'une liste vide n'existe pas : `start->value` planterait. Soit on interdit ce cas (et on le dit dans la documentation de la fonction), soit on renvoie un code à part.

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

**Exemple pas à pas :** dans `7 -> 3 -> 9 -> 4`, `obtenirElement(start, 2)` puis `obtenirElement(start, 6)`.

| Appel | `i` | `cur` est sur | On continue ? (`cur != NULL` et `i < position`) |
|---|---|---|---|
| position 2 | 0 | 7 (position 0) | oui |
| | 1 | 3 (position 1) | oui |
| | 2 | 9 (position 2) | non (`i < 2` est faux) : on renvoie le maillon **9** |
| position 6 | 0, 1, 2, 3 | 7, 3, 9, 4 | oui à chaque fois |
| | 4 | `NULL` | non (`cur` vaut `NULL`) : on renvoie **`NULL`** |

Pour la position 2, la boucle a fait **2** tours : il faut suivre `position` pointeurs `next` depuis le début. Le test `cur != NULL` est placé **en premier** : quand la liste est trop courte, on s'arrête avant de lire `cur->next` dans `NULL`.

**À retenir :** la position i demande i tours de boucle ; une liste trop courte donne `NULL`.

**Complexité** : O(i), donc O(N) au pire. C'est le point faible de la liste face au tableau (`t[i]` en O(1), l'adresse de la case se calcule directement).

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

**Ce qui se passe dans la mémoire.** Les adresses sont inventées pour l'exemple : liste `5 -> 8`, le maillon 5 est à l'adresse `A`, le maillon 8 à l'adresse `B`.

| Instruction | `*start` | `ancien` | Maillon `A` (valeur 5) |
|---|---|---|---|
| départ | `A` | | réservé, dans la liste |
| `Cell *ancien = *start;` | `A` | `A` | réservé, dans la liste |
| `*start = ancien->next;` | `B` | `A` | réservé, **hors** de la liste, mais `ancien` connaît encore son adresse |
| `free(ancien);` | `B` | `A` (adresse devenue invalide) | **rendu** au système |

Sans la variable `ancien`, après la 2e ligne plus personne ne connaîtrait l'adresse `A` : impossible de faire le `free`, c'est la fuite.

### La même opération, en renvoyant le nouveau début

Avec l'écriture `Cell *operation(Cell *start)` (voir l'encart du début), la fonction reçoit une **copie** de `start`, et c'est le `return` qui donne le nouveau début à l'appelant. Le `free` reste obligatoire :

```c
Cell *enleverTete(Cell *start) {
    if (start == NULL) {
        return NULL;
    }
    Cell *suite = start->next;
    free(start);
    return suite;
}
```

On l'appelle avec `liste = enleverTete(liste);`. L'ordre est le même : **ranger la suite**, **libérer**, **renvoyer** la suite.

> [!warning] Le piège qui « marche »
> `return start->next;` tout seul renvoie la bonne liste, et le programme affiche les bonnes valeurs. Mais l'ancien premier maillon reste réservé et perdu : la fuite ne se voit pas à l'écran, seulement quand on compte les `malloc` et les `free`.

**À retenir :** supprimer en début = garder l'adresse du maillon (ou de la suite), avancer le début, puis `free`. Les deux écritures (`Cell **` ou `return`) font la même chose.

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

**Exemple pas à pas :** on part d'une liste vide et on fait `insererFin(&l, 4)`, `insererFin(&l, 6)`, `insererFin(&l, 1)`.

| Appel | Liste vide ? | Marche de `cur` | Accrochage | Liste après |
|---|---|---|---|---|
| `insererFin(&l, 4)` | oui | aucune | `*start = nouveau` (`l` change) | `4` |
| `insererFin(&l, 6)` | non | `cur` sur 4 ; `4->next` vaut `NULL` : on s'arrête | `4->next = nouveau` | `4 -> 6` |
| `insererFin(&l, 1)` | non | `cur` sur 4, puis sur 6 ; `6->next` vaut `NULL` : on s'arrête | `6->next = nouveau` | `4 -> 6 -> 1` |

Les valeurs restent dans l'**ordre d'arrivée** (l'insertion en début, elle, donnerait `1 -> 6 -> 4`). Chaque appel marche un peu plus loin que le précédent : plus la liste est longue, plus c'est long.

**À retenir :** liste vide → le nouveau devient le début ; sinon on s'arrête **sur** le dernier (`cur->next == NULL`) et on accroche derrière.

**Complexité** : O(N), à cause de la marche jusqu'au bout.

> [!warning] `cur->next != NULL` et pas `cur != NULL`
> On veut s'arrêter **sur** le dernier maillon pour modifier son `next`. Avec `cur != NULL`, on sort de la boucle avec `cur == NULL` : trop tard.

> [!tip] En O(1) avec un pointeur de fin
> En gardant en plus un pointeur `fin` sur le dernier maillon, l'insertion en fin devient `fin->next = nouveau; fin = nouveau;`. C'est ainsi qu'on fait une **file d'attente** (premier arrivé, premier servi) avec une liste chaînée.

## 5. Supprimer le dernier maillon

Pour retirer le dernier maillon, il faut changer le `next` de l'**avant-dernier** (il doit passer à `NULL`). Une liste simplement chaînée ne sait pas reculer : on avance donc depuis le début un pointeur `prev` qui regarde **deux crans** plus loin.

```text
1) prev s'arrête sur l'avant-dernier (prev->next->next vaut NULL)

   start --> [1|*] --> [2|*] --> [3|*] --> NULL
                        ^         ^
                       prev     dernier

2) free(prev->next), puis prev->next = NULL

   start --> [1|*] --> [2|*] --> NULL
```

```c
void supprimerFin(Cell **start) {
    if (*start == NULL) {
        return;
    }
    if ((*start)->next == NULL) {
        free(*start);
        *start = NULL;
        return;
    }
    Cell *prev = *start;
    while (prev->next->next != NULL) {
        prev = prev->next;
    }
    free(prev->next);
    prev->next = NULL;
}
```

Trois cas, comme souvent :

| Liste | Ce qui se passe |
|---|---|
| vide | rien à faire |
| un seul maillon | on le libère et **le début devient `NULL`** (d'où le `Cell **`) |
| deux maillons ou plus | on cherche l'avant-dernier, on libère le dernier, on coupe la chaîne |

**Exemple pas à pas :** `supprimerFin(&l)` sur `2 -> 5 -> 8 -> 6`. `prev` part du premier maillon et regarde deux crans plus loin.

| `prev` est sur | `prev->next` | `prev->next->next` | Vaut `NULL` ? |
|---|---|---|---|
| 2 | 5 | 8 | non : `prev` avance |
| 5 | 8 | 6 | non : `prev` avance |
| 8 | 6 | `NULL` | **oui** : `prev` est l'avant-dernier |

Puis `free(prev->next)` rend le maillon 6, et `prev->next = NULL` fait de 8 le nouveau dernier : `2 -> 5 -> 8`.

Si on refait `supprimerFin` jusqu'au bout : `2 -> 5`, puis `2`, puis on tombe sur le cas « un seul maillon » (`(*start)->next == NULL`) : on libère 2 et `*start` devient `NULL`. Un appel de plus sur la liste vide ne fait rien.

> [!warning] Pourquoi traiter à part le maillon seul ?
> Avec un seul maillon, `prev->next` vaut déjà `NULL`, et la condition `prev->next->next` lirait dans `NULL` : plantage. Et le début de la liste doit devenir `NULL`, ce que seul `*start = NULL` (ou un `return NULL`) peut faire.

Dans l'écriture qui **renvoie le nouveau début**, les trois cas deviennent : liste vide → `return NULL;` ; un seul maillon → `free(start); return NULL;` ; sinon on libère le dernier, on coupe, et `return start;` (le début n'a pas changé).

**À retenir :** pour supprimer en fin, `prev` s'arrête quand `prev->next->next == NULL`, puis `free(prev->next)` **avant** `prev->next = NULL`.

**Complexité** : O(N), même avec un pointeur de fin : connaître le dernier ne donne pas l'avant-dernier. Seule une liste **doublement chaînée** (chaque maillon connaît aussi le précédent) fait mieux.

> [!warning] Couper sans libérer
> `prev->next = NULL;` tout seul retire le dernier maillon de la liste, mais ne rend pas sa mémoire : fuite. Et dans l'autre ordre (`prev->next = NULL;` puis `free(prev->next);`), on libère `NULL`, ce qui ne fait rien : le maillon est perdu. **Libérer d'abord, couper ensuite**, ou garder l'adresse dans une variable.

## 6. Insérer après un maillon donné

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

**Pourquoi l'ordre compte, pas à pas.** Liste `3 -> 7`, on veut insérer 5 après le maillon 3 (appelé `m`). Le nouveau maillon 5 vient de `creerCell`, son `next` vaut `NULL`.

| Bon ordre | `m->next` (3 pointe vers) | `nouveau->next` (5 pointe vers) |
|---|---|---|
| départ | 7 | `NULL` |
| `nouveau->next = m->next;` | 7 | 7 |
| `m->next = nouveau;` | 5 | 7 |

Résultat : `3 -> 5 -> 7`.

| Mauvais ordre | `m->next` | `nouveau->next` |
|---|---|---|
| départ | 7 | `NULL` |
| `m->next = nouveau;` | 5 | `NULL` |
| `nouveau->next = m->next;` | 5 | **5** (lui-même !) |

Résultat : `3 -> 5 -> 5 -> 5 ...` (une boucle sans fin), et le maillon 7 n'est plus accessible : la fin de la liste est perdue.

**Après le dernier maillon :** si `m` est le dernier, `m->next` vaut `NULL`, donc `nouveau->next` reçoit `NULL` et le nouveau devient le dernier. Le même code marche, rien à traiter à part.

**À retenir :** d'abord `nouveau->next = m->next;` (le nouveau tient la suite), ensuite `m->next = nouveau;`.

## 7. Insérer à une position

On veut que la nouvelle valeur se retrouve **à la position `pos`** (0 = devant tout le monde). Si `pos` dépasse la taille, on l'ajoute à la fin.

```text
Algo : InsertionPosition
Si pos <= 0 ou la liste est vide :
    insérer en début
Sinon :
    prev = premier, i = 1
    Tant que i < pos et prev.next n'est pas null :
        prev = prev.next, i = i + 1
    insérer après prev
```

Exemple : insérer 9 en position 2 dans `1 -> 2 -> 3`. `prev` part du maillon 1 (position 0) et avance d'un cran : il s'arrête sur le maillon 2 (position 1). On insère après lui :

```text
   start --> [1|*] --> [2|*] --> [9|*] --> [3|*] --> NULL
   position     0         1         2         3
```

La condition `prev->next != NULL` arrête `prev` sur le dernier maillon quand `pos` est trop grand : l'insertion se fait alors à la fin, sans planter.

**Exemple pas à pas, tous les cas :** à chaque fois on part de `4 -> 6 -> 8` (positions 0, 1, 2).

| Appel | Cas | Tours de boucle (`prev` passe par) | `prev` final | Résultat |
|---|---|---|---|---|
| position 0, valeur 1 | `pos <= 0` | aucun : insertion en début | | `1 -> 4 -> 6 -> 8` |
| position -3, valeur 1 | `pos <= 0` | aucun : insertion en début | | `1 -> 4 -> 6 -> 8` |
| position 1, valeur 5 | `i = 1`, `i < 1` faux | aucun | 4 (position 0) | `4 -> 5 -> 6 -> 8` |
| position 2, valeur 7 | | 1 tour : 4 → 6 | 6 (position 1) | `4 -> 6 -> 7 -> 8` |
| position 3, valeur 9 | | 2 tours : 4 → 6 → 8 | 8 (position 2) | `4 -> 6 -> 8 -> 9` |
| position 50, valeur 9 | trop loin | 2 tours, puis `8->next` vaut `NULL` : arrêt | 8 (le dernier) | `4 -> 6 -> 8 -> 9` |

Et dans une **liste vide**, quelle que soit la position, on insère en début : le nouveau maillon devient le seul (pas de `prev` possible, il n'y a aucun maillon).

L'insertion « en début » change le premier maillon : la fonction doit donc recevoir `Cell **start` (ou renvoyer le nouveau début). L'insertion « après `prev` » est celle de la section 6.

**À retenir :** position `<= 0` ou liste vide → début ; sinon `prev` part du premier et fait `pos - 1` tours au plus, puis on insère après lui.

**Complexité** : O(pos), donc O(N) au pire.

> [!tip] Compter juste
> Pour insérer en position `pos`, il faut s'arrêter sur le maillon en position **`pos - 1`**. Un tour de boucle de trop, et la valeur arrive une case trop loin. Vérifie sur papier avec `pos = 1` : `prev` ne doit pas bouger.

## 8. Insérer dans une liste triée

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

**Exemple pas à pas :** insérer 6 dans `2 -> 5 -> 9`.

1. La liste n'est pas vide et 6 n'est pas `<=` 2 : ce n'est pas une insertion en début.
2. `prev` part de 2. On regarde **le maillon suivant** :

| `prev` est sur | `prev->next` | `prev->next->value < 6` ? | Action |
|---|---|---|---|
| 2 | 5 | oui (5 < 6) | `prev` avance |
| 5 | 9 | non (9 n'est pas < 6) | arrêt |

3. On insère 6 après 5 : `2 -> 5 -> 6 -> 9`, toujours triée.

**Construire une liste triée en partant de rien :** on insère 4, puis 1, puis 7, puis 4.

| Valeur insérée | Cas | Liste après |
|---|---|---|
| 4 | liste vide → début | `4` |
| 1 | 1 `<=` 4 (le premier) → début (le premier maillon change) | `1 -> 4` |
| 7 | `prev` avance de 1 à 4 ; `4->next` vaut `NULL` → arrêt, après 4 (à la fin) | `1 -> 4 -> 7` |
| 4 | `prev` sur 1 ; `1->next` vaut 4, et 4 < 4 est faux → arrêt, après 1 | `1 -> 4 -> 4 -> 7` |

Les **doublons** ne posent pas de problème : le nouveau 4 se place juste avant l'ancien, la liste reste croissante. Les trois situations (début, milieu, fin) sont toutes gérées : la fin parce que la boucle s'arrête aussi quand `prev->next` vaut `NULL`.

> [!warning] L'ordre des deux conditions
> `prev->next != NULL && prev->next->value < valeur` : on vérifie **d'abord** qu'il y a un maillon suivant, **ensuite** on lit sa valeur. Le `&&` s'arrête au premier « faux », donc on ne lit jamais `NULL->value`. Dans l'autre ordre, le programme planterait en arrivant au bout.

**À retenir :** insertion triée = « début si la valeur est `<=` au premier, sinon avancer `prev` tant que le suivant est plus petit, puis insérer après `prev` ».

**Complexité** : O(N). En insérant N valeurs une par une, on obtient un tri (le **tri par insertion**) en O(N²).

## 9. Supprimer une valeur au milieu

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

**Exemple pas à pas :** sur `6 -> 3 -> 9 -> 3`, on appelle successivement `supprimerValeur(&l, 3)`, `supprimerValeur(&l, 6)` puis `supprimerValeur(&l, 5)`.

Appel avec 3 (le premier maillon vaut 6, ce n'est pas lui) :

| `prev` est sur | `prev->next->value` | Égal à 3 ? | Action |
|---|---|---|---|
| 6 | 3 | **oui** | arrêt : la cible est le 2e maillon |

`prev->next = cible->next` relie 6 à 9, puis `free(cible)` : `6 -> 9 -> 3`. Le **deuxième** 3 reste : on ne retire que le **premier** trouvé.

Appel avec 6 : le premier maillon vaut 6, c'est le cas spécial, `supprimerDebut(start)` : `9 -> 3` (le début de la liste a changé, d'où le `Cell **`).

Appel avec 5 (absent) :

| `prev` est sur | `prev->next` | Action |
|---|---|---|
| 9 | 3 (≠ 5) | `prev` avance |
| 3 | `NULL` | arrêt de la boucle |

Après la boucle, `prev->next` vaut `NULL` : rien à supprimer, la liste reste `9 -> 3`.

**À retenir :** supprimer une valeur = cas du premier maillon à part, sinon `prev` s'arrête **juste avant** la cible, on la saute (`prev->next = cible->next`), puis `free(cible)`.

**Complexité** : O(N).

## 10. Libérer toute la liste

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

**Exemple pas à pas :** `libererListe(&l)` sur `5 -> 2 -> 7`.

| Tour | `cur` | `suivant = cur->next` | `free(cur)` | `cur = suivant` |
|---|---|---|---|---|
| 1 | 5 | 2 | 5 rendu | 2 |
| 2 | 2 | 7 | 2 rendu | 7 |
| 3 | 7 | `NULL` | 7 rendu | `NULL` : fin |

Puis `*start = NULL` : la variable `l` de l'appelant vaut `NULL`, la liste est vide et propre. On a fait **un `free` par maillon**, ni plus ni moins.

Pour savoir **combien** de maillons ont été libérés, il suffit d'ajouter un compteur mis à 0 avant la boucle et augmenté à chaque `free` (ici il finirait à 3), puis de le renvoyer.

> [!warning] Libérer un seul maillon ne suffit pas
> `if (start != NULL) free(start);` ne rend que le **premier** maillon : les suivants restent réservés. Il faut une boucle qui passe sur **chaque** maillon.

> [!tip] Avec un simple `Cell *`
> `void libererListe(Cell *start)` marche aussi (on avance `start` lui-même, c'est une copie). La seule différence : la variable de l'appelant garde l'ancienne adresse, devenue invalide. Il faut alors la remettre à `NULL` soi-même après l'appel, ou ne plus s'en servir.

**À retenir :** libérer une liste = `suivant = cur->next;` **puis** `free(cur);` **puis** `cur = suivant;`, jusqu'à `NULL`.

**Complexité** : O(N).

> [!info] La plateforme vérifie les fuites
> Dans les exercices qui créent ou suppriment des maillons, les tests comptent chaque `malloc` et chaque `free`. À la fin, la vérification « toute la mémoire allouée a été libérée » échoue s'il reste un maillon jamais rendu : supprimer un maillon de la liste sans `free`, ou vider la liste en mettant juste `start = NULL`, fait rater l'exercice.

## 11. Inverser une liste

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

**Exemple pas à pas :** inverser `5 -> 8 -> 2`. La colonne « partie déjà inversée » se lit à partir de `prev`.

| Tour | `cur` au début du tour | `suivant` | `cur->next = prev` | `prev` après | `cur` après | Partie déjà inversée | Reste à traiter |
|---|---|---|---|---|---|---|---|
| départ | | | | `NULL` | 5 | (rien) | `5 -> 8 -> 2` |
| 1 | 5 | 8 | `5->next = NULL` | 5 | 8 | `5` | `8 -> 2` |
| 2 | 8 | 2 | `8->next = 5` | 8 | 2 | `8 -> 5` | `2` |
| 3 | 2 | `NULL` | `2->next = 8` | 2 | `NULL` | `2 -> 8 -> 5` | (rien) : fin |

On renvoie `prev`, qui est le maillon 2 : la liste vaut `2 -> 8 -> 5`. L'ancien premier (5) est devenu le dernier : son `next` vaut `NULL` depuis le tour 1. Aucun `malloc` : ce sont les trois mêmes maillons, seuls leurs `next` ont changé.

Cas limites : liste vide → la boucle ne tourne pas, on renvoie `prev` qui vaut `NULL` ; un seul maillon → un tour, son `next` reçoit `NULL` (il l'était déjà), on le renvoie.

> [!warning] Ranger le résultat
> L'inversion change le premier maillon : `liste = inverser(liste);`. Écrire seulement `inverser(liste);` laisse `liste` sur l'ancien premier, devenu le dernier : on ne verrait plus qu'**un** maillon.

**À retenir :** inversion = trois pointeurs ; on sauve la suite (`suivant`), on retourne le lien (`cur->next = prev`), on avance les deux ; on renvoie `prev`.

**Complexité** : O(N) en temps, aucune mémoire en plus.

## 12. Fusionner deux listes triées

Deux listes triées par ordre croissant, `a` et `b`. On veut **une seule** liste triée qui contient tous leurs maillons. Comme pour le tri fusion des tableaux, on compare les deux premiers maillons, on prend **le plus petit**, et on recommence.

Aucun `malloc` n'est nécessaire : on **réutilise** les maillons en changeant leurs `next`. Pour ne pas traiter à part le tout premier maillon, on se sert d'un **maillon bidon** (une variable locale, jamais libérée) placé devant le résultat, et d'un pointeur `fin` sur le dernier maillon déjà accroché.

```text
a : [2|*] --> [5|*] --> [9|*] --> NULL
b : [1|*] --> [5|*] --> [6|*] --> NULL

2 > 1  : on prend 1 (de b)    bidon --> 1
2 < 5  : on prend 2 (de a)    bidon --> 1 --> 2
5 = 5  : on prend 5 (de a)    bidon --> 1 --> 2 --> 5a
9 > 5  : on prend 5 (de b)    bidon --> 1 --> 2 --> 5a --> 5b
9 > 6  : on prend 6 (de b)    bidon --> 1 --> 2 --> 5a --> 5b --> 6
b est vide : on accroche le reste de a (9) d'un coup
```

```c
Cell *fusionner(Cell *a, Cell *b) {
    Cell bidon;
    bidon.next = NULL;
    Cell *fin = &bidon;
    while (a != NULL && b != NULL) {
        if (a->value <= b->value) {
            fin->next = a;
            a = a->next;
        } else {
            fin->next = b;
            b = b->next;
        }
        fin = fin->next;
    }
    fin->next = (a != NULL) ? a : b;
    return bidon.next;
}
```

- `a` et `b` sont des copies : les avancer ne change pas les variables de l'appelant.
- Quand une liste est finie, le **reste de l'autre** est déjà trié et chaîné : on l'accroche en une fois.
- Avec `<=`, à valeur égale, le maillon de `a` passe en premier.

**Le même exemple, avec l'état des pointeurs à chaque tour** (`5a` est le 5 de `a`, `5b` celui de `b`) :

| Tour | `a` pointe sur | `b` pointe sur | `a->value <= b->value` ? | Maillon accroché à `fin` | `fin` après |
|---|---|---|---|---|---|
| 1 | 2 | 1 | non (2 > 1) | 1, et `b` avance | 1 |
| 2 | 2 | 5b | oui | 2, et `a` avance | 2 |
| 3 | 5a | 5b | oui (égalité) | 5a, et `a` avance | 5a |
| 4 | 9 | 5b | non | 5b, et `b` avance | 5b |
| 5 | 9 | 6 | non | 6, et `b` avance | 6 |
| fin | 9 | `NULL` | la boucle s'arrête | `fin->next = a` (le reste : 9) | |

On renvoie `bidon.next`, le maillon 1 : `1 -> 2 -> 5 -> 5 -> 6 -> 9`. Les 6 maillons de départ ont tous été réutilisés, aucun `malloc`.

Cas limites : si `a` est vide dès le départ, la boucle ne tourne pas et `fin->next = b` : le résultat est `b` tout entier (et inversement).

> [!warning] Pourquoi pas « tout mettre dans une liste et trier » ?
> On perdrait l'avantage d'avoir deux listes **déjà triées**. La fusion ne fait qu'une comparaison par maillon accroché : N + M étapes au plus.

**À retenir :** fusion = comparer les deux têtes, accrocher la plus petite à `fin`, avancer cette liste et `fin` ; à la fin, accrocher le reste ; renvoyer `bidon.next`.

**Complexité** : O(N + M) en temps (chaque maillon est accroché une fois), O(1) en mémoire.

> [!warning] Après la fusion
> Les maillons de `a` et de `b` appartiennent maintenant au résultat. L'appelant libère **le résultat**, et surtout pas `a` ou `b` en plus : ce serait libérer deux fois les mêmes maillons.

## 13. Afficher à l'envers grâce à la récursivité

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

**Une fonction récursive** est une fonction qui s'appelle elle-même sur un problème plus petit (ici : le reste de la liste, qui a un maillon de moins). Il faut un **cas d'arrêt** (ici : `c == NULL`, la liste vide, où l'on ne fait rien), sinon les appels ne s'arrêteraient jamais.

**Exemple pas à pas :** `afficherEnvers` sur `5 -> 6 -> 7`. Chaque appel **attend** que l'appel suivant soit fini avant de faire son `printf`. Le décalage montre les appels empilés :

```text
afficherEnvers(5)                    c n'est pas NULL : on appelle sur la suite
  afficherEnvers(6)                  c n'est pas NULL : on appelle sur la suite
    afficherEnvers(7)                c n'est pas NULL : on appelle sur la suite
      afficherEnvers(NULL)           cas d'arrêt : return, rien n'est affiché
    retour dans l'appel sur 7        printf -> "7 "
  retour dans l'appel sur 6          printf -> "6 "
retour dans l'appel sur 5            printf -> "5 "

Affichage final : 7 6 5
```

À **l'aller** (en descendant), rien ne s'affiche : chaque appel met son `printf` de côté. Au **retour** (en remontant), les `printf` se font du dernier maillon vers le premier. Avec le `printf` placé **avant** l'appel récursif, on afficherait au contraire à l'aller : `5 6 7`.

Sur une liste vide, le premier appel est déjà le cas d'arrêt : rien ne s'affiche. Sur un seul maillon : un appel sur `NULL` qui ne fait rien, puis l'affichage de ce maillon.

**À retenir :** ce qu'on écrit **avant** l'appel récursif se fait dans l'ordre de la liste, ce qu'on écrit **après** se fait dans l'ordre inverse.

## 14. Récapitulatif

| Opération | Liste chaînée | Tableau |
|---|---|---|
| Parcours, somme, taille, recherche, maximum | O(N) | O(N) |
| Accès au i-ème élément | O(N) | O(1) |
| Insertion / suppression en début | O(1) | O(N) |
| Insertion en fin | O(N), ou O(1) avec un pointeur de fin | O(1) s'il reste de la place |
| Suppression en fin | O(N), même avec un pointeur de fin | O(1) |
| Insertion après un maillon connu | O(1) | O(N) |
| Insertion à une position | O(N) | O(N) |
| Suppression d'une valeur | O(N) | O(N) |
| Inversion | O(N) | O(N) |
| Fusion de deux listes triées | O(N + M), sans mémoire en plus | O(N + M), avec un tableau en plus |

```anim
liste-chainee
liste: 1, 4, 2, 5
```

## 15. Programme complet

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

void supprimerFin(Cell **start) {
    if (*start == NULL) {
        return;
    }
    if ((*start)->next == NULL) {
        free(*start);
        *start = NULL;
        return;
    }
    Cell *prev = *start;
    while (prev->next->next != NULL) {
        prev = prev->next;
    }
    free(prev->next);
    prev->next = NULL;
}

Cell *fusionner(Cell *a, Cell *b) {
    Cell bidon;
    bidon.next = NULL;
    Cell *fin = &bidon;
    while (a != NULL && b != NULL) {
        if (a->value <= b->value) {
            fin->next = a;
            a = a->next;
        } else {
            fin->next = b;
            b = b->next;
        }
        fin = fin->next;
    }
    fin->next = (a != NULL) ? a : b;
    return bidon.next;
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
    supprimerFin(&liste);
    afficherListe(liste);
    Cell *autre = NULL;
    insererFin(&autre, 15);
    insererFin(&autre, 25);
    liste = inverser(liste);
    liste = fusionner(liste, autre);
    afficherListe(liste);
    libererListe(&liste);
    afficherListe(liste);
    return 0;
}
```

## À retenir

- Chercher, compter, maximum : un **parcours** avec un traitement par maillon. O(N). Le maximum démarre à la valeur du **premier** maillon, jamais à 0.
- Accès à la position i : i tours de boucle, `NULL` si la liste est trop courte. O(N), contre O(1) pour `t[i]`.
- Si le premier maillon peut changer : paramètre **`Cell **start`**.
- Pour insérer ou supprimer au milieu, il faut le maillon **d'avant** (`prev`).
- Insertion : **accrocher d'abord**, modifier le maillon d'avant **ensuite**.
- Suppression : relier le précédent au suivant, **puis** `free`. Sauvegarder `next` avant tout `free`.
- Insertion en fin O(N) (O(1) avec un pointeur de fin), inversion O(N) avec `prev`, `cur`, `suivant`.
- Suppression en fin : il faut l'**avant-dernier**, O(N) ; liste d'un seul maillon : le début devient `NULL`.
- Insertion en position `pos` : s'arrêter sur le maillon `pos - 1` ; trop loin, on insère à la fin.
- Fusion de deux listes triées : maillon bidon + pointeur `fin`, on réutilise les maillons, O(N + M).
- Insertion triée : début si la valeur est `<=` au premier, sinon avancer `prev` tant que le **suivant** est plus petit.
- Affichage à l'envers : récursion, le `printf` placé **après** l'appel récursif.
- Chaque maillon retiré est **libéré** : aucun `free` oublié, aucun `free` en double.
