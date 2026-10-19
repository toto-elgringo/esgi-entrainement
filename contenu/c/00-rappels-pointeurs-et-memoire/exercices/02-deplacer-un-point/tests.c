int main(void) {
    Point a = {3, 4};
    deplacer(&a, 1, -2);
    VERIFIER(a.x == 4, "(3, 4) déplacé de (1, -2) : x vaut 4");
    VERIFIER(a.y == 2, "(3, 4) déplacé de (1, -2) : y vaut 2");

    Point b = {0, 0};
    deplacer(&b, 0, 0);
    VERIFIER(b.x == 0 && b.y == 0, "un déplacement de (0, 0) ne change rien");

    Point c = {10, -10};
    deplacer(&c, -15, 5);
    deplacer(&c, 2, 2);
    VERIFIER(c.x == -3 && c.y == -3, "(10, -10) déplacé de (-15, 5) puis de (2, 2) donne (-3, -3)");
    return BILAN();
}
