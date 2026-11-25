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

**Exemple résolu : on part d'une file vide et on fait, dans l'ordre, enfiler 5, enfiler 8, défiler, enfiler 2, enfiler 6, défiler, défiler. Quelles valeurs sortent, et que reste-t-il ?**

On note la file après chaque opération, la **tête à gauche** (la plus ancienne, la prochaine à sortir) et la **fin à droite** (la plus récente) :

| Opération | File après (tête → fin) | Tête | Valeur sortie |
|---|---|---|---|
| départ | (vide) | aucune | |
| enfiler 5 | `5` | 5 | |
| enfiler 8 | `5 8` | 5 | |
| défiler | `8` | 8 | **5** (la première arrivée) |
| enfiler 2 | `8 2` | 8 | |
| enfiler 6 | `8 2 6` | 8 | |
| défiler | `2 6` | 2 | **8** |
| défiler | `6` | 6 | **2** |

Sorties dans l'ordre : 5, 8, 2, exactement l'ordre d'arrivée. Il reste `6`, la dernière arrivée. Avec une **pile**, les mêmes opérations auraient fait sortir 8, 6, 2 (voir le chapitre précédent) : seule la règle de sortie change.

**À retenir :** une file, c'est « premier arrivé, premier servi » (FIFO). Pour suivre une suite d'opérations, écris la file après **chaque** ligne : enfiler ajoute à droite, défiler retire à gauche.

## 2. Les opérations

| Opération | En anglais | Rôle |
|---|---|---|
| `estVide` | *isEmpty* | la file est-elle vide ? |
| `enfiler` | *enqueue* (ou *push*) | ajouter une valeur à la **fin** |
| `defiler` | *dequeue* (ou *pop*) | retirer la valeur du **début** (et souvent la renvoyer) |
| `tete` | *front*, *peek* | lire la valeur du début **sans** la retirer |
| `estPleine` | *isFull* | plus de place ? (seulement quand la capacité est fixe) |

Comme pour la pile, on ne touche pas au milieu, et toutes ces opérations doivent coûter **O(1)**. Tout l'enjeu de ce chapitre est d'y arriver.

**Exemple résolu : `tete` ou `defiler` ?** La file contient `3 9 4` (tête à gauche, donc 3 est la plus ancienne).

| Appel | Valeur obtenue | File après |
|---|---|---|
| `tete` | 3 | `3 9 4` (rien n'a bougé) |
| `defiler` | 3 | `9 4` |
| `tete` | 9 | `9 4` |
| `enfiler 1` | | `9 4 1` (1 va à la fin) |
| `tete` | 9 | `9 4 1` (la tête ne change pas quand on enfile) |

Une file ne regarde **jamais** les valeurs elles-mêmes : ce n'est ni la plus petite ni la plus grande qui sort, c'est la plus ancienne. Et comme pour une pile, chercher une valeur quelconque ou afficher toute la file demande de passer sur chaque valeur : **O(N)** pour une file de N valeurs.

**À retenir :** `tete` lit la plus ancienne sans la retirer, `defiler` la retire, `enfiler` ajoute à la fin sans toucher à la tête.

## 3. À quoi ça sert ?

L'usage principal : **organiser des tâches** dans l'ordre où elles arrivent.

- **Une imprimante** partagée imprime les documents dans l'ordre où on les a envoyés.
- **Un serveur** reçoit des demandes de plusieurs clients. Plutôt que de donner à chaque client son propre « travailleur » (*worker*), qui resterait parfois sans rien faire pendant qu'un autre est débordé, on met toutes les demandes dans **une seule file**. Dès qu'un travailleur est libre, il prend la demande la plus ancienne : tout le monde travaille à plein régime.
- **Les algorithmes** qui doivent traiter des informations **dans l'ordre** : parcourir un réseau « en largeur » (d'abord les voisins, puis les voisins des voisins), simuler une file de clients, faire passer des joueurs à tour de rôle.

| Usage | Qui est traité en premier ? | Structure |
|---|---|---|
| imprimante partagée | le premier document envoyé | **file** |
| demandes d'un serveur | la demande la plus ancienne | **file** |
| bouton « Annuler » | la **dernière** action faite | pile |
| bouton « Retour » | la **dernière** page visitée | pile |
| vérifier des parenthèses | la **dernière** ouvrante encore ouverte | pile |

