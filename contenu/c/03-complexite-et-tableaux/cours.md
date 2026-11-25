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

**Exemple résolu : trouver la meilleure note d'une classe.**

| Partie | Ici |
|---|---|
| Problème | quelle est la meilleure note ? |
| Entrées | la liste des notes, par exemple `12 17 9 15` |
| Actions | retenir la première note, puis la comparer à chaque note suivante et garder la plus grande |
| Résultat | `17` |

On remarque que la méthode ne parle pas de C : elle marcherait à la main, en Python ou en Rust.

**À retenir :** avant d'écrire du code, écris le problème, les entrées, les actions et le résultat attendu.

## 2. La complexité : mesurer le coût d'un algorithme

Pour un même problème, il existe souvent **plusieurs algorithmes**, plus ou moins rapides. Pour chercher « moto » :

- **Méthode A** : lire les mots un par un depuis le début. Ça marche, mais c'est long.
- **Méthode B** : ouvrir au milieu, regarder si « moto » est avant ou après, garder la bonne moitié, recommencer. Une dizaine de pages suffisent.

Chronométrer ne serait pas juste : on mesurerait aussi la vitesse de lecture de la personne (ou, pour un programme, la vitesse de l'ordinateur, les autres programmes ouverts...). On **compte** plutôt les **opérations élémentaires** (lire un mot, comparer deux valeurs, écrire une case), et on regarde comment ce nombre **grandit quand la taille des données `n` grandit**. Ce nombre ne dépend que de l'algorithme : il est le même sur un vieux portable et sur un serveur.

> [!info] La complexité
> La **complexité** d'un algorithme, c'est l'évolution de son nombre d'opérations en fonction de la taille `n` des données. On la note avec la **notation grand O** : on garde seulement le terme qui grandit le plus vite, sans les constantes.

Exemple : un algorithme fait `3n + 5` opérations. Quand `n` devient grand, le `+ 5` ne compte plus, et le facteur `3` ne change pas l'allure de la courbe : on dit qu'il est en **O(n)**.

**Exemple résolu : un algorithme fait `2n² + 7n + 3` opérations. Quelle est sa complexité ?**

1. On repère les termes : `2n²` (grandit comme n²), `7n` (grandit comme n), `3` (ne grandit pas).
2. On regarde leur poids pour un grand `n`, par exemple `n = 1 000` :

| Terme | Valeur pour n = 1 000 | Part du total |
|---|---|---|
| `2n²` | 2 000 000 | presque tout |
| `7n` | 7 000 | environ 0,3 % |
| `3` | 3 | rien |

3. On garde le terme le plus gros : `2n²`.
4. On enlève la constante `2` : il reste `n²`. La complexité est **O(n²)**.

Les pièges : écrire O(2n² + 7n + 3) (on n'écrit jamais les petits termes ni les constantes), ou garder `7n` parce que 7 est plus grand que 2 (c'est la **puissance de n** qui compte, pas le nombre devant).

**À retenir :** pour un grand O, garde le terme avec la plus grande puissance de `n` et efface le nombre devant.

### Les complexités à connaître

| Notation | Nom | Exemple | n = 1 000 | n = 1 000 000 |
|---|---|---|---|---|
| O(1) | constante | lire `t[i]`, prendre le premier mot | 1 | 1 |
| O(log n) | logarithmique | recherche dichotomique (on coupe en deux) | ~10 | ~20 |
| O(n) | linéaire | parcourir un tableau | 1 000 | 1 000 000 |
| O(n log n) | quasi linéaire | les bons tris (chapitres suivants) | ~10 000 | ~20 000 000 |
| O(n²) | quadratique | deux boucles imbriquées, les tris simples | 1 000 000 | 10¹² |
| O(2ⁿ) | exponentielle | essayer toutes les combinaisons | énorme | impossible |

Du plus rapide au plus lent, pour de grandes données : **O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)**.

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

**Exemple résolu : compter les tours de quatre morceaux de code.**

```text
Morceau A :  x = tab[0] + tab[n - 1]

Morceau B :  Pour i allant de 0 à n - 1 :
                 somme = somme + tab[i]

Morceau C :  Pour i allant de 0 à n - 1 :
                 Pour j allant de 0 à n - 1 :
                     compteur = compteur + 1

Morceau D :  Pour i allant de 0 à n - 1 :
                 Pour j allant de i + 1 à n - 1 :
                     comparer tab[i] et tab[j]
```

