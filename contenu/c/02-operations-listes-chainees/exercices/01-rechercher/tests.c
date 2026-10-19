#include <stdlib.h>

static Cell *aide_liste(const int *valeurs, int n) {
    Cell *start = NULL;
    for (int i = n - 1; i >= 0; i--) {
        Cell *c = malloc(sizeof(Cell));
        if (c == NULL) {
            exit(EXIT_FAILURE);
        }
        c->value = valeurs[i];
        c->next = start;
        start = c;
    }
    return start;
}

static void aide_liberer(Cell *start) {
    while (start != NULL) {
        Cell *suivant = start->next;
        free(start);
        start = suivant;
    }
}

int main(void) {
    VERIFIER(rechercher(NULL, 3) == NULL, "chercher dans une liste vide renvoie NULL");

    Cell *l = aide_liste((int[]){4, 8, 15, 16}, 4);
    VERIFIER(rechercher(l, 4) == l, "chercher 4 renvoie le premier maillon");
    VERIFIER(rechercher(l, 15) == l->next->next, "chercher 15 renvoie le troisième maillon");
    VERIFIER(rechercher(l, 16) == l->next->next->next, "chercher 16 renvoie le dernier maillon");
    VERIFIER(rechercher(l, 42) == NULL, "chercher 42, absent, renvoie NULL");
    aide_liberer(l);

    Cell *d = aide_liste((int[]){1, 2, 1}, 3);
    VERIFIER(rechercher(d, 1) == d, "si la valeur apparaît deux fois, on renvoie le premier maillon qui la contient");
    aide_liberer(d);
    return BILAN();
}
