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

> [!info] Selon les versions
> Dans certaines bibliothèques, `depiler` renvoie la valeur retirée ; dans d'autres, il la retire seulement et il faut appeler `sommet` avant. On trouve aussi souvent une opération `taille`. L'important est d'avoir les quatre opérations de base.

## 4. À quoi ça sert ?

- **La pile d'exécution** : quand `main` appelle `f`, l'état de `main` (où il en était, ses variables) est **mis de côté sur une pile**, puis `f` s'exécute. Si `f` appelle `printf`, `f` est mise en pause à son tour. Quand `printf` se termine, on **dépile** et on reprend `f` exactement où elle s'était arrêtée, puis `main`. La dernière fonction appelée est toujours la première à finir : c'est une pile.
- **Le bouton « Retour » d'un navigateur** : chaque page visitée est empilée ; « Retour » dépile et ramène à la page d'avant. Quand il ne reste qu'une page, le bouton est grisé.
- **« Annuler » (Ctrl+Z)** dans un traitement de texte : chaque état du document est empilé ; annuler dépile et revient à l'état précédent.
- **Transformer une fonction récursive en boucle** : une fonction récursive utilise la pile d'exécution sans le dire ; on peut la remplacer par une boucle qui gère **sa propre pile**.
- **Vérifier des parenthèses**, **calculer une expression** en notation polonaise inverse (sections 8 et 9).

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
```

À l'appel : `int v; if (depilerSur(&pile, &v)) { ... }`.

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

> [!tip] Une pile qui grandit
> Si la pile est pleine, on peut aussi **doubler sa capacité** avec `realloc` au lieu de refuser la valeur, comme un tableau dynamique (chapitre 1). L'empilement reste en O(1) amorti.

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

> [!warning] L'ordre des deux nombres
> Le **premier** nombre dépilé est celui de **droite**. Pour `8 3 -`, on dépile d'abord `3`, puis `8`, et on calcule `8 - 3 = 5`, pas `3 - 8`. Pour `+` et `x`, l'ordre ne change rien ; pour `-` (et `/`), il est essentiel.

Deux erreurs possibles dans le calcul :

| Cas | Exemple | Message |
|---|---|---|
| un opérateur arrive alors qu'il y a **moins de deux** nombres dans la pile | `1 +` | pas assez de nombres |
| la pile est **vide** à la fin | (calcul vide) | pas assez de nombres |
| il reste **plus d'un** nombre à la fin | `1 2 3 +` | trop de nombres |

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

`c - '0'` transforme le **caractère** `'7'` en **nombre** `7` : les chiffres se suivent dans la table des caractères, `'7' - '0'` vaut donc 7.

> [!warning] Tester `size` après l'avoir modifié
> Si on écrit `if (size == 1) printf("%d\n", depiler(...));` puis, juste après, un **nouveau** `if (size == 0)`, ce second test voit la pile **après** le `depiler` : elle est vide, et on affiche le résultat **et** « pas assez de nombres ». Les cas de la fin s'excluent : il faut des `else if`, ou tester avant de dépiler.

## 9. Application : les parenthèses équilibrées

Une expression comme `(a[i] + {b})` est **bien parenthésée** si chaque ouvrante a sa fermante **du même type**, dans le bon ordre. `([)]` ne l'est pas, `(()` non plus.

- une **ouvrante** `(`, `[`, `{` : on l'empile ;
- une **fermante** : la pile ne doit pas être vide, et le sommet doit être l'ouvrante qui correspond. On dépile ;
- à la fin, la pile doit être **vide** (sinon une ouvrante n'a jamais été fermée).

C'est le principe qu'utilise un éditeur de code pour colorer la parenthèse qui correspond à celle sous le curseur, ou un compilateur pour signaler « parenthèse manquante ».

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
- Garde-fous : jamais d'empilement dans une pile pleine, jamais de dépilement d'une pile vide.
- Usages : pile d'exécution, bouton Retour, Annuler, récursif → itératif, parenthèses, calculette NPI.
- NPI : chiffre → empiler ; opérateur → dépiler **droite** puis **gauche**, calculer, empiler ; à la fin, exactement un nombre.
