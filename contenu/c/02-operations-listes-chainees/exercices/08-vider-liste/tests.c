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

int main(void) {
    Cell *vide = NULL;
    VERIFIER(viderListe(&vide) == 0, "vider une liste vide libère 0 maillon");
    VERIFIER(vide == NULL, "une liste vide reste NULL");

    Cell *l = aide_liste((int[]){1, 2, 3}, 3);
    int n = viderListe(&l);
    VERIFIER(n == 3, "vider 1 -> 2 -> 3 libère 3 maillons");
    VERIFIER(l == NULL, "après viderListe, la variable vaut NULL");

    int valeurs[300];
    for (int i = 0; i < 300; i++) {
        valeurs[i] = i;
    }
    Cell *grande = aide_liste(valeurs, 300);
    VERIFIER(viderListe(&grande) == 300, "vider une liste de 300 maillons libère 300 maillons");
    VERIFIER(grande == NULL, "la grande liste vaut NULL après viderListe");
    VERIFIER_SANS_FUITE();
    return BILAN();
}
