#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int egaux(const int *a, const int *b, size_t n) {
    return 0;
}

int main(void) {
    int a[] = {1, 1, 2, 3, 4};
    int b[] = {3, 2, 1, 4, 1};
    int c[] = {1, 2, 2, 3};
    int d[] = {1, 2, 3, 3};
    printf("1 1 2 3 4 et 3 2 1 4 1 : %d\n", egaux(a, b, 5));
    printf("1 2 2 3 et 1 2 3 3 : %d\n", egaux(c, d, 4));
    return 0;
}
