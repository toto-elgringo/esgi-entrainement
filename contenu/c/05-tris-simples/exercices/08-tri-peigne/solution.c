#include <stdio.h>

void echanger(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void tri_peigne(int *tab, size_t n) {
    size_t ecart = n;
    int echange = 1;
    while (ecart > 1 || echange) {
        ecart = ecart * 10 / 13;
        if (ecart < 1) {
            ecart = 1;
        }
        echange = 0;
        for (size_t i = 0; i + ecart < n; i++) {
            if (tab[i] > tab[i + ecart]) {
                echanger(&tab[i], &tab[i + ecart]);
                echange = 1;
            }
        }
    }
}

int main(void) {
    int tab[] = {8, 4, 1, 9, 3, 7, 2, 10, 6, 5};
    tri_peigne(tab, 10);
    for (size_t i = 0; i < 10; i++) {
        printf("%d ", tab[i]);
    }
    printf("\n");
    return 0;
}
