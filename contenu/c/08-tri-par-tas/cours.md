# Tri par tas

Le **tri par tas** (*heapsort*) s'appuie sur une structure de données, le **tas**, qui sait donner très vite la plus grande valeur d'un ensemble. Il trie en O(n log n) **dans tous les cas** (comme le tri fusion) et **en place** (comme le tri rapide).

## 1. Le tas binaire

Un **tas** (tas binaire) est un **arbre binaire** (chaque nœud a au plus deux enfants) qui respecte deux règles :

1. **Il est complet** : tous les niveaux sont remplis, sauf peut-être le dernier, et ce dernier niveau est rempli **de gauche à droite**, sans trou.
2. **Il est ordonné** : dans un **tas max**, chaque nœud est **plus grand ou égal** à ses enfants. Dans un **tas min**, il est plus petit ou égal.

```text
          54                    54                  54
        /    \                /    \              /    \
      28      12            28      12          28      12
     /  \                  /                         \
    5    3                5                           5

   tas max complet       complet aussi          PAS complet :
                                                trou à gauche
```

Conséquence de la règle 2 : dans un tas max, le **maximum est toujours à la racine**. En revanche, il n'y a **aucun ordre entre deux frères** : le fils gauche peut être plus grand ou plus petit que le fils droit.

**Exemple résolu : ces deux arbres sont-ils des tas max ?**

```text
          40                      40
        /    \                  /    \
      25      30              25      30
     /  \                    /  \
   10    26                10    12
       arbre A                 arbre B
```

On vérifie les deux règles l'une après l'autre.

1. **Complet ?** Les deux arbres ont le niveau 1 plein (25 et 30) et un dernier niveau rempli à partir de la gauche (sous 25), sans trou : oui pour les deux.
2. **Ordonné ?** On compare **chaque parent avec chacun de ses enfants** :

| Parent | Enfant | Arbre A | Arbre B |
|---|---|---|---|
| 40 | 25 | 40 >= 25, oui | oui |
| 40 | 30 | 40 >= 30, oui | oui |
| 25 | 10 | 25 >= 10, oui | oui |
| 25 | 26 (A) ou 12 (B) | 25 >= 26, **non** | 25 >= 12, oui |

L'arbre A n'est **pas** un tas max : 26 est plus grand que son parent 25. Une seule paire fausse suffit. L'arbre B en est un. Remarque : dans B, 30 est plus grand que 25 et que 12, alors qu'il n'est pas au-dessus d'eux ; ce n'est pas un problème, car on ne compare jamais deux nœuds qui ne sont pas parent et enfant.

Un **tas min** se vérifie de la même façon, avec `<=` : chaque parent est plus petit ou égal à ses enfants, et le **minimum** est à la racine.

**À retenir :** pour reconnaître un tas max, vérifie que l'arbre est complet, puis que **chaque** parent est >= à **chacun** de ses enfants ; les frères ne se comparent pas.

