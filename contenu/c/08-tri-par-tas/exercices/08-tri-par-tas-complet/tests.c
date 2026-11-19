#include <stdlib.h>

static int aide_egal(const int *t, const int *attendu, int n) {
    for (int i = 0; i < n; i++) {
        if (t[i] != attendu[i]) {
            return 0;
        }
    }
    return 1;
}

static int aide_croissant(const int *t, int n) {
    for (int i = 1; i < n; i++) {
        if (t[i - 1] > t[i]) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int a[] = {5, 9, 1, 8, 3};
    triParTas(a, 5);
    int a_attendu[] = {1, 3, 5, 8, 9};
    VERIFIER(aide_egal(a, a_attendu, 5), "{5, 9, 1, 8, 3} trié donne {1, 3, 5, 8, 9}");

    int b[] = {2, 9};
    triParTas(b, 2);
    VERIFIER(b[0] == 2 && b[1] == 9, "{2, 9} trié reste {2, 9}");

    int c[] = {9, 2};
    triParTas(c, 2);
    VERIFIER(c[0] == 2 && c[1] == 9, "{9, 2} trié donne {2, 9}");

    int d[] = {1, 2, 3, 4, 5, 6, 7};
    triParTas(d, 7);
    int d_attendu[] = {1, 2, 3, 4, 5, 6, 7};
    VERIFIER(aide_egal(d, d_attendu, 7), "un tableau déjà trié le reste");

    int e[] = {7, 6, 5, 4, 3, 2, 1};
    triParTas(e, 7);
    VERIFIER(aide_egal(e, d_attendu, 7), "{7, 6, 5, 4, 3, 2, 1} trié donne {1, ..., 7}");

    int f[] = {3, -5, 3, 0, 12, -5, 3, 8};
    triParTas(f, 8);
    int f_attendu[] = {-5, -5, 0, 3, 3, 3, 8, 12};
    VERIFIER(aide_egal(f, f_attendu, 8), "{3, -5, 3, 0, 12, -5, 3, 8} trié donne {-5, -5, 0, 3, 3, 3, 8, 12}");

    int g[] = {4, 4, 4, 4};
    triParTas(g, 4);
    VERIFIER(g[0] == 4 && g[1] == 4 && g[2] == 4 && g[3] == 4, "{4, 4, 4, 4} : toutes les valeurs égales");

    int h[] = {8, 1, 7, 0};
    triParTas(h, 3);
    VERIFIER(h[0] == 1 && h[1] == 7 && h[2] == 8 && h[3] == 0, "{8, 1, 7, 0} avec n = 3 : {1, 7, 8}, la case 3 n'est pas touchée");

    int un[] = {5, 2};
    triParTas(un, 1);
    VERIFIER(un[0] == 5 && un[1] == 2, "avec n = 1, rien ne bouge");
    triParTas(un, 0);
    VERIFIER(un[0] == 5 && un[1] == 2, "avec n = 0, rien ne bouge");

    int n = 300000;
    int *grand = malloc(n * sizeof(int));
    int *compte = calloc(1000, sizeof(int));
    if (grand == NULL || compte == NULL) {
        exit(EXIT_FAILURE);
    }
    unsigned int graine = 99u;
    for (int i = 0; i < n; i++) {
        graine = graine * 1103515245u + 12345u;
        grand[i] = (int)((graine >> 8) % 1000u);
        compte[grand[i]]++;
    }
    triParTas(grand, n);
    for (int i = 0; i < n; i++) {
        compte[grand[i]]--;
    }
    int memes_valeurs = 1;
    for (int v = 0; v < 1000; v++) {
        if (compte[v] != 0) {
            memes_valeurs = 0;
        }
    }
    VERIFIER(aide_croissant(grand, n), "300 000 valeurs au hasard (entre 0 et 999) sont triées");
    VERIFIER(memes_valeurs, "le tableau trié contient exactement les mêmes valeurs qu'au départ");

    for (int i = 0; i < n; i++) {
        grand[i] = n - i;
    }
    triParTas(grand, n);
    VERIFIER(aide_croissant(grand, n) && grand[0] == 1 && grand[n - 1] == n, "300 000 valeurs décroissantes sont triées");
    free(compte);
    free(grand);
    VERIFIER_SANS_FUITE();
    return BILAN();
}
