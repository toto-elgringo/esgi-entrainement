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
    Cell *nouveau = creerCell(valeur);
    if (*start == NULL || valeur <= (*start)->value) {
        nouveau->next = *start;
        *start = nouveau;
        return;
    }
    Cell *prev = *start;
    while (prev->next != NULL && prev->next->value < valeur) {
        prev = prev->next;
    }
    nouveau->next = prev->next;
    prev->next = nouveau;
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
