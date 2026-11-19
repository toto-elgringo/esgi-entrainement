#include <stdio.h>

void echanger(int *t, int i, int j) {
    int temporaire = t[i];
    t[i] = t[j];
    t[j] = temporaire;
}

void insererTas(int *t, int *taille, int valeur) {
    int i = *taille;
    t[i] = valeur;
    *taille = *taille + 1;
    while (i > 0 && t[i] > t[(i - 1) / 2]) {
        echanger(t, i, (i - 1) / 2);
        i = (i - 1) / 2;
    }
}

int main(void) {
    int t[10] = {54, 28, 12, 5, 3};
    int taille = 5;
    insererTas(t, &taille, 30);
    insererTas(t, &taille, 72);
    for (int i = 0; i < taille; i++) {
        printf("%d ", t[i]);
    }
    printf("\n");
    return 0;
}
