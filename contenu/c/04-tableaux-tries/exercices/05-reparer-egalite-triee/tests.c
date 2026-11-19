int main(void) {
    int a[] = {1, 2, 3};
    int b[] = {1, 2, 3};
    VERIFIER_EGAL(egaux_tries(a, 3, b, 3), 1, "1 2 3 et 1 2 3 sont égaux");

    int c[] = {1, 2, 2, 3};
    int d[] = {1, 2, 3, 3};
    VERIFIER_EGAL(egaux_tries(c, 4, d, 4), 0, "1 2 2 3 et 1 2 3 3 ne sont pas égaux (pas les mêmes quantités)");

    int e[] = {1, 2, 4};
    VERIFIER_EGAL(egaux_tries(a, 3, e, 3), 0, "1 2 3 et 1 2 4 ne sont pas égaux : la dernière case compte aussi");

    int f[] = {-5};
    int g[] = {7};
    VERIFIER_EGAL(egaux_tries(f, 1, g, 1), 0, "-5 et 7 ne sont pas égaux (une seule case)");
    VERIFIER_EGAL(egaux_tries(f, 1, f, 1), 1, "-5 et -5 sont égaux");

    VERIFIER_EGAL(egaux_tries(a, 2, b, 3), 0, "1 2 et 1 2 3 n'ont pas la même taille : pas égaux");
    VERIFIER_EGAL(egaux_tries(a, 3, b, 2), 0, "1 2 3 et 1 2 n'ont pas la même taille : pas égaux");

    VERIFIER_EGAL(egaux_tries(NULL, 0, NULL, 0), 1, "deux tableaux vides sont égaux (et aucune case n'est lue)");
    return BILAN();
}