**À retenir :** si le plus **ancien** doit passer en premier (ordre d'arrivée, équité), c'est une file ; si c'est le plus **récent**, c'est une pile.

## 4. Une file dans un tableau : la mauvaise idée, puis la bonne

### Premier essai : tout décaler

On range les valeurs dans un tableau, la tête en `tab[0]`, et `size` compte les valeurs. Enfiler écrit dans `tab[size]` : facile. Mais défiler retire `tab[0]`... et il faut **décaler** toutes les autres cases d'un cran vers la gauche. C'est **O(N)** à chaque défilement : trop cher.

**Exemple résolu : défiler la file `A B C D` (tête en `tab[0]`).**

| Étape | `tab[0]` | `tab[1]` | `tab[2]` | `tab[3]` |
|---|---|---|---|---|
| avant | A | B | C | D |
| on garde A pour le renvoyer, puis `tab[0] = tab[1]` | B | B | C | D |
| `tab[1] = tab[2]` | B | C | C | D |
| `tab[2] = tab[3]` | B | C | D | D |
| `size` passe de 4 à 3 | B | C | D | (libre) |

Il a fallu **3 recopies** pour 4 valeurs. Avec une file de N valeurs, chaque défilement fait N − 1 recopies : O(N), alors qu'on n'a retiré qu'une seule valeur.

**À retenir :** garder la tête toujours en `tab[0]` oblige à tout décaler à chaque défilement. On va plutôt faire bouger **l'indice de la tête**.

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

**Exemple résolu : les indices d'un tableau de 6 cases (`capacity = 6`).** On calcule `x % 6`, c'est-à-dire le reste quand on divise `x` par 6 :

| `x` | Division par 6 | `x % 6` | Case réelle |
|---|---|---|---|
| 4 | 4 = 0 × 6 + **4** | 4 | case 4 (pas de changement, 4 est déjà dans le tableau) |
| 5 | 5 = 0 × 6 + **5** | 5 | case 5, la dernière |
| 6 | 6 = 1 × 6 + **0** | 0 | on a fait le tour : case 0 |
| 7 | 7 = 1 × 6 + **1** | 1 | case 1 |
| 9 | 9 = 1 × 6 + **3** | 3 | case 3 |

Un nombre plus petit que 6 ne change pas ; à partir de 6, on retire 6 et on retombe au début. Le résultat est toujours entre 0 et 5 : on ne sort **jamais** du tableau.

**À retenir :** `x % capacity` ramène n'importe quel indice positif dans le tableau, en « faisant le tour ». Tout calcul d'indice dans une file circulaire se termine par `% capacity`.

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

Les formules à connaître :

| Quoi | Où |
|---|---|
| la **tête** | `tab[start]` |
| la **première case libre** (la fin) | `tab[(start + size) % capacity]` |
| la i-ème valeur depuis la tête (`i = 0` : la tête) | `tab[(start + i) % capacity]` |
| la **dernière** valeur (la plus récente) | `tab[(start + size - 1) % capacity]` |
| la i-ème valeur depuis la fin (`i = 0` : la plus récente) | `tab[(start + size - 1 - i) % capacity]` |

Au départ : `start = 0`, `size = 0`.

**Exemple résolu : `capacity = 6`, `start = 4`, `size = 4`.** La file occupe 4 cases à partir de la case 4, en faisant le tour :

| Valeur de la file | Calcul | Case |
|---|---|---|
| tête (`i = 0`) | (4 + 0) % 6 = 4 | 4 |
| `i = 1` | (4 + 1) % 6 = 5 | 5 |
| `i = 2` | (4 + 2) % 6 = 0 | 0 (on a fait le tour) |
| `i = 3`, la dernière | (4 + 3) % 6 = 1 | 1 |
| première case libre | (4 + 4) % 6 = 2 | 2 : le prochain `enfiler` écrit ici |

```text
indice :   0    1    2    3    4    5
         +----+----+----+----+----+----+
         | 3e | 4e |    |    | 1re| 2e |
         +----+----+----+----+----+----+
                  libre      start
```

Sans modulo, la 3e valeur serait cherchée en case 6 et la case libre en case 8 : deux cases qui n'existent pas.

**À retenir :** pour trouver une case, pars de `start`, avance du nombre de pas voulu, puis applique `% capacity`.

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

**Exemple résolu : une file de capacité 5.**

| `start` | `size` | fin = `(start + size) % 5` | `estVide` | `estPleine` |
|---|---|---|---|---|
| 0 | 0 | 0, la même case que `start` | 1 | 0 |
| 2 | 0 | 2, la même case que `start` | 1 | 0 |
| 1 | 3 | 4 | 0 | 0 |
| 2 | 5 | 7 % 5 = 2, la même case que `start` | 0 | 1 |

Dans les lignes 2 et 4, la fin et la tête tombent sur la **même** case (2), alors qu'une file est vide et l'autre pleine : seul `size` fait la différence. Et `start` n'intervient pas dans les deux fonctions : une file vide peut avoir sa tête n'importe où.

**À retenir :** vide ⇔ `size == 0`, pleine ⇔ `size >= capacity`, quelle que soit la valeur de `start`.

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

**Exemple résolu : pourquoi enfiler dans une file pleine écrase la tête.** Capacité 3, la file `1 2 3` remplit tout le tableau avec `start = 0`, `size = 3`. Un `enfiler(4)` sans test calcule la fin : (0 + 3) % 3 = **0**, c'est-à-dire la case de la tête. Il écrit 4 par-dessus le 1 et passe `size` à 4 : la file devient `[4][2][3]` avec une taille absurde, et la valeur 1 est perdue. Le modulo empêche de sortir du tableau, mais pas d'écraser.

Voici la version avec code de réussite :

```c
#include <stdio.h>

typedef struct {
    int *tab;
    int start;
    int size;
    int capacity;
} Queue;

int enfilerSur(Queue *q, int valeur) {
    if (q->size >= q->capacity) {
        return 0;
    }
    q->tab[(q->start + q->size) % q->capacity] = valeur;
    q->size++;
    return 1;
}

int defilerSur(Queue *q, int *valeur) {
    if (q->size == 0) {
        return 0;
    }
    *valeur = q->tab[q->start];
    q->start = (q->start + 1) % q->capacity;
    q->size--;
    return 1;
}

int main(void) {
    int cases[2];
    Queue file = {cases, 0, 0, 2};
    for (int v = 1; v <= 3; v++) {
        int ok = enfilerSur(&file, v * 10);
        printf("enfiler %d : %s (start %d, size %d)\n", v * 10, ok ? "réussi" : "refusé", file.start, file.size);
    }
    int lu = -1;
    for (int essai = 1; essai <= 3; essai++) {
        int ok = defilerSur(&file, &lu);
        printf("défiler : %s, lu = %d (start %d, size %d)\n", ok ? "réussi" : "refusé", lu, file.start, file.size);
    }
    return 0;
}
```

`Queue file = {cases, 0, 0, 2};` remplit les champs dans l'ordre de la structure : `tab = cases`, `start = 0`, `size = 0`, `capacity = 2`.

| Appel | Test au début | Renvoie | `start` | `size` | `lu` |
|---|---|---|---|---|---|
| `enfilerSur(10)` | pleine ? 0 ≥ 2 : non | 1 | 0 | 1 | -1 |
| `enfilerSur(20)` | pleine ? 1 ≥ 2 : non | 1 | 0 | 2 | -1 |
| `enfilerSur(30)` | pleine ? 2 ≥ 2 : **oui** | 0 | 0 | 2 (rien n'a changé, 10 n'est pas écrasé) | -1 |
| `defilerSur(&lu)` | vide ? non | 1 | 1 | 1 | 10 |
| `defilerSur(&lu)` | vide ? non | 1 | (1 + 1) % 2 = 0 | 0 | 20 |
| `defilerSur(&lu)` | vide ? **oui** | 0 | 0 (n'a pas avancé) | 0 | 20 (pas touché) |

Une fonction « lire la tête » sûre suit la même règle : si la file est vide, elle renvoie 0 sans toucher à `*valeur` ; sinon elle range `tab[start]` dans `*valeur`, ne bouge **rien** d'autre, et renvoie 1.

**À retenir :** le test vient **en premier** ; quand l'opération est impossible, on renvoie 0 sans modifier ni `start`, ni `size`, ni le tableau, ni la variable pointée.

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

**Exemple résolu : le même scénario sans modulo.** Supposons qu'on ait écrit `tab[start + size] = valeur` et `start++`. Tout est juste tant que `start + size` reste inférieur à 4. À la ligne « enfiler E », `start = 3` et `size = 1` : on écrit dans `tab[3 + 1] = tab[4]`, **la case après la fin**. Puis « défiler (D) » fait `start = 4`, et le défilement suivant lit `tab[4]`, une case hors du tableau. Le bug n'apparaît qu'après que la file a fait le tour : c'est pour ça qu'on le rate si on teste seulement avec quelques valeurs.

**À retenir :** enfiler écrit en `(start + size) % capacity` puis `size++` ; défiler lit `tab[start]`, **puis** `start = (start + 1) % capacity` et `size--`. Teste toujours une file qui a enfilé et défilé plus de `capacity` valeurs au total.

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

**Exemple résolu : ce que fait ce `main`.**

| Étape | `tab` | `start` | `size` |
|---|---|---|---|
| enfiler 10, 20, 30, 40 | `[10][20][30][40]` | 0 | 4 |
| défiler deux fois (10, puis 20) | `[10][20][30][40]` | 2 | 2 |
| enfiler 50 : case (2 + 2) % 4 = 0 | `[50][20][30][40]` | 2 | 3 |
| enfiler 60 : case (2 + 3) % 4 = 1 | `[50][60][30][40]` | 2 | 4 |

Le second `afficher` fait 4 pas à partir de la tête :

| `i` | Case `(2 + i) % 4` | Valeur |
|---|---|---|
| 0 | 2 | 30 |
| 1 | 3 | 40 |
| 2 | 0 | 50 |
| 3 | 1 | 60 |

Il affiche `30 40 50 60`, l'ordre dans lequel les valeurs sortiront, alors que dans le tableau elles sont rangées `50 60 30 40`.

**Afficher depuis la fin** (de la plus récente à la plus ancienne) : on part de la dernière valeur, en case `(start + size - 1) % capacity`, et on recule. La i-ème depuis la fin est en `(start + size - 1 - i) % capacity` : ici (2 + 4 − 1 − 0) % 4 = 1 (60), puis 0 (50), puis 3 (40), puis 2 (30). On obtient `60 50 40 30`. Comme `i` ne dépasse jamais `size - 1`, le nombre `start + size - 1 - i` reste positif ou nul : le modulo fonctionne sans surprise.

**File vide** : `size = 0`, la boucle ne tourne pas, seul le `\n` s'affiche. Pour afficher un message comme `(vide)`, on teste `if (q->size == 0)` **avant** la boucle, on affiche le message avec son `\n`, puis `return;`.

**À retenir :** pour parcourir une file circulaire, `i` va de 0 à `size - 1` (et non de `start` à `start + size`), et la case lue est toujours calculée avec `% capacity`. Afficher N valeurs coûte O(N).

> [!warning] Le retour à la ligne oublié
> Comme pour la pile : « sur une seule ligne » veut dire toutes les valeurs, **puis** `\n`. Et la boucle va de `0` à `size`, avec le modulo : une boucle `for (i = start; i < start + size; i++)` sans `%` lit en dehors du tableau dès que la file a fait le tour.

### Une file qui grandit

Comme pour la pile, on peut **doubler la capacité** quand la file est pleine, au lieu de refuser la valeur. Mais il y a un piège qui n'existe pas pour la pile : une file qui a fait le tour est rangée **en deux morceaux**.

**Exemple résolu : capacité 4, `start = 3`, `size = 4`, la file est `P Q R S` (P la plus ancienne).**

```text
indice :  0   1   2   3
tab :    [Q] [R] [S] [P]        start = 3 : P en case 3, puis Q, R, S en cases 0, 1, 2
```

**Essai 1 : `realloc` vers 8 cases, sans rien déplacer.** `realloc` garde les cases à leur place et ajoute 4 cases libres **après** :

```text
indice :  0   1   2   3   4   5   6   7
tab :    [Q] [R] [S] [P] [ ] [ ] [ ] [ ]     start = 3, size = 4, capacity = 8
```

La file se lit maintenant en cases (3 + i) % 8 : 3, 4, 5, 6, soit `P ? ? ?`. Q, R et S sont restées en cases 0 à 2, mais la formule ne revient plus au début (il faudrait dépasser 8 pour ça). La file est cassée.

**Essai 2 : recopier dans l'ordre de la file.** On réserve un **nouveau** tableau de 8 cases et on y recopie les valeurs de la tête à la fin : la i-ème valeur de la file (en case `(start + i) % 4` de l'ancien tableau) va dans la case `i` du nouveau.

| `i` | Ancienne case `(3 + i) % 4` | Valeur | Nouvelle case |
|---|---|---|---|
| 0 | 3 | P | 0 |
| 1 | 0 | Q | 1 |
| 2 | 1 | R | 2 |
| 3 | 2 | S | 3 |

```text
indice :  0   1   2   3   4   5   6   7
tab :    [P] [Q] [R] [S] [ ] [ ] [ ] [ ]     start = 0, size = 4, capacity = 8
```

Puis on fait `free` de l'ancien tableau, on range l'adresse du nouveau dans `tab`, on remet `start` à 0 et on double `capacity`. Le prochain `enfiler` écrit en case (0 + 4) % 8 = 4, comme d'habitude.

Si la file n'avait **pas** fait le tour (`start = 0`), le simple `realloc` aurait suffi : c'est pour ça que ce bug ne se voit qu'avec une file qui a tourné.

**À retenir :** pour agrandir une file circulaire, recopie les valeurs **dans l'ordre de la file** (`nouveau[i] = tab[(start + i) % capacity]`) dans un tableau deux fois plus grand, libère l'ancien, puis `start = 0` et `capacity` doublée. Comme pour la pile, doubler donne un enfilement en O(1) amorti.

## 5. Une file dans une liste chaînée

Avec une liste chaînée, on veut :

- **retirer au début** : facile, O(1) ;
- **ajouter à la fin** : O(1) seulement si l'on garde un **pointeur vers le dernier maillon** (chapitre 1).

Pourquoi pas l'inverse (ajouter au début, retirer à la fin) ? Parce que supprimer le dernier maillon demande l'avant-dernier : il faudrait parcourir toute la liste, O(N).

Et sans pointeur vers le dernier maillon ? Pour accrocher un nouveau maillon à la fin, il faudrait d'abord le **trouver** : partir de `premier` et suivre les `next` jusqu'au maillon dont le `next` vaut `NULL`. Pour une file de N valeurs, c'est N pas à chaque `enfiler` : O(N). Le pointeur `dernier` évite ce parcours.

Enfiler et défiler **du même côté** (tous les deux au début) donnerait une pile, pas une file : c'est la valeur la plus récente qui sortirait.

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

Une file vide a `premier == NULL` **et** `dernier == NULL` (et `taille == 0`). Pour savoir si la file est vide, il suffit donc de tester `f->premier == NULL`.

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

**Exemple résolu : on part de la file vide `{NULL, NULL, 0}` et on enfile 7, puis 9.**

| Appel | Cas | Ce qui change | `premier` | `dernier` | `taille` |
|---|---|---|---|---|---|
| départ | | | `NULL` | `NULL` | 0 |
| `enfilerListe(7)` | `dernier == NULL` : file vide | `premier = c` | maillon 7 | maillon 7 | 1 |
| `enfilerListe(9)` | file non vide | `dernier->next = c` : le maillon 7 pointe vers 9 | maillon 7 | maillon 9 | 2 |

```text
après enfiler 7 :   premier --> [7|/] <-- dernier

après enfiler 9 :   premier --> [7|*] --> [9|/] <-- dernier
```

Le nouveau maillon a toujours `next = NULL` : c'est le dernier, rien ne vient après lui.

**À retenir :** enfiler = `malloc`, `next = NULL`, accrocher (à `premier` si la file était vide, sinon à `dernier->next`), puis `dernier = c` et `taille++`.

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

**Exemple résolu : la file `7 9` (`premier` = maillon 7, `dernier` = maillon 9). On défile deux fois.**

| Appel | `premier` après | Test `premier == NULL` | `dernier` après | Renvoie |
|---|---|---|---|---|
| `defilerListe` | maillon 9 | non : on ne touche pas à `dernier` | maillon 9 | 7 (le maillon 7 est libéré) |
| `defilerListe` | `NULL` | **oui** : `dernier = NULL` | `NULL` | 9 (le maillon 9 est libéré) |

Sans le test, après le second défilement, `dernier` pointerait encore vers le maillon 9, déjà rendu par `free`. Un `enfilerListe(5)` verrait alors `dernier != NULL`, ferait `dernier->next = c` (écriture dans la mémoire rendue) et laisserait `premier` à `NULL` : la valeur 5 serait perdue, alors que le programme ne plante pas forcément.

**Vider la file** : on défile tant qu'il reste un maillon, `while (f->premier != NULL) defilerListe(f);`. Chaque appel fait le `free` d'un maillon, et le dernier appel remet `premier`, `dernier` à `NULL` et `taille` à 0. Écrire seulement `f->premier = NULL; f->dernier = NULL; f->taille = 0;` donne une file qui **semble** vide, mais les maillons ne sont jamais libérés : c'est une fuite mémoire, et plus personne ne connaît leur adresse pour les rendre.

**À retenir :** défiler = garder le premier maillon et sa valeur, avancer `premier`, remettre `dernier` à `NULL` si la file est devenue vide, puis `free` et `taille--`. Vider = défiler jusqu'au bout, pas juste effacer les pointeurs.

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
| Capacité | fixe (ou doublée, en recopiant dans l'ordre) | illimitée (tant qu'il reste de la mémoire) |
| Enfiler sans connaître le nombre maximum de valeurs | impossible sans agrandissement | naturel : un `malloc` par valeur |
| `estPleine` | nécessaire | inutile |
| Mémoire | une case par valeur | une valeur + un pointeur par maillon, un `malloc` par `enfiler` |
| Pièges | oublier le **modulo** ; écraser la tête quand la file est pleine | oublier de remettre `dernier` à `NULL` ; oublier le `free` |

> [!info] Et la liste circulaire ?
> Une liste chaînée **circulaire** (le dernier maillon pointe vers le premier) permet aussi une file avec **un seul** pointeur, vers le dernier : la tête est alors `dernier->next`. L'ajout à la fin devient O(1) sans second pointeur. C'est l'opération que la liste circulaire améliore par rapport à la liste simple.

**À retenir :** les deux versions font toutes les opérations de file en O(1). On choisit la liste chaînée quand on ne connaît pas à l'avance le nombre de valeurs, le tableau circulaire quand on le connaît (moins de `malloc`, pas de pointeurs).

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

Avec un compte jusqu'à `k` quelconque, chaque tour d'élimination se fait en deux temps :

1. `k - 1` fois : défiler la tête et la **renfiler** aussitôt (elle a dit 1, 2, ..., k − 1 et reste en jeu) ;
2. une fois de plus : défiler **sans renfiler** (elle a dit `k`, elle est éliminée ; on note son numéro).

On recommence tant qu'il reste plus d'une personne, puis la survivante est la seule valeur de la file.

**Exemple résolu : 4 personnes, on compte jusqu'à 3.** On fait chaque opération de file une par une :

| Opération | Personne | File après (tête → fin) | Éliminées |
|---|---|---|---|
| départ | | `1 2 3 4` | |
| défiler, renfiler (dit 1) | 1 | `2 3 4 1` | |
| défiler, renfiler (dit 2) | 2 | `3 4 1 2` | |
| défiler (dit 3) : éliminée | 3 | `4 1 2` | 3 |
| défiler, renfiler (dit 1) | 4 | `1 2 4` | 3 |
| défiler, renfiler (dit 2) | 1 | `2 4 1` | 3 |
| défiler (dit 3) : éliminée | 2 | `4 1` | 3, 2 |
| défiler, renfiler (dit 1) | 4 | `1 4` | 3, 2 |
| défiler, renfiler (dit 2) | 1 | `4 1` | 3, 2 |
| défiler (dit 3) : éliminée | 4 | `1` | 3, 2, 4 |
| il reste une personne | | `1` | survivante : 1 |

Quelques détails pour l'écrire en C avec la file en tableau circulaire :

- **La capacité** : la file ne contient jamais plus de `n` personnes (on défile toujours avant de renfiler), donc `n` cases suffisent. Comme `n` n'est connu qu'à l'exécution, le tableau se réserve avec `malloc(n * sizeof(int))`, et on fait `free` dessus **avant** le `return`, une fois la survivante lue.
- **Les cas limites** : avec `k = 1`, l'étape 1 ne se fait jamais et les personnes sont éliminées dans l'ordre 1, 2, 3... ; avec `n = 1`, personne n'est éliminé et la survivante est 1.

**À retenir :** à tour de rôle = défiler la tête, la faire jouer, la **renfiler à la fin** si elle reste en jeu. Celui qui doit agir est toujours la tête de la file.

### Le tourniquet : partager le processeur

Un processeur ne fait qu'une chose à la fois. Pour faire avancer plusieurs tâches « en même temps », le système les fait passer à tour de rôle : c'est le **tourniquet** (*round robin*).

- les tâches attendent dans une file, au départ dans l'ordre 0, 1, 2... ;
- la tâche en tête travaille pendant au plus `quantum` unités de temps (la **tranche** : le plus petit entre `quantum` et ce qui lui reste à faire) ;
- si elle n'a pas fini, elle est **renfilée** à la fin ; sinon, elle quitte la file et on note l'heure de sa fin.

La file contient les **numéros** des tâches. Le temps qu'il reste à chacune est noté à part, dans un tableau `reste` (une copie des durées, qu'on diminue au fur et à mesure). Une horloge `temps` part de 0 et avance de la tranche à chaque passage.

