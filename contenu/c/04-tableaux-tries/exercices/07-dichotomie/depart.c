#include <stdio.h>

int dichotomie(const int *tab, size_t n, int valeur) {
    return -1;
}

int main(void) {
    int tab[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91, 99};
    printf("23 : %d\n", dichotomie(tab, 11, 23));
    printf("20 : %d\n", dichotomie(tab, 11, 20));
    printf("1 : %d\n", dichotomie(tab, 11, 1));
    return 0;
}
