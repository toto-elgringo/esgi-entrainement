#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int comparer(const void *x, const void *y) {
    int a = *(const int *)x;
    int b = *(const int *)y;
    return (a > b) - (a < b);
}

static int *copie_triee(const int *tab, size_t n) {
    int *copie = malloc(n * sizeof(int));
    if (copie == NULL) {
        return NULL;
    }
    memcpy(copie, tab, n * sizeof(int));
    qsort(copie, n, sizeof(int), comparer);
    return copie;
}

int egaux(const int *a, const int *b, size_t n) {
    if (n == 0) {
        return 1;
    }
    int *ca = copie_triee(a, n);
    int *cb = copie_triee(b, n);
    int resultat = ca != NULL && cb != NULL;
    for (size_t i = 0; resultat && i < n; i++) {
        if (ca[i] != cb[i]) {
            resultat = 0;
        }
    }
    free(ca);
    free(cb);
    return resultat;
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
