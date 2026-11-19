int main(void) {
    int r = 0;
    VERIFIER_EGAL(evaluer("1 2 +", &r), CALCUL_OK, "1 2 + est un calcul correct");
    VERIFIER_EGAL(r, 3, "1 2 + vaut 3");
    VERIFIER_EGAL(evaluer("12 30 +", &r), CALCUL_OK, "12 30 + est un calcul correct");
    VERIFIER_EGAL(r, 42, "12 30 + vaut 42 : les nombres à plusieurs chiffres sont lus en entier");
    VERIFIER_EGAL(evaluer("3 4 + 2 x", &r), CALCUL_OK, "3 4 + 2 x est un calcul correct");
    VERIFIER_EGAL(r, 14, "3 4 + 2 x vaut (3 + 4) x 2 = 14");
    VERIFIER_EGAL(evaluer("100 1 -", &r), CALCUL_OK, "100 1 - est un calcul correct");
    VERIFIER_EGAL(r, 99, "100 1 - vaut 99 : le premier nombre dépilé est celui de droite");
    VERIFIER_EGAL(evaluer("7 10 -", &r), CALCUL_OK, "7 10 - est un calcul correct");
    VERIFIER_EGAL(r, -3, "7 10 - vaut -3");
    VERIFIER_EGAL(evaluer("  25   ", &r), CALCUL_OK, "un nombre seul entouré d'espaces est correct");
    VERIFIER_EGAL(r, 25, "25 seul vaut 25");
    VERIFIER_EGAL(evaluer("2 3 4 x + 5 -", &r), CALCUL_OK, "2 3 4 x + 5 - est correct");
    VERIFIER_EGAL(r, 9, "2 3 4 x + 5 - vaut 2 + 12 - 5 = 9");

    r = 777;
    VERIFIER_EGAL(evaluer("5 +", &r), PAS_ASSEZ_DE_NOMBRES, "5 + : pas assez de nombres pour l'addition");
    VERIFIER_EGAL(evaluer("", &r), PAS_ASSEZ_DE_NOMBRES, "un calcul vide n'a pas de résultat");
    VERIFIER_EGAL(evaluer("+", &r), PAS_ASSEZ_DE_NOMBRES, "+ seul : pas assez de nombres");
    VERIFIER_EGAL(evaluer("1 2", &r), TROP_DE_NOMBRES, "1 2 : il reste deux nombres à la fin");
    VERIFIER_EGAL(evaluer("1 2 3 +", &r), TROP_DE_NOMBRES, "1 2 3 + : il reste deux nombres à la fin");
    VERIFIER_EGAL(evaluer("6 2 /", &r), SYMBOLE_INCONNU, "/ n'est pas un opérateur connu");
    VERIFIER_EGAL(evaluer("1 a +", &r), SYMBOLE_INCONNU, "a n'est ni un chiffre ni un opérateur");
    VERIFIER_EGAL(r, 777, "en cas d'erreur, le résultat n'est pas modifié");
    return BILAN();
}
