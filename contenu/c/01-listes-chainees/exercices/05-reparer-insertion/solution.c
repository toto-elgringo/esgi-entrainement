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

Cell *insererDebut(Cell *start, int valeur) {
    Cell *nouveau = creerCell(valeur);
    nouveau->next = start;
    start = nouveau;
    return start;
}

int main(void) {
    Cell *start = NULL;
    start = insererDebut(start, 2);
    start = insererDebut(start, 1);
    if (start->next == start) {
        printf("Problème : le premier maillon pointe sur lui-même !\n");
        return 1;
    }
    for (Cell *cur = start; cur != NULL; cur = cur->next) {
        printf("%d -> ", cur->value);
    }
    printf("NULL\n");
    libererListe(start);
    return 0;
}
