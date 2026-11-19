static int aide_egal(const int *t, const int *attendu, int n) {
    for (int i = 0; i < n; i++) {
        if (t[i] != attendu[i]) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int a[] = {1, 4, 9};
    int b[] = {2, 3, 10, 11};
    int r[8] = {0, 0, 0, 0, 0, 0, 0, -1};
    fusionner(a, 3, b, 4, r);
    int attendu[] = {1, 2, 3, 4, 9, 10, 11};
    VERIFIER_EGAL(r[0], 1, "{1, 4, 9} et {2, 3, 10, 11} : la première case vaut 1");
    VERIFIER_EGAL(r[6], 11, "{1, 4, 9} et {2, 3, 10, 11} : la dernière case vaut 11");
    VERIFIER(aide_egal(r, attendu, 7), "{1, 4, 9} et {2, 3, 10, 11} donnent {1, 2, 3, 4, 9, 10, 11}");
    VERIFIER_EGAL(r[7], -1, "rien n'est écrit après les na + nb cases du résultat");

    int petits[] = {1, 2};
    int grands[] = {5, 6, 7};
    int r2[5] = {0};
    fusionner(petits, 2, grands, 3, r2);
    int attendu2[] = {1, 2, 5, 6, 7};
    VERIFIER(aide_egal(r2, attendu2, 5), "{1, 2} et {5, 6, 7} donnent {1, 2, 5, 6, 7} (la fin de b est recopiée)");

    int r3[5] = {0};
    fusionner(grands, 3, petits, 2, r3);
    VERIFIER(aide_egal(r3, attendu2, 5), "{5, 6, 7} et {1, 2} donnent {1, 2, 5, 6, 7} (la fin de a est recopiée)");

    int r4[3] = {0};
    fusionner(petits, 0, grands, 3, r4);
    VERIFIER(aide_egal(r4, grands, 3), "un tableau vide et {5, 6, 7} donnent {5, 6, 7}");

    int r5[2] = {0};
    fusionner(petits, 2, grands, 0, r5);
    VERIFIER(aide_egal(r5, petits, 2), "{1, 2} et un tableau vide donnent {1, 2}");

    int d1[] = {2, 2, 5};
    int d2[] = {2, 3};
    int r6[5] = {0};
    fusionner(d1, 3, d2, 2, r6);
    int attendu6[] = {2, 2, 2, 3, 5};
    VERIFIER(aide_egal(r6, attendu6, 5), "{2, 2, 5} et {2, 3} donnent {2, 2, 2, 3, 5} (doublons gardés)");

    int n1[] = {-8, -1, 6};
    int n2[] = {-5, 0};
    int r7[5] = {0};
    fusionner(n1, 3, n2, 2, r7);
    int attendu7[] = {-8, -5, -1, 0, 6};
    VERIFIER(aide_egal(r7, attendu7, 5), "{-8, -1, 6} et {-5, 0} donnent {-8, -5, -1, 0, 6}");
    return BILAN();
}
