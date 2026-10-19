int main(void) {
    int x = 1;
    int y = 2;
    echanger(&x, &y);
    VERIFIER(x == 2, "après l'échange, x vaut 2");
    VERIFIER(y == 1, "après l'échange, y vaut 1");

    int a = -5;
    int b = 40;
    echanger(&a, &b);
    VERIFIER(a == 40 && b == -5, "échanger -5 et 40 donne 40 et -5");

    int c = 9;
    int d = 9;
    echanger(&c, &d);
    VERIFIER(c == 9 && d == 9, "échanger deux valeurs égales ne change rien");
    return BILAN();
}
