#include <stdlib.h>

static int aide_egale(Cell *start, const int *valeurs, int n) {
    for (int i = 0; i < n; i++) {
        if (start == NULL || start->value != valeurs[i]) {
            return 0;
        }
        start = start->next;
    }
    return start == NULL;
}

static void aide_liberer(Cell *start) {
    while (start != NULL) {
        Cell *suivant = start->next;
        free(start);
        start = suivant;
    }
}

int main(void) {
    Cell *l = insererDebut(NULL, 4);
    VERIFIER(l != NULL && l->value == 4, "insérer 4 dans une liste vide donne un maillon de valeur 4");
    VERIFIER(l != NULL && l->next == NULL, "dans une liste d'un seul maillon, next vaut NULL (et pas le maillon lui-même)");
    if (aide_egale(l, (int[]){4}, 1)) {
        aide_liberer(l);
    }

    Cell *m = NULL;
    m = insererDebut(m, 3);
    m = insererDebut(m, 2);
    m = insererDebut(m, 1);
    int ok = aide_egale(m, (int[]){1, 2, 3}, 3);
    VERIFIER(ok, "insérer 3, puis 2, puis 1 en début donne 1 -> 2 -> 3");
    if (ok) {
        aide_liberer(m);
    }
    VERIFIER_SANS_FUITE();
    return BILAN();
}
