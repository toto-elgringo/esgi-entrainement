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

char ouvranteDe(char fermante) {
    if (fermante == ')') {
        return '(';
    }
    if (fermante == ']') {
        return '[';
    }
    return '{';
}

int bienParenthesee(const char *texte) {
    int cases[100];
    Stack pile = {cases, 0, 100};
    for (int i = 0; texte[i] != '\0'; i++) {
        char c = texte[i];
        if (c == '(' || c == '[' || c == '{') {
            empiler(&pile, c);
        } else if (c == ')' || c == ']' || c == '}') {
            if (estVide(&pile) || sommet(&pile) != ouvranteDe(c)) {
                return 0;
            }
            depiler(&pile);
        }
    }
    return estVide(&pile);
}

int main(void) {
    printf("%d\n", bienParenthesee("(a[i] + {b})"));
    printf("%d\n", bienParenthesee("([)]"));
    return 0;
}
