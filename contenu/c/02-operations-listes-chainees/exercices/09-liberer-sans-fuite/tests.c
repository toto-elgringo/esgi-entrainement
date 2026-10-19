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

static int aide_egale(Cell *start, const int *valeurs, int n) {
    for (int i = 0; i < n; i++) {
        if (start == NULL || start->value != valeurs[i]) {
            return 0;
        }
        start = start->next;
    }
    return start == NULL;
}

int main(void) {
    VERIFIER(retirerPremier(NULL) == NULL, "retirer le premier maillon d'une liste vide renvoie NULL");
    libererListe(NULL);
    VERIFIER(1, "libérer une liste vide ne plante pas");

    Cell *l = aide_liste((int[]){1, 2, 3, 4}, 4);
    l = retirerPremier(l);
    VERIFIER(aide_egale(l, (int[]){2, 3, 4}, 3), "retirer le premier maillon de 1 -> 2 -> 3 -> 4 donne 2 -> 3 -> 4");
    l = retirerPremier(l);
    VERIFIER(aide_egale(l, (int[]){3, 4}, 2), "le retirer encore une fois donne 3 -> 4");
    libererListe(l);

    Cell *grande = creerCell(0);
    Cell *cur = grande;
    for (int i = 1; i < 100; i++) {
        cur->next = creerCell(i);
        cur = cur->next;
    }
    libererListe(grande);

    VERIFIER_SANS_FUITE();
    return BILAN();
}
