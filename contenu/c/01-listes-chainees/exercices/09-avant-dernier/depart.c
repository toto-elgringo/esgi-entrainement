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

Cell *avantDernier(Cell *start) {
    return NULL;
}

int main(void) {
    Cell *start = creerCell(3);
    start->next = creerCell(8);
    start->next->next = creerCell(5);
    start->next->next->next = creerCell(1);
    Cell *a = avantDernier(start);
    if (a != NULL) {
        printf("avant-dernier : %d\n", a->value);
    } else {
        printf("pas d'avant-dernier\n");
    }
    libererListe(start);
    return 0;
}
