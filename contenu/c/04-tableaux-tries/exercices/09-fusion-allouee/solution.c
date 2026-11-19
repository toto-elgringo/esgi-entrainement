#include <stdio.h>
#include <stdlib.h>

int *fusionner(const int *a, size_t na, const int *b, size_t nb) {
    if (na + nb == 0) {
        return NULL;
    }
    int *res = malloc((na + nb) * sizeof(int));
    if (res == NULL) {
        return NULL;
    }
    size_t i = 0;
    size_t j = 0;
    size_t k = 0;
    while (i < na && j < nb) {
        if (a[i] <= b[j]) {
            res[k++] = a[i++];
        } else {
            res[k++] = b[j++];
        }
    }
    while (i < na) {
        res[k++] = a[i++];
    }
    while (j < nb) {
        res[k++] = b[j++];
    }
    return res;
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
