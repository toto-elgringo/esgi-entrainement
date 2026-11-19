#include <stdio.h>

int inserer(int *tab, size_t *n, size_t capacite, size_t position, int valeur) {
    return 0;
}

int main(void) {
    int tab[8] = {1, 2, 3, 4, 5};
    size_t n = 5;
    inserer(tab, &n, 8, 2, 10);
    for (size_t i = 0; i < n; i++) {
        printf("%d ", tab[i]);
    }
    printf("(taille %zu)\n", n);
    return 0;
}