**Exemple résolu : durées `{3, 1, 4}` (tâches 0, 1, 2), `quantum = 2`.**

| `temps` avant | File avant | Tâche | Tranche = plus petit de `reste` et 2 | `reste` après | `temps` après | Ensuite |
|---|---|---|---|---|---|---|
| 0 | `0 1 2` | 0 | plus petit de 3 et 2 = 2 | 1 | 2 | pas finie : renfilée |
| 2 | `1 2 0` | 1 | plus petit de 1 et 2 = 1 | 0 | 3 | finie : fin de la tâche 1 = 3 |
| 3 | `2 0` | 2 | plus petit de 4 et 2 = 2 | 2 | 5 | pas finie : renfilée |
| 5 | `0 2` | 0 | plus petit de 1 et 2 = 1 | 0 | 6 | finie : fin de la tâche 0 = 6 |
| 6 | `2` | 2 | plus petit de 2 et 2 = 2 | 0 | 8 | finie : fin de la tâche 2 = 8 |
| 8 | (vide) | | | | | terminé |

Heures de fin : tâche 0 à 6, tâche 1 à 3, tâche 2 à 8. La tâche 1, très courte, a fini tôt au lieu d'attendre derrière les longues : c'est l'intérêt du tourniquet.

Comme pour le jeu d'élimination, une file de `n` cases suffit (une tâche n'y est jamais deux fois). S'il n'y a aucune tâche (`n = 0`), il n'y a rien à faire. Et chaque `malloc` (la file, le tableau `reste`) a son `free` à la fin.

**À retenir :** tourniquet = tant que la file n'est pas vide, défiler une tâche, la faire travailler `tranche` (le plus petit entre `quantum` et son reste), avancer l'horloge, puis la renfiler si elle n'a pas fini, sinon noter `temps` comme heure de fin.

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
- i-ème depuis la tête : `tab[(start + i) % capacity]` ; i-ème depuis la fin : `tab[(start + size - 1 - i) % capacity]`. Parcours : `i` de 0 à `size - 1`.
- Version sûre : tester d'abord (`estPleine` / `estVide`), renvoyer 0 sans rien modifier. Enfiler sans test dans une file pleine écrase la tête.
- File qui grandit : nouveau tableau double, valeurs recopiées **dans l'ordre de la file**, `start = 0`.
- Liste chaînée : on enfile **derrière le dernier** (pointeur de fin), on défile **le premier** ; file vidée → `dernier = NULL`. Vider = défiler jusqu'au bout (avec `free`). Sans pointeur de fin, enfiler coûte O(N).
- Usages : tâches dans l'ordre d'arrivée (imprimante, serveur et *workers*), tour de rôle (élimination, tourniquet *round robin*), parcours en largeur.
