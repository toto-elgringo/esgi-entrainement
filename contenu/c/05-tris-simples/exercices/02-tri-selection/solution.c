#include <stdio.h>

size_t nb_echanges = 0;

void echanger(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
    nb_echanges++;
}

void tri_selection(int *tab, size_t n) {
    for (size_t i = 0; i + 1 < n; i++) {
        size_t pos_min = i;
        for (size_t j = i + 1; j < n; j++) {
            if (tab[j] < tab[pos_min]) {
                pos_min = j;
            }
        }
        if (pos_min != i) {
            echanger(&tab[i], &tab[pos_min]);
        }
    }
}

int main(void) {
    int tab[] = {5, 2, 9, 1, 7};
    tri_selection(tab, 5);
    for (size_t i = 0; i < 5; i++) {
        printf("%d ", tab[i]);
    }
    printf("(%zu échanges)\n", nb_echanges);
    return 0;
}
