int main(void) {
    Copie a[] = {{12, "Alice"}, {15, "Chloe"}};
    Copie b[] = {{12, "Bruno"}, {15, "David"}};
    Copie r[4];
    fusionnerCopies(a, 2, b, 2, r);
    VERIFIER_EGAL(r[0].nom, "Alice", "note 12 : Alice (paquet a) passe avant Bruno (paquet b)");
    VERIFIER_EGAL(r[1].nom, "Bruno", "en deuxième : Bruno");
    VERIFIER_EGAL(r[2].nom, "Chloe", "note 15 : Chloe (paquet a) passe avant David (paquet b)");
    VERIFIER_EGAL(r[3].nom, "David", "en dernier : David");

    Copie c[] = {{10, "Emma"}};
    Copie d[] = {{10, "Farid"}, {10, "Gael"}};
    Copie r2[3];
    fusionnerCopies(c, 1, d, 2, r2);
    VERIFIER(r2[0].note == 10 && r2[0].nom[0] == 'E' && r2[1].nom[0] == 'F' && r2[2].nom[0] == 'G', "trois notes égales : Emma, puis Farid, puis Gael");

    Copie e[] = {{8, "Hugo"}, {14, "Ines"}, {14, "Jade"}};
    Copie f[] = {{9, "Karim"}, {14, "Lea"}, {20, "Malo"}};
    Copie r3[6];
    fusionnerCopies(e, 3, f, 3, r3);
    VERIFIER(r3[0].note == 8 && r3[1].note == 9 && r3[5].note == 20, "les notes sont dans l'ordre 8, 9, ..., 20");
    VERIFIER(r3[2].nom[0] == 'I' && r3[3].nom[0] == 'J' && r3[4].nom[0] == 'L', "note 14 : Ines et Jade (paquet a) avant Lea (paquet b)");
    return BILAN();
}
