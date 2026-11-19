#include <stdio.h>

typedef struct {
    int *tab;
    int size;
    int capacity;
} Stack;

void empiler(Stack *s, int valeur) {
    s->tab[s->size] = valeur;
    s->size++;
}

int depiler(Stack *s) {
    s->size--;
    return s->tab[s->size];
}

int sommet(const Stack *s) {
    return s->tab[s->size - 1];
}

int main(void) {
    int cases[5];
    Stack pile = {cases, 0, 5};
    empiler(&pile, 4);
    empiler(&pile, 7);
    empiler(&pile, 1);
    printf("sommet : %d\n", sommet(&pile));
    while (pile.size > 0) {
        printf("je dépile %d\n", depiler(&pile));
    }
    return 0;
}
