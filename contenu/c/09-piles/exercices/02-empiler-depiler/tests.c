int main(void) {
    int cases[4] = {0};
    Stack pile = {cases, 0, 4};

    empiler(&pile, 4);
    VERIFIER_EGAL(pile.size, 1, "après un empilement, la pile contient 1 valeur");
    VERIFIER_EGAL(cases[0], 4, "la première valeur empilée va au fond, dans tab[0]");
    VERIFIER_EGAL(sommet(&pile), 4, "le sommet d'une pile qui contient seulement 4 vaut 4");

    empiler(&pile, 7);
    empiler(&pile, 1);
    VERIFIER_EGAL(pile.size, 3, "après trois empilements, la pile contient 3 valeurs");
    VERIFIER_EGAL(sommet(&pile), 1, "après avoir empilé 4, 7, 1, le sommet vaut 1");
    VERIFIER_EGAL(pile.size, 3, "lire le sommet ne retire aucune valeur");

    VERIFIER_EGAL(depiler(&pile), 1, "le premier dépilement renvoie la dernière valeur empilée, 1");
    VERIFIER_EGAL(pile.size, 2, "après un dépilement, il reste 2 valeurs");
    VERIFIER_EGAL(sommet(&pile), 7, "après avoir dépilé 1, le sommet vaut 7");

    empiler(&pile, 9);
    VERIFIER_EGAL(cases[2], 9, "une nouvelle valeur réutilise la case libérée, tab[2]");
    VERIFIER_EGAL(depiler(&pile), 9, "on dépile 9");
    VERIFIER_EGAL(depiler(&pile), 7, "puis 7");
    VERIFIER_EGAL(depiler(&pile), 4, "puis 4, la toute première valeur");
    VERIFIER_EGAL(pile.size, 0, "après avoir tout dépilé, la pile est vide");

    for (int i = 1; i <= 4; i++) {
        empiler(&pile, i * 10);
    }
    VERIFIER_EGAL(sommet(&pile), 40, "on peut remplir les 4 cases : le sommet vaut 40");
    VERIFIER_EGAL(pile.size, 4, "la pile remplie contient 4 valeurs");
    return BILAN();
}
