#define TRIER(t, n) triRapide(t, n)
#include <stdlib.h>

static int aide_comparer(const void *a, const void *b) {
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y);
}

static unsigned int aide_graine = 4242u;

static int aide_hasard(int max) {
    aide_graine = aide_graine * 1103515245u + 12345u;
    return (int)((aide_graine >> 8) % (unsigned int)max);
}

static int aide_egal(const int *t, const int *attendu, int n) {
    for (int i = 0; i < n; i++) {
        if (t[i] != attendu[i]) {
            return 0;
        }
    }
    return 1;
}

static int aide_verifier_tri(int *t, int n) {
    int *reference = malloc((n > 0 ? n : 1) * sizeof(int));
    if (reference == NULL) {
        exit(EXIT_FAILURE);
    }
    for (int i = 0; i < n; i++) {
        reference[i] = t[i];
    }
    qsort(reference, n, sizeof(int), aide_comparer);
    TRIER(t, n);
    int ok = aide_egal(t, reference, n);
    free(reference);
    return ok;
}

static int aide_hasard_trie(int n, int max) {
    int *t = malloc(n * sizeof(int));
    if (t == NULL) {
        exit(EXIT_FAILURE);
    }
    for (int i = 0; i < n; i++) {
        t[i] = aide_hasard(max) - max / 2;
    }
    int ok = aide_verifier_tri(t, n);
    free(t);
    return ok;
}

static int aide_deja_trie(int n) {
    int *t = malloc(n * sizeof(int));
    if (t == NULL) {
        exit(EXIT_FAILURE);
    }
    for (int i = 0; i < n; i++) {
        t[i] = 2 * i;
    }
    int ok = aide_verifier_tri(t, n);
    free(t);
    return ok;
}

int main(void) {
    int a[] = {4, 9, 1, 6, 8, 2, 7};
    TRIER(a, 7);
    int a_attendu[] = {1, 2, 4, 6, 7, 8, 9};
    VERIFIER(aide_egal(a, a_attendu, 7), "{4, 9, 1, 6, 8, 2, 7} trié donne {1, 2, 4, 6, 7, 8, 9}");

    int b[] = {7, 3, 10, 2, 9, 3, 6, 2};
    TRIER(b, 8);
    int b_attendu[] = {2, 2, 3, 3, 6, 7, 9, 10};
    VERIFIER(aide_egal(b, b_attendu, 8), "{7, 3, 10, 2, 9, 3, 6, 2} trié donne {2, 2, 3, 3, 6, 7, 9, 10} (doublons gardés)");

    int un[] = {42};
    TRIER(un, 1);
    VERIFIER_EGAL(un[0], 42, "un tableau d'une case ne change pas");

    int vide[] = {99};
    TRIER(vide, 0);
    VERIFIER_EGAL(vide[0], 99, "avec n = 0, le tableau n'est pas touché");

    int deux[] = {8, -3};
    TRIER(deux, 2);
    VERIFIER(deux[0] == -3 && deux[1] == 8, "{8, -3} trié donne {-3, 8}");

    int envers[] = {9, 8, 7, 6, 5, 4, 3, 2, 1};
    TRIER(envers, 9);
    int envers_attendu[] = {1, 2, 3, 4, 5, 6, 7, 8, 9};
    VERIFIER(aide_egal(envers, envers_attendu, 9), "un tableau de 9 cases trié à l'envers est remis dans l'ordre");

    VERIFIER(aide_hasard_trie(13, 20), "13 valeurs au hasard (avec des doublons) sont bien triées");
    VERIFIER(aide_hasard_trie(1000, 100000), "1 000 valeurs au hasard sont bien triées");
    VERIFIER(aide_deja_trie(100000), "100 000 valeurs déjà triées restent triées (avec le pivot au milieu, c'est rapide)");
    VERIFIER(aide_hasard_trie(100001, 1000000), "100 001 valeurs au hasard sont triées (en O(n log n), sinon c'est trop long)");
    return BILAN();
}
