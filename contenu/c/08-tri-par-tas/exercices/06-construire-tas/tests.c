#include <stdlib.h>

static int aide_tas_max(const int *t, int n) {
    for (int i = 1; i < n; i++) {
        if (t[i] > t[(i - 1) / 2]) {
            return 0;
        }
    }
    return 1;
}

static int aide_egal(const int *t, const int *attendu, int n) {
    for (int i = 0; i < n; i++) {
        if (t[i] != attendu[i]) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int a[] = {1, 2, 3, 4, 5, 6, 7};
    construireTas(a, 7);
    int a_attendu[] = {7, 5, 6, 4, 2, 1, 3};
    VERIFIER(aide_egal(a, a_attendu, 7), "{1, 2, 3, 4, 5, 6, 7} devient {7, 5, 6, 4, 2, 1, 3}");

    int b[] = {3, 1, 4, 1, 5, 9, 2, 6};
    construireTas(b, 8);
    int b_attendu[] = {9, 6, 4, 1, 5, 3, 2, 1};
    VERIFIER(aide_egal(b, b_attendu, 8), "{3, 1, 4, 1, 5, 9, 2, 6} devient {9, 6, 4, 1, 5, 3, 2, 1}");

    int c[] = {2, 9};
    construireTas(c, 2);
    VERIFIER(c[0] == 9 && c[1] == 2, "{2, 9} devient {9, 2} : la racine doit descendre elle aussi");

    int d[] = {1, 2, 3, 100};
    construireTas(d, 3);
    VERIFIER(d[0] == 3 && d[1] == 2 && d[2] == 1 && d[3] == 100, "{1, 2, 3, 100} avec n = 3 : {3, 2, 1}, la case 3 ne fait pas partie du tableau");

    int e[] = {9, 7, 8, 5, 3, 1, 2};
    construireTas(e, 7);
    int e_attendu[] = {9, 7, 8, 5, 3, 1, 2};
    VERIFIER(aide_egal(e, e_attendu, 7), "un tableau qui est déjà un tas ne bouge pas");

    int f[] = {42};
    construireTas(f, 1);
    VERIFIER_EGAL(f[0], 42, "un tableau d'une case ne change pas");
    construireTas(f, 0);
    VERIFIER_EGAL(f[0], 42, "avec n = 0, rien ne se passe");

    int n = 1000000;
    int *grand = malloc(n * sizeof(int));
    if (grand == NULL) {
        exit(EXIT_FAILURE);
    }
    unsigned int graine = 7u;
    long long somme = 0;
    int maximum = -1;
    for (int i = 0; i < n; i++) {
        graine = graine * 1103515245u + 12345u;
        grand[i] = (int)((graine >> 8) % 1000000u);
        somme += grand[i];
        if (grand[i] > maximum) {
            maximum = grand[i];
        }
    }
    construireTas(grand, n);
    long long somme_apres = 0;
    for (int i = 0; i < n; i++) {
        somme_apres += grand[i];
    }
    VERIFIER(aide_tas_max(grand, n), "1 000 000 valeurs au hasard : le tableau devient un tas max");
    VERIFIER(grand[0] == maximum && somme_apres == somme, "le maximum est à la racine et les valeurs n'ont fait que changer de place");

    for (int i = 0; i < n; i++) {
        grand[i] = i;
    }
    construireTas(grand, n);
    VERIFIER(aide_tas_max(grand, n) && grand[0] == n - 1, "1 000 000 valeurs croissantes (le pire cas) : le tableau devient un tas max");
    free(grand);
    return BILAN();
}
