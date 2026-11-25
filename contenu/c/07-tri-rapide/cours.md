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

### Où finira le pivot ? Il suffit de compter

Après la partition, à gauche du pivot il y a **toutes** les valeurs plus petites que lui, et **seulement** elles. Si 3 valeurs sont plus petites, elles occupent les cases 0, 1 et 2, et le pivot arrive dans la case 3. Donc :

**position finale du pivot = nombre de valeurs strictement plus petites que lui** (on compte à partir de l'indice 0).

**Exemple résolu :** `t = 7 3 9 2 5 8`. Où finit chaque pivot possible ?

On prend un pivot, puis on regarde les **autres** valeurs une par une et on compte celles qui sont plus petites :

| Pivot | Valeurs plus petites | Combien ? | Position finale |
|---|---|---|---|
| 5 | 3, 2 | 2 | 2 |
| 2 | aucune | 0 | 0 (tout à gauche) |
| 9 | 7, 3, 2, 5, 8 | 5 | 5 (tout à droite, la dernière case) |
| 7 | 3, 2, 5 | 3 | 3 |

Vérification avec le tableau trié `2 3 5 7 8 9` : 5 est bien à l'indice 2, 2 à l'indice 0, 9 à l'indice 5, 7 à l'indice 3.

**Avec des valeurs égales.** Dans `6 2 6 8`, on prend comme pivot le 6 de la case 0. Une seule valeur est **strictement** plus petite (le 2) : le pivot finit à l'indice 1. L'autre 6 n'est pas plus petit (il est égal) : avec la comparaison `<` du cours, il part **à droite**, avec les plus grandes.

Le résultat ne dépend **pas** de l'ordre des autres valeurs : on pourrait les mélanger n'importe comment, le nombre de valeurs plus petites resterait le même. C'est pour ça que le pivot ne bougera plus.

**À retenir :** pour savoir où atterrit un pivot, compte les valeurs strictement plus petites que lui : ce nombre est son indice final.

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

**Exemple résolu, en comptant tout :** `t = 7 3 9 2 5 8`, pivot à l'indice 4 (valeur 5).

On note après chaque ligne l'état du tableau, la valeur de `position`, le nombre de **comparaisons** `t[i] < pivot` faites et le nombre d'**échanges** (appels à `echanger`) faits depuis le début.

| Étape | Action | Tableau après | `position` | Comparaisons | Échanges |
|---|---|---|---|---|---|
| départ | | 7 3 9 2 5 8 | | 0 | 0 |
| pivot à la fin | échange (4, 5) | 7 3 9 2 8 **5** | 0 | 0 | 1 |
| i = 0 : 7 < 5 ? non | rien | 7 3 9 2 8 5 | 0 | 1 | 1 |
| i = 1 : 3 < 5 ? oui | échange (1, 0) | **3** 7 9 2 8 5 | 1 | 2 | 2 |
| i = 2 : 9 < 5 ? non | rien | 3 7 9 2 8 5 | 1 | 3 | 2 |
| i = 3 : 2 < 5 ? oui | échange (3, 1) | 3 **2** 9 7 8 5 | 2 | 4 | 3 |
| i = 4 : 8 < 5 ? non | rien | 3 2 9 7 8 5 | 2 | 5 | 3 |
| pivot à sa place | échange (2, 5) | 3 2 **5** 7 8 9 | on renvoie 2 | 5 | 4 |

Résultat : `3 2 | 5 | 7 8 9`, la fonction renvoie 2. On retrouve le comptage de la partie 1 : deux valeurs plus petites que 5 (3 et 2), donc indice 2. Les deux côtés ne sont **pas** triés (`3 2` est à l'envers) : ce sera le travail des appels suivants.

Les comptes se prévoient sans rien dérouler :

- **comparaisons** : une par case sauf celle du pivot, donc `taille - 1` (ici 6 - 1 = 5) ;
- **échanges** : un pour ranger le pivot au début, un par valeur plus petite, un pour le remettre à la fin, donc `2 + nombre de petites` (ici 2 + 2 = 4). Quand `i` et `position` sont égaux, l'échange d'une case avec elle-même ne change rien, mais il est quand même fait.

> [!warning] Les erreurs fréquentes
> - Comparer avec `t[indicePivot]` au lieu de `t[n - 1]` : après le premier échange, le pivot n'est **plus** à `indicePivot`, il est dans la dernière case.
> - Aller jusqu'à `i <= n - 1` : on compare alors le pivot avec lui-même. Sans gravité avec `<`, mais c'est une case de trop.
> - Oublier le dernier échange : le pivot reste au bout du tableau au lieu d'être à `position`.

**À retenir :** dans la partition, `position` n'avance que quand on range une petite valeur ; à la fin, c'est le nombre de petites, donc la place du pivot.

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

**Exemple résolu sur une portion :** `t = 50 60 8 3 6 1 9 80`, portion `[2, 7)` (les cases 2 à 6 : `8 3 6 1 9`), pivot à l'indice 4 (valeur 6). Les cases 0, 1 et 7 (50, 60 et 80) ne font **pas** partie de la portion : elles ne doivent pas bouger.

On calcule d'abord les bornes : `dernier = fin - 1 = 6`, `position = debut = 2`, et `i` va de 2 à 5.

| Étape | Action | Tableau après | `position` | Comparaisons | Échanges |
|---|---|---|---|---|---|
| départ | | 50 60 8 3 6 1 9 80 | | 0 | 0 |
| pivot à la fin | échange (4, 6) | 50 60 8 3 9 1 **6** 80 | 2 | 0 | 1 |
| i = 2 : 8 < 6 ? non | rien | 50 60 8 3 9 1 6 80 | 2 | 1 | 1 |
| i = 3 : 3 < 6 ? oui | échange (3, 2) | 50 60 **3** 8 9 1 6 80 | 3 | 2 | 2 |
| i = 4 : 9 < 6 ? non | rien | 50 60 3 8 9 1 6 80 | 3 | 3 | 2 |
| i = 5 : 1 < 6 ? oui | échange (5, 3) | 50 60 3 **1** 9 8 6 80 | 4 | 4 | 3 |
| pivot à sa place | échange (4, 6) | 50 60 3 1 **6** 8 9 80 | on renvoie 4 | 4 | 4 |

La fonction renvoie **4**, un indice du **grand** tableau (pas « 2 dans la portion »). 50, 60 et 80 n'ont pas bougé.

Avec `position = 0`, le premier échange aurait été (3, 0) : le 3 serait sorti de la portion pour aller dans la case 0, et le 50 serait entré dans la portion. Le tableau serait abîmé.

**À retenir :** sur une portion `[debut, fin)`, tout part de `debut` (la boucle et `position`), la dernière case est `fin - 1`, et l'indice renvoyé est un indice du tableau entier.

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

**Exemple résolu : trier `5 8 1 9 3 7 2 6` (8 cases), pivot = case du milieu.**

Chaque ligne est **un appel** qui fait une partition, dans l'ordre où le programme les fait (on finit toute la gauche avant de passer à la droite). Les portions d'une case ou vides ne sont pas écrites : l'appel s'arrête tout de suite, sans comparaison.

| Appel | Portion | Milieu (valeur) | Tableau après la partition | `p` | Comparaisons | Échanges | Appels suivants |
|---|---|---|---|---|---|---|---|
| 1 | `[0, 8)` : 5 8 1 9 3 7 2 6 | 0 + 8 / 2 = 4 (3) | 1 2 **3** 9 6 7 8 5 | 2 | 7 | 4 | `[0, 2)` et `[3, 8)` |
| 2 | `[0, 2)` : 1 2 | 0 + 2 / 2 = 1 (2) | 1 **2** 3 9 6 7 8 5 | 1 | 1 | 3 | `[0, 1)` et `[2, 2)` : 1 case et 0 case, fini |
| 3 | `[3, 8)` : 9 6 7 8 5 | 3 + 5 / 2 = 5 (7) | 1 2 3 6 5 **7** 8 9 | 5 | 4 | 4 | `[3, 5)` et `[6, 8)` |
| 4 | `[3, 5)` : 6 5 | 3 + 2 / 2 = 4 (5) | 1 2 3 **5** 6 7 8 9 | 3 | 1 | 2 | `[3, 3)` et `[4, 5)` : fini |
| 5 | `[6, 8)` : 8 9 | 6 + 2 / 2 = 7 (9) | 1 2 3 5 6 7 8 **9** | 7 | 1 | 3 | `[6, 7)` et `[8, 8)` : fini |

Total : 5 partitions, 7 + 1 + 4 + 1 + 1 = **14 comparaisons** et 4 + 3 + 4 + 2 + 3 = **16 échanges**. Le tableau final est `1 2 3 5 6 7 8 9`.

Pour vérifier une ligne, utilise le comptage de la partie 1 : à l'appel 3, dans `9 6 7 8 5`, deux valeurs sont plus petites que 7 (6 et 5), donc le pivot finit à `debut + 2 = 3 + 2 = 5`. Chaque partition coûte `taille - 1` comparaisons : 8 - 1 = 7, puis 5 - 1 = 4, etc.

> [!warning] Le milieu d'une portion
> Le milieu de `[debut, fin)` est `debut + (fin - debut) / 2`. Écrire seulement `(fin - debut) / 2` donne la moitié de la **taille**, pas un indice de la portion. À l'appel 3 ci-dessus, `(8 - 3) / 2 = 2` : la case 2 est **hors** de la portion `[3, 8)` ; la partition prendrait comme pivot une valeur qui n'en fait pas partie, et le tableau ne serait plus trié.

**Pourquoi la récursivité s'arrête.** Avec les bonnes bornes, à l'appel 2 (`[0, 2)`, `p = 1`) on continue sur `[0, 1)` et `[2, 2)`, deux portions plus petites. Si on écrivait `[debut, p + 1)`, on rappellerait `[0, 2)` : la même portion, avec le même pivot, le même `p`, et ainsi de suite jusqu'à ce que la pile d'appels déborde (le programme plante).

**À retenir :** à chaque appel, calcule le milieu avec `debut +`, partitionne, puis relance sur les deux côtés **sans** la case `p` ; une portion de 0 ou 1 case est déjà triée.

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

### La médiane de trois, pas à pas

La **médiane** de trois valeurs est celle du milieu : ni la plus petite, ni la plus grande. Pour la portion `[debut, fin)`, on regarde trois cases :

- `debut` (la première), de valeur `a` ;
- `milieu = debut + (fin - debut) / 2`, de valeur `b` ;
- `dernier = fin - 1`, de valeur `c`.

`b` est la médiane s'il est entre les deux autres, dans un sens ou dans l'autre : `a <= b <= c` **ou** `c <= b <= a`. Même test pour `a` ; si ni `b` ni `a` ne conviennent, c'est `c`. On garde l'**indice** de la case choisie, car la partition attend un indice de pivot.

**Exemple résolu :** `t = 2 7 4 8 1 6 9 3`, portion `[1, 7)`.

1. Les trois indices : `debut = 1`, `milieu = 1 + (7 - 1) / 2 = 1 + 3 = 4`, `dernier = 7 - 1 = 6`.
2. Les trois valeurs : `a = t[1] = 7`, `b = t[4] = 1`, `c = t[6] = 9`.
3. `b = 1` est-il entre les deux ? Il faudrait `7 <= 1` ou `9 <= 1` : les deux sont faux, 1 est la plus petite.
4. `a = 7` est-il entre les deux ? `1 <= 7 <= 9` : oui.
5. Réponse : l'indice **1** (valeur 7). Pas « 7 » : c'est la valeur, pas l'indice.

**Pourquoi elle sauve les tableaux triés :** sur `1 2 3 4 5 6 7 8 9`, la dernière case donne 9, le maximum, le pire pivot possible. La médiane de trois regarde 1, 5 et 9 et choisit **5**, la vraie médiane : la portion est coupée en deux moitiés égales. Sur un tableau trié à l'envers (`9 8 ... 1`), elle regarde 9, 5, 1 et choisit aussi 5.

Si deux des trois valeurs sont égales (par exemple 4, 4 et 9), la médiane vaut 4 et n'importe laquelle des deux cases qui contiennent 4 convient.

**À retenir :** médiane de trois = calcule les trois indices (`debut`, milieu avec `debut +`, `fin - 1`), cherche la valeur qui est entre les deux autres, et renvoie son **indice**.

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

**Exemple résolu : le même tableau trié `1 2 3 4 5 6 7`, deux pivots différents.**

Avec le pivot en **dernière case** (pire cas) : chaque partition ne retire que le pivot.

| Appel | Portion | Pivot | `p` | Comparaisons |
|---|---|---|---|---|
| 1 | `[0, 7)` | 7 | 6 | 6 |
| 2 | `[0, 6)` | 6 | 5 | 5 |
| 3 | `[0, 5)` | 5 | 4 | 4 |
| 4 | `[0, 4)` | 4 | 3 | 3 |
| 5 | `[0, 3)` | 3 | 2 | 2 |
| 6 | `[0, 2)` | 2 | 1 | 1 |

Total : 6 + 5 + 4 + 3 + 2 + 1 = **21** = 7 × 6 / 2, et 6 partitions emboîtées les unes dans les autres (chaque appel attend la fin du suivant).

Avec le pivot au **milieu** (meilleur cas ici) : chaque partition coupe en deux moitiés égales.

| Appel | Portion | Pivot | `p` | Comparaisons |
|---|---|---|---|---|
| 1 | `[0, 7)` | t[3] = 4 | 3 | 6 |
| 2 | `[0, 3)` | t[1] = 2 | 1 | 2 |
| 3 | `[4, 7)` | t[5] = 6 | 5 | 2 |

Total : 6 + 2 + 2 = **10**. Il y a 2 niveaux d'appels au lieu de 6 : c'est la différence entre log₂ n et n.

Le programme ci-dessous compte les comparaisons et les échanges sur des tableaux déjà triés de 7, 100 et 1 000 cases. Sur 1 000 cases : 499 500 comparaisons avec le pivot en dernière case (n(n - 1)/2), contre moins de 8 000 avec le pivot au milieu (de l'ordre de n log₂ n ≈ 1 000 × 10).

```c
#include <stdio.h>

long comparaisons = 0;
long echanges = 0;

void echanger(int *t, int i, int j) {
    int temporaire = t[i];
    t[i] = t[j];
    t[j] = temporaire;
    echanges++;
}

int partition(int *t, int debut, int fin, int indicePivot) {
    int dernier = fin - 1;
    echanger(t, indicePivot, dernier);
    int position = debut;
    for (int i = debut; i < dernier; i++) {
        comparaisons++;
        if (t[i] < t[dernier]) {
            echanger(t, i, position);
            position++;
        }
    }
    echanger(t, position, dernier);
    return position;
}

void trierRapidePartie(int *t, int debut, int fin, int pivotAuMilieu) {
    if (fin - debut <= 1) {
        return;
    }
    int indicePivot = pivotAuMilieu ? debut + (fin - debut) / 2 : fin - 1;
    int p = partition(t, debut, fin, indicePivot);
    trierRapidePartie(t, debut, p, pivotAuMilieu);
    trierRapidePartie(t, p + 1, fin, pivotAuMilieu);
}

void essayer(int n, int pivotAuMilieu) {
    int t[1000];
    for (int i = 0; i < n; i++) {
        t[i] = i + 1;
    }
    comparaisons = 0;
    echanges = 0;
    trierRapidePartie(t, 0, n, pivotAuMilieu);
    printf("n = %4d, pivot %-8s : %6ld comparaisons, %6ld echanges\n",
           n, pivotAuMilieu ? "milieu" : "dernier", comparaisons, echanges);
}

int main(void) {
    int tailles[] = {7, 100, 1000};
    for (int k = 0; k < 3; k++) {
        essayer(tailles[k], 0);
        essayer(tailles[k], 1);
    }
    return 0;
}
```

**À retenir :** le coût du tri rapide dépend du pivot : coupes équilibrées, log₂ n niveaux et O(n log n) ; pivot toujours au bord, n niveaux et (n - 1) + (n - 2) + ... + 1 = n(n - 1)/2 comparaisons, O(n²).

> [!warning] Deux pièges du pire cas
> - Un tableau **déjà trié** avec le pivot en première ou dernière case : O(n²).
> - Un tableau plein de **valeurs égales** avec la partition à deux côtés : toutes les égales partent du même côté, et on retombe aussi en O(n²). Remède : la partition en **trois zones** (plus petites, égales, plus grandes), voir la partie 6.

**Mémoire** : le tri se fait **en place** (les échanges suffisent, pas de tableau auxiliaire). Seule la pile des appels récursifs grandit : environ log n appels empilés en moyenne, jusqu'à n dans le pire cas.

**Stabilité** : le tri rapide **n'est pas stable**. Les échanges à longue distance peuvent inverser deux valeurs égales :

On note `2a` et `2b` deux valeurs égales à 2 pour les distinguer (par exemple deux élèves qui ont 2 de moyenne, `a` inscrit avant `b`). Tri rapide de `2a 2b 1`, pivot = case du milieu (indice 1, c'est `2b`) :

| Étape | Action | Tableau après | `position` |
|---|---|---|---|
| départ | | 2a 2b 1 | |
| pivot à la fin | échange (1, 2) | 2a 1 **2b** | 0 |
| i = 0 : 2 < 2 ? non | rien | 2a 1 2b | 0 |
| i = 1 : 1 < 2 ? oui | échange (1, 0) | 1 2a 2b | 1 |
| pivot à sa place | échange (1, 2) | 1 **2b** 2a | on renvoie 1 |

Les appels suivants portent sur `[0, 1)` et `[2, 3)`, une case chacun : le tri est fini, et le résultat est `1 2b 2a`. Le premier échange a envoyé `2b` au bout, **par-dessus** `2a`, puis le dernier l'a ramené devant : `2b` est maintenant avant `2a`, alors qu'il était après. Un tri **stable** garde toujours deux valeurs égales dans leur ordre de départ : ce n'est pas le cas ici.

**À retenir :** le tri rapide est en place (pas de tableau en plus, seulement la pile d'appels) mais pas stable, à cause des échanges qui sautent par-dessus d'autres cases.

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

**Exemple résolu :** `t = 4 1 4 6 4 2 6`, portion `[0, 7)`, pivot 4.

Au départ `petits = 0`, `i = 0`, `grands = 7`. Chaque ligne est un tour de boucle (on continue tant que `i < grands`). Une comparaison de `t[i]` avec le pivot suffit à choisir le cas.

| Tour | Cas | Action | Tableau après | `petits` | `i` | `grands` |
|---|---|---|---|---|---|---|
| départ | | | 4 1 4 6 4 2 6 | 0 | 0 | 7 |
| 1 | t[0] = 4, égal | `i++` | 4 1 4 6 4 2 6 | 0 | 1 | 7 |
| 2 | t[1] = 1, plus petit | échange (1, 0), `petits++`, `i++` | **1 4** 4 6 4 2 6 | 1 | 2 | 7 |
| 3 | t[2] = 4, égal | `i++` | 1 4 4 6 4 2 6 | 1 | 3 | 7 |
| 4 | t[3] = 6, plus grand | `grands--` (6), échange (3, 6) | 1 4 4 6 4 2 6 | 1 | 3 | 6 |
| 5 | t[3] = 6, plus grand | `grands--` (5), échange (3, 5) | 1 4 4 **2** 4 **6** 6 | 1 | 3 | 5 |
| 6 | t[3] = 2, plus petit | échange (3, 1), `petits++`, `i++` | 1 **2** 4 **4** 4 6 6 | 2 | 4 | 5 |
| 7 | t[4] = 4, égal | `i++` | 1 2 4 4 4 6 6 | 2 | 5 | 5 |

`i = grands = 5` : la boucle s'arrête. On écrit `*finPetits = 2` et `*debutGrands = 5`. Les trois zones : `[0, 2)` = `1 2` (plus petites), `[2, 5)` = `4 4 4` (égales, à leur place définitive), `[5, 7)` = `6 6` (plus grandes).

Regarde les tours 4 et 5 : après un échange avec la zone de droite, `i` reste à 3. Au tour 4, la valeur arrivée en case 3 est un autre 6 (venu de la case 6) ; si on avait avancé `i`, on ne l'aurait jamais regardé et ce 6 serait resté au milieu des 4. Au tour 5, c'est un 2 qui arrive : il faut aussi le regarder, il part à gauche au tour 6.

Ce qu'on compte : 7 tours de boucle, donc 7 cases regardées pour 7 cases. Chaque tour avance `i` ou recule `grands` : l'écart `grands - i` diminue de 1 à chaque fois, et la partition fait exactement `fin - debut` tours. C'est O(n).

**À retenir :** plus petit, on échange à gauche et on avance les deux ; égal, on avance `i` ; plus grand, on recule `grands`, on échange, et **on n'avance pas `i`**.

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

Ici on a eu de la chance : le premier pivot était le bon. En général, il faut plusieurs tours.

**Exemple résolu :** `t = 7 2 9 4 3 8 5 1 6` (9 cases), on cherche `k = 5`, la valeur qui serait à l'indice 5 une fois trié. Pivot = case du milieu de la portion.

| Tour | Portion | Milieu (valeur) | Tableau après la partition | `p` | Décision |
|---|---|---|---|---|---|
| 1 | `[0, 9)` | 0 + 9 / 2 = 4 (3) | 2 1 **3** 4 6 8 5 7 9 | 2 | `k = 5 > 2` : à droite, `debut = 3` |
| 2 | `[3, 9)` | 3 + 6 / 2 = 6 (5) | 2 1 3 4 **5** 8 9 7 6 | 4 | `k = 5 > 4` : à droite, `debut = 5` |
| 3 | `[5, 9)` | 5 + 4 / 2 = 7 (7) | 2 1 3 4 5 6 **7** 8 9 | 6 | `k = 5 < 6` : à gauche, `fin = 6` |
| fin | `[5, 6)` | une seule case | | | c'est la case `k` : réponse `t[5] = 6` |

Vérification : trié, le tableau est `1 2 3 4 5 6 7 8 9`, et l'indice 5 contient bien **6**.

Quand il ne reste qu'une case, c'est forcément la case `k` : à chaque tour on a gardé le côté qui contient l'indice `k`, donc `k` est toujours dans `[debut, fin)`. Et toutes les valeurs à gauche de `debut` sont plus petites, toutes celles à partir de `fin` plus grandes : la valeur restante est bien celle de rang `k`.

On a fait 8 + 5 + 3 = **16** comparaisons (`taille - 1` par partition), alors que le tri rapide complet en aurait fait plus, car il trie aussi les côtés inutiles (`2 1` à gauche, par exemple).

> [!warning] Les erreurs fréquentes
> - Chercher `k` en **valeur** : `k` est un indice du tableau trié, pas une valeur à trouver.
> - Garder le pivot dans la portion (`debut = p` au lieu de `p + 1`) : la portion peut ne plus rétrécir.
> - Calculer le milieu sans `debut +` : dès le tour 2, le pivot serait pris hors de la portion.

En moyenne, la portion est coupée en deux à chaque tour : n + n/2 + n/4 + ... ≈ 2n, soit **O(n)**. Le pire cas reste O(n²), comme le tri rapide, quand le pivot tombe toujours sur un bord.

> [!tip] Le k est un indice
> On compte à partir de 0 : `k = 0` donne le minimum, `k = n - 1` le maximum, `k = n / 2` la médiane (pour `n` impair).

**À retenir :** sélection rapide = partitionner, comparer `k` à `p`, puis ne garder **que** le côté qui contient `k` (`fin = p` ou `debut = p + 1`) jusqu'à trouver `p == k` ou une seule case.

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
