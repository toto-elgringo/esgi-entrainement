# Tris simples

Trier un tableau, c'est ranger ses valeurs dans l'ordre croissant. Le chapitre précédent a montré ce qu'on y gagne : minimum en O(1), recherche en O(log n). Ce chapitre présente six tris **simples à écrire**, qui font tous de l'ordre de **n²** comparaisons dans le pire cas. Ils sont lents sur de gros tableaux, mais très utiles pour comprendre les idées qu'on retrouve dans les tris rapides (tri fusion, tri rapide).

Pour comparer les tris entre eux, on suit presque partout le **même tableau** : `6 3 8 2 5` (5 cases). À chaque fois, on compte :

- les **comparaisons** : combien de fois on a comparé deux valeurs (`tab[j] > tab[j + 1]`, `tab[j] < tab[pos_min]`…) ;
- les **échanges** (ou les **décalages** pour le tri par insertion) : combien de fois on a déplacé des valeurs.

## 0. Le vocabulaire

- Un tri **en place** n'utilise pas de deuxième tableau : il range les valeurs en les déplaçant à l'intérieur du tableau (mémoire en plus : O(1)). Les six tris de ce chapitre sont en place.
- Un tri est **stable** si deux valeurs **égales** gardent leur ordre de départ. Avec des nombres seuls, on ne voit pas la différence. Avec des fiches triées par note, si : un tri stable garde, pour une même note, l'ordre alphabétique obtenu avant.
- Le **meilleur cas** et le **pire cas** : le temps peut dépendre de l'ordre de départ. Un tableau déjà trié est souvent le meilleur cas, un tableau trié à l'envers le pire.

**Exemple résolu : stable ou pas ?** Trois fiches rangées par ordre alphabétique : `Anna 14`, `Marc 10`, `Sami 14`. On les trie par note croissante. Deux tris différents donnent :

| Résultat | Les deux fiches à 14 | Stable ? |
|---|---|---|
| `Marc 10`, `Anna 14`, `Sami 14` | Anna est toujours avant Sami, comme au départ | oui |
| `Marc 10`, `Sami 14`, `Anna 14` | Sami est passé devant Anna | non |

Les deux résultats sont bien triés par note : seule la stabilité les distingue. Elle ne dit **rien** sur la vitesse ni sur la mémoire utilisée.

**À retenir :** pour juger la stabilité, ne regarde que les valeurs **égales** : ont-elles gardé leur ordre de départ ?

### Échanger deux cases

Presque tous ces tris échangent deux cases. En C, une fonction ne peut modifier les variables de l'appelant que par leurs **adresses** :

```c
void echanger(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}
```

On l'appelle avec `echanger(&tab[i], &tab[j])`. Sans `temp`, `*a = *b; *b = *a;` écrit deux fois la même valeur : l'ancienne valeur de `*a` est perdue.

**Exemple résolu : `echanger(&x, &y)` avec `x = 4` et `y = 10`.** Dans la fonction, `a` contient l'adresse de `x`, donc `*a` **est** `x` ; de même `*b` est `y`. On suit les valeurs ligne par ligne :

| Ligne exécutée | `temp` | `x` (c'est `*a`) | `y` (c'est `*b`) |
|---|---|---|---|
| au début | (pas encore) | 4 | 10 |
| `int temp = *a;` | 4 | 4 | 10 |
| `*a = *b;` | 4 | 10 | 10 |
| `*b = temp;` | 4 | 10 | 4 |

Sans `temp` : `*a = *b;` donne `x = 10`, puis `*b = *a;` recopie ce 10 dans `y`. On obtient `10 10` : le 4 a disparu.

Et si on passe les valeurs au lieu des adresses ? La fonction reçoit des **copies** : elle échange ses copies, les variables de l'appelant ne bougent pas. Le programme ci-dessous le montre, et vérifie aussi qu'échanger une variable avec elle-même ne change rien (`temp` garde la valeur, puis la remet).

```c
#include <stdio.h>

void echanger_copies(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
    printf("dans echanger_copies : a = %d, b = %d\n", a, b);
}

void echanger(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(void) {
    int x = 4;
    int y = 10;
    echanger_copies(x, y);
    printf("après echanger_copies : x = %d, y = %d\n", x, y);
    echanger(&x, &y);
    printf("après echanger : x = %d, y = %d\n", x, y);
    echanger(&x, &x);
    printf("après echanger(&x, &x) : x = %d\n", x);
    return 0;
}
```

```text
dans echanger_copies : a = 10, b = 4
après echanger_copies : x = 4, y = 10
après echanger : x = 10, y = 4
après echanger(&x, &x) : x = 10
```

**À retenir :** pour qu'une fonction modifie les variables de l'appelant, passe leurs **adresses** (`&x`) et écris dans `*a` ; pour échanger, mets toujours l'ancienne valeur de côté dans `temp`.

## 1. Le tri par sélection

