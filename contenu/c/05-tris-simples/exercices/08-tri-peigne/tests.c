#include <stdlib.h>

static int aide_egal(const int *a, const int *b, size_t n) {
    for (size_t i = 0; i < n; i++) {
        if (a[i] != b[i]) {
            return 0;
        }
    }
    return 1;
}

static int aide_trie(const int *tab, size_t n) {
    for (size_t i = 0; i + 1 < n; i++) {
        if (tab[i] > tab[i + 1]) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int a[] = {8, 4, 1, 9, 3, 7, 2, 10, 6, 5};
    tri_peigne(a, 10);
    VERIFIER(aide_egal(a, (int[]){1, 2, 3, 4, 5, 6, 7, 8, 9, 10}, 10), "8 4 1 9 3 7 2 10 6 5 devient 1 2 … 10");

    int b[] = {3, -1, 3, 0, -1, 8};
    tri_peigne(b, 6);
    VERIFIER(aide_egal(b, (int[]){-1, -1, 0, 3, 3, 8}, 6), "3 -1 3 0 -1 8 devient -1 -1 0 3 3 8 (doublons et négatifs)");

    int c[] = {2, 3, 4, 5, 6, 7, 8, 1};
    tri_peigne(c, 8);
    VERIFIER(aide_egal(c, (int[]){1, 2, 3, 4, 5, 6, 7, 8}, 8), "la tortue 2 3 4 5 6 7 8 1 devient 1 2 … 8");

    int d[] = {2, 1};
    tri_peigne(d, 2);
    VERIFIER(d[0] == 1 && d[1] == 2, "2 1 devient 1 2");

    int e[] = {42};
    tri_peigne(e, 1);
    VERIFIER_EGAL(e[0], 42, "un tableau d'une case ne change pas");

    tri_peigne(NULL, 0);
    VERIFIER(1, "un tableau vide ne fait pas planter le tri");

    int f[] = {9, 8, 7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3};
    tri_peigne(f, 13);
    VERIFIER(aide_egal(f, (int[]){-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9}, 13), "9 8 … -3 (trié à l'envers) devient -3 -2 … 9");

    size_t n = 200000;
    int *grand = malloc(n * sizeof(int));
    if (grand == NULL) {
        exit(EXIT_FAILURE);
    }
    unsigned graine = 1789u;
    for (size_t i = 0; i < n; i++) {
        graine = graine * 1103515245u + 12345u;
        grand[i] = (int)(graine >> 8) % 1000000;
    }
    tri_peigne(grand, n);
    VERIFIER(aide_trie(grand, n), "200 000 valeurs au hasard sont triées, en moins de 10 secondes");
    free(grand);
    return BILAN();
}
