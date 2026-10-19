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

Cell *retirerPremier(Cell *start) {
    if (start == NULL) {
        return NULL;
    }
    Cell *suivant = start->next;
    free(start);
    return suivant;
}

void libererListe(Cell *start) {
    while (start != NULL) {
        Cell *suivant = start->next;
        free(start);
        start = suivant;
    }
}

int main(void) {
    Cell *liste = creerCell(1);
    liste->next = creerCell(2);
    liste->next->next = creerCell(3);
    liste = retirerPremier(liste);
    printf("premier : %d\n", liste->value);
    libererListe(liste);
    return 0;
}
