#include <stdio.h>

int dichotomie(const int *tab, size_t n, int valeur) {
    size_t debut = 0;
    size_t fin = n;
    while (debut < fin) {
        size_t milieu = debut + (fin - debut) / 2;
        if (tab[milieu] == valeur) {
            return (int)milieu;
        }
        if (valeur < tab[milieu]) {
            fin = milieu;
        } else {
            debut = milieu + 1;
        }
    }
    return -1;
}

int main(void) {
    int tab[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91, 99};
    printf("23 : %d\n", dichotomie(tab, 11, 23));
    printf("20 : %d\n", dichotomie(tab, 11, 20));
    printf("1 : %d\n", dichotomie(tab, 11, 1));
    return 0;
}
