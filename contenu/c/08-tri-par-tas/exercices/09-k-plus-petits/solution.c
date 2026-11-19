#include <stdio.h>

void echanger(int *t, int i, int j) {
    int temporaire = t[i];
    t[i] = t[j];
    t[j] = temporaire;
}

void descendreMin(int *t, int taille, int i) {
    while (2 * i + 1 < taille) {
        int enfant = 2 * i + 1;
        if (enfant + 1 < taille && t[enfant + 1] < t[enfant]) {
            enfant = enfant + 1;
        }
        if (t[enfant] >= t[i]) {
            return;
        }
        echanger(t, i, enfant);
        i = enfant;
    }
}

void kPlusPetits(int *t, int n, int k, int *resultat) {
    for (int i = n / 2 - 1; i >= 0; i--) {
        descendreMin(t, n, i);
    }
    int taille = n;
    for (int j = 0; j < k; j++) {
        resultat[j] = t[0];
        taille = taille - 1;
        echanger(t, 0, taille);
        descendreMin(t, taille, 0);
    }
}

int main(void) {
    int t[] = {7, 2, 9, 4, 1, 8};
    int resultat[3] = {0};
    kPlusPetits(t, 6, 3, resultat);
    printf("les 3 plus petits : %d %d %d\n", resultat[0], resultat[1], resultat[2]);
    return 0;
}
