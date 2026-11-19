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
    if (n < 2) {
        return;
    }
    size_t debut = 0;
    size_t fin = n - 1;
    int echange = 1;
    while (echange) {
        echange = 0;
        for (size_t i = debut; i < fin; i++) {
            if (plus_grand(tab[i], tab[i + 1])) {
                echanger(&tab[i], &tab[i + 1]);
                echange = 1;
            }
        }
        if (!echange) {
            return;
        }
        fin--;
        echange = 0;
        for (size_t i = fin; i > debut; i--) {
            if (plus_grand(tab[i - 1], tab[i])) {
                echanger(&tab[i - 1], &tab[i]);
                echange = 1;
            }
        }
        debut++;
    }
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
