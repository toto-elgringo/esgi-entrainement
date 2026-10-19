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

Cell *inverser(Cell *start) {
    Cell *prev = NULL;
    Cell *cur = start;
    while (cur != NULL) {
        Cell *suivant = cur->next;
        cur->next = prev;
        prev = cur;
        cur = suivant;
    }
    return prev;
}

int main(void) {
    Cell *liste = creerCell(1);
    liste->next = creerCell(2);
    liste->next->next = creerCell(3);
    liste = inverser(liste);
    for (Cell *cur = liste; cur != NULL; cur = cur->next) {
        printf("%d -> ", cur->value);
    }
    printf("NULL\n");
    libererListe(liste);
    return 0;
}
