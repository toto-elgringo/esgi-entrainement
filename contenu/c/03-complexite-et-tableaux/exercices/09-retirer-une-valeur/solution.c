#include <stdio.h>

size_t retirer(int *tab, size_t n, int valeur) {
    size_t ecriture = 0;
    for (size_t lecture = 0; lecture < n; lecture++) {
        if (tab[lecture] != valeur) {
            tab[ecriture] = tab[lecture];
            ecriture++;
        }
    }
    return ecriture;
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
