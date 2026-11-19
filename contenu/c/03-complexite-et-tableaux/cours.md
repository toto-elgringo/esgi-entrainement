# Complexité et tableaux

## 1. Qu'est-ce qu'un algorithme ?

Un **algorithme**, c'est une méthode pour résoudre un problème. Il a toujours quatre parties :

| Partie | Exemple : cuire des pâtes | Exemple : chercher un mot dans un dictionnaire |
|---|---|---|
| Un **problème** | j'ai faim | je veux la définition de « moto » |
| Des **données en entrée** | eau, sel, pâtes crues | le dictionnaire, le mot cherché |
| Une **suite d'actions** | faire bouillir, plonger, attendre, égoutter | ouvrir une page, lire un mot, avancer... |
| Un **résultat** | une assiette de pâtes | la page où se trouve le mot |

> [!info] Algorithme et langage, deux choses différentes
> Connaître le C, c'est savoir **parler** à la machine. L'algorithmique, c'est savoir **quoi lui dire** pour qu'elle résolve le problème. Un bon algorithme se réécrit facilement dans un autre langage ; un langage ne remplace jamais un bon algorithme.

## 2. La complexité : mesurer le coût d'un algorithme

Pour un même problème, il existe souvent **plusieurs algorithmes**, plus ou moins rapides. Pour chercher « moto » :

- **Méthode A** : lire les mots un par un depuis le début. Ça marche, mais c'est long.
- **Méthode B** : ouvrir au milieu, regarder si « moto » est avant ou après, garder la bonne moitié, recommencer. Une dizaine de pages suffisent.

Chronométrer ne serait pas juste : on mesurerait aussi la vitesse de lecture de la personne. On **compte** plutôt les **opérations élémentaires** (lire un mot, comparer deux valeurs, écrire une case), et on regarde comment ce nombre **grandit quand la taille des données `n` grandit**.

> [!info] La complexité
> La **complexité** d'un algorithme, c'est l'évolution de son nombre d'opérations en fonction de la taille `n` des données. On la note avec la **notation grand O** : on garde seulement le terme qui grandit le plus vite, sans les constantes.

Exemple : un algorithme fait `3n + 5` opérations. Quand `n` devient grand, le `+ 5` ne compte plus, et le facteur `3` ne change pas l'allure de la courbe : on dit qu'il est en **O(n)**.

### Les complexités à connaître

| Notation | Nom | Exemple | n = 1 000 | n = 1 000 000 |
|---|---|---|---|---|
| O(1) | constante | lire `t[i]`, prendre le premier mot | 1 | 1 |
| O(log n) | logarithmique | recherche dichotomique (on coupe en deux) | ~10 | ~20 |
| O(n) | linéaire | parcourir un tableau | 1 000 | 1 000 000 |
| O(n log n) | quasi linéaire | les bons tris (chapitres suivants) | ~10 000 | ~20 000 000 |
| O(n²) | quadratique | deux boucles imbriquées, les tris simples | 1 000 000 | 10¹² |
| O(2ⁿ) | exponentielle | essayer toutes les combinaisons | énorme | impossible |

```anim
croissance
n: 20
titre: Comment grandissent les complexités
```

> [!tip] Lire la complexité dans le code
> - Une suite d'instructions sans boucle : **O(1)**.
> - Une boucle qui fait `n` tours, avec du O(1) dedans : **O(n)**.
> - Deux boucles imbriquées de `n` tours chacune : **O(n²)**.
> - Une boucle qui **divise par deux** ce qui reste à chaque tour : **O(log n)**.
> - Deux morceaux à la suite : on **garde le plus gros** (O(n) + O(1) = O(n)).

### Pire cas, cas moyen, meilleur cas

Pour une même taille `n`, le nombre d'opérations dépend souvent de **la façon dont les données sont rangées**. Chercher une valeur dans un tableau : si elle est dans la première case, une seule comparaison (meilleur cas) ; si elle n'y est pas, `n` comparaisons (pire cas). Sauf indication contraire, la complexité annoncée est celle du **pire cas**.

