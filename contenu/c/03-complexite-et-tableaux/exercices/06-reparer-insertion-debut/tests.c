static int aide_egal(const int *a, const int *b, size_t n) {
    for (size_t i = 0; i < n; i++) {
        if (a[i] != b[i]) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int t1[6] = {1, 2, 4, 5};
    inserer(t1, 4, 2, 3);
    VERIFIER(aide_egal(t1, (int[]){1, 2, 3, 4, 5}, 5), "insérer 3 en position 2 dans 1 2 4 5 donne 1 2 3 4 5");

    int t2[6] = {1, 2, 3};
    inserer(t2, 3, 3, 4);
    VERIFIER(aide_egal(t2, (int[]){1, 2, 3, 4}, 4), "insérer 4 à la fin de 1 2 3 donne 1 2 3 4");

    int t3[6] = {2, 3, 4};
    ajouter_devant(t3, 3, 1);
    VERIFIER_EGAL(t3[0], 1, "après ajouter_devant(1), la première case vaut 1");
    VERIFIER(aide_egal(t3, (int[]){1, 2, 3, 4}, 4), "ajouter 1 devant 2 3 4 donne 1 2 3 4 (aucune valeur perdue)");

    int t4[2] = {0};
    ajouter_devant(t4, 0, 9);
    VERIFIER_EGAL(t4[0], 9, "ajouter 9 devant un tableau vide donne 9");
    return BILAN();
}
