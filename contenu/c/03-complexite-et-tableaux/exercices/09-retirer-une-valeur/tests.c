#include <stdlib.h>

static int aide_egal(const int *a, const int *b, size_t n) {
    for (size_t i = 0; i < n; i++) {
        if (a[i] != b[i]) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int t1[] = {3, 0, 1, 0, 0, 2};
    size_t n1 = retirer(t1, 6, 0);
    VERIFIER_EGAL(n1, 3, "retirer les 0 de 3 0 1 0 0 2 laisse 3 cases");
    VERIFIER(aide_egal(t1, (int[]){3, 1, 2}, 3), "il reste 3 1 2, dans cet ordre");

    int t2[] = {1, 2, 3};
    VERIFIER_EGAL(retirer(t2, 3, 7), 3, "retirer une valeur absente ne change pas la taille");
    VERIFIER(aide_egal(t2, (int[]){1, 2, 3}, 3), "retirer une valeur absente ne change pas le tableau");

    int t3[] = {5, 5, 5, 5};
    VERIFIER_EGAL(retirer(t3, 4, 5), 0, "retirer 5 de 5 5 5 5 laisse un tableau vide");

    int t4[] = {4, 1, 4, 2, 4};
    size_t n4 = retirer(t4, 5, 4);
    VERIFIER(n4 == 2 && aide_egal(t4, (int[]){1, 2}, 2), "retirer les 4 de 4 1 4 2 4 laisse 1 2");

    VERIFIER_EGAL(retirer(NULL, 0, 1), 0, "un tableau vide reste vide");

    size_t n = 400000;
    int *grand = malloc(n * sizeof(int));
    if (grand == NULL) {
        exit(EXIT_FAILURE);
    }
    for (size_t i = 0; i < n; i++) {
        grand[i] = (i % 2 == 0) ? 0 : (int)i;
    }
    size_t reste = retirer(grand, n, 0);
    VERIFIER_EGAL(reste, 200000, "400 000 cases dont la moitié vaut 0 : il en reste 200 000, assez vite (O(n))");
    VERIFIER(grand[0] == 1 && grand[1] == 3 && grand[199999] == 399999, "les valeurs gardées sont dans l'ordre");
    free(grand);
    VERIFIER_SANS_FUITE();
    return BILAN();
}
