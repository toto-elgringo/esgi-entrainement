# Piles

## 1. Une structure de données abstraite

Jusqu'ici, on a rangé des valeurs dans des **tableaux** et des **listes chaînées** : on savait exactement comment elles étaient placées en mémoire. Une **pile** est différente : c'est une **structure de données abstraite**.

> [!info] Abstraite, ça veut dire quoi ?
> On décrit une structure abstraite par **les opérations qu'elle propose** et **leur comportement**, pas par la façon dont elle est construite. Peu importe ce qu'il y a dedans (un tableau, une liste chaînée...) : si les opérations se comportent comme prévu, c'est une pile.

## 2. Le principe : dernier entré, premier sorti

Une pile informatique marche comme une **pile d'assiettes** :

- on pose une assiette : elle va **au-dessus** de la pile ;
- on en reprend une : c'est **celle du dessus**, donc la dernière posée.

```text
empiler A    empiler B    empiler C    dépiler      dépiler
                            | C |
               | B |        | B |        | B |
  | A |        | A |        | A |        | A |        | A |
 -----        -----        -----        -----        -----
                                       (sort C)     (sort B)
```

Les valeurs ressortent dans **l'ordre inverse** de leur arrivée. En anglais : **Last In, First Out**, abrégé **LIFO** (« dernier entré, premier sorti »). Une pile se dit **stack**.

Le contraire, c'est la **file** (chapitre suivant) : **First In, First Out** (FIFO, « premier entré, premier sorti »), en anglais *queue*, comme la queue à un guichet. Pile : on ajoute et on retire **du même côté**. File : on ajoute d'un côté et on retire de l'autre.

**Exemple résolu : on part d'une pile vide et on fait, dans l'ordre, empiler 5, empiler 8, dépiler, empiler 2, empiler 6, dépiler, dépiler. Quelles valeurs sortent, et que reste-t-il ?**

On note la pile après chaque opération, le **fond à gauche** et le **sommet à droite** :

| Opération | Pile après (fond → sommet) | Sommet | Valeur sortie |
|---|---|---|---|
| départ | (vide) | aucun | |
| empiler 5 | `5` | 5 | |
| empiler 8 | `5 8` | 8 | |
| dépiler | `5` | 5 | **8** (le dernier posé) |
| empiler 2 | `5 2` | 2 | |
| empiler 6 | `5 2 6` | 6 | |
| dépiler | `5 2` | 2 | **6** |
| dépiler | `5` | 5 | **2** |

Sorties dans l'ordre : 8, 6, 2. Il reste `5` dans la pile : c'est la première valeur posée, elle est tout au fond et sortira en dernier.

**À retenir :** une pile, c'est « dernier posé, premier repris » (LIFO). Pour suivre une suite d'opérations, écris la pile après **chaque** ligne : dépiler retire toujours la valeur la plus à droite (le sommet).

> [!info] Stack overflow
> Le nom du site *Stack Overflow* vient d'une erreur bien connue : le **débordement de la pile d'exécution** (voir plus bas), souvent causé par une fonction récursive qui ne s'arrête jamais.

## 3. Les opérations

Une pile propose quatre opérations principales, plus une cinquième quand sa place est limitée :

| Opération | En anglais | Rôle |
|---|---|---|
| `estVide` | *isEmpty* | la pile est-elle vide ? |
| `empiler` | *push* | poser une valeur au-dessus |
| `depiler` | *pop* | retirer la valeur du dessus (et souvent la renvoyer) |
| `sommet` | *top*, *peek* | lire la valeur du dessus **sans** la retirer |
| `estPleine` | *isFull* | plus de place ? (seulement quand la capacité est fixe) |

On n'a **pas** accès aux valeurs du milieu : seulement au sommet. Toutes ces opérations sont en **O(1)** : leur coût ne dépend pas du nombre de valeurs dans la pile.

**Exemple résolu : `sommet` ou `depiler` ?** La pile contient `3 9 4` (fond à gauche, donc 4 au sommet).

