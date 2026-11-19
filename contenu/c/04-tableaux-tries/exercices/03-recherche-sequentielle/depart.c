#include <stdio.h>

int position(const int *tab, size_t n, int valeur) {
    return -1;
}

int main(void) {
    int tab[] = {42, -4, 6, 3, 6};
    printf("6 : %d\n", position(tab, 5, 6));
    printf("2 : %d\n", position(tab, 5, 2));
    return 0;
}
