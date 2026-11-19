#include <stdio.h>

void echanger(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

size_t compter_inversions(const int *tab, size_t n) {
    return 0;
}

void tri_bulles_compte(int *tab, size_t n, size_t *comparaisons, size_t *echanges) {
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