| Appel | Valeur obtenue | Pile après |
|---|---|---|
| `sommet` | 4 | `3 9 4` (rien n'a bougé) |
| `sommet` | 4 | `3 9 4` (encore 4 : lire ne retire rien) |
| `depiler` | 4 | `3 9` |
| `sommet` | 9 | `3 9` |
| `estVide` | 0 (faux) | `3 9` |

`sommet` regarde, `depiler` regarde **et** retire. Appeler `sommet` dix fois de suite donne dix fois la même valeur.

> [!info] Et chercher une valeur ?
> « Est-ce que 3 est dans la pile ? » n'est **pas** une opération de pile. Si on le fait quand même (en parcourant tout le tableau ou toute la liste), il faut regarder les valeurs une par une : jusqu'à N valeurs pour une pile de N valeurs, donc **O(N)**. Les valeurs ne sont pas triées, on ne peut pas faire mieux. Seul le **sommet** est en O(1).

**À retenir :** une pile ne donne accès qu'au sommet, en O(1). `sommet` lit sans retirer, `depiler` retire. Tout ce qui demande de regarder le reste de la pile coûte O(N).

> [!info] Selon les versions
> Dans certaines bibliothèques, `depiler` renvoie la valeur retirée ; dans d'autres, il la retire seulement et il faut appeler `sommet` avant. On trouve aussi souvent une opération `taille`. L'important est d'avoir les quatre opérations de base.

## 4. À quoi ça sert ?

- **La pile d'exécution** : quand `main` appelle `f`, l'état de `main` (où il en était, ses variables) est **mis de côté sur une pile**, puis `f` s'exécute. Si `f` appelle `printf`, `f` est mise en pause à son tour. Quand `printf` se termine, on **dépile** et on reprend `f` exactement où elle s'était arrêtée, puis `main`. La dernière fonction appelée est toujours la première à finir : c'est une pile.
- **Le bouton « Retour » d'un navigateur** : chaque page visitée est empilée ; « Retour » dépile et ramène à la page d'avant. Quand il ne reste qu'une page, le bouton est grisé.
- **« Annuler » (Ctrl+Z)** dans un traitement de texte : chaque état du document est empilé ; annuler dépile et revient à l'état précédent.
- **Transformer une fonction récursive en boucle** : une fonction récursive utilise la pile d'exécution sans le dire ; on peut la remplacer par une boucle qui gère **sa propre pile**.
- **Vérifier des parenthèses**, **calculer une expression** en notation polonaise inverse, **inverser un texte** (voir l'exemple juste en dessous, puis les sections 8 et 9).

**Exemple résolu : la pile d'exécution.** `main` appelle `carre(3)`, et `carre` appelle `printf`.

| Moment | Pile d'exécution (fond → sommet) | Qui travaille ? |
|---|---|---|
| début du programme | `main` | `main` |
| `main` appelle `carre(3)` | `main carre` | `carre` (main attend) |
| `carre` appelle `printf` | `main carre printf` | `printf` |
| `printf` a fini | `main carre` | `carre` reprend après son `printf` |
| `carre` renvoie 9 | `main` | `main` reprend avec la valeur 9 |
| `main` renvoie 0 | (vide) | le programme est fini |

Chaque appel **empile** un « cadre » (les variables de la fonction et l'endroit où reprendre) ; chaque fin de fonction le **dépile**. Une fonction récursive qui ne s'arrête jamais (par exemple `int f(int n) { return f(n + 1); }`) empile des cadres sans jamais en retirer : la pile d'exécution, qui a une taille limitée (souvent quelques mégaoctets), **déborde** et le programme plante. C'est le *stack overflow*. Une récursion correcte mais très profonde (un million d'appels imbriqués) peut aussi la faire déborder.

> [!info] Pile ou file ?
> Pour reconnaître une pile dans un problème, demande-toi **qui sort en premier**. Le dernier arrivé (page précédente, dernière action à annuler, dernière fonction appelée) : c'est une **pile**. Le premier arrivé (clients d'un guichet, documents envoyés à l'imprimante, tâches distribuées dans l'ordre) : c'est une **file**.

**À retenir :** dès que « le plus récent doit être traité en premier », c'est une pile. Le cas le plus important est la pile d'exécution : un appel = un cadre empilé, une fin de fonction = un cadre dépilé.

### Exemple : inverser une suite de valeurs

Une pile rend les valeurs **dans l'ordre inverse** de leur arrivée. Pour inverser une suite, il suffit donc de tout empiler, puis de tout dépiler.

```c
#include <stdio.h>

int main(void) {
    int chiffres[] = {1, 2, 3, 4};
    int pile[4];
    int size = 0;
    for (int i = 0; i < 4; i++) {
        pile[size] = chiffres[i];
        size++;
    }
    while (size > 0) {
        size--;
        printf("%d ", pile[size]);
    }
    printf("\n");
    char lettre = 'Z';
    int code = lettre;
    char retour = (char)code;
    printf("'%c' est rangé comme l'entier %d, et redevient '%c'\n", lettre, code, retour);
    return 0;
}
```

**Exemple résolu : inverser le texte `Oui!`.**

| Étape | Caractère | Pile après (fond → sommet) | Résultat écrit |
|---|---|---|---|
| empiler | `O` | `O` | |
| empiler | `u` | `O u` | |
| empiler | `i` | `O u i` | |
| empiler | `!` | `O u i !` | |
| (on lit `'\0'` : fin du texte, on ne l'empile pas) | | | |
| dépiler | `!` | `O u i` | `!` |
| dépiler | `i` | `O u` | `!i` |
| dépiler | `u` | `O` | `!iu` |
| dépiler | `O` | (vide) | `!iuO` |
| ajouter `'\0'` | | | `!iuO` terminé |

Deux détails :

- **Un caractère est un petit entier** : `'Z'` vaut 90. On peut donc le ranger dans une pile d'`int`, puis le remettre dans un `char` (`char retour = (char)code;`).
- **Le `'\0'` final** : un texte en C se termine par le caractère `'\0'`. On ne l'empile pas (c'est la condition d'arrêt de la première boucle), mais il faut l'**écrire à la fin** du résultat, juste après le dernier caractère dépilé. Sans lui, `printf` continuerait à lire la mémoire au-delà. Pour un texte vide, rien n'est empilé, et le résultat est juste `'\0'`.

**À retenir :** inverser = tout empiler, puis dépiler jusqu'à ce que la pile soit vide, en écrivant dans l'ordre de sortie ; termine un texte par `'\0'`.

## 5. Une pile dans un tableau

La première façon de construire une pile : un tableau de taille fixe, la **capacité**, et un entier qui compte les valeurs rangées.

```c
typedef struct {
    int *tab;
    int size;
    int capacity;
} Stack;
```

| Champ | Sens |
|---|---|
| `tab` | le tableau où sont rangées les valeurs, le **fond** de la pile en `tab[0]` |
| `size` | le nombre de valeurs dans la pile |
| `capacity` | le nombre de cases du tableau : au plus `capacity` valeurs |

L'astuce : `size` est aussi **l'indice de la première case libre**, juste au-dessus du sommet. Le sommet est donc en `tab[size - 1]`.

```text
capacity = 5, size = 3

indice :   0    1    2    3    4
         +----+----+----+----+----+
tab :    |  7 |  2 |  9 |    |    |
         +----+----+----+----+----+
          fond      sommet  ^
                            size = 3 : prochaine case libre
```

### Vide et pleine

```c
int estVide(const Stack *s) {
    return s->size == 0;
}

int estPleine(const Stack *s) {
    return s->size >= s->capacity;
}
```

Une comparaison en C vaut déjà `1` (vraie) ou `0` (fausse) : pas besoin d'écrire `if (...) return 1; return 0;`. Écrire `>=` plutôt que `==` pour `estPleine` ne coûte rien et protège si `size` a dépassé par erreur.

**Exemple résolu : une pile de capacité 4.**

| `size` | `capacity` | `size == 0` ? | `size >= capacity` ? | `estVide` | `estPleine` |
|---|---|---|---|---|---|
| 0 | 4 | oui | 0 ≥ 4 : non | 1 | 0 |
| 1 | 4 | non | 1 ≥ 4 : non | 0 | 0 |
| 4 | 4 | non | 4 ≥ 4 : oui | 0 | 1 |
| 5 (bug) | 4 | non | 5 ≥ 4 : oui | 0 | 1 |

La dernière ligne montre l'intérêt du `>=` : avec `==`, une pile qui a dépassé par erreur (5 valeurs pour 4 cases) serait déclarée « pas pleine », et on continuerait à écrire hors du tableau. Une pile peut aussi n'être **ni vide ni pleine** (ligne `size = 1`).

**À retenir :** vide ⇔ `size == 0` ; pleine ⇔ `size >= capacity`. Les deux se lisent seulement dans `size` et `capacity`, jamais dans le contenu du tableau.

### Empiler, dépiler, lire le sommet

```c
void empiler(Stack *s, int valeur) {
    s->tab[s->size] = valeur;
    s->size++;
}

int depiler(Stack *s) {
    s->size--;
    return s->tab[s->size];
}

int sommet(const Stack *s) {
    return s->tab[s->size - 1];
}
```

- **Empiler** : on écrit dans la première case libre (`tab[size]`), puis on augmente `size`.
- **Dépiler** : on diminue `size`, et la valeur à renvoyer est justement dans `tab[size]`.
- **Sommet** : on lit `tab[size - 1]` sans rien changer.

**Exemple résolu : capacité 3, on fait empiler 6, empiler 2, sommet, dépiler, empiler 9.** On suit le tableau et `size` après chaque appel (`.` = case libre, `^` = sommet) :

```text
                  tab[0] tab[1] tab[2]   size   renvoie
départ              .      .      .       0
empiler 6           6^     .      .       1       (écrit tab[0], puis size 0 -> 1)
empiler 2           6      2^     .       2       (écrit tab[1], puis size 1 -> 2)
sommet              6      2^     .       2      2 (lit tab[size - 1] = tab[1])
dépiler             6^    (2)     .       1      2 (size 2 -> 1, puis lit tab[1])
empiler 9           6      9^     .       2       (écrit tab[1] : le vieux 2 est écrasé)
```

Le `(2)` après le dépilement rappelle que la valeur est **toujours là** dans la case, mais qu'elle ne compte plus : `size` vaut 1, donc seule `tab[0]` fait partie de la pile. Au `empiler 9` suivant, la case `tab[1]` est réécrite.

**À retenir :** empiler = « écrire dans `tab[size]`, puis `size++` » ; dépiler = « `size--`, puis lire `tab[size]` » ; sommet = « lire `tab[size - 1]` ». L'ordre des deux étapes est l'inverse entre empiler et dépiler.

> [!tip] La version courte
> `s->tab[s->size++] = valeur;` et `return s->tab[--s->size];` font la même chose en une ligne. `size++` utilise l'ancienne valeur **puis** augmente ; `--size` diminue **puis** utilise la nouvelle. Si tu hésites, écris les deux lignes séparées : c'est plus lisible.

> [!info] Dépiler n'efface rien
> Après `depiler`, la valeur est **toujours** dans la case `tab[size]`. Ce n'est pas grave : la case est considérée comme libre et sera écrasée au prochain `empiler`. Une case libre contient toujours *quelque chose* (un ancien contenu, un 0, n'importe quoi), seul `size` dit ce qui compte.

### Les garde-fous

Les trois fonctions ci-dessus supposent qu'on les appelle **au bon moment** :

| Appel interdit | Ce qui se passe en C |
|---|---|
| `empiler` dans une pile **pleine** | on écrit dans `tab[capacity]`, **en dehors** du tableau : une autre variable est écrasée, ou le programme plante plus loin |
| `depiler` ou `sommet` sur une pile **vide** | `size` devient `-1`, on lit `tab[-1]`, une case qui n'existe pas |

Deux façons de faire :

1. **Une précondition** : la documentation dit « ne pas appeler sur une pile vide », et c'est à l'appelant de vérifier `estVide` avant. C'est le choix des exercices du cours.
2. **Un code de retour** : la fonction vérifie elle-même et dit si elle a réussi. La valeur dépilée passe alors par un pointeur.

```c
#include <stdio.h>

typedef struct {
    int *tab;
    int size;
    int capacity;
} Stack;

int estVide(const Stack *s) {
    return s->size == 0;
}

int estPleine(const Stack *s) {
    return s->size >= s->capacity;
}

int empilerSur(Stack *s, int valeur) {
    if (estPleine(s)) {
        return 0;
    }
    s->tab[s->size] = valeur;
    s->size++;
    return 1;
}

int depilerSur(Stack *s, int *valeur) {
    if (estVide(s)) {
        return 0;
    }
    s->size--;
    *valeur = s->tab[s->size];
    return 1;
}

int main(void) {
    int cases[2];
    Stack pile = {cases, 0, 2};
    for (int v = 1; v <= 3; v++) {
        int ok = empilerSur(&pile, v * 10);
        printf("empiler %d : %s (size %d)\n", v * 10, ok ? "réussi" : "refusé", pile.size);
    }
    int lu = -1;
    for (int essai = 1; essai <= 3; essai++) {
        int ok = depilerSur(&pile, &lu);
        printf("dépiler : %s, lu = %d (size %d)\n", ok ? "réussi" : "refusé", lu, pile.size);
    }
    return 0;
}
```

`int cases[2]; Stack pile = {cases, 0, 2};` fabrique une petite pile sans `malloc` : `tab` pointe vers le tableau `cases`, `size` vaut 0 et `capacity` vaut 2 (les valeurs entre accolades remplissent les champs dans l'ordre de la structure). À l'appel, on passe l'**adresse** d'une variable pour recevoir la valeur : `int v; if (depilerSur(&pile, &v)) { ... }`.

**Exemple résolu : ce que fait ce programme, ligne par ligne.**

| Appel | Test au début | Renvoie | Pile après | `lu` |
|---|---|---|---|---|
| `empilerSur(10)` | pleine ? 0 ≥ 2 : non | 1 | `10` | -1 |
| `empilerSur(20)` | pleine ? 1 ≥ 2 : non | 1 | `10 20` | -1 |
| `empilerSur(30)` | pleine ? 2 ≥ 2 : **oui** | 0 | `10 20` (rien n'a changé) | -1 |
| `depilerSur(&lu)` | vide ? non | 1 | `10` | 20 |
| `depilerSur(&lu)` | vide ? non | 1 | (vide) | 10 |
| `depilerSur(&lu)` | vide ? **oui** | 0 | (vide) | 10 (pas touché) |

Quand l'opération est impossible, la fonction s'arrête **dès le test**, avant toute modification : ni `size`, ni le tableau, ni `*valeur` ne changent. C'est pour ça que `lu` garde son ancienne valeur 10 au dernier essai.

> [!warning] Tester, puis modifier
> Le test doit être la **première** chose faite. Si on écrit `s->size--;` avant `if (estVide(s))`, il est trop tard : `size` vaut déjà -1. De même, ne range rien dans `*valeur` quand on renvoie 0.

**À retenir :** une fonction « sûre » commence par vérifier si l'opération est possible ; sinon elle renvoie 0 **sans rien modifier**. Sinon, elle fait le travail normal et renvoie 1.

### Afficher depuis le fond ou depuis le dessus

Afficher n'est pas une opération de pile « pure » (on regarde tout le tableau), mais c'est bien utile pour vérifier son code.

```c
void afficherDepuisFond(const Stack *s) {
    for (int i = 0; i < s->size; i++) {
        printf("%d ", s->tab[i]);
    }
    printf("\n");
}

void afficherDepuisDessus(const Stack *s) {
    for (int i = s->size - 1; i >= 0; i--) {
        printf("%d ", s->tab[i]);
    }
    printf("\n");
}
```

On s'arrête à `size`, pas à `capacity` : les cases au-delà sont libres. Ici `size` est un `int`, donc `i >= 0` fonctionne pour descendre (avec un `size_t`, ce serait une boucle infinie, voir le chapitre 3).

**Exemple résolu : tableau de 4 cases `5 7 0 0`, avec `size = 2`** (la pile est `5 7`, les deux 0 sont des cases libres).

| Fonction | Valeurs de `i` | Cases lues | Affichage |
|---|---|---|---|
| `afficherDepuisFond` | 0, 1 (arrêt car 2 < 2 est faux) | `tab[0]`, `tab[1]` | `5 7 ` puis retour à la ligne |
| `afficherDepuisDessus` | 1, 0 (arrêt car -1 ≥ 0 est faux) | `tab[1]`, `tab[0]` | `7 5 ` puis retour à la ligne |

Les deux 0 ne s'affichent jamais. Si on avait écrit `i < s->capacity`, on aurait affiché `5 7 0 0` : deux valeurs qui ne sont pas dans la pile.

Pour une pile **vide** (`size = 0`), aucune des deux boucles ne tourne (0 < 0 est faux, -1 ≥ 0 aussi) : seul le `\n` s'affiche, donc une ligne vide. Si on veut afficher un message comme `(vide)`, on teste `if (s->size == 0)` **avant** la boucle, on affiche le message (avec son `\n`) et on s'arrête là (`return;`).

**À retenir :** depuis le fond, `i` monte de 0 à `size - 1` ; depuis le dessus, `i` descend de `size - 1` à 0. Jamais jusqu'à `capacity`, et toujours un `\n` à la fin de la ligne.

> [!warning] Le retour à la ligne oublié
> « Afficher sur une seule ligne » veut dire : toutes les valeurs, **puis** un `\n`. Sans lui, l'affichage suivant se colle derrière (`1 2 3 3 2 1` au lieu de deux lignes), et une correction automatique compte la réponse fausse.

### Créer et libérer une pile

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *tab;
    int size;
    int capacity;
} Stack;

Stack *creerPile(int capacite) {
    Stack *s = malloc(sizeof(Stack));
    if (s == NULL) {
        exit(EXIT_FAILURE);
    }
    s->tab = malloc(capacite * sizeof(int));
    if (s->tab == NULL) {
        exit(EXIT_FAILURE);
    }
    s->size = 0;
    s->capacity = capacite;
    return s;
}

void libererPile(Stack *s) {
    free(s->tab);
    free(s);
}

int main(void) {
    Stack *pile = creerPile(4);
    for (int i = 1; i <= 3; i++) {
        pile->tab[pile->size] = i * 10;
        pile->size++;
    }
    while (pile->size > 0) {
        pile->size--;
        printf("je dépile %d\n", pile->tab[pile->size]);
    }
    libererPile(pile);
    return 0;
}
```

Deux `malloc` (la structure et son tableau), donc deux `free`, **dans cet ordre** : d'abord le tableau, puis la structure (après `free(s)`, on n'a plus le droit de lire `s->tab`).

**Exemple résolu : la mémoire de ce programme.**

| Étape | Ce qui est réservé | Pile |
|---|---|---|
| `creerPile(4)` | 1er `malloc` : la structure (`tab`, `size`, `capacity`) ; 2e `malloc` : 4 cases d'`int` | vide, `size = 0`, `capacity = 4` |
| boucle `for` | rien de nouveau : on écrit dans les cases déjà réservées | `10 20 30`, `size = 3` |
| boucle `while` | rien : dépiler ne rend pas de mémoire | affiche 30, puis 20, puis 10 ; `size = 0` |
| `libererPile` | `free(s->tab)` rend les 4 cases, puis `free(s)` rend la structure | n'existe plus |

Si on inversait les deux `free`, `free(s)` rendrait la structure, puis `s->tab` irait lire dans une mémoire rendue : c'est interdit, et le résultat est imprévisible.

**À retenir :** autant de `free` que de `malloc`, en rendant d'abord ce qui est **à l'intérieur** (le tableau), puis le contenant (la structure).

> [!tip] Une pile qui grandit
> Si la pile est pleine, on peut aussi **doubler sa capacité** avec `realloc` au lieu de refuser la valeur, comme un tableau dynamique (voir juste en dessous). L'empilement reste en O(1) amorti.

### Agrandir le tableau avec `realloc`

`realloc(ancien, nouvelleTaille)` demande un bloc de mémoire de `nouvelleTaille` octets, **recopie** dedans le contenu de l'ancien bloc, rend l'ancien bloc, et renvoie l'adresse du nouveau. S'il n'y a plus de mémoire, il renvoie `NULL` et **ne touche pas** à l'ancien bloc.

Voici le principe sur un simple tableau dynamique de notes, qui commence avec une seule case et double quand il est plein :

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int capacite = 1;
    int nombre = 0;
    int *notes = malloc(capacite * sizeof(int));
    if (notes == NULL) {
        exit(EXIT_FAILURE);
    }
    for (int v = 1; v <= 6; v++) {
        if (nombre == capacite) {
            int *plusGrand = realloc(notes, 2 * capacite * sizeof(int));
            if (plusGrand == NULL) {
                free(notes);
                exit(EXIT_FAILURE);
            }
            notes = plusGrand;
            capacite = 2 * capacite;
            printf("agrandi : %d cases\n", capacite);
        }
        notes[nombre] = v * v;
        nombre++;
    }
    for (int i = 0; i < nombre; i++) {
        printf("%d ", notes[i]);
    }
    printf("\n");
    free(notes);
    return 0;
}
```

**Exemple résolu : l'évolution du tableau.**

| On ajoute | `nombre == capacite` avant ? | Agrandissement | `capacite` après | `nombre` après |
|---|---|---|---|---|
| 1 | 0 == 1 : non | non | 1 | 1 |
| 4 | 1 == 1 : oui | 1 → 2 cases (1 valeur recopiée) | 2 | 2 |
| 9 | 2 == 2 : oui | 2 → 4 cases (2 valeurs recopiées) | 4 | 3 |
| 16 | 3 == 4 : non | non | 4 | 4 |
| 25 | 4 == 4 : oui | 4 → 8 cases (4 valeurs recopiées) | 8 | 5 |
| 36 | 5 == 8 : non | non | 8 | 6 |

Trois points à ne pas rater :

1. **Agrandir avant d'écrire** : le test `nombre == capacite` se fait avant `notes[nombre] = ...`, sinon on écrit déjà hors du tableau.
2. **Le résultat de `realloc` va dans une variable à part** (`plusGrand`). Si on écrivait `notes = realloc(notes, ...)` et que `realloc` renvoyait `NULL`, on perdrait la seule adresse de l'ancien tableau : impossible de le libérer, c'est une fuite. On teste `NULL` d'abord, et seulement ensuite `notes = plusGrand;`.
3. **La taille est en octets** : `2 * capacite * sizeof(int)`, pas `2 * capacite`. Et on n'oublie pas de mettre à jour `capacite`.

Pour une pile, c'est exactement la même chose avec `s->tab`, `s->size` et `s->capacity`.

> [!info] Pourquoi doubler, et pas ajouter une case ?
> Chaque agrandissement recopie toutes les valeurs. En ajoutant **une** case à chaque fois, on recopierait 1, puis 2, puis 3... valeurs : pour N empilements, environ N²/2 recopies. En **doublant**, on recopie 1, 2, 4, 8... valeurs, ce qui fait en tout moins de 2N recopies pour N empilements. En moyenne, chaque empilement coûte donc une petite quantité fixe : on dit **O(1) amorti** (« amorti » = en moyenne sur une longue suite d'opérations, même si un empilement de temps en temps coûte O(N)).

**À retenir :** pile pleine → `realloc` vers une capacité **double**, résultat dans une variable à part, test de `NULL`, puis mise à jour du pointeur et de la capacité, **avant** d'écrire la valeur.

## 6. Une pile dans une liste chaînée

Deuxième façon : une liste chaînée dont le **premier maillon est le sommet**. On a déjà écrit toutes les opérations au chapitre 2 :

| Pile | Liste chaînée |
|---|---|
| pile vide | `start == NULL` |
| empiler | insérer **en début** |
| dépiler | supprimer **en début** (et `free` le maillon) |
| sommet | `start->value` |

```text
empiler 1, puis 2, puis 3 :

start --> [3|*] --> [2|*] --> [1|*] --> NULL
          sommet                 fond
```

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct cell {
    int value;
    struct cell *next;
} Cell;

void empilerListe(Cell **sommet, int valeur) {
    Cell *c = malloc(sizeof(Cell));
    if (c == NULL) {
        exit(EXIT_FAILURE);
    }
    c->value = valeur;
    c->next = *sommet;
    *sommet = c;
}

int depilerListe(Cell **sommet) {
    Cell *ancien = *sommet;
    int valeur = ancien->value;
    *sommet = ancien->next;
    free(ancien);
    return valeur;
}

int main(void) {
    Cell *pile = NULL;
    empilerListe(&pile, 1);
    empilerListe(&pile, 2);
    empilerListe(&pile, 3);
    while (pile != NULL) {
        printf("%d ", depilerListe(&pile));
    }
    printf("\n");
    return 0;
}
```

Le sommet change à chaque opération : les fonctions reçoivent l'**adresse** de la variable (`Cell **sommet`). Comme au chapitre 2, on lit la valeur et le suivant **avant** le `free`.

**Exemple résolu : la pile contient seulement 7 (`pile --> [7|*] --> NULL`). On empile 4, puis on dépile.**

`empilerListe(&pile, 4)` :

| Ligne | Effet | Schéma |
|---|---|---|
| `c = malloc(...)` | un nouveau maillon, encore vide | `c --> [?|?]` |
| `c->value = 4` | on y range la valeur | `c --> [4|?]` |
| `c->next = *sommet` | il pointe vers l'ancien sommet | `c --> [4|*] --> [7|*] --> NULL` |
| `*sommet = c` | la variable `pile` du `main` devient le nouveau maillon | `pile --> [4|*] --> [7|*] --> NULL` |

`depilerListe(&pile)` :

| Ligne | Effet | Schéma |
|---|---|---|
| `ancien = *sommet` | on garde l'adresse du maillon du dessus | `ancien --> [4|*]` |
| `valeur = ancien->value` | on lit 4 **avant** de libérer | `valeur = 4` |
| `*sommet = ancien->next` | le sommet descend d'un cran | `pile --> [7|*] --> NULL` |
| `free(ancien)` | le maillon 4 est rendu | (le maillon 4 n'existe plus) |
| `return valeur` | renvoie 4 | |

Si on faisait `free(ancien)` **avant** de lire `ancien->value` et `ancien->next`, on lirait dans un maillon rendu : interdit.

Les deux autres opérations s'écrivent en une ligne chacune :

- **Pile vide ?** `return sommet == NULL;` : une pile chaînée vide, c'est un pointeur `NULL`, il n'y a aucun maillon.
- **Vider la pile** : on dépile tant qu'il reste un maillon, `while (*sommet != NULL) depilerListe(sommet);`. Comme `depilerListe` fait déjà le `free` de chaque maillon, tout est rendu, et à la fin `*sommet` vaut `NULL` (la pile est de nouveau vide et réutilisable). Dans cette boucle, `sommet` est déjà un `Cell **` : on le passe tel quel, sans `&`.

**À retenir :** pile chaînée = insertion et suppression **en tête**. Empiler : `malloc`, `next` vers l'ancien sommet, puis le sommet devient le nouveau maillon. Dépiler : garder le maillon, lire sa valeur, avancer le sommet, puis `free`. Un `malloc` par empilement, donc un `free` par dépilement.

> [!info] Pourquoi le début, et pas la fin ?
> Insérer et supprimer en **début** de liste coûtent O(1). En fin, la suppression demande de trouver l'avant-dernier : O(N). En mettant le sommet au début, toutes les opérations de la pile restent en O(1).

## 7. Tableau ou liste chaînée ?

| | Tableau | Liste chaînée |
|---|---|---|
| Opérations | O(1) | O(1) |
| Capacité | fixe (ou doublée avec `realloc`) | illimitée (tant qu'il reste de la mémoire) |
| `estPleine` | nécessaire | inutile |
| Mémoire | une case par valeur, cases collées | une valeur **et** un pointeur par maillon, un `malloc` à chaque empilement |
| Pièges | débordement si on oublie de tester `estPleine` | fuite si on oublie le `free` en dépilant |
| Lire la i-ème valeur depuis le fond (hors opérations de pile) | O(1) : `tab[i]` directement | O(N) : il faut suivre les `next` depuis le sommet jusqu'au fond |
| Chercher une valeur (hors opérations de pile) | O(N) | O(N) |

**Exemple résolu : lire la 2e valeur depuis le fond d'une pile `8 1 6 3` (fond à gauche).**

- **Tableau** : le fond est en `tab[0]`, donc la 2e valeur depuis le fond est `tab[1]`, qui vaut 1. Une seule case lue, quelle que soit la taille de la pile.
- **Liste chaînée** : le premier maillon est le **sommet** (3). On suit `next` : 3, puis 6, puis 1. Il a fallu passer par trois maillons ; avec une pile de N valeurs, la valeur proche du fond demande jusqu'à N pas.

Les opérations de **pile** (empiler, dépiler, sommet, vide) coûtent O(1) dans les deux cas. La différence n'apparaît que pour ce qui sort du rôle d'une pile.

**À retenir :** pour les opérations de pile, tableau et liste chaînée se valent (O(1)). Le tableau a une capacité à surveiller, la liste demande un `free` à chaque dépilement.

## 8. Application : la calculette en notation polonaise inverse

En **notation polonaise inverse** (NPI), on écrit l'opérateur **après** ses deux nombres : `3 4 +` veut dire `3 + 4`. Il n'y a plus besoin de parenthèses : `(1 + 2) × 4` s'écrit `1 2 + 4 x`, et `1 + 2 × 4` s'écrit `1 2 4 x +`.

Une pile suffit pour calculer :

- un **chiffre** : on l'empile ;
- un **opérateur** : on dépile **deux** nombres, on calcule, on empile le résultat ;
- à la fin, il doit rester **exactement un** nombre dans la pile : c'est le résultat.

Calcul de `5 1 2 + x 3 -` :

| Lu | Action | Pile (fond à gauche) |
|---|---|---|
| `5` | empiler | `5` |
| `1` | empiler | `5 1` |
| `2` | empiler | `5 1 2` |
| `+` | dépiler 2 puis 1, empiler 1 + 2 | `5 3` |
| `x` | dépiler 3 puis 5, empiler 5 × 3 | `15` |
| `3` | empiler | `15 3` |
| `-` | dépiler 3 puis 15, empiler 15 − 3 | `12` |
| fin | un seul nombre : le résultat | `12` |

Chaque opérateur prend les **deux derniers** nombres arrivés : c'est exactement le sommet et la valeur juste en dessous, d'où la pile.

> [!warning] L'ordre des deux nombres
> Le **premier** nombre dépilé est celui de **droite**. Pour `8 3 -`, on dépile d'abord `3`, puis `8`, et on calcule `8 - 3 = 5`, pas `3 - 8`. Pour `+` et `x`, l'ordre ne change rien ; pour `-` (et `/`), il est essentiel.

**À retenir :** chiffre → empiler ; opérateur → dépiler `droite`, puis `gauche`, empiler `gauche op droite` ; à la fin, exactement un nombre dans la pile.

Les erreurs possibles dans le calcul :

| Cas | Exemple | Message |
|---|---|---|
| un opérateur arrive alors qu'il y a **moins de deux** nombres dans la pile | `1 +` | pas assez de nombres |
| la pile est **vide** à la fin | (calcul vide) | pas assez de nombres |
| il reste **plus d'un** nombre à la fin | `1 2 3 +` | trop de nombres |
| un caractère n'est ni un espace, ni un chiffre, ni un opérateur connu | `6 3 %` | symbole inconnu (on s'arrête tout de suite) |

**Exemple résolu : trois calculs qui échouent.**

`9 x` :

| Lu | Pile avant | Action |
|---|---|---|
| `9` | (vide) | empiler : pile `9` |
| `x` | `9` (1 seul nombre) | il en faut 2 : **pas assez de nombres**, on s'arrête |

`2 7 3 -` :

| Lu | Pile avant | Action |
|---|---|---|
| `2`, `7`, `3` | | empiler : pile `2 7 3` |
| `-` | `2 7 3` | dépiler 3 (droite) puis 7 (gauche), empiler 7 − 3 = 4 : pile `2 4` |
| fin | `2 4` | deux nombres restent : **trop de nombres** (un opérateur manque) |

`6 3 %` : on empile 6 et 3, puis on lit `%`, qui n'est ni un espace, ni un chiffre, ni `+`, `-`, `x` : **symbole inconnu**. On ne regarde même pas la pile.

Les trois tests de la **fin** (pile vide, un seul nombre, plus d'un) s'excluent : un seul des trois doit s'appliquer, d'où une chaîne `if / else if / else`.

```c
#include <stdio.h>

void calculer(const char *calcul) {
    int cases[64];
    int size = 0;
    for (int i = 0; calcul[i] != '\0'; i++) {
        char c = calcul[i];
        if (c == ' ') {
            continue;
        }
        if (c >= '0' && c <= '9') {
            cases[size++] = c - '0';
            continue;
        }
        if (size < 2) {
            printf("PAS ASSEZ DE NOMBRES\n");
            return;
        }
        int droite = cases[--size];
        int gauche = cases[--size];
        if (c == '+') {
            cases[size++] = gauche + droite;
        } else if (c == '-') {
            cases[size++] = gauche - droite;
        } else {
            cases[size++] = gauche * droite;
        }
    }
    if (size == 0) {
        printf("PAS ASSEZ DE NOMBRES\n");
    } else if (size == 1) {
        printf("%d\n", cases[0]);
    } else {
        printf("TROP DE NOMBRES\n");
    }
}

int main(void) {
    calculer("5 1 2 + x 3 -");
    calculer("1 +");
    calculer("1 2 3 +");
    return 0;
}
```

> [!warning] Le `else` qui avale tout
> Dans ce code, tout caractère qui n'est ni un espace, ni un chiffre, ni `+`, ni `-` tombe dans le dernier `else` et est traité comme `x` : `6 3 /` donnerait 18 sans prévenir. Pour refuser les symboles inconnus, on vérifie le caractère **avant** de toucher à la pile : s'il n'est pas l'un des trois opérateurs (`c != '+' && c != '-' && c != 'x'`), on affiche le message et on quitte la fonction avec `return;`. Ce test doit passer avant `if (size < 2)`, sinon `/` lu sur une pile trop petite afficherait « pas assez de nombres » au lieu de « symbole inconnu ».

`c - '0'` transforme le **caractère** `'7'` en **nombre** `7` : les chiffres se suivent dans la table des caractères, `'7' - '0'` vaut donc 7.

### Des nombres de plusieurs chiffres

La calculette ci-dessus ne lit qu'**un chiffre à la fois** : `12` serait lu comme 1 puis 2. Pour lire un nombre entier, on avale les chiffres tant qu'il y en a, en faisant à chaque fois `nombre = nombre * 10 + chiffre` (on « décale » ce qu'on a déjà d'un rang vers la gauche, puis on ajoute le nouveau chiffre).

```c
#include <stdio.h>

int main(void) {
    const char *texte = "12 305  7";
    int i = 0;
    while (texte[i] != '\0') {
        if (texte[i] >= '0' && texte[i] <= '9') {
            int nombre = 0;
            while (texte[i] >= '0' && texte[i] <= '9') {
                nombre = nombre * 10 + (texte[i] - '0');
                i++;
            }
            printf("nombre lu : %d\n", nombre);
        } else {
            i++;
        }
    }
    return 0;
}
```

**Exemple résolu : lire `305`.**

| Caractère lu | Chiffre | Calcul | `nombre` |
|---|---|---|---|
| (départ) | | | 0 |
| `'3'` | 3 | 0 × 10 + 3 | 3 |
| `'0'` | 0 | 3 × 10 + 0 | 30 |
| `'5'` | 5 | 30 × 10 + 5 | 305 |
| `' '` | pas un chiffre | la petite boucle s'arrête | 305 |

Ici `i` est avancé **à la main** dans une boucle `while`. Avec un `for (...; i++)`, attention : quand la petite boucle s'arrête, `i` est déjà sur le caractère qui **suit** le nombre ; le `i++` du `for` le sauterait. Si ce caractère était un opérateur collé au nombre, on le raterait. Ici les deux espaces entre `305` et `7` ne gênent pas : chaque espace est simplement passé par le `else`.

**À retenir :** pour lire un nombre : `nombre = 0`, puis tant que le caractère est un chiffre, `nombre = nombre * 10 + (c - '0')` et on avance. Avance `i` toi-même pour ne sauter aucun caractère.

### Renvoyer un code au lieu d'afficher

Une fonction qui **affiche** son résultat ne peut pas être réutilisée par une autre partie du programme. Mieux : elle **renvoie un code** qui dit comment ça s'est passé, et range le résultat dans une variable de l'appelant grâce à un pointeur (comme `depilerSur`). Pour donner des noms lisibles aux codes, on utilise un `enum` : `enum { A, B, C };` crée trois constantes entières, `A` vaut 0, `B` vaut 1, `C` vaut 2.

```c
#include <stdio.h>

enum {
    DIVISION_OK,
    DIVISION_PAR_ZERO
};

int diviser(int a, int b, int *quotient) {
    if (b == 0) {
        return DIVISION_PAR_ZERO;
    }
    *quotient = a / b;
    return DIVISION_OK;
}

int main(void) {
    int q = -1;
    if (diviser(17, 5, &q) == DIVISION_OK) {
        printf("17 / 5 = %d\n", q);
    }
    if (diviser(8, 0, &q) == DIVISION_PAR_ZERO) {
        printf("8 / 0 : impossible, q vaut toujours %d\n", q);
    }
    return 0;
}
```

**Exemple résolu :**

| Appel | Test | Renvoie | `q` après |
|---|---|---|---|
| `diviser(17, 5, &q)` | 5 == 0 ? non | `DIVISION_OK` (0) | 3 (17 / 5 en entiers) |
| `diviser(8, 0, &q)` | 0 == 0 ? oui | `DIVISION_PAR_ZERO` (1) | 3 (pas modifié) |

Comme pour les garde-fous, en cas d'erreur on renvoie le code **sans toucher** à `*quotient`. La valeur n'est écrite qu'au moment où l'on sait que tout a réussi, juste avant `return DIVISION_OK;`. Une calculette qui renvoie un code fonctionne pareil : `return` d'un code d'erreur dès qu'un problème apparaît, et `*resultat = ...` seulement dans le cas réussi.

**À retenir :** un `enum` donne des noms aux codes de retour ; la fonction renvoie le code et ne remplit la variable pointée **que** si tout a réussi.

> [!warning] Tester `size` après l'avoir modifié
> Si on écrit `if (size == 1) printf("%d\n", depiler(...));` puis, juste après, un **nouveau** `if (size == 0)`, ce second test voit la pile **après** le `depiler` : elle est vide, et on affiche le résultat **et** « pas assez de nombres ». Les cas de la fin s'excluent : il faut des `else if`, ou tester avant de dépiler.

## 9. Application : les parenthèses équilibrées

Une expression comme `(a[i] + {b})` est **bien parenthésée** si chaque ouvrante a sa fermante **du même type**, dans le bon ordre. `([)]` ne l'est pas, `(()` non plus.

- une **ouvrante** `(`, `[`, `{` : on l'empile ;
- une **fermante** : la pile ne doit pas être vide, et le sommet doit être l'ouvrante qui correspond. On dépile ;
- à la fin, la pile doit être **vide** (sinon une ouvrante n'a jamais été fermée).

C'est le principe qu'utilise un éditeur de code pour colorer la parenthèse qui correspond à celle sous le curseur, ou un compilateur pour signaler « parenthèse manquante ».

Pourquoi une pile ? Une fermante doit refermer l'ouvrante **la plus récente** encore ouverte : la dernière ouverte est la première fermée, c'est du LIFO.

**Exemple résolu : `{x(y)[z]}`** (les lettres sont ignorées, elles ne changent pas la pile).

| Lu | Type | Test | Pile après (fond → sommet) |
|---|---|---|---|
| `{` | ouvrante | | `{` |
| `x` | autre | ignoré | `{` |
| `(` | ouvrante | | `{ (` |
| `y` | autre | ignoré | `{ (` |
| `)` | fermante | sommet `(` = ouvrante de `)` : oui, on dépile | `{` |
| `[` | ouvrante | | `{ [` |
| `z` | autre | ignoré | `{ [` |
| `]` | fermante | sommet `[` = ouvrante de `]` : oui, on dépile | `{` |
| `}` | fermante | sommet `{` = ouvrante de `}` : oui, on dépile | (vide) |
| fin | | pile vide ? oui | **bien équilibré** |

Les trois façons d'échouer, chacune sur un exemple :

| Texte | Ce qui se passe | Raison de l'échec |
|---|---|---|
| `{(})` | `{`, `(` empilés ; on lit `}` alors que le sommet est `(` | mauvais **type** : `}` ne ferme pas `(` |
| `[[]` | `[`, `[` empilés ; `]` dépile un `[` ; fin avec `[` dans la pile | une ouvrante **jamais fermée** : la pile n'est pas vide à la fin |
| `]` | on lit `]` alors que la pile est vide | une fermante **sans ouvrante** : il n'y a rien à dépiler |

Le dernier cas est le piège classique : si on lit le sommet d'une pile vide sans tester `estVide`, on lit `tab[-1]`. Sur une fermante, on teste donc **d'abord** si la pile est vide, **puis** si le sommet correspond. Pour savoir « quelle ouvrante va avec cette fermante », une petite fonction aide : elle renvoie `'('` pour `')'`, `'['` pour `']'`, `'{'` pour `'}'`. Et un texte sans aucune parenthèse (ou vide) est bien équilibré : rien n'est empilé, la pile est vide à la fin.

**À retenir :** ouvrante → empiler ; fermante → échec si la pile est vide ou si le sommet n'est pas l'ouvrante du même type, sinon dépiler ; à la fin, bien équilibré **seulement si** la pile est vide.

## 10. Pièges

> [!warning] Empiler sans vérifier la place
> `s->tab[s->size] = valeur;` sans tester `estPleine` écrit en dehors du tableau quand la pile est pleine. Rien ne prévient en C : le programme continue avec une mémoire abîmée.

> [!warning] Dépiler une pile vide
> `size` passe à `-1` et on lit `tab[-1]`. Toujours tester `estVide` avant (ou utiliser une version avec code de retour).

> [!warning] `size` n'est pas l'indice du sommet
> Le sommet est en `tab[size - 1]`. `tab[size]` est la première case **libre** : sa valeur n'a pas de sens.

> [!warning] Un `free` oublié dans la pile chaînée
> Dépiler sans `free` le maillon retiré provoque une fuite mémoire, invisible tant que le programme tourne peu de temps.

## À retenir

- Pile = structure **abstraite** **LIFO** (dernier entré, premier sorti), en anglais **stack**.
- Opérations : `estVide`, `empiler` (*push*), `depiler` (*pop*), `sommet` (*top*), et `estPleine` si la capacité est fixe. Toutes en **O(1)**.
- Dans un tableau : `size` = nombre de valeurs = première case libre ; sommet en `tab[size - 1]`. Empiler : `tab[size++] = v` ; dépiler : `tab[--size]`.
- Dans une liste chaînée : le sommet est le **premier maillon** ; empiler = insérer en début, dépiler = supprimer en début (avec `free`).
- Garde-fous : jamais d'empilement dans une pile pleine, jamais de dépilement d'une pile vide. Version sûre : tester d'abord, renvoyer 0 sans rien modifier.
- Pile qui grandit : `realloc` vers une capacité double (résultat dans une variable à part, test de `NULL`), O(1) amorti. Libérer : `free(s->tab)` puis `free(s)`.
- Usages : pile d'exécution, bouton Retour, Annuler, récursif → itératif, inverser, parenthèses, calculette NPI.
- Parenthèses : ouvrante → empiler ; fermante → pile non vide et sommet du même type, puis dépiler ; à la fin, pile vide.
- NPI : chiffre → empiler ; opérateur → dépiler **droite** puis **gauche**, calculer, empiler ; à la fin, exactement un nombre. Nombre à plusieurs chiffres : `nombre = nombre * 10 + (c - '0')`.
