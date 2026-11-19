# Tris simples

Trier un tableau, c'est ranger ses valeurs dans l'ordre croissant. Le chapitre précédent a montré ce qu'on y gagne : minimum en O(1), recherche en O(log n). Ce chapitre présente six tris **simples à écrire**, qui font tous de l'ordre de **n²** comparaisons dans le pire cas. Ils sont lents sur de gros tableaux, mais très utiles pour comprendre les idées qu'on retrouve dans les tris rapides (tri fusion, tri rapide).

## 0. Le vocabulaire

- Un tri **en place** n'utilise pas de deuxième tableau : il range les valeurs en les déplaçant à l'intérieur du tableau (mémoire en plus : O(1)). Les six tris de ce chapitre sont en place.
- Un tri est **stable** si deux valeurs **égales** gardent leur ordre de départ. Avec des nombres seuls, on ne voit pas la différence. Avec des fiches triées par note, si : un tri stable garde, pour une même note, l'ordre alphabétique obtenu avant.
- Le **meilleur cas** et le **pire cas** : le temps peut dépendre de l'ordre de départ. Un tableau déjà trié est souvent le meilleur cas, un tableau trié à l'envers le pire.

Presque tous ces tris échangent deux cases. En C, une fonction ne peut modifier les variables de l'appelant que par leurs **adresses** :

```c
void echanger(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}
```

On l'appelle avec `echanger(&tab[i], &tab[j])`. Sans `temp`, `*a = *b; *b = *a;` écrit deux fois la même valeur : l'ancienne valeur de `*a` est perdue.

## 1. Le tri par sélection

