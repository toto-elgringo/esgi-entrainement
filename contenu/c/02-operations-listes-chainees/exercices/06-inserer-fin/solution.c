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

void insererFin(Cell **start, int valeur) {
    Cell *nouveau = creerCell(valeur);
    if (*start == NULL) {
        *start = nouveau;
        return;
    }
    Cell *cur = *start;
    while (cur->next != NULL) {
        cur = cur->next;
    }
    cur->next = nouveau;
}

int main(void) {
    Cell *liste = NULL;
    insererFin(&liste, 1);
    insererFin(&liste, 2);
    insererFin(&liste, 3);
    for (Cell *cur = liste; cur != NULL; cur = cur->next) {
        printf("%d -> ", cur->value);
    }
    printf("NULL\n");
    libererListe(liste);
    return 0;
}
