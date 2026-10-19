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
    VERIFIER(depuisTableau(NULL, 0) == NULL, "un tableau de 0 valeur donne une liste vide (NULL)");

    int un[] = {5};
    Cell *a = depuisTableau(un, 1);
    int ok = aide_egale(a, un, 1);
    VERIFIER(ok, "le tableau {5} donne la liste 5");
    if (ok) {
        aide_liberer(a);
    }

    int trois[] = {10, 20, 30};
    Cell *b = depuisTableau(trois, 3);
    ok = aide_egale(b, trois, 3);
    VERIFIER(ok, "le tableau {10, 20, 30} donne 10 -> 20 -> 30, dans le même ordre");
    if (ok) {
        aide_liberer(b);
    }

    int grand[200];
    for (int i = 0; i < 200; i++) {
        grand[i] = 200 - i;
    }
    Cell *c = depuisTableau(grand, 200);
    ok = aide_egale(c, grand, 200);
    VERIFIER(ok, "un tableau de 200 valeurs donne une liste de 200 maillons dans le même ordre");
    if (ok) {
        aide_liberer(c);
    }
    VERIFIER_SANS_FUITE();
    return BILAN();
}
