#include <stdio.h>

void echanger(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(void) {
    int x = 3;
    int y = 8;
    echanger(&x, &y);
    printf("x = %d, y = %d\n", x, y);
    return 0;
}
