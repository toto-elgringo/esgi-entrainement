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
    Cell *a = aide_liste((int[]){5}, 1);
    VERIFIER(maximum(a) == 5, "le maximum de la liste 5 vaut 5");
    aide_liberer(a);

    Cell *b = aide_liste((int[]){3, 9, 2}, 3);
    VERIFIER(maximum(b) == 9, "le maximum de 3 -> 9 -> 2 vaut 9");
    aide_liberer(b);

    Cell *c = aide_liste((int[]){-4, -2, -8}, 3);
    VERIFIER(maximum(c) == -2, "le maximum de -4 -> -2 -> -8 vaut -2 (et pas 0)");
    aide_liberer(c);

    Cell *d = aide_liste((int[]){1, 2, 3, 4, 100}, 5);
    VERIFIER(maximum(d) == 100, "le maximum peut être dans le dernier maillon");
    aide_liberer(d);

    Cell *e = aide_liste((int[]){50, 2, 3}, 3);
    VERIFIER(maximum(e) == 50, "le maximum peut être dans le premier maillon");
    aide_liberer(e);
    return BILAN();
}
