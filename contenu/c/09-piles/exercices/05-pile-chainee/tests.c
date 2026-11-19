int main(void) {
    Cell *pile = NULL;
    VERIFIER_EGAL(estVideListe(pile), 1, "une pile NULL est vide");

    empilerListe(&pile, 1);
    VERIFIER(pile != NULL && pile->value == 1, "après avoir empilé 1, le sommet contient 1");
    VERIFIER_EGAL(estVideListe(pile), 0, "une pile avec une valeur n'est pas vide");

    empilerListe(&pile, 2);
    empilerListe(&pile, 3);
    VERIFIER(pile != NULL && pile->value == 3, "après avoir empilé 1, 2, 3, le premier maillon contient 3");
    VERIFIER(pile != NULL && pile->next != NULL && pile->next->value == 2, "sous le sommet, on trouve 2");

    if (pile == NULL) {
        return BILAN();
    }
    VERIFIER_EGAL(depilerListe(&pile), 3, "le premier dépilement renvoie 3");
    VERIFIER_EGAL(depilerListe(&pile), 2, "le deuxième renvoie 2");
    VERIFIER(pile != NULL && pile->value == 1 && pile->next == NULL, "il ne reste que le maillon 1");
    VERIFIER_EGAL(depilerListe(&pile), 1, "le dernier dépilement renvoie 1");
    VERIFIER_EGAL(pile, NULL, "après avoir tout dépilé, la pile vaut NULL");

    for (int i = 0; i < 5; i++) {
        empilerListe(&pile, i);
    }
    viderPile(&pile);
    VERIFIER_EGAL(pile, NULL, "après viderPile, la pile vaut NULL");
    viderPile(&pile);
    VERIFIER_EGAL(pile, NULL, "vider une pile déjà vide ne plante pas");
    VERIFIER_SANS_FUITE();
    return BILAN();
}
