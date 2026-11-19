int main(void) {
    File file = {NULL, NULL, 0};
    enfilerListe(&file, 1);
    VERIFIER_EGAL(defilerListe(&file), 1, "défiler une file qui ne contient que 1 renvoie 1");
    VERIFIER_EGAL(file.premier, NULL, "après avoir défilé le seul maillon, premier vaut NULL");
    VERIFIER_EGAL(file.dernier, NULL, "après avoir défilé le seul maillon, dernier vaut NULL aussi");
    if (file.dernier != NULL) {
        return BILAN();
    }

    enfilerListe(&file, 2);
    VERIFIER(file.premier != NULL && file.premier == file.dernier && file.premier->value == 2, "une file vidée puis réutilisée repart correctement : enfiler 2 donne une file d'un maillon");

    enfilerListe(&file, 3);
    enfilerListe(&file, 4);
    VERIFIER_EGAL(defilerListe(&file), 2, "on défile 2");
    VERIFIER_EGAL(defilerListe(&file), 3, "puis 3");
    VERIFIER(file.premier == file.dernier && file.taille == 1, "il ne reste qu'un maillon : premier et dernier sont le même, taille vaut 1");
    VERIFIER_EGAL(defilerListe(&file), 4, "puis 4");
    VERIFIER(file.premier == NULL && file.dernier == NULL && file.taille == 0, "la file est de nouveau {NULL, NULL, 0}");
    VERIFIER_SANS_FUITE();

    for (int i = 0; i < 6; i++) {
        enfilerListe(&file, i);
    }
    viderFile(&file);
    VERIFIER(file.premier == NULL && file.dernier == NULL && file.taille == 0, "après viderFile, la file vaut {NULL, NULL, 0}");
    VERIFIER_SANS_FUITE();
    return BILAN();
}
