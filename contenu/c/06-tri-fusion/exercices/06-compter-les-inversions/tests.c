#include <stdlib.h>

static long long aide_naif(const int *t, int n) {
    long long total = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (t[i] > t[j]) {
                total++;
            }
        }
    }
    return total;
}

int main(void) {
    int trie[] = {1, 2, 3};
    VERIFIER_EGAL(compterInversions(trie, 3), 0LL, "{1, 2, 3} est trié : 0 inversion");

    int envers[] = {3, 2, 1};
    VERIFIER_EGAL(compterInversions(envers, 3), 3LL, "{3, 2, 1} a 3 inversions");

    int exemple[] = {2, 4, 1, 3, 5};
    VERIFIER_EGAL(compterInversions(exemple, 5), 3LL, "{2, 4, 1, 3, 5} a 3 inversions");
    VERIFIER(exemple[0] == 2 && exemple[1] == 4 && exemple[2] == 1 && exemple[3] == 3 && exemple[4] == 5, "le tableau de départ n'est pas modifié");

    int egaux[] = {2, 2, 2};
    VERIFIER_EGAL(compterInversions(egaux, 3), 0LL, "{2, 2, 2} : des valeurs égales ne font pas d'inversion");

    int melange[] = {5, 1, 5, 1};
    VERIFIER_EGAL(compterInversions(melange, 4), 3LL, "{5, 1, 5, 1} a 3 inversions (les deux 1 entre eux n'en font pas)");

    int seul[] = {7};
    VERIFIER_EGAL(compterInversions(seul, 1), 0LL, "une seule case : 0 inversion");
    VERIFIER_EGAL(compterInversions(seul, 0), 0LL, "tableau vide : 0 inversion");

    unsigned int graine = 2026u;
    int hasard[1000];
    for (int i = 0; i < 1000; i++) {
        graine = graine * 1103515245u + 12345u;
        hasard[i] = (int)((graine >> 8) % 300u);
    }
    VERIFIER_EGAL(compterInversions(hasard, 1000), aide_naif(hasard, 1000), "1000 valeurs au hasard (avec des doublons) : même résultat que le comptage paire par paire");

    int n = 200000;
    int *grand = malloc(n * sizeof(int));
    if (grand == NULL) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        grand[i] = n - i;
    }
    VERIFIER_EGAL(compterInversions(grand, n), 19999900000LL, "200 000 valeurs à l'envers : n(n-1)/2 = 19 999 900 000 inversions, calculées assez vite");
    free(grand);
    VERIFIER_SANS_FUITE();
    return BILAN();
}
