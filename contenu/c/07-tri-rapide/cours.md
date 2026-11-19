# Tri rapide

Le **tri rapide** (*quicksort*) est, comme le tri fusion, un tri **diviser pour régner**. Mais il fait le travail dans l'autre sens : au lieu de couper n'importe où puis de **fusionner** avec soin, il range **d'abord** les valeurs autour d'une valeur de référence, le **pivot**, puis trie chaque côté. Il n'y a plus rien à recoller à la fin, et tout se passe **dans le tableau lui-même**.

## 1. L'idée : un pivot à sa place définitive

On choisit une valeur du tableau, le **pivot**, et on déplace les autres valeurs pour que :

- toutes celles qui sont **plus petites** que le pivot soient à sa **gauche** ;
- toutes celles qui sont **plus grandes** soient à sa **droite**.

C'est la **partition**. Les deux côtés ne sont pas encore triés, mais le pivot, lui, est déjà **à sa place finale** : il a exactement autant de valeurs plus petites avant lui qu'il en aura dans le tableau trié. Il ne bougera plus jamais.

```text
avant  : 4 9 1 6 8 2 7          pivot = 6
après  : 4 1 2 | 6 | 8 9 7
         < 6     ^     > 6
                 place définitive (indice 3 : trois valeurs plus petites)
```

Il reste à recommencer sur la partie gauche, puis sur la partie droite, tant qu'une partie contient au moins deux cases.

## 2. La partition, pas à pas

