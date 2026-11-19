static int aide_egale(const int *obtenu, const int *attendu, int n) {
    for (int i = 0; i < n; i++) {
        if (obtenu[i] != attendu[i]) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int fin[8] = {0};

    tourniquet((int[]){5, 2, 4}, 3, 2, fin);
    VERIFIER(aide_egale(fin, (int[]){11, 4, 10}, 3), "durées 5 2 4 avec un quantum de 2 : les tâches finissent à 11, 4 et 10");

    tourniquet((int[]){4, 1, 3, 2}, 4, 2, fin);
    VERIFIER(aide_egale(fin, (int[]){9, 3, 10, 7}, 4), "durées 4 1 3 2 avec un quantum de 2 : les tâches finissent à 9, 3, 10 et 7");

    tourniquet((int[]){3, 1, 2}, 3, 10, fin);
    VERIFIER(aide_egale(fin, (int[]){3, 4, 6}, 3), "avec un grand quantum, chaque tâche finit d'un coup, dans l'ordre : 3, 4, 6");

    tourniquet((int[]){2, 2}, 2, 1, fin);
    VERIFIER(aide_egale(fin, (int[]){3, 4}, 2), "durées 2 2 avec un quantum de 1 : les tâches alternent et finissent à 3 et 4");

    tourniquet((int[]){7}, 1, 3, fin);
    VERIFIER_EGAL(fin[0], 7, "une tâche seule de durée 7 finit à 7, même découpée en tranches de 3");

    fin[0] = -1;
    tourniquet(fin, 0, 2, fin);
    VERIFIER_EGAL(fin[0], -1, "sans aucune tâche, rien n'est modifié");

    int durees[8] = {6, 1, 1, 1, 1, 1, 1, 1};
    tourniquet(durees, 8, 2, fin);
    VERIFIER_EGAL(fin[0], 13, "une longue tâche de durée 6 finit en dernier, à 13");
    VERIFIER(aide_egale(fin + 1, (int[]){3, 4, 5, 6, 7, 8, 9}, 7), "les 7 tâches courtes finissent à 3, 4, ..., 9 : la longue ne les bloque pas");
    VERIFIER_EGAL(durees[0], 6, "le tableau des durées n'est pas modifié");

    VERIFIER_SANS_FUITE();
    return BILAN();
}
