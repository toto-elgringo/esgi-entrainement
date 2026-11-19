int main(void) {
    int t[] = {42, -4, 6, 3, 6};
    VERIFIER_EGAL(position(t, 5, 42), 0, "42 est dans la première case : position 0");
    VERIFIER_EGAL(position(t, 5, 6), 2, "le premier 6 est en position 2");
    VERIFIER_EGAL(position(t, 5, 3), 3, "3 est en position 3");
    VERIFIER_EGAL(position(t, 5, 2), -1, "2 n'est pas dans le tableau : -1");
    VERIFIER_EGAL(position(t, 5, -4), 1, "-4 est en position 1");

    int u[] = {1, 2, 3, 9};
    VERIFIER_EGAL(position(u, 4, 9), 3, "9 est dans la dernière case : position 3");
    VERIFIER_EGAL(position(u, 3, 9), -1, "en ne regardant que les 3 premières cases, 9 est absent");

    VERIFIER_EGAL(position(NULL, 0, 5), -1, "dans un tableau vide, rien n'est trouvé");
    return BILAN();
}
