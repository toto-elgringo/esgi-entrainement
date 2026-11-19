int main(void) {
    int zone[6] = {-1, -1, -1, -1, -1, -1};
    Stack pile = {zone + 1, 0, 3};

    VERIFIER_EGAL(empiler(&pile, 10), 1, "empiler 10 dans une pile vide réussit");
    VERIFIER_EGAL(empiler(&pile, 20), 1, "empiler 20 réussit");
    VERIFIER_EGAL(empiler(&pile, 30), 1, "empiler 30 remplit la pile et réussit");
    VERIFIER_EGAL(empiler(&pile, 40), 0, "empiler 40 dans une pile pleine renvoie 0");
    VERIFIER_EGAL(pile.size, 3, "une pile pleine garde sa taille de 3 après un empilement refusé");
    VERIFIER_EGAL(zone[4], -1, "rien n'est écrit après la fin du tableau");

    int v = 0;
    VERIFIER(depiler(&pile, &v) == 1 && v == 30, "le premier dépilement réussit et donne 30");
    VERIFIER(depiler(&pile, &v) == 1 && v == 20, "le deuxième donne 20");
    VERIFIER(depiler(&pile, &v) == 1 && v == 10, "le troisième donne 10");

    v = 1234;
    VERIFIER_EGAL(depiler(&pile, &v), 0, "dépiler une pile vide renvoie 0");
    VERIFIER_EGAL(pile.size, 0, "une pile vide garde une taille de 0 après un dépilement refusé");
    VERIFIER_EGAL(v, 1234, "un dépilement refusé ne modifie pas la variable reçue");

    VERIFIER_EGAL(empiler(&pile, 7), 1, "après tout ça, la pile marche encore : empiler 7 réussit");
    VERIFIER(depiler(&pile, &v) == 1 && v == 7, "et on retrouve 7 en dépilant");
    return BILAN();
}
