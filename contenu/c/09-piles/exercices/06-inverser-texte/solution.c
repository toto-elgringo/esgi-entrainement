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

void inverser(const char *texte, char *resultat) {
    int cases[100];
    Stack pile = {cases, 0, 100};
    for (int i = 0; texte[i] != '\0'; i++) {
        empiler(&pile, texte[i]);
    }
    int j = 0;
    while (!estVide(&pile)) {
        resultat[j] = (char)depiler(&pile);
        j++;
    }
    resultat[j] = '\0';
}

int main(void) {
    char resultat[100];
    inverser("Bonjour !", resultat);
    printf("%s\n", resultat);
    return 0;
}
