#include <stdio.h>

void echanger(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

void inverser_portion(int *tab, size_t debut, size_t fin) {
}

void inverser(int *tab, size_t n) {
}

int main(void) {
    int tab[] = {1, 2, 3, 4, 5, 6};
    inverser_portion(tab, 1, 4);
    for (size_t i = 0; i < 6; i++) {
        printf("%d ", tab[i]);
    }
    printf("\n");
    return 0;
}
