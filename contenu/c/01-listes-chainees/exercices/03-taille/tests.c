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
    VERIFIER(taille(NULL) == 0, "une liste vide a 0 maillon");

    Cell *un = aide_liste((int[]){42}, 1);
    VERIFIER(taille(un) == 1, "la liste 42 a 1 maillon");
    aide_liberer(un);

    Cell *trois = aide_liste((int[]){7, 7, 7}, 3);
    VERIFIER(taille(trois) == 3, "la liste 7 -> 7 -> 7 a 3 maillons");
    aide_liberer(trois);

    int valeurs[1000];
    for (int i = 0; i < 1000; i++) {
        valeurs[i] = i;
    }
    Cell *grande = aide_liste(valeurs, 1000);
    VERIFIER(taille(grande) == 1000, "une liste de 1000 maillons a une taille de 1000");
    aide_liberer(grande);
    return BILAN();
}
