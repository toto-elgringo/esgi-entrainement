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

**Exemple résolu : minimum de `7 3 9 1 4`.**

| `i` | `tab[i]` | `tab[i] < min` ? | `min` après |
|---|---|---|---|
| départ | | | 7 (`tab[0]`) |
| 1 | 3 | 3 < 7 oui | 3 |
| 2 | 9 | 9 < 3 non | 3 |
| 3 | 1 | 1 < 3 oui | 1 |
| 4 | 4 | 4 < 1 non | 1 |

Résultat : 1, avec 4 comparaisons (`n - 1`). La version bourrine, elle, aurait comparé 7 à d'autres cases, puis 3, puis 9, puis 1 à **toutes** les cases avant de le valider : bien plus de travail.

Et si on était parti de `min = 0` avec `7 3 9 4` ? Aucune case n'est plus petite que 0 : on renverrait 0, qui n'est **même pas dans le tableau**.

**À retenir :** minimum = partir de `tab[0]`, comparer chaque case suivante au plus petit vu, une seule passe, O(n). Pour le maximum, même chose avec `>`.

> [!warning] Le tableau vide
> `tab[0]` n'existe pas si `n == 0`. Soit on l'interdit (« on suppose `n > 0` »), soit on renvoie la **position** du minimum et une valeur spéciale pour « aucune case ».

### Tableau trié : O(1)

Les valeurs vont de la plus petite à la plus grande : le minimum est **dans la première case**, le maximum dans la dernière.

```c
int minimum_trie(const int *tab) {
    return tab[0];
}
```

**Exemple résolu : `1 4 4 9 12`, trié dans l'ordre croissant (n = 5).**

| Ce qu'on cherche | Où | Valeur |
|---|---|---|
| minimum | `tab[0]`, la première case | 1 |
| maximum | `tab[n - 1]` = `tab[4]`, la dernière case | 12 |

Aucune boucle : une seule lecture, que le tableau ait 5 cases ou un million. C'est **O(1)**. Attention à l'indice de la dernière case : `n - 1`, pas `n` (`tab[5]` est après la fin).

**À retenir :** tableau trié croissant = minimum en `tab[0]`, maximum en `tab[n - 1]`, O(1).

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

**Exemple résolu : chercher 5, puis 7, dans `8 5 3 5`.**

| `i` | `tab[i]` | Égal à 5 ? | Égal à 7 ? |
|---|---|---|---|
| 0 | 8 | non | non |
| 1 | 5 | **oui** : on renvoie 1 | non |
| 2 | 3 | (pas regardé) | non |
| 3 | 5 | (pas regardé) | non |
| fin de boucle | | | on renvoie -1 |

- Pour 5 : la fonction s'arrête au premier 5 trouvé, en position 1. Le second 5 (position 3) n'est jamais vu : parcourir de gauche à droite donne automatiquement la **première** apparition.
- Pour 7 : 4 comparaisons, aucune égale, on sort de la boucle et c'est seulement là qu'on renvoie -1.
- Tableau vide (`NULL`, `n = 0`) : `0 < 0` est faux, aucun tour, aucune case lue, on renvoie -1.
- Pourquoi `-1` et pas `0` : `0` est une vraie position (la première case). Il faut une réponse qui ne peut **pas** être une position.
- Pourquoi `(int)i` : `i` est un `size_t` et la fonction renvoie un `int` (pour pouvoir renvoyer -1) ; on convertit explicitement.

**À retenir :** recherche séquentielle = `return` de la position **dans** la boucle quand on trouve, `return -1` **après** la boucle.

> [!warning] Le `return` trop tôt
> ```c
> for (size_t i = 0; i < n; i++) {
>     if (tab[i] == valeur) return 1;
>     else return 0;
> }
> ```
> Ce code ne regarde **que la première case** : dès le premier tour, l'un des deux `return` quitte la fonction. On ne peut conclure « absent » qu'**après** la boucle, quand toutes les cases ont été vues.

**Exemple résolu : ce code avec `8 5 3` et la valeur 3.**

