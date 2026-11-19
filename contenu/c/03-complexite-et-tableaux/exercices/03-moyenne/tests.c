int main(void) {
    VERIFIER_EGAL(moyenne(NULL, 0), 0.0, "la moyenne d'un tableau vide vaut 0 (sans lire aucune case)");
    VERIFIER_EGAL(moyenne((int[]){10}, 1), 10.0, "la moyenne de 10 vaut 10");
    VERIFIER_EGAL(moyenne((int[]){1, 2}, 2), 1.5, "la moyenne de 1 et 2 vaut 1.5 (pas de division entière)");
    VERIFIER_EGAL(moyenne((int[]){-3, 3, 6}, 3), 2.0, "la moyenne de -3, 3, 6 vaut 2");
    VERIFIER_EGAL(moyenne((int[]){12, 15, 9, 18}, 4), 13.5, "la moyenne de 12, 15, 9, 18 vaut 13.5");
    VERIFIER_EGAL(moyenne((int[]){2000000000, 2000000000}, 2), 2000000000.0, "deux fois 2 milliards : la somme ne doit pas déborder");
    return BILAN();
}
