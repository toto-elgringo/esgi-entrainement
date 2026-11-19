#include <stdio.h>

int etapes(size_t n) {
    return 0;
}

int main(void) {
    size_t tailles[] = {10, 1000, 1000000, 1000000000};
    for (size_t i = 0; i < 4; i++) {
        printf("n = %zu : %d étapes\n", tailles[i], etapes(tailles[i]));
    }
    return 0;
}
