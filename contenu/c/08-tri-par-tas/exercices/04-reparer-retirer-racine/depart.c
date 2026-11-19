#include <stdio.h>

void echanger(int *t, int i, int j) {
    int temporaire = t[i];
    t[i] = t[j];
    t[j] = temporaire;
}

int retirerRacine(int *t, int *taille) {
    int n = *taille;
    echanger(t, 0, n - 1);
    *taille = n - 1;
    int i = 0;
    while (1) {
        int gauche = 2 * i + 1;
        int droite = 2 * i + 2;
        int plusGrand = i;
        if (gauche < n && t[gauche] > t[plusGrand]) {
            plusGrand = gauche;
        }
        if (droite < n && t[droite] > t[plusGrand]) {
            plusGrand = droite;
        }
        if (plusGrand == i) {
            break;
        }
        echanger(t, i, plusGrand);
        i = plusGrand;
    }
    return t[n - 1];
}

int main(void) {
    int t[] = {9, 5, 8, 1, 2, 7};
    int taille = 6;
    int retire = retirerRacine(t, &taille);
    printf("retiré : %d, taille : %d\n", retire, taille);
    for (int i = 0; i < 6; i++) {
        printf("%d ", t[i]);
    }
    printf("\n");
    return 0;
}
