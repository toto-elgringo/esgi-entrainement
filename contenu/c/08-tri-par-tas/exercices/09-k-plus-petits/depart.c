#include <stdio.h>

void echanger(int *t, int i, int j) {
    int temporaire = t[i];
    t[i] = t[j];
    t[j] = temporaire;
}

void descendreMin(int *t, int taille, int i) {
}

void kPlusPetits(int *t, int n, int k, int *resultat) {
}

int main(void) {
    int t[] = {7, 2, 9, 4, 1, 8};
    int resultat[3] = {0};
    kPlusPetits(t, 6, 3, resultat);
    printf("les 3 plus petits : %d %d %d\n", resultat[0], resultat[1], resultat[2]);
    return 0;
}
