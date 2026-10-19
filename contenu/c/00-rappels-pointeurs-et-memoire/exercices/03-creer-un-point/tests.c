int main(void) {
    Point *a = creerPoint(3, 4);
    VERIFIER(a != NULL, "creerPoint ne renvoie pas NULL");
    VERIFIER(a != NULL && a->x == 3 && a->y == 4, "creerPoint(3, 4) donne le point (3, 4)");

    Point *b = creerPoint(-1, 0);
    VERIFIER(b != NULL && b->x == -1 && b->y == 0, "creerPoint(-1, 0) donne le point (-1, 0)");
    VERIFIER(a != NULL && a != b, "deux appels donnent deux points à des adresses différentes");
    VERIFIER(a != NULL && a->x == 3 && a->y == 4, "créer un second point ne modifie pas le premier");

    free(a);
    if (b != a) {
        free(b);
    }
    VERIFIER_SANS_FUITE();
    return BILAN();
}
