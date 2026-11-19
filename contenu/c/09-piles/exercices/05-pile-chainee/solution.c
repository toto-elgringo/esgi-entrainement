#include <stdio.h>
#include <stdlib.h>

typedef struct cell {
    int value;
    struct cell *next;
} Cell;

int estVideListe(const Cell *sommet) {
    return sommet == NULL;
}

void empilerListe(Cell **sommet, int valeur) {
    Cell *c = malloc(sizeof(Cell));
    if (c == NULL) {
        exit(EXIT_FAILURE);
    }
    c->value = valeur;
    c->next = *sommet;
    *sommet = c;
}

int depilerListe(Cell **sommet) {
    Cell *ancien = *sommet;
    int valeur = ancien->value;
    *sommet = ancien->next;
    free(ancien);
    return valeur;
}

void viderPile(Cell **sommet) {
    while (*sommet != NULL) {
        depilerListe(sommet);
    }
}

int main(void) {
    Cell *pile = NULL;
    empilerListe(&pile, 1);
    empilerListe(&pile, 2);
    empilerListe(&pile, 3);
    while (!estVideListe(pile)) {
        printf("%d ", depilerListe(&pile));
    }
    printf("\n");
    return 0;
}
