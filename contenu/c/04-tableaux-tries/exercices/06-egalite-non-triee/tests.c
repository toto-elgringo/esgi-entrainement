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
    int a[] = {1, 1, 2, 3, 4};
    int b[] = {3, 2, 1, 4, 1};
    VERIFIER_EGAL(egaux(a, b, 5), 1, "1 1 2 3 4 et 3 2 1 4 1 sont égaux");
    VERIFIER(aide_egal(a, (int[]){1, 1, 2, 3, 4}, 5), "le premier tableau n'a pas été modifié");
    VERIFIER(aide_egal(b, (int[]){3, 2, 1, 4, 1}, 5), "le second tableau n'a pas été modifié");

    int c[] = {1, 2, 2, 3};
    int d[] = {1, 2, 3, 3};
    VERIFIER_EGAL(egaux(c, d, 4), 0, "1 2 2 3 et 1 2 3 3 ne sont pas égaux (pas les mêmes quantités)");

    int e[] = {1, 4};
    int f[] = {2, 3};
    VERIFIER_EGAL(egaux(e, f, 2), 0, "1 4 et 2 3 ne sont pas égaux, même si leurs sommes sont égales");

    int g[] = {-3, 7, -3};
    int h[] = {7, -3, -3};
    VERIFIER_EGAL(egaux(g, h, 3), 1, "-3 7 -3 et 7 -3 -3 sont égaux");

    int k[] = {5};
    int m[] = {6};
    VERIFIER_EGAL(egaux(k, m, 1), 0, "5 et 6 ne sont pas égaux");

    VERIFIER_EGAL(egaux(NULL, NULL, 0), 1, "deux tableaux vides sont égaux");

    size_t n = 100000;
    int *x = malloc(n * sizeof(int));
    int *y = malloc(n * sizeof(int));
    if (x == NULL || y == NULL) {
        exit(EXIT_FAILURE);
    }
    for (size_t i = 0; i < n; i++) {
        x[i] = (int)((i * 7919) % 5000);
        y[n - 1 - i] = x[i];
    }
    VERIFIER_EGAL(egaux(x, y, n), 1, "deux tableaux de 100 000 cases, l'un à l'envers de l'autre, sont égaux (assez vite)");
    VERIFIER(x[0] == 0 && x[1] == 2919 && y[n - 1] == 0, "les grands tableaux n'ont pas été modifiés");
    y[n / 2] = -1;
    VERIFIER_EGAL(egaux(x, y, n), 0, "en changeant une seule case, ils ne sont plus égaux");
    free(x);
    free(y);
    VERIFIER_SANS_FUITE();
    return BILAN();
}
