int main(void) {
    Queue *file = creerFile(2);
    enfiler(file, 1);
    enfiler(file, 2);
    VERIFIER(file->size == 2 && file->capacity == 2, "deux enfilements remplissent une file de capacité 2");
    VERIFIER_EGAL(defiler(file), 1, "on défile 1");
    enfiler(file, 3);
    VERIFIER(file->size == 2 && file->capacity == 2, "enfiler 3 utilise la case libérée : la file a fait le tour, sans s'agrandir");

    enfiler(file, 4);
    VERIFIER_EGAL(file->capacity, 4, "enfiler dans une file pleine de capacité 2 double la capacité : 4");
    VERIFIER_EGAL(file->size, 3, "la file contient alors 3 valeurs");
    VERIFIER_EGAL(defiler(file), 2, "après l'agrandissement, la tête est toujours 2");
    VERIFIER_EGAL(defiler(file), 3, "puis 3, qui avait fait le tour de l'ancien tableau");
    VERIFIER_EGAL(defiler(file), 4, "puis 4, la valeur enfilée pendant l'agrandissement");
    VERIFIER_EGAL(file->size, 0, "la file est vide");

    int suivant = 100;
    int attendu = 100;
    int dansLOrdre = 1;
    for (int tour = 0; tour < 30; tour++) {
        for (int i = 0; i < 3; i++) {
            enfiler(file, suivant);
            suivant++;
        }
        if (defiler(file) != attendu) {
            dansLOrdre = 0;
        }
        attendu++;
    }
    VERIFIER_EGAL(file->size, 60, "après 90 enfilements et 30 défilements mélangés, la file contient 60 valeurs");
    VERIFIER_EGAL(file->capacity, 64, "en doublant à partir de 2, la capacité vaut 64 pour 60 valeurs");
    while (file->size > 0) {
        if (defiler(file) != attendu) {
            dansLOrdre = 0;
        }
        attendu++;
    }
    VERIFIER(dansLOrdre, "les 90 valeurs sortent dans l'ordre d'arrivée : aucune n'est perdue ni déplacée pendant les agrandissements");
    libererFile(file);

    Queue *autre = creerFile(4);
    enfiler(autre, 7);
    libererFile(autre);
    VERIFIER_SANS_FUITE();
    return BILAN();
}
