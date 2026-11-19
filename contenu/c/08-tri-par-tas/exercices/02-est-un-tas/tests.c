int main(void) {
    int a[] = {53, 29, 12, 4, 15, 3, 9, 1};
    VERIFIER_EGAL(estTasMax(a, 8), 1, "{53, 29, 12, 4, 15, 3, 9, 1} est un tas max");
    VERIFIER_EGAL(estTasMin(a, 8), 0, "{53, 29, 12, 4, 15, 3, 9, 1} n'est pas un tas min");

    int b[] = {9, 5, 8, 6, 1};
    VERIFIER_EGAL(estTasMax(b, 5), 0, "{9, 5, 8, 6, 1} n'est pas un tas max : 6 (case 3) est plus grand que son parent 5");

    int c[] = {1, 3, 2, 7, 4};
    VERIFIER_EGAL(estTasMin(c, 5), 1, "{1, 3, 2, 7, 4} est un tas min");
    VERIFIER_EGAL(estTasMax(c, 5), 0, "{1, 3, 2, 7, 4} n'est pas un tas max");

    int d[] = {7, 7, 7};
    VERIFIER(estTasMax(d, 3) == 1 && estTasMin(d, 3) == 1, "{7, 7, 7} est à la fois un tas max et un tas min (égalités permises)");

    int e[] = {10, 9, 8, 7, 6, 5, 4, 3, 2, 11};
    VERIFIER_EGAL(estTasMax(e, 10), 0, "{10, 9, ..., 2, 11} : la dernière case 11 est plus grande que son parent 6");
    VERIFIER_EGAL(estTasMax(e, 9), 1, "les 9 premières cases de {10, 9, ..., 2, 11} forment un tas max");

    int f[] = {20, 5, 18, 6, 4};
    VERIFIER_EGAL(estTasMax(f, 5), 0, "{20, 5, 18, 6, 4} : 6 (enfant gauche de 5) casse le tas, même si 18 < 20");

    int g[] = {10, 3, 9, 1, 2, 9, 12};
    VERIFIER_EGAL(estTasMax(g, 7), 0, "{10, 3, 9, 1, 2, 9, 12} : 12 (case 6, enfant droit) est plus grand que son parent 9");

    int un[] = {4};
    VERIFIER(estTasMax(un, 1) == 1 && estTasMin(un, 1) == 1, "un tableau d'une case est un tas");
    VERIFIER(estTasMax(un, 0) == 1 && estTasMin(un, 0) == 1, "un tableau vide est un tas");
    return BILAN();
}