> [!info] Temps et mémoire
> On parle de complexité **temporelle** (nombre d'opérations) et de complexité **spatiale** (mémoire utilisée en plus des données). Souvent, gagner du temps coûte de la mémoire, et inversement. Un algorithme **en place** n'utilise que O(1) mémoire en plus.

> [!info] Complexité amortie
> Ajouter à la fin d'un tableau qui double sa capacité quand il est plein coûte O(1) presque toujours, et O(n) de temps en temps (quand il faut tout recopier). Comme le cas coûteux arrive de plus en plus rarement, on dit que l'ajout est en **O(1) amorti**.

## 3. Les tableaux en C

Un **tableau**, c'est une suite de **cases collées** en mémoire, toutes du **même type**, repérées par un **indice** qui commence à **0**.

```text
indice :    0    1    2    3    4    5
         +----+----+----+----+----+----+
tab :    |  5 | 16 |  2 |  3 |  6 |  4 |
         +----+----+----+----+----+----+
```

| Mot | Sens |
|---|---|
| case | le contenant |
| élément (ou valeur) | le contenu d'une case |
| indice | le numéro de la case, de `0` à `n - 1` |
| taille | le nombre de cases, souvent noté `n` |

Comme les cases sont collées et de même taille, l'adresse de la case `i` se **calcule** : adresse de `tab[0]` + `i` × taille d'une case. Accéder à `tab[i]` coûte donc **O(1)**, quelle que soit la position.

### Passer un tableau à une fonction

En C, un tableau passé à une fonction devient un **pointeur vers sa première case** : la fonction ne connaît **pas** la taille. Il faut **toujours la passer à côté**.

```c
#include <stdio.h>

void afficher(const int *tab, size_t n) {
    for (size_t i = 0; i < n; i++) {
        printf("%d ", tab[i]);
    }
    printf("\n");
}

int main(void) {
    int notes[] = {12, 15, 9, 18};
    size_t n = sizeof notes / sizeof notes[0];
    afficher(notes, n);
    return 0;
}
```

| Écriture | Sens |
|---|---|
| `const int *tab` | la fonction lit le tableau sans le modifier |
| `size_t n` | le type des tailles et des indices en C : un entier **positif** |
| `sizeof notes / sizeof notes[0]` | taille d'un tableau **déclaré dans la même fonction** (dans `afficher`, `sizeof tab` donnerait la taille d'un pointeur) |

> [!warning] `size_t` ne descend pas sous zéro
> `size_t` est **non signé** : `0 - 1` donne le plus grand nombre possible (environ 1,8 × 10¹⁹), pas `-1`. Une boucle `for (size_t i = n - 1; i >= 0; i--)` ne s'arrête **jamais** (`i >= 0` est toujours vrai), et `n - 1` avec `n == 0` est un piège. On écrit plutôt `for (size_t i = n; i > 0; i--)` et on utilise `tab[i - 1]`.

### Parcourir

Parcourir, c'est regarder chaque case une fois : **O(n)**. Exemple, la moyenne :

```text
Algo : Moyenne
Entrée : tableau tab de taille n (n > 0)

somme = 0
Pour i allant de 0 à n - 1 :
    somme = somme + tab[i]
Retourner somme / n
```

> [!warning] Les bornes
> Les indices vont de `0` à `n - 1` **compris**. `i <= n` lit une case après la fin : en C, aucune erreur n'est signalée, le programme lit n'importe quoi ou plante plus loin.

## 4. Insérer et supprimer : décaler les cases

La force du tableau (cases collées) est aussi sa faiblesse : pour **insérer** ou **supprimer** au milieu, il faut **décaler** toutes les cases qui suivent.

### Insérer à la position `p`

On suppose qu'il reste de la place après la dernière case (la **capacité** est plus grande que la taille).

```text
Algo : Inserer
Entrée : tab de taille n (capacité > n), position p (0 <= p <= n), valeur v

Pour i allant de n à p + 1 (en descendant) :
    tab[i] = tab[i - 1]
tab[p] = v
n = n + 1
```

> [!warning] Décaler en partant de la fin
> Si on décale de gauche à droite (`tab[p + 1] = tab[p]`, puis `tab[p + 2] = tab[p + 1]`...), chaque copie **écrase** la valeur suivante avant qu'elle soit déplacée : on recopie la même valeur partout. Il faut partir de **la fin** : la dernière case est copiée dans la case libre, puis l'avant-dernière dans la dernière, etc.

Insérer 8 à la position 2 dans `5 16 2 3 6 4` :

