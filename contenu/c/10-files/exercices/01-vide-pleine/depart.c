#include <stdio.h>

typedef struct {
    int *tab;
    int start;
    int size;
    int capacity;
} Queue;

int estVide(const Queue *q) {
    return 0;
}

int estPleine(const Queue *q) {
    return 0;
}

int main(void) {
    int cases[4];
    Queue file = {cases, 3, 0, 4};
    printf("vide : %d, pleine : %d\n", estVide(&file), estPleine(&file));
    file.size = 4;
    printf("vide : %d, pleine : %d\n", estVide(&file), estPleine(&file));
    return 0;
}
