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

Cell *supprimerPremier(Cell *start) {
    if (start == NULL) {
        return NULL;
    }
    return start->next;
}

Cell *supprimerDernier(Cell *start) {
    if (start == NULL) {
        return NULL;
    }
    if (start->next == NULL) {
        return NULL;
    }
    Cell *prev = start;
    while (prev->next->next != NULL) {
        prev = prev->next;
    }
    prev->next = NULL;
    return start;
}

int main(void) {
    Cell *liste = creerCell(1);
    liste->next = creerCell(2);
    liste->next->next = creerCell(3);
    liste->next->next->next = creerCell(4);
    afficherListe(liste);
    liste = supprimerPremier(liste);
    afficherListe(liste);
    liste = supprimerDernier(liste);
    afficherListe(liste);
    libererListe(liste);
    return 0;
}
