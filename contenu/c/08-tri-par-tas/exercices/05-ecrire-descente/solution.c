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

int main(void) {
    int t[] = {3, 9, 8, 5, 7, 1, 2};
    descendre(t, 7, 0);
    for (int i = 0; i < 7; i++) {
        printf("%d ", t[i]);
    }
    printf("\n");
    return 0;
}
