#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int x;
    int y;
} Point;

Point *creerPoint(int x, int y) {
    Point *p = malloc(sizeof(Point));
    if (p == NULL) {
        exit(EXIT_FAILURE);
    }
    p->x = x;
    p->y = y;
    return p;
}

int main(void) {
    Point *a = creerPoint(3, 4);
    if (a != NULL) {
        printf("a = (%d, %d)\n", a->x, a->y);
        free(a);
    }
    return 0;
}
