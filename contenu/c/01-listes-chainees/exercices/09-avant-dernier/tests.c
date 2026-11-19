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
    VERIFIER_EGAL(avantDernier(NULL), NULL, "une liste vide n'a pas d'avant-dernier : NULL");

    Cell *un = aide_liste((int[]){7}, 1);
    VERIFIER_EGAL(avantDernier(un), NULL, "la liste 7 n'a pas d'avant-dernier : NULL");
    aide_liberer(un);

    Cell *deux = aide_liste((int[]){4, 9}, 2);
    VERIFIER_EGAL(avantDernier(deux), deux, "dans 4 -> 9, l'avant-dernier est le premier maillon");
    aide_liberer(deux);

    Cell *quatre = aide_liste((int[]){3, 8, 5, 1}, 4);
    Cell *attendu = quatre->next->next;
    Cell *obtenu = avantDernier(quatre);
    VERIFIER_EGAL(obtenu, attendu, "dans 3 -> 8 -> 5 -> 1, l'avant-dernier est le maillon de valeur 5");
    VERIFIER(obtenu != NULL && obtenu->next != NULL && obtenu->next->next == NULL, "le suivant de l'avant-dernier est bien le dernier maillon");
    aide_liberer(quatre);
    return BILAN();
}