**Idée** : à chaque étape, on **sélectionne** le minimum de la partie pas encore triée et on le place à la fin de la partie triée (en l'échangeant avec la première case non triée).

```anim
tri
algo: selection
```

**Exemple résolu : tri par sélection de `6 3 8 2 5`.** À l'étape `i`, les cases `0` à `i - 1` sont triées et ne bougeront plus. On cherche le minimum des cases `i` à `4`, puis on l'échange avec la case `i` (seulement s'il n'y est pas déjà). En gras : la partie triée après l'étape.

| Étape `i` | Partie regardée | Comparaisons | Minimum trouvé | Échange | Tableau après |
|---|---|---|---|---|---|
| 0 | `6 3 8 2 5` | 4 | 2 (case 3) | case 0 et case 3 | **2** 3 8 6 5 |
| 1 | `3 8 6 5` | 3 | 3 (case 1) | aucun, il est déjà en case 1 | **2 3** 8 6 5 |
| 2 | `8 6 5` | 2 | 5 (case 4) | case 2 et case 4 | **2 3 5** 6 8 |
| 3 | `6 8` | 1 | 6 (case 3) | aucun | **2 3 5 6** 8 |

La dernière case (8) est forcément à sa place : il n'y a pas d'étape 4. Bilan : 4 + 3 + 2 + 1 = **10 comparaisons** et seulement **2 échanges**.

Sur le tableau déjà trié `1 3 4 7 9`, on fait **encore 10 comparaisons** (il faut bien regarder toute la partie restante pour être sûr d'avoir le minimum), mais **0 échange** : à chaque étape, le minimum est déjà dans la case `i`.

```c
#include <stdio.h>

void echanger(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void tri_selection(int *tab, size_t n) {
    for (size_t i = 0; i + 1 < n; i++) {
        size_t pos_min = i;
        for (size_t j = i + 1; j < n; j++) {
            if (tab[j] < tab[pos_min]) {
                pos_min = j;
            }
        }
        if (pos_min != i) {
            echanger(&tab[i], &tab[pos_min]);
        }
    }
}

int main(void) {
    int tab[] = {5, 2, 9, 1, 7};
    tri_selection(tab, 5);
    for (size_t i = 0; i < 5; i++) {
        printf("%d ", tab[i]);
    }
    printf("\n");
    return 0;
}
```

- On garde la **position** du minimum (`pos_min`), pas seulement sa valeur : c'est elle qui permet l'échange.
- `if (pos_min != i)` évite d'échanger une case avec elle-même : sur un tableau déjà trié, aucun échange n'est fait.
- `i + 1 < n` veut dire « `i < n - 1` », mais sans soustraction : avec un `size_t`, `n - 1` vaut un nombre énorme quand `n` vaut 0.

**Coût** : la recherche du minimum regarde `n - 1`, puis `n - 2`, … puis 1 case. En tout `n(n - 1) / 2` comparaisons, **quel que soit l'ordre de départ** : O(n²) dans le meilleur comme dans le pire cas. En revanche, **au plus n - 1 échanges** (un par étape au maximum) : c'est le tri qui déplace le moins les valeurs.

> [!warning] Pas stable
> L'échange envoie une valeur loin, par-dessus ses égales. Avec `2a 2b 1` (deux 2 notés a et b), le minimum 1 est échangé avec la case 0 : on obtient `1 2b 2a`. Les deux 2 ont changé d'ordre.

**À retenir :** sélection = « trouver la position du minimum du reste, l'échanger avec la première case du reste » ; toujours `n(n - 1) / 2` comparaisons, au plus `n - 1` échanges, pas stable.

## 2. Le tri à bulles

**Idée** : on parcourt le tableau du début vers la fin en comparant chaque case à sa **voisine** ; si elles sont dans le mauvais ordre, on les échange. À la fin d'un passage, la plus grande valeur est arrivée au bout, comme une bulle qui remonte dans un verre. On recommence sur le reste.

```anim
tri
algo: bulles
```

**Exemple résolu : le premier passage sur `6 3 8 2 5`, comparaison par comparaison.**

| Comparaison | Cases comparées | Valeurs | Mal rangées ? | Tableau après |
|---|---|---|---|---|
| 1 | 0 et 1 | 6 et 3 | oui (6 > 3) : échange | 3 6 8 2 5 |
| 2 | 1 et 2 | 6 et 8 | non | 3 6 8 2 5 |
| 3 | 2 et 3 | 8 et 2 | oui : échange | 3 6 2 8 5 |
| 4 | 3 et 4 | 8 et 5 | oui : échange | 3 6 2 5 **8** |

Le 8 a gagné toutes ses comparaisons à partir de la case 2 : il a été poussé jusqu'au bout. La dernière case est maintenant définitive.

**Tous les passages** (la zone à trier raccourcit d'une case à chaque fois) :

| Passage | Zone regardée | Comparaisons | Échanges | Tableau après |
|---|---|---|---|---|
| 1 | cases 0 à 4 | 4 | 3 | 3 6 2 5 **8** |
| 2 | cases 0 à 3 | 3 | 2 | 3 2 5 **6 8** |
| 3 | cases 0 à 2 | 2 | 1 | 2 3 **5 6 8** |
| 4 | cases 0 et 1 | 1 | 0 | **2 3 5 6 8** |

Bilan : 4 + 3 + 2 + 1 = **10 comparaisons** et 3 + 2 + 1 + 0 = **6 échanges**. Sur `1 3 4 7 9` (déjà trié), le passage 1 fait 4 comparaisons et **0 échange** : avec l'arrêt anticipé (expliqué juste en dessous), on s'arrête là, soit `n - 1` comparaisons.

Après le passage `k`, les `k` dernières cases sont triées : le passage suivant peut s'arrêter avant elles. Et si un passage n'a fait **aucun échange**, tout est trié : on s'arrête (**arrêt anticipé**).

```c
void tri_bulles(int *tab, size_t n) {
    for (size_t fin = n; fin > 1; fin--) {
        int echange = 0;
        for (size_t j = 0; j + 1 < fin; j++) {
            if (tab[j] > tab[j + 1]) {
                echanger(&tab[j], &tab[j + 1]);
                echange = 1;
            }
        }
        if (!echange) {
            return;
        }
    }
}
```

- `fin` est la taille de la zone pas encore triée : `n` au premier passage, puis une case de moins à chaque fois.
- `echange` est remis à 0 **au début de chaque passage**, et passe à 1 dès qu'on échange. Un passage qui finit avec `echange == 0` n'a trouvé aucun voisin mal rangé : le tableau est trié.

**Coût** : pire cas (trié à l'envers) `n(n - 1) / 2` comparaisons et autant d'échanges, O(n²). Pour 5 cases, on ne peut donc jamais dépasser 4 + 3 + 2 + 1 = 10 comparaisons. Meilleur cas (déjà trié) : un seul passage sans échange, **O(n)**, grâce à l'arrêt anticipé. Sans lui, on fait tous les passages même sur un tableau trié.

Le tri à bulles est **stable** : il n'échange que des voisins **strictement** dans le désordre (`>`), donc deux valeurs égales ne se doublent jamais.

> [!info] Lièvres et tortues
> Une grande valeur au début (un **lièvre**) remonte jusqu'au bout en un seul passage. Une petite valeur à la fin (une **tortue**) ne recule que **d'une case par passage** : `2 3 4 5 6 1` demande 5 passages. Le tri cocktail et le tri à peigne ont été inventés pour accélérer les tortues.

**Exemple résolu : la tortue de `3 4 5 6 7 2`.** Le 2 est tout au bout.

| Passage | Comparaisons | Échanges | Tableau après | Position du 2 |
|---|---|---|---|---|
| 1 | 5 | 1 | 3 4 5 6 2 7 | case 4 |
| 2 | 4 | 1 | 3 4 5 2 6 7 | case 3 |
| 3 | 3 | 1 | 3 4 2 5 6 7 | case 2 |
| 4 | 2 | 1 | 3 2 4 5 6 7 | case 1 |
| 5 | 1 | 1 | 2 3 4 5 6 7 | case 0 |

Chaque passage fait un échange, donc l'arrêt anticipé ne sert à rien : **15 comparaisons**, autant que pour un tableau à l'envers, alors qu'une seule valeur était mal placée.

> [!warning] Le voisin qui n'existe pas
> Avec `for (j = 0; j < fin; j++)`, le dernier tour compare `tab[fin - 1]` à `tab[fin]`, une case **hors** de la zone (et hors du tableau au premier passage). La borne est `j + 1 < fin` : `j + 1` doit rester une vraie case.

**À retenir :** bulles = comparer chaque case à sa voisine de droite et échanger si `>` ; la zone raccourcit d'une case par passage ; on s'arrête après un passage sans échange.

## 3. Le tri par insertion

**Idée** : celle du joueur de cartes qui range sa main. La partie gauche est déjà triée ; on prend la première valeur non triée et on l'**insère** à sa place dans la partie triée, en décalant d'une case vers la droite les valeurs plus grandes.

```anim
tri
algo: insertion
```

**Exemple résolu : tri par insertion de `6 3 8 2 5`.** Au départ, la partie triée est la case 0 seule (`6`). On insère les valeurs suivantes une par une ; une comparaison = « la valeur de gauche est-elle plus grande que celle qu'on insère ? ».

| Valeur insérée | Partie triée avant | Comparaisons faites | Décalages | Tableau après |
|---|---|---|---|---|
| 3 | `6` | 6 > 3 ? oui | 1 (le 6) | **3 6** 8 2 5 |
| 8 | `3 6` | 6 > 8 ? non : stop | 0 | **3 6 8** 2 5 |
| 2 | `3 6 8` | 8 > 2 ? oui ; 6 > 2 ? oui ; 3 > 2 ? oui ; bord atteint | 3 | **2 3 6 8** 5 |
| 5 | `2 3 6 8` | 8 > 5 ? oui ; 6 > 5 ? oui ; 3 > 5 ? non : stop | 2 | **2 3 5 6 8** |

Bilan : 1 + 1 + 3 + 3 = **8 comparaisons** et 1 + 0 + 3 + 2 = **6 décalages**. Pour le 2, la boucle s'arrête parce qu'on a atteint la case 0 (`j > 0` est faux), sans comparaison de plus.

**Le détail d'une insertion : on insère 2 dans `3 6 8`.** On met `valeur = 2` de côté, `j` part de la case du 2 (case 3) :

| `j` | Test | Action | Tableau |
|---|---|---|---|
| 3 | `tab[2]` = 8 > 2 | recopier 8 en case 3, `j` devient 2 | 3 6 8 8 5 |
| 2 | `tab[1]` = 6 > 2 | recopier 6 en case 2, `j` devient 1 | 3 6 6 8 5 |
| 1 | `tab[0]` = 3 > 2 | recopier 3 en case 1, `j` devient 0 | 3 3 6 8 5 |
| 0 | `j > 0` est faux | on sort, `tab[0] = valeur` | 2 3 6 8 5 |

Pendant le décalage, une valeur apparaît deux fois : c'est normal, la case de gauche sera écrasée au tour suivant (ou par `valeur` à la fin).

Sur `1 3 4 7 9` (déjà trié), chaque insertion fait **une seule** comparaison (la valeur de gauche est plus petite, on s'arrête tout de suite) et 0 décalage : 4 comparaisons, soit `n - 1`.

On part de la **droite** de la partie triée : tant que la valeur de gauche est plus grande, on la décale. On cherche la place et on fait le décalage en même temps.

```c
void tri_insertion(int *tab, size_t n) {
    for (size_t i = 1; i < n; i++) {
        int valeur = tab[i];
        size_t j = i;
        while (j > 0 && tab[j - 1] > valeur) {
            tab[j] = tab[j - 1];
            j--;
        }
        tab[j] = valeur;
    }
}
```

- `valeur` est mise de côté **avant** le décalage, qui écrase `tab[i]`.
- `j > 0` est testé **en premier** : si `j` vaut 0, `tab[j - 1]` n'est pas lu (le `&&` s'arrête dès que la première condition est fausse).
- Il n'y a **pas d'échange** : un décalage est une seule écriture (`tab[j] = tab[j - 1]`), un échange en demande trois.

**Coût** : pire cas (trié à l'envers), chaque valeur traverse toute la partie triée : `n(n - 1) / 2` décalages, O(n²). Meilleur cas (déjà trié), la boucle `while` s'arrête tout de suite : **O(n)**. Sur un tableau **presque trié**, il est très rapide : c'est pour ça qu'on l'utilise pour les petits tableaux, et pour finir le travail d'autres tris.

Il est **stable** grâce au `>` strict : une valeur s'arrête dès qu'elle rencontre une égale, et reste donc **après** elle.

> [!warning] Chercher la place depuis le début
> Autre façon d'écrire : chercher la position depuis la case 0 (`while (pos < i && tab[pos] < valeur) pos++;`), puis insérer. Deux défauts :
> - même sur un tableau déjà trié, on parcourt toute la partie triée à chaque fois : le meilleur cas devient O(n²) ;
> - avec `<`, la valeur s'arrête **devant** la première égale : le tri n'est **plus stable**. Il faudrait `<=`.

### Trier des structures de façon stable

On trie souvent des **fiches** (des structures) selon un seul de leurs champs. Le tri par insertion marche tel quel : `colis[i].poids` est le champ comparé, et une structure se copie **en entier** avec `=` (`Colis c = colis[i];` puis `colis[j] = c;`).

**Exemple résolu : des colis rangés par ville, à trier par poids croissant**, en gardant l'ordre des villes à poids égal. Départ : `Brest 3`, `Dijon 1`, `Lille 3`, `Nancy 2`, `Rouen 1`.

| Colis inséré | On décale tant que le poids de gauche est **strictement** plus grand | Résultat |
|---|---|---|
| Dijon 1 | Brest 3 > 1 : décalé ; bord atteint | Dijon 1, Brest 3 |
| Lille 3 | Brest 3 > 3 ? non (égal) : stop | Dijon 1, Brest 3, Lille 3 |
| Nancy 2 | Lille 3 et Brest 3 décalés ; Dijon 1 > 2 ? non : stop | Dijon 1, Nancy 2, Brest 3, Lille 3 |
| Rouen 1 | Lille, Brest, Nancy décalés ; Dijon 1 > 1 ? non (égal) : stop | Dijon 1, Rouen 1, Nancy 2, Brest 3, Lille 3 |

Lille s'est arrêté **derrière** Brest, Rouen derrière Dijon : à poids égal, l'ordre des villes est gardé. Avec `>=`, Lille serait passé devant Brest et le tri ne serait plus stable.

```c
#include <stdio.h>

typedef struct {
    const char *nom;
    int poids;
} Colis;

void trier_par_poids(Colis *colis, size_t n) {
    for (size_t i = 1; i < n; i++) {
        Colis c = colis[i];
        size_t j = i;
        while (j > 0 && colis[j - 1].poids > c.poids) {
            colis[j] = colis[j - 1];
            j--;
        }
        colis[j] = c;
    }
}

int main(void) {
    Colis colis[] = {
        {"Brest", 3},
        {"Dijon", 1},
        {"Lille", 3},
        {"Nancy", 2},
        {"Rouen", 1},
    };
    size_t n = sizeof colis / sizeof colis[0];
    trier_par_poids(colis, n);
    for (size_t i = 0; i < n; i++) {
        printf("%s %d\n", colis[i].nom, colis[i].poids);
    }
    return 0;
}
```

Pour un ordre **décroissant** (du plus lourd au plus léger), on retourne seulement la comparaison : on décale tant que le poids de gauche est **strictement plus petit** (`colis[j - 1].poids < c.poids`). Le mot important reste « strictement » : c'est lui qui garde la stabilité.

**À retenir :** insertion = mettre la valeur de côté, décaler vers la droite les valeurs **strictement** plus grandes en partant de la droite, puis écrire la valeur dans le trou ; O(n) sur un tableau trié, stable.

## 4. Le tri pair-impair

C'est un tri à bulles où les comparaisons de voisins sont faites **par paires qui ne se touchent pas**. Un tour se fait en deux phases :

1. phase **paire** : on compare (et échange si besoin) les paires `(0, 1)`, `(2, 3)`, `(4, 5)`… ;
2. phase **impaire** : les paires `(1, 2)`, `(3, 4)`, `(5, 6)`…

On recommence jusqu'à un tour **sans aucun échange**.

« Pair » et « impair » parlent de l'**indice de la première case** de chaque paire, pas des valeurs : on ne trie pas les nombres pairs à part.

**Exemple résolu : tri pair-impair de `6 3 8 2 5`.**

| Tour | Phase | Paires comparées | Comparaisons | Échanges | Tableau après |
|---|---|---|---|---|---|
| 1 | paire | (0, 1) (2, 3) | 2 | 2 (6 et 3, 8 et 2) | 3 6 2 8 5 |
| 1 | impaire | (1, 2) (3, 4) | 2 | 2 (6 et 2, 8 et 5) | 3 2 6 5 8 |
| 2 | paire | (0, 1) (2, 3) | 2 | 2 (3 et 2, 6 et 5) | 2 3 5 6 8 |
| 2 | impaire | (1, 2) (3, 4) | 2 | 0 | 2 3 5 6 8 |
| 3 | paire | (0, 1) (2, 3) | 2 | 0 | 2 3 5 6 8 |
| 3 | impaire | (1, 2) (3, 4) | 2 | 0 | 2 3 5 6 8 |

Le tableau est trié dès le tour 2, mais le tour 2 a fait des échanges : on ne peut pas encore le savoir. Le tour 3, **sans aucun échange**, le prouve : on s'arrête. Bilan : **12 comparaisons**, 6 échanges. Un tour complet compare `n - 1` paires (ici 2 + 2 = 4).

```c
void tri_pair_impair(int *tab, size_t n) {
    int echange = 1;
    while (echange) {
        echange = 0;
        for (size_t i = 0; i + 1 < n; i += 2) {
            if (tab[i] > tab[i + 1]) {
                echanger(&tab[i], &tab[i + 1]);
                echange = 1;
            }
        }
        for (size_t i = 1; i + 1 < n; i += 2) {
            if (tab[i] > tab[i + 1]) {
                echanger(&tab[i], &tab[i + 1]);
                echange = 1;
            }
        }
    }
}
```

**Pourquoi la borne `i + 1 < n` ?** Chaque paire lit `tab[i]` **et** `tab[i + 1]`. Avec `n = 5` (cases 0 à 4) :

| Phase | Valeurs de `i` avec `i + 1 < n` | Valeurs de `i` avec `i < n` |
|---|---|---|
| paire | 0, 2 (pour `i = 4`, `4 + 1 < 5` est faux : stop) | 0, 2, **4** : compare `tab[4]` et `tab[5]` |
| impaire | 1, 3 | 1, 3 (pour `i = 5`, `5 < 5` est faux) |

`tab[5]` n'existe pas : c'est la case qui suit le tableau en mémoire. Si elle contient une valeur plus petite, l'échange la fait **entrer** dans le tableau et envoie `tab[4]` dehors.

**Pourquoi attendre un tour complet ?** Sur `4 7 1`, la phase paire du tour 1 compare (0, 1) : 4 et 7 sont dans l'ordre, aucun échange. S'arrêter là laisserait `4 7 1` non trié ; c'est la phase impaire qui trouve 7 et 1. On ne conclut qu'après les deux phases.

**Coût** : O(n²) dans le pire cas, O(n) sur un tableau déjà trié (un seul tour, `n - 1` comparaisons). Stable, comme le tri à bulles. Son intérêt : dans une phase, les paires sont **indépendantes**. Avec un processeur par paire, toutes les comparaisons d'une phase se font en même temps, et `n` phases suffisent toujours : c'est un tri **parallélisable**.

> [!warning] Oublier l'arrêt
> Faire `n` tours fixes sans regarder s'il y a eu des échanges trie bien, mais coûte O(n²) même sur un tableau déjà trié.

**À retenir :** pair-impair = alterner les paires `(0,1) (2,3)…` et `(1,2) (3,4)…`, avec la borne `i + 1 < n`, et s'arrêter après un tour complet (les deux phases) sans échange.

## 5. Le tri cocktail

Un tri à bulles **aller-retour** (on l'appelle aussi tri shaker). Le passage aller (de gauche à droite) fait remonter la plus grande valeur au bout, le passage retour (de droite à gauche) fait descendre la plus petite au début. Les deux bornes se resserrent.

On garde deux bornes : `debut` (première case pas encore placée) et `fin` (dernière case pas encore placée).

| Passage | Sens | Cases comparées | Ce qu'il place | Borne qui bouge ensuite |
|---|---|---|---|---|
| aller | de `debut` vers `fin` | `tab[i]` et `tab[i + 1]`, `i` de `debut` à `fin - 1` | le maximum de la zone, en `fin` | `fin` recule d'une case |
| retour | de `fin` vers `debut` | `tab[i - 1]` et `tab[i]`, `i` de `fin` à `debut + 1` | le minimum de la zone, en `debut` | `debut` avance d'une case |

**Exemple résolu : la tortue de `3 4 5 6 7 2`** (le tri à bulles y faisait 15 comparaisons).

| Passage | Zone (`debut` à `fin`) | Comparaisons | Échanges | Tableau après |
|---|---|---|---|---|
| aller | 0 à 5 | 5 | 1 (7 et 2) | 3 4 5 6 2 **7** |
| retour | 0 à 4 | 4 | 4 (le 2 descend jusqu'en case 0) | **2** 3 4 5 6 **7** |
| aller | 1 à 4 | 3 | 0 : on s'arrête | 2 3 4 5 6 7 |

Bilan : **12 comparaisons**. Le retour a fait traverser la tortue d'un seul coup. Plus le tableau est grand, plus l'écart se creuse : pour une tortue au bout de `n` cases, il faut un aller, un retour et un aller de vérification, soit `(n - 1) + (n - 2) + (n - 3)` comparaisons, à peu près `3n`, contre `n(n - 1) / 2` pour le tri à bulles.

```c
void tri_cocktail(int *tab, size_t n) {
    if (n < 2) {
        return;
    }
    size_t debut = 0;
    size_t fin = n - 1;
    int echange = 1;
    while (echange) {
        echange = 0;
        for (size_t i = debut; i < fin; i++) {
            if (tab[i] > tab[i + 1]) {
                echanger(&tab[i], &tab[i + 1]);
                echange = 1;
            }
        }
        if (!echange) {
            return;
        }
        fin--;
        echange = 0;
        for (size_t i = fin; i > debut; i--) {
            if (tab[i - 1] > tab[i]) {
                echanger(&tab[i - 1], &tab[i]);
                echange = 1;
            }
        }
        debut++;
    }
}
```

- `if (n < 2)` vient en premier : avec `n == 0`, `n - 1` déborderait (`size_t`), et un tableau d'une case est déjà trié.
- L'aller commence à `debut`, pas à 0 : les cases avant `debut` sont déjà à leur place.
- Chaque passage (aller **ou** retour) peut arrêter le tri s'il ne fait aucun échange.

**Coût** : toujours O(n²) dans le pire cas, O(n) sur un tableau trié. Stable. Il règle le problème des tortues : sur `2 3 4 5 … 1`, il lui faut un aller et un retour (plus un aller de vérification) là où le tri à bulles fait `n - 1` passages.

**À retenir :** cocktail = un aller qui place le maximum en `fin`, un retour qui place le minimum en `debut`, les deux bornes se resserrent, arrêt dès qu'un passage ne fait aucun échange.

## 6. Le tri à peigne

Le tri à bulles compare des **voisins** (écart 1). Le tri à peigne compare des cases **éloignées** d'un `ecart`, qui diminue à chaque passage : une tortue au bout du tableau fait de grands sauts vers le début dès les premiers passages.

1. `ecart` part de `n` ;
2. à chaque passage : `ecart = ecart / 1,3` (sans descendre sous 1), puis on compare et échange `tab[i]` et `tab[i + ecart]` pour tous les `i` possibles ;
3. on s'arrête quand `ecart` vaut 1 **et** qu'un passage n'a fait aucun échange. Les derniers passages sont donc un tri à bulles, sur un tableau presque trié.

```c
void tri_peigne(int *tab, size_t n) {
    size_t ecart = n;
    int echange = 1;
    while (ecart > 1 || echange) {
        ecart = ecart * 10 / 13;
        if (ecart < 1) {
            ecart = 1;
        }
        echange = 0;
        for (size_t i = 0; i + ecart < n; i++) {
            if (tab[i] > tab[i + ecart]) {
                echanger(&tab[i], &tab[i + ecart]);
                echange = 1;
            }
        }
    }
}
```

`ecart * 10 / 13` divise par 1,3 en restant dans les entiers (pas de `double` à reconvertir). Avec `n = 10`, les écarts sont 7, 5, 3, 2, 1, 1…

**Exemple résolu : les écarts pour `n = 7`.** La division entière `/` jette la partie après la virgule (elle arrondit vers le bas).

| Écart avant | Calcul | Résultat exact | Nouvel écart |
|---|---|---|---|
| 7 | 70 / 13 | 5,38… | 5 |
| 5 | 50 / 13 | 3,84… | 3 |
| 3 | 30 / 13 | 2,30… | 2 |
| 2 | 20 / 13 | 1,53… | 1 |
| 1 | 10 / 13 | 0,76… | 0, remis à 1 |

Sans le `if (ecart < 1)`, l'écart tomberait à 0 après un seul passage à l'écart 1 : on comparerait chaque case avec elle-même, sans aucun échange, et la boucle s'arrêterait alors que le tableau n'est pas forcément trié.

**Exemple résolu : tri à peigne de `6 1 3 5 7 4 2`** (7 cases). Un passage avec l'écart `e` fait `n - e` comparaisons (`i` va de 0 tant que `i + e < 7`).

| Passage | Écart | Comparaisons | Échanges | Tableau après |
|---|---|---|---|---|
| 1 | 5 | 2 | 1 (6 et 4) | 4 1 3 5 7 6 2 |
| 2 | 3 | 4 | 1 (5 et 2) | 4 1 3 2 7 6 5 |
| 3 | 2 | 5 | 2 (4 et 3, 7 et 5) | 3 1 4 2 5 6 7 |
| 4 | 1 | 6 | 2 (3 et 1, 4 et 2) | 1 3 2 4 5 6 7 |
| 5 | 1 | 6 | 1 (3 et 2) | 1 2 3 4 5 6 7 |
| 6 | 1 | 6 | 0 : on s'arrête | 1 2 3 4 5 6 7 |

Regarde le 2, la tortue du départ : il passe de la case 6 à la case 3 en un seul échange (passage 2, écart 3), puis à la case 1.

**Pourquoi la condition `ecart > 1 || echange` ?** On continue tant que **l'une** des deux est vraie :

| Après le passage | `ecart > 1` | `echange` | On continue ? |
|---|---|---|---|
| 3 (écart 2) | vrai | 1 | oui |
| 4 (écart 1) | faux | 1 | oui : il y a eu des échanges |
| 5 (écart 1) | faux | 1 | oui |
| 6 (écart 1) | faux | 0 | non : écart 1 et aucun échange |

Une boucle `while (ecart > 1)` seule s'arrêterait après le passage 4 et laisserait `1 3 2 4 5 6 7` : **un seul** passage à l'écart 1 ne suffit pas toujours.

**Coût** : O(n²) dans le pire cas en théorie, mais en pratique il est **beaucoup** plus rapide que les autres tris de ce chapitre : le nombre de passages grandit comme log n, et il trie des centaines de milliers de valeurs en un instant. Meilleur cas (déjà trié) : environ log n passages sans échange, O(n log n). Il n'est **pas stable** : les grands sauts passent par-dessus des valeurs égales.

> [!info] Pourquoi 1,3 ?
> Ce facteur a été trouvé par des essais : avec un facteur plus grand, l'écart descend trop vite et il reste beaucoup de tortues ; plus petit, on fait trop de passages.

> [!warning] Une fonction `void` ne renvoie rien
> `return tab;` dans une fonction `void` est une erreur de compilation en C. Le tri modifie le tableau **sur place**, par son adresse : l'appelant voit le résultat sans qu'on renvoie quoi que ce soit.

**À retenir :** peigne = tri à bulles avec `tab[i]` et `tab[i + ecart]`, écart `ecart * 10 / 13` (au moins 1) ; on continue tant que `ecart > 1 || echange`.

## 7. Comparaison

| Tri | Pire cas | Meilleur cas | Échanges (pire cas) | Stable | Idée |
|---|---|---|---|---|---|
| Sélection | O(n²) | O(n²) | n - 1 | non | placer le minimum du reste |
| Bulles (avec arrêt) | O(n²) | O(n) | n(n - 1) / 2 | oui | faire remonter le maximum |
| Insertion | O(n²) | O(n) | n(n - 1) / 2 décalages | oui | insérer dans la partie triée |
| Pair-impair | O(n²) | O(n) | n(n - 1) / 2 | oui | bulles par paires indépendantes |
| Cocktail | O(n²) | O(n) | n(n - 1) / 2 | oui | bulles aller-retour |
| Peigne | O(n²) | O(n log n) | variable | non | bulles avec un écart qui diminue |

Tous sont **en place** (mémoire en plus : O(1)). Pour quelques dizaines de valeurs, le tri par insertion est souvent le meilleur choix. Pour de gros tableaux, il faut un tri en O(n log n) : tri fusion, tri rapide.

Sur notre tableau `6 3 8 2 5` :

| Tri | Comparaisons | Échanges (ou décalages) |
|---|---|---|
| Sélection | 10 | 2 |
| Bulles | 10 | 6 |
| Insertion | 8 | 6 décalages |
| Pair-impair | 12 | 6 |
| Cocktail | 10 | 6 |

> [!tip] Le nombre d'échanges des tris « par voisins »
> Une **inversion** est une paire de cases dans le mauvais ordre (`i < j` mais `tab[i] > tab[j]`). Échanger deux voisins mal rangés supprime exactement une inversion. Le tri à bulles, le tri pair-impair et le tri cocktail font donc **exactement autant d'échanges qu'il y a d'inversions** : 0 pour un tableau trié, `n(n - 1) / 2` pour un tableau à l'envers.

### Compter les inversions

**Exemple résolu : combien d'inversions dans `6 3 8 2 5` ?** On prend chaque case `i`, et on la compare à **toutes** les cases `j` placées après elle. Une paire est une inversion si la valeur de gauche est **strictement** plus grande.

| Case `i` (valeur) | Valeurs après elle | Plus petites strictement | Inversions |
|---|---|---|---|
| 0 (6) | 3, 8, 2, 5 | 3, 2, 5 | 3 |
| 1 (3) | 8, 2, 5 | 2 | 1 |
| 2 (8) | 2, 5 | 2, 5 | 2 |
| 3 (2) | 5 | aucune | 0 |
| 4 (5) | aucune | aucune | 0 |

Total : 3 + 1 + 2 = **6 inversions**, exactement les 6 échanges du tri à bulles, du pair-impair et du cocktail (et les 6 décalages du tri par insertion, qui suppriment aussi une inversion chacun). Deux valeurs **égales** ne forment pas une inversion : elles ne sont pas mal rangées. On a regardé 4 + 3 + 2 + 1 = 10 paires : en code, ce sont deux boucles imbriquées, `j` partant de `i + 1`.

**À retenir :** inversions = paires `i < j` avec `tab[i] > tab[j]` (strictement) ; un tri par voisins fait exactement un échange par inversion.

### Renvoyer plusieurs compteurs

Pour mesurer un tri, on veut souvent **deux** nombres (comparaisons et échanges). Une fonction C ne renvoie qu'une valeur : on lui passe donc les **adresses** de variables de l'appelant, et elle écrit dedans, comme `echanger`.

**Exemple résolu : compter les positifs et les négatifs d'un tableau.**

```c
#include <stdio.h>

void compter_signes(const int *tab, size_t n, size_t *positifs, size_t *negatifs) {
    *positifs = 0;
    *negatifs = 0;
    for (size_t i = 0; i < n; i++) {
        if (tab[i] > 0) {
            (*positifs)++;
        } else if (tab[i] < 0) {
            (*negatifs)++;
        }
    }
}

int main(void) {
    int tab[] = {4, -2, 0, 7, -5, 3};
    size_t positifs;
    size_t negatifs;
    compter_signes(tab, 6, &positifs, &negatifs);
    printf("%zu positifs, %zu négatifs\n", positifs, negatifs);
    return 0;
}
```

1. L'appelant déclare `positifs` et `negatifs`, et passe `&positifs`, `&negatifs`.
2. La fonction **met d'abord les compteurs à 0** : les variables de l'appelant n'étaient pas initialisées.
3. Elle augmente le compteur pointé avec `(*positifs)++`. Les parenthèses sont obligatoires : `*positifs++` se lit `*(positifs++)`, qui fait avancer le **pointeur** d'une case au lieu d'augmenter le compteur (gcc prévient : « value computed is not used »).

Résultat : `3 positifs, 2 négatifs` (4, 7 et 3 ; -2 et -5 ; le 0 n'est ni l'un ni l'autre).

**À retenir :** pour « renvoyer » plusieurs résultats, reçois des pointeurs, mets `*p = 0` au début, puis `(*p)++` avec les parenthèses.

## 8. Pièges

> [!warning] `n - 1` avec un `size_t`
> `for (size_t i = 0; i < n - 1; i++)` avec `n == 0` : `n - 1` vaut le plus grand `size_t`, la boucle lit hors du tableau. Écrire `i + 1 < n`.

> [!warning] Oublier de remettre l'indicateur à 0
> Dans les tris avec arrêt anticipé, `echange = 0` doit être remis **au début de chaque passage**. Sinon, il reste à 1 après le premier échange et la boucle ne s'arrête jamais.

> [!warning] Échanger une case avec elle-même
> Dans le tri par sélection, si le minimum est déjà en place (`pos_min == i`), l'échange ne sert à rien. Ce n'est pas faux, mais c'est du travail en trop.

> [!warning] `*compteur++` au lieu de `(*compteur)++`
> Sans parenthèses, c'est le pointeur qui avance, pas le compteur qui augmente : le compteur de l'appelant reste à 0.

## À retenir

- Sélection : n²/2 comparaisons toujours, mais au plus n - 1 échanges ; pas stable.
- Bulles : le maximum remonte à chaque passage ; avec l'arrêt anticipé, O(n) sur un tableau trié ; stable ; lent sur les tortues.
- Insertion : décaler en partant de la droite ; O(n) sur un tableau presque trié ; stable avec `>` strict.
- Pair-impair : bulles par paires indépendantes, parallélisable. Cocktail : bulles aller-retour contre les tortues. Peigne : bulles avec un écart divisé par 1,3, très rapide en pratique, pas stable.
- Tous en place, tous en O(n²) dans le pire cas.
- Les tris par voisins font exactement un échange par inversion.
