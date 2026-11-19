#include <stdio.h>

int egaux_tries(const int *a, size_t na, const int *b, size_t nb) {
    for (size_t i = 0; i < na - 1; i++) {
        if (a[i] != b[i]) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int a[] = {1, 2, 3};
    int b[] = {1, 2, 4};
    printf("1 2 3 et 1 2 3 : %d\n", egaux_tries(a, 3, a, 3));
    printf("1 2 3 et 1 2 4 : %d\n", egaux_tries(a, 3, b, 3));
    printf("1 2 et 1 2 3 : %d\n", egaux_tries(a, 2, a, 3));
    return 0;
}
