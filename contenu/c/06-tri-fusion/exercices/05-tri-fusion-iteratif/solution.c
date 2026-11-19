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

void triFusionIteratif(int *t, int n) {
    if (n < 2) {
        return;
    }
    int *aux = malloc(n * sizeof(int));
    if (aux == NULL) {
        exit(EXIT_FAILURE);
    }
    for (int largeur = 1; largeur < n; largeur *= 2) {
        for (int debut = 0; debut + largeur < n; debut += 2 * largeur) {
            int milieu = debut + largeur;
            int fin = milieu + largeur;
            if (fin > n) {
                fin = n;
            }
            fusionnerParties(t, aux, debut, milieu, fin);
        }
    }
    free(aux);
}

int main(void) {
    int t[] = {7, 3, 10, 2, 9, 3, 6};
    int n = 7;
    triFusionIteratif(t, n);
    for (int i = 0; i < n; i++) {
        printf("%d ", t[i]);
    }
    printf("\n");
    return 0;
}