```text
5 16 2 3 6 4 _      on part de la fin
5 16 2 3 6 4 4
5 16 2 3 6 6 4
5 16 2 3 3 6 4
5 16 2 2 3 6 4      la case 2 est libérée
5 16 8 2 3 6 4      on y écrit 8
```

```c
#include <stdio.h>

int inserer(int *tab, size_t *n, size_t capacite, size_t p, int v) {
    if (*n >= capacite || p > *n) {
        return 0;
    }
    for (size_t i = *n; i > p; i--) {
        tab[i] = tab[i - 1];
    }
    tab[p] = v;
    (*n)++;
    return 1;
}

int main(void) {
    int tab[10] = {5, 16, 2, 3, 6, 4};
    size_t n = 6;
    inserer(tab, &n, 10, 2, 8);
    for (size_t i = 0; i < n; i++) {
        printf("%d ", tab[i]);
    }
    printf("\n");
    return 0;
}
```

La taille est passée par adresse (`size_t *n`) : la fonction peut ainsi l'augmenter. La condition `i > p` évite le piège du `size_t` : avec `p == 0`, la boucle s'arrête à `i == 1`, qui copie `tab[0]` dans `tab[1]`.

### Supprimer à la position `p`

Cette fois, on décale **de gauche à droite** : chaque case reçoit sa voisine de droite. Écraser la valeur supprimée, c'est justement ce qu'on veut.

```text
Algo : Supprimer
Entrée : tab de taille n, position p (0 <= p < n)

Pour i allant de p à n - 2 :
    tab[i] = tab[i + 1]
n = n - 1
```

En C : `for (size_t i = p; i + 1 < n; i++) tab[i] = tab[i + 1];`. Écrire `i + 1 < n` plutôt que `i < n - 1` évite le calcul `n - 1` quand `n` vaut 0.

| Opération | Au début | Au milieu | À la fin |
|---|---|---|---|
| Accès | O(1) | O(1) | O(1) |
| Insertion | O(n) | O(n) | O(1) s'il reste de la place, sinon O(n) (tout recopier ailleurs) |
| Suppression | O(n) | O(n) | O(1) |

## 5. Inverser un tableau

On échange la première et la dernière case, puis la deuxième et l'avant-dernière, etc. On s'arrête **au milieu** : aller jusqu'au bout échangerait chaque paire deux fois et remettrait le tableau dans l'ordre de départ.

```text
1 2 3 4 5      échange tab[0] et tab[4]
5 2 3 4 1      échange tab[1] et tab[3]
5 4 3 2 1      i = 2 = n / 2 : on s'arrête (la case du milieu ne bouge pas)
```

```c
void echanger(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

void inverser(int *tab, size_t n) {
    for (size_t i = 0; i < n / 2; i++) {
        echanger(&tab[i], &tab[n - 1 - i]);
    }
}
```

`n / 2` tours, chacun en O(1) : **O(n)** en temps, **O(1)** en mémoire (en place).

## 6. Pièges

> [!warning] La taille oubliée
> Une fonction qui reçoit `int *tab` ne peut pas deviner la taille. Toujours passer `n`, et ne jamais compter sur `sizeof tab` dans la fonction.

> [!warning] Un séparateur de trop
> `printf("%d ", tab[i])` laisse un espace après la dernière valeur. Pour un affichage propre (`1, 2, 3`), on écrit le séparateur **avant** chaque valeur sauf la première.

> [!warning] Une boucle dans une boucle sans le voir
> Supprimer toutes les occurrences d'une valeur en appelant `supprimer` à chaque fois coûte O(n²) : chaque suppression décale tout le reste. Une seule passe avec deux indices (lecture et écriture) suffit, en O(n).

## À retenir

- Algorithme = problème + entrées + actions + résultat. Plusieurs algorithmes possibles, on les compare par leur **complexité**.
- Grand O : on garde le terme qui grandit le plus vite, sans constante. O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ).
- Tableau : cases collées, indices de `0` à `n - 1`, accès en O(1). En C, la taille se passe **toujours** à côté (`size_t n`).
- Insérer : décaler **depuis la fin**. Supprimer : décaler **depuis la position**. Les deux en O(n).
- Inverser : échanger `tab[i]` et `tab[n - 1 - i]` pour `i < n / 2`.
- `size_t` est non signé : attention à `n - 1` et aux boucles qui descendent.
