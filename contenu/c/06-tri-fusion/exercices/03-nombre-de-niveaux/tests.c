int main(void) {
    VERIFIER_EGAL(nombreNiveaux(1), 0, "un tableau d'une case ne se coupe pas");
    VERIFIER_EGAL(nombreNiveaux(0), 0, "un tableau vide ne se coupe pas");
    VERIFIER_EGAL(nombreNiveaux(2), 1, "2 cases : un découpage");
    VERIFIER_EGAL(nombreNiveaux(3), 2, "3 cases : 3 -> 2 -> 1, deux niveaux");
    VERIFIER_EGAL(nombreNiveaux(4), 2, "4 cases : 4 -> 2 -> 1, deux niveaux");
    VERIFIER_EGAL(nombreNiveaux(5), 3, "5 cases : on suit la moitié de 3 cases, trois niveaux");
    VERIFIER_EGAL(nombreNiveaux(8), 3, "8 cases : trois niveaux");
    VERIFIER_EGAL(nombreNiveaux(9), 4, "9 cases : quatre niveaux");
    VERIFIER_EGAL(nombreNiveaux(1000), 10, "1000 cases : dix niveaux");
    VERIFIER_EGAL(nombreNiveaux(1024), 10, "1024 cases : dix niveaux");
    VERIFIER_EGAL(nombreNiveaux(1025), 11, "1025 cases : onze niveaux");
    VERIFIER_EGAL(nombreNiveaux(1000000), 20, "un million de cases : seulement vingt niveaux");
    return BILAN();
}
