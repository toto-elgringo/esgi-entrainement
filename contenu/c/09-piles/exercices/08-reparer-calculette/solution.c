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

void calculer(const char *calcul) {
    int cases[64];
    Stack pile = {cases, 0, 64};
    for (int i = 0; calcul[i] != '\0'; i++) {
        char c = calcul[i];
        if (c == ' ') {
            continue;
        }
        if (c >= '0' && c <= '9') {
            empiler(&pile, c - '0');
            continue;
        }
        if (c != '+' && c != '-' && c != 'x') {
            printf("SYMBOLE INCONNU\n");
            return;
        }
        if (pile.size < 2) {
            printf("PAS ASSEZ DE NOMBRES\n");
            return;
        }
        int droite = depiler(&pile);
        int gauche = depiler(&pile);
        if (c == '+') {
            empiler(&pile, gauche + droite);
        } else if (c == '-') {
            empiler(&pile, gauche - droite);
        } else {
            empiler(&pile, gauche * droite);
        }
    }
    if (pile.size == 0) {
        printf("PAS ASSEZ DE NOMBRES\n");
    } else if (pile.size == 1) {
        printf("%d\n", depiler(&pile));
    } else {
        printf("TROP DE NOMBRES\n");
    }
}

int main(void) {
    calculer("1 2 +");
    calculer("5 1 2 + x 3 -");
    calculer("8 3 -");
    calculer("1 +");
    calculer("");
    calculer("1 2 3 +");
    calculer("4 2 /");
    calculer("9");
    return 0;
}
