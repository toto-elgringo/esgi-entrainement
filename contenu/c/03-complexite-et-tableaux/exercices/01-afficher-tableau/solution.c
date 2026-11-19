#include <stdio.h>

void afficher(const int *tab, size_t n) {
    printf("[");
    for (size_t i = 0; i < n; i++) {
        if (i > 0) {
            printf(", ");
        }
        printf("%d", tab[i]);
    }
    printf("]\n");
}

int main(void) {
    int seul[] = {7};
    int quatre[] = {4, -2, 9, 0};
    afficher(NULL, 0);
    afficher(seul, 1);
    afficher(quatre, 4);
    return 0;
}
