#include <stdio.h>

void echanger(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

size_t compter_inversions(const int *tab, size_t n) {
    size_t total = 0;
    for (size_t i = 0; i < n; i++) {
        for (size_t j = i + 1; j < n; j++) {
            if (tab[i] > tab[j]) {
                total++;
            }
        }
    }
    return total;
}

void tri_bulles_compte(int *tab, size_t n, size_t *comparaisons, size_t *echanges) {
    *comparaisons = 0;
    *echanges = 0;
    for (size_t fin = n; fin > 1; fin--) {
        int echange = 0;
        for (size_t j = 0; j + 1 < fin; j++) {
            (*comparaisons)++;
            if (tab[j] > tab[j + 1]) {
                echanger(&tab[j], &tab[j + 1]);
                (*echanges)++;
                echange = 1;
            }
        }
        if (!echange) {
            return;
        }
    }
}

int main(void) {
    int tab[] = {5, 2, 9, 1, 7};
    size_t comparaisons = 0;
    size_t echanges = 0;
    printf("%zu inversions\n", compter_inversions(tab, 5));
    tri_bulles_compte(tab, 5, &comparaisons, &echanges);
    printf("%zu comparaisons, %zu échanges\n", comparaisons, echanges);
    return 0;
}
