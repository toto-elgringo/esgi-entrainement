#include <stdio.h>

void echanger(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

void inverser_portion(int *tab, size_t debut, size_t fin) {
    while (debut + 1 < fin) {
        echanger(&tab[debut], &tab[fin - 1]);
        debut++;
        fin--;
    }
}

void rotation_gauche(int *tab, size_t n, size_t k) {
}

int main(void) {
    int tab[] = {1, 2, 3, 4, 5};
    rotation_gauche(tab, 5, 2);
    for (size_t i = 0; i < 5; i++) {
        printf("%d ", tab[i]);
    }
    printf("\n");
    return 0;
}