| Tour | `tab[i]` | `tab[i] == 3` ? | Ce qui se passe |
|---|---|---|---|
| `i = 0` | 8 | non | on passe dans le `else` : `return 0`, la fonction est finie |
| `i = 1` | | | jamais exécuté |

La réponse est 0 (« absent ») alors que 3 est en position 2. Ce code ne donne la bonne réponse que si la valeur est dans la **première** case : c'est pour ça qu'il passe inaperçu quand on ne teste qu'avec `tab[0]`. Pour le réparer, on garde seulement le `return 1` dans la boucle et on déplace le `return 0` après elle.

**À retenir :** un `else return ...` dans une boucle de recherche est presque toujours un bug : « pas trouvé ici » ne veut pas dire « pas trouvé du tout ».

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

Pourquoi a-t-on le droit de jeter une moitié ? Au premier tour pour 20 : `tab[5]` vaut 23 et 20 < 23. Le tableau étant trié, toutes les cases 6 à 10 valent **au moins** 23 : 20 ne peut pas y être. On les élimine sans les lire. C'est **uniquement** parce que le tableau est trié que ce raisonnement est juste.

**À retenir :** à chaque tour, on compare au milieu : égal, on a fini ; plus petit, on garde la gauche ; plus grand, la droite. Zone vide : absent.

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

**Exemple résolu : tailles de la zone pour 1 000 valeurs.** 1 000 → 500 → 250 → 125 → 62 → 31 → 15 → 7 → 3 → 1 → vide : une dizaine de tours au maximum, parce que 2¹⁰ = 1 024 dépasse 1 000.

**À retenir :** couper en deux à chaque tour = environ log₂(n) tours ; 2¹⁰ ≈ mille, 2²⁰ ≈ un million.

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

Dans la version semi-ouverte, la case `milieu` vient d'être regardée : il faut l'**exclure** de la nouvelle zone. À gauche, « exclure `milieu` » s'écrit `fin = milieu` (puisque `fin` est déjà exclue) ; à droite, `debut = milieu + 1`.

**Exemple résolu : les cas des bords avec la version semi-ouverte**, sur le tableau de 11 cases ci-dessus.

Chercher **1** (plus petit que tout) :

| `debut` | `fin` | `milieu` | `tab[milieu]` | Décision |
|---|---|---|---|---|
| 0 | 11 | 5 | 23 | 1 < 23 : `fin = 5` |
| 0 | 5 | 2 | 8 | 1 < 8 : `fin = 2` |
| 0 | 2 | 1 | 5 | 1 < 5 : `fin = 1` |
| 0 | 1 | 0 | 2 | 1 < 2 : `fin = 0` |
| 0 | 0 | | | zone vide : -1 |

La zone s'est réduite jusqu'à la case 0. Dans la version fermée avec des `size_t`, le dernier tour aurait fait `fin = 0 - 1` : un nombre énorme, et la boucle aurait continué hors du tableau. Ici, `fin = milieu` vaut 0, sans soustraction.

Chercher **100** (plus grand que tout) :

| `debut` | `fin` | `milieu` | `tab[milieu]` | Décision |
|---|---|---|---|---|
| 0 | 11 | 5 | 23 | 100 > 23 : `debut = 6` |
| 6 | 11 | 8 | 72 | 100 > 72 : `debut = 9` |
| 9 | 11 | 10 | 99 | 100 > 99 : `debut = 11` |
| 11 | 11 | | | zone vide : -1 |

Chercher **56** (présent) : milieu 5 (23, on va à droite, `debut = 6`), milieu 8 (72, on va à gauche, `fin = 8`), milieu 7 (56) : trouvé en 3 tours.

Et les petits tableaux :

- **Une case** `7` : `debut = 0`, `fin = 1`, `milieu = 0`. Si on cherche 7, trouvé. Si on cherche 3 : 3 < 7, `fin = 0`, zone vide, -1.
- **Tableau vide** (`NULL`, `n = 0`) : `debut = 0`, `fin = 0`, la condition `debut < fin` est fausse tout de suite, aucune case lue, -1.

