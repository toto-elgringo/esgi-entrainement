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
    insererTrie(&l, 5);
    VERIFIER(aide_egale(l, (int[]){5}, 1), "insérer 5 dans une liste vide donne la liste 5");
    insererTrie(&l, 2);
    VERIFIER(aide_egale(l, (int[]){2, 5}, 2), "insérer 2 le place au début : 2 -> 5");
    insererTrie(&l, 9);
    VERIFIER(aide_egale(l, (int[]){2, 5, 9}, 3), "insérer 9 le place à la fin : 2 -> 5 -> 9");
    insererTrie(&l, 7);
    VERIFIER(aide_egale(l, (int[]){2, 5, 7, 9}, 4), "insérer 7 le place au milieu : 2 -> 5 -> 7 -> 9");
    insererTrie(&l, 5);
    VERIFIER(aide_egale(l, (int[]){2, 5, 5, 7, 9}, 5), "insérer un doublon 5 donne 2 -> 5 -> 5 -> 7 -> 9");
    insererTrie(&l, -1);
    int ok = aide_egale(l, (int[]){-1, 2, 5, 5, 7, 9}, 6);
    VERIFIER(ok, "insérer -1 le place au début : -1 -> 2 -> 5 -> 5 -> 7 -> 9");
    if (ok) {
        aide_liberer(l);
    }

    int valeurs[] = {8, 3, 6, 1, 9, 2, 7};
    Cell *t = NULL;
    for (int i = 0; i < 7; i++) {
        insererTrie(&t, valeurs[i]);
    }
    ok = aide_egale(t, (int[]){1, 2, 3, 6, 7, 8, 9}, 7);
    VERIFIER(ok, "insérer 8, 3, 6, 1, 9, 2, 7 donne la liste triée 1 -> 2 -> 3 -> 6 -> 7 -> 8 -> 9");
    if (ok) {
        aide_liberer(t);
    }
    VERIFIER_SANS_FUITE();
    return BILAN();
}
