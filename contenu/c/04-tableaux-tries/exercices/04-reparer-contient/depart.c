#include <stdio.h>

int contient(const int *tab, size_t n, int valeur) {
    for (size_t i = 0; i < n; i++) {
        if (tab[i] == valeur) {
            return 1;
        } else {
            return 0;
        }
    }
    return 0;
}

int main(void) {
    int tab[] = {42, -4, 6, 3};
    printf("42 : %d\n", contient(tab, 4, 42));
    printf("6 : %d\n", contient(tab, 4, 6));
    printf("2 : %d\n", contient(tab, 4, 2));
    return 0;
}
