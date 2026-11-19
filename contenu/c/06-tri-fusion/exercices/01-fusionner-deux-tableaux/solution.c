#include <stdio.h>

void fusionner(const int *a, int na, const int *b, int nb, int *resultat) {
    int i = 0;
    int j = 0;
    int k = 0;
    while (i < na && j < nb) {
        if (a[i] <= b[j]) {
            resultat[k++] = a[i++];
        } else {
            resultat[k++] = b[j++];
        }
    }
    while (i < na) {
        resultat[k++] = a[i++];
    }
    while (j < nb) {
        resultat[k++] = b[j++];
    }
}

int main(void) {
    int a[] = {1, 4, 9};
    int b[] = {2, 3, 10, 11};
    int resultat[7] = {0};
    fusionner(a, 3, b, 4, resultat);
    for (int i = 0; i < 7; i++) {
        printf("%d ", resultat[i]);
    }
    printf("\n");
    return 0;
}
