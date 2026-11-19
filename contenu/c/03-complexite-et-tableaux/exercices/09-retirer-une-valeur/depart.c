#include <stdio.h>

size_t retirer(int *tab, size_t n, int valeur) {
    return n;
}

int main(void) {
    int tab[] = {3, 0, 1, 0, 0, 2};
    size_t n = retirer(tab, 6, 0);
    for (size_t i = 0; i < n; i++) {
        printf("%d ", tab[i]);
    }
    printf("(taille %zu)\n", n);
    return 0;
}
