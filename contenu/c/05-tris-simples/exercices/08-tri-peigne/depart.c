#include <stdio.h>

void echanger(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void tri_peigne(int *tab, size_t n) {
}

int main(void) {
    int tab[] = {8, 4, 1, 9, 3, 7, 2, 10, 6, 5};
    tri_peigne(tab, 10);
    for (size_t i = 0; i < 10; i++) {
        printf("%d ", tab[i]);
    }
    printf("\n");
    return 0;
}