**Idée** : à chaque étape, on **sélectionne** le minimum de la partie pas encore triée et on le place à la fin de la partie triée (en l'échangeant avec la première case non triée).

```anim
tri
algo: selection
```

```text
5 2 9 1 7      minimum de tout : 1, échangé avec la case 0
1 | 2 9 5 7    minimum du reste : 2, déjà à sa place
1 2 | 9 5 7    minimum du reste : 5, échangé avec 9
1 2 5 | 9 7    minimum du reste : 7, échangé avec 9
1 2 5 7 | 9    une seule case reste : elle est à sa place
```

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
- `i + 1 < n` veut dire « `i < n - 1` », mais sans soustraction : avec un `size_t`, `n - 1` vaut un nombre énorme quand `n` vaut 0.

**Coût** : la recherche du minimum regarde `n - 1`, puis `n - 2`, … puis 1 case. En tout `n(n - 1) / 2` comparaisons, **quel que soit l'ordre de départ** : O(n²) dans le meilleur comme dans le pire cas. En revanche, **au plus n - 1 échanges** : c'est le tri qui déplace le moins les valeurs.

> [!warning] Pas stable
> L'échange envoie une valeur loin, par-dessus ses égales. Avec `2a 2b 1` (deux 2 notés a et b), le minimum 1 est échangé avec la case 0 : on obtient `1 2b 2a`. Les deux 2 ont changé d'ordre.

## 2. Le tri à bulles

**Idée** : on parcourt le tableau du début vers la fin en comparant chaque case à sa **voisine** ; si elles sont dans le mauvais ordre, on les échange. À la fin d'un passage, la plus grande valeur est arrivée au bout, comme une bulle qui remonte dans un verre. On recommence sur le reste.

```anim
tri
algo: bulles
```

```text
5 2 9 1 7
passage 1 : 2 5 1 7 | 9      9 est remonté au bout
passage 2 : 2 1 5 | 7 9
passage 3 : 1 2 | 5 7 9
passage 4 : 1 2 5 7 9        aucun échange : c'est fini
```

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

**Coût** : pire cas (trié à l'envers) `n(n - 1) / 2` comparaisons et autant d'échanges, O(n²). Meilleur cas (déjà trié) : un seul passage sans échange, **O(n)**, grâce à l'arrêt anticipé. Sans lui, on fait tous les passages même sur un tableau trié.

Le tri à bulles est **stable** : il n'échange que des voisins **strictement** dans le désordre (`>`), donc deux valeurs égales ne se doublent jamais.

> [!info] Lièvres et tortues
> Une grande valeur au début (un **lièvre**) remonte jusqu'au bout en un seul passage. Une petite valeur à la fin (une **tortue**) ne recule que **d'une case par passage** : `2 3 4 5 6 1` demande 5 passages. Le tri cocktail et le tri à peigne ont été inventés pour accélérer les tortues.

> [!warning] Le voisin qui n'existe pas
> Avec `for (j = 0; j < fin; j++)`, le dernier tour compare `tab[fin - 1]` à `tab[fin]`, une case **hors** de la zone (et hors du tableau au premier passage). La borne est `j + 1 < fin` : `j + 1` doit rester une vraie case.

## 3. Le tri par insertion

**Idée** : celle du joueur de cartes qui range sa main. La partie gauche est déjà triée ; on prend la première valeur non triée et on l'**insère** à sa place dans la partie triée, en décalant d'une case vers la droite les valeurs plus grandes.

```anim
tri
algo: insertion
```

```text
5 | 2 9 1 7      on insère 2 : 5 se décale         -> 2 5 | 9 1 7
2 5 | 9 1 7      on insère 9 : rien à décaler      -> 2 5 9 | 1 7
2 5 9 | 1 7      on insère 1 : 9, 5, 2 se décalent -> 1 2 5 9 | 7
1 2 5 9 | 7      on insère 7 : 9 se décale         -> 1 2 5 7 9
```

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

**Coût** : pire cas (trié à l'envers), chaque valeur traverse toute la partie triée : `n(n - 1) / 2` décalages, O(n²). Meilleur cas (déjà trié), la boucle `while` s'arrête tout de suite : **O(n)**. Sur un tableau **presque trié**, il est très rapide : c'est pour ça qu'on l'utilise pour les petits tableaux, et pour finir le travail d'autres tris.

Il est **stable** grâce au `>` strict : une valeur s'arrête dès qu'elle rencontre une égale, et reste donc **après** elle.

> [!warning] Chercher la place depuis le début
> Autre façon d'écrire : chercher la position depuis la case 0 (`while (pos < i && tab[pos] < valeur) pos++;`), puis insérer. Deux défauts :
> - même sur un tableau déjà trié, on parcourt toute la partie triée à chaque fois : le meilleur cas devient O(n²) ;
> - avec `<`, la valeur s'arrête **devant** la première égale : le tri n'est **plus stable**. Il faudrait `<=`.

## 4. Le tri pair-impair

C'est un tri à bulles où les comparaisons de voisins sont faites **par paires qui ne se touchent pas**. Un tour se fait en deux phases :

1. phase **paire** : on compare (et échange si besoin) les paires `(0, 1)`, `(2, 3)`, `(4, 5)`… ;
2. phase **impaire** : les paires `(1, 2)`, `(3, 4)`, `(5, 6)`…

On recommence jusqu'à un tour **sans aucun échange**.

```text
5 2 9 1 7
paire   (0,1) (2,3)       : 2 5 1 9 7
impaire (1,2) (3,4)       : 2 1 5 7 9
paire                     : 1 2 5 7 9
impaire                   : 1 2 5 7 9
tour suivant : aucun échange, c'est fini
```

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

**Coût** : O(n²) dans le pire cas, O(n) sur un tableau déjà trié (un seul tour). Stable, comme le tri à bulles. Son intérêt : dans une phase, les paires sont **indépendantes**. Avec un processeur par paire, toutes les comparaisons d'une phase se font en même temps, et `n` phases suffisent toujours : c'est un tri **parallélisable**.

> [!warning] Oublier l'arrêt
> Faire `n` tours fixes sans regarder s'il y a eu des échanges trie bien, mais coûte O(n²) même sur un tableau déjà trié.

## 5. Le tri cocktail

Un tri à bulles **aller-retour** (on l'appelle aussi tri shaker). Le passage aller (de gauche à droite) fait remonter la plus grande valeur au bout, le passage retour (de droite à gauche) fait descendre la plus petite au début. Les deux bornes se resserrent.

```text
2 3 4 5 6 1
aller  : 2 3 4 5 1 | 6      6 au bout
retour : 1 | 2 3 4 5 | 6    la tortue 1 traverse tout en un passage
aller  : aucun échange, c'est fini
```

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

**Coût** : toujours O(n²) dans le pire cas, O(n) sur un tableau trié. Stable. Il règle le problème des tortues : sur `2 3 4 5 … 1`, il lui faut un aller et un retour (plus un aller de vérification) là où le tri à bulles fait `n - 1` passages.

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

**Coût** : O(n²) dans le pire cas en théorie, mais en pratique il est **beaucoup** plus rapide que les autres tris de ce chapitre : le nombre de passages grandit comme log n, et il trie des centaines de milliers de valeurs en un instant. Meilleur cas (déjà trié) : environ log n passages sans échange, O(n log n). Il n'est **pas stable** : les grands sauts passent par-dessus des valeurs égales.

> [!info] Pourquoi 1,3 ?
> Ce facteur a été trouvé par des essais : avec un facteur plus grand, l'écart descend trop vite et il reste beaucoup de tortues ; plus petit, on fait trop de passages.

> [!warning] Une fonction `void` ne renvoie rien
> `return tab;` dans une fonction `void` est une erreur de compilation en C. Le tri modifie le tableau **sur place**, par son adresse : l'appelant voit le résultat sans qu'on renvoie quoi que ce soit.

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

> [!tip] Le nombre d'échanges des tris « par voisins »
> Une **inversion** est une paire de cases dans le mauvais ordre (`i < j` mais `tab[i] > tab[j]`). Échanger deux voisins mal rangés supprime exactement une inversion. Le tri à bulles, le tri pair-impair et le tri cocktail font donc **exactement autant d'échanges qu'il y a d'inversions** : 0 pour un tableau trié, `n(n - 1) / 2` pour un tableau à l'envers.

## 8. Pièges

> [!warning] `n - 1` avec un `size_t`
> `for (size_t i = 0; i < n - 1; i++)` avec `n == 0` : `n - 1` vaut le plus grand `size_t`, la boucle lit hors du tableau. Écrire `i + 1 < n`.

> [!warning] Oublier de remettre l'indicateur à 0
> Dans les tris avec arrêt anticipé, `echange = 0` doit être remis **au début de chaque passage**. Sinon, il reste à 1 après le premier échange et la boucle ne s'arrête jamais.

> [!warning] Échanger une case avec elle-même
> Dans le tri par sélection, si le minimum est déjà en place (`pos_min == i`), l'échange ne sert à rien. Ce n'est pas faux, mais c'est du travail en trop.

## À retenir

- Sélection : n²/2 comparaisons toujours, mais au plus n - 1 échanges ; pas stable.
- Bulles : le maximum remonte à chaque passage ; avec l'arrêt anticipé, O(n) sur un tableau trié ; stable ; lent sur les tortues.
- Insertion : décaler en partant de la droite ; O(n) sur un tableau presque trié ; stable avec `>` strict.
- Pair-impair : bulles par paires indépendantes, parallélisable. Cocktail : bulles aller-retour contre les tortues. Peigne : bulles avec un écart divisé par 1,3, très rapide en pratique, pas stable.
- Tous en place, tous en O(n²) dans le pire cas.
