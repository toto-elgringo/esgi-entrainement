#include <stdlib.h>

int main(void) {
    int t[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91, 99};
    VERIFIER_EGAL(dichotomie(t, 11, 23), 5, "23 est en position 5 (la case du milieu)");
    VERIFIER_EGAL(dichotomie(t, 11, 2), 0, "2 est dans la première case");
    VERIFIER_EGAL(dichotomie(t, 11, 99), 10, "99 est dans la dernière case");
    VERIFIER_EGAL(dichotomie(t, 11, 12), 3, "12 est en position 3");
    VERIFIER_EGAL(dichotomie(t, 11, 72), 8, "72 est en position 8");
    VERIFIER_EGAL(dichotomie(t, 11, 20), -1, "20 n'est pas dans le tableau");
    VERIFIER_EGAL(dichotomie(t, 11, 1), -1, "1 est plus petit que toutes les valeurs : absent");
    VERIFIER_EGAL(dichotomie(t, 11, 100), -1, "100 est plus grand que toutes les valeurs : absent");

    int u[] = {-4, 3, 6, 42};
    VERIFIER_EGAL(dichotomie(u, 4, 6), 2, "dans -4 3 6 42, 6 est en position 2");
    VERIFIER_EGAL(dichotomie(u, 4, -4), 0, "dans -4 3 6 42, -4 est en position 0");

    int v[] = {7};
    VERIFIER_EGAL(dichotomie(v, 1, 7), 0, "dans un tableau d'une case, 7 est en position 0");
    VERIFIER_EGAL(dichotomie(v, 1, 3), -1, "dans le tableau 7, 3 est absent");
    VERIFIER_EGAL(dichotomie(v, 1, 9), -1, "dans le tableau 7, 9 est absent");
    VERIFIER_EGAL(dichotomie(NULL, 0, 5), -1, "dans un tableau vide, rien n'est trouvé");

    size_t n = 1000000;
    int *grand = malloc(n * sizeof(int));
    if (grand == NULL) {
        exit(EXIT_FAILURE);
    }
    for (size_t i = 0; i < n; i++) {
        grand[i] = 2 * (int)i;
    }
    size_t justes = 0;
    for (int valeur = -1; valeur < 2 * (int)n; valeur++) {
        int attendu = (valeur >= 0 && valeur % 2 == 0) ? valeur / 2 : -1;
        if (dichotomie(grand, n, valeur) == attendu) {
            justes++;
        }
    }
    VERIFIER_EGAL(justes, 2000001, "deux millions de recherches dans un million de cases : toutes justes, et assez vite");
    free(grand);
    return BILAN();
}
