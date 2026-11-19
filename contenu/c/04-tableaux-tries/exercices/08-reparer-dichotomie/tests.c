#include <stdint.h>

int main(void) {
    VERIFIER_EGAL(milieu(0, 10), 5, "le milieu de [0, 10[ est 5");
    VERIFIER_EGAL(milieu(4, 5), 4, "le milieu de [4, 5[ est 4 (la seule case)");
    VERIFIER_EGAL(milieu(SIZE_MAX - 10, SIZE_MAX - 2), SIZE_MAX - 6, "le milieu reste juste avec des bornes énormes (pas de débordement)");

    int t[] = {1, 3, 5};
    VERIFIER_EGAL(dichotomie(t, 3, 3), 1, "dans 1 3 5, 3 est en position 1");
    VERIFIER_EGAL(dichotomie(t, 3, 1), 0, "dans 1 3 5, 1 est en position 0");
    VERIFIER_EGAL(dichotomie(t, 3, 5), 2, "dans 1 3 5, 5 est en position 2");

    int u[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91, 99};
    int justes = 0;
    for (int i = 0; i < 11; i++) {
        if (dichotomie(u, 11, u[i]) == i) {
            justes++;
        }
    }
    VERIFIER_EGAL(justes, 11, "dans un tableau de 11 cases, chacune des 11 valeurs est retrouvée à sa place");

    VERIFIER_EGAL(dichotomie(NULL, 0, 4), -1, "dans un tableau vide, rien n'est trouvé");

    int v[] = {2, 4, 6, 8};
    VERIFIER_EGAL(dichotomie(v, 4, 0), -1, "dans 2 4 6 8, 0 (plus petit que tout) est absent, sans lire hors du tableau");
    VERIFIER_EGAL(dichotomie(v, 4, 5), -1, "dans 2 4 6 8, 5 est absent");

    int w[] = {1, 3};
    VERIFIER_EGAL(dichotomie(w, 2, 4), -1, "dans 1 3, 4 (plus grand que tout) est absent, et la boucle s'arrête");
    VERIFIER_EGAL(dichotomie(w, 2, 2), -1, "dans 1 3, 2 est absent, et la boucle s'arrête");
    return BILAN();
}
