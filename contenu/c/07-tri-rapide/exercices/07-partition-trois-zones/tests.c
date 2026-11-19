#include <stdlib.h>

static long long aide_empreinte(const int *t, int debut, int fin) {
    long long somme = 0;
    for (int i = debut; i < fin; i++) {
        somme += (long long)t[i] * t[i] * t[i] + 3LL * t[i];
    }
    return somme;
}

static int aide_zones(const int *t, int debut, int fin, int pivot, int p, int g) {
    if (p < debut || g < p || g > fin) {
        return 0;
    }
    for (int i = debut; i < p; i++) {
        if (t[i] >= pivot) {
            return 0;
        }
    }
    for (int i = p; i < g; i++) {
        if (t[i] != pivot) {
            return 0;
        }
    }
    for (int i = g; i < fin; i++) {
        if (t[i] <= pivot) {
            return 0;
        }
    }
    return 1;
}

static int aide_essayer(int *t, int debut, int fin, int pivot, int *p, int *g) {
    long long avant = aide_empreinte(t, debut, fin);
    *p = -1;
    *g = -1;
    partitionTroisZones(t, debut, fin, pivot, p, g);
    return aide_zones(t, debut, fin, pivot, *p, *g) && aide_empreinte(t, debut, fin) == avant;
}

static int aide_grand_tri(int n, int nombreDeValeurs) {
    int *t = malloc(n * sizeof(int));
    if (t == NULL) {
        exit(EXIT_FAILURE);
    }
    unsigned int graine = 99u;
    for (int i = 0; i < n; i++) {
        graine = graine * 1103515245u + 12345u;
        t[i] = (int)((graine >> 8) % (unsigned int)nombreDeValeurs);
    }
    triRapide3(t, n);
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
    int p = 0;
    int g = 0;

    int a[] = {5, 2, 5, 9, 5, 1, 7};
    VERIFIER(aide_essayer(a, 0, 7, 5, &p, &g), "{5, 2, 5, 9, 5, 1, 7} autour de 5 : les trois zones sont justes, sans perdre de valeur");
    VERIFIER_EGAL(p, 2, "deux valeurs plus petites que 5 (2 et 1) : *finPetits vaut 2");
    VERIFIER_EGAL(g, 5, "trois valeurs égales à 5 : *debutGrands vaut 5");

    int b[] = {4, 4, 4, 4, 4};
    VERIFIER(aide_essayer(b, 0, 5, 4, &p, &g) && p == 0 && g == 5, "{4, 4, 4, 4, 4} autour de 4 : tout est dans la zone du milieu (0 et 5)");

    int c[] = {8, 1, 6, 3};
    VERIFIER(aide_essayer(c, 0, 4, 5, &p, &g) && p == 2 && g == 2, "{8, 1, 6, 3} autour de 5 (absent) : zone du milieu vide, *finPetits = *debutGrands = 2");

    int d[] = {9, 9, 3, 7, 3, 1, 3, 9, 0};
    VERIFIER(aide_essayer(d, 2, 7, 3, &p, &g) && p == 3 && g == 6, "portion [2, 7) de {9, 9, 3, 7, 3, 1, 3, 9, 0} autour de 3 : petites [2, 3), égales [3, 6), grandes [6, 7)");
    VERIFIER(d[0] == 9 && d[1] == 9 && d[7] == 9 && d[8] == 0, "les cases hors de la portion n'ont pas bougé");

    int e[] = {2, 1};
    VERIFIER(aide_essayer(e, 0, 2, 9, &p, &g) && p == 2 && g == 2, "tout est plus petit que le pivot : *finPetits = *debutGrands = fin");

    int f[] = {2, 1};
    VERIFIER(aide_essayer(f, 0, 2, 0, &p, &g) && p == 0 && g == 0, "tout est plus grand que le pivot : *finPetits = *debutGrands = debut");

    int ok = 1;
    unsigned int graine = 5u;
    for (int essai = 0; essai < 300; essai++) {
        int t[12];
        for (int i = 0; i < 12; i++) {
            graine = graine * 1103515245u + 12345u;
            t[i] = (int)((graine >> 8) % 6u);
        }
        if (!aide_essayer(t, 0, 12, essai % 6, &p, &g)) {
            ok = 0;
        }
    }
    VERIFIER(ok, "300 tableaux au hasard (valeurs de 0 à 5) : les trois zones sont toujours justes");

    if (ok) {
        VERIFIER(aide_grand_tri(200000, 1), "200 000 valeurs toutes égales : triées en une seule partition");
        VERIFIER(aide_grand_tri(200000, 3), "200 000 valeurs qui ne valent que 0, 1 ou 2 : triées rapidement");
        VERIFIER(aide_grand_tri(100001, 1000000), "100 001 valeurs au hasard : triées");
    } else {
        VERIFIER(0, "les grands tableaux ne sont essayés qu'une fois la partition juste");
    }
    return BILAN();
}
