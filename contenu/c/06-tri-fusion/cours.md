# Tri fusion

Les tris simples (sélection, bulles, insertion) font de l'ordre de **n²** comparaisons. Le **tri fusion** (*merge sort*) descend à **n log n** grâce à une idée : on ne sait trier que des morceaux minuscules, mais on sait très bien **fusionner** deux morceaux déjà triés.

## 1. La seule opération de base : fusionner

On a deux tableaux **déjà triés**. On veut un seul tableau trié qui contient tout.

Méthode : on regarde la **première valeur restante** de chaque tableau, on recopie la plus petite à la suite du résultat, et on avance dans le tableau d'où elle vient. Quand l'un des deux est vide, on recopie la fin de l'autre telle quelle.

```text
a = 3 7 9        b = 2 3 6

2 < 3      -> résultat : 2
3 = 3      -> résultat : 2 3          (égalité : on prend celui de a, voir « Stabilité »)
7 > 3      -> résultat : 2 3 3
7 > 6      -> résultat : 2 3 3 6      b est vide
reste de a -> résultat : 2 3 3 6 7 9
```

À chaque tour, **une** valeur passe dans le résultat : fusionner deux tableaux de tailles `na` et `nb` coûte **O(na + nb)**, c'est-à-dire un temps linéaire.

```c
void fusionner(const int *a, int na, const int *b, int nb, int *resultat) {
    int i = 0;
    int j = 0;
    int k = 0;
    while (i < na && j < nb) {
        if (a[i] <= b[j]) {
            resultat[k++] = a[i++];
        } else {
            resultat[k++] = b[j++];
        }
    }
    while (i < na) {
        resultat[k++] = a[i++];
    }
    while (j < nb) {
        resultat[k++] = b[j++];
    }
}
```

> [!info] `resultat[k++] = a[i++];`
> Raccourci pour : `resultat[k] = a[i];` puis `k = k + 1;` et `i = i + 1;`. Le `++` placé **après** la variable utilise d'abord l'ancienne valeur, puis l'augmente.

> [!warning] Les deux boucles de fin
> Quand la première boucle s'arrête, **un** des deux tableaux a encore des valeurs. Sans les deux `while` de fin, ces valeurs sont perdues. Il en faut deux car on ne sait pas lequel des tableaux n'est pas fini.

## 2. Diviser pour régner

Un tableau de **0 ou 1 case** est forcément trié. Tout le reste se ramène à ce cas :

1. **Diviser** : couper le tableau en deux moitiés.
2. **Régner** : trier chaque moitié… avec le tri fusion lui-même (appel **récursif**).
3. **Combiner** : fusionner les deux moitiés triées.

C'est la méthode **diviser pour régner** : un gros problème est découpé en problèmes plus petits du même type, résolus de la même façon, puis on recolle les réponses.

```text
Algo : TriFusion
Entrée : Tableau t de taille n

Si n <= 1 :
    Renvoyer t
gauche = TriFusion(t[0 .. n/2 - 1])
droite = TriFusion(t[n/2 .. n - 1])
Renvoyer Fusion(gauche, droite)
```

```text
          7 3 10 2 9 3 6 2
      7 3 10 2         9 3 6 2            on coupe en deux...
    7 3     10 2     9 3     6 2
   7   3   10   2   9   3   6   2         ... jusqu'aux morceaux d'une case
    3 7     2 10     3 9     2 6          on fusionne deux par deux
      2 3 7 10         2 3 6 9
          2 2 3 3 6 7 9 10                dernière fusion
```

