#include <stdio.h>

void inserer(int *tab, size_t n, size_t position, int valeur) {
    for (size_t i = n; i > position - 1; i--) {
        tab[i] = tab[i - 1];
    }
    tab[position] = valeur;
}

void ajouter_devant(int *tab, size_t n, int valeur) {
    inserer(tab, n, 0, valeur);
}

int main(void) {
    int tab[8] = {2, 4};
    size_t n = 2;
    inserer(tab, n, 1, 3);
    n++;
    ajouter_devant(tab, n, 1);
    n++;
    for (size_t i = 0; i < n; i++) {
        printf("%d ", tab[i]);
    }
    printf("\n");
    return 0;
}
