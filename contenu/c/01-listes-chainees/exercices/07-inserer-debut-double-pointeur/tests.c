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
    Cell *l = NULL;
    insererDebut(&l, 4);
    VERIFIER(l != NULL, "après une insertion, la liste n'est plus vide");
    VERIFIER(aide_egale(l, (int[]){4}, 1), "insérer 4 dans une liste vide donne la liste 4");

    insererDebut(&l, 9);
    VERIFIER(l != NULL && l->value == 9, "insérer 9 met 9 en premier");
    VERIFIER(aide_egale(l, (int[]){9, 4}, 2), "la liste devient 9 -> 4");

    insererDebut(&l, 1);
    insererDebut(&l, 0);
    int ok = aide_egale(l, (int[]){0, 1, 9, 4}, 4);
    VERIFIER(ok, "après avoir inséré 1 puis 0, la liste vaut 0 -> 1 -> 9 -> 4");
    if (ok) {
        aide_liberer(l);
    }
    VERIFIER_SANS_FUITE();
    return BILAN();
}
