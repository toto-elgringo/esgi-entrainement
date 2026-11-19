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
    int t1[] = {1, 2, 3, 4, 5};
    rotation_gauche(t1, 5, 2);
    VERIFIER(aide_egal(t1, (int[]){3, 4, 5, 1, 2}, 5), "1 2 3 4 5 tourné de 2 crans donne 3 4 5 1 2");

    int t2[] = {1, 2, 3, 4, 5};
    rotation_gauche(t2, 5, 0);
    VERIFIER(aide_egal(t2, (int[]){1, 2, 3, 4, 5}, 5), "0 cran ne change rien");

    int t3[] = {1, 2, 3, 4, 5};
    rotation_gauche(t3, 5, 5);
    VERIFIER(aide_egal(t3, (int[]){1, 2, 3, 4, 5}, 5), "5 crans sur 5 cases : retour au départ");

    int t4[] = {1, 2, 3, 4, 5};
    rotation_gauche(t4, 5, 7);
    VERIFIER(aide_egal(t4, (int[]){3, 4, 5, 1, 2}, 5), "7 crans sur 5 cases = 2 crans");

    int t5[] = {1, 2, 3, 4, 5, 6};
    rotation_gauche(t5, 6, 1);
    VERIFIER(aide_egal(t5, (int[]){2, 3, 4, 5, 6, 1}, 6), "1 2 3 4 5 6 tourné d'un cran donne 2 3 4 5 6 1");

    int t6[] = {9};
    rotation_gauche(t6, 1, 3);
    VERIFIER_EGAL(t6[0], 9, "un tableau d'une case ne change pas");

    rotation_gauche(NULL, 0, 3);
    VERIFIER(1, "un tableau vide ne provoque pas de division par zéro");

    size_t n = 300000;
    int *grand = malloc(n * sizeof(int));
    if (grand == NULL) {
        exit(EXIT_FAILURE);
    }
    for (size_t i = 0; i < n; i++) {
        grand[i] = (int)i;
    }
    rotation_gauche(grand, n, 150000);
    VERIFIER(grand[0] == 150000 && grand[149999] == 299999 && grand[150000] == 0 && grand[n - 1] == 149999, "300 000 cases tournées de 150 000 crans, assez vite (O(n))");
    free(grand);
    VERIFIER_SANS_FUITE();
    return BILAN();
}
