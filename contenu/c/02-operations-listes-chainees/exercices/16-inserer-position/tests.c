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
    Cell *vide = NULL;
    insererPosition(&vide, 3, 7);
    VERIFIER(aide_egale(vide, (int[]){7}, 1), "dans une liste vide, insérer en position 3 donne la liste 7");
    aide_liberer(vide);

    Cell *a = aide_liste((int[]){10, 20, 30}, 3);
    insererPosition(&a, 0, 5);
    VERIFIER(aide_egale(a, (int[]){5, 10, 20, 30}, 4), "position 0 : 5 -> 10 -> 20 -> 30");
    aide_liberer(a);

    Cell *b = aide_liste((int[]){10, 20, 30}, 3);
    insererPosition(&b, 1, 15);
    VERIFIER(aide_egale(b, (int[]){10, 15, 20, 30}, 4), "position 1 : 10 -> 15 -> 20 -> 30");
    aide_liberer(b);

    Cell *c = aide_liste((int[]){10, 20, 30}, 3);
    insererPosition(&c, 2, 25);
    VERIFIER(aide_egale(c, (int[]){10, 20, 25, 30}, 4), "position 2 : 10 -> 20 -> 25 -> 30");
    aide_liberer(c);

    Cell *d = aide_liste((int[]){10, 20, 30}, 3);
    insererPosition(&d, 3, 35);
    VERIFIER(aide_egale(d, (int[]){10, 20, 30, 35}, 4), "position 3 (juste après le dernier) : 10 -> 20 -> 30 -> 35");
    aide_liberer(d);

    Cell *e = aide_liste((int[]){10, 20, 30}, 3);
    insererPosition(&e, 99, 40);
    VERIFIER(aide_egale(e, (int[]){10, 20, 30, 40}, 4), "position 99, plus grande que la taille : insertion à la fin");
    aide_liberer(e);

    Cell *f = aide_liste((int[]){10, 20, 30}, 3);
    insererPosition(&f, -2, 1);
    VERIFIER(aide_egale(f, (int[]){1, 10, 20, 30}, 4), "position négative : insertion au début");
    aide_liberer(f);

    VERIFIER_SANS_FUITE();
    return BILAN();
}
