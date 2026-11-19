int main(void) {
    int zone[5] = {-1, -1, -1, -1, -1};
    Queue file = {zone + 1, 0, 0, 3};

    enfiler(&file, 1);
    VERIFIER(file.size == 1 && zone[1] == 1, "enfiler 1 dans une file vide l'écrit en case 0, size vaut 1");
    VERIFIER_EGAL(tete(&file), 1, "la tête d'une file qui ne contient que 1 est 1");
    enfiler(&file, 2);
    enfiler(&file, 3);
    VERIFIER_EGAL(tete(&file), 1, "après avoir enfilé 1, 2, 3, la tête est toujours 1");
    VERIFIER_EGAL(file.size, 3, "après trois enfilements, size vaut 3");

    VERIFIER_EGAL(defiler(&file), 1, "le premier défilement renvoie 1 (premier entré, premier sorti)");
    VERIFIER_EGAL(file.start, 1, "après un défilement, la tête est en case 1");
    VERIFIER_EGAL(tete(&file), 2, "la nouvelle tête est 2");

    enfiler(&file, 4);
    VERIFIER_EGAL(zone[1], 4, "enfiler 4 quand la fin du tableau est atteinte écrit dans la case 0, qui était libre");
    VERIFIER_EGAL(zone[4], -1, "rien n'est écrit après la fin du tableau");

    VERIFIER_EGAL(defiler(&file), 2, "on défile ensuite 2");
    VERIFIER_EGAL(defiler(&file), 3, "puis 3");
    VERIFIER_EGAL(file.start, 0, "après avoir défilé la case 2, la tête revient en case 0");
    VERIFIER_EGAL(defiler(&file), 4, "puis 4");
    VERIFIER_EGAL(file.size, 0, "la file est vide après quatre défilements");

    int dansLOrdre = 1;
    int toujoursDedans = 1;
    for (int i = 0; i < 20; i++) {
        enfiler(&file, 100 + i);
        enfiler(&file, 200 + i);
        if (defiler(&file) != 100 + i || defiler(&file) != 200 + i) {
            dansLOrdre = 0;
        }
        if (file.start < 0 || file.start >= file.capacity) {
            toujoursDedans = 0;
        }
    }
    VERIFIER(dansLOrdre, "sur 40 enfilements et défilements, les valeurs sortent dans l'ordre d'arrivée");
    VERIFIER(toujoursDedans, "la tête reste toujours entre 0 et capacity - 1");
    VERIFIER(zone[0] == -1 && zone[4] == -1, "rien n'est écrit avant ou après le tableau");
    return BILAN();
}
