# Tri fusion

Les tris simples (sélection, bulles, insertion) font de l'ordre de **n²** comparaisons. Le **tri fusion** (*merge sort*) descend à **n log n** grâce à une idée : on ne sait trier que des morceaux minuscules, mais on sait très bien **fusionner** deux morceaux déjà triés.

## 1. La seule opération de base : fusionner

On a deux tableaux **déjà triés**. On veut un seul tableau trié qui contient tout.

Méthode : on regarde la **première valeur restante** de chaque tableau, on recopie la plus petite à la suite du résultat, et on avance dans le tableau d'où elle vient. Quand l'un des deux est vide, on recopie la fin de l'autre telle quelle.

**Exemple résolu : fusionner `a = 3 7 9` et `b = 2 3 6`.** `i` est la position de la prochaine valeur à lire dans `a`, `j` celle dans `b`, `k` la prochaine case libre du résultat.

| Tour | `a[i]` | `b[j]` | Comparaison | On prend | Résultat |
|---|---|---|---|---|---|
| 1 | 3 | 2 | 3 <= 2 ? non | 2 (de `b`), `j` avance | 2 |
| 2 | 3 | 3 | 3 <= 3 ? oui | 3 (de `a`), `i` avance | 2 3 |
| 3 | 7 | 3 | 7 <= 3 ? non | 3 (de `b`), `j` avance | 2 3 3 |
| 4 | 7 | 6 | 7 <= 6 ? non | 6 (de `b`), `j` avance | 2 3 3 6 |
| fin | 7 | (`b` est vide) | plus de comparaison | on recopie 7 puis 9 | 2 3 3 6 7 9 |

Bilan : **4 comparaisons** et 6 valeurs recopiées. Au tour 2, les deux valeurs sont égales : on prend celle de `a` (voir « Stabilité »). Les doublons sont gardés : les deux 3 sont dans le résultat.

Deux cas limites :

