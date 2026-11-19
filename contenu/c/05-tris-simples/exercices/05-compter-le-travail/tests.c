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
    VERIFIER_EGAL(compter_inversions(a, 5), 5, "5 2 9 1 7 a 5 inversions");
    VERIFIER(aide_egal(a, (int[]){5, 2, 9, 1, 7}, 5), "compter les inversions ne modifie pas le tableau");
    VERIFIER_EGAL(compter_inversions((int[]){1, 2, 3}, 3), 0, "1 2 3 n'a aucune inversion");
    VERIFIER_EGAL(compter_inversions((int[]){3, 2, 1}, 3), 3, "3 2 1 a 3 inversions");
    VERIFIER_EGAL(compter_inversions((int[]){2, 2, 1}, 3), 2, "2 2 1 a 2 inversions (les deux 2 égaux ne comptent pas)");
    VERIFIER_EGAL(compter_inversions((int[]){6, 5, 4, 3, 2, 1}, 6), 15, "6 5 4 3 2 1 a 6 × 5 / 2 = 15 inversions");
    VERIFIER_EGAL(compter_inversions(NULL, 0), 0, "un tableau vide n'a aucune inversion");

    size_t comparaisons = 99;
    size_t echanges = 99;
    tri_bulles_compte(a, 5, &comparaisons, &echanges);
    VERIFIER(aide_egal(a, (int[]){1, 2, 5, 7, 9}, 5), "5 2 9 1 7 devient 1 2 5 7 9");
    VERIFIER_EGAL(comparaisons, 10, "5 2 9 1 7 : 4 + 3 + 2 + 1 = 10 comparaisons");
    VERIFIER_EGAL(echanges, 5, "5 2 9 1 7 : 5 échanges, autant que d'inversions");

    int b[] = {1, 2, 3, 4, 5, 6};
    comparaisons = 99;
    echanges = 99;
    tri_bulles_compte(b, 6, &comparaisons, &echanges);
    VERIFIER_EGAL(comparaisons, 5, "1 2 3 4 5 6 déjà trié : un seul passage, 5 comparaisons");
    VERIFIER_EGAL(echanges, 0, "1 2 3 4 5 6 déjà trié : aucun échange (le compteur part bien de 0)");

    int c[] = {6, 5, 4, 3, 2, 1};
    tri_bulles_compte(c, 6, &comparaisons, &echanges);
    VERIFIER(aide_egal(c, (int[]){1, 2, 3, 4, 5, 6}, 6), "6 5 4 3 2 1 devient 1 2 3 4 5 6");
    VERIFIER(comparaisons == 15 && echanges == 15, "6 5 4 3 2 1 : 15 comparaisons et 15 échanges");

    comparaisons = 99;
    echanges = 99;
    tri_bulles_compte(NULL, 0, &comparaisons, &echanges);
    VERIFIER(comparaisons == 0 && echanges == 0, "un tableau vide : les deux compteurs valent 0");

    size_t n = 500;
    int *grand = malloc(n * sizeof(int));
    if (grand == NULL) {
        exit(EXIT_FAILURE);
    }
    unsigned graine = 31u;
    for (size_t i = 0; i < n; i++) {
        graine = graine * 1103515245u + 12345u;
        grand[i] = (int)(graine % 100u);
    }
    size_t inversions = compter_inversions(grand, n);
    tri_bulles_compte(grand, n, &comparaisons, &echanges);
    VERIFIER(aide_trie(grand, n), "500 valeurs au hasard sont triées");
    VERIFIER_EGAL(echanges, inversions, "500 valeurs au hasard : autant d'échanges que d'inversions");
    VERIFIER(comparaisons <= n * (n - 1) / 2, "500 valeurs : au plus 500 × 499 / 2 comparaisons");
    free(grand);
    return BILAN();
}
