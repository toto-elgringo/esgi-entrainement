#include <stdio.h>

void echanger(int *t, int i, int j) {
    int temporaire = t[i];
    t[i] = t[j];
    t[j] = temporaire;
}

void insererDernier(int *t, int taille) {
    int i = taille - 1;
    while (i > 0 && t[i] > t[(i - 1) / 2]) {
        echanger(t, i, (i - 1) / 2);
        i = (i - 1) / 2;
    }
}

void retirerRacine(int *t, int taille) {
    int fin = taille - 1;
    echanger(t, 0, fin);
    int i = 0;
    while (2 * i + 1 < fin) {
        int enfant = 2 * i + 1;
        if (enfant + 1 < fin && t[enfant + 1] > t[enfant]) {
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
    for (int taille = 2; taille <= n; taille++) {
        insererDernier(t, taille);
    }
    for (int taille = n; taille >= 2; taille--) {
        retirerRacine(t, taille);
    }
}

int main(void) {
    int t[] = {3, 1, 2};
    triParTas(t, 3);
    for (int i = 0; i < 3; i++) {
        printf("%d ", t[i]);
    }
    printf("\n");
    return 0;
}
