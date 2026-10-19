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

void afficherEnvers(Cell *c) {
}

int main(void) {
    Cell *quatre = creerCell(1);
    quatre->next = creerCell(2);
    quatre->next->next = creerCell(3);
    quatre->next->next->next = creerCell(4);
    Cell *seul = creerCell(42);
    Cell *vide = NULL;

    printf("à l'envers : ");
    afficherEnvers(quatre);
    printf("\n");
    printf("à l'envers : ");
    afficherEnvers(seul);
    printf("\n");
    printf("à l'envers : ");
    afficherEnvers(vide);
    printf("\n");

    libererListe(quatre);
    libererListe(seul);
    return 0;
}
