#include <stdio.h>

typedef struct {
    int *tab;
    int size;
    int capacity;
} Stack;

int estVide(const Stack *s) {
    return s->size == 0;
}

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

int bienParenthesee(const char *texte) {
    return 0;
}

int main(void) {
    printf("%d\n", bienParenthesee("(a[i] + {b})"));
    printf("%d\n", bienParenthesee("([)]"));
    return 0;
}
