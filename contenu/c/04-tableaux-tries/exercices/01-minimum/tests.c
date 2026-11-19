int main(void) {
    int t1[] = {42, -4, 6, 3};
    VERIFIER_EGAL(minimum(t1, 4), -4, "le minimum de 42 -4 6 3 vaut -4");

    int t2[] = {5, 8, 3, 9};
    VERIFIER_EGAL(minimum(t2, 4), 3, "le minimum de 5 8 3 9 vaut 3 (toutes les valeurs sont positives)");

    int t3[] = {7};
    VERIFIER_EGAL(minimum(t3, 1), 7, "le minimum d'un tableau d'une case est cette case");

    int t4[] = {-1, 4, 2, 8};
    VERIFIER_EGAL(minimum(t4, 4), -1, "le minimum peut être dans la première case");

    int t5[] = {4, 2, 8, -9};
    VERIFIER_EGAL(minimum(t5, 4), -9, "le minimum peut être dans la dernière case");

    int t6[] = {-3, -7, -5};
    VERIFIER_EGAL(minimum(t6, 3), -7, "le minimum de -3 -7 -5 vaut -7");

    int t7[] = {6, 6, 6};
    VERIFIER_EGAL(minimum(t7, 3), 6, "le minimum de 6 6 6 vaut 6");
    return BILAN();
}
