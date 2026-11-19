#include <stdio.h>

int minimum(const int *tab, size_t n) {
    int min = tab[0];
    for (size_t i = 1; i < n; i++) {
        if (tab[i] < min) {
            min = tab[i];
        }
    }
    return min;
}

int main(void) {
    int tab[] = {5, 2, -6, 3, -2};
    printf("minimum : %d\n", minimum(tab, 5));
    return 0;
}
