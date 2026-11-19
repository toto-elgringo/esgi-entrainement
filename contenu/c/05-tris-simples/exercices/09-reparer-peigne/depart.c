#include <stdio.h>

void echanger(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void tri_peigne(int *tab, size_t n) {
    size_t ecart = n;
    while (ecart > 1) {
        ecart = ecart * 10 / 13;
        for (size_t i = 0; i + ecart < n; i++) {
            if (tab[i] > tab[i + ecart]) {
                echanger(&tab[i], &tab[i + ecart]);
            }
        }
    }
    return tab;
}

int main(void) {
    int tab[] = {8, 11, 4, 7, 6, 3, 5, 12, 1, 9, 10, 2};
    tri_peigne(tab, 12);
    for (size_t i = 0; i < 12; i++) {
        printf("%d ", tab[i]);
    }
    printf("\n");
    return 0;
}
