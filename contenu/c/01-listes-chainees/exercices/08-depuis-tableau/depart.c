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

Cell *insererDebut(Cell *start, int valeur) {
    Cell *nouveau = creerCell(valeur);
    nouveau->next = start;
    return nouveau;
}

void libererListe(Cell *start) {
    while (start != NULL) {
        Cell *suivant = start->next;
        free(start);
        start = suivant;
    }
}

Cell *depuisTableau(const int *valeurs, int n) {
    return NULL;
}

int main(void) {
    int t[] = {10, 20, 30};
    Cell *l = depuisTableau(t, 3);
    for (Cell *cur = l; cur != NULL; cur = cur->next) {
        printf("%d -> ", cur->value);
    }
    printf("NULL\n");
    libererListe(l);
    return 0;
}
