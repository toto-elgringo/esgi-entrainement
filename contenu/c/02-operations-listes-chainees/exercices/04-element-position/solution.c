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

Cell *obtenirElement(Cell *start, int position) {
    Cell *cur = start;
    int i = 0;
    while (cur != NULL && i < position) {
        cur = cur->next;
        i++;
    }
    return cur;
}

int main(void) {
    Cell *start = creerCell(10);
    start->next = creerCell(20);
    start->next->next = creerCell(30);
    Cell *c = obtenirElement(start, 2);
    if (c != NULL) {
        printf("position 2 : %d\n", c->value);
    } else {
        printf("position 2 : rien\n");
    }
    libererListe(start);
    return 0;
}
