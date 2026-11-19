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
    int a[] = {3, 1, 2};
    triParTas(a, 3);
    int a_attendu[] = {1, 2, 3};
    VERIFIER(aide_egal(a, a_attendu, 3), "{3, 1, 2} trié donne {1, 2, 3}");

    int b[] = {2, 1};
    triParTas(b, 2);
    VERIFIER(b[0] == 1 && b[1] == 2, "{2, 1} trié donne {1, 2}");

    int c[] = {1, 2};
    triParTas(c, 2);
    VERIFIER(c[0] == 1 && c[1] == 2, "{1, 2} trié reste {1, 2}");

    int d[] = {5, 9, 1, 8, 3, 7};
    triParTas(d, 6);
    int d_attendu[] = {1, 3, 5, 7, 8, 9};
    VERIFIER(aide_egal(d, d_attendu, 6), "{5, 9, 1, 8, 3, 7} trié donne {1, 3, 5, 7, 8, 9}");

    int e[] = {1, 2, 3, 4, 5, 6, 7, 8};
    triParTas(e, 8);
    int e_attendu[] = {1, 2, 3, 4, 5, 6, 7, 8};
    VERIFIER(aide_egal(e, e_attendu, 8), "un tableau déjà trié {1, ..., 8} le reste (la plus grande valeur est la dernière : il faut l'insérer)");

    int f[] = {4, -2, 4, 0, -2, 7, 4};
    triParTas(f, 7);
    int f_attendu[] = {-2, -2, 0, 4, 4, 4, 7};
    VERIFIER(aide_egal(f, f_attendu, 7), "{4, -2, 4, 0, -2, 7, 4} trié donne {-2, -2, 0, 4, 4, 4, 7}");

    int g[] = {6, 99};
    triParTas(g, 1);
    VERIFIER(g[0] == 6 && g[1] == 99, "avec n = 1, rien ne bouge (et la case suivante n'est pas touchée)");
    triParTas(g, 0);
    VERIFIER(g[0] == 6 && g[1] == 99, "avec n = 0, rien ne bouge");

    int n = 100000;
    int *grand = malloc(n * sizeof(int));
    if (grand == NULL) {
        exit(EXIT_FAILURE);
    }
    unsigned int graine = 17u;
    long long somme = 0;
    for (int i = 0; i < n; i++) {
        graine = graine * 1103515245u + 12345u;
        grand[i] = (int)((graine >> 8) % 50000u);
        somme += grand[i];
    }
    triParTas(grand, n);
    long long somme_apres = 0;
    for (int i = 0; i < n; i++) {
        somme_apres += grand[i];
    }
    VERIFIER(aide_croissant(grand, n) && somme_apres == somme, "100 000 valeurs au hasard sont bien triées");
    free(grand);
    return BILAN();
}
