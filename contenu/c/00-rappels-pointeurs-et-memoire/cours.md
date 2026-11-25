# Rappels : pointeurs et mémoire

Les listes chaînées reposent sur trois outils du C : les **pointeurs**, les **structures** (`struct`) et la **mémoire dynamique** (`malloc` / `free`). Ce chapitre les remet à plat avant de s'en servir.

## 1. Adresses et pointeurs

La mémoire de l'ordinateur est une immense rangée de cases numérotées. Chaque variable est rangée dans une de ces cases, et le numéro de la case s'appelle son **adresse**. Un **pointeur** est une variable qui contient une adresse : il « montre du doigt » une autre variable.

```c
int n = 42;
int *p = &n;
*p = 50;
```

| Écriture | Sens |
|---|---|
| `int *p` | `p` est un pointeur vers un `int` (il contient une adresse) |
| `&n` | l'adresse de la variable `n` |
| `*p` | la variable qui se trouve à l'adresse contenue dans `p` (ici `n`) |

Après `*p = 50;`, c'est bien `n` qui vaut 50 : on a écrit **à travers** le pointeur.

```text
   n                     p
+------+              +---------+
|  50  |  <---------- | adr. n  |
+------+              +---------+
```

> [!info] `int *p` ou `int* p` ?
> C'est la même chose. On voit les deux écritures (la fiche du cours écrit `Cell* start`, ce site écrit `Cell *start`).

> [!warning] Deux sens pour l'étoile
> Dans une **déclaration** (`int *p`), l'étoile dit « p est un pointeur ». Dans une **instruction** (`*p = 50`), elle veut dire « va à l'adresse contenue dans p ».

**Exemple résolu : que valent `a`, `b` et `*p` à la fin ?**

```c
#include <stdio.h>

int main(void) {
    int a = 10;
    int b = 20;
    int *p = &a;
    *p = *p + 5;
    p = &b;
    *p = 0;
    printf("a = %d, b = %d, *p = %d\n", a, b, *p);
    return 0;
}
```

On suit l'état de la mémoire ligne par ligne. « adr. a » veut dire « l'adresse de `a` » (le vrai numéro change à chaque lancement, il ne compte pas).

| Ligne | `a` | `b` | `p` | Ce qui se passe |
|---|---|---|---|---|
| `int a = 10;` | 10 | ? | ? | `a` est créée |
| `int b = 20;` | 10 | 20 | ? | `b` est créée |
| `int *p = &a;` | 10 | 20 | adr. a | `p` montre `a` |
| `*p = *p + 5;` | **15** | 20 | adr. a | `*p` désigne `a` : on lit 10, on écrit 15 **dans `a`** |
| `p = &b;` | 15 | 20 | **adr. b** | sans étoile : on change le pointeur lui-même, il montre maintenant `b` |
| `*p = 0;` | 15 | **0** | adr. b | `*p` désigne maintenant `b` |

Le programme affiche `a = 15, b = 0, *p = 0`.

Les deux pièges : `p = ...` (sans étoile) change **où** montre le pointeur, `*p = ...` (avec étoile) change **la variable montrée**. Et `p` ne contient jamais 15 ni 0 : il contient toujours une adresse.

**À retenir :** pour savoir ce que fait une ligne, demande-toi s'il y a une étoile devant `p` : avec `*`, on touche la variable pointée ; sans `*`, on touche l'adresse rangée dans `p`.

> [!info] Combien de temps coûte `*p` ?
> On note la **complexité** d'une opération avec la lettre O : O(1) veut dire « temps constant, toujours le même quelle que soit la taille des données » ; O(N) veut dire « proportionnel au nombre N d'éléments » (par exemple lire tout un tableau de N cases). Suivre un pointeur est en **O(1)** : l'adresse est déjà connue, on va directement à la bonne case sans rien parcourir.

## 2. Modifier une variable depuis une fonction