- si `b` est vide, la première boucle ne tourne pas du tout et on recopie `a` en entier (même chose dans l'autre sens) ;
- si toutes les valeurs de `a` sont plus petites que celles de `b`, on prend tout `a`, puis on recopie tout `b` sans comparer.

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

**À retenir :** fusionner = comparer les deux premières valeurs restantes, prendre la plus petite (celle de gauche si égalité), puis recopier la fin du tableau qui n'est pas vide ; `na + nb` valeurs écrites, une seule fois chacune.

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

**Exemple résolu : une petite fonction récursive.** `nombreChiffres(n)` compte les chiffres d'un entier positif. Cas de base : un nombre plus petit que 10 a 1 chiffre. Sinon, on enlève le dernier chiffre (`n / 10`, division entière) et on compte 1 de plus.

```c
#include <stdio.h>

int nombreChiffres(int n) {
    if (n < 10) {
        return 1;
    }
    return 1 + nombreChiffres(n / 10);
}

int main(void) {
    printf("%d\n", nombreChiffres(7));
    printf("%d\n", nombreChiffres(4703));
    printf("%d\n", nombreChiffres(1000000));
    return 0;
}
```

Les appels pour `nombreChiffres(4703)` :

| Appel | `n < 10` ? | Ce qu'il renvoie |
|---|---|---|
| `nombreChiffres(4703)` | non | 1 + `nombreChiffres(470)` |
| `nombreChiffres(470)` | non | 1 + `nombreChiffres(47)` |
| `nombreChiffres(47)` | non | 1 + `nombreChiffres(4)` |
| `nombreChiffres(4)` | oui : cas de base | 1 |

On remonte : 1, puis 1 + 1 = 2, puis 3, puis **4**. Chaque appel attend la réponse du suivant, puis ajoute son 1.

**À retenir :** une fonction récursive = un cas de base qui répond sans s'appeler, puis « un peu de travail + l'appel sur un problème plus petit ».

### Combien de niveaux de découpage ?

On coupe un morceau de `n` cases en `n / 2` cases à gauche et le reste, `n - n / 2`, à droite. On recommence jusqu'aux morceaux d'une case. Le **nombre de niveaux** est le nombre de découpages subis par le morceau qui en subit le plus : il faut donc suivre la **plus grande** moitié, `n - n / 2`.

**Exemple résolu : 12 cases, puis 7 cases.**

| Taille du morceau | Moitiés (`n / 2` et `n - n / 2`) | On suit | Niveaux comptés |
|---|---|---|---|
| 12 | 6 et 6 | 6 | 1 |
| 6 | 3 et 3 | 3 | 2 |
| 3 | 1 et 2 | 2 | 3 |
| 2 | 1 et 1 | 1 | 4 |
| 1 | on ne coupe plus | | **4 niveaux** |

Pour 7 cases : 7 se coupe en 3 et 4, on suit 4 ; 4 en 2 et 2 ; 2 en 1 et 1 : **3 niveaux**. Si on avait suivi la petite moitié (7, 3, 1), on n'aurait trouvé que 2 niveaux, alors que la moitié de 4 cases est coupée 2 fois de plus.

C'est exactement la récursivité de la partie précédente : cas de base « 0 ou 1 case : 0 niveau », sinon « 1 découpage + les niveaux de la plus grande moitié ». Le résultat est **log₂ n arrondi au-dessus** : 2³ = 8 < 12 ≤ 16 = 2⁴, donc 4 niveaux pour 12 cases.

**À retenir :** niveaux de découpage = nombre de fois qu'on peut couper en deux (en suivant la plus grande moitié) avant d'arriver à 1 case, soit log₂ n arrondi au-dessus.

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

- `fusionnerParties` est la fusion de la partie 1, mais les deux tableaux triés sont deux portions **voisines** du même tableau : `[debut, milieu)` et `[milieu, fin)`. On écrit dans `aux` (écrire directement dans `t` écraserait des valeurs pas encore lues), puis on recopie `aux[debut .. fin - 1]` dans `t`.
- `trierPartie` : cas de base « 1 case ou moins » (`fin - debut <= 1`), sinon trier la gauche, trier la droite, fusionner.
- `triFusion` réserve `aux` avec `malloc(n * sizeof(int))` (n cases de la taille d'un `int`), vérifie que la réservation a réussi (`NULL` sinon), lance le tri sur `[0, n)` et rend la mémoire avec `free`. Si `n < 2`, il n'y a rien à trier : on ne réserve rien.

> [!info] Pourquoi `[debut, fin)` ?
> Avec une fin **exclue**, la taille de la portion est simplement `fin - debut`, et les deux moitiés `[debut, milieu)` et `[milieu, fin)` se touchent sans se chevaucher. C'est la même convention que `subArray(start, end)` sur Schooding.

> [!warning] `milieu = debut + (fin - debut) / 2`
> Et pas `fin / 2` : la portion ne commence pas forcément à 0. Pour `[4, 8)`, le milieu est 6, pas 4.

**Exemple résolu : le milieu de quelques portions.**

| Portion | Taille `fin - debut` | `debut + (fin - debut) / 2` | Moitiés | `fin / 2` (faux) |
|---|---|---|---|---|
| `[0, 6)` | 6 | 0 + 3 = 3 | `[0, 3)` et `[3, 6)` | 3 (juste par hasard, car `debut` vaut 0) |
| `[3, 6)` | 3 | 3 + 1 = 4 | `[3, 4)` et `[4, 6)` | 3 : gauche `[3, 3)` vide, droite `[3, 6)` = toute la portion |
| `[4, 8)` | 4 | 4 + 2 = 6 | `[4, 6)` et `[6, 8)` | 4 : même problème |

Avec `fin / 2`, l'appel sur la droite retombe sur la **même** portion : la fonction se rappelle sans fin sur le même problème et la pile d'appels déborde.

**Exemple résolu : tous les appels pour `t = 5 1 4 2 6 3`** (6 cases). La colonne « Profondeur » dit qui appelle qui : un appel de profondeur 2 a été lancé par l'appel de profondeur 1 juste au-dessus. Les fusions arrivent quand les deux moitiés sont triées.

| Ordre | Profondeur | Ce qui se passe | `t` après |
|---|---|---|---|
| 1 | 0 | `trierPartie(0, 6)` : milieu 3, trie d'abord `[0, 3)` | 5 1 4 2 6 3 |
| 2 | 1 | `trierPartie(0, 3)` : milieu 1 ; `[0, 1)` est un cas de base | 5 1 4 2 6 3 |
| 3 | 2 | `trierPartie(1, 3)` : milieu 2 ; `[1, 2)` et `[2, 3)` sont des cas de base | 5 1 4 2 6 3 |
| 4 | 2 | fusion de 1 et 4 (1 comparaison) | 5 1 4 2 6 3 |
| 5 | 1 | fusion de 5 et 1 4 (2 comparaisons) | 1 4 5 2 6 3 |
| 6 | 1 | `trierPartie(3, 6)` : milieu 4 ; `[3, 4)` est un cas de base | 1 4 5 2 6 3 |
| 7 | 2 | `trierPartie(4, 6)` : fusion de 6 et 3 (1 comparaison) | 1 4 5 2 3 6 |
| 8 | 1 | fusion de 2 et 3 6 (1 comparaison) | 1 4 5 2 3 6 |
| 9 | 0 | fusion de 1 4 5 et 2 3 6 (5 comparaisons) | 1 2 3 4 5 6 |

Bilan : 5 fusions, 1 + 2 + 1 + 1 + 5 = **10 comparaisons**. La moitié gauche est entièrement triée (étape 5) avant qu'on touche à la droite.

**À retenir :** `trierPartie` = cas de base si 1 case ou moins, sinon milieu `debut + (fin - debut) / 2`, trier la gauche, trier la droite, fusionner dans `aux` et recopier.

### Sans récursivité : de bas en haut

On peut aussi partir des morceaux d'**une case** et faire les fusions dans l'ordre inverse : on fusionne les blocs de largeur 1 deux par deux (on obtient des blocs triés de 2), puis les blocs de largeur 2 (blocs de 4), puis 4, 8… On s'arrête quand la largeur atteint `n`.

Pour une largeur `largeur`, les paires de blocs commencent à `debut = 0`, `2 × largeur`, `4 × largeur`… Pour chaque paire :

- bloc de gauche `[debut, milieu)` avec `milieu = debut + largeur` ;
- bloc de droite `[milieu, fin)` avec `fin = debut + 2 × largeur`, **ramené à `n`** s'il dépasse (le dernier bloc peut être plus court) ;
- si `milieu >= n`, il n'y a **pas** de bloc de droite : le bloc de gauche est déjà trié, il n'y a rien à fusionner.

**Exemple résolu : `5 1 4 2 6 3` (n = 6).**

| Largeur | `debut` | Gauche `[debut, milieu)` | Droite `[milieu, fin)` | Fusion | `t` après la largeur |
|---|---|---|---|---|---|
| 1 | 0 | `[0, 1)` : 5 | `[1, 2)` : 1 | 1 5 | |
| 1 | 2 | `[2, 3)` : 4 | `[3, 4)` : 2 | 2 4 | |
| 1 | 4 | `[4, 5)` : 6 | `[5, 6)` : 3 | 3 6 | 1 5 2 4 3 6 |
| 2 | 0 | `[0, 2)` : 1 5 | `[2, 4)` : 2 4 | 1 2 4 5 | |
| 2 | 4 | `[4, 6)` : 3 6 | milieu = 6 ≥ n : pas de bloc de droite | rien | 1 2 4 5 3 6 |
| 4 | 0 | `[0, 4)` : 1 2 4 5 | `[4, 8)` ramené à `[4, 6)` : 3 6 | 1 2 3 4 5 6 | 1 2 3 4 5 6 |

La largeur suivante, 8, est ≥ 6 : un bloc couvre tout le tableau, c'est fini. Les deux cas difficiles sont apparus : un bloc sans voisin (largeur 2) et un bloc de droite plus court (largeur 4).

```text
Pour largeur = 1, 2, 4, ... tant que largeur < n :
    Pour debut = 0, 2*largeur, 4*largeur, ... tant que debut + largeur < n :
        milieu = debut + largeur
        fin = min(debut + 2*largeur, n)
        fusionner [debut, milieu) et [milieu, fin)
```

**À retenir :** version itérative = largeur 1, 2, 4… ; fusionner les blocs voisins deux par deux, en ramenant `fin` à `n` et en sautant un bloc qui n'a pas de voisin.

## 4. Combien ça coûte ?

- **Nombre de niveaux** : on coupe en deux à chaque étape. 8 cases : 3 découpages (en 4, en 2, en 1) ; 16 cases : 4 ; 1024 cases : 10. Il y a donc **log₂ n** niveaux.
- **Travail par niveau** : à chaque niveau, les fusions touchent chaque valeur une fois en tout, soit **O(n)**.
- **Total** : log n niveaux × n = **O(n log n)**, et ce dans **tous** les cas (meilleur, moyen, pire).

**Exemple résolu : le travail pour 8 cases**, niveau par niveau (on compte les valeurs écrites dans `aux`).

| Niveau de fusion | Fusions faites | Taille de chaque résultat | Valeurs écrites |
|---|---|---|---|
| 1 | 4 (blocs de 1 avec blocs de 1) | 2 | 4 × 2 = 8 |
| 2 | 2 (blocs de 2 avec blocs de 2) | 4 | 2 × 4 = 8 |
| 3 | 1 (blocs de 4 avec blocs de 4) | 8 | 1 × 8 = 8 |

3 niveaux (log₂ 8 = 3) de 8 valeurs chacun : 3 × 8 = **24** valeurs écrites, soit n × log₂ n. Le contenu du tableau ne change rien à ce découpage : trié, à l'envers ou mélangé, on coupe toujours au même endroit.

| n | n² (tri à bulles) | n log₂ n (tri fusion) |
|---|---|---|
| 1 000 | 1 000 000 | environ 10 000 |
| 1 000 000 | 1 000 000 000 000 | environ 20 000 000 |

**Mémoire** : le tableau auxiliaire prend **n** cases en plus, soit O(n). Le tri fusion **n'est pas en place** : c'est son point faible.

**À retenir :** tri fusion = log₂ n niveaux × n valeurs par niveau = O(n log n) toujours, mais n cases de mémoire en plus.

## 5. Stabilité

Un tri est **stable** si deux valeurs **égales** gardent leur ordre de départ. Ça compte quand on trie des fiches selon un seul champ : par exemple trier des copies par note en gardant, pour une même note, l'ordre alphabétique obtenu avant.

Le tri fusion est stable **à une condition** : en cas d'égalité, prendre la valeur de la moitié **gauche** (celle qui était placée avant).

**Exemple résolu : fusion de fiches `(note, nom)`**, triées par note. Gauche : `(8, Léa) (13, Paul)` ; droite : `(8, Omar) (11, Zoé)`. Léa était placée avant Omar.

Avec `if (gauche.note <= droite.note)` :

| Tour | Première fiche à gauche | Première fiche à droite | Test | On prend |
|---|---|---|---|---|
| 1 | (8, Léa) | (8, Omar) | 8 <= 8 : vrai | **Léa** (gauche) |
| 2 | (13, Paul) | (8, Omar) | 13 <= 8 : faux | Omar |
| 3 | (13, Paul) | (11, Zoé) | 13 <= 11 : faux | Zoé |
| fin | (13, Paul) | vide | | Paul |

Avec `if (gauche.note < droite.note)` :

| Tour | Première fiche à gauche | Première fiche à droite | Test | On prend |
|---|---|---|---|---|
| 1 | (8, Léa) | (8, Omar) | 8 < 8 : faux | **Omar** (droite) |
| 2 | (8, Léa) | (11, Zoé) | 8 < 11 : vrai | Léa |
| 3 | (13, Paul) | (11, Zoé) | 13 < 11 : faux | Zoé |
| fin | (13, Paul) | vide | | Paul |

- Avec `<=` : Léa, Omar, Zoé, Paul. Les deux notes 8 sont dans l'ordre de départ : **stable**.
- Avec `<` : Omar, Léa, Zoé, Paul. Les notes sont bien triées, mais Omar est passé devant Léa : **pas stable**.

> [!warning] `<=` et pas `<`
> Avec `if (t[i] < t[j])`, en cas d'égalité, c'est la valeur de **droite** qui passe d'abord : le résultat reste trié, mais le tri n'est **plus stable**. L'erreur est invisible tant qu'on trie des nombres seuls.

**À retenir :** en cas d'égalité, la fusion prend à **gauche** (`<=`) : c'est ce qui rend le tri fusion stable.

## 6. Parallélisable

Les deux moitiés sont **indépendantes** : pendant qu'une personne (ou un cœur du processeur) trie la gauche, une autre peut trier la droite. Seule la fusion doit attendre que les deux aient fini. Le tri fusion se **parallélise** donc bien, contrairement au tri par sélection ou au tri à bulles, où chaque passage dépend du précédent.

**Exemple résolu : 8 cases, 2 cœurs.** Le cœur A trie `[0, 4)` pendant que le cœur B trie `[4, 8)` : chacun fait ses 2 niveaux de fusion (4 valeurs à chaque niveau) **en même temps**. Puis un seul cœur fait la dernière fusion (8 valeurs). Durée : 4 + 4 + 8 = 16 valeurs écrites à la suite, au lieu de 24 pour un seul cœur.

> [!warning] Une limite au parallélisme
> Plus on monte dans les fusions, moins il y a de travail à se partager : la toute dernière fusion parcourt les **n** valeurs et une seule personne peut la faire. Ajouter des cœurs accélère le début, mais pas cette dernière étape. D'autres tris se découpent encore mieux entre plusieurs travailleurs.

**À retenir :** les deux moitiés se trient en parallèle ; seule la fusion attend les deux résultats.

## 7. Compter les inversions pendant la fusion

Une **inversion** est une paire de cases `i < j` rangées dans le mauvais ordre : `t[i] > t[j]` (strictement : deux valeurs égales ne sont pas une inversion). Compter toutes les paires avec deux boucles imbriquées coûte O(n²) : pour 200 000 cases, cela fait environ 20 milliards de paires, beaucoup trop. La fusion permet de les compter en O(n log n).

**L'idée.** Pendant la fusion de `[debut, milieu)` et `[milieu, fin)`, les deux moitiés sont triées. Quand on prend une valeur **à droite** alors que la gauche n'est pas vide, cette valeur est plus petite que **toutes** les valeurs qui restent à gauche (la gauche est triée et sa plus petite valeur restante a perdu). Chacune forme une inversion avec elle : on ajoute `milieu - i` d'un coup.

**Exemple résolu : fusion de `2 5 8` et `1 6 7`.**

| Tour | Gauche restante | Droite | On prend | Inversions ajoutées |
|---|---|---|---|---|
| 1 | 2 5 8 | 1 | 1 (droite) | 3 (1 est doublé par 2, 5 et 8) |
| 2 | 2 5 8 | 6 | 2 (gauche) | 0 |
| 3 | 5 8 | 6 | 5 (gauche) | 0 |
| 4 | 8 | 6 | 6 (droite) | 1 (par 8) |
| 5 | 8 | 7 | 7 (droite) | 1 (par 8) |
| fin | 8 | vide | 8 | 0 |

Total : **5**. Vérification à la main : (2, 1), (5, 1), (8, 1), (8, 6), (8, 7). C'est bien 5.

Pour le tableau entier, on additionne trois nombres : les inversions **dans la gauche**, **dans la droite** (comptées par les appels récursifs) et celles **entre les deux** (comptées par la fusion). Sur `5 1 4 2 6 3` :

| Fusion (dans l'ordre des appels) | Inversions trouvées |
|---|---|
| `1` et `4` | 0 |
| `5` et `1 4` | 2 (5 double 1, puis 5 double 4) |
| `6` et `3` | 1 |
| `2` et `3 6` | 0 |
| `1 4 5` et `2 3 6` | 4 (2 est doublé par 4 et 5, 3 aussi) |

Total : 0 + 2 + 1 + 0 + 4 = **7**, soit (5, 1), (5, 4), (5, 2), (5, 3), (4, 2), (4, 3), (6, 3).

Trois détails comptent :

- en cas d'égalité, on prend à **gauche** (`<=`) : sinon une valeur de droite égale serait comptée comme une inversion ;
- le nombre peut dépasser la capacité d'un `int` (environ 2,1 milliards) : avec 200 000 valeurs à l'envers, il y a 200 000 × 199 999 / 2, près de 20 milliards d'inversions. On le range dans un `long long` ;
- le tri fusion modifie le tableau : pour compter sans toucher au tableau de départ, on trie une **copie** (réservée avec `malloc`, puis libérée avec `free`).

**À retenir :** inversions en O(n log n) = trier une copie par fusion ; chaque fois qu'on prend à droite, ajouter `milieu - i` (le nombre de valeurs restantes à gauche).

## À retenir

| | Tri fusion |
|---|---|
| Méthode | diviser pour régner : couper, trier chaque moitié, fusionner |
| Opération de base | fusion de deux tableaux triés, O(n) |
| Temps | O(n log n) dans tous les cas |
| Niveaux de découpage | log₂ n arrondi au-dessus |
| Mémoire en plus | O(n) (tableau auxiliaire) : pas en place |
| Stable | oui, si on prend la gauche en cas d'égalité (`<=`) |
| Parallélisable | oui, les deux moitiés sont indépendantes |
| Version sans récursivité | largeurs 1, 2, 4… en fusionnant les blocs voisins |
