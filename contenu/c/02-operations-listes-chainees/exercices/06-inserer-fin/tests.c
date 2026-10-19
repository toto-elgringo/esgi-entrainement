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
    insererFin(&l, 1);
    VERIFIER(aide_egale(l, (int[]){1}, 1), "insérer 1 dans une liste vide donne la liste 1");

    Cell *premier = l;
    insererFin(&l, 2);
    VERIFIER(aide_egale(l, (int[]){1, 2}, 2), "insérer 2 en fin donne 1 -> 2");
    VERIFIER(premier != NULL && l == premier, "insérer en fin ne change pas le premier maillon");

    insererFin(&l, 3);
    insererFin(&l, 4);
    int ok = aide_egale(l, (int[]){1, 2, 3, 4}, 4);
    VERIFIER(ok, "après avoir inséré 3 puis 4, la liste vaut 1 -> 2 -> 3 -> 4");
    if (ok) {
        aide_liberer(l);
    }
    VERIFIER_SANS_FUITE();
    return BILAN();
}