En C, une fonction reçoit toujours une **copie** de ses paramètres (on dit qu'ils sont passés **par valeur**). Modifier la copie ne change rien chez l'appelant.

Pour qu'une fonction modifie une variable de l'appelant, on lui donne **l'adresse** de cette variable (passage **par adresse**) :

```c
#include <stdio.h>

void plusUnCopie(int x) {
    x = x + 1;
}

void plusUnAdresse(int *x) {
    *x = *x + 1;
}

int main(void) {
    int n = 5;
    plusUnCopie(n);
    printf("après plusUnCopie : %d\n", n);
    plusUnAdresse(&n);
    printf("après plusUnAdresse : %d\n", n);
    return 0;
}
```

La première fonction ne change rien (elle travaille sur une copie), la seconde fait passer `n` à 6.

**Le même programme, pas à pas.** Chaque fonction a ses propres variables, rangées à part. Au moment de l'appel, la valeur donnée entre parenthèses est **recopiée** dans le paramètre.

| Étape | `n` (dans `main`) | `x` (dans la fonction) | Explication |
|---|---|---|---|
| `int n = 5;` | 5 | (n'existe pas) | |
| appel `plusUnCopie(n)` | 5 | 5 | on recopie la **valeur** 5 dans `x` |
| `x = x + 1;` | 5 | 6 | seule la copie change |
| fin de `plusUnCopie` | **5** | (disparaît) | `n` n'a jamais été touchée |
| appel `plusUnAdresse(&n)` | 5 | adr. n | on recopie l'**adresse** de `n` dans `x` |
| `*x = *x + 1;` | **6** | adr. n | `*x` désigne `n` : on écrit 6 dans `n` |
| fin de `plusUnAdresse` | 6 | (disparaît) | la modification reste, car elle a été faite dans `n` |

Dans le second cas aussi, `x` est une copie, mais c'est une copie de l'**adresse** : en la suivant, on retombe sur la vraie variable `n`.

**À retenir :** une fonction ne peut modifier une variable de l'appelant que si elle reçoit son adresse (`&n` à l'appel, `int *x` dans la fonction, `*x = ...` pour écrire).

### Que passer à l'appel ?

Le type du paramètre dit ce qu'il faut donner. Avec `int x;` dans l'appelant :

| Paramètre de la fonction | On appelle avec | Pourquoi |
|---|---|---|
| `int a` | `f(x)` | la fonction veut une valeur entière : on donne `x` |
| `int *a` | `f(&x)` | la fonction veut une adresse : `&x` est l'adresse de `x` |

Les écritures fausses qu'on voit souvent :

- `f(x)` pour un paramètre `int *` : on donne la **valeur** de `x` là où une adresse est attendue. Le compilateur refuse (ou avertit) : il ne convertit pas un entier en adresse.
- `f(*x)` : `*` ne s'applique qu'à un pointeur ; `x` est un simple `int`, donc ça ne compile pas.
- `f(x&)` : l'esperluette se met **devant** le nom (`&x`), jamais derrière.

> [!tip] Renvoyer plusieurs résultats
> Une fonction C ne renvoie qu'une valeur avec `return`. Pour en « renvoyer » plusieurs, on passe des adresses où la fonction écrira ses résultats : `void diviser(int a, int b, int *quotient, int *reste)`.

**Exemple résolu : la division euclidienne de 17 par 5.**

```c
#include <stdio.h>

void diviser(int a, int b, int *quotient, int *reste) {
    *quotient = a / b;
    *reste = a % b;
}

int main(void) {
    int q = 0;
    int r = 0;
    diviser(17, 5, &q, &r);
    printf("17 = 5 x %d + %d\n", q, r);
    return 0;
}
```

| Étape | `q` | `r` | Explication |
|---|---|---|---|
| avant l'appel | 0 | 0 | |
| appel | 0 | 0 | `a` reçoit 17, `b` reçoit 5, `quotient` reçoit adr. q, `reste` reçoit adr. r |
| `*quotient = a / b;` | **3** | 0 | division entière : 17 / 5 = 3 (on jette la partie après la virgule) |
| `*reste = a % b;` | 3 | **2** | `%` donne le reste : 17 = 5 × 3 + 2 |

Le programme affiche `17 = 5 x 3 + 2`. `a` et `b` sont passés par valeur (on ne veut que les lire), `q` et `r` par adresse (on veut que la fonction les remplisse).

**À retenir :** un paramètre qu'on lit seulement se passe par valeur ; un paramètre que la fonction doit remplir ou modifier se passe par adresse.

## 3. `NULL` : le pointeur qui ne pointe sur rien

`NULL` est une adresse spéciale qui veut dire « aucune case ». On s'en sert pour dire « pas encore de valeur », « pas trouvé » ou « fin de la liste ».

> [!warning] Ne jamais suivre `NULL`
> `*p` quand `p` vaut `NULL` fait planter le programme (**erreur de segmentation** : accès à une zone mémoire interdite). Avant de suivre un pointeur qui **peut** être `NULL`, on teste `if (p != NULL)`.

**Exemple résolu : une fonction qui renvoie l'adresse du premier nombre négatif d'un tableau, ou `NULL` s'il n'y en a pas.**

```c
#include <stdio.h>

int *premierNegatif(int *t, int n) {
    for (int i = 0; i < n; i++) {
        if (t[i] < 0) {
            return &t[i];
        }
    }
    return NULL;
}

int main(void) {
    int notes[4] = {12, 7, -3, -8};
    int *trouve = premierNegatif(notes, 4);
    if (trouve != NULL) {
        *trouve = 0;
    }
    int *rien = premierNegatif(notes, 2);
    if (rien == NULL) {
        printf("aucun négatif dans les 2 premières cases\n");
    }
    printf("%d %d %d %d\n", notes[0], notes[1], notes[2], notes[3]);
    return 0;
}
```

Premier appel, sur les 4 cases `{12, 7, -3, -8}` :

| `i` | `t[i]` | `t[i] < 0` ? | Action |
|---|---|---|---|
| 0 | 12 | non | on continue |
| 1 | 7 | non | on continue |
| 2 | -3 | **oui** | on renvoie `&t[2]`, l'adresse de la case 2 |

`trouve` n'est pas `NULL`, donc on peut écrire `*trouve = 0;` : la case 2 passe à 0 (le -8 de la case 3 n'est pas touché, on s'est arrêté au premier).

Second appel, sur les 2 premières cases seulement (`12` et `7`) : aucune n'est négative, la boucle se termine et la fonction renvoie `NULL`. Le test `rien == NULL` est vrai : on affiche le message **sans** jamais écrire `*rien`.

Le programme affiche le message, puis `12 7 0 -8`.

**À retenir :** une fonction qui peut « ne rien trouver » renvoie `NULL` ; l'appelant teste toujours `!= NULL` avant d'utiliser le pointeur.

## 4. Les structures

Une **structure** regroupe plusieurs valeurs (les **champs**) sous un même nom.

```c
typedef struct {
    int largeur;
    int hauteur;
} Rectangle;

Rectangle salle = {5, 3};
salle.hauteur = 4;
```

`typedef` donne un nom court au type : on écrit `Rectangle` au lieu de `struct ...`. Les valeurs entre accolades remplissent les champs **dans l'ordre** de la déclaration : `largeur` reçoit 5, `hauteur` reçoit 3.

### Le point ou la flèche

| On a | On écrit | Exemple |
|---|---|---|
| une structure | `.` | `salle.largeur` |
| un **pointeur** vers une structure | `->` | `r->largeur` |

`r->largeur` est un raccourci pour `(*r).largeur` : « va à la structure pointée par `r` et prends son champ `largeur` ».

Les parenthèses de `(*r).largeur` sont obligatoires : le point passe **avant** l'étoile. Sans elles, `*r.largeur` se lit `*(r.largeur)`, c'est-à-dire « prends le champ `largeur` de `r` » (impossible, `r` est un pointeur, pas une structure), puis « suis-le ». Ça ne compile pas. De même, `r.largeur` ne compile pas quand `r` est un pointeur. La flèche évite tous ces pièges.

**Exemple résolu : une fonction qui double les deux côtés d'un rectangle.**

```c
#include <stdio.h>

typedef struct {
    int largeur;
    int hauteur;
} Rectangle;

void doubler(Rectangle *r) {
    r->largeur = r->largeur * 2;
    r->hauteur = r->hauteur * 2;
}

int main(void) {
    Rectangle salle = {5, 3};
    salle.hauteur = 4;
    doubler(&salle);
    printf("salle : %d x %d\n", salle.largeur, salle.hauteur);
    return 0;
}
```

| Étape | `salle.largeur` | `salle.hauteur` | `r` | Explication |
|---|---|---|---|---|
| `Rectangle salle = {5, 3};` | 5 | 3 | | champs remplis dans l'ordre |
| `salle.hauteur = 4;` | 5 | 4 | | `salle` est une structure : on utilise `.` |
| appel `doubler(&salle)` | 5 | 4 | adr. salle | on passe l'adresse pour pouvoir modifier `salle` |
| `r->largeur = r->largeur * 2;` | **10** | 4 | adr. salle | `r` est un pointeur : on utilise `->` |
| `r->hauteur = r->hauteur * 2;` | 10 | **8** | adr. salle | |

Le programme affiche `salle : 10 x 8`. Dans `main`, `salle` est une structure (`.`) ; dans `doubler`, `r` est un pointeur (`->`) vers cette même structure.

**À retenir :** regarde le type de la variable à gauche : structure → `.`, pointeur vers une structure → `->`. Pour qu'une fonction modifie une structure, passe-lui son adresse avec `&`.

### Une structure qui désigne une autre structure du même type

C'est la base des listes chaînées :

```c
typedef struct cell {
    int value;
    struct cell *next;
} Cell;
```

Le champ `next` est un **pointeur** vers une autre `struct cell`. Il faut écrire `struct cell` (et pas `Cell`) à l'intérieur, car le nom court `Cell` n'existe qu'après la dernière ligne : le compilateur lit le code de haut en bas, et au moment où il lit le champ `next`, il ne connaît que le nom complet `struct cell` (donné sur la première ligne).

**Exemple résolu : trois cellules accrochées à la main.**

```c
#include <stdio.h>

typedef struct cell {
    int value;
    struct cell *next;
} Cell;

int main(void) {
    Cell c3 = {30, NULL};
    Cell c2 = {20, &c3};
    Cell c1 = {10, &c2};
    printf("%d\n", c1.value);
    printf("%d\n", c1.next->value);
    printf("%d\n", c1.next->next->value);
    if (c3.next == NULL) {
        printf("c3 est la dernière cellule\n");
    }
    return 0;
}
```

On crée `c3` en premier, pour que son adresse existe quand on remplit `c2`, et ainsi de suite. On obtient une chaîne :

```text
   c1                 c2                 c3
+----+------+      +----+------+      +----+------+
| 10 | next-+----> | 20 | next-+----> | 30 | NULL |
+----+------+      +----+------+      +----+------+
```

On lit les expressions de gauche à droite :

| Expression | Lecture pas à pas | Valeur |
|---|---|---|
| `c1.value` | `c1` est une structure → `.` | 10 |
| `c1.next` | le champ `next` de `c1` : un pointeur | adr. c2 |
| `c1.next->value` | on suit ce pointeur (`->`) jusqu'à `c2`, on prend `value` | 20 |
| `c1.next->next->value` | on suit jusqu'à `c2`, puis son `next` jusqu'à `c3`, on prend `value` | 30 |
| `c3.next` | le dernier `next` | `NULL` |

Le programme affiche 10, 20, 30, puis le message. Le `NULL` du dernier `next` marque la fin de la chaîne.

**À retenir :** chaque `->next` fait avancer d'une cellule ; le `next` qui vaut `NULL` indique la dernière.

## 5. La mémoire dynamique : `malloc` et `free`

Les variables locales d'une fonction vivent sur la **pile** : elles disparaissent quand la fonction se termine. Pour créer quelque chose qui **survit** à la fonction (comme un maillon de liste), on réserve de la mémoire sur le **tas** avec `malloc` (il faut `#include <stdlib.h>`). La mémoire du tas reste réservée jusqu'à ce qu'on la rende avec `free`.

### Combien réserver : `sizeof`

`malloc` compte en **octets** (un octet = la plus petite case de mémoire). `sizeof(type)` donne la taille d'un type en octets, ce qui évite de la connaître par cœur.

```c
#include <stdio.h>

typedef struct {
    int largeur;
    int hauteur;
} Rectangle;

int main(void) {
    printf("char      : %zu octet(s)\n", sizeof(char));
    printf("int       : %zu octet(s)\n", sizeof(int));
    printf("double    : %zu octet(s)\n", sizeof(double));
    printf("int *     : %zu octet(s)\n", sizeof(int *));
    printf("Rectangle : %zu octet(s)\n", sizeof(Rectangle));
    printf("6 int     : %zu octet(s)\n", 6 * sizeof(int));
    return 0;
}
```

Sur un ordinateur actuel (64 bits), on obtient en général :

| Type | Taille |
|---|---|
| `char` | 1 octet |
| `int` | 4 octets |
| `double` | 8 octets |
| un pointeur (`int *`, `Cell *`…) | 8 octets |
| `Rectangle` (deux `int`) | 8 octets |

Pour un tableau de 6 entiers, on calcule `6 * sizeof(int)` = 6 × 4 = **24** octets. `malloc(6)` ne réserverait que 6 octets, la place d'un seul `int` et demi : c'est pour ça qu'on multiplie **toujours** le nombre de cases par `sizeof`.

**À retenir :** octets à réserver = nombre de cases × `sizeof(type d'une case)`.

`%zu` est le format de `printf` pour afficher une taille (le type `size_t`, renvoyé par `sizeof`).

### Réserver, utiliser, rendre

```c
Rectangle *r = malloc(sizeof(Rectangle));
if (r == NULL) {
    exit(EXIT_FAILURE);
}
r->largeur = 1;
r->hauteur = 2;
free(r);
r = NULL;
```

| Étape | Rôle |
|---|---|
| `malloc(sizeof(Rectangle))` | réserve la place d'un `Rectangle` et renvoie son adresse |
| `if (r == NULL)` | `malloc` renvoie `NULL` s'il n'y a plus de mémoire |
| `exit(EXIT_FAILURE)` | arrête tout le programme en signalant un échec (dans `stdlib.h`) |
| `free(r)` | rend la mémoire : on ne doit plus jamais l'utiliser ensuite |
| `r = NULL` | évite de réutiliser par erreur une adresse rendue |

Le même bloc, avec l'état de la mémoire à chaque ligne :

| Ligne | `r` contient | La zone du tas |
|---|---|---|
| `malloc(...)` | adr. zone | réservée, champs = **n'importe quoi** |
| `r->largeur = 1;` | adr. zone | largeur = 1, hauteur = n'importe quoi |
| `r->hauteur = 2;` | adr. zone | largeur = 1, hauteur = 2 |
| `free(r);` | adr. zone (**inchangée**) | rendue : plus à nous |
| `r = NULL;` | `NULL` | rendue |

Remarque la ligne `free(r)` : `free` rend la zone mais **ne touche pas** à `r`, qui contient toujours l'ancienne adresse. `free` ne met pas non plus la zone à zéro et ne supprime pas la variable `r`. C'est pour ça qu'on écrit soi-même `r = NULL` juste après.

**À retenir :** `malloc` → tester `NULL` → remplir **tous** les champs → utiliser → `free` → remettre le pointeur à `NULL`.

> [!warning] Pourquoi pas une variable locale ?
> Une fonction qui crée une variable locale et renvoie son adresse (`return &locale;`) renvoie l'adresse d'une case de la **pile** qui est libérée à la fin de la fonction. L'appelant reçoit une adresse qui ne désigne plus rien de valable (le compilateur avertit : *function returns address of local variable*). Tout ce qui doit survivre à la fonction se réserve avec `malloc`.

### Un tableau sur le tas

Pour un tableau de `n` entiers : `int *t = malloc(n * sizeof(int));`, puis on l'utilise comme un tableau normal (`t[0]`, `t[1]`...). Contrairement à `int t[5];`, la taille `n` peut être connue seulement pendant l'exécution, et le tableau survit à la fonction qui l'a créé.

**Exemple résolu : une fonction qui fabrique une copie d'un tableau.**

```c
#include <stdio.h>
#include <stdlib.h>

int *copier(const int *source, int n) {
    int *t = malloc(n * sizeof(int));
    if (t == NULL) {
        exit(EXIT_FAILURE);
    }
    for (int i = 0; i < n; i++) {
        t[i] = source[i];
    }
    return t;
}

int main(void) {
    int notes[3] = {14, 9, 17};
    int *copie = copier(notes, 3);
    copie[1] = 20;
    printf("notes : %d %d %d\n", notes[0], notes[1], notes[2]);
    printf("copie : %d %d %d\n", copie[0], copie[1], copie[2]);
    free(copie);
    copie = NULL;
    return 0;
}
```

| Étape | Tableau `t` (sur le tas) | Explication |
|---|---|---|
| `malloc(3 * sizeof(int))` | `[ ? , ? , ? ]` | 3 × 4 = 12 octets réservés, contenu au hasard |
| `i = 0` | `[ 14, ? , ? ]` | `t[0] = source[0]` |
| `i = 1` | `[ 14, 9 , ? ]` | `t[1] = source[1]` |
| `i = 2` | `[ 14, 9 , 17 ]` | `t[2] = source[2]` ; `i = 3` arrête la boucle |
| `return t;` | `[ 14, 9 , 17 ]` | la variable `t` disparaît, mais la **zone du tas** reste : `copie` reçoit son adresse |
| `copie[1] = 20;` | `[ 14, 20, 17 ]` | seule la copie change, `notes` reste `14 9 17` |
| `free(copie);` | rendue | c'est `main` (l'appelant) qui libère |

