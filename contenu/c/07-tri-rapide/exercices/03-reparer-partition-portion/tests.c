static int aide_bien_partitionne(const int *t, int debut, int fin, int p, int pivot) {
    if (p < debut || p >= fin || t[p] != pivot) {
        return 0;
    }
    for (int i = debut; i < p; i++) {
        if (t[i] >= pivot) {
            return 0;
        }
    }
    for (int i = p + 1; i < fin; i++) {
        if (t[i] < pivot) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int entier[] = {4, 9, 1, 6, 8, 2, 7};
    int p0 = partition(entier, 0, 7, 3);
    VERIFIER(p0 == 3 && aide_bien_partitionne(entier, 0, 7, p0, 6), "sur le tableau entier [0, 7) : le pivot 6 finit à l'indice 3");

    int t[] = {100, 200, 4, 9, 1, 6, 8, 2, 7, 300};
    int p = partition(t, 2, 9, 5);
    VERIFIER_EGAL(p, 5, "portion [2, 9) avec le pivot 6 : il finit à l'indice 5 (2 + trois valeurs plus petites)");
    VERIFIER(aide_bien_partitionne(t, 2, 9, p, 6), "portion [2, 9) : les valeurs avant le pivot sont plus petites, celles d'après plus grandes");
    VERIFIER(t[0] == 100 && t[1] == 200 && t[9] == 300, "les cases hors de la portion (100, 200, 300) n'ont pas bougé");

    int u[] = {1, 2, 3, 9, 5, 7};
    int pu = partition(u, 3, 6, 4);
    VERIFIER_EGAL(pu, 3, "portion [3, 6) de {1, 2, 3, 9, 5, 7} avec le pivot 5 : il finit au début de la portion (indice 3)");
    VERIFIER(u[0] == 1 && u[1] == 2 && u[2] == 3, "les trois premières cases (hors portion) n'ont pas bougé");
    VERIFIER(u[3] == 5 && u[4] >= 5 && u[5] >= 5, "après : 5 puis les deux plus grandes");

    int v[] = {0, 0, 0, 0, 8, 3, 6, 1};
    int pv = partition(v, 4, 8, 4);
    VERIFIER_EGAL(pv, 7, "portion [4, 8) avec le pivot 8 (le maximum) : il finit à la dernière case de la portion");
    VERIFIER(aide_bien_partitionne(v, 4, 8, pv, 8) && v[0] == 0 && v[3] == 0, "portion [4, 8) bien partitionnée, le début du tableau intact");

    int w[] = {5, 5, 2, 7};
    VERIFIER_EGAL(partition(w, 2, 3, 2), 2, "une portion d'une seule case [2, 3) : le pivot reste à l'indice 2");
    VERIFIER(w[0] == 5 && w[1] == 5 && w[2] == 2 && w[3] == 7, "et rien d'autre ne bouge");
    return BILAN();
}