**À retenir :** version `size_t` = zone `[debut, fin[`, `fin = n` au départ, `while (debut < fin)`, `fin = milieu` à gauche, `debut = milieu + 1` à droite. Teste toujours : plus petit que tout, plus grand que tout, une case, vide.

> [!tip] `debut + (fin - debut) / 2`
> Même résultat que `(debut + fin) / 2`, mais sans risque de dépasser le plus grand entier quand les deux bornes sont énormes.

**Exemple résolu : le dépassement dans le calcul du milieu.** Imaginons des entiers qui ne dépassent pas 255 (comme un `unsigned char`), avec `debut = 200` et `fin = 250` :

| Calcul | Étapes | Résultat |
|---|---|---|
| `(debut + fin) / 2` | 200 + 250 = 450, trop grand : il « fait le tour » et devient 450 - 256 = 194, puis 194 / 2 | **97**, hors de la zone [200, 250[ |
| `debut + (fin - debut) / 2` | 250 - 200 = 50, 50 / 2 = 25, 200 + 25 | **225**, le bon milieu |

Avec des `size_t`, c'est pareil près de `SIZE_MAX` (le plus grand `size_t`) :

```c
#include <stdint.h>
#include <stdio.h>

int main(void) {
    size_t debut = SIZE_MAX - 20;
    size_t fin = SIZE_MAX - 4;
    printf("(debut + fin) / 2         = %zu\n", (debut + fin) / 2);
    printf("debut + (fin - debut) / 2 = %zu\n", debut + (fin - debut) / 2);
    printf("SIZE_MAX - 12             = %zu\n", SIZE_MAX - 12);
    return 0;
}
```

La première ligne affiche environ 9,2 × 10¹⁸ (la moitié du maximum, très loin des bornes), la deuxième la même valeur que `SIZE_MAX - 12`, le vrai milieu. `fin - debut` est la taille de la zone : elle ne dépasse jamais.

**À retenir :** milieu = `debut + (fin - debut) / 2` : on ajoute la moitié de la taille de la zone à son début, sans jamais additionner deux grandes bornes.

> [!warning] La boucle infinie de `debut = milieu`
> Si on écrit `debut = milieu` au lieu de `debut = milieu + 1`, la case du milieu reste dans la zone alors qu'elle a déjà été regardée. Quand la zone ne contient plus qu'une case, elle ne rétrécit plus.

**Exemple résolu : chercher 12 dans `4 9` avec `debut = milieu` (faux).**

| Tour | `debut` | `fin` | `milieu` | `tab[milieu]` | Décision (fausse) |
|---|---|---|---|---|---|
| 1 | 0 | 2 | 1 | 9 | 12 > 9 : `debut = 1` |
| 2 | 1 | 2 | 1 | 9 | 12 > 9 : `debut = 1` |
| 3 | 1 | 2 | 1 | 9 | ... |

La ligne 2 est **identique** à la ligne 3 : rien ne change, la boucle tourne pour toujours. Avec `debut = milieu + 1`, le tour 2 aurait donné `debut = 2`, `fin = 2`, zone vide, -1.

**À retenir :** chaque tour doit **retirer** la case `milieu` de la zone ; si une ligne de ton déroulé est identique à la précédente, c'est une boucle infinie.

> [!warning] La dichotomie exige un tableau trié
> Sur un tableau non trié, elle répond n'importe quoi : en gardant « la bonne moitié », elle peut jeter celle qui contient la valeur.

Exemple : chercher 9 dans `9 3 7` (pas trié). Le milieu est la case 1, qui vaut 3. Comme 9 > 3, on garde la moitié droite (la case 2, qui vaut 7) : 9 n'y est pas, réponse -1. Pourtant 9 était en case 0, dans la moitié jetée.

## 3. Égalité de deux tableaux

On dit ici que deux tableaux sont **égaux** s'ils ont **la même taille** et contiennent **les mêmes valeurs, le même nombre de fois**, dans n'importe quel ordre. `1 1 2 3 4` et `3 2 1 4 1` sont égaux ; `1 2 2 3` et `1 2 3 3` ne le sont pas (même ensemble de valeurs, mais pas les mêmes quantités).

**Exemple résolu : `5 2 5 8` et `8 5 2 5` sont-ils égaux ? Et `5 2 2 8` et `5 2 8 8` ?** On compte combien de fois chaque valeur apparaît :

| Valeur | dans `5 2 5 8` | dans `8 5 2 5` | dans `5 2 2 8` | dans `5 2 8 8` |
|---|---|---|---|---|
| 2 | 1 | 1 | **2** | **1** |
| 5 | 2 | 2 | 1 | 1 |
| 8 | 1 | 1 | **1** | **2** |

- Les deux premiers ont les mêmes quantités : **égaux** (l'ordre ne compte pas).
- Les deux derniers ont les mêmes valeurs (2, 5, 8) mais pas les mêmes quantités : **pas égaux**.
- Comparer les sommes ne suffit pas : `1 6` et `3 4` ont la même somme (7) sans être égaux.

**À retenir :** égalité « même nombre de fois » = comparer les **quantités** de chaque valeur, pas seulement leur présence, ni leur somme.

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

**Exemple résolu : `2 4 4 7` et `2 4 5 7`, tous deux triés.**

| `i` | `a[i]` | `b[i]` | Différents ? |
|---|---|---|---|
| 0 | 2 | 2 | non |
| 1 | 4 | 4 | non |
| 2 | 4 | 5 | **oui** : on renvoie 0 |

Pourquoi le tri rend ça possible : si les deux tableaux contiennent les mêmes valeurs le même nombre de fois, une fois triés, elles se rangent exactement dans le même ordre. Une différence à une position prouve donc une différence de contenu. Avec deux tableaux de 4 cases égaux, on fait 4 comparaisons et on renvoie 1 **après** la boucle.

**À retenir :** deux tableaux triés se comparent case par case, de `0` à `n - 1` compris, en O(n).

> [!warning] La dernière case oubliée
> `for (size_t i = 0; i < n - 1; i++)` ne compare pas la dernière case : `1 2 3` et `1 2 4` seraient déclarés égaux. Et avec `n == 0`, `n - 1` en `size_t` vaut un nombre énorme : la boucle lit hors des tableaux. Les bornes sont `0` à `n - 1` **compris**, donc `i < n`.

**Exemple résolu : `1 3 5` et `1 3 6` avec `i < n - 1` (faux).** `n - 1` = 2, donc `i` prend les valeurs 0 et 1 seulement : on compare 1 avec 1, 3 avec 3, et on conclut « égaux ». La case 2 (5 contre 6) n'est jamais regardée. Avec `i < n`, `i` va jusqu'à 2 et trouve la différence.

Quand les tableaux ont des **tailles différentes** (`na` et `nb`), il faut d'abord les comparer : `1 2` (taille 2) et `1 2 8` (taille 3). Une boucle sur les 2 premières cases trouverait 1 = 1 et 2 = 2 et dirait « égaux », alors que le second a une valeur de plus. Deux tailles différentes, c'est **non** tout de suite, avant de lire la moindre case.

**À retenir :** pour comparer deux tableaux, teste d'abord `na != nb`, puis boucle avec `i < n` ; essaie toujours la dernière case et le tableau vide.

### Tableaux non triés

**Méthode 1 : marquer les valeurs utilisées.** Un tableau `utilise` (une case par valeur de `b`, toutes à 0 au début). Pour chaque valeur de `a`, on cherche dans `b` une case égale **pas encore utilisée**, et on la marque. Si on n'en trouve pas, les tableaux sont différents. Deux boucles imbriquées : **O(n²)**, et O(n) de mémoire en plus.

**Exemple résolu : `a = 3 1 3`, `b = 1 3 4`.**

| Valeur de `a` | Case de `b` trouvée (non utilisée) | `utilise` après |
|---|---|---|
| 3 | `b[1]` = 3 | `0 1 0` |
| 1 | `b[0]` = 1 | `1 1 0` |
| 3 | `b[1]` est déjà utilisée, `b[2]` vaut 4 : **aucune** | on renvoie 0 |

Sans le marquage, le second 3 de `a` aurait de nouveau trouvé `b[1]`, et on aurait conclu « égaux » à tort.

**Méthode 2 : trier puis comparer.** On trie les deux tableaux (un bon tri coûte O(n log n), voir le tri fusion), puis on compare case par case en O(n). Total **O(n log n)** : c'est la meilleure des deux.

Sur le même exemple : `3 1 3` trié donne `1 3 3`, `1 3 4` trié donne `1 3 4` ; la case 2 diffère (3 contre 4) : pas égaux.

| n | Méthode 1 (n²) | Méthode 2 (n log n) |
|---|---|---|
| 1 000 | 1 000 000 | environ 10 000 |
| 100 000 | 10 000 000 000 | environ 1 700 000 |

**À retenir :** pour comparer deux tableaux non triés, trie-les puis compare case par case : O(n log n).

> [!warning] Ne pas trier les tableaux de l'appelant
> Trier `a` et `b` **directement** change les tableaux de celui qui a appelé la fonction : il demandait juste « sont-ils égaux ? » et retrouve ses données dans un autre ordre. On trie des **copies** (`malloc` + copie, puis `free`), et on le signale en écrivant `const int *a` dans la signature.

### Les outils : `malloc`, `memcpy`, `qsort`, `free`

| Outil | En-tête | Rôle |
|---|---|---|
| `malloc(octets)` | `<stdlib.h>` | réserve une zone de mémoire et renvoie son adresse, ou `NULL` si c'est impossible |
| `memcpy(dest, src, octets)` | `<string.h>` | recopie `octets` octets de `src` vers `dest` |
| `qsort(tab, n, taille_case, comparer)` | `<stdlib.h>` | trie `tab` (O(n log n) en moyenne), en appelant `comparer` pour savoir qui va avant |
| `free(adresse)` | `<stdlib.h>` | rend la mémoire réservée par `malloc` |

- Le nombre d'octets d'un tableau de `n` entiers est `n * sizeof(int)` (ou `n * sizeof *copie`, la taille d'une case de `copie`).
- `malloc` peut échouer : on teste toujours `if (copie == NULL)`.
- Chaque `malloc` réussi doit avoir **son** `free`, sur **tous** les chemins (même quand on renvoie « non » au milieu) ; sinon la mémoire est perdue : c'est une **fuite**.
- Avec `n == 0`, `malloc(0)` peut renvoyer `NULL` sans que ce soit une erreur : on traite le cas `n == 0` **avant** d'allouer.

La fonction `comparer` reçoit les **adresses** de deux cases sous la forme `const void *` (une adresse « de n'importe quoi ») ; on les convertit en `const int *` pour lire les valeurs. Elle renvoie un nombre **négatif** si la première valeur doit aller avant, **0** si elles sont égales, **positif** sinon. L'écriture `(a > b) - (a < b)` donne exactement -1, 0 ou 1 :

| `a` | `b` | `a > b` | `a < b` | Résultat |
|---|---|---|---|---|
| 3 | 7 | 0 | 1 | -1 (3 avant 7) |
| 7 | 3 | 1 | 0 | 1 (7 après 3) |
| 5 | 5 | 0 | 0 | 0 |

Pourquoi pas simplement `a - b` ? Avec `a = 2 000 000 000` et `b = -2 000 000 000`, la différence (4 milliards) ne tient pas dans un `int` : le résultat est faux et le tri aussi.

**Exemple résolu : la médiane d'un tableau, sans le modifier.** La médiane est la valeur du milieu une fois les valeurs rangées. Il faut donc trier... une **copie**.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int comparer(const void *x, const void *y) {
    int a = *(const int *)x;
    int b = *(const int *)y;
    return (a > b) - (a < b);
}

int mediane(const int *tab, size_t n, int *resultat) {
    if (n == 0) {
        return 0;
    }
    int *copie = malloc(n * sizeof *copie);
    if (copie == NULL) {
        return 0;
    }
    memcpy(copie, tab, n * sizeof *copie);
    qsort(copie, n, sizeof *copie, comparer);
    *resultat = copie[n / 2];
    free(copie);
    return 1;
}

int main(void) {
    int notes[] = {14, 3, 18, 9, 11};
    int m;
    if (mediane(notes, 5, &m)) {
        printf("mediane : %d\n", m);
    }
    printf("notes intactes : ");
    for (size_t i = 0; i < 5; i++) {
        printf("%d ", notes[i]);
    }
    printf("\n");
    return 0;
}
```

| Étape | Contenu |
|---|---|
| `notes` (reçu, `const`) | `14 3 18 9 11` |
| `copie` après `malloc` + `memcpy` | `14 3 18 9 11` |
| `copie` après `qsort` | `3 9 11 14 18` |
| `copie[5 / 2]` = `copie[2]` | 11 |
| après `free(copie)` | la copie est rendue, `notes` n'a jamais bougé |

**À retenir :** pour travailler sur un tableau `const` sans l'abîmer : `malloc` (et test de `NULL`), `memcpy`, travail sur la copie, puis `free` sur tous les chemins.

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

`res[k++] = a[i++];` fait trois choses : copie `a[i]` dans `res[k]`, puis augmente `k` et `i` de 1 (le `++` placé **après** utilise d'abord l'ancienne valeur).

**Exemple résolu : avec des doublons, puis avec un tableau vide.** `a = 3 5`, `b = 3 6`.

| `i` | `j` | Têtes | Comparaison `a[i] <= b[j]` | Copié | `res` |
|---|---|---|---|---|---|
| 0 | 0 | 3 et 3 | 3 <= 3 oui | 3 (de `a`) | `3` |
| 1 | 0 | 5 et 3 | 5 <= 3 non | 3 (de `b`) | `3 3` |
| 1 | 1 | 5 et 6 | 5 <= 6 oui | 5 | `3 3 5` |
| 2 | 1 | `a` fini | | on recopie la fin de `b` : 6 | `3 3 5 6` |

Les deux 3 sont gardés (aucune valeur n'est perdue : `na + nb` = 4 valeurs à la sortie). Avec `a = 2 7` et `b` vide (`nb = 0`) : la première boucle ne tourne pas (`j < 0` est faux), la deuxième recopie `2 7`, la troisième ne tourne pas.

**À retenir :** fusion = tant que les deux ont des valeurs, copier la plus petite tête ; puis recopier le reste ; total `na + nb` copies.

> [!tip] `<=` plutôt que `<`
> En cas d'égalité, prendre d'abord la valeur de `a` garde l'ordre d'origine des valeurs égales (la fusion est **stable**). Avec de simples entiers ça ne se voit pas ; avec des fiches triées par note, si. La fusion est la brique du **tri fusion** (chapitre suivant les tris simples).

Le même parcours à deux indices résout d'autres problèmes en O(na + nb) : les **valeurs communes** (on n'avance que l'indice de la plus petite, et on garde la valeur quand les deux sont égales) ou l'**union sans doublon**.

Pourquoi ne pas recopier `a` puis `b` bout à bout et trier le tout ? Ça marche, mais le tri coûte O((na + nb) log(na + nb)), plus cher que la fusion qui profite du fait que `a` et `b` sont **déjà** triés.

### Renvoyer un nouveau tableau alloué

Une fonction peut aussi **créer** le tableau résultat elle-même avec `malloc` et renvoyer son adresse. C'est alors l'**appelant** qui doit le libérer avec `free` quand il n'en a plus besoin.

**Exemple résolu : renvoyer un nouveau tableau qui contient les carrés des valeurs.**

```c
#include <stdio.h>
#include <stdlib.h>

int *carres(const int *tab, size_t n) {
    if (n == 0) {
        return NULL;
    }
    int *res = malloc(n * sizeof *res);
    if (res == NULL) {
        return NULL;
    }
    for (size_t i = 0; i < n; i++) {
        res[i] = tab[i] * tab[i];
    }
    return res;
}

int main(void) {
    int tab[] = {1, -2, 3};
    int *res = carres(tab, 3);
    if (res == NULL) {
        printf("pas de resultat\n");
        return 1;
    }
    for (size_t i = 0; i < 3; i++) {
        printf("%d ", res[i]);
    }
    printf("\n");
    free(res);
    return 0;
}
```

1. Rien à mettre (`n == 0`) : on renvoie `NULL` sans allouer.
2. On réserve `n` cases de la taille d'un `int`.
3. Si `malloc` a échoué, on renvoie `NULL` : l'appelant le teste.
4. On remplit, puis on renvoie l'adresse. Le tableau **survit** à la fin de la fonction (contrairement à un tableau local `int res[3]`, qui disparaît au `return`).
5. Dans `main`, on utilise `res` puis on appelle `free(res)`.

Pour une fusion allouée, la taille à réserver est `na + nb`.

**À retenir :** une fonction qui renvoie un tableau alloué : cas vide → `NULL`, `malloc` testé, remplissage, `return` de l'adresse ; l'appelant fait le `free`.

## 5. Ajouter dans un tableau trié

Pour qu'il reste trié, la nouvelle valeur doit aller **à sa place** :

1. trouver la position : la première case qui contient une valeur plus grande (séquentiel en O(n), ou dichotomie en O(log n)) ;
2. décaler vers la droite toutes les cases à partir de cette position, **en partant de la fin** (chapitre précédent) ;
3. écrire la valeur.

Même avec la dichotomie, le décalage coûte **O(n)**. D'où le compromis du début : un tableau trié rend la recherche très rapide, mais chaque ajout plus cher.

**Exemple résolu : ajouter 10 dans `2 5 8 12 16` (n = 5, il reste de la place).**

| Étape | Détail | Tableau |
|---|---|---|
| 1. position | première valeur plus grande que 10 : 12, en case 3 | `2 5 8 12 16` |
| 2. décalage | `tab[5] = tab[4]`, puis `tab[4] = tab[3]` | `2 5 8 12 12 16` |
| 3. écriture | `tab[3] = 10`, taille 6 | `2 5 8 10 12 16` |

La recherche de position coûte au plus O(log n) par dichotomie, le décalage `n - 3` = 2 copies ici, mais `n` copies si on ajoute une valeur plus petite que tout. Total : O(log n) + O(n) = **O(n)** (on garde le plus gros).

**À retenir :** ajouter dans un tableau trié = trouver la place + décaler + écrire ; le décalage impose O(n).

## 6. Pièges

> [!warning] Initialiser le minimum à 0
> `int min = 0;` donne un faux résultat si toutes les valeurs sont positives. On part de la première case.

> [!warning] Confondre « trouvé » et « position »
> Une fonction qui renvoie une **position** utilise `-1` pour « absent » (0 est une vraie position). Une fonction qui répond **oui / non** renvoie `1` ou `0`.

> [!warning] Les tailles différentes
> Deux tableaux de tailles différentes ne peuvent pas être égaux : on compare les tailles **avant** de lire les cases, sinon on lit au-delà du plus court.

> [!warning] Oublier un `free`
> Chaque `malloc` réussi a son `free`, y compris quand la fonction s'arrête plus tôt que prévu.

## À retenir

- Trié : minimum en O(1), recherche en **O(log n)** (dichotomie), égalité en O(n), fusion en O(na + nb). Le prix : chaque ajout coûte O(n).
- Recherche séquentielle : on ne conclut « absent » qu'**après** la boucle.
- Dichotomie : zone `[debut, fin]` avec `int`, ou `[debut, fin[` avec `size_t` ; milieu = `debut + (fin - debut) / 2` ; la case `milieu` est toujours retirée de la zone ; on s'arrête quand la zone est vide.
- Égalité non triée : trier des **copies** (`malloc`, `memcpy`, `qsort`, `free`) puis comparer (O(n log n)), sans toucher aux tableaux reçus.
- Fusion : trois indices, on copie la plus petite des deux têtes, puis on recopie le reste.