La méthode du cours (on l'appelle souvent **partition de Lomuto**) :

1. Échanger le pivot avec la **dernière** case : il est rangé à l'abri pendant le travail.
2. Mettre une variable `position` au début de la portion : c'est là qu'ira la prochaine petite valeur.
3. Parcourir toutes les cases **sauf la dernière**. Si la valeur est plus petite que le pivot : l'échanger avec la case `position`, puis avancer `position`. Sinon : ne rien faire.
4. Échanger le pivot (la dernière case) avec la case `position`. Renvoyer `position`.

Pendant tout le parcours, les cases avant `position` contiennent uniquement des valeurs plus petites que le pivot.

```text
t = 4 9 1 6 8 2 7, pivot à l'indice 3 (valeur 6)

étape 1 : pivot à la fin       4 9 1 7 8 2 6     position = 0
i = 0 : 4 < 6, échange (0, 0)  4 9 1 7 8 2 6     position = 1
i = 1 : 9 > 6, rien
i = 2 : 1 < 6, échange (2, 1)  4 1 9 7 8 2 6     position = 2
i = 3 : 7 > 6, rien
i = 4 : 8 > 6, rien
i = 5 : 2 < 6, échange (5, 2)  4 1 2 7 8 9 6     position = 3
étape 4 : échange (3, 6)       4 1 2 6 8 9 7     on renvoie 3
```

```text
Algo : Partition
Entrée : tableau t de taille n, indice du pivot p
Sortie : nouvelle position du pivot

Échanger t[p] et t[n - 1]
position = 0
Pour i allant de 0 à n - 2 :
    Si t[i] < t[n - 1] :
        Échanger t[i] et t[position]
        position = position + 1
Échanger t[position] et t[n - 1]
Renvoyer position
```

Chaque case est regardée une seule fois : la partition coûte **O(n)**, sans tableau en plus.

```anim
partition
```

> [!info] `<` ou `<=` ?
> Les deux marchent. Avec `<`, les valeurs **égales** au pivot vont à droite ; avec `<=`, elles vont à gauche. Le pivot est bien placé dans les deux cas.

### En C, sur une portion `[debut, fin)`

Comme pour le tri fusion, on ne découpe pas le tableau : on travaille sur la portion de `debut` (compris) à `fin` (non compris). La dernière case de la portion est donc `fin - 1`, et `position` part de `debut`, **pas de 0**.

```c
void echanger(int *t, int i, int j) {
    int temporaire = t[i];
    t[i] = t[j];
    t[j] = temporaire;
}

int partition(int *t, int debut, int fin, int indicePivot) {
    int dernier = fin - 1;
    echanger(t, indicePivot, dernier);
    int position = debut;
    for (int i = debut; i < dernier; i++) {
        if (t[i] < t[dernier]) {
            echanger(t, i, position);
            position++;
        }
    }
    echanger(t, position, dernier);
    return position;
}
```

> [!warning] Le piège de la portion
> Sur Schooding, `subArray` donne un **nouveau tableau qui commence à 0**. En C, on garde le même tableau : écrire `int position = 0;` ou `for (int i = 0; ...)` marche pour la première partition, puis casse tout dès que la portion ne commence plus à 0.

## 3. Le tri rapide

```text
Algo : TriRapide
Entrée : tableau t de taille n

Si n <= 1 :
    Arrêter
p = Partition(t, ChoixPivot(t))
TriRapide(t[0 .. p - 1])
TriRapide(t[p + 1 .. n - 1])
```

Le pivot n'est dans **aucun** des deux appels : il est déjà à sa place. Chaque appel travaille donc sur au moins une case de moins, ce qui garantit que la récursivité s'arrête.

```c
#include <stdio.h>

void echanger(int *t, int i, int j) {
    int temporaire = t[i];
    t[i] = t[j];
    t[j] = temporaire;
}

int partition(int *t, int debut, int fin, int indicePivot) {
    int dernier = fin - 1;
    echanger(t, indicePivot, dernier);
    int position = debut;
    for (int i = debut; i < dernier; i++) {
        if (t[i] < t[dernier]) {
            echanger(t, i, position);
            position++;
        }
    }
    echanger(t, position, dernier);
    return position;
}

void trierRapidePartie(int *t, int debut, int fin) {
    if (fin - debut <= 1) {
        return;
    }
    int milieu = debut + (fin - debut) / 2;
    int p = partition(t, debut, fin, milieu);
    trierRapidePartie(t, debut, p);
    trierRapidePartie(t, p + 1, fin);
}

void triRapide(int *t, int n) {
    trierRapidePartie(t, 0, n);
}

int main(void) {
    int t[] = {4, 9, 1, 6, 8, 2, 7};
    int n = 7;
    triRapide(t, n);
    for (int i = 0; i < n; i++) {
        printf("%d ", t[i]);
    }
    printf("\n");
    return 0;
}
```

> [!tip] Les bornes des deux appels
> La gauche est `[debut, p)` et la droite `[p + 1, fin)` : la case `p` (le pivot) est sautée. Si on écrit `[debut, p + 1)`, le pivot est repris à chaque fois et, dans le pire cas, la portion ne rétrécit plus : appels sans fin.

```anim
tri
algo: rapide
```

## 4. Quel pivot choisir ?

Le pivot idéal est la **médiane** (la valeur du milieu une fois trié) : il coupe la portion en deux moitiés égales. Mais la trouver coûte cher. En pratique :

| Choix | Avantage | Risque |
|---|---|---|
| première ou dernière case | le plus simple | catastrophique sur un tableau **déjà trié** |
| case du milieu | simple, bon sur un tableau trié | des tableaux piégés existent quand même |
| médiane de trois (début, milieu, fin) | évite les cas faciles à rencontrer | un peu plus de code |
| case au hasard | aucun tableau n'est mauvais à coup sûr | il faut un générateur de hasard |

> [!info] Un débat qui compte surtout pour les données rangées
> Le meilleur choix du pivot est discuté depuis longtemps. Sur des valeurs vraiment mélangées, tous ces choix donnent à peu près le même temps. L'écart se voit sur des données **déjà triées** ou presque, très fréquentes en vrai : c'est là qu'il faut éviter la première et la dernière case.

## 5. Combien ça coûte ?

- **Cas moyen** (et meilleur cas) : le pivot coupe à peu près au milieu. Comme pour le tri fusion, il y a environ **log₂ n** niveaux, et à chaque niveau les partitions touchent toutes les valeurs une fois : **O(n log n)**.
- **Pire cas** : le pivot est à chaque fois la plus petite ou la plus grande valeur. Une partie est vide, l'autre a **une seule case de moins**. Il y a alors **n** niveaux : (n - 1) + (n - 2) + ... + 1 = n(n - 1)/2 comparaisons, soit **O(n²)**.

```text
pivot = dernière case, tableau déjà trié : 1 2 3 4 5

[1 2 3 4 5]   pivot 5 -> gauche [1 2 3 4], droite vide    4 comparaisons
[1 2 3 4]     pivot 4 -> gauche [1 2 3]                   3 comparaisons
[1 2 3]       pivot 3 -> gauche [1 2]                     2 comparaisons
[1 2]         pivot 2 -> gauche [1]                       1 comparaison
                                                  total : 10 = 5 × 4 / 2
```

> [!warning] Deux pièges du pire cas
> - Un tableau **déjà trié** avec le pivot en première ou dernière case : O(n²).
> - Un tableau plein de **valeurs égales** avec la partition à deux côtés : toutes les égales partent du même côté, et on retombe aussi en O(n²). Remède : la partition en **trois zones** (plus petites, égales, plus grandes), voir la partie 6.

**Mémoire** : le tri se fait **en place** (les échanges suffisent, pas de tableau auxiliaire). Seule la pile des appels récursifs grandit : environ log n appels empilés en moyenne, jusqu'à n dans le pire cas.

**Stabilité** : le tri rapide **n'est pas stable**. Les échanges à longue distance peuvent inverser deux valeurs égales :

```text
2a 2b 1     pivot = 1 (déjà en dernière case)
aucune valeur < 1, position = 0
échange (0, 2)  ->  1 2b 2a       2b est maintenant avant 2a
```

> [!info] Pour aller plus loin : la partition de Hoare
> Une autre partition, plus ancienne, avance deux indices l'un vers l'autre (un depuis la gauche, un depuis la droite) et échange les paires mal placées. Elle fait moins d'échanges, mais le pivot ne finit pas forcément à sa place définitive : les appels récursifs se font alors sur `[debut, j + 1)` et `[j + 1, fin)`. Le cours utilise la méthode ci-dessus (pivot à la fin).

## 6. Beaucoup de valeurs égales : la partition en trois zones

Avec la partition à deux côtés, un tableau comme `5 5 5 5 5 5` est un pire cas : aucune valeur n'est `< 5`, le pivot finit au début, la partie droite a une seule case de moins, et ainsi de suite. O(n²) alors que tout est déjà trié.

L'idée : ranger la portion en **trois zones** d'un seul passage.

```text
[ < pivot | = pivot | pas encore vu | > pivot ]
 debut     petits    i              grands     fin
```

On garde trois indices :

- `petits` : fin de la zone des valeurs plus petites (on y met la prochaine petite) ;
- `i` : la case que l'on regarde ;
- `grands` : début de la zone des valeurs plus grandes.

Tant que `i < grands` :

| `t[i]` est... | On fait | Puis |
|---|---|---|
| plus petit que le pivot | échanger `t[i]` et `t[petits]` | `petits++`, `i++` |
| égal au pivot | rien | `i++` |
| plus grand que le pivot | `grands--`, échanger `t[i]` et `t[grands]` | **ne pas** avancer `i` : la valeur arrivée n'a pas encore été regardée |

```c
void partitionTroisZones(int *t, int debut, int fin, int pivot, int *finPetits, int *debutGrands) {
    int petits = debut;
    int i = debut;
    int grands = fin;
    while (i < grands) {
        if (t[i] < pivot) {
            echanger(t, i, petits);
            petits++;
            i++;
        } else if (t[i] > pivot) {
            grands--;
            echanger(t, i, grands);
        } else {
            i++;
        }
    }
    *finPetits = petits;
    *debutGrands = grands;
}
```

Les cases `[petits, grands)` contiennent toutes la valeur du pivot : elles sont **toutes** à leur place définitive. On ne trie plus que `[debut, petits)` et `[grands, fin)`. Sur un tableau rempli d'une seule valeur, une seule partition suffit : O(n).

> [!info] Deux résultats pour une fonction
> En C, une fonction ne renvoie qu'une valeur. Pour en donner deux (`petits` et `grands`), on passe leurs **adresses** (`int *finPetits`) et la fonction écrit dedans : `*finPetits = petits;`. On l'appelle avec `partitionTroisZones(t, debut, fin, pivot, &p, &g);`.

## 7. La sélection rapide : trouver la k-ième valeur

Pour trouver la **médiane** ou la k-ième plus petite valeur, trier tout le tableau (O(n log n)) fait trop de travail. La partition suffit : après une partition, le pivot est à sa place définitive `p`.

- si `p == k` : c'est la valeur cherchée ;
- si `k < p` : elle est à gauche, on continue **seulement** sur `[debut, p)` ;
- si `k > p` : elle est à droite, on continue **seulement** sur `[p + 1, fin)`.

On ne descend que d'un côté, et pas besoin de récursivité : une boucle qui resserre `debut` et `fin` suffit.

```text
k = 3 (la 4e plus petite), t = 4 9 1 6 8 2 7

partition sur [0, 7), pivot 6  ->  4 1 2 6 8 9 7, p = 3     p == k : réponse 6
```

En moyenne, la portion est coupée en deux à chaque tour : n + n/2 + n/4 + ... ≈ 2n, soit **O(n)**. Le pire cas reste O(n²), comme le tri rapide, quand le pivot tombe toujours sur un bord.

> [!tip] Le k est un indice
> On compte à partir de 0 : `k = 0` donne le minimum, `k = n - 1` le maximum, `k = n / 2` la médiane (pour `n` impair).

## 8. Tri rapide ou tri fusion ?

| | Tri fusion | Tri rapide |
|---|---|---|
| Le travail se fait... | à la fin (fusion) | au début (partition) |
| Temps moyen | O(n log n) | O(n log n) |
| Pire cas | O(n log n) | **O(n²)** |
| Mémoire en plus | O(n) | aucune (en place), plus la pile d'appels |
| Stable | oui | non |
| En pratique | sûr | souvent le plus rapide (peu de copies) |

## À retenir

| | Tri rapide |
|---|---|
| Méthode | choisir un pivot, partitionner, trier chaque côté |
| Partition | pivot à la fin, `position` part du **début de la portion**, O(n) |
| Après une partition | le pivot est à sa place définitive |
| Appels récursifs | `[debut, p)` et `[p + 1, fin)` : sans le pivot |
| Temps | O(n log n) en moyenne, **O(n²)** dans le pire cas |
| Mémoire | en place |
| Stable | non |
| Beaucoup de valeurs égales | partition en **trois zones** |
| k-ième plus petite valeur | sélection rapide : un seul côté, O(n) en moyenne |
