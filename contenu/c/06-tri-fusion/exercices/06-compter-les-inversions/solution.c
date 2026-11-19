#include <stdio.h>
#include <stdlib.h>

long long trierEtCompter(int *t, int *aux, int debut, int fin) {
    if (fin - debut <= 1) {
        return 0;
    }
    int milieu = debut + (fin - debut) / 2;
    long long total = trierEtCompter(t, aux, debut, milieu) + trierEtCompter(t, aux, milieu, fin);
    int i = debut;
    int j = milieu;
    int k = debut;
    while (i < milieu && j < fin) {
        if (t[i] <= t[j]) {
            aux[k++] = t[i++];
        } else {
            total += milieu - i;
            aux[k++] = t[j++];
        }
    }
    while (i < milieu) {
        aux[k++] = t[i++];
    }
    while (j < fin) {
        aux[k++] = t[j++];
    }
    for (k = debut; k < fin; k++) {
        t[k] = aux[k];
    }
    return total;
}

long long compterInversions(const int *t, int n) {
    if (n < 2) {
        return 0;
    }
    int *copie = malloc(n * sizeof(int));
    int *aux = malloc(n * sizeof(int));
    if (copie == NULL || aux == NULL) {
        exit(EXIT_FAILURE);
    }
    for (int i = 0; i < n; i++) {
        copie[i] = t[i];
    }
    long long total = trierEtCompter(copie, aux, 0, n);
    free(copie);
    free(aux);
    return total;
}

int main(void) {
    int t[] = {2, 4, 1, 3, 5};
    printf("%lld inversions\n", compterInversions(t, 5));
    return 0;
}
