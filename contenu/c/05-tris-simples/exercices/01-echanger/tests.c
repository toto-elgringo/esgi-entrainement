int main(void) {
    int x = 3;
    int y = 8;
    echanger(&x, &y);
    VERIFIER_EGAL(x, 8, "après echanger(&x, &y), x vaut 8");
    VERIFIER_EGAL(y, 3, "après echanger(&x, &y), y vaut 3");

    int tab[] = {5, -2, 9, 1};
    echanger(&tab[0], &tab[3]);
    VERIFIER(tab[0] == 1 && tab[3] == 5, "échanger les cases 0 et 3 de 5 -2 9 1 donne 1 -2 9 5");
    VERIFIER(tab[1] == -2 && tab[2] == 9, "les autres cases ne bougent pas");

    echanger(&tab[1], &tab[2]);
    VERIFIER(tab[1] == 9 && tab[2] == -2, "échanger deux voisines : 1 9 -2 5");

    int z = 7;
    echanger(&z, &z);
    VERIFIER_EGAL(z, 7, "échanger une variable avec elle-même ne la change pas");

    int p = -4;
    int q = -4;
    echanger(&p, &q);
    VERIFIER(p == -4 && q == -4, "échanger deux valeurs égales ne change rien");
    return BILAN();
}
