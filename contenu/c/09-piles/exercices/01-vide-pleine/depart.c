#include <stdio.h>

typedef struct {
    int *tab;
    int size;
    int capacity;
} Stack;

int estVide(const Stack *s) {
    return 0;
}

int estPleine(const Stack *s) {
    return 0;
}

int main(void) {
    int cases[3];
    Stack pile = {cases, 0, 3};
    printf("vide : %d, pleine : %d\n", estVide(&pile), estPleine(&pile));
    pile.size = 3;
    printf("vide : %d, pleine : %d\n", estVide(&pile), estPleine(&pile));
    return 0;
}
