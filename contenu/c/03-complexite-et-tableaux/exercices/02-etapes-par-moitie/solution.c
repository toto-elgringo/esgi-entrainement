#include <stdio.h>

int etapes(size_t n) {
    int resultat = 0;
    while (n > 1) {
        n = n / 2;
        resultat++;
    }
    return resultat;
}

int main(void) {
    size_t tailles[] = {10, 1000, 1000000, 1000000000};
    for (size_t i = 0; i < 4; i++) {
        printf("n = %zu : %d étapes\n", tailles[i], etapes(tailles[i]));
    }
    return 0;
}
