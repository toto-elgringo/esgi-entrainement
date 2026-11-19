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
    int a[] = {8, 11, 4, 7, 6, 3, 5, 12, 1, 9, 10, 2};
    tri_peigne(a, 12);
    VERIFIER(aide_egal(a, (int[]){1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}, 12), "8 11 4 7 6 3 5 12 1 9 10 2 devient 1 2 … 12");

    int b[] = {3, -1, 3, 0, -1, 8};
    tri_peigne(b, 6);
    VERIFIER(aide_egal(b, (int[]){-1, -1, 0, 3, 3, 8}, 6), "3 -1 3 0 -1 8 devient -1 -1 0 3 3 8 (doublons et négatifs)");

    int c[] = {2, 1};
    tri_peigne(c, 2);
    VERIFIER(c[0] == 1 && c[1] == 2, "2 1 devient 1 2");

    int d[] = {42};
    tri_peigne(d, 1);
    VERIFIER_EGAL(d[0], 42, "un tableau d'une case ne change pas");

    tri_peigne(NULL, 0);
    VERIFIER(1, "un tableau vide ne fait pas planter le tri");

    size_t n = 1000;
    int *grand = malloc(n * sizeof(int));
    if (grand == NULL) {
        exit(EXIT_FAILURE);
    }
    int toujours_trie = 1;
    unsigned graine = 1515u;
    for (int essai = 0; essai < 20; essai++) {
        size_t taille = 10 + (size_t)essai * 47;
        for (size_t i = 0; i < taille; i++) {
            graine = graine * 1103515245u + 12345u;
            grand[i] = (int)((graine >> 8) % 100u);
        }
        tri_peigne(grand, taille);
        if (!aide_trie(grand, taille)) {
            toujours_trie = 0;
        }
    }
    VERIFIER(toujours_trie, "20 tableaux au hasard (de 10 à 903 cases) sont tous triés");

    for (size_t i = 0; i < n; i++) {
        grand[i] = (int)(n - i);
    }
    tri_peigne(grand, n);
    VERIFIER(aide_trie(grand, n), "1 000 valeurs triées à l'envers sont triées");
    free(grand);
    return BILAN();
}
