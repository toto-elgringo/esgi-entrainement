#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int x;
    int y;
} Point;

Point *creerPoint(int x, int y) {
    return NULL;
}

int main(void) {
    Point *a = creerPoint(3, 4);
    if (a != NULL) {
        printf("a = (%d, %d)\n", a->x, a->y);
        free(a);
    }
    return 0;
}
