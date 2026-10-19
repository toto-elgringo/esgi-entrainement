#include <stdio.h>
#include <stdlib.h>

typedef struct cell {
    int value;
    struct cell *next;
} Cell;

Cell *creerCell(int valeur) {
    Cell *c = malloc(sizeof(Cell));
    if (c == NULL) {
        exit(EXIT_FAILURE);
    }
    c->value = valeur;
    c->next = NULL;
    return c;
}

void libererListe(Cell *start) {
    while (start != NULL) {
        Cell *suivant = start->next;
        free(start);
        start = suivant;
    }
}

int sommeRec(Cell *c) {
    if (c == NULL) {
        return 0;
    }
    return c->value + sommeRec(c->next);
}

int tailleRec(Cell *c) {
    if (c == NULL) {
        return 0;
    }
    return 1 + tailleRec(c->next);
}

int main(void) {
    Cell *start = creerCell(0);
    start->next = creerCell(1);
    start->next->next = creerCell(2);
    printf("somme = %d, taille = %d\n", sommeRec(start), tailleRec(start));
    libererListe(start);
    return 0;
}
