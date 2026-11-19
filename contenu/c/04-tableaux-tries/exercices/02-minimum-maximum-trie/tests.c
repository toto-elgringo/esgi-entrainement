#include <stdlib.h>

int main(void) {
    int t1[] = {-6, -2, 2, 3, 5};
    VERIFIER_EGAL(minimum_trie(t1, 5), -6, "le minimum de -6 -2 2 3 5 vaut -6");
    VERIFIER_EGAL(maximum_trie(t1, 5), 5, "le maximum de -6 -2 2 3 5 vaut 5");

    int t2[] = {4, 9, 12};
    VERIFIER_EGAL(minimum_trie(t2, 3), 4, "le minimum de 4 9 12 vaut 4 (valeurs toutes positives)");
    VERIFIER_EGAL(maximum_trie(t2, 3), 12, "le maximum de 4 9 12 vaut 12");

    int t3[] = {-8};
    VERIFIER_EGAL(minimum_trie(t3, 1), -8, "le minimum d'un tableau d'une case est cette case");
    VERIFIER_EGAL(maximum_trie(t3, 1), -8, "le maximum d'un tableau d'une case est cette case");

    int t4[] = {-9, -7, -3};
    VERIFIER_EGAL(maximum_trie(t4, 3), -3, "le maximum de -9 -7 -3 vaut -3 (valeurs toutes négatives)");

    size_t n = 200000;
    int *grand = malloc(n * sizeof(int));
    if (grand == NULL) {
        exit(EXIT_FAILURE);
    }
    for (size_t i = 0; i < n; i++) {
        grand[i] = (int)i - 1000;
    }
    long long ecart = 0;
    for (size_t k = 0; k < n; k++) {
        ecart += maximum_trie(grand, n) - minimum_trie(grand, n);
    }
    VERIFIER_EGAL(ecart, 39999800000LL, "200 000 appels sur 200 000 cases répondent assez vite (O(1))");
    free(grand);
    return BILAN();
}
