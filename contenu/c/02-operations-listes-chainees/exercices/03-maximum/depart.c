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

int maximum(Cell *start) {
    return 0;
}

int main(void) {
    Cell *start = creerCell(3);
    start->next = creerCell(9);
    start->next->next = creerCell(2);
    printf("maximum = %d\n", maximum(start));
    libererListe(start);
    return 0;
}
