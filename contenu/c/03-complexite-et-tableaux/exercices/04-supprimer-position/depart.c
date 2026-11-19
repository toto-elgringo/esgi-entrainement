#include <stdio.h>

int supprimer(int *tab, size_t *n, size_t position) {
    return 0;
}

int main(void) {
    int tab[] = {1, 2, 3, 4, 5};
    size_t n = 5;
    supprimer(tab, &n, 2);
    for (size_t i = 0; i < n; i++) {
        printf("%d ", tab[i]);
    }
    printf("(taille %zu)\n", n);
    return 0;
}
