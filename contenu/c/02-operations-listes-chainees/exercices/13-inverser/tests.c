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
    VERIFIER(inverser(NULL) == NULL, "inverser une liste vide donne une liste vide");

    Cell *seul = aide_liste((int[]){7}, 1);
    Cell *r1 = inverser(seul);
    VERIFIER(r1 == seul && aide_egale(r1, (int[]){7}, 1), "inverser la liste 7 renvoie le même maillon");
    aide_liberer(r1);

    Cell *l = aide_liste((int[]){1, 2, 3, 4}, 4);
    Cell *premier = l;
    Cell *dernier = l->next->next->next;
    Cell *r = inverser(l);
    int ok = aide_egale(r, (int[]){4, 3, 2, 1}, 4);
    VERIFIER(ok, "1 -> 2 -> 3 -> 4 devient 4 -> 3 -> 2 -> 1");
    VERIFIER(r == dernier, "le nouveau premier maillon est l'ancien dernier (aucun maillon créé)");
    VERIFIER(premier->next == NULL, "l'ancien premier maillon est maintenant le dernier (next vaut NULL)");
    if (ok) {
        aide_liberer(r);
    }

    Cell *m = aide_liste((int[]){5, 6}, 2);
    Cell *r2 = inverser(inverser(m));
    ok = aide_egale(r2, (int[]){5, 6}, 2);
    VERIFIER(ok, "inverser deux fois redonne la liste de départ");
    if (ok) {
        aide_liberer(r2);
    }
    VERIFIER_SANS_FUITE();
    return BILAN();
}
