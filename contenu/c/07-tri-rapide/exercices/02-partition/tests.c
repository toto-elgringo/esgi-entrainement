static int aide_somme(const int *t, int n) {
    int somme = 0;
    for (int i = 0; i < n; i++) {
        somme += t[i] * t[i] + t[i];
    }
    return somme;
}

static int aide_bien_partitionne(const int *t, int n, int p, int pivot) {
    if (p < 0 || p >= n || t[p] != pivot) {
        return 0;
    }
    for (int i = 0; i < p; i++) {
        if (t[i] >= pivot) {
            return 0;
        }
    }
    for (int i = p + 1; i < n; i++) {
        if (t[i] < pivot) {
            return 0;
        }
    }
    return 1;
}

static int aide_essayer(int *t, int n, int indicePivot) {
    int pivot = t[indicePivot];
    int avant = aide_somme(t, n);
    int p = partition(t, n, indicePivot);
    return aide_bien_partitionne(t, n, p, pivot) && aide_somme(t, n) == avant;
}

int main(void) {
    int a[] = {4, 9, 1, 6, 8, 2, 7};
    int pa = partition(a, 7, 3);
    VERIFIER_EGAL(pa, 3, "pivot 6 dans {4, 9, 1, 6, 8, 2, 7} : il finit à l'indice 3");
    VERIFIER(aide_bien_partitionne(a, 7, pa, 6), "les valeurs avant le pivot 6 sont plus petites, celles d'après plus grandes");

    int b[] = {4, 9, 1, 6, 8, 2, 7};
    VERIFIER_EGAL(partition(b, 7, 2), 0, "pivot 1 (le minimum) : il finit à l'indice 0");

    int c[] = {4, 9, 1, 6, 8, 2, 7};
    VERIFIER_EGAL(partition(c, 7, 1), 6, "pivot 9 (le maximum) : il finit à l'indice 6");

    int d[] = {3, 8, 2, 5, 1, 4, 7, 6};
    VERIFIER(aide_essayer(d, 8, 0), "{3, 8, 2, 5, 1, 4, 7, 6} avec le pivot 3 (première case) est bien partitionné, sans perdre de valeur");

    int e[] = {3, 8, 2, 5, 1, 4, 7, 6};
    VERIFIER(aide_essayer(e, 8, 7), "{3, 8, 2, 5, 1, 4, 7, 6} avec le pivot 6 (dernière case) est bien partitionné");

    int f[] = {5, 2, 5, 9, 5, 1};
    VERIFIER(aide_essayer(f, 6, 2), "{5, 2, 5, 9, 5, 1} avec le pivot 5 (des doublons) est bien partitionné");

    int un[] = {42};
    VERIFIER_EGAL(partition(un, 1, 0), 0, "un tableau d'une case : le pivot reste à l'indice 0");

    int deux[] = {8, 3};
    VERIFIER(partition(deux, 2, 0) == 1 && deux[0] == 3 && deux[1] == 8, "{8, 3} avec le pivot 8 donne {3, 8} et renvoie 1");

    int grand[1000];
    for (int i = 0; i < 1000; i++) {
        grand[i] = (i * 7919) % 1000;
    }
    VERIFIER(aide_essayer(grand, 1000, 500), "1 000 valeurs mélangées sont bien partitionnées autour de la case 500");
    return BILAN();
}
