# Files

## 1. Le principe : premier entré, premier sorti

Une **file** est, comme la pile, une **structure de données abstraite** : on la définit par ses opérations et leur comportement, pas par la façon dont elle est construite.

Elle marche comme une **file d'attente** au guichet de la poste ou à la caisse du cinéma : on arrive **à la fin** de la file, on est servi **au début**. Le premier arrivé est le premier servi.

```text
enfiler A    enfiler B    enfiler C    défiler        défiler

  A            A B          A B C        B C  (sort A)  C  (sort B)
  ^            ^   ^        ^     ^      ^ ^
tête=fin     tête  fin    tête   fin   tête fin
```

En anglais : **First In, First Out**, abrégé **FIFO** (« premier entré, premier sorti »). Une file se dit **queue**.

> [!info] Pile ou file ?
> | | Pile | File |
> |---|---|---|
> | Principe | dernier entré, premier sorti (**LIFO**) | premier entré, premier sorti (**FIFO**) |
> | En anglais | *stack* | *queue* |
> | Ajout et retrait | du **même** côté (le sommet) | ajout à la **fin**, retrait au **début** |
> | Ordre de sortie | inverse de l'arrivée | même ordre que l'arrivée |

## 2. Les opérations

| Opération | En anglais | Rôle |
|---|---|---|
| `estVide` | *isEmpty* | la file est-elle vide ? |
| `enfiler` | *enqueue* (ou *push*) | ajouter une valeur à la **fin** |
| `defiler` | *dequeue* (ou *pop*) | retirer la valeur du **début** (et souvent la renvoyer) |
| `tete` | *front*, *peek* | lire la valeur du début **sans** la retirer |
| `estPleine` | *isFull* | plus de place ? (seulement quand la capacité est fixe) |

Comme pour la pile, on ne touche pas au milieu, et toutes ces opérations doivent coûter **O(1)**. Tout l'enjeu de ce chapitre est d'y arriver.

## 3. À quoi ça sert ?

L'usage principal : **organiser des tâches** dans l'ordre où elles arrivent.

- **Une imprimante** partagée imprime les documents dans l'ordre où on les a envoyés.
- **Un serveur** reçoit des demandes de plusieurs clients. Plutôt que de donner à chaque client son propre « travailleur » (*worker*), qui resterait parfois sans rien faire pendant qu'un autre est débordé, on met toutes les demandes dans **une seule file**. Dès qu'un travailleur est libre, il prend la demande la plus ancienne : tout le monde travaille à plein régime.
- **Les algorithmes** qui doivent traiter des informations **dans l'ordre** : parcourir un réseau « en largeur » (d'abord les voisins, puis les voisins des voisins), simuler une file de clients, faire passer des joueurs à tour de rôle.

## 4. Une file dans un tableau : la mauvaise idée, puis la bonne

### Premier essai : tout décaler

On range les valeurs dans un tableau, la tête en `tab[0]`, et `size` compte les valeurs. Enfiler écrit dans `tab[size]` : facile. Mais défiler retire `tab[0]`... et il faut **décaler** toutes les autres cases d'un cran vers la gauche. C'est **O(N)** à chaque défilement : trop cher.

### Deuxième essai : déplacer la tête

Au lieu de décaler les valeurs, on retient **où commence** la file avec un indice `start`. Défiler, c'est juste avancer `start`.

```text
capacity = 4

enfiler A, B, C :   [A][B][C][ ]    start = 0, size = 3
défiler (sort A) :  [A][B][C][ ]    start = 1, size = 2   (la case 0 est libre)
enfiler D :         [A][B][C][D]    start = 1, size = 3
enfiler E :         plus de case à droite... alors que la case 0 est libre !
```

La file « glisse » vers la droite et bute contre la fin du tableau, même s'il reste de la place au début.

### La bonne idée : le tableau circulaire

Quand on arrive au bout du tableau, on **repart au début**. On imagine le tableau refermé en cercle :

```text
         case 0
       +-------+
case 3 |       | case 1
       +-------+
         case 2
```

