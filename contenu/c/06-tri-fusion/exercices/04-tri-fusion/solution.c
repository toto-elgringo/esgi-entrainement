#include <stdio.h>
#include <stdlib.h>

void fusionnerParties(int *t, int *aux, int debut, int milieu, int fin) {
    int i = debut;
    int j = milieu;
    int k = debut;
    while (i < milieu && j < fin) {
        if (t[i] <= t[j]) {
            aux[k++] = t[i++];
        } else {
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
}

void trierPartie(int *t, int *aux, int debut, int fin) {
    if (fin - debut <= 1) {
        return;
    }
    int milieu = debut + (fin - debut) / 2;
    trierPartie(t, aux, debut, milieu);
    trierPartie(t, aux, milieu, fin);
    fusionnerParties(t, aux, debut, milieu, fin);
}

void triFusion(int *t, int n) {
    if (n < 2) {
        return;
    }
    int *aux = malloc(n * sizeof(int));
    if (aux == NULL) {
        exit(EXIT_FAILURE);
    }
    trierPartie(t, aux, 0, n);
    free(aux);
}

int main(void) {
    int t[] = {7, 3, 10, 2, 9, 3, 6, 2};
    int n = 8;
    triFusion(t, n);
    for (int i = 0; i < n; i++) {
        printf("%d ", t[i]);
    }
    printf("\n");
    return 0;
}
