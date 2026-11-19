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

- **Mémoire** : tout se fait dans le tableau, par échanges : le tri par tas est **en place**, O(1) en plus (et pas de récursivité).
- **Stabilité** : il **n'est pas stable**. Les échanges entre la racine et la fin du tas déplacent les valeurs très loin, et deux valeurs égales peuvent s'inverser.

```text
3a 3b 1      déjà un tas max (3a >= 3b, 3a >= 1)
échange 0 et 2 : 1 3b | 3a      descente : 3b 1 | 3a
échange 0 et 1 : 1 | 3b 3a      résultat : 1 3b 3a   (3b est passé devant 3a)
```

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
