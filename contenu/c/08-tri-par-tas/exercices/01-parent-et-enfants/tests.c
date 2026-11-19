int main(void) {
    VERIFIER_EGAL(enfantGauche(0), 1, "la racine (case 0) a son enfant gauche en 1");
    VERIFIER_EGAL(enfantDroit(0), 2, "la racine (case 0) a son enfant droit en 2");
    VERIFIER_EGAL(enfantGauche(1), 3, "la case 1 a son enfant gauche en 3");
    VERIFIER_EGAL(enfantDroit(1), 4, "la case 1 a son enfant droit en 4");
    VERIFIER_EGAL(enfantGauche(2), 5, "la case 2 a son enfant gauche en 5");
    VERIFIER_EGAL(enfantDroit(3), 8, "la case 3 a son enfant droit en 8");
    VERIFIER_EGAL(enfantGauche(10), 21, "la case 10 a son enfant gauche en 21");
    VERIFIER_EGAL(parent(1), 0, "le parent de la case 1 est la racine");
    VERIFIER_EGAL(parent(2), 0, "le parent de la case 2 est la racine");
    VERIFIER_EGAL(parent(7), 3, "le parent de la case 7 est la case 3");
    VERIFIER_EGAL(parent(8), 3, "le parent de la case 8 est aussi la case 3");
    VERIFIER_EGAL(parent(6), 2, "le parent de la case 6 est la case 2");
    int ok = 1;
    for (int i = 0; i < 1000; i++) {
        if (parent(enfantGauche(i)) != i || parent(enfantDroit(i)) != i) {
            ok = 0;
        }
    }
    VERIFIER(ok, "pour toute case i de 0 à 999 : le parent de chacun de ses enfants est bien i");

    int t[] = {53, 29, 12, 4, 15, 3, 9, 1};
    VERIFIER_EGAL(valeurDuParent(t, 4), 29, "dans {53, 29, 12, 4, 15, 3, 9, 1}, le parent de 15 (case 4) vaut 29");
    VERIFIER_EGAL(valeurDuParent(t, 7), 4, "le parent de 1 (case 7) vaut 4");
    VERIFIER_EGAL(valeurDuParent(t, 6), 12, "le parent de 9 (case 6) vaut 12");
    return BILAN();
}
