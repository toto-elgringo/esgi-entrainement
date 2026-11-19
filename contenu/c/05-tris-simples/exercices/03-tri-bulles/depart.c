#include <stdio.h>

size_t nb_comparaisons = 0;
size_t nb_echanges = 0;

int plus_grand(int a, int b) {
    nb_comparaisons++;
    return a > b;
}

void echanger(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
    nb_echanges++;
}

void tri_bulles(int *tab, size_t n) {
}

int main(void) {
    int tab[] = {5, 2, 9, 1, 7};
    tri_bulles(tab, 5);
    for (size_t i = 0; i < 5; i++) {
        printf("%d ", tab[i]);
    }
    printf("(%zu comparaisons, %zu échanges)\n", nb_comparaisons, nb_echanges);
    return 0;
}
