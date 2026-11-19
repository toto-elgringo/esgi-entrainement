#include <stdio.h>
#include <stdlib.h>

int *fusionner(const int *a, size_t na, const int *b, size_t nb) {
    return NULL;
}

int main(void) {
    int a[] = {1, 4, 9};
    int b[] = {2, 3, 10, 11};
    int *res = fusionner(a, 3, b, 4);
    if (res == NULL) {
        printf("pas de résultat\n");
        return 0;
    }
    for (size_t k = 0; k < 7; k++) {
        printf("%d ", res[k]);
    }
    printf("\n");
    free(res);
    return 0;
}
