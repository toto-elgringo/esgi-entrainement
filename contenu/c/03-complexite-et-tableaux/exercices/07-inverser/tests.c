static int aide_egal(const int *a, const int *b, size_t n) {
    for (size_t i = 0; i < n; i++) {
        if (a[i] != b[i]) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int t1[] = {1, 2, 3, 4, 5, 6};
    inverser_portion(t1, 1, 4);
    VERIFIER(aide_egal(t1, (int[]){1, 4, 3, 2, 5, 6}, 6), "inverser les cases 1 à 3 de 1 2 3 4 5 6 donne 1 4 3 2 5 6");

    int t2[] = {1, 2, 3, 4};
    inverser_portion(t2, 2, 2);
    VERIFIER(aide_egal(t2, (int[]){1, 2, 3, 4}, 4), "une portion vide ne change rien");

    int t3[] = {1, 2, 3, 4};
    inverser_portion(t3, 0, 0);
    VERIFIER(aide_egal(t3, (int[]){1, 2, 3, 4}, 4), "la portion vide au tout début ne change rien");

    int t4[] = {1, 2, 3, 4, 5};
    inverser(t4, 5);
    VERIFIER(aide_egal(t4, (int[]){5, 4, 3, 2, 1}, 5), "inverser 1 2 3 4 5 (taille impaire) donne 5 4 3 2 1");

    int t5[] = {1, 2, 3, 4, 5, 6};
    inverser(t5, 6);
    VERIFIER(aide_egal(t5, (int[]){6, 5, 4, 3, 2, 1}, 6), "inverser 1 2 3 4 5 6 (taille paire) donne 6 5 4 3 2 1");

    int t6[] = {7};
    inverser(t6, 1);
    VERIFIER_EGAL(t6[0], 7, "inverser un tableau d'une case ne change rien");

    inverser(NULL, 0);
    VERIFIER(1, "inverser un tableau vide ne lit aucune case");
    return BILAN();
}