> [!tip] La récursivité en deux règles
> Une fonction récursive (qui s'appelle elle-même) a besoin :
> - d'un **cas de base** qui s'arrête sans s'appeler : ici `n <= 1` ;
> - d'appels sur un problème **plus petit** : ici chaque moitié. Sinon la fonction s'appelle à l'infini et la pile d'appels déborde.

> [!info] On trie toujours la gauche d'abord
> L'ordre des deux appels ne change pas le résultat, mais par convention (et sur Schooding), on trie la moitié de gauche avant celle de droite.

```anim
tri
algo: fusion
```

## 3. En C : un seul tableau auxiliaire

En C, on ne crée pas de nouveaux tableaux à chaque appel. On travaille sur une **portion** `[debut, fin)` du tableau (de `debut` compris à `fin` **non compris**), et on réserve **une seule fois** un tableau auxiliaire `aux` de `n` cases, qui sert de brouillon pour toutes les fusions.

```c
#include <stdio.h>
#include <stdlib.h>

void fusionnerParties(int *t, int *aux, int debut, int milieu, int fin) {
    int i = debut;
    int j = milieu;
    int k = debut;
    while (i < milieu && j < fin) {
        if (t[i] <= t[j]) {
            aux[k++] = t[i++];
        } else {
            aux[k++] = t[j++];
        }
    }
    while (i < milieu) {
        aux[k++] = t[i++];
    }
    while (j < fin) {
        aux[k++] = t[j++];
    }
    for (k = debut; k < fin; k++) {
        t[k] = aux[k];
    }
}

void trierPartie(int *t, int *aux, int debut, int fin) {
    if (fin - debut <= 1) {
        return;
    }
    int milieu = debut + (fin - debut) / 2;
    trierPartie(t, aux, debut, milieu);
    trierPartie(t, aux, milieu, fin);
    fusionnerParties(t, aux, debut, milieu, fin);
}

void triFusion(int *t, int n) {
    if (n < 2) {
        return;
    }
    int *aux = malloc(n * sizeof(int));
    if (aux == NULL) {
        exit(EXIT_FAILURE);
    }
    trierPartie(t, aux, 0, n);
    free(aux);
}

int main(void) {
    int t[] = {7, 3, 10, 2, 9, 3, 6, 2};
    int n = 8;
    triFusion(t, n);
    for (int i = 0; i < n; i++) {
        printf("%d ", t[i]);
    }
    printf("\n");
    return 0;
}
```

> [!info] Pourquoi `[debut, fin)` ?
> Avec une fin **exclue**, la taille de la portion est simplement `fin - debut`, et les deux moitiés `[debut, milieu)` et `[milieu, fin)` se touchent sans se chevaucher. C'est la même convention que `subArray(start, end)` sur Schooding.

> [!warning] `milieu = debut + (fin - debut) / 2`
> Et pas `fin / 2` : la portion ne commence pas forcément à 0. Pour `[4, 8)`, le milieu est 6, pas 4.

## 4. Combien ça coûte ?

- **Nombre de niveaux** : on coupe en deux à chaque étape. 8 cases : 3 découpages (en 4, en 2, en 1) ; 16 cases : 4 ; 1024 cases : 10. Il y a donc **log₂ n** niveaux.
- **Travail par niveau** : à chaque niveau, les fusions touchent chaque valeur une fois en tout, soit **O(n)**.
- **Total** : log n niveaux × n = **O(n log n)**, et ce dans **tous** les cas (meilleur, moyen, pire).

| n | n² (tri à bulles) | n log₂ n (tri fusion) |
|---|---|---|
| 1 000 | 1 000 000 | environ 10 000 |
| 1 000 000 | 1 000 000 000 000 | environ 20 000 000 |

**Mémoire** : le tableau auxiliaire prend **n** cases en plus, soit O(n). Le tri fusion **n'est pas en place** : c'est son point faible.

## 5. Stabilité

Un tri est **stable** si deux valeurs **égales** gardent leur ordre de départ. Ça compte quand on trie des fiches selon un seul champ : par exemple trier des copies par note en gardant, pour une même note, l'ordre alphabétique obtenu avant.

Le tri fusion est stable **à une condition** : en cas d'égalité, prendre la valeur de la moitié **gauche** (celle qui était placée avant).

> [!warning] `<=` et pas `<`
> Avec `if (t[i] < t[j])`, en cas d'égalité, c'est la valeur de **droite** qui passe d'abord : le résultat reste trié, mais le tri n'est **plus stable**. L'erreur est invisible tant qu'on trie des nombres seuls.

## 6. Parallélisable

Les deux moitiés sont **indépendantes** : pendant qu'une personne (ou un cœur du processeur) trie la gauche, une autre peut trier la droite. Seule la fusion doit attendre que les deux aient fini. Le tri fusion se **parallélise** donc bien, contrairement au tri par sélection ou au tri à bulles, où chaque passage dépend du précédent.

> [!warning] Une limite au parallélisme
> Plus on monte dans les fusions, moins il y a de travail à se partager : la toute dernière fusion parcourt les **n** valeurs et une seule personne peut la faire. Ajouter des cœurs accélère le début, mais pas cette dernière étape. D'autres tris se découpent encore mieux entre plusieurs travailleurs.

## À retenir

| | Tri fusion |
|---|---|
| Méthode | diviser pour régner : couper, trier chaque moitié, fusionner |
| Opération de base | fusion de deux tableaux triés, O(n) |
| Temps | O(n log n) dans tous les cas |
| Mémoire en plus | O(n) (tableau auxiliaire) : pas en place |
| Stable | oui, si on prend la gauche en cas d'égalité (`<=`) |
| Parallélisable | oui, les deux moitiés sont indépendantes |
