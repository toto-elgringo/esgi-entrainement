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

void insererPosition(Cell **start, int position, int valeur) {
    Cell *nouveau = creerCell(valeur);
    if (position <= 0 || *start == NULL) {
        nouveau->next = *start;
        *start = nouveau;
        return;
    }
    Cell *prev = *start;
    for (int i = 1; i < position && prev->next != NULL; i++) {
        prev = prev->next;
    }
    nouveau->next = prev->next;
    prev->next = nouveau;
}

int main(void) {
    Cell *liste = NULL;
    insererPosition(&liste, 0, 20);
    insererPosition(&liste, 0, 10);
    insererPosition(&liste, 99, 40);
    insererPosition(&liste, 2, 30);
    afficherListe(liste);
    libererListe(liste);
    return 0;
}
