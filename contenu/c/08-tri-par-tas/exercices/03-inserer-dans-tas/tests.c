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
    int a[10] = {54, 28, 12, 5, 3};
    int ta = 5;
    insererTas(a, &ta, 30);
    int a_attendu[] = {54, 28, 30, 5, 3, 12};
    VERIFIER_EGAL(ta, 6, "après une insertion dans un tas de 5 cases, la taille vaut 6");
    VERIFIER(aide_egal(a, a_attendu, 6), "insérer 30 dans {54, 28, 12, 5, 3} donne {54, 28, 30, 5, 3, 12}");

    insererTas(a, &ta, 8);
    int a2[] = {54, 28, 30, 5, 3, 12, 8};
    VERIFIER(ta == 7 && aide_egal(a, a2, 7), "insérer ensuite 8 : il reste à la fin (son parent 30 est plus grand)");

    insererTas(a, &ta, 72);
    int a3[] = {72, 54, 30, 28, 3, 12, 8, 5};
    VERIFIER(ta == 8 && aide_egal(a, a3, 8), "insérer ensuite 72 : il remonte jusqu'à la racine, {72, 54, 30, 28, 3, 12, 8, 5}");

    int b[4];
    int tb = 0;
    insererTas(b, &tb, 7);
    VERIFIER(tb == 1 && b[0] == 7, "insérer 7 dans un tas vide : {7}, taille 1");
    insererTas(b, &tb, 7);
    VERIFIER(tb == 2 && b[0] == 7 && b[1] == 7, "insérer encore 7 : une valeur égale ne remonte pas");

    int *grand = malloc(200000 * sizeof(int));
    if (grand == NULL) {
        exit(EXIT_FAILURE);
    }
    int taille = 0;
    unsigned int graine = 31u;
    int maximum = -1;
    int ok = 1;
    for (int i = 0; i < 200000; i++) {
        graine = graine * 1103515245u + 12345u;
        int v = (int)((graine >> 8) % 1000000u);
        if (v > maximum) {
            maximum = v;
        }
        insererTas(grand, &taille, v);
        if (grand[0] != maximum) {
            ok = 0;
        }
    }
    VERIFIER(ok && taille == 200000, "200 000 insertions : la racine est toujours le maximum, la taille vaut 200 000");
    VERIFIER(aide_tas_max(grand, taille), "après 200 000 insertions, le tableau est toujours un tas max");
    free(grand);
    return BILAN();
}
