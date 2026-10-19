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
    Cell *l = aide_liste((int[]){1, 2}, 2);
    Cell *deux = l->next;
    insererApres(l, 4);
    VERIFIER(aide_egale(l, (int[]){1, 4, 2}, 3), "insérer 4 après le premier maillon de 1 -> 2 donne 1 -> 4 -> 2");
    VERIFIER(l->next != NULL && l->next->next == deux, "le maillon 2 d'origine est toujours dans la liste, juste après 4");

    insererApres(deux, 9);
    VERIFIER(aide_egale(l, (int[]){1, 4, 2, 9}, 4), "insérer 9 après le dernier maillon donne 1 -> 4 -> 2 -> 9");

    insererApres(l, 0);
    int ok = aide_egale(l, (int[]){1, 0, 4, 2, 9}, 5);
    VERIFIER(ok, "insérer 0 après le premier maillon donne 1 -> 0 -> 4 -> 2 -> 9");
    if (ok) {
        aide_liberer(l);
    }
    VERIFIER_SANS_FUITE();
    return BILAN();
}
