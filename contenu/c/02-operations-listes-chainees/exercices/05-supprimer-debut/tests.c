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
    Cell *deuxieme = l->next;
    supprimerDebut(&l);
    VERIFIER(l == deuxieme, "après la suppression, la liste commence à l'ancien deuxième maillon");
    VERIFIER(aide_egale(l, (int[]){2, 3}, 2), "1 -> 2 -> 3 devient 2 -> 3");

    supprimerDebut(&l);
    VERIFIER(aide_egale(l, (int[]){3}, 1), "une deuxième suppression donne la liste 3");
    supprimerDebut(&l);
    VERIFIER(l == NULL, "après trois suppressions, la liste est vide (NULL)");

    supprimerDebut(&l);
    VERIFIER(l == NULL, "supprimer dans une liste vide ne fait rien et ne plante pas");
    aide_liberer(l);
    VERIFIER_SANS_FUITE();
    return BILAN();
}
