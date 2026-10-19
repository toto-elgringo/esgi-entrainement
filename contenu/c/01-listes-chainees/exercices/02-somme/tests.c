#include <stdlib.h>

static Cell *aide_liste(const int *valeurs, int n) {
    Cell *start = NULL;
    for (int i = n - 1; i >= 0; i--) {
        Cell *c = malloc(sizeof(Cell));
        if (c == NULL) {
            exit(EXIT_FAILURE);
        }
        c->value = valeurs[i];
        c->next = start;
        start = c;
    }
    return start;
}

static void aide_liberer(Cell *start) {
    while (start != NULL) {
        Cell *suivant = start->next;
        free(start);
        start = suivant;
    }
}

int main(void) {
    VERIFIER(somme(NULL) == 0, "la somme d'une liste vide vaut 0");

    Cell *un = aide_liste((int[]){5}, 1);
    VERIFIER(somme(un) == 5, "la somme de la liste 5 vaut 5");
    aide_liberer(un);

    Cell *quatre = aide_liste((int[]){1, 2, 3, 4}, 4);
    VERIFIER(somme(quatre) == 10, "la somme de 1 -> 2 -> 3 -> 4 vaut 10");
    VERIFIER(somme(quatre) == 10, "appeler somme deux fois donne le même résultat (la liste n'est pas modifiée)");
    aide_liberer(quatre);

    Cell *negatifs = aide_liste((int[]){-3, 3, -7}, 3);
    VERIFIER(somme(negatifs) == -7, "la somme de -3 -> 3 -> -7 vaut -7");
    aide_liberer(negatifs);
    return BILAN();
}