Pour « revenir au début » sans écrire de `if`, on utilise le **modulo** `%`, le reste de la division entière : `4 % 4` vaut 0, `5 % 4` vaut 1. Un indice qui dépasse la fin du tableau retombe ainsi dans les cases du début.

```c
typedef struct {
    int *tab;
    int start;
    int size;
    int capacity;
} Queue;
```

| Champ | Sens |
|---|---|
| `tab` | le tableau des valeurs |
| `start` | l'indice de la **tête** (la valeur la plus ancienne) |
| `size` | le nombre de valeurs dans la file |
| `capacity` | le nombre de cases du tableau |

Deux formules à connaître :

| Quoi | Où |
|---|---|
| la **tête** | `tab[start]` |
| la **première case libre** (la fin) | `tab[(start + size) % capacity]` |
| la i-ème valeur depuis la tête | `tab[(start + i) % capacity]` |

Au départ : `start = 0`, `size = 0`.

### Vide et pleine

```c
int estVide(const Queue *q) {
    return q->size == 0;
}

int estPleine(const Queue *q) {
    return q->size >= q->capacity;
}
```

Grâce à `size`, pas de piège : sans lui, on ne saurait pas distinguer une file vide d'une file pleine (dans les deux cas, la tête et la fin tombent sur la même case).

### Enfiler, défiler, lire la tête

```c
void enfiler(Queue *q, int valeur) {
    int fin = (q->start + q->size) % q->capacity;
    q->tab[fin] = valeur;
    q->size++;
}

int defiler(Queue *q) {
    int valeur = q->tab[q->start];
    q->start = (q->start + 1) % q->capacity;
    q->size--;
    return valeur;
}

int tete(const Queue *q) {
    return q->tab[q->start];
}
```

> [!warning] `start++` ne suffit pas
> Défiler fait avancer la tête **en tournant** : `start = (start + 1) % capacity`. Avec un simple `start++`, la tête finit par sortir du tableau, et on lit des cases qui n'existent pas.

> [!warning] Lire avant de bouger
> Dans `defiler`, on garde la valeur de `tab[start]` **avant** de faire avancer `start`. Dans l'autre ordre, on renverrait la valeur suivante.

Comme pour la pile, ces fonctions supposent que l'appelant ne défile jamais une file vide et n'enfile jamais dans une file pleine. Sinon :

| Appel interdit | Ce qui se passe |
|---|---|
| `enfiler` dans une file pleine | la fin tombe **sur la tête** : la valeur la plus ancienne est écrasée, sans prévenir |
| `defiler` sur une file vide | on renvoie une vieille valeur sans sens, et `size` passe à -1 |

La parade est la même : tester `estPleine` / `estVide` avant, ou renvoyer un code de réussite (`1` ou `0`) et passer la valeur par un pointeur.

### Un tour complet, pas à pas

Une file de capacité 4 :

| Opération | `tab` | `start` | `size` | fin = `(start + size) % 4` |
|---|---|---|---|---|
| départ | `[ ][ ][ ][ ]` | 0 | 0 | 0 |
| enfiler A, B, C, D | `[A][B][C][D]` | 0 | 4 | 0 (pleine) |
| défiler (A) | `[A][B][C][D]` | 1 | 3 | 0 |
| défiler (B) | `[A][B][C][D]` | 2 | 2 | 0 |
| défiler (C) | `[A][B][C][D]` | 3 | 1 | 0 |
| enfiler E | `[E][B][C][D]` | 3 | 2 | 1 |
| défiler (D) | `[E][B][C][D]` | (3 + 1) % 4 = **0** | 1 | 1 |
| défiler (E) | `[E][B][C][D]` | 1 | 0 | 1 |

Les vieilles valeurs restent dans les cases, mais seules les `size` cases à partir de `start` font partie de la file.

### Afficher

On part de la tête et on fait `size` pas, en tournant :

