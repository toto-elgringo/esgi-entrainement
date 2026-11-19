#include <stdio.h>

void afficher(const int *tab, size_t n) {
}

int main(void) {
    int seul[] = {7};
    int quatre[] = {4, -2, 9, 0};
    afficher(NULL, 0);
    afficher(seul, 1);
    afficher(quatre, 4);
    return 0;
}
