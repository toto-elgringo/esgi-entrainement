int main(void) {
    VERIFIER_EGAL(bienParenthesee(""), 1, "un texte vide est bien équilibré");
    VERIFIER_EGAL(bienParenthesee("()"), 1, "() est bien équilibré");
    VERIFIER_EGAL(bienParenthesee("([]{})"), 1, "([]{}) est bien équilibré");
    VERIFIER_EGAL(bienParenthesee("(a[i] + {b})"), 1, "(a[i] + {b}) est bien équilibré, les lettres sont ignorées");
    VERIFIER_EGAL(bienParenthesee("{[()()]}"), 1, "{[()()]} est bien équilibré");
    VERIFIER_EGAL(bienParenthesee("sans rien"), 1, "un texte sans parenthèse est bien équilibré");
    VERIFIER_EGAL(bienParenthesee("([)]"), 0, "([)] est mal équilibré : les types se croisent");
    VERIFIER_EGAL(bienParenthesee("(()"), 0, "(() est mal équilibré : une ouvrante reste ouverte");
    VERIFIER_EGAL(bienParenthesee("())"), 0, "()) est mal équilibré : une fermante de trop");
    VERIFIER_EGAL(bienParenthesee(")("), 0, ")( est mal équilibré : on ferme avant d'ouvrir");
    VERIFIER_EGAL(bienParenthesee("]"), 0, "] seul est mal équilibré");
    VERIFIER_EGAL(bienParenthesee("(]"), 0, "(] est mal équilibré : mauvais type de fermante");
    return BILAN();
}