| Morceau | n = 4 | n = 1 000 | Formule | Complexité |
|---|---|---|---|---|
| A | 1 addition | 1 addition | 1 | O(1) |
| B | 4 additions | 1 000 | n | O(n) |
| C | 4 × 4 = 16 | 1 000 000 | n × n | O(n²) |
| D | 3 + 2 + 1 + 0 = 6 | 499 500 | n(n - 1) / 2 | O(n²) |

Pour D, la boucle intérieure fait de moins en moins de tours : 3 quand `i = 0`, 2 quand `i = 1`, 1 quand `i = 2`, 0 quand `i = 3`. Le total `n(n - 1) / 2 = 0,5 n² - 0,5 n` a pour plus gros terme `0,5 n²` : c'est **toujours O(n²)**. Faire « moitié moins » de tours ne change pas la famille.

Et le morceau A suivi du morceau B ? `1 + n` opérations : on garde le plus gros, O(n).

**À retenir :** compte combien de fois la ligne la plus intérieure est exécutée, écris-le en fonction de `n`, puis garde le plus gros terme.

### Diviser par deux : le logarithme

**log₂(n)** répond à la question : « combien de fois faut-il diviser `n` par 2 pour arriver à 1 ? ». C'est aussi l'exposant `x` tel que `2ˣ = n`.

| Puissance de 2 | Valeur |
|---|---|
| 2¹⁰ | 1 024 (environ mille) |
| 2²⁰ | 1 048 576 (environ un million) |
| 2³⁰ | environ un milliard |

**Exemple résolu : combien de divisions entières par 2 pour passer de 100 à 1 ?**

En C, `/` entre deux entiers est une **division entière** : on garde la partie entière, sans virgule (`25 / 2` vaut `12`).

| Tour | Avant | Calcul | Après |
|---|---|---|---|
| 1 | 100 | 100 / 2 | 50 |
| 2 | 50 | 50 / 2 | 25 |
| 3 | 25 | 25 / 2 | 12 |
| 4 | 12 | 12 / 2 | 6 |
| 5 | 6 | 6 / 2 | 3 |
| 6 | 3 | 3 / 2 | 1 |

On est à 1 après **6** divisions. Vérification : 2⁶ = 64 et 2⁷ = 128, donc 100 est entre les deux et log₂(100) ≈ 6,6 ; la division entière donne la partie entière, 6. Si on part de 1, il n'y a **aucune** division à faire : 0.

C'est pour ça qu'un algorithme qui coupe en deux est si rapide : un million de données, environ 20 tours seulement.

**À retenir :** « je divise par deux à chaque tour » = environ log₂(n) tours = O(log n). Pense à 2¹⁰ ≈ mille et 2²⁰ ≈ un million.

### Pire cas, cas moyen, meilleur cas

Pour une même taille `n`, le nombre d'opérations dépend souvent de **la façon dont les données sont rangées**. Chercher une valeur dans un tableau : si elle est dans la première case, une seule comparaison (meilleur cas) ; si elle n'y est pas, `n` comparaisons (pire cas). Sauf indication contraire, la complexité annoncée est celle du **pire cas**.

**Exemple résolu : on cherche une valeur dans `4 7 1 9 2` (n = 5) en lisant les cases une par une.**

| Valeur cherchée | Cases lues | Comparaisons | Cas |
|---|---|---|---|
| 4 | `4` (trouvé) | 1 | meilleur cas |
| 9 | `4 7 1 9` (trouvé) | 4 | |
| 8 | `4 7 1 9 2` (rien) | 5 = n | pire cas |

Quand la valeur est absente, on est **obligé** de lire toutes les cases : une case pas lue pourrait être la bonne. Le pire cas fait `n` comparaisons : la recherche dans un tableau non trié est en **O(n)**. Même chose pour le maximum (ou le minimum) d'un tableau non trié : il peut être n'importe où, il faut tout regarder, O(n).

**À retenir :** sauf mention contraire, une complexité se donne dans le pire cas (souvent : la valeur absente, ou à la toute fin).

> [!info] Temps et mémoire
> On parle de complexité **temporelle** (nombre d'opérations) et de complexité **spatiale** (mémoire utilisée en plus des données). Souvent, gagner du temps coûte de la mémoire, et inversement. Un algorithme **en place** n'utilise que O(1) mémoire en plus.

Exemple : pour inverser un tableau de `n` cases, on peut recopier les valeurs à l'envers dans un **second tableau** de `n` cases (O(n) de mémoire en plus), ou échanger les cases deux par deux dans le tableau lui-même avec une seule variable temporaire (O(1) de mémoire en plus : c'est **en place**). Les deux sont en O(n) de temps.

