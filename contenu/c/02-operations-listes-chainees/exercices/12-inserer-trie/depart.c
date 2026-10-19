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

void insererTrie(Cell **start, int valeur) {
}

int main(void) {
    Cell *liste = NULL;
    insererTrie(&liste, 5);
    insererTrie(&liste, 2);
    insererTrie(&liste, 9);
    insererTrie(&liste, 7);
    for (Cell *cur = liste; cur != NULL; cur = cur->next) {
        printf("%d -> ", cur->value);
    }
    printf("NULL\n");
    libererListe(liste);
    return 0;
}
