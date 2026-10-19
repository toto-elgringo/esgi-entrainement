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
    VERIFIER(compter(NULL, 1) == 0, "dans une liste vide, chaque valeur apparaît 0 fois");

    Cell *l = aide_liste((int[]){1, 2, 1, 1, 3}, 5);
    VERIFIER(compter(l, 1) == 3, "dans 1 -> 2 -> 1 -> 1 -> 3, la valeur 1 apparaît 3 fois");
    VERIFIER(compter(l, 3) == 1, "la valeur 3 (dernier maillon) apparaît 1 fois");
    VERIFIER(compter(l, 2) == 1, "la valeur 2 apparaît 1 fois");
    VERIFIER(compter(l, 9) == 0, "la valeur 9 n'apparaît pas");
    aide_liberer(l);

    Cell *m = aide_liste((int[]){-5, -5, -5, -5}, 4);
    VERIFIER(compter(m, -5) == 4, "dans une liste de quatre -5, la valeur -5 apparaît 4 fois");
    aide_liberer(m);
    return BILAN();
}