> [!info] Complexité amortie
> Ajouter à la fin d'un tableau qui double sa capacité quand il est plein coûte O(1) presque toujours, et O(n) de temps en temps (quand il faut tout recopier). Comme le cas coûteux arrive de plus en plus rarement, on dit que l'ajout est en **O(1) amorti**.

**Exemple résolu : 8 ajouts dans un tableau qui commence avec 1 case et double quand il est plein.**

| Ajout n° | Plein avant ? | Recopies | Capacité après | Écriture |
|---|---|---|---|---|
| 1 | non | 0 | 1 | 1 |
| 2 | oui (1/1) | 1 | 2 | 1 |
| 3 | oui (2/2) | 2 | 4 | 1 |
| 4 | non | 0 | 4 | 1 |
| 5 | oui (4/4) | 4 | 8 | 1 |
| 6, 7, 8 | non | 0 | 8 | 3 |

Total : 1 + 2 + 4 = **7 recopies** et **8 écritures**, soit 15 opérations pour 8 ajouts : moins de 2 par ajout en moyenne. Les ajouts coûteux (2, 3, 5, puis 9, 17...) sont de plus en plus espacés.

**À retenir :** « amorti » = on fait la moyenne du coût sur une longue suite d'opérations ; un cas cher de temps en temps ne change pas le O(1).

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

**Exemple résolu : où est `tab[3]` ?** Un `int` prend 4 octets. Si `tab[0]` est à l'adresse 1000 :

| Case | Calcul | Adresse |
|---|---|---|
| `tab[0]` | 1000 + 0 × 4 | 1000 |
| `tab[1]` | 1000 + 1 × 4 | 1004 |
| `tab[3]` | 1000 + 3 × 4 | 1012 |
| `tab[999]` | 1000 + 999 × 4 | 4996 |

Pour `tab[999]` comme pour `tab[1]` : une multiplication et une addition, rien à parcourir. Le tableau n'a pas besoin d'être trié pour ça.

**À retenir :** accès à une case = un calcul d'adresse = O(1), quelle que soit la case.

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

**Exemple résolu : ce que voit `sizeof`, dans `main` et dans la fonction.**

```c
#include <stdio.h>

void taille_vue_par_la_fonction(const int *tab) {
    printf("dans la fonction : sizeof tab = %zu octets (un pointeur)\n", sizeof tab);
    printf("premiere case : %d\n", tab[0]);
}

int main(void) {
    int notes[] = {12, 15, 9, 18};
    printf("dans main : sizeof notes = %zu octets\n", sizeof notes);
    printf("dans main : sizeof notes[0] = %zu octets\n", sizeof notes[0]);
    printf("dans main : nombre de cases = %zu\n", sizeof notes / sizeof notes[0]);
    taille_vue_par_la_fonction(notes);
    return 0;
}
```

1. Dans `main`, `notes` est un vrai tableau de 4 `int` : `sizeof notes` vaut 4 × 4 = **16** octets, `sizeof notes[0]` vaut **4**, et 16 / 4 = **4** cases.
2. Dans la fonction, `tab` n'est qu'une adresse : `sizeof tab` vaut **8** sur une machine 64 bits, quelle que soit la longueur du tableau. Diviser 8 par 4 donnerait « 2 cases », ce qui est faux.

(`%zu` est le format de `printf` pour un `size_t`.)

**À retenir :** une fonction qui reçoit un tableau reçoit une adresse ; la taille doit arriver par un paramètre `size_t n`.

> [!warning] `size_t` ne descend pas sous zéro
> `size_t` est **non signé** : `0 - 1` donne le plus grand nombre possible (environ 1,8 × 10¹⁹), pas `-1`. Une boucle `for (size_t i = n - 1; i >= 0; i--)` ne s'arrête **jamais** (`i >= 0` est toujours vrai), et `n - 1` avec `n == 0` est un piège. On écrit plutôt `for (size_t i = n; i > 0; i--)` et on utilise `tab[i - 1]`.

**Exemple résolu : la soustraction qui « fait le tour », et une boucle qui descend sans piège.**

```c
#include <stdio.h>

int main(void) {
    size_t zero = 0;
    printf("0 - 1 en size_t = %zu\n", zero - 1);

    int tab[] = {10, 20, 30, 40};
    size_t n = 4;
    for (size_t i = n; i > 0; i--) {
        printf("%d ", tab[i - 1]);
    }
    printf("\n");
    return 0;
}
```

La première ligne affiche `18446744073709551615` : c'est le plus grand `size_t`. Pour la boucle, voici les tours :