```c
#include <stdio.h>

typedef struct {
    int *tab;
    int start;
    int size;
    int capacity;
} Queue;

void afficher(const Queue *q) {
    for (int i = 0; i < q->size; i++) {
        printf("%d ", q->tab[(q->start + i) % q->capacity]);
    }
    printf("\n");
}

void enfiler(Queue *q, int valeur) {
    q->tab[(q->start + q->size) % q->capacity] = valeur;
    q->size++;
}

int defiler(Queue *q) {
    int valeur = q->tab[q->start];
    q->start = (q->start + 1) % q->capacity;
    q->size--;
    return valeur;
}

int main(void) {
    int cases[4];
    Queue file = {cases, 0, 0, 4};
    for (int i = 1; i <= 4; i++) {
        enfiler(&file, i * 10);
    }
    afficher(&file);
    printf("je défile %d\n", defiler(&file));
    printf("je défile %d\n", defiler(&file));
    enfiler(&file, 50);
    enfiler(&file, 60);
    afficher(&file);
    printf("la tête est dans la case %d\n", file.start);
    return 0;
}
```

> [!warning] Le retour à la ligne oublié
> Comme pour la pile : « sur une seule ligne » veut dire toutes les valeurs, **puis** `\n`. Et la boucle va de `0` à `size`, avec le modulo : une boucle `for (i = start; i < start + size; i++)` sans `%` lit en dehors du tableau dès que la file a fait le tour.

## 5. Une file dans une liste chaînée

Avec une liste chaînée, on veut :

- **retirer au début** : facile, O(1) ;
- **ajouter à la fin** : O(1) seulement si l'on garde un **pointeur vers le dernier maillon** (chapitre 1).

Pourquoi pas l'inverse (ajouter au début, retirer à la fin) ? Parce que supprimer le dernier maillon demande l'avant-dernier : il faudrait parcourir toute la liste, O(N).

```c
typedef struct cell {
    int value;
    struct cell *next;
} Cell;

typedef struct {
    Cell *premier;
    Cell *dernier;
    int taille;
} File;
```

```text
premier                         dernier
   |                               |
   v                               v
 [10|*] --> [20|*] --> [30|*] --> [40|/]
  tête                              fin
```

Une file vide a `premier == NULL` **et** `dernier == NULL`.

### Enfiler à la fin

```c
void enfilerListe(File *f, int valeur) {
    Cell *c = malloc(sizeof(Cell));
    if (c == NULL) {
        exit(EXIT_FAILURE);
    }
    c->value = valeur;
    c->next = NULL;
    if (f->dernier == NULL) {
        f->premier = c;
    } else {
        f->dernier->next = c;
    }
    f->dernier = c;
    f->taille++;
}
```

Deux cas : si la file est vide, le nouveau maillon est à la fois le premier **et** le dernier. Sinon, on l'accroche derrière l'ancien dernier. Dans les deux cas, il devient le dernier.

### Défiler au début

```c
int defilerListe(File *f) {
    Cell *ancien = f->premier;
    int valeur = ancien->value;
    f->premier = ancien->next;
    if (f->premier == NULL) {
        f->dernier = NULL;
    }
    free(ancien);
    f->taille--;
    return valeur;
}
```

> [!warning] Le pointeur de fin qui reste en l'air
> Quand on défile **le seul** maillon, `premier` devient `NULL`... mais `dernier` pointe toujours vers le maillon qu'on vient de libérer. Au prochain `enfiler`, on écrirait dans de la mémoire rendue. Il faut remettre `dernier` à `NULL` quand la file devient vide.

### Un exemple complet

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct cell {
    int value;
    struct cell *next;
} Cell;

typedef struct {
    Cell *premier;
    Cell *dernier;
    int taille;
} File;

void enfilerListe(File *f, int valeur) {
    Cell *c = malloc(sizeof(Cell));
    if (c == NULL) {
        exit(EXIT_FAILURE);
    }
    c->value = valeur;
    c->next = NULL;
    if (f->dernier == NULL) {
        f->premier = c;
    } else {
        f->dernier->next = c;
    }
    f->dernier = c;
    f->taille++;
}

