#include <stdio.h>

void echanger(int *t, int i, int j) {
    int temporaire = t[i];
    t[i] = t[j];
    t[j] = temporaire;
}

void descendre(int *t, int taille, int i) {
}

void triParTas(int *t, int n) {
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
