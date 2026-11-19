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
    tri_insertion(a, 5);
    VERIFIER(aide_egal(a, (int[]){1, 2, 5, 7, 9}, 5), "5 2 9 1 7 devient 1 2 5 7 9");

    int b[] = {3, -1, 3, 0, -1, 8};
    tri_insertion(b, 6);
    VERIFIER(aide_egal(b, (int[]){-1, -1, 0, 3, 3, 8}, 6), "3 -1 3 0 -1 8 devient -1 -1 0 3 3 8 (doublons et négatifs)");

    int c[] = {2, 3, 4, 5, 6, 1};
    tri_insertion(c, 6);
    VERIFIER(aide_egal(c, (int[]){1, 2, 3, 4, 5, 6}, 6), "2 3 4 5 6 1 devient 1 2 3 4 5 6 (le 1 traverse toute la partie triée)");

    int d[] = {42};
    nb_comparaisons = 0;
    tri_insertion(d, 1);
    VERIFIER(d[0] == 42 && nb_comparaisons == 0, "un tableau d'une case : rien à insérer");

    nb_comparaisons = 0;
    tri_insertion(NULL, 0);
    VERIFIER_EGAL(nb_comparaisons, 0, "un tableau vide : aucune comparaison (et aucune case lue)");

    int e[] = {6, 5, 4, 3, 2, 1};
    nb_comparaisons = 0;
    tri_insertion(e, 6);
    VERIFIER(aide_egal(e, (int[]){1, 2, 3, 4, 5, 6}, 6), "6 5 4 3 2 1 devient 1 2 3 4 5 6");
    VERIFIER_EGAL(nb_comparaisons, 15, "6 5 4 3 2 1 : 1 + 2 + 3 + 4 + 5 = 15 comparaisons (pire cas)");

    int f[] = {1, 2, 4, 3, 5, 7, 6, 8};
    nb_comparaisons = 0;
    tri_insertion(f, 8);
    VERIFIER(aide_egal(f, (int[]){1, 2, 3, 4, 5, 6, 7, 8}, 8), "1 2 4 3 5 7 6 8 devient 1 2 3 4 5 6 7 8");
    VERIFIER_EGAL(nb_comparaisons, 9, "presque trié (2 voisins inversés) : 9 comparaisons seulement");

    size_t n = 1000;
    int *grand = malloc(n * sizeof(int));
    if (grand == NULL) {
        exit(EXIT_FAILURE);
    }
    for (size_t i = 0; i < n; i++) {
        grand[i] = 3 * (int)i;
    }
    nb_comparaisons = 0;
    tri_insertion(grand, n);
    VERIFIER(aide_trie(grand, n), "un tableau déjà trié de 1 000 cases reste trié");
    VERIFIER_EGAL(nb_comparaisons, 999, "un tableau déjà trié de 1 000 cases : 999 comparaisons (place cherchée depuis la droite)");

    unsigned graine = 777u;
    for (size_t i = 0; i < n; i++) {
        graine = graine * 1103515245u + 12345u;
        grand[i] = (int)(graine % 2000u) - 1000;
    }
    tri_insertion(grand, n);
    VERIFIER(aide_trie(grand, n), "1 000 valeurs au hasard sont triées");
    free(grand);
    return BILAN();
}