int defilerListe(File *f) {
    Cell *ancien = f->premier;
    int valeur = ancien->value;
    f->premier = ancien->next;
    if (f->premier == NULL) {
        f->dernier = NULL;
    }
    free(ancien);
    f->taille--;
    return valeur;
}

int main(void) {
    File clients = {NULL, NULL, 0};
    enfilerListe(&clients, 1);
    enfilerListe(&clients, 2);
    enfilerListe(&clients, 3);
    printf("je sers le client %d\n", defilerListe(&clients));
    enfilerListe(&clients, 4);
    while (clients.premier != NULL) {
        printf("je sers le client %d\n", defilerListe(&clients));
    }
    return 0;
}
```

## 6. Tableau circulaire ou liste chaînée ?

| | Tableau circulaire | Liste chaînée avec pointeur de fin |
|---|---|---|
| Opérations | O(1) | O(1) |
| Capacité | fixe | illimitée |
| `estPleine` | nécessaire | inutile |
| Mémoire | une case par valeur | une valeur + un pointeur par maillon, un `malloc` par `enfiler` |
| Pièges | oublier le **modulo** ; écraser la tête quand la file est pleine | oublier de remettre `dernier` à `NULL` ; oublier le `free` |

> [!info] Et la liste circulaire ?
> Une liste chaînée **circulaire** (le dernier maillon pointe vers le premier) permet aussi une file avec **un seul** pointeur, vers le dernier : la tête est alors `dernier->next`. L'ajout à la fin devient O(1) sans second pointeur. C'est l'opération que la liste circulaire améliore par rapport à la liste simple.

## 7. Application : chacun son tour

Une file sert naturellement à faire passer des joueurs **à tour de rôle** : on défile le joueur dont c'est le tour, il joue, et s'il n'a pas fini, on le **renfile** à la fin.

Exemple : 5 personnes en cercle, numérotées de 1 à 5. On compte jusqu'à 2 : la personne sur qui tombe le « 2 » est éliminée, et on recommence à compter avec la suivante. Avec une file :

- on défile la première personne et on la renfile (elle a dit « 1 ») ;
- on défile la suivante : elle a dit « 2 », elle est éliminée (on ne la renfile pas) ;
- on recommence jusqu'à ce qu'il ne reste qu'une personne.

```text
file : 1 2 3 4 5    1 passe, 2 éliminée
file : 3 4 5 1      3 passe, 4 éliminée
file : 5 1 3        5 passe, 1 éliminée
file : 3 5          3 passe, 5 éliminée
file : 3            survivante : 3
```

## 8. Pièges

> [!warning] Oublier le modulo
> `tab[start + size]` et `start++` marchent... jusqu'au moment où la file fait le tour du tableau. Ce bug ne se voit pas dans les petits essais : il faut toujours tester une file qui a enfilé et défilé plus de `capacity` valeurs au total.

> [!warning] Enfiler dans une file pleine
> Dans un tableau circulaire, la case « libre » d'une file pleine est... la tête. La valeur la plus ancienne est écrasée en silence.

> [!warning] Confondre la tête et la fin
> On enfile à la **fin** (`(start + size) % capacity`), on défile à la **tête** (`start`). Dans une liste chaînée : on enfile derrière `dernier`, on défile `premier`.

## À retenir

- File = structure **abstraite** **FIFO** (premier entré, premier sorti), en anglais **queue**. On ajoute à la fin, on retire au début.
- Opérations : `estVide`, `enfiler`, `defiler`, `tete`, et `estPleine` si la capacité est fixe. Toutes en **O(1)**.
- Tableau : décaler coûte O(N) ; la solution est le **tableau circulaire** avec `start`, `size` et le **modulo**.
- Tête : `tab[start]`. Fin : `tab[(start + size) % capacity]`. Défiler : `start = (start + 1) % capacity`.
- Liste chaînée : on enfile **derrière le dernier** (pointeur de fin), on défile **le premier** ; file vidée → `dernier = NULL`.
- Usages : tâches dans l'ordre d'arrivée (imprimante, serveur et *workers*), tour de rôle, parcours en largeur.
