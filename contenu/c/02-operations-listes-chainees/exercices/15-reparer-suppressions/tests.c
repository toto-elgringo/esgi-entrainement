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
    VERIFIER_EGAL(supprimerPremier(NULL), NULL, "supprimerPremier sur une liste vide renvoie NULL");
    VERIFIER_EGAL(supprimerDernier(NULL), NULL, "supprimerDernier sur une liste vide renvoie NULL");

    Cell *l = aide_liste((int[]){1, 2, 3, 4}, 4);
    l = supprimerPremier(l);
    VERIFIER(aide_egale(l, (int[]){2, 3, 4}, 3), "supprimerPremier : 1 -> 2 -> 3 -> 4 devient 2 -> 3 -> 4");
    l = supprimerDernier(l);
    VERIFIER(aide_egale(l, (int[]){2, 3}, 2), "supprimerDernier : 2 -> 3 -> 4 devient 2 -> 3");
    l = supprimerDernier(l);
    l = supprimerPremier(l);
    VERIFIER_EGAL(l, NULL, "après deux suppressions de plus, la liste est vide");

    Cell *seul = aide_liste((int[]){9}, 1);
    seul = supprimerDernier(seul);
    VERIFIER_EGAL(seul, NULL, "supprimerDernier sur une liste d'un seul maillon renvoie NULL");

    aide_liberer(l);
    aide_liberer(seul);
    VERIFIER_SANS_FUITE();
    return BILAN();
}
