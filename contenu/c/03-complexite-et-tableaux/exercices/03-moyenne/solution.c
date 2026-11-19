#include <stdio.h>

double moyenne(const int *tab, size_t n) {
    if (n == 0) {
        return 0.0;
    }
    long long somme = 0;
    for (size_t i = 0; i < n; i++) {
        somme += tab[i];
    }
    return (double)somme / (double)n;
}

int main(void) {
    int notes[] = {12, 15, 9, 18};
    printf("moyenne = %.2f\n", moyenne(notes, 4));
    return 0;
}
