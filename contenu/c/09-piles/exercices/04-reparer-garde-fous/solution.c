#include <stdio.h>

typedef struct {
    int *tab;
    int size;
    int capacity;
} Stack;

int empiler(Stack *s, int valeur) {
    if (s->size >= s->capacity) {
        return 0;
    }
    s->tab[s->size] = valeur;
    s->size++;
    return 1;
}

int depiler(Stack *s, int *valeur) {
    if (s->size == 0) {
        return 0;
    }
    s->size--;
    *valeur = s->tab[s->size];
    return 1;
}

int main(void) {
    int cases[2];
    Stack pile = {cases, 0, 2};
    printf("empiler 5 : %d\n", empiler(&pile, 5));
    printf("empiler 6 : %d\n", empiler(&pile, 6));
    int v = 0;
    while (depiler(&pile, &v)) {
        printf("je dépile %d\n", v);
        if (pile.size < 0) {
            printf("size vaut %d : la pile est cassée\n", pile.size);
            break;
        }
    }
    return 0;
}
