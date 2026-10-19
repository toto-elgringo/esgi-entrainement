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

int compter(Cell *start, int valeur) {
    int n = 0;
    Cell *cur = start;
    while (cur != NULL) {
        if (cur->value == valeur) {
            n++;
        }
        cur = cur->next;
    }
    return n;
}

int main(void) {
    Cell *start = creerCell(1);
    start->next = creerCell(2);
    start->next->next = creerCell(1);
    printf("1 apparaît %d fois\n", compter(start, 1));
    libererListe(start);
    return 0;
}