| `i` | `i > 0` ? | Case lue `tab[i - 1]` |
|---|---|---|
| 4 | oui | `tab[3]` = 40 |
| 3 | oui | `tab[2]` = 30 |
| 2 | oui | `tab[1]` = 20 |
| 1 | oui | `tab[0]` = 10 |
| 0 | **non** : on s'arrête | |

`i` ne descend jamais sous 0 : la boucle s'arrête proprement. Avec `n = 0`, la condition est fausse tout de suite et rien n'est lu.

Pour éviter le piège, on **réécrit les conditions sans soustraction** :

| Avec une soustraction (dangereux si la valeur peut valoir 0) | Sans soustraction |
|---|---|
| `i < n - 1` | `i + 1 < n` |
| `i > p - 1` | `i >= p` |
| `i >= 0` (toujours vrai en `size_t`) | partir de `n` et tester `i > 0` |

**À retenir :** avec un `size_t`, chaque `- 1` dans une condition est suspect : demande-toi ce qu'il donne quand la variable vaut 0.

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

**Exemple résolu : moyenne de `4 7 6`.**

| `i` | `tab[i]` | `somme` après |
|---|---|---|
| 0 | 4 | 4 |
| 1 | 7 | 11 |
| 2 | 6 | 17 |

Moyenne = 17 / 3 = 5,666... Trois cases, trois additions : O(n). Mais en C, deux pièges attendent ce calcul (voir juste après).

**À retenir :** parcours = une boucle de `0` à `n - 1`, une opération par case, O(n). Somme, maximum, minimum, recherche d'une valeur sont tous des parcours.

> [!warning] Les bornes
> Les indices vont de `0` à `n - 1` **compris**. `i <= n` lit une case après la fin : en C, aucune erreur n'est signalée, le programme lit n'importe quoi ou plante plus loin.

#### Division entière et dépassement : les deux pièges de la moyenne

1. **`int / int` est une division entière.** `17 / 3` vaut `5` en C, et `7 / 2` vaut `3`. Pour avoir les décimales, il faut qu'au moins un des deux nombres soit un `double` **avant** la division : `(double)17 / 3` vaut 5,666... Écrire `(double)(17 / 3)` ne sert à rien : la division entière est déjà faite, on convertit `5` en `5.0`.
2. **Un `int` a une limite** : environ 2,1 milliards (`INT_MAX` = 2 147 483 647). Additionner deux valeurs de 1,5 milliard dans un `int` dépasse cette limite et donne n'importe quoi. Une somme se range dans un type plus grand : `long long` (jusqu'à environ 9,2 × 10¹⁸).

```c
#include <limits.h>
#include <stdio.h>

int main(void) {
    int a = 7;
    int b = 2;
    printf("a / b           = %d\n", a / b);
    printf("(double)(a / b) = %.1f\n", (double)(a / b));
    printf("(double)a / b   = %.1f\n", (double)a / b);

    printf("plus grand int  = %d\n", INT_MAX);
    int grand = 1500000000;
    long long somme = 0;
    somme += grand;
    somme += grand;
    printf("somme (long long) = %lld\n", somme);
    printf("moyenne           = %.1f\n", (double)somme / 2);
    return 0;
}
```

| Ligne | Ce qui se passe | Résultat |
|---|---|---|
| `a / b` | deux `int` : division entière | 3 |
| `(double)(a / b)` | division entière d'abord, conversion ensuite | 3.0 |
| `(double)a / b` | `a` devient 7.0 avant la division | 3.5 |
| `somme` en `long long` | 3 000 000 000 tient dans un `long long` | 3000000000 |

Et si le tableau est vide (`n == 0`) ? Diviser par 0 n'a pas de sens : on traite ce cas **avant** la division et on décide d'une réponse (par exemple 0.0).

**À retenir :** moyenne en C = somme dans un `long long`, conversion en `double` **avant** la division, et cas `n == 0` traité à part.

#### Afficher avec un séparateur entre les valeurs

`printf("%d ", tab[i])` laisse un espace **après** la dernière valeur. Pour un séparateur seulement **entre** deux valeurs, on l'écrit **avant** chaque valeur sauf la première (`i > 0`).

**Exemple résolu : afficher `3 - 8 - 1`.**

```c
#include <stdio.h>

void afficher_tirets(const int *tab, size_t n) {
    for (size_t i = 0; i < n; i++) {
        if (i > 0) {
            printf(" - ");
        }
        printf("%d", tab[i]);
    }
    printf("\n");
}

int main(void) {
    int trois[] = {3, 8, 1};
    int un[] = {42};
    afficher_tirets(trois, 3);
    afficher_tirets(un, 1);
    afficher_tirets(NULL, 0);
    printf("fin\n");
    return 0;
}
```

