int main(void) {
    int *t = carres(5);
    VERIFIER(t != NULL, "carres(5) ne renvoie pas NULL");
    VERIFIER(t != NULL && t[0] == 0 && t[1] == 1 && t[2] == 4, "les trois premières cases valent 0, 1, 4");
    VERIFIER(t != NULL && t[3] == 9 && t[4] == 16, "les cases 3 et 4 valent 9 et 16");
    free(t);

    int *u = carres(1);
    VERIFIER(u != NULL && u[0] == 0, "carres(1) contient une seule case qui vaut 0");
    free(u);

    int *v = carres(100);
    VERIFIER(v != NULL && v[99] == 9801, "dans carres(100), la dernière case vaut 99 * 99 = 9801");
    free(v);
    VERIFIER_SANS_FUITE();
    return BILAN();
}
