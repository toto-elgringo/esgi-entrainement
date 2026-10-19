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
    VERIFIER(sommeRec(NULL) == 0, "la somme d'une liste vide vaut 0");
    VERIFIER(tailleRec(NULL) == 0, "la taille d'une liste vide vaut 0");

    Cell *un = aide_liste((int[]){8}, 1);
    VERIFIER(sommeRec(un) == 8, "la somme de la liste 8 vaut 8");
    VERIFIER(tailleRec(un) == 1, "la liste 8 a 1 maillon");
    aide_liberer(un);

    Cell *l = aide_liste((int[]){0, 1, 2, -10, 20}, 5);
    VERIFIER(sommeRec(l) == 13, "la somme de 0 -> 1 -> 2 -> -10 -> 20 vaut 13");
    VERIFIER(tailleRec(l) == 5, "la liste 0 -> 1 -> 2 -> -10 -> 20 a 5 maillons");
    aide_liberer(l);

    int valeurs[500];
    for (int i = 0; i < 500; i++) {
        valeurs[i] = 2;
    }
    Cell *grande = aide_liste(valeurs, 500);
    VERIFIER(sommeRec(grande) == 1000, "500 maillons de valeur 2 ont une somme de 1000");
    VERIFIER(tailleRec(grande) == 500, "la liste de 500 maillons a une taille de 500");
    aide_liberer(grande);
    return BILAN();
}