| `i` | `i > 0` ? | Écrit | Écran |
|---|---|---|---|
| 0 | non | `3` | `3` |
| 1 | oui | ` - 8` | `3 - 8` |
| 2 | oui | ` - 1` | `3 - 8 - 1` |
| après la boucle | | retour à la ligne | |

- Une seule valeur (`42`) : un seul tour, avec `i = 0`, donc aucun tiret.
- Tableau vide (`NULL`, `n = 0`) : `0 < 0` est faux, la boucle ne fait aucun tour et ne lit **aucune** case (lire `NULL[0]` ferait planter). Seul le retour à la ligne s'affiche.
- Ce qui doit s'afficher même pour un tableau vide (un retour à la ligne, des crochets...) se place **hors** de la boucle : avant ou après.

**À retenir :** séparateur **avant** chaque valeur sauf la première ; les décorations de début et de fin hors de la boucle.

## 4. Insérer et supprimer : décaler les cases

La force du tableau (cases collées) est aussi sa faiblesse : pour **insérer** ou **supprimer** au milieu, il faut **décaler** toutes les cases qui suivent.

### Capacité et taille

Un tableau C a un nombre de cases fixé à sa création : c'est sa **capacité**. On n'en utilise souvent qu'une partie, **au début** : c'est la **taille** `n`. Les cases après la taille existent mais ne comptent pas.

```text
int tab[8] = {5, 16, 2};    capacité 8, taille n = 3

indice :  0   1   2   3   4   5   6   7
tab    :  5  16   2   .   .   .   .   .
          <-- utilisées --> <--- libres --->
```

- Insérer n'est possible que s'il reste une case libre : `n < capacite`.
- Une position d'insertion va de `0` (devant la première) à `n` (juste après la dernière). `p > n` laisserait un trou.
- Une position de suppression va de `0` à `n - 1` : il faut une case **existante**.

Une fonction qui change la taille doit la recevoir **par adresse** (`size_t *n`). Si elle recevait `size_t n`, elle travaillerait sur une **copie** : elle augmenterait sa copie, et l'appelant croirait que la taille n'a pas bougé. Avec l'adresse, `(*n)++` modifie la variable de l'appelant. Attention aux parenthèses : `*n--` ferait reculer l'**adresse** au lieu de diminuer la taille ; on écrit `(*n)--`.

Ces fonctions renvoient souvent `1` (« c'est fait ») ou `0` (« impossible, je n'ai rien touché ») : l'appelant sait ainsi si l'opération a eu lieu.

**À retenir :** taille ≤ capacité ; la taille se passe par adresse quand la fonction la change, et on vérifie la position avant de toucher au tableau.

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

Le même déroulé, tour par tour (`n = 6`, `p = 2`) :

| `i` | `i > p` ? | Copie | Tableau après |
|---|---|---|---|
| 6 | oui | `tab[6] = tab[5]` (4) | `5 16 2 3 6 4 4` |
| 5 | oui | `tab[5] = tab[4]` (6) | `5 16 2 3 6 6 4` |
| 4 | oui | `tab[4] = tab[3]` (3) | `5 16 2 3 3 6 4` |
| 3 | oui | `tab[3] = tab[2]` (2) | `5 16 2 2 3 6 4` |
| 2 | **non** : fin de la boucle | `tab[2] = 8` | `5 16 8 2 3 6 4` |

4 copies, c'est-à-dire `n - p`. Insérer devant (`p = 0`) décale les `n` cases ; insérer à la fin (`p = n`) n'en décale aucune.

Et dans le mauvais sens (de gauche à droite) ? Voici ce qu'on obtiendrait :

| Copie | Tableau après |
|---|---|
| `tab[3] = tab[2]` | `5 16 2 2 6 4 _` |
| `tab[4] = tab[3]` | `5 16 2 2 2 4 _` |
| `tab[5] = tab[4]` | `5 16 2 2 2 2 _` |
| `tab[6] = tab[5]` | `5 16 2 2 2 2 2` |
| `tab[2] = 8` | `5 16 8 2 2 2 2` |

Le 2 a été recopié partout : 3, 6 et 4 sont perdus.

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

