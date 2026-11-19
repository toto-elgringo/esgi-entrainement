#include <stdio.h>

int nombreNiveaux(int n) {
    if (n <= 1) {
        return 0;
    }
    return 1 + nombreNiveaux(n - n / 2);
}

int main(void) {
    printf("8 cases : %d niveaux\n", nombreNiveaux(8));
    printf("1000 cases : %d niveaux\n", nombreNiveaux(1000));
    return 0;
}
