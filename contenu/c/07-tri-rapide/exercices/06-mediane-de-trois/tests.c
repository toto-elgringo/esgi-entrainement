#include <stdlib.h>

static int aide_est_mediane(const int *t, int debut, int fin, int indice) {
    int milieu = debut + (fin - debut) / 2;
    int dernier = fin - 1;
    if (indice != debut && indice != milieu && indice != dernier) {
        return 0;
    }
    int v = t[indice];
    int plusPetites = (t[debut] < v) + (t[milieu] < v) + (t[dernier] < v);
    int plusGrandes = (t[debut] > v) + (t[milieu] > v) + (t[dernier] > v);
    return plusPetites <= 1 && plusGrandes <= 1;
}

static int aide_grand_tableau(int n, int croissant) {
    int *t = malloc(n * sizeof(int));
    if (t == NULL) {
        exit(EXIT_FAILURE);
    }
    for (int i = 0; i < n; i++) {
        t[i] = croissant ? i : n - i;
    }
    triRapide(t, n);
    int ok = 1;
    for (int i = 1; i < n; i++) {
        if (t[i - 1] > t[i]) {
            ok = 0;
        }
    }
    free(t);
    return ok;
}

int main(void) {
    int a[] = {9, 4, 7, 1, 2};
    VERIFIER_EGAL(medianeDeTrois(a, 0, 5), 2, "dans {9, 4, 7, 1, 2} : entre 9, 7 et 2, la médiane est 7 (indice 2)");

    int b[] = {3, 8, 1, 5, 6};
    VERIFIER_EGAL(medianeDeTrois(b, 0, 5), 0, "dans {3, 8, 1, 5, 6} : entre 3, 1 et 6, la médiane est 3 (indice 0)");

    int c[] = {0, 0, 1, 9, 4, 0};
    VERIFIER_EGAL(medianeDeTrois(c, 2, 5), 4, "portion [2, 5) de {0, 0, 1, 9, 4, 0} : entre 1, 9 et 4, la médiane est 4 (indice 4)");

    int d[] = {1, 2, 3, 4, 5, 6, 7};
    VERIFIER_EGAL(medianeDeTrois(d, 0, 7), 3, "tableau trié {1, ..., 7} : la médiane de 1, 4 et 7 est au milieu (indice 3)");

    int e[] = {7, 6, 5, 4, 3, 2, 1};
    VERIFIER_EGAL(medianeDeTrois(e, 0, 7), 3, "tableau à l'envers {7, ..., 1} : la médiane de 7, 4 et 1 est au milieu (indice 3)");

    int f[] = {5, 8, 5};
    VERIFIER(aide_est_mediane(f, 0, 3, medianeDeTrois(f, 0, 3)), "dans {5, 8, 5} : une des deux cases qui valent 5");

    int g[] = {2, 9};
    VERIFIER(aide_est_mediane(g, 0, 2, medianeDeTrois(g, 0, 2)), "une portion de 2 cases : la fonction renvoie une de ses cases");

    int h[] = {6};
    VERIFIER_EGAL(medianeDeTrois(h, 0, 1), 0, "une portion d'une seule case : son indice");

    int ok = 1;
    unsigned int graine = 7u;
    for (int essai = 0; essai < 500; essai++) {
        int t[10];
        for (int i = 0; i < 10; i++) {
            graine = graine * 1103515245u + 12345u;
            t[i] = (int)((graine >> 8) % 20u);
        }
        int debut = essai % 4;
        int fin = 10 - essai % 3;
        if (!aide_est_mediane(t, debut, fin, medianeDeTrois(t, debut, fin))) {
            ok = 0;
        }
    }
    VERIFIER(ok, "500 portions au hasard : la case renvoyée est toujours la médiane des trois");

    if (ok) {
        VERIFIER(aide_grand_tableau(200000, 1), "200 000 valeurs déjà triées : le tri rapide reste rapide");
        VERIFIER(aide_grand_tableau(200000, 0), "200 000 valeurs triées à l'envers : le tri rapide reste rapide");
    } else {
        VERIFIER(0, "les grands tableaux ne sont essayés qu'une fois la médiane juste");
    }
    return BILAN();
}
