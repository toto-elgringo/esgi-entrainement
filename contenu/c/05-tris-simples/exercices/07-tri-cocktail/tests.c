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
    int a[] = {2, 3, 4, 5, 6, 1};
    tri_cocktail(a, 6);
    VERIFIER(aide_egal(a, (int[]){1, 2, 3, 4, 5, 6}, 6), "la tortue 2 3 4 5 6 1 devient 1 2 3 4 5 6");

    int b[] = {5, 2, 9, 1, 7};
    tri_cocktail(b, 5);
    VERIFIER(aide_egal(b, (int[]){1, 2, 5, 7, 9}, 5), "5 2 9 1 7 devient 1 2 5 7 9");

    int c[] = {3, -1, 3, 0, -1, 8};
    tri_cocktail(c, 6);
    VERIFIER(aide_egal(c, (int[]){-1, -1, 0, 3, 3, 8}, 6), "3 -1 3 0 -1 8 devient -1 -1 0 3 3 8 (doublons et négatifs)");

    int d[] = {2, 1};
    tri_cocktail(d, 2);
    VERIFIER(d[0] == 1 && d[1] == 2, "2 1 devient 1 2");

    int e[] = {42};
    nb_comparaisons = 0;
    tri_cocktail(e, 1);
    VERIFIER(e[0] == 42 && nb_comparaisons == 0, "un tableau d'une case : rien à comparer");

    nb_comparaisons = 0;
    tri_cocktail(NULL, 0);
    VERIFIER_EGAL(nb_comparaisons, 0, "un tableau vide : aucune comparaison (et aucune case lue)");

    int f[] = {6, 5, 4, 3, 2, 1};
    tri_cocktail(f, 6);
    VERIFIER(aide_egal(f, (int[]){1, 2, 3, 4, 5, 6}, 6), "6 5 4 3 2 1 devient 1 2 3 4 5 6");

    size_t n = 100;
    int *tortue = malloc(n * sizeof(int));
    if (tortue == NULL) {
        exit(EXIT_FAILURE);
    }
    for (size_t i = 0; i + 1 < n; i++) {
        tortue[i] = (int)i + 2;
    }
    tortue[n - 1] = 1;
    nb_comparaisons = 0;
    tri_cocktail(tortue, n);
    VERIFIER(aide_trie(tortue, n), "2 3 … 100 1 (100 cases) est trié");
    VERIFIER(nb_comparaisons < 300, "la tortue de 100 cases est rangée en moins de 300 comparaisons (un aller, un retour, un aller)");

    nb_comparaisons = 0;
    tri_cocktail(tortue, n);
    VERIFIER_EGAL(nb_comparaisons, 99, "un tableau déjà trié de 100 cases : un seul aller, 99 comparaisons");

    unsigned graine = 4242u;
    for (size_t i = 0; i < n; i++) {
        graine = graine * 1103515245u + 12345u;
        tortue[i] = (int)(graine % 50u) - 25;
    }
    tri_cocktail(tortue, n);
    VERIFIER(aide_trie(tortue, n), "100 valeurs au hasard sont triées");
    free(tortue);
    return BILAN();
}