Le `const` devant `int *source` promet que la fonction ne modifiera pas le tableau d'origine (le compilateur refuse si on essaie).

**À retenir :** la boucle `for (int i = 0; i < n; i++)` passe par chaque case de 0 à n − 1 ; la fonction qui fait `malloc` renvoie l'adresse, et c'est l'appelant qui fera `free` quand il aura fini.

> [!warning] Les 4 erreurs classiques
> - **Fuite mémoire** : oublier `free`. La mémoire reste réservée pour rien jusqu'à la fin du programme.
> - **Utilisation après `free`** : lire ou écrire dans une zone déjà rendue. Comportement imprévisible.
> - **Double `free`** : libérer deux fois la même adresse. Plantage fréquent.
> - **Mémoire non initialisée** : `malloc` ne met pas la mémoire à zéro. Un champ qu'on n'a pas rempli contient n'importe quoi.

Ces erreurs ne se voient pas toujours tout de suite : un programme avec une fuite mémoire marche, mais consomme de plus en plus de mémoire s'il tourne longtemps ; une utilisation après `free` peut même afficher la bonne valeur par hasard. D'autres noms d'erreurs à ne pas confondre : l'**erreur de segmentation** est le plantage quand on accède à une zone interdite (par exemple en suivant `NULL`) ; le **débordement de pile** arrive quand la pile est pleine (souvent une fonction qui s'appelle elle-même sans fin).

> [!tip] Une règle simple
> Chaque `malloc` doit avoir **exactement un** `free`, au moment où on n'a plus besoin de la donnée.

> [!info] Les fuites sont vérifiées
> Dans les exercices, la plateforme compte chaque `malloc`, `calloc` et `free` pendant les tests. S'il reste de la mémoire réservée à la fin, la vérification « toute la mémoire allouée a été libérée » échoue : une fuite mémoire fait donc rater l'exercice, même si les valeurs sont justes.

```anim
memoire-pointeurs
scenarios: pointeurs, adresse
```

## 6. Programme complet

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int largeur;
    int hauteur;
} Rectangle;

