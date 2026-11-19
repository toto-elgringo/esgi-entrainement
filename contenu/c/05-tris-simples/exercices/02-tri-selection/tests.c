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
    int a[] = {5, 2, 9, 1, 7};
    nb_echanges = 0;
    tri_selection(a, 5);
    VERIFIER(aide_egal(a, (int[]){1, 2, 5, 7, 9}, 5), "5 2 9 1 7 devient 1 2 5 7 9");
    VERIFIER_EGAL(nb_echanges, 3, "5 2 9 1 7 se trie en 3 échanges (le 2 est déjà à sa place)");

    int b[] = {3, -1, 3, 0, -1, 8};
    tri_selection(b, 6);
    VERIFIER(aide_egal(b, (int[]){-1, -1, 0, 3, 3, 8}, 6), "3 -1 3 0 -1 8 devient -1 -1 0 3 3 8 (doublons et négatifs)");

    int c[] = {42};
    nb_echanges = 0;
    tri_selection(c, 1);
    VERIFIER(c[0] == 42 && nb_echanges == 0, "un tableau d'une case ne change pas, sans échange");

    nb_echanges = 0;
    tri_selection(NULL, 0);
    VERIFIER_EGAL(nb_echanges, 0, "un tableau vide : aucun échange (et aucune case lue)");

    int d[] = {1, 2, 3, 4, 5, 6, 7, 8};
    nb_echanges = 0;
    tri_selection(d, 8);
    VERIFIER(aide_egal(d, (int[]){1, 2, 3, 4, 5, 6, 7, 8}, 8), "un tableau déjà trié reste trié");
    VERIFIER_EGAL(nb_echanges, 0, "un tableau déjà trié : aucun échange (ne pas échanger une case avec elle-même)");

    int e[] = {6, 5, 4, 3, 2, 1};
    nb_echanges = 0;
    tri_selection(e, 6);
    VERIFIER(aide_egal(e, (int[]){1, 2, 3, 4, 5, 6}, 6), "6 5 4 3 2 1 devient 1 2 3 4 5 6");
    VERIFIER(nb_echanges <= 5, "6 valeurs : au plus 5 échanges");

    size_t n = 2000;
    int *grand = malloc(n * sizeof(int));
    if (grand == NULL) {
        exit(EXIT_FAILURE);
    }
    unsigned graine = 12345u;
    for (size_t i = 0; i < n; i++) {
        graine = graine * 1103515245u + 12345u;
        grand[i] = (int)(graine % 1000u) - 500;
    }
    nb_echanges = 0;
    tri_selection(grand, n);
    VERIFIER(aide_trie(grand, n), "2 000 valeurs au hasard sont triées");
    VERIFIER(nb_echanges < n, "2 000 valeurs : au plus 1 999 échanges");
    free(grand);
    return BILAN();
}
