static int aide_egale(const int *obtenu, const int *attendu, int n) {
    for (int i = 0; i < n; i++) {
        if (obtenu[i] != attendu[i]) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int ordre[64] = {0};

    VERIFIER_EGAL(eliminer(6, 3, ordre), 1, "avec 6 personnes et k = 3, il reste la personne 1");
    VERIFIER(aide_egale(ordre, (int[]){3, 6, 4, 2, 5}, 5), "avec 6 personnes et k = 3, les éliminées sont 3 6 4 2 5");

    VERIFIER_EGAL(eliminer(5, 2, ordre), 3, "avec 5 personnes et k = 2, il reste la personne 3");
    VERIFIER(aide_egale(ordre, (int[]){2, 4, 1, 5}, 4), "avec 5 personnes et k = 2, les éliminées sont 2 4 1 5");

    VERIFIER_EGAL(eliminer(7, 3, ordre), 4, "avec 7 personnes et k = 3, il reste la personne 4");
    VERIFIER(aide_egale(ordre, (int[]){3, 6, 2, 7, 5, 1}, 6), "avec 7 personnes et k = 3, les éliminées sont 3 6 2 7 5 1");

    VERIFIER_EGAL(eliminer(4, 1, ordre), 4, "avec k = 1, chacun est éliminé dans l'ordre et il reste la dernière personne");
    VERIFIER(aide_egale(ordre, (int[]){1, 2, 3}, 3), "avec 4 personnes et k = 1, les éliminées sont 1 2 3");

    VERIFIER_EGAL(eliminer(3, 5, ordre), 1, "k peut être plus grand que le nombre de personnes : avec 3 personnes et k = 5, il reste 1");
    VERIFIER(aide_egale(ordre, (int[]){2, 3}, 2), "avec 3 personnes et k = 5, les éliminées sont 2 3");

    ordre[0] = -7;
    VERIFIER_EGAL(eliminer(1, 3, ordre), 1, "une seule personne reste tout de suite");
    VERIFIER_EGAL(ordre[0], -7, "avec une seule personne, personne n'est éliminé : ordre n'est pas modifié");

    VERIFIER_EGAL(eliminer(41, 3, ordre), 31, "avec 41 personnes et k = 3, il reste la personne 31");
    VERIFIER_SANS_FUITE();
    return BILAN();
}
