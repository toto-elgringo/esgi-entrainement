int main(void) {
    int cases[3] = {0, 0, 0};
    Queue file = {cases, 0, 0, 3};
    int v = 1234;

    VERIFIER_EGAL(lireTete(&file, &v), 0, "lire la tête d'une file vide renvoie 0");
    VERIFIER_EGAL(v, 1234, "une lecture refusée ne modifie pas la variable reçue");

    VERIFIER_EGAL(enfiler(&file, 1), 1, "enfiler 1 dans une file vide réussit");
    VERIFIER_EGAL(enfiler(&file, 2), 1, "enfiler 2 réussit");
    VERIFIER_EGAL(enfiler(&file, 3), 1, "enfiler 3 remplit la file et réussit");
    VERIFIER_EGAL(enfiler(&file, 4), 0, "enfiler 4 dans une file pleine renvoie 0");
    VERIFIER_EGAL(file.size, 3, "une file pleine garde sa taille de 3 après un enfilement refusé");
    VERIFIER_EGAL(cases[0], 1, "la tête 1 n'est pas écrasée par l'enfilement refusé");
    VERIFIER(lireTete(&file, &v) == 1 && v == 1, "la tête est toujours 1");

    VERIFIER(defiler(&file, &v) == 1 && v == 1, "le premier défilement réussit et donne 1");
    VERIFIER_EGAL(enfiler(&file, 5), 1, "après un défilement, il y a de nouveau une place : enfiler 5 réussit");
    VERIFIER_EGAL(enfiler(&file, 6), 0, "la file est de nouveau pleine : enfiler 6 renvoie 0");
    VERIFIER_EGAL(cases[1], 2, "la nouvelle tête 2 n'est pas écrasée par l'enfilement refusé");

    VERIFIER(defiler(&file, &v) == 1 && v == 2, "on défile ensuite 2");
    VERIFIER(defiler(&file, &v) == 1 && v == 3, "puis 3");
    VERIFIER(defiler(&file, &v) == 1 && v == 5, "puis 5, qui avait fait le tour du tableau");

    int start = file.start;
    v = 1234;
    VERIFIER_EGAL(defiler(&file, &v), 0, "défiler une file vide renvoie 0");
    VERIFIER_EGAL(file.size, 0, "une file vide garde une taille de 0 après un défilement refusé");
    VERIFIER_EGAL(file.start, start, "un défilement refusé ne déplace pas la tête");
    VERIFIER_EGAL(v, 1234, "un défilement refusé ne modifie pas la variable reçue");

    VERIFIER_EGAL(enfiler(&file, 7), 1, "après tout ça, la file marche encore : enfiler 7 réussit");
    VERIFIER(defiler(&file, &v) == 1 && v == 7, "et on retrouve 7 en défilant");
    return BILAN();
}
