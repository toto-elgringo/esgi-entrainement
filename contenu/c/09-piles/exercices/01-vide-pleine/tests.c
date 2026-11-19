int main(void) {
    int cases[3] = {0};
    Stack pile = {cases, 0, 3};
    VERIFIER_EGAL(estVide(&pile), 1, "une pile de taille 0 est vide");
    VERIFIER_EGAL(estPleine(&pile), 0, "une pile de taille 0 sur 3 cases n'est pas pleine");

    pile.size = 2;
    VERIFIER_EGAL(estVide(&pile), 0, "une pile de 2 valeurs n'est pas vide");
    VERIFIER_EGAL(estPleine(&pile), 0, "une pile de 2 valeurs sur 3 cases n'est pas pleine");

    pile.size = 3;
    VERIFIER_EGAL(estVide(&pile), 0, "une pile de 3 valeurs n'est pas vide");
    VERIFIER_EGAL(estPleine(&pile), 1, "une pile de 3 valeurs sur 3 cases est pleine");

    pile.size = 4;
    VERIFIER_EGAL(estPleine(&pile), 1, "une pile qui a dépassé sa capacité est considérée comme pleine");

    Stack sansCase = {cases, 0, 0};
    VERIFIER_EGAL(estVide(&sansCase), 1, "une pile de capacité 0 est vide");
    VERIFIER_EGAL(estPleine(&sansCase), 1, "une pile de capacité 0 est aussi pleine");
    return BILAN();
}
