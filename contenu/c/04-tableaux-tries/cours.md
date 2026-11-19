# Tableaux triés et recherche

Un tableau **trié** (dans l'ordre croissant) range ses valeurs de la plus petite à la plus grande : `tab[0] <= tab[1] <= ... <= tab[n - 1]`. Ce simple rangement change complètement le coût de plusieurs opérations. Ce chapitre compare, pour chaque problème, la version « tableau quelconque » et la version « tableau trié ».

| Problème | Tableau non trié | Tableau trié |
|---|---|---|
| Minimum / maximum | O(n) | **O(1)** : première / dernière case |
| Chercher une valeur | O(n) | **O(log n)** : recherche dichotomique |
| Égalité de deux tableaux (mêmes valeurs, même nombre de fois) | O(n²), ou O(n log n) en triant d'abord | **O(n)** : case par case |
| Fusionner deux tableaux en un tableau trié | trier le tout | **O(na + nb)** |
| Ajouter une valeur | O(1) à la fin | O(n) : il faut la mettre à sa place |

> [!info] Rien n'est gratuit
> Garder un tableau trié coûte cher à chaque ajout (il faut décaler). Ça vaut le coup quand on **cherche souvent** et qu'on **ajoute rarement**.

## 1. Le minimum

### La version « bourrine » : O(n²)

Pour chaque case, on vérifie qu'aucune autre n'est plus petite. Si oui, c'est le minimum.

```text
Pour i allant de 0 à n - 1 :
    estMin = vrai
    Pour j allant de 0 à n - 1 :
        Si tab[j] < tab[i] : estMin = faux, sortir de la boucle
    Si estMin : retourner tab[i]
```

Deux boucles imbriquées de `n` tours : **O(n²)**. Avec 1 000 valeurs, jusqu'à un million de comparaisons. Ça marche, mais on peut faire beaucoup mieux.

### La version maligne : O(n)

Idée : si on connaît le minimum des `i` premières cases, il suffit de comparer la case suivante à ce minimum pour connaître celui des `i + 1` premières.

```c
#include <stdio.h>

int minimum(const int *tab, size_t n) {
    int min = tab[0];
    for (size_t i = 1; i < n; i++) {
        if (tab[i] < min) {
            min = tab[i];
        }
    }
    return min;
}

int main(void) {
    int tab[] = {5, 2, -6, 3, -2};
    printf("minimum : %d\n", minimum(tab, 5));
    return 0;
}
```

- On part de `tab[0]` (et pas de `0` : si toutes les valeurs sont positives, `0` serait un faux minimum).
- La boucle peut commencer à `1` : comparer `tab[0]` à lui-même ne sert à rien.
- Un seul passage : **O(n)**. Pour un tableau **non trié**, impossible de faire mieux : n'importe quelle case pas regardée pourrait être le minimum.

> [!warning] Le tableau vide
> `tab[0]` n'existe pas si `n == 0`. Soit on l'interdit (« on suppose `n > 0` »), soit on renvoie la **position** du minimum et une valeur spéciale pour « aucune case ».

### Tableau trié : O(1)

Les valeurs vont de la plus petite à la plus grande : le minimum est **dans la première case**, le maximum dans la dernière.

```c
int minimum_trie(const int *tab) {
    return tab[0];
}
```

## 2. Chercher une valeur

### Recherche séquentielle (n'importe quel tableau)

On regarde les cases une par une. Dès qu'on trouve la valeur, on renvoie sa position ; si on sort de la boucle, c'est qu'elle n'y est pas : on renvoie `-1`, une position qui n'existe pas.

```anim
recherche
mode: lineaire
```

```c
#include <stdio.h>

int chercher(const int *tab, size_t n, int valeur) {
    for (size_t i = 0; i < n; i++) {
        if (tab[i] == valeur) {
            return (int)i;
        }
    }
    return -1;
}

int main(void) {
    int tab[] = {42, -4, 6, 3};
    printf("6 est en position %d\n", chercher(tab, 4, 6));
    printf("2 est en position %d\n", chercher(tab, 4, 2));
    return 0;
}
```

Pire cas (valeur absente ou dans la dernière case) : `n` comparaisons, **O(n)**. Meilleur cas : la valeur est dans la première case, O(1).

> [!warning] Le `return` trop tôt
> ```c
> for (size_t i = 0; i < n; i++) {
>     if (tab[i] == valeur) return 1;
>     else return 0;
> }
> ```
> Ce code ne regarde **que la première case** : dès le premier tour, l'un des deux `return` quitte la fonction. On ne peut conclure « absent » qu'**après** la boucle, quand toutes les cases ont été vues.

### Recherche dichotomique (tableau trié)

« Dichotomie » veut dire « couper en deux ». C'est la méthode du dictionnaire : on ouvre au milieu, on regarde si le mot est avant ou après, on garde la bonne moitié, et on recommence.

```anim
recherche
mode: dichotomique
```

On garde deux bornes, `debut` et `fin`, qui encadrent la zone où la valeur peut encore se trouver.

```text
Algo : RechercheDichotomique
Entrée : tab trié de taille n, valeur v

debut = 0
fin = n - 1
Tant que debut <= fin :
    milieu = (debut + fin) / 2       division entière
    Si tab[milieu] == v : retourner milieu
    Si v < tab[milieu] : fin = milieu - 1      on garde la moitié gauche
    Sinon : debut = milieu + 1                 on garde la moitié droite
Retourner -1                                    la zone est vide : absent
```

Déroulé : on cherche 23 dans un tableau trié de 11 cases.

```text
indice :  0   1   2   3   4   5   6   7   8   9  10
tab    :  2   5   8  12  16  23  38  56  72  91  99

debut  fin  milieu  tab[milieu]
  0     10     5        23      trouvé en 1 tour

on cherche 20 :
  0     10     5        23      20 < 23 : fin = 4
  0      4     2         8      20 > 8  : debut = 3
  3      4     3        12      20 > 12 : debut = 4
  4      4     4        16      20 > 16 : debut = 5
  5      4                      debut > fin : absent (4 tours)
```

#### Pourquoi O(log n) ?

À chaque tour, la zone de recherche est **divisée par deux**. Dans le pire cas :

| Taille | Tours au maximum |
|---|---|
| 1 | 1 |
| 3 | 2 (le milieu, puis une moitié de 1) |
| 7 | 3 |
| 15 | 4 |
| 2ˣ - 1 | x |

Avec `n` valeurs, il faut environ **log₂(n)** tours. 1 000 valeurs : 10 tours au lieu de 1 000. Un million : 20 au lieu d'un million. Un milliard : 30.

#### En C, avec `size_t`

Avec des indices `int`, l'algorithme se recopie tel quel. Avec `size_t` (non signé), `fin = milieu - 1` est un piège : si `milieu` vaut 0, `fin` devient le plus grand nombre possible et la boucle lit n'importe où. La version sûre prend une zone **semi-ouverte** `[debut, fin[` : `fin` est la première case **exclue**.

```c
#include <stdio.h>

int dichotomie(const int *tab, size_t n, int valeur) {
    size_t debut = 0;
    size_t fin = n;
    while (debut < fin) {
        size_t milieu = debut + (fin - debut) / 2;
        if (tab[milieu] == valeur) {
            return (int)milieu;
        }
        if (valeur < tab[milieu]) {
            fin = milieu;
        } else {
            debut = milieu + 1;
        }
    }
    return -1;
}

int main(void) {
    int tab[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91, 99};
    printf("23 : %d\n", dichotomie(tab, 11, 23));
    printf("1 : %d\n", dichotomie(tab, 11, 1));
    printf("100 : %d\n", dichotomie(tab, 11, 100));
    return 0;
}
```

| Version | Zone | Condition | Moitié gauche | Moitié droite |
|---|---|---|---|---|
| fermée (`int`) | `[debut, fin]` | `debut <= fin` | `fin = milieu - 1` | `debut = milieu + 1` |
| semi-ouverte (`size_t`) | `[debut, fin[` | `debut < fin` | `fin = milieu` | `debut = milieu + 1` |

> [!tip] `debut + (fin - debut) / 2`
> Même résultat que `(debut + fin) / 2`, mais sans risque de dépasser le plus grand entier quand les deux bornes sont énormes.

> [!warning] La dichotomie exige un tableau trié
> Sur un tableau non trié, elle répond n'importe quoi : en gardant « la bonne moitié », elle peut jeter celle qui contient la valeur.

## 3. Égalité de deux tableaux

On dit ici que deux tableaux sont **égaux** s'ils ont **la même taille** et contiennent **les mêmes valeurs, le même nombre de fois**, dans n'importe quel ordre. `1 1 2 3 4` et `3 2 1 4 1` sont égaux ; `1 2 2 3` et `1 2 3 3` ne le sont pas (même ensemble de valeurs, mais pas les mêmes quantités).

### Tableaux triés : O(n)

Deux tableaux triés égaux sont identiques case par case. Une seule case différente suffit à répondre « non ».

```c
int egaux_tries(const int *a, const int *b, size_t n) {
    for (size_t i = 0; i < n; i++) {
        if (a[i] != b[i]) {
            return 0;
        }
    }
    return 1;
}
```

> [!warning] La dernière case oubliée
> `for (size_t i = 0; i < n - 1; i++)` ne compare pas la dernière case : `1 2 3` et `1 2 4` seraient déclarés égaux. Et avec `n == 0`, `n - 1` en `size_t` vaut un nombre énorme : la boucle lit hors des tableaux. Les bornes sont `0` à `n - 1` **compris**, donc `i < n`.

### Tableaux non triés

**Méthode 1 : marquer les valeurs utilisées.** Un tableau `utilise` (une case par valeur de `b`, toutes à 0 au début). Pour chaque valeur de `a`, on cherche dans `b` une case égale **pas encore utilisée**, et on la marque. Si on n'en trouve pas, les tableaux sont différents. Deux boucles imbriquées : **O(n²)**, et O(n) de mémoire en plus.

**Méthode 2 : trier puis comparer.** On trie les deux tableaux (un bon tri coûte O(n log n), voir le tri fusion), puis on compare case par case en O(n). Total **O(n log n)** : c'est la meilleure des deux.

> [!warning] Ne pas trier les tableaux de l'appelant
> Trier `a` et `b` **directement** change les tableaux de celui qui a appelé la fonction : il demandait juste « sont-ils égaux ? » et retrouve ses données dans un autre ordre. On trie des **copies** (`malloc` + copie, puis `free`), et on le signale en écrivant `const int *a` dans la signature.

## 4. Fusionner deux tableaux triés

But : à partir de `a` (taille `na`) et `b` (taille `nb`), tous deux triés, construire un tableau trié de `na + nb` cases. Trois indices : `i` dans `a`, `j` dans `b`, `k` dans le résultat. À chaque tour, on copie **la plus petite des deux valeurs en tête**, et on avance dans le tableau d'où elle vient.

```text
a : 1 4 9          b : 2 3 10 11

i=0 j=0 : 1 < 2  -> 1          i=1
i=1 j=0 : 4 > 2  -> 2          j=1
i=1 j=1 : 4 > 3  -> 3          j=2
i=1 j=2 : 4 < 10 -> 4          i=2
i=2 j=2 : 9 < 10 -> 9          i=3 : a est fini
on recopie la fin de b -> 10 11

résultat : 1 2 3 4 9 10 11
```

```c
#include <stdio.h>

void fusionner(const int *a, size_t na, const int *b, size_t nb, int *res) {
    size_t i = 0;
    size_t j = 0;
    size_t k = 0;
    while (i < na && j < nb) {
        if (a[i] <= b[j]) {
            res[k++] = a[i++];
        } else {
            res[k++] = b[j++];
        }
    }
    while (i < na) {
        res[k++] = a[i++];
    }
    while (j < nb) {
        res[k++] = b[j++];
    }
}

int main(void) {
    int a[] = {1, 4, 9};
    int b[] = {2, 3, 10, 11};
    int res[7];
    fusionner(a, 3, b, 4, res);
    for (size_t k = 0; k < 7; k++) {
        printf("%d ", res[k]);
    }
    printf("\n");
    return 0;
}
```

Chaque valeur est copiée une seule fois : **O(na + nb)**. Les deux boucles de fin recopient ce qui reste quand l'un des tableaux est épuisé (une seule des deux tourne vraiment).

> [!tip] `<=` plutôt que `<`
> En cas d'égalité, prendre d'abord la valeur de `a` garde l'ordre d'origine des valeurs égales (la fusion est **stable**). Avec de simples entiers ça ne se voit pas ; avec des fiches triées par note, si. La fusion est la brique du **tri fusion** (chapitre suivant les tris simples).

Le même parcours à deux indices résout d'autres problèmes en O(na + nb) : les **valeurs communes** (on n'avance que l'indice de la plus petite, et on garde la valeur quand les deux sont égales) ou l'**union sans doublon**.

## 5. Ajouter dans un tableau trié

Pour qu'il reste trié, la nouvelle valeur doit aller **à sa place** :

1. trouver la position : la première case qui contient une valeur plus grande (séquentiel en O(n), ou dichotomie en O(log n)) ;
2. décaler vers la droite toutes les cases à partir de cette position, **en partant de la fin** (chapitre précédent) ;
3. écrire la valeur.

Même avec la dichotomie, le décalage coûte **O(n)**. D'où le compromis du début : un tableau trié rend la recherche très rapide, mais chaque ajout plus cher.

## 6. Pièges

> [!warning] Initialiser le minimum à 0
> `int min = 0;` donne un faux résultat si toutes les valeurs sont positives. On part de la première case.

> [!warning] Confondre « trouvé » et « position »
> Une fonction qui renvoie une **position** utilise `-1` pour « absent » (0 est une vraie position). Une fonction qui répond **oui / non** renvoie `1` ou `0`.

> [!warning] Les tailles différentes
> Deux tableaux de tailles différentes ne peuvent pas être égaux : on compare les tailles **avant** de lire les cases, sinon on lit au-delà du plus court.

## À retenir

- Trié : minimum en O(1), recherche en **O(log n)** (dichotomie), égalité en O(n), fusion en O(na + nb). Le prix : chaque ajout coûte O(n).
- Recherche séquentielle : on ne conclut « absent » qu'**après** la boucle.
- Dichotomie : zone `[debut, fin]` avec `int`, ou `[debut, fin[` avec `size_t` ; on s'arrête quand la zone est vide.
- Égalité non triée : trier des **copies** puis comparer (O(n log n)), sans toucher aux tableaux reçus.
- Fusion : trois indices, on copie la plus petite des deux têtes, puis on recopie le reste.
