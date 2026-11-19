int main(void) {
    File file = {NULL, NULL, 0};
    VERIFIER_EGAL(estVideFile(&file), 1, "une file {NULL, NULL, 0} est vide");

    enfilerListe(&file, 1);
    VERIFIER(file.premier != NULL && file.premier->value == 1, "après avoir enfilé 1, le premier maillon contient 1");
    VERIFIER_EGAL(file.dernier, file.premier, "dans une file d'un seul maillon, premier et dernier sont le même maillon");
    VERIFIER_EGAL(estVideFile(&file), 0, "une file avec une valeur n'est pas vide");

    enfilerListe(&file, 2);
    enfilerListe(&file, 3);
    VERIFIER_EGAL(file.taille, 3, "après trois enfilements, taille vaut 3");
    VERIFIER(file.premier != NULL && file.premier->value == 1, "après avoir enfilé 1, 2, 3, la tête est toujours 1");
    VERIFIER(file.dernier != NULL && file.dernier->value == 3 && file.dernier->next == NULL, "le dernier maillon contient 3 et son next vaut NULL");
    if (file.premier == NULL || file.dernier == NULL) {
        return BILAN();
    }
    VERIFIER(file.premier->next != NULL && file.premier->next->next == file.dernier, "les maillons sont chaînés dans l'ordre 1, 2, 3");

    VERIFIER_EGAL(defilerListe(&file), 1, "le premier défilement renvoie 1 (premier entré, premier sorti)");
    VERIFIER_EGAL(defilerListe(&file), 2, "le deuxième renvoie 2");
    VERIFIER(file.premier == file.dernier && file.taille == 1, "il ne reste qu'un maillon : premier et dernier sont le même, taille vaut 1");
    VERIFIER_EGAL(defilerListe(&file), 3, "le dernier défilement renvoie 3");
    VERIFIER_EGAL(file.premier, NULL, "après avoir tout défilé, premier vaut NULL");
    VERIFIER_EGAL(file.dernier, NULL, "après avoir tout défilé, dernier vaut NULL aussi");
    VERIFIER_EGAL(file.taille, 0, "et taille vaut 0");
    if (file.dernier != NULL) {
        return BILAN();
    }

    enfilerListe(&file, 8);
    VERIFIER(file.premier != NULL && file.premier == file.dernier && file.premier->value == 8, "une file vidée puis réutilisée repart correctement : enfiler 8 donne une file d'un maillon");

    for (int i = 0; i < 5; i++) {
        enfilerListe(&file, i);
    }
    viderFile(&file);
    VERIFIER(file.premier == NULL && file.dernier == NULL && file.taille == 0, "après viderFile, la file vaut {NULL, NULL, 0}");
    viderFile(&file);
    VERIFIER_EGAL(file.premier, NULL, "vider une file déjà vide ne plante pas");
    VERIFIER_SANS_FUITE();
    return BILAN();
}
