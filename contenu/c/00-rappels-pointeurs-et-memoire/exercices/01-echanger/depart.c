#include <stdio.h>

void echanger(int *a, int *b) {
}

int main(void) {
    int x = 1;
    int y = 2;
    echanger(&x, &y);
    printf("x = %d, y = %d\n", x, y);
    return 0;
}