**Exemple résolu : pourquoi ne pas écrire la condition avec `p - 1` ?** Avec `p = 0` en `size_t`, `p - 1` ne vaut pas -1 mais le plus grand `size_t` (18446744073709551615). Une condition comme `i > p - 1` devient « `i` est plus grand que le plus grand nombre possible » : elle est **fausse dès le premier tour**. La boucle ne décale rien, et la valeur insérée **écrase** la case 0 au lieu de se glisser devant. Pour `p = 1, 2...` la même condition marche : le bug ne se voit **que** pour la position 0. La condition `i > p` n'a pas de soustraction : aucun risque.

**À retenir :** insertion = vérifier (place libre et `p <= n`), décaler de la fin vers `p`, écrire, augmenter la taille. Coût : `n - p` copies, O(n) dans le pire cas.

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

**Exemple résolu : supprimer la position 1 dans `7 3 9 4 6` (n = 5).**

| `i` | `i + 1 < n` ? | Copie | Tableau après |
|---|---|---|---|
| 1 | 2 < 5 oui | `tab[1] = tab[2]` (9) | `7 9 9 4 6` |
| 2 | 3 < 5 oui | `tab[2] = tab[3]` (4) | `7 9 4 4 6` |
| 3 | 4 < 5 oui | `tab[3] = tab[4]` (6) | `7 9 4 6 6` |
| 4 | 5 < 5 **non** : fin | | |

Puis la taille passe de 5 à 4 : le tableau utile est `7 9 4 6`. Le dernier `6` est encore en mémoire dans la case 4, mais elle est après la taille : elle ne compte plus. Le 3 a bien disparu, et l'ordre des autres valeurs est gardé. Copies : `n - 1 - p` = 3.

Avant de décaler, on vérifie que `p` est une vraie case : `p < n`. Avec `n = 5`, les positions 0 à 4 sont valides ; `p = 5` ou plus ne désigne rien, on renvoie 0 sans rien toucher. Un tableau vide (`n = 0`) n'a aucune case à supprimer.

**À retenir :** suppression = vérifier `p < n`, décaler de `p` vers la fin (chaque case prend sa voisine de droite), diminuer la taille. O(n) dans le pire cas.

| Opération | Au début | Au milieu | À la fin |
|---|---|---|---|
| Accès | O(1) | O(1) | O(1) |
| Insertion | O(n) | O(n) | O(1) s'il reste de la place, sinon O(n) (tout recopier ailleurs) |
| Suppression | O(n) | O(n) | O(1) |

Ajouter à la fin quand on connaît la taille et qu'il reste de la place : `tab[n] = v;` puis `n++`. Rien à décaler, O(1).

### Retirer toutes les cases d'une certaine sorte, en une passe

Appeler `supprimer` à chaque case à enlever coûte cher : chaque suppression décale tout le reste. On fait mieux avec **deux indices** dans le même tableau :

- `lecture` passe sur **toutes** les cases, une par une ;
- `ecriture` indique où ranger la **prochaine valeur gardée**.

Chaque valeur gardée est recopiée en `tab[ecriture]`, puis `ecriture` avance. À la fin, `ecriture` est la nouvelle taille. Comme `ecriture` n'avance que quand `lecture` avance, il n'est **jamais en avance** sur `lecture` : on n'écrase jamais une case pas encore lue.

**Exemple résolu : retirer les nombres négatifs de `4 -1 -7 3 -2 8`.**

| `lecture` | Valeur lue | Gardée ? | Action | `ecriture` après | Tableau |
|---|---|---|---|---|---|
| 0 | 4 | oui | `tab[0] = 4` | 1 | `4 -1 -7 3 -2 8` |
| 1 | -1 | non | rien | 1 | `4 -1 -7 3 -2 8` |
| 2 | -7 | non | rien | 1 | `4 -1 -7 3 -2 8` |
| 3 | 3 | oui | `tab[1] = 3` | 2 | `4 3 -7 3 -2 8` |
| 4 | -2 | non | rien | 2 | `4 3 -7 3 -2 8` |
| 5 | 8 | oui | `tab[2] = 8` | 3 | `4 3 8 3 -2 8` |

Nouvelle taille : 3, le début du tableau est `4 3 8` (ordre gardé). Ce qu'il y a après la case 2 n'a plus d'importance. Chaque case est lue **une** fois et écrite **au plus une** fois : 6 lectures, 3 écritures, **O(n)**.

