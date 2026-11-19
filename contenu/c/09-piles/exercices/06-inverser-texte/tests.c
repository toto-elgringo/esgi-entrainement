int main(void) {
    char r[100];
    inverser("abc", r);
    VERIFIER_EGAL(r, "cba", "abc à l'envers donne cba");
    inverser("Bonjour !", r);
    VERIFIER_EGAL(r, "! ruojnoB", "Bonjour ! à l'envers donne ! ruojnoB");
    inverser("x", r);
    VERIFIER_EGAL(r, "x", "un texte d'un seul caractère ne change pas");
    r[0] = 'Z';
    r[1] = '\0';
    inverser("", r);
    VERIFIER_EGAL(r, "", "un texte vide donne un texte vide");
    inverser("radar", r);
    VERIFIER_EGAL(r, "radar", "radar se lit pareil dans les deux sens");
    inverser("1 2 3 4 5", r);
    VERIFIER_EGAL(r, "5 4 3 2 1", "1 2 3 4 5 à l'envers donne 5 4 3 2 1");
    return BILAN();
}
