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
    Cell *cur = start;
    while (cur != NULL) {
        printf("%d -> ", cur->value);
        cur = cur->next;
    }
    printf("NULL\n");
}

int main(void) {
    Cell *vide = NULL;
    Cell *seul = creerCell(7);
    Cell *trois = creerCell(3);
    trois->next = creerCell(1);
    trois->next->next = creerCell(2);

    afficherListe(vide);
    afficherListe(seul);
    afficherListe(trois);

    libererListe(seul);
    libererListe(trois);
    return 0;
}
