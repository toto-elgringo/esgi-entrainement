#include <stdio.h>

void echanger(int *t, int i, int j) {
    int temporaire = t[i];
    t[i] = t[j];
    t[j] = temporaire;
}

int partition(int *t, int n, int indicePivot) {
    return 0;
}

int main(void) {
    int t[] = {4, 9, 1, 6, 8, 2, 7};
    int p = partition(t, 7, 3);
    printf("Le pivot est à l'indice %d : ", p);
    for (int i = 0; i < 7; i++) {
        printf("%d ", t[i]);
    }
    printf("\n");
    return 0;
}
