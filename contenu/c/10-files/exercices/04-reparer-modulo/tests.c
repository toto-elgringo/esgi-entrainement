int main(void) {
    int zone[14];
    for (int i = 0; i < 14; i++) {
        zone[i] = -1;
    }
    Queue file = {zone + 1, 0, 0, 4};

    enfiler(&file, 10);
    enfiler(&file, 20);
    enfiler(&file, 30);
    VERIFIER_EGAL(valeurA(&file, 0), 10, "après avoir enfilé 10, 20, 30, la tête est 10");
    VERIFIER_EGAL(defiler(&file), 10, "le premier défilement renvoie 10, la valeur la plus ancienne");
    VERIFIER_EGAL(file.start, 1, "après un défilement, la tête est en case 1");

    enfiler(&file, 40);
    enfiler(&file, 50);
    VERIFIER_EGAL(zone[1], 50, "enfiler 50 quand la case 3 est prise écrit dans la case 0, qui était libre");
    VERIFIER_EGAL(zone[5], -1, "rien n'est écrit juste après la fin du tableau");
    VERIFIER_EGAL(valeurA(&file, 0), 20, "valeurA(q, 0) est la tête : 20");
    VERIFIER_EGAL(valeurA(&file, 2), 40, "valeurA(q, 2) vaut 40, dans la dernière case du tableau");
    VERIFIER_EGAL(valeurA(&file, 3), 50, "valeurA(q, 3) fait le tour du tableau et vaut 50");

    VERIFIER_EGAL(defiler(&file), 20, "on défile ensuite 20");
    VERIFIER_EGAL(defiler(&file), 30, "puis 30");
    VERIFIER_EGAL(defiler(&file), 40, "puis 40");
    VERIFIER_EGAL(file.start, 0, "après avoir défilé la case 3, la tête revient en case 0");
    VERIFIER_EGAL(defiler(&file), 50, "puis 50");
    VERIFIER(file.start == 1 && file.size == 0, "à la fin, la file est vide et sa tête est en case 1");

    int dansLOrdre = 1;
    for (int i = 0; i < 9; i++) {
        enfiler(&file, i);
        if (defiler(&file) != i || file.start < 0 || file.start >= 4) {
            dansLOrdre = 0;
        }
    }
    VERIFIER(dansLOrdre, "en enfilant puis défilant 9 fois de suite, on retrouve chaque valeur et la tête reste dans le tableau");

    int temoinsIntacts = zone[0] == -1;
    for (int i = 5; i < 14; i++) {
        if (zone[i] != -1) {
            temoinsIntacts = 0;
        }
    }
    VERIFIER(temoinsIntacts, "aucune case en dehors du tableau de 4 n'a été modifiée");
    return BILAN();
}
