#include <stdlib.h>

static int aide_egal(const int *a, const int *b, size_t n) {
    if (a == NULL) {
        return 0;
    }
    for (size_t i = 0; i < n; i++) {
        if (a[i] != b[i]) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int a[] = {1, 4, 9};
    int b[] = {2, 3, 10, 11};
    int *r1 = fusionner(a, 3, b, 4);
    VERIFIER(aide_egal(r1, (int[]){1, 2, 3, 4, 9, 10, 11}, 7), "1 4 9 et 2 3 10 11 donnent 1 2 3 4 9 10 11");
    free(r1);

    int c[] = {2, 5};
    int d[] = {2};
    int *r2 = fusionner(c, 2, d, 1);
    VERIFIER(aide_egal(r2, (int[]){2, 2, 5}, 3), "2 5 et 2 donnent 2 2 5 (doublons gardés)");
    free(r2);

    int e[] = {-7, -1, 0};
    int *r3 = fusionner(e, 3, NULL, 0);
    VERIFIER(aide_egal(r3, (int[]){-7, -1, 0}, 3), "-7 -1 0 et un tableau vide donnent -7 -1 0");
    free(r3);

    int *r4 = fusionner(NULL, 0, b, 4);
    VERIFIER(aide_egal(r4, (int[]){2, 3, 10, 11}, 4), "un tableau vide et 2 3 10 11 donnent 2 3 10 11");
    free(r4);

    int f[] = {1, 2, 3};
    int g[] = {7, 8};
    int *r5 = fusionner(g, 2, f, 3);
    VERIFIER(aide_egal(r5, (int[]){1, 2, 3, 7, 8}, 5), "7 8 et 1 2 3 donnent 1 2 3 7 8");
    free(r5);

    VERIFIER_EGAL(fusionner(NULL, 0, NULL, 0), NULL, "deux tableaux vides donnent NULL");

    size_t n = 300000;
    int *x = malloc(n * sizeof(int));
    int *y = malloc(n * sizeof(int));
    if (x == NULL || y == NULL) {
        exit(EXIT_FAILURE);
    }
    for (size_t i = 0; i < n; i++) {
        x[i] = 2 * (int)i;
        y[i] = 2 * (int)i + 1;
    }
    int *grand = fusionner(x, n, y, n);
    int bon = grand != NULL;
    for (size_t k = 0; bon && k < 2 * n; k++) {
        if (grand[k] != (int)k) {
            bon = 0;
        }
    }
    VERIFIER(bon, "pairs et impairs (2 × 300 000 cases) donnent 0 1 2 3 … dans l'ordre, assez vite");
    free(grand);
    free(x);
    free(y);
    VERIFIER_SANS_FUITE();
    return BILAN();
}
