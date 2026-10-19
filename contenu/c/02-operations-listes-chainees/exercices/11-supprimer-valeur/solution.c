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

void supprimerDebut(Cell **start) {
    if (*start == NULL) {
        return;
    }
    Cell *ancien = *start;
    *start = ancien->next;
    free(ancien);
}

void supprimerValeur(Cell **start, int valeur) {
    if (*start == NULL) {
        return;
    }
    if ((*start)->value == valeur) {
        supprimerDebut(start);
        return;
    }
    Cell *prev = *start;
    while (prev->next != NULL && prev->next->value != valeur) {
        prev = prev->next;
    }
    if (prev->next != NULL) {
        Cell *cible = prev->next;
        prev->next = cible->next;
        free(cible);
    }
}

int main(void) {
    Cell *liste = creerCell(1);
    liste->next = creerCell(4);
    liste->next->next = creerCell(2);
    liste->next->next->next = creerCell(5);
    supprimerValeur(&liste, 2);
    for (Cell *cur = liste; cur != NULL; cur = cur->next) {
        printf("%d -> ", cur->value);
    }
    printf("NULL\n");
    libererListe(liste);
    return 0;
}
