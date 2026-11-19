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

void tri_cocktail(int *tab, size_t n) {
}

int main(void) {
    int tab[] = {2, 3, 4, 5, 6, 1};
    tri_cocktail(tab, 6);
    for (size_t i = 0; i < 6; i++) {
        printf("%d ", tab[i]);
    }
    printf("(%zu comparaisons)\n", nb_comparaisons);
    return 0;
}
