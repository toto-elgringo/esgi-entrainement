int main(void) {
    VERIFIER_EGAL(etapes(1), 0, "un tableau d'une case : aucune division");
    VERIFIER_EGAL(etapes(2), 1, "2 -> 1 : une division");
    VERIFIER_EGAL(etapes(3), 1, "3 -> 1 : une division (division entière)");
    VERIFIER_EGAL(etapes(8), 3, "8 -> 4 -> 2 -> 1 : trois divisions");
    VERIFIER_EGAL(etapes(10), 3, "10 -> 5 -> 2 -> 1 : trois divisions");
    VERIFIER_EGAL(etapes(1000), 9, "1 000 cases : 9 divisions");
    VERIFIER_EGAL(etapes(1000000), 19, "1 000 000 de cases : 19 divisions");
    return BILAN();
}
