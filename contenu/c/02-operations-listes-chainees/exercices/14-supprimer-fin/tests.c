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
    Cell *l = aide_liste((int[]){1, 2, 3}, 3);
    Cell *premier = l;
    supprimerFin(&l);
    VERIFIER(aide_egale(l, (int[]){1, 2}, 2), "1 -> 2 -> 3 devient 1 -> 2");
    VERIFIER_EGAL(l, premier, "supprimer en fin ne change pas le premier maillon");

    supprimerFin(&l);
    VERIFIER(aide_egale(l, (int[]){1}, 1), "une deuxième suppression donne la liste 1");

    supprimerFin(&l);
    VERIFIER_EGAL(l, NULL, "supprimer le seul maillon donne une liste vide (NULL)");

    supprimerFin(&l);
    VERIFIER_EGAL(l, NULL, "supprimer dans une liste vide ne fait rien et ne plante pas");

    Cell *longue = aide_liste((int[]){4, 8, 15, 16, 23, 42}, 6);
    supprimerFin(&longue);
    supprimerFin(&longue);
    VERIFIER(aide_egale(longue, (int[]){4, 8, 15, 16}, 4), "deux suppressions sur 4 -> 8 -> 15 -> 16 -> 23 -> 42 donnent 4 -> 8 -> 15 -> 16");
    aide_liberer(longue);
    aide_liberer(l);
    VERIFIER_SANS_FUITE();
    return BILAN();
}
