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

void afficherListe(Cell *start) {
    for (Cell *cur = start; cur != NULL; cur = cur->next) {
        printf("%d -> ", cur->value);
    }
    printf("NULL\n");
}

Cell *fusionner(Cell *a, Cell *b) {
    Cell bidon;
    bidon.next = NULL;
    Cell *fin = &bidon;
    while (a != NULL && b != NULL) {
        if (a->value <= b->value) {
            fin->next = a;
            a = a->next;
        } else {
            fin->next = b;
            b = b->next;
        }
        fin = fin->next;
    }
    fin->next = (a != NULL) ? a : b;
    return bidon.next;
}

int main(void) {
    Cell *a = creerCell(1);
    a->next = creerCell(4);
    a->next->next = creerCell(6);
    Cell *b = creerCell(2);
    b->next = creerCell(3);
    b->next->next = creerCell(8);
    Cell *r = fusionner(a, b);
    afficherListe(r);
    libererListe(r);
    return 0;
}
