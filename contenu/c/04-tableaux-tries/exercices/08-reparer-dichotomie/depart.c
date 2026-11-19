#include <stdint.h>
#include <stdio.h>

size_t milieu(size_t debut, size_t fin) {
    return (debut + fin) / 2;
}

int dichotomie(const int *tab, size_t n, int valeur) {
    size_t debut = 0;
    size_t fin = n;
    while (debut < fin) {
        size_t m = milieu(debut, fin);
        if (tab[m] == valeur) {
            return (int)m;
        }
        if (valeur < tab[m]) {
            fin = m - 1;
        } else {
            debut = m;
        }
    }
    return -1;
}

int main(void) {
    int tab[] = {1, 3, 5};
    printf("milieu(SIZE_MAX - 10, SIZE_MAX - 2) = %zu\n", milieu(SIZE_MAX - 10, SIZE_MAX - 2));
    printf("attendu                             = %zu\n", SIZE_MAX - 6);
    printf("position de 1 dans 1 3 5 : %d\n", dichotomie(tab, 3, 1));
    return 0;
}
