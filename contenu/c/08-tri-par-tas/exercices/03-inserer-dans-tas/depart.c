#include <stdio.h>

void echanger(int *t, int i, int j) {
    int temporaire = t[i];
    t[i] = t[j];
    t[j] = temporaire;
}

void insererTas(int *t, int *taille, int valeur) {
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
