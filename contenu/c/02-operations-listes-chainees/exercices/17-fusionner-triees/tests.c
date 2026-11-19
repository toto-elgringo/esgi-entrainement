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

static int aide_maillons_connus(Cell *r, Cell **connus, int n) {
    for (Cell *cur = r; cur != NULL; cur = cur->next) {
        int trouve = 0;
        for (int i = 0; i < n; i++) {
            if (connus[i] == cur) {
                trouve = 1;
            }
        }
        if (!trouve) {
            return 0;
        }
    }
    return 1;
}

static int aide_ranger(Cell *l, Cell **connus, int depart) {
    for (Cell *cur = l; cur != NULL; cur = cur->next) {
        connus[depart++] = cur;
    }
    return depart;
}

int main(void) {
    VERIFIER_EGAL(fusionner(NULL, NULL), NULL, "fusionner deux listes vides donne une liste vide");

    Cell *connus[16];
    Cell *a = aide_liste((int[]){1, 4, 6}, 3);
    Cell *b = aide_liste((int[]){2, 3, 8}, 3);
    int n = aide_ranger(a, connus, 0);
    n = aide_ranger(b, connus, n);
    Cell *r = fusionner(a, b);
    VERIFIER(aide_egale(r, (int[]){1, 2, 3, 4, 6, 8}, 6), "1 -> 4 -> 6 fusionné avec 2 -> 3 -> 8 donne 1 -> 2 -> 3 -> 4 -> 6 -> 8");
    VERIFIER(aide_maillons_connus(r, connus, n), "le résultat réutilise les maillons de départ (aucun maillon créé)");
    aide_liberer(r);

    Cell *seule = aide_liste((int[]){5, 7}, 2);
    Cell *r2 = fusionner(NULL, seule);
    VERIFIER(aide_egale(r2, (int[]){5, 7}, 2), "vide fusionné avec 5 -> 7 donne 5 -> 7");
    aide_liberer(r2);

    Cell *seule2 = aide_liste((int[]){5, 7}, 2);
    Cell *r3 = fusionner(seule2, NULL);
    VERIFIER(aide_egale(r3, (int[]){5, 7}, 2), "5 -> 7 fusionné avec vide donne 5 -> 7");
    aide_liberer(r3);

    Cell *c = aide_liste((int[]){2, 2}, 2);
    Cell *d = aide_liste((int[]){2}, 1);
    Cell *r4 = fusionner(c, d);
    VERIFIER(aide_egale(r4, (int[]){2, 2, 2}, 3), "les doublons sont gardés : 2 -> 2 et 2 donnent 2 -> 2 -> 2");
    aide_liberer(r4);

    Cell *e = aide_liste((int[]){1, 2, 3}, 3);
    Cell *f = aide_liste((int[]){10, 20, 30, 40}, 4);
    Cell *r5 = fusionner(f, e);
    VERIFIER(aide_egale(r5, (int[]){1, 2, 3, 10, 20, 30, 40}, 7), "10 -> 20 -> 30 -> 40 fusionné avec 1 -> 2 -> 3 donne 1 -> 2 -> 3 -> 10 -> 20 -> 30 -> 40");
    aide_liberer(r5);

    VERIFIER_SANS_FUITE();
    return BILAN();
}
