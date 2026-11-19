int main(void) {
    int t[] = {42, -4, 6, 3};
    VERIFIER_EGAL(contient(t, 4, 42), 1, "42 est dans la première case");
    VERIFIER_EGAL(contient(t, 4, 6), 1, "6 est dans la troisième case");
    VERIFIER_EGAL(contient(t, 4, 3), 1, "3 est dans la dernière case");
    VERIFIER_EGAL(contient(t, 4, 2), 0, "2 n'est pas dans le tableau");
    VERIFIER_EGAL(contient(t, 4, -5), 0, "-5 n'est pas dans le tableau");
    VERIFIER_EGAL(contient(NULL, 0, 1), 0, "un tableau vide ne contient rien");
    return BILAN();
}
