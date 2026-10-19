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

void insererApres(Cell *maillon, int valeur) {
    Cell *nouveau = creerCell(valeur);
    nouveau->next = maillon->next;
    maillon->next = nouveau;
}

int main(void) {
    Cell *liste = creerCell(1);
    liste->next = creerCell(2);
    insererApres(liste, 4);
    for (Cell *cur = liste; cur != NULL; cur = cur->next) {
        printf("%d -> ", cur->value);
    }
    printf("NULL\n");
    libererListe(liste);
    return 0;
}
