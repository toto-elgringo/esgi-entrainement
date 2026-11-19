int main(void) {
    int t[] = {4, 9, 1, 6, 8, 2, 7};
    VERIFIER_EGAL(positionFinale(t, 7, 3), 3, "pivot 6 : trois valeurs plus petites (4, 1, 2), il finit à l'indice 3");
    VERIFIER_EGAL(positionFinale(t, 7, 2), 0, "pivot 1 : c'est le minimum, il finit à l'indice 0");
    VERIFIER_EGAL(positionFinale(t, 7, 1), 6, "pivot 9 : c'est le maximum, il finit à la dernière case");
    VERIFIER_EGAL(positionFinale(t, 7, 6), 4, "pivot 7 : quatre valeurs plus petites (4, 1, 6, 2)");

    int doublons[] = {5, 3, 5, 1};
    VERIFIER_EGAL(positionFinale(doublons, 4, 0), 2, "pivot 5 dans {5, 3, 5, 1} : seules 3 et 1 sont strictement plus petites");

    int un[] = {42};
    VERIFIER_EGAL(positionFinale(un, 1, 0), 0, "un tableau d'une case : le pivot reste à l'indice 0");

    int negatifs[] = {-2, -8, 0, -5};
    VERIFIER_EGAL(positionFinale(negatifs, 4, 0), 2, "pivot -2 dans {-2, -8, 0, -5} : -8 et -5 sont plus petits");

    VERIFIER(t[0] == 4 && t[3] == 6 && t[6] == 7, "le tableau n'est pas modifié");
    return BILAN();
}
