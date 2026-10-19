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

Cell *rechercher(Cell *start, int valeur) {
    return NULL;
}

int main(void) {
    Cell *start = creerCell(4);
    start->next = creerCell(8);
    start->next->next = creerCell(15);
    Cell *trouve = rechercher(start, 15);
    if (trouve != NULL) {
        printf("trouvé : %d\n", trouve->value);
    } else {
        printf("pas trouvé\n");
    }
    libererListe(start);
    return 0;
}
