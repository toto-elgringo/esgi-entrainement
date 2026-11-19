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

void triParTas(int *t, int n) {
    for (int i = n / 2 - 1; i >= 0; i--) {
        descendre(t, n, i);
    }
    for (int fin = n - 1; fin > 0; fin--) {
        echanger(t, 0, fin);
        descendre(t, fin, 0);
    }
}

int main(void) {
    int t[] = {5, 9, 1, 8, 3};
    triParTas(t, 5);
    for (int i = 0; i < 5; i++) {
        printf("%d ", t[i]);
    }
    printf("\n");
    return 0;
}
