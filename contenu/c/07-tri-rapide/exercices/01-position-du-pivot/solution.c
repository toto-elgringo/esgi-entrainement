#include <stdio.h>

int positionFinale(const int *t, int n, int indicePivot) {
    int pivot = t[indicePivot];
    int nombre = 0;
    for (int i = 0; i < n; i++) {
        if (t[i] < pivot) {
            nombre++;
        }
    }
    return nombre;
}

int main(void) {
    int t[] = {4, 9, 1, 6, 8, 2, 7};
    printf("Le pivot 6 finira à l'indice %d\n", positionFinale(t, 7, 3));
    return 0;
}
