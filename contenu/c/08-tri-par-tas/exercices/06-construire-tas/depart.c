#include <stdio.h>

void echanger(int *t, int i, int j) {
    int temporaire = t[i];
    t[i] = t[j];
    t[j] = temporaire;
}

void descendre(int *t, int taille, int i) {
    while (2 * i + 1 < taille) {
        int enfant = 2 * i + 1;
        if (enfant + 1 < taille && t[enfant + 1] > t[enfant]) {
            enfant = enfant + 1;
        }
        if (t[enfant] <= t[i]) {
            return;
        }
        echanger(t, i, enfant);
        i = enfant;
    }
}

void construireTas(int *t, int n) {
}

int main(void) {
    int t[] = {1, 2, 3, 4, 5, 6, 7};
    construireTas(t, 7);
    for (int i = 0; i < 7; i++) {
        printf("%d ", t[i]);
    }
    printf("\n");
    return 0;
}
