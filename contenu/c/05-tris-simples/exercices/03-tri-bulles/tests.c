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
    tri_bulles(a, 5);
    VERIFIER(aide_egal(a, (int[]){1, 2, 5, 7, 9}, 5), "5 2 9 1 7 devient 1 2 5 7 9");

    int b[] = {3, -1, 3, 0, -1, 8};
    tri_bulles(b, 6);
    VERIFIER(aide_egal(b, (int[]){-1, -1, 0, 3, 3, 8}, 6), "3 -1 3 0 -1 8 devient -1 -1 0 3 3 8 (doublons et négatifs)");

    int c[] = {2, 3, 4, 5, 6, 1};
    tri_bulles(c, 6);
    VERIFIER(aide_egal(c, (int[]){1, 2, 3, 4, 5, 6}, 6), "la tortue 2 3 4 5 6 1 devient 1 2 3 4 5 6");

    int d[] = {42};
    nb_comparaisons = 0;
    tri_bulles(d, 1);
    VERIFIER(d[0] == 42 && nb_comparaisons == 0, "un tableau d'une case : rien à comparer");

    nb_comparaisons = 0;
    tri_bulles(NULL, 0);
    VERIFIER_EGAL(nb_comparaisons, 0, "un tableau vide : aucune comparaison (et aucune case lue)");

    int e[] = {5, 4, 3, 2, 1};
    nb_comparaisons = 0;
    nb_echanges = 0;
    tri_bulles(e, 5);
    VERIFIER(aide_egal(e, (int[]){1, 2, 3, 4, 5}, 5), "5 4 3 2 1 devient 1 2 3 4 5");
    VERIFIER_EGAL(nb_echanges, 10, "5 4 3 2 1 : 10 échanges (chaque paire est inversée)");
    VERIFIER(nb_comparaisons <= 10, "5 4 3 2 1 : au plus 10 comparaisons (4 + 3 + 2 + 1, la zone raccourcit)");

    size_t n = 1000;
    int *trie = malloc(n * sizeof(int));
    if (trie == NULL) {
        exit(EXIT_FAILURE);
    }
    for (size_t i = 0; i < n; i++) {
        trie[i] = (int)i;
    }
    nb_comparaisons = 0;
    nb_echanges = 0;
    tri_bulles(trie, n);
    VERIFIER(aide_trie(trie, n) && nb_echanges == 0, "un tableau déjà trié de 1 000 cases reste trié, sans échange");
    VERIFIER_EGAL(nb_comparaisons, 999, "un tableau déjà trié de 1 000 cases : un seul passage, 999 comparaisons (arrêt anticipé)");

    unsigned graine = 2026u;
    for (size_t i = 0; i < n; i++) {
        graine = graine * 1103515245u + 12345u;
        trie[i] = (int)(graine % 500u) - 250;
    }
    tri_bulles(trie, n);
    VERIFIER(aide_trie(trie, n), "1 000 valeurs au hasard sont triées");
    free(trie);
    return BILAN();
}
