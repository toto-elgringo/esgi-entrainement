static int aide_egal(const int *a, const int *b, size_t n) {
    for (size_t i = 0; i < n; i++) {
        if (a[i] != b[i]) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int t1[] = {1, 2, 3, 4, 5};
    size_t n1 = 5;
    VERIFIER_EGAL(supprimer(t1, &n1, 2), 1, "supprimer la position 2 de 1 2 3 4 5 réussit");
    VERIFIER_EGAL(n1, 4, "après la suppression, la taille vaut 4");
    VERIFIER(aide_egal(t1, (int[]){1, 2, 4, 5}, 4), "le tableau devient 1 2 4 5");

    int t2[] = {7, 8, 9};
    size_t n2 = 3;
    supprimer(t2, &n2, 0);
    VERIFIER(n2 == 2 && aide_egal(t2, (int[]){8, 9}, 2), "supprimer la première case de 7 8 9 donne 8 9");

    int t3[] = {7, 8, 9};
    size_t n3 = 3;
    supprimer(t3, &n3, 2);
    VERIFIER(n3 == 2 && aide_egal(t3, (int[]){7, 8}, 2), "supprimer la dernière case de 7 8 9 donne 7 8");

    int t4[] = {7, 8, 9};
    size_t n4 = 3;
    VERIFIER_EGAL(supprimer(t4, &n4, 3), 0, "la position 3 n'existe pas dans un tableau de 3 cases : renvoie 0");
    VERIFIER(n4 == 3 && aide_egal(t4, (int[]){7, 8, 9}, 3), "une position invalide ne change ni la taille ni le tableau");

    int t5[] = {42};
    size_t n5 = 1;
    VERIFIER_EGAL(supprimer(t5, &n5, 0), 1, "on peut supprimer l'unique case d'un tableau");
    VERIFIER_EGAL(n5, 0, "il ne reste alors aucune case");
    VERIFIER_EGAL(supprimer(t5, &n5, 0), 0, "on ne peut rien supprimer dans un tableau vide");
    return BILAN();
}