```c
#include <stdio.h>

size_t retirer_negatifs(int *tab, size_t n) {
    size_t ecriture = 0;
    for (size_t lecture = 0; lecture < n; lecture++) {
        if (tab[lecture] >= 0) {
            tab[ecriture] = tab[lecture];
            ecriture++;
        }
    }
    return ecriture;
}

int main(void) {
    int tab[] = {4, -1, -7, 3, -2, 8};
    size_t n = retirer_negatifs(tab, 6);
    for (size_t i = 0; i < n; i++) {
        printf("%d ", tab[i]);
    }
    printf("(taille %zu)\n", n);
    return 0;
}
```

Avec des suppressions une par une, sur ce même exemple : supprimer -1 (4 copies), puis -7 (3 copies), puis -2 (1 copie), soit 8 copies au lieu de 3 écritures. Sur 400 000 cases dont la moitié à retirer, cela fait environ 200 000 suppressions qui décalent chacune jusqu'à 200 000 cases : des dizaines de milliards de copies, O(n²). Autre piège de cette méthode : après une suppression, la case suivante a glissé à la position courante ; si on avance l'indice quand même, on la saute.

**À retenir :** pour filtrer un tableau sur place, un indice de lecture qui voit tout et un indice d'écriture qui range ce qu'on garde : une passe, O(n).

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

**Exemple résolu : inverser `1 2 3 4 5 6` (n = 6, donc `n / 2` = 3 tours).**

| `i` | `i < 3` ? | Case symétrique `n - 1 - i` | Échange | Tableau après |
|---|---|---|---|---|
| 0 | oui | 5 | 1 ↔ 6 | `6 2 3 4 5 1` |
| 1 | oui | 4 | 2 ↔ 5 | `6 5 3 4 2 1` |
| 2 | oui | 3 | 3 ↔ 4 | `6 5 4 3 2 1` |
| 3 | **non** : fin | | | |

Les pièges :

- Aller jusqu'à `i < n` : les tours 3, 4, 5 refont les échanges 4 ↔ 3, 5 ↔ 2, 6 ↔ 1 et le tableau redevient `1 2 3 4 5 6`.
- Prendre `n - i` comme case symétrique : au tour `i = 0`, on lit `tab[6]`, qui est **après** la fin (les cases vont de 0 à 5).

**À retenir :** la case symétrique de `i` est `n - 1 - i`, et on s'arrête au milieu (`i < n / 2`).

### Inverser une portion : borne de fin « non comprise »

On veut souvent inverser seulement une **portion** : les cases de `debut` (compris) à `fin` (**non compris**), notée `[debut, fin[`. C'est la même convention que `for (i = 0; i < n; i++)` : la borne de droite est la première case **hors** de la portion.

| Portion | Cases concernées | Nombre de cases |
|---|---|---|
| `[1, 4[` | 1, 2, 3 | 4 - 1 = 3 |
| `[2, 2[` | aucune (portion vide) | 0 |
| `[0, n[` | tout le tableau | n |

Avantages : le nombre de cases est simplement `fin - debut`, une portion vide s'écrit `debut == fin`, et le tableau entier est `[0, n[`.

Méthode avec deux indices : `gauche` part de `debut`, `droite` part de la **dernière case de la portion**, `fin - 1`. On échange les deux cases, puis on les rapproche (`gauche` avance, `droite` recule). On continue tant qu'il reste **au moins deux cases** entre eux.

**Exemple résolu : inverser la portion `[2, 6[` de `10 20 30 40 50 60 70`** (cases 2 à 5 : `30 40 50 60`).

| Tour | `gauche` | `droite` | Au moins 2 cases ? | Échange | Tableau après |
|---|---|---|---|---|---|
| 1 | 2 | 5 | oui | 30 ↔ 60 | `10 20 60 40 50 30 70` |
| 2 | 3 | 4 | oui | 40 ↔ 50 | `10 20 60 50 40 30 70` |
| 3 | 4 | 3 | **non** (ils se sont croisés) | | |

Les cases 0, 1 et 6 n'ont pas bougé. Avec une portion de longueur impaire, par exemple `[1, 4[` (`20 30 40`) : un échange 20 ↔ 40, puis `gauche` et `droite` valent tous les deux 2 : il ne reste qu'une case, elle est déjà à sa place, on s'arrête.

> [!warning] La portion vide et le `size_t`
> Avec `debut == fin == 0`, la « dernière case » `fin - 1` vaudrait le plus grand `size_t`. Pour tester « il reste au moins deux cases », on compare sans soustraire : `fin - debut >= 2` s'écrit `debut + 1 < fin`. Avec une portion vide ou d'une case, cette condition est fausse tout de suite et rien ne bouge.

**À retenir :** une portion `[debut, fin[` contient `fin - debut` cases ; pour l'inverser, échange les deux bouts et rapproche-les tant qu'il reste au moins deux cases.

