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
    int a[] = {3, 9, 8, 5, 7, 1, 2};
    descendre(a, 7, 0);
    int a_attendu[] = {9, 7, 8, 5, 3, 1, 2};
    VERIFIER(aide_egal(a, a_attendu, 7), "descendre la racine de {3, 9, 8, 5, 7, 1, 2} donne {9, 7, 8, 5, 3, 1, 2}");

    int b[] = {50, 4, 40, 20, 10, 30, 35};
    descendre(b, 7, 1);
    int b_attendu[] = {50, 20, 40, 4, 10, 30, 35};
    VERIFIER(aide_egal(b, b_attendu, 7), "descendre la case 1 de {50, 4, 40, 20, 10, 30, 35} : 4 échange avec 20, le reste ne bouge pas");

    int c[] = {2, 6, 4, 10};
    descendre(c, 3, 0);
    int c_attendu[] = {6, 2, 4, 10};
    VERIFIER(aide_egal(c, c_attendu, 4), "{2, 6, 4, 10} avec taille 3 : la case 3 (10) est hors du tas, résultat {6, 2, 4, 10}");

    int d[] = {1, 8, 99};
    descendre(d, 2, 0);
    int d_attendu[] = {8, 1, 99};
    VERIFIER(aide_egal(d, d_attendu, 3), "{1, 8, 99} avec taille 2 : seul l'enfant gauche existe, résultat {8, 1, 99}");

    int e[] = {5, 5, 3};
    descendre(e, 3, 0);
    int e_attendu[] = {5, 5, 3};
    VERIFIER(aide_egal(e, e_attendu, 3), "{5, 5, 3} : un enfant égal ne provoque pas d'échange");

    int f[] = {1, 5, 5};
    descendre(f, 3, 0);
    VERIFIER(f[0] == 5 && aide_tas_max(f, 3), "{1, 5, 5} : deux enfants égaux, 5 monte à la racine et le tableau est un tas max");

    int g[] = {4, 1, 2};
    descendre(g, 3, 0);
    int g_attendu[] = {4, 1, 2};
    VERIFIER(aide_egal(g, g_attendu, 3), "{4, 1, 2} est déjà un tas : rien ne bouge");

    int h[] = {7, 100};
    descendre(h, 1, 0);
    VERIFIER(h[0] == 7 && h[1] == 100, "{7, 100} avec taille 1 : la racine n'a pas d'enfant, rien ne bouge");

    int n = 1 << 20;
    int *grand = malloc(n * sizeof(int));
    if (grand == NULL) {
        exit(EXIT_FAILURE);
    }
    for (int i = 0; i < n; i++) {
        grand[i] = n - i;
    }
    grand[0] = 0;
    descendre(grand, n, 0);
    VERIFIER(aide_tas_max(grand, n) && grand[0] == n - 1, "1 048 576 cases avec 0 à la racine : après la descente, le tableau est un tas max");

    int taille = n;
    int ok = 1;
    for (int k = 0; k < 2000; k++) {
        int maximum = grand[0];
        taille = taille - 1;
        echanger(grand, 0, taille);
        descendre(grand, taille, 0);
        if (grand[taille] != maximum || grand[0] > maximum) {
            ok = 0;
        }
    }
    VERIFIER(ok && aide_tas_max(grand, taille), "2 000 retraits de la racine avec ta descente : le reste est toujours un tas max");
    free(grand);
    return BILAN();
}