> [!info] À quoi ça sert ?
> Le tas est la structure idéale quand on veut **retirer le maximum encore et encore** (tâches par ordre d'urgence, patients aux urgences, événements par date...). On l'appelle aussi une **file de priorité**. Ajouter une valeur et retirer le maximum coûtent O(log n).

## 2. Un arbre complet rangé dans un tableau

Un arbre complet n'a pas de trou : on peut donc le ranger dans un **tableau**, niveau par niveau, de gauche à droite. Plus besoin de pointeurs.

```text
              53                     indice :  0   1   2   3   4   5   6   7
           /      \                  valeur : 53  29  12   4  15   3   9   1
         29        12
        /  \      /  \
       4    15   3    9
      /
     1
```

Pour une case d'indice `i` (en comptant à partir de 0) :

| Qui ? | Indice |
|---|---|
| enfant gauche | `2 * i + 1` |
| enfant droit | `2 * i + 2` |
| parent | `(i - 1) / 2` (division entière) |

Exemple : la case 1 (valeur 29) a ses enfants en 3 (valeur 4) et 4 (valeur 15) ; le parent de la case 7 (valeur 1) est `(7 - 1) / 2 = 3` (valeur 4).

**Exemple résolu :** le tas `t = 60 45 50 20 41 8 33 7 12` (9 cases, indices 0 à 8). Pour chaque case, on calcule les trois formules, puis on vérifie que l'indice obtenu est bien dans le tas (entre 0 et 8).

| Case `i` | Valeur | Gauche `2i + 1` | Droit `2i + 2` | Parent `(i - 1) / 2` |
|---|---|---|---|---|
| 0 | 60 | 1 (45) | 2 (50) | aucun : c'est la racine |
| 1 | 45 | 3 (20) | 4 (41) | 0 (60) |
| 2 | 50 | 5 (8) | 6 (33) | (2 - 1) / 2 = 1 / 2 = **0** (60) |
| 3 | 20 | 7 (7) | 8 (12) | (3 - 1) / 2 = 1 (45) |
| 4 | 41 | 9 : hors du tas | 10 : hors du tas | (4 - 1) / 2 = 3 / 2 = **1** (45) |
| 8 | 12 | 17 : hors du tas | 18 : hors du tas | (8 - 1) / 2 = 7 / 2 = **3** (20) |

Les divisions sont **entières** : `1 / 2` vaut 0 et `7 / 2` vaut 3 (on jette la partie après la virgule). C'est ce qui permet à une seule formule de marcher pour l'enfant gauche **et** le droit : les cases 7 et 8 donnent toutes les deux le parent 3.

Pour lire la **valeur** du parent d'une case, on combine : d'abord l'indice, puis la case. Valeur du parent de la case 6 : `t[(6 - 1) / 2] = t[2] = 50`.

Les **feuilles** (cases sans enfant) sont celles dont l'enfant gauche sort du tas : `2i + 1 >= 9`, donc `i >= 4`. Ce sont les cases 4 à 8, c'est-à-dire à partir de `n / 2 = 9 / 2 = 4`.

> [!warning] Les formules d'un tableau qui commence à 1
> Dans certains livres, la racine est à l'indice 1 et les enfants de `i` sont `2i` et `2i + 1`. En C, le tableau commence à 0 : avec ces formules, la case 1 aurait pour enfants les cases 2 et 3, alors que la case 2 est sa **sœur**. Garde `2i + 1`, `2i + 2` et `(i - 1) / 2`.

**À retenir :** enfants `2i + 1` et `2i + 2` (à tester `< taille`), parent `(i - 1) / 2` en division entière, feuilles à partir de `n / 2`.

> [!warning] Un enfant existe-t-il ?
> Dans un tas de `taille` cases, l'enfant gauche de `i` n'existe que si `2 * i + 1 < taille`, le droit que si `2 * i + 2 < taille`. Oublier ce test, c'est lire une case qui ne fait pas partie du tas.

> [!tip] La racine
> En C, `(0 - 1) / 2` vaut `0` (la division entière arrondit vers zéro) : la racine est son propre parent, ce qui arrête naturellement les boucles qui remontent.

Le tableau prend aussi beaucoup moins de mémoire : un nœud d'arbre classique stocke la valeur **et** trois pointeurs (gauche, droit, parent), chacun souvent deux fois plus gros qu'un `int`.

### Vérifier qu'un tableau est un tas max

Il suffit que **chaque case soit plus petite ou égale à son parent** :

```c
int estTasMax(const int *t, int n) {
    for (int i = 1; i < n; i++) {
        if (t[i] > t[(i - 1) / 2]) {
            return 0;
        }
    }
    return 1;
}
```

On peut aussi, pour chaque case, comparer avec ses deux enfants (s'ils existent) : c'est le même test, vu de l'autre côté.

**Exemple résolu :** `t = 40 30 35 12 31 20` est-il un tas max ?

La boucle part de `i = 1` (la racine n'a pas de parent) et compare chaque case à son parent :

| `i` | `t[i]` | Parent `(i - 1) / 2` | `t[parent]` | `t[i] > t[parent]` ? |
|---|---|---|---|---|
| 1 | 30 | 0 | 40 | non, on continue |
| 2 | 35 | 0 | 40 | non |
| 3 | 12 | 1 | 30 | non |
| 4 | 31 | 1 | 30 | **oui** : on renvoie 0 |

La case 5 n'est même pas regardée : une seule case plus grande que son parent suffit. Le maximum 40 est bien à la racine, et pourtant ce n'est pas un tas : la règle porte sur **chaque** case. Si on échange 30 et 31 (`40 31 35 12 30 20`), toutes les lignes donnent « non » et la fonction renvoie 1.

Cas particuliers : avec 0 ou 1 case, la boucle ne fait aucun tour et la fonction renvoie 1 (un tas vide ou d'une case est toujours un tas). Les égalités sont permises : `7 7 7` est un tas max (et un tas min).

Pour un **tas min**, c'est la même boucle avec la comparaison retournée : une case **plus petite** que son parent casse le tas. Exemple : `2 5 3 9 6 4` est un tas min (5 >= 2, 3 >= 2, 9 >= 5, 6 >= 5, 4 >= 3).

Le programme ci-dessous dit en plus quelle case pose problème :

```c
#include <stdio.h>

int estTasMax(const int *t, int n) {
    for (int i = 1; i < n; i++) {
        if (t[i] > t[(i - 1) / 2]) {
            printf("  case %d (%d) plus grande que son parent, case %d (%d)\n", i, t[i], (i - 1) / 2, t[(i - 1) / 2]);
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int a[] = {40, 30, 35, 12, 31, 20};
    int b[] = {40, 31, 35, 12, 30, 20};
    printf("a : %d\n", estTasMax(a, 6));
    printf("b : %d\n", estTasMax(b, 6));
    printf("tableau vide : %d\n", estTasMax(a, 0));
    return 0;
}
```

**À retenir :** un tableau est un tas max si, pour tout `i` de 1 à `n - 1`, `t[i] <= t[(i - 1) / 2]` ; dès qu'une case dépasse son parent, ce n'est pas un tas.

## 3. Insérer une valeur : la remontée

1. On place la nouvelle valeur dans la **première case libre** : à la fin du tableau (l'arbre reste complet).
2. Tant qu'elle n'est pas à la racine et qu'elle est **plus grande que son parent**, on l'**échange** avec son parent.

```text
insérer 30 dans  54 28 12 5 3

54 28 12 5 3 30        30 est en 5, parent (5 - 1) / 2 = 2 : 12 < 30, échange
54 28 30 5 3 12        30 est en 2, parent 0 : 54 > 30, on s'arrête
```

```c
void echanger(int *t, int i, int j) {
    int temporaire = t[i];
    t[i] = t[j];
    t[j] = temporaire;
}

void remonter(int *t, int i) {
    while (i > 0 && t[i] > t[(i - 1) / 2]) {
        echanger(t, i, (i - 1) / 2);
        i = (i - 1) / 2;
    }
}
```

Pourquoi le tas reste bon : quand la valeur monte, elle est plus grande que son ancien parent, qui était déjà plus grand que tous ses descendants. On ne fait au plus qu'un échange par niveau : **O(log n)**.

**Exemple résolu : insérer 60 dans le tas `50 30 40 10 20 35 38` (7 cases).**

```text
              50                              60
           /      \                        /      \
         30        40         ->         50        40
        /  \      /  \                  /  \      /  \
      10    20  35    38              30    20  35    38
                                     /
                                   10
```

60 va dans la première case libre, l'indice 7, et la taille passe à 8. Puis on la fait remonter :

| Étape | Case de 60 | Parent `(i - 1) / 2` | Comparaison | Action | Tableau après | Comparaisons | Échanges |
|---|---|---|---|---|---|---|---|
| départ | 7 | | | rangée à la fin | 50 30 40 10 20 35 38 **60** | 0 | 0 |
| 1 | 7 | 3 (10) | 60 > 10 ? oui | échange (7, 3) | 50 30 40 **60** 20 35 38 10 | 1 | 1 |
| 2 | 3 | 1 (30) | 60 > 30 ? oui | échange (3, 1) | 50 **60** 40 30 20 35 38 10 | 2 | 2 |
| 3 | 1 | 0 (50) | 60 > 50 ? oui | échange (1, 0) | **60** 50 40 30 20 35 38 10 | 3 | 3 |
| fin | 0 | | `i > 0` faux | c'est la racine, on s'arrête | 60 50 40 30 20 35 38 10 | 3 | 3 |

Le tas a 8 cases, donc 4 niveaux : 60 a fait 3 échanges, un par niveau franchi. C'est le pire cas, car 60 est le nouveau maximum. Une petite valeur (par exemple 5 au lieu de 60) se serait arrêtée dès la première comparaison (5 > 10 ? non) : 1 comparaison, 0 échange.

> [!warning] Les erreurs fréquentes
> - Mettre la nouvelle valeur à la racine : l'arbre n'est plus complet et toutes les cases devraient bouger.
> - Prendre `i / 2` comme parent : pour la case 2, `2 / 2 = 1`, qui est sa sœur et pas son parent (le bon calcul donne `(2 - 1) / 2 = 0`).
> - Oublier d'augmenter la taille : la valeur est dans le tableau mais pas dans le tas.

**À retenir :** insertion = ranger à la fin (taille + 1), puis échanger avec le parent tant que la valeur est plus grande que lui ; au plus un échange par niveau.

## 4. Retirer la racine : la descente

1. On **échange** la racine (le maximum) avec la **dernière case** du tas.
2. Le tas a maintenant **une case de moins** : l'ancien maximum est en dehors, à la fin.
3. La nouvelle racine est sans doute trop petite : on la fait **descendre**. Tant qu'elle a au moins un enfant **dans le tas** : on prend le **plus grand des deux enfants** ; s'il est plus grand qu'elle, on les échange et on continue depuis cet enfant, sinon on s'arrête.

```text
retirer la racine de  72 54 30 28 12 5      (taille 6)

5 54 30 28 12 | 72     échange 0 et 5, la taille passe à 5
54 5 30 28 12 | 72     enfants de 0 : 54 et 30, le plus grand 54 > 5, échange
54 28 30 5 12 | 72     enfants de 1 : 28 et 12, le plus grand 28 > 5, échange
                       5 est en 3 : son enfant serait en 7, hors du tas, fin
```

```c
void descendre(int *t, int taille, int i) {
    while (2 * i + 1 < taille) {
        int enfant = 2 * i + 1;
        if (enfant + 1 < taille && t[enfant + 1] > t[enfant]) {
            enfant = enfant + 1;
        }
        if (t[enfant] <= t[i]) {
            return;
        }
        echanger(t, i, enfant);
        i = enfant;
    }
}

int retirerRacine(int *t, int *taille) {
    *taille = *taille - 1;
    echanger(t, 0, *taille);
    descendre(t, *taille, 0);
    return t[*taille];
}
```

> [!warning] La bonne taille dans la descente
> La descente doit se faire avec la **nouvelle** taille (une case de moins). Avec l'ancienne, l'enfant qui sort du tas est justement l'ancien maximum, plus grand que tout : il est aussitôt remonté dans le tas.

Pourquoi le plus grand des deux enfants ? Il devient le parent de l'autre enfant : il doit donc être plus grand que lui. Là aussi, un échange par niveau au plus : **O(log n)**.

**Exemple résolu : retirer la racine du tas `90 70 80 30 60 75 20` (7 cases).**

Les crochets `[ ]` entourent le tas ; ce qui est après n'en fait plus partie. Une comparaison est comptée à chaque fois qu'on compare deux valeurs : les deux enfants entre eux (s'il y en a deux), puis le plus grand enfant avec la case qui descend.

| Étape | Case qui descend | Enfants dans le tas | Décision | Tableau après | Comparaisons | Échanges |
|---|---|---|---|---|---|---|
| 1 | | | échange racine et case 6, taille 7 → 6 | [20 70 80 30 60 75] 90 | 0 | 1 |
| 2 | case 0 (20) | cases 1 et 2 : 70 et 80 | plus grand 80 ; 80 > 20, échange (0, 2) | [80 70 **20** 30 60 75] 90 | 2 | 2 |
| 3 | case 2 (20) | case 5 seulement (75) : la case 6 est hors du tas | 75 > 20, échange (2, 5) | [80 70 75 30 60 **20**] 90 | 3 | 3 |
| 4 | case 5 (20) | aucun : 2 × 5 + 1 = 11 >= 6 | fin | [80 70 75 30 60 20] 90 | 3 | 3 |

La fonction renvoie 90, la taille vaut 6, et `80 70 75 30 60 20` est bien un tas max (le nouveau maximum 80 est à la racine).

**Avec la mauvaise taille.** Sur le tas `90 70 80 30 60 75` (6 cases), on échange la racine et la case 5 : `75 70 80 30 60 | 90`. Le tas a maintenant **5** cases.

- Descente avec la taille 5 (juste) : 75 descend sous 80 (case 2), puis la case 2 n'a pas d'enfant (5 >= 5). Résultat `80 70 75 30 60 | 90`. Correct.
- Descente avec l'ancienne taille 6 (faux) : après le premier échange, la case 2 croit avoir un enfant en case 5, qui contient **90**. 90 > 75 : échange. Résultat `80 70 90 30 60 | 75` : l'ancien maximum est revenu dans le tas, et c'est 75 qui est sorti.

> [!warning] Les erreurs fréquentes
> - Échanger toujours avec l'enfant gauche : si le droit est plus grand, il se retrouve sous une valeur plus petite que lui.
> - Oublier de tester que l'enfant droit existe (`enfant + 1 < taille`) : on lit une case hors du tas.
> - Continuer depuis `i` au lieu de l'enfant : il faut suivre la valeur qui descend (`i = enfant`).

**À retenir :** retrait de la racine = échange avec la dernière case, taille - 1, puis descente avec la **nouvelle** taille vers le plus grand enfant, tant qu'il est plus grand.

## 5. Construire un tas

### Par insertions successives

On considère que la case 0 seule est un tas, puis on « insère » les cases 1, 2, ..., n - 1 une par une avec `remonter`. Chaque insertion coûte O(log n) : **O(n log n)** en tout.

```c
for (int i = 1; i < n; i++) {
    remonter(t, i);
}
```

### En partant du bas (plus rapide)

Les feuilles (les cases sans enfant, à partir de `n / 2`) sont déjà des petits tas. On fait **descendre** chaque case qui a des enfants, de la dernière (`n / 2 - 1`) jusqu'à la racine :

```c
for (int i = n / 2 - 1; i >= 0; i--) {
    descendre(t, n, i);
}
```

La moitié des cases ne descend pas du tout, un quart d'un niveau au plus, un huitième de deux... Le total reste proportionnel à n : **O(n)**.

**Exemple résolu : construire le tas de `t = 5 3 8 9 1 7 6 4` (8 cases) en partant du bas.**

Les feuilles sont les cases 4 à 7 (à partir de `8 / 2 = 4`) : on ne les touche pas. On fait descendre les cases 3, 2, 1 puis 0, dans cet ordre. Les comparaisons et les échanges sont comptés depuis le début.

| Descente de | Ce qui se passe | Tableau après | Comparaisons | Échanges |
|---|---|---|---|---|
| départ | | 5 3 8 9 1 7 6 4 | 0 | 0 |
| case 3 (9) | un seul enfant : case 7 (4) ; 4 > 9 ? non, fin | 5 3 8 9 1 7 6 4 | 1 | 0 |
| case 2 (8) | enfants 7 et 6, le plus grand 7 ; 7 > 8 ? non, fin | 5 3 8 9 1 7 6 4 | 3 | 0 |
| case 1 (3) | enfants 9 et 1, le plus grand 9 ; 9 > 3, échange (1, 3) | 5 **9** 8 **3** 1 7 6 4 | 5 | 1 |
| ... suite, case 3 (3) | un seul enfant : case 7 (4) ; 4 > 3, échange (3, 7) | 5 9 8 **4** 1 7 6 **3** | 6 | 2 |
| case 0 (5) | enfants 9 et 8, le plus grand 9 ; 9 > 5, échange (0, 1) | **9 5** 8 4 1 7 6 3 | 8 | 3 |
| ... suite, case 1 (5) | enfants 4 et 1, le plus grand 4 ; 4 > 5 ? non, fin | 9 5 8 4 1 7 6 3 | 10 | 3 |

Résultat : le tas max `9 5 8 4 1 7 6 3`, en 10 comparaisons et 3 échanges. La racine 9 est bien le maximum.

**Pourquoi à rebours ?** Quand une case descend, ses deux sous-arbres doivent **déjà** être des tas, sinon elle peut s'arrêter au-dessus d'une valeur plus grande cachée plus bas. En allant de la case 0 vers la case 3, on obtient `8 9 7 4 1 5 6 3` : 9 est sous 8, ce n'est pas un tas. Et il faut aller **jusqu'à la case 0 comprise** (`i >= 0`) : sans la descente de la racine, ici, 5 resterait au-dessus de 9.

**Par insertions, on obtient un autre tas.** Avec `remonter` sur les cases 1 à 7, le même tableau devient `9 8 7 4 1 5 6 3` (10 comparaisons, 5 échanges). C'est aussi un tas max, mais pas le même : un tableau peut être rangé en tas de plusieurs façons. Si on te demande la méthode « en partant du bas », le résultat attendu est le premier.

**Pourquoi O(n) ?** Prends un tas de 15 cases (4 niveaux). Les 8 feuilles ne descendent pas, les 4 cases au-dessus descendent d'au plus 1 niveau, les 2 suivantes d'au plus 2, la racine d'au plus 3 : au plus 0 + 4 + 4 + 3 = **11** échanges, moins que 15. Avec les insertions, chacune des 8 feuilles du bas peut remonter de 3 niveaux à elle seule : déjà 24 échanges possibles.

**À retenir :** construction en partant du bas = `descendre(t, n, i)` pour `i` de `n / 2 - 1` jusqu'à 0 compris, dans cet ordre ; O(n).

## 6. Le tri par tas

1. **Construire** un tas max avec tout le tableau.
2. **Retirer la racine** n - 1 fois : à chaque fois, le maximum du tas part dans la **dernière case du tas**, juste devant les valeurs déjà rangées. Le tas rétrécit d'une case, la zone triée grandit d'une case.

```text
tas max : 9 5 8 1 3 | (rien de trié)

échange 0 et 4, descente sur 4 cases   ->  8 5 3 1 | 9
échange 0 et 3, descente sur 3 cases   ->  5 1 3 | 8 9
échange 0 et 2, descente sur 2 cases   ->  3 1 | 5 8 9
échange 0 et 1, descente sur 1 case    ->  1 | 3 5 8 9
                                           1 3 5 8 9   trié
```

```c
#include <stdio.h>

void echanger(int *t, int i, int j) {
    int temporaire = t[i];
    t[i] = t[j];
    t[j] = temporaire;
}

void descendre(int *t, int taille, int i) {
    while (2 * i + 1 < taille) {
        int enfant = 2 * i + 1;
        if (enfant + 1 < taille && t[enfant + 1] > t[enfant]) {
            enfant = enfant + 1;
        }
        if (t[enfant] <= t[i]) {
            return;
        }
        echanger(t, i, enfant);
        i = enfant;
    }
}

void triParTas(int *t, int n) {
    for (int i = n / 2 - 1; i >= 0; i--) {
        descendre(t, n, i);
    }
    for (int fin = n - 1; fin > 0; fin--) {
        echanger(t, 0, fin);
        descendre(t, fin, 0);
    }
}

int main(void) {
    int t[] = {5, 9, 1, 8, 3};
    triParTas(t, 5);
    for (int i = 0; i < 5; i++) {
        printf("%d ", t[i]);
    }
    printf("\n");
    return 0;
}
```

> [!tip] Les bornes de la deuxième boucle
> `fin` est la dernière case du tas : on l'échange avec la racine, puis le tas ne garde que les cases `[0, fin)`, d'où `descendre(t, fin, 0)`. On s'arrête après `fin == 1` : il ne reste alors qu'une case dans le tas, le minimum, déjà à sa place.

> [!info] Tas max pour trier dans l'ordre croissant
> Chaque maximum est rangé **à la fin** : un tas max donne un tableau croissant. Avec un tas min, le même algorithme range les minimums à la fin : le tableau finit dans l'ordre **décroissant**.

**Exemple résolu : trier `6 2 9 4 7 1` (6 cases), en comptant tout.**

Les crochets `[ ]` entourent le tas ; à droite, les cases déjà rangées. Comparaisons et échanges sont comptés depuis le début (dans une descente : une comparaison entre les deux enfants s'il y en a deux, puis une entre le plus grand enfant et la case).

*Étape 1, construction (descentes des cases 2, 1, 0) :*

| Tamisage | Ce qui se passe | Tableau après | Comparaisons | Échanges |
|---|---|---|---|---|
| départ | | [6 2 9 4 7 1] | 0 | 0 |
| case 2 (9) | un seul enfant, 1 ; 1 > 9 ? non | [6 2 9 4 7 1] | 1 | 0 |
| case 1 (2) | enfants 4 et 7, le plus grand 7 > 2 : échange (1, 4) ; la case 4 n'a pas d'enfant | [6 **7** 9 4 **2** 1] | 3 | 1 |
| case 0 (6) | enfants 7 et 9, le plus grand 9 > 6 : échange (0, 2) ; puis enfant 1 ; 1 > 6 ? non | [**9** 7 **6** 4 2 1] | 6 | 2 |

*Étape 2, rangement (pour `fin` de 5 à 1 : échange (0, fin), puis descente sur `fin` cases) :*

| `fin` | Échange puis descente | Tableau après | Comparaisons | Échanges |
|---|---|---|---|---|
| 5 | 9 part en case 5 ; 1 descend sous 7, puis sous 4 | [7 4 6 1 2] 9 | 10 | 5 |
| 4 | 7 part en case 4 ; 2 descend sous 6 | [6 4 2 1] 7 9 | 12 | 7 |
| 3 | 6 part en case 3 ; 1 descend sous 4 | [4 1 2] 6 7 9 | 14 | 9 |
| 2 | 4 part en case 2 ; 2 a un enfant, 1, plus petit : rien | [2 1] 4 6 7 9 | 15 | 10 |
| 1 | 2 part en case 1 ; tas d'une case, pas de descente | [1] 2 4 6 7 9 | 15 | 11 |

Résultat `1 2 4 6 7 9`, en 15 comparaisons et 11 échanges. Remarque : à chaque ligne, la valeur qui part à droite est le maximum du tas, donc la zone de droite est toujours triée.

Le programme ci-dessous affiche exactement ces lignes (le `]` marque la fin du tas) :

```c
#include <stdio.h>

int comparaisons = 0;
int echanges = 0;

void echanger(int *t, int i, int j) {
    int temporaire = t[i];
    t[i] = t[j];
    t[j] = temporaire;
    echanges++;
}

void descendre(int *t, int taille, int i) {
    while (2 * i + 1 < taille) {
        int enfant = 2 * i + 1;
        if (enfant + 1 < taille) {
            comparaisons++;
            if (t[enfant + 1] > t[enfant]) {
                enfant = enfant + 1;
            }
        }
        comparaisons++;
        if (t[enfant] <= t[i]) {
            return;
        }
        echanger(t, i, enfant);
        i = enfant;
    }
}

void afficher(const char *etape, const int *t, int n, int taille) {
    printf("%-22s [", etape);
    for (int i = 0; i < n; i++) {
        if (i == taille) {
            printf("]");
        }
        printf(" %d", t[i]);
    }
    if (taille == n) {
        printf(" ]");
    }
    printf("   %2d comparaisons, %2d echanges\n", comparaisons, echanges);
}

int main(void) {
    int t[] = {6, 2, 9, 4, 7, 1};
    int n = 6;
    char etape[32];
    afficher("depart", t, n, n);
    for (int i = n / 2 - 1; i >= 0; i--) {
        descendre(t, n, i);
        snprintf(etape, sizeof etape, "descente de la case %d", i);
        afficher(etape, t, n, n);
    }
    for (int fin = n - 1; fin > 0; fin--) {
        echanger(t, 0, fin);
        descendre(t, fin, 0);
        snprintf(etape, sizeof etape, "fin = %d", fin);
        afficher(etape, t, n, fin);
    }
    return 0;
}
```

### Les bornes, quand les fonctions reçoivent une taille

On peut aussi écrire le tri avec deux fonctions qui reçoivent la **taille du tas** : « insérer la case `taille - 1` dans un tas de `taille - 1` cases » (le tas a ensuite `taille` cases) et « retirer la racine d'un tas de `taille` cases » (la racine part en case `taille - 1`). Il faut alors bien choisir les valeurs de `taille`.

**Exemple résolu avec `n = 4` :**

- **Insertions.** Le tas d'une case (la case 0) n'a besoin de rien. On ajoute la case 1 (le tas passe à `taille = 2`), puis la case 2 (`taille = 3`), puis la case 3 (`taille = 4`). Donc `taille` va de **2 à n**. S'arrêter à `n - 1` laisserait la dernière case hors du tas.
- **Retraits.** On retire la racine du tas de 4 cases (elle part en case 3), puis de 3 cases (case 2), puis de 2 cases (case 1). Le tas d'une case qui reste est le minimum, déjà à sa place. Donc `taille` va de **n à 2**. S'arrêter à 3 laisserait un tas de 2 cases rangé « le plus grand devant », par exemple `2 1 | 3 4` : pas trié.

Ces deux boucles font chacune `n - 1` tours, comme la boucle `for (int fin = n - 1; fin > 0; fin--)` du code au-dessus (où `fin` vaut `taille - 1`).

**À retenir :** tri par tas = construire le tas, puis `n - 1` fois : racine en fin de tas, tas d'une case de moins, descente ; avec des tailles, les tours vont de 2 à `n` (insertions) et de `n` à 2 (retraits).

### Avec un tas min : les k plus petites valeurs

Un **tas min** marche exactement comme un tas max, avec les comparaisons retournées : chaque parent est **plus petit ou égal** à ses enfants, le minimum est à la racine, et la descente échange avec le **plus petit** des deux enfants s'il est plus petit que la case.

Pour obtenir les `k` plus petites valeurs dans l'ordre, pas besoin de tout trier : on construit un tas min (O(n)), puis on retire la racine `k` fois (O(log n) chacune). Total : **O(n + k log n)**, bien moins que O(n log n) quand `k` est petit.

**Exemple résolu :** `t = 6 3 8 1 9 5`, `k = 2`.

*Construction du tas min* (descentes des cases 2, 1, 0) :

| Tamisage | Ce qui se passe | Tableau après |
|---|---|---|
| départ | | 6 3 8 1 9 5 |
| case 2 (8) | un seul enfant, 5 ; 5 < 8 : échange (2, 5) | 6 3 **5** 1 9 **8** |
| case 1 (3) | enfants 1 et 9, le plus petit 1 < 3 : échange (1, 3) | 6 **1** 5 **3** 9 8 |
| case 0 (6) | enfants 1 et 5, le plus petit 1 < 6 : échange (0, 1) ; puis enfants 3 et 9, le plus petit 3 < 6 : échange (1, 3) | **1 3** 5 **6** 9 8 |

*Deux retraits* (on note la racine, taille - 1, échange de la racine avec la dernière case du tas, descente) :

| Retrait | Valeur notée | Ce qui se passe | Tableau après | Résultat |
|---|---|---|---|---|
| 1 | 1 | échange (0, 5) : 8 en haut ; 8 descend sous 3, puis sous 6 | [3 6 5 8 9] 1 | 1 |
| 2 | 3 | échange (0, 4) : 9 en haut ; 9 descend sous 5 | [5 6 9 8] 3 1 | 1 3 |

Les deux plus petites valeurs sont **1 et 3**, dans l'ordre. Il reste un tas min de 4 cases (`5 6 9 8`), prêt pour un éventuel troisième retrait. Vérification : trié, le tableau serait `1 3 5 6 8 9`.

**À retenir :** pour les `k` plus petites, construis un tas **min** puis retire `k` fois la racine ; c'est O(n + k log n).

## 7. Combien ça coûte ?

| Opération | Coût |
|---|---|
| lire le maximum (`t[0]`) | O(1) |
| insérer (remontée) | O(log n) |
| retirer la racine (descente) | O(log n) |
| construire par insertions | O(n log n) |
| construire en partant du bas | O(n) |
| tri par tas | **O(n log n)**, meilleur, moyen et pire cas |

Le coût d'une remontée ou d'une descente dépend de la **hauteur** de l'arbre : comme il est complet, elle vaut environ log₂ n (un tas d'un million de cases a 20 niveaux).

**Exemple résolu : combien de niveaux pour n cases ?** Le niveau 0 a 1 case (la racine), le niveau 1 en a 2, le niveau 2 en a 4, et chaque niveau double :

| Niveaux pleins | Cases en tout |
|---|---|
| 1 | 1 |
| 2 | 1 + 2 = 3 |
| 3 | 1 + 2 + 4 = 7 |
| 4 | 1 + 2 + 4 + 8 = 15 |
| 10 | 1 023 |
| 20 | 1 048 575 |

Un million de cases tient donc dans 20 niveaux : une insertion ou un retrait fait **au plus 20 échanges**, alors qu'un parcours du tableau ferait un million de pas. Le tri par tas fait n - 1 retraits de ce genre : au plus n × log₂ n échanges, quel que soit l'ordre de départ. C'est pour ça qu'il n'a **pas** de pire cas en O(n²), contrairement au tri rapide.

- **Mémoire** : tout se fait dans le tableau, par échanges : le tri par tas est **en place**, O(1) en plus (et pas de récursivité).
- **Stabilité** : il **n'est pas stable**. Les échanges entre la racine et la fin du tas déplacent les valeurs très loin, et deux valeurs égales peuvent s'inverser.

```text
3a 3b 1      déjà un tas max (3a >= 3b, 3a >= 1)
échange 0 et 2 : 1 3b | 3a      descente : 3b 1 | 3a
échange 0 et 1 : 1 | 3b 3a      résultat : 1 3b 3a   (3b est passé devant 3a)
```

Le même exemple, ligne par ligne (`3a` et `3b` valent tous les deux 3, `a` était avant `b`) :

| Étape | Ce qui se passe | Tableau après |
|---|---|---|
| construction | case 0 : enfants 3b et 1, le plus grand est 3b, mais 3b > 3a est faux : rien | [3a 3b 1] |
| `fin = 2` | échange (0, 2) : 3a part au bout ; 1 descend sous 3b | [3b 1] 3a |
| `fin = 1` | échange (0, 1) : 3b part en case 1 | [1] 3b 3a |

À la fin, `3b` est devant `3a` : l'ordre de départ des deux 3 est inversé. Le premier 3 retiré du tas (`3a`) a été envoyé tout au bout, le second (`3b`) juste devant lui.

**À retenir :** tri par tas = O(n log n) dans tous les cas, en place (O(1) en plus, pas de récursivité), mais pas stable.

## 8. Les trois tris efficaces du cours

| | Tri fusion | Tri rapide | Tri par tas |
|---|---|---|---|
| Temps moyen | O(n log n) | O(n log n) | O(n log n) |
| Pire cas | O(n log n) | **O(n²)** | O(n log n) |
| Mémoire en plus | O(n) | pile d'appels | **O(1)** |
| Stable | oui | non | non |
| En pratique | sûr, stable | souvent le plus rapide | garanti et sans mémoire, mais saute partout dans le tableau |

## À retenir

| | Tas binaire et tri par tas |
|---|---|
| Tas max | arbre complet, chaque nœud >= ses enfants, maximum à la racine |
| Dans un tableau | enfants `2i + 1` et `2i + 2`, parent `(i - 1) / 2` |
| Insertion | à la fin, puis **remontée** tant que plus grand que le parent, O(log n) |
| Retrait de la racine | échange avec la dernière case, taille - 1, **descente** vers le plus grand enfant, O(log n) |
| Construction | insertions O(n log n), ou descentes de `n / 2 - 1` à 0 en O(n) |
| Tri par tas | construire, puis échanger la racine avec la fin du tas et descendre, O(n log n) toujours |
| Mémoire / stabilité | en place, **non stable** |
