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
    int a[] = {5, 2, 9, 1, 7, -100};
    tri_pair_impair(a, 5);
    VERIFIER(aide_egal(a, (int[]){1, 2, 5, 7, 9}, 5), "5 2 9 1 7 devient 1 2 5 7 9");
    VERIFIER_EGAL(a[5], -100, "la case qui suit le tableau n'est ni lue ni modifiée");

    int b[] = {4, 3, 2, 1, -50};
    tri_pair_impair(b, 4);
    VERIFIER(aide_egal(b, (int[]){1, 2, 3, 4, -50}, 5), "4 3 2 1 (4 cases) devient 1 2 3 4, la case suivante reste -50");

    int c[] = {3, -1, 3, 0, -1, 8, 2};
    tri_pair_impair(c, 7);
    VERIFIER(aide_egal(c, (int[]){-1, -1, 0, 2, 3, 3, 8}, 7), "3 -1 3 0 -1 8 2 devient -1 -1 0 2 3 3 8");

    int d[] = {2, 1};
    tri_pair_impair(d, 2);
    VERIFIER(d[0] == 1 && d[1] == 2, "2 1 devient 1 2");

    int e[] = {42, -7};
    nb_comparaisons = 0;
    tri_pair_impair(e, 1);
    VERIFIER(e[0] == 42 && e[1] == -7 && nb_comparaisons == 0, "un tableau d'une case : aucune comparaison");

    nb_comparaisons = 0;
    tri_pair_impair(NULL, 0);
    VERIFIER_EGAL(nb_comparaisons, 0, "un tableau vide : aucune comparaison");

    size_t n = 1000;
    int *grand = malloc(n * sizeof(int));
    if (grand == NULL) {
        exit(EXIT_FAILURE);
    }
    for (size_t i = 0; i < n; i++) {
        grand[i] = (int)i - 500;
    }
    nb_comparaisons = 0;
    tri_pair_impair(grand, n);
    VERIFIER(aide_trie(grand, n), "un tableau déjà trié de 1 000 cases reste trié");
    VERIFIER(nb_comparaisons <= 999, "un tableau déjà trié de 1 000 cases : un seul tour, au plus 999 comparaisons");

    unsigned graine = 99u;
    for (size_t i = 0; i < n; i++) {
        graine = graine * 1103515245u + 12345u;
        grand[i] = (int)(graine % 3000u);
    }
    tri_pair_impair(grand, n);
    VERIFIER(aide_trie(grand, n), "1 000 valeurs au hasard sont triées");
    free(grand);
    return BILAN();
}