### Faire tourner un tableau : trois inversions

Faire tourner un tableau de `k` crans **vers la gauche**, c'est envoyer les `k` premières valeurs à la fin, dans le même ordre : `10 20 30 40 50 60 70` tourné de 3 crans donne `40 50 60 70 10 20 30`.

**Méthode lente** : décaler tout le tableau d'un cran (la première valeur part au bout), et recommencer `k` fois. Chaque cran coûte `n` copies : O(n × k), et jusqu'à O(n²) quand `k` est proche de `n`.

**Méthode rapide, en place** : couper le tableau en deux blocs, les `k` premières cases (A) et le reste (B). On veut passer de `A B` à `B A`.

1. Inverser le bloc A seul : portion `[0, k[`.
2. Inverser le bloc B seul : portion `[k, n[`.
3. Inverser tout le tableau : portion `[0, n[`.

**Exemple résolu : `10 20 30 40 50 60 70`, `n = 7`, `k = 3`.**

| Étape | Portion inversée | Échanges | Tableau après |
|---|---|---|---|
| départ | | | `10 20 30 \| 40 50 60 70` |
| 1 | `[0, 3[` | 1 (10 ↔ 30) | `30 20 10 \| 40 50 60 70` |
| 2 | `[3, 7[` | 2 (40 ↔ 70, 50 ↔ 60) | `30 20 10 \| 70 60 50 40` |
| 3 | `[0, 7[` | 3 | `40 50 60 70 10 20 30` |

Pourquoi ça marche : l'inversion du tout (étape 3) fait bien passer le bloc B devant le bloc A, mais elle **retourne** aussi chaque bloc. Comme on les avait déjà retournés (étapes 1 et 2), ils retrouvent leur ordre : retourner deux fois, c'est ne rien changer.

Coût : 6 échanges ici, environ `n` échanges en général (`k / 2 + (n - k) / 2 + n / 2`) : **O(n)** en temps, **O(1)** en mémoire.

Deux détails avant de commencer :

- **Tourner de `n` crans ne change rien** : `k` et `k % n` (le reste de la division de `k` par `n`) donnent le même résultat. Avec `n = 7` : `k = 7` donne `7 % 7 = 0` (rien à faire), `k = 10` donne `10 % 7 = 3`.
- **Le tableau vide** : `k % 0` est une division par zéro, le programme plante. On traite `n == 0` (rien à faire) avant le `%`.

**À retenir :** rotation à gauche de `k` crans = `k %= n`, puis inverser `[0, k[`, inverser `[k, n[`, inverser `[0, n[`.

## 6. Pièges

> [!warning] La taille oubliée
> Une fonction qui reçoit `int *tab` ne peut pas deviner la taille. Toujours passer `n`, et ne jamais compter sur `sizeof tab` dans la fonction.

> [!warning] Un séparateur de trop
> `printf("%d ", tab[i])` laisse un espace après la dernière valeur. Pour un affichage propre (`1, 2, 3`), on écrit le séparateur **avant** chaque valeur sauf la première.

> [!warning] Une boucle dans une boucle sans le voir
> Supprimer toutes les occurrences d'une valeur en appelant `supprimer` à chaque fois coûte O(n²) : chaque suppression décale tout le reste. Une seule passe avec deux indices (lecture et écriture) suffit, en O(n).

> [!warning] Les calculs entiers
> `int / int` coupe les décimales, et une somme de grands `int` dépasse 2,1 milliards. Convertis en `double` avant de diviser et additionne dans un `long long`.

## À retenir

- Algorithme = problème + entrées + actions + résultat. Plusieurs algorithmes possibles, on les compare par leur **complexité**.
- Grand O : on garde le terme qui grandit le plus vite, sans constante. O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ).
- Diviser par deux à chaque tour : environ log₂(n) tours (20 pour un million).
- Sauf mention contraire, on donne la complexité du **pire cas**.
- Tableau : cases collées, indices de `0` à `n - 1`, accès en O(1). En C, la taille se passe **toujours** à côté (`size_t n`), et par adresse (`size_t *n`) si la fonction la change.
- Insérer : décaler **depuis la fin**. Supprimer : décaler **depuis la position**. Les deux en O(n).
- Filtrer : deux indices (lecture, écriture), une passe, O(n).
- Inverser : échanger `tab[i]` et `tab[n - 1 - i]` pour `i < n / 2`. Rotation : trois inversions.
- `size_t` est non signé : attention à `n - 1` et aux boucles qui descendent.
