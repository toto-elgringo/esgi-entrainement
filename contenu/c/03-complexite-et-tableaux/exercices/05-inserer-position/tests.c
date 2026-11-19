static int aide_egal(const int *a, const int *b, size_t n) {
    for (size_t i = 0; i < n; i++) {
        if (a[i] != b[i]) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int t1[8] = {1, 2, 3, 4, 5};
    size_t n1 = 5;
    VERIFIER_EGAL(inserer(t1, &n1, 8, 2, 10), 1, "insérer 10 en position 2 dans 1 2 3 4 5 réussit");
    VERIFIER_EGAL(n1, 6, "la taille passe à 6");
    VERIFIER(aide_egal(t1, (int[]){1, 2, 10, 3, 4, 5}, 6), "le tableau devient 1 2 10 3 4 5");

    int t2[5] = {7, 8, 9};
    size_t n2 = 3;
    inserer(t2, &n2, 5, 0, 6);
    VERIFIER(n2 == 4 && aide_egal(t2, (int[]){6, 7, 8, 9}, 4), "insérer 6 en position 0 dans 7 8 9 donne 6 7 8 9");

    int t3[5] = {7, 8, 9};
    size_t n3 = 3;
    inserer(t3, &n3, 5, 3, 10);
    VERIFIER(n3 == 4 && aide_egal(t3, (int[]){7, 8, 9, 10}, 4), "insérer 10 en position 3 (après la fin) dans 7 8 9 donne 7 8 9 10");

    int t4[3] = {7, 8, 9};
    size_t n4 = 3;
    VERIFIER_EGAL(inserer(t4, &n4, 3, 1, 5), 0, "un tableau plein refuse l'insertion (renvoie 0)");
    VERIFIER(n4 == 3 && aide_egal(t4, (int[]){7, 8, 9}, 3), "un tableau plein n'est pas modifié");

    int t5[5] = {7, 8, 9};
    size_t n5 = 3;
    VERIFIER_EGAL(inserer(t5, &n5, 5, 4, 5), 0, "la position 4 est trop loin pour un tableau de 3 cases : renvoie 0");
    VERIFIER_EGAL(n5, 3, "une position invalide ne change pas la taille");

    int t6[2] = {0};
    size_t n6 = 0;
    inserer(t6, &n6, 2, 0, 4);
    inserer(t6, &n6, 2, 0, 3);
    VERIFIER(n6 == 2 && aide_egal(t6, (int[]){3, 4}, 2), "insérer 4 puis 3 en position 0 dans un tableau vide donne 3 4");
    return BILAN();
}
