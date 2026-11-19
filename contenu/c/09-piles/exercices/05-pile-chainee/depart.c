#include <stdio.h>
#include <stdlib.h>

typedef struct cell {
    int value;
    struct cell *next;
} Cell;

int estVideListe(const Cell *sommet) {
    return 1;
}

void empilerListe(Cell **sommet, int valeur) {
}

int depilerListe(Cell **sommet) {
    return 0;
}

void viderPile(Cell **sommet) {
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
