#include <stdlib.h>

static int aide_tas_min(const int *t, int n) {
    for (int i = 1; i < n; i++) {
        if (t[i] < t[(i - 1) / 2]) {
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
    int a[] = {7, 2, 9, 4, 1, 8};
    int ra[3] = {0};
    kPlusPetits(a, 6, 3, ra);
    int ra_attendu[] = {1, 2, 4};
    VERIFIER(aide_egal(ra, ra_attendu, 3), "les 3 plus petites valeurs de {7, 2, 9, 4, 1, 8} sont {1, 2, 4}");
    VERIFIER(aide_tas_min(a, 3), "il reste un tas min de 3 cases au début du tableau");

    int b[] = {50, 10, 40, 30, 20};
    int rb[5] = {0};
    kPlusPetits(b, 5, 5, rb);
    int rb_attendu[] = {10, 20, 30, 40, 50};
    VERIFIER(aide_egal(rb, rb_attendu, 5), "avec k = n : toutes les valeurs, triées, {10, 20, 30, 40, 50}");

    int c[] = {5, 3, 5, 1, 3, 1};
    int rc[4] = {0};
    kPlusPetits(c, 6, 4, rc);
    int rc_attendu[] = {1, 1, 3, 3};
    VERIFIER(aide_egal(rc, rc_attendu, 4), "{5, 3, 5, 1, 3, 1} avec k = 4 : les doublons comptent, {1, 1, 3, 3}");

    int d[] = {-4, 6, -9, 0};
    int rd[1] = {123};
    kPlusPetits(d, 4, 1, rd);
    VERIFIER_EGAL(rd[0], -9, "avec k = 1, on obtient le minimum -9");
    VERIFIER(aide_tas_min(d, 3), "après un retrait, les 3 premières cases forment un tas min");

    int e[] = {8, 3, 6};
    int re[1] = {77};
    kPlusPetits(e, 3, 0, re);
    VERIFIER(re[0] == 77 && aide_tas_min(e, 3), "avec k = 0 : rien n'est écrit dans resultat, mais t devient un tas min");

    int f[] = {1, 2, 3, 4, 5, 6, 7};
    int rf[2] = {0};
    kPlusPetits(f, 7, 2, rf);
    VERIFIER(rf[0] == 1 && rf[1] == 2 && aide_tas_min(f, 5), "{1, 2, ..., 7} (déjà un tas min) avec k = 2 : {1, 2}, il reste un tas min de 5 cases");

    int n = 1000000;
    int *grand = malloc(n * sizeof(int));
    if (grand == NULL) {
        exit(EXIT_FAILURE);
    }
    for (int i = 0; i < n; i++) {
        grand[i] = (int)(((long long)i * 7919) % n);
    }
    int rg[10] = {0};
    kPlusPetits(grand, n, 10, rg);
    int rg_attendu[] = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
    VERIFIER(aide_egal(rg, rg_attendu, 10), "1 000 000 valeurs mélangées (0 à 999 999) : les 10 plus petites sont 0, 1, ..., 9");
    VERIFIER(aide_tas_min(grand, n - 10), "il reste un tas min de 999 990 cases");
    free(grand);
    return BILAN();
}