Rectangle *creerRectangle(int largeur, int hauteur) {
    Rectangle *r = malloc(sizeof(Rectangle));
    if (r == NULL) {
        exit(EXIT_FAILURE);
    }
    r->largeur = largeur;
    r->hauteur = hauteur;
    return r;
}

void doubler(Rectangle *r) {
    r->largeur = r->largeur * 2;
    r->hauteur = r->hauteur * 2;
}

int main(void) {
    Rectangle *salle = creerRectangle(5, 3);
    doubler(salle);
    printf("salle : %d x %d, aire %d\n", salle->largeur, salle->hauteur, salle->largeur * salle->hauteur);
    free(salle);
    salle = NULL;
    return 0;
}
```

Ici `salle` est déjà un pointeur (renvoyé par `creerRectangle`) : on le passe directement à `doubler`, sans `&`. Mettre `&salle` donnerait l'adresse **du pointeur** (un `Rectangle **`), pas celle du rectangle.

| Étape | `salle` | Le rectangle (sur le tas) |
|---|---|---|
| `creerRectangle(5, 3)` | adr. zone | réservé puis rempli : 5 × 3 |
| `doubler(salle)` | adr. zone | 10 × 6 |
| `printf(...)` | adr. zone | affiche `salle : 10 x 6, aire 60` |
| `free(salle)` | adr. zone | rendu |
| `salle = NULL` | `NULL` | |

Un `malloc` (dans `creerRectangle`), un `free` (dans `main`) : aucune fuite. Deux appels à `creerRectangle` donneraient deux zones différentes, donc deux adresses différentes.

**À retenir :** `&` se met devant une variable **ordinaire** pour obtenir son adresse ; si la variable est déjà un pointeur, on la passe telle quelle.

## À retenir

- `&x` = adresse de `x` ; `*p` = la variable pointée par `p`. `p = ...` change l'adresse, `*p = ...` change la variable pointée.
- Les paramètres sont **copiés** : pour modifier une variable de l'appelant, on passe son **adresse** (`f(&x)` pour un paramètre `int *`).
- `NULL` = « pointe sur rien ». Ne jamais faire `*p` ou `p->...` si `p` peut valoir `NULL`.
- Structure : `.` sur une structure, `->` sur un pointeur vers une structure (`p->x` = `(*p).x`).
- `malloc(n * sizeof(type))` réserve sur le tas (vérifier `NULL`, remplir chaque champ), `free` rend sans changer le pointeur. Un `malloc`, un `free`.
- Suivre un pointeur est en O(1).
