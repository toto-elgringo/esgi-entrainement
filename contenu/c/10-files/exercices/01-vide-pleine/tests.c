int main(void) {
    int cases[4] = {0};
    Queue file = {cases, 0, 0, 4};
    VERIFIER_EGAL(estVide(&file), 1, "une file de taille 0 est vide");
    VERIFIER_EGAL(estPleine(&file), 0, "une file de taille 0 sur 4 cases n'est pas pleine");

    file.start = 3;
    VERIFIER_EGAL(estVide(&file), 1, "une file de taille 0 est vide, même si sa tête est en case 3");

    file.start = 2;
    file.size = 3;
    VERIFIER_EGAL(estVide(&file), 0, "une file de 3 valeurs n'est pas vide");
    VERIFIER_EGAL(estPleine(&file), 0, "une file de 3 valeurs sur 4 cases n'est pas pleine");

    file.start = 3;
    file.size = 4;
    VERIFIER_EGAL(estVide(&file), 0, "une file de 4 valeurs n'est pas vide");
    VERIFIER_EGAL(estPleine(&file), 1, "une file de 4 valeurs sur 4 cases est pleine, même si elle a fait le tour");

    file.size = 5;
    VERIFIER_EGAL(estPleine(&file), 1, "une file qui a dépassé sa capacité est considérée comme pleine");

    Queue sansCase = {cases, 0, 0, 0};
    VERIFIER_EGAL(estVide(&sansCase), 1, "une file de capacité 0 est vide");
    VERIFIER_EGAL(estPleine(&sansCase), 1, "une file de capacité 0 est aussi pleine");
    return BILAN();
}
