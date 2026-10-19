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
    Cell *l = aide_liste((int[]){1, 4, 2, 5}, 4);
    supprimerValeur(&l, 2);
    VERIFIER(aide_egale(l, (int[]){1, 4, 5}, 3), "supprimer 2 dans 1 -> 4 -> 2 -> 5 donne 1 -> 4 -> 5");

    supprimerValeur(&l, 1);
    VERIFIER(aide_egale(l, (int[]){4, 5}, 2), "supprimer 1 (le premier maillon) donne 4 -> 5");

    supprimerValeur(&l, 42);
    VERIFIER(aide_egale(l, (int[]){4, 5}, 2), "supprimer 42, absent, ne change rien");

    supprimerValeur(&l, 5);
    VERIFIER(aide_egale(l, (int[]){4}, 1), "supprimer 5 (le dernier maillon) donne la liste 4");

    supprimerValeur(&l, 4);
    VERIFIER(l == NULL, "supprimer le seul maillon donne une liste vide (NULL)");

    supprimerValeur(&l, 4);
    VERIFIER(l == NULL, "supprimer dans une liste vide ne fait rien et ne plante pas");
    aide_liberer(l);

    Cell *d = aide_liste((int[]){7, 3, 7}, 3);
    supprimerValeur(&d, 7);
    VERIFIER(aide_egale(d, (int[]){3, 7}, 2), "dans 7 -> 3 -> 7, seul le premier 7 est supprimé");
    Cell *e = aide_liste((int[]){3, 8, 8}, 3);
    supprimerValeur(&e, 8);
    VERIFIER(aide_egale(e, (int[]){3, 8}, 2), "dans 3 -> 8 -> 8, seul le premier 8 est supprimé");
    aide_liberer(d);
    aide_liberer(e);
    VERIFIER_SANS_FUITE();
    return BILAN();
}
