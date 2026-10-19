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

int taille(Cell *start) {
    int n = 0;
    Cell *cur = start;
    while (cur != NULL) {
        n++;
        cur = cur->next;
    }
    return n;
}

int main(void) {
    Cell *start = creerCell(7);
    start->next = creerCell(7);
    start->next->next = creerCell(7);
    printf("taille = %d\n", taille(start));
    libererListe(start);
    return 0;
}
