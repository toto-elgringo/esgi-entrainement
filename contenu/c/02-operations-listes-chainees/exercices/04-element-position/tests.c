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
    VERIFIER(obtenirElement(NULL, 0) == NULL, "dans une liste vide, la position 0 n'existe pas (NULL)");

    Cell *l = aide_liste((int[]){10, 20, 30}, 3);
    VERIFIER(obtenirElement(l, 0) == l, "la position 0 est le premier maillon");
    VERIFIER(obtenirElement(l, 1) == l->next, "la position 1 est le deuxième maillon (valeur 20)");
    VERIFIER(obtenirElement(l, 2) == l->next->next, "la position 2 est le troisième maillon (valeur 30)");
    VERIFIER(obtenirElement(l, 3) == NULL, "la position 3 n'existe pas dans une liste de 3 maillons");
    VERIFIER(obtenirElement(l, 50) == NULL, "la position 50 n'existe pas non plus (et ne fait pas planter)");
    aide_liberer(l);
    return BILAN();
}
