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

int viderListe(Cell **start) {
    return 0;
}

int main(void) {
    Cell *liste = creerCell(1);
    liste->next = creerCell(2);
    liste->next->next = creerCell(3);
    int n = viderListe(&liste);
    printf("%d maillons libérés, liste %s\n", n, liste == NULL ? "vide" : "PAS vide");
    return 0;
}
