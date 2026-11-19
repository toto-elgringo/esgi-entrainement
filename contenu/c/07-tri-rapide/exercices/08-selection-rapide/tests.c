#include <stdlib.h>

static int aide_comparer(const void *a, const void *b) {
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y);
}

static int aide_essayer_tous(const int *modele, int n) {
    int *trie = malloc(n * sizeof(int));
    int *copie = malloc(n * sizeof(int));
    if (trie == NULL || copie == NULL) {
        exit(EXIT_FAILURE);
    }
    for (int i = 0; i < n; i++) {
        trie[i] = modele[i];
    }
    qsort(trie, n, sizeof(int), aide_comparer);
    int ok = 1;
    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            copie[i] = modele[i];
        }
        if (selectionRapide(copie, n, k) != trie[k]) {
            ok = 0;
        }
    }
    free(trie);
    free(copie);
    return ok;
}

static int aide_grande_mediane(int n) {
    int *t = malloc(n * sizeof(int));
    int *trie = malloc(n * sizeof(int));
    if (t == NULL || trie == NULL) {
        exit(EXIT_FAILURE);
    }
    unsigned int graine = 2024u;
    for (int i = 0; i < n; i++) {
        graine = graine * 1103515245u + 12345u;
        t[i] = (int)((graine >> 8) % 1000000u);
        trie[i] = t[i];
    }
    qsort(trie, n, sizeof(int), aide_comparer);
    int ok = selectionRapide(t, n, n / 2) == trie[n / 2];
    free(t);
    free(trie);
    return ok;
}

int main(void) {
    int a[] = {4, 9, 1, 6, 8, 2, 7};
    VERIFIER_EGAL(selectionRapide(a, 7, 3), 6, "{4, 9, 1, 6, 8, 2, 7} : la valeur de rang 3 (la médiane) est 6");

    int b[] = {4, 9, 1, 6, 8, 2, 7};
    VERIFIER_EGAL(selectionRapide(b, 7, 0), 1, "{4, 9, 1, 6, 8, 2, 7} : la valeur de rang 0 (le minimum) est 1");

    int c[] = {4, 9, 1, 6, 8, 2, 7};
    VERIFIER_EGAL(selectionRapide(c, 7, 6), 9, "{4, 9, 1, 6, 8, 2, 7} : la valeur de rang 6 (le maximum) est 9");

    int d[] = {4, 9, 1, 6, 8, 2, 7};
    VERIFIER_EGAL(selectionRapide(d, 7, 1), 2, "{4, 9, 1, 6, 8, 2, 7} : la valeur de rang 1 est 2");

    int un[] = {42};
    VERIFIER_EGAL(selectionRapide(un, 1, 0), 42, "un tableau d'une case : sa seule valeur");

    int doublons[] = {3, 1, 3, 3, 0, 3};
    VERIFIER_EGAL(selectionRapide(doublons, 6, 2), 3, "{3, 1, 3, 3, 0, 3} : trié {0, 1, 3, 3, 3, 3}, la valeur de rang 2 est 3");

    int e[] = {12, -5, 7, 7, 30, 0, -5, 18, 2, 9, 11};
    VERIFIER(aide_essayer_tous(e, 11), "{12, -5, 7, 7, 30, 0, -5, 18, 2, 9, 11} : juste pour chaque k de 0 à 10");

    int f[50];
    for (int i = 0; i < 50; i++) {
        f[i] = (i * 37) % 23;
    }
    VERIFIER(aide_essayer_tous(f, 50), "50 valeurs avec des doublons : juste pour chaque k de 0 à 49");

    VERIFIER(aide_grande_mediane(1000001), "la médiane de 1 000 001 valeurs au hasard est juste");
    return BILAN();
}
