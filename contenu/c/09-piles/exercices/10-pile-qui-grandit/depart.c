#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *tab;
    int size;
    int capacity;
} Stack;

Stack *creerPile(int capacite) {
    Stack *s = malloc(sizeof(Stack));
    if (s == NULL) {
        exit(EXIT_FAILURE);
    }
    s->tab = malloc(capacite * sizeof(int));
    if (s->tab == NULL) {
        exit(EXIT_FAILURE);
    }
    s->size = 0;
    s->capacity = capacite;
    return s;
}

int depiler(Stack *s) {
    s->size--;
    return s->tab[s->size];
}

void empiler(Stack *s, int valeur) {
}

void libererPile(Stack *s) {
}

int main(void) {
    Stack *pile = creerPile(1);
    for (int i = 1; i <= 5; i++) {
        empiler(pile, i);
        printf("empiler %d : size %d, capacity %d\n", i, pile->size, pile->capacity);
    }
    libererPile(pile);
    return 0;
}
