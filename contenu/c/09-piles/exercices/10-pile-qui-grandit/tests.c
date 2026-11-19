int main(void) {
    Stack *pile = creerPile(1);
    empiler(pile, 1);
    VERIFIER(pile->size == 1 && pile->capacity == 1, "le premier empilement remplit la pile de capacité 1");
    empiler(pile, 2);
    VERIFIER_EGAL(pile->capacity, 2, "empiler dans une pile pleine de capacité 1 double la capacité : 2");
    empiler(pile, 3);
    VERIFIER_EGAL(pile->capacity, 4, "puis 4 au troisième empilement");
    VERIFIER_EGAL(pile->tab[0], 1, "les anciennes valeurs sont conservées après l'agrandissement");

    for (int i = 4; i <= 100; i++) {
        empiler(pile, i);
    }
    VERIFIER_EGAL(pile->size, 100, "après 100 empilements, la pile contient 100 valeurs");
    VERIFIER_EGAL(pile->capacity, 128, "en doublant à partir de 1, la capacité vaut 128 pour 100 valeurs");

    int dansLOrdre = 1;
    for (int attendu = 100; attendu >= 1; attendu--) {
        if (pile->size == 0 || depiler(pile) != attendu) {
            dansLOrdre = 0;
            break;
        }
    }
    VERIFIER(dansLOrdre, "on dépile 100, 99, ..., 1 : aucune valeur perdue pendant les agrandissements");

    libererPile(pile);
    Stack *autre = creerPile(4);
    empiler(autre, 7);
    libererPile(autre);
    VERIFIER_SANS_FUITE();
    return BILAN();
}
