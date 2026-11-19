#include <stdio.h>

size_t nb_comparaisons = 0;

int plus_grand(int a, int b) {
    nb_comparaisons++;
    return a > b;
}

void echanger(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void tri_pair_impair(int *tab, size_t n) {
    int echange = 1;
    while (echange) {
        echange = 0;
        for (size_t i = 0; i + 1 < n; i += 2) {
            if (plus_grand(tab[i], tab[i + 1])) {
                echanger(&tab[i], &tab[i + 1]);
                echange = 1;
            }
        }
        for (size_t i = 1; i + 1 < n; i += 2) {
            if (plus_grand(tab[i], tab[i + 1])) {
                echanger(&tab[i], &tab[i + 1]);
                echange = 1;
            }
        }
    }
}

int main(void) {
    int zone[] = {5, 2, 9, 1, 7, -100};
    tri_pair_impair(zone, 5);
    for (size_t i = 0; i < 5; i++) {
        printf("%d ", zone[i]);
    }
    printf("(%zu comparaisons)\n", nb_comparaisons);
    return 0;
}
