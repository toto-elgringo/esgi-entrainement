#include <stdio.h>

size_t nb_comparaisons = 0;

int plus_grand(int a, int b) {
    nb_comparaisons++;
    return a > b;
}

void tri_insertion(int *tab, size_t n) {
    for (size_t i = 1; i < n; i++) {
        int valeur = tab[i];
        size_t j = i;
        while (j > 0 && plus_grand(tab[j - 1], valeur)) {
            tab[j] = tab[j - 1];
            j--;
        }
        tab[j] = valeur;
    }
}

int main(void) {
    int tab[] = {5, 2, 9, 1, 7};
    tri_insertion(tab, 5);
    for (size_t i = 0; i < 5; i++) {
        printf("%d ", tab[i]);
    }
    printf("(%zu comparaisons)\n", nb_comparaisons);
    return 0;
}
