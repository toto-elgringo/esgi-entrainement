#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point;

void deplacer(Point *p, int dx, int dy) {
}

int main(void) {
    Point a = {3, 4};
    deplacer(&a, 1, -2);
    printf("a = (%d, %d)\n", a.x, a.y);
    return 0;
}
