#include <stdlib.h>

static int aide_tas_max(const int *t, int n) {
    for (int i = 1; i < n; i++) {
        if (t[i] > t[(i - 1) / 2]) {
            return 0;
        }
    }
    return 1;
}

static int aide_egal(const int *t, const int *attendu, int n) {
    for (int i = 0; i < n; i++) {
        if (t[i] != attendu[i]) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int a[] = {9, 5, 8, 1, 2, 7};
    int ta = 6;
    VERIFIER_EGAL(retirerRacine(a, &ta), 9, "retirer la racine de {9, 5, 8, 1, 2, 7} renvoie 9");
    VERIFIER_EGAL(ta, 5, "la taille passe de 6 à 5");
    int a_attendu[] = {8, 5, 7, 1, 2, 9};
    VERIFIER(aide_egal(a, a_attendu, 6), "le tableau devient {8, 5, 7, 1, 2} suivi de l'ancien maximum 9");

    int b[] = {72, 54, 30, 28, 12, 5};
    int tb = 6;
    VERIFIER_EGAL(retirerRacine(b, &tb), 72, "retirer la racine de {72, 54, 30, 28, 12, 5} renvoie 72");
    int b_attendu[] = {54, 28, 30, 5, 12, 72};
    VERIFIER(tb == 5 && aide_egal(b, b_attendu, 6), "le tableau devient {54, 28, 30, 5, 12} suivi de 72");

    int c[] = {10, 4, 9, 3};
    int tc = 4;
    VERIFIER_EGAL(retirerRacine(c, &tc), 10, "{10, 4, 9, 3} : on retire 10");
    VERIFIER(tc == 3 && aide_tas_max(c, 3) && c[0] == 9 && c[3] == 10, "il reste un tas max de 3 cases avec 9 à la racine, et 10 juste après");

    int d[] = {6, 5};
    int td = 2;
    VERIFIER(retirerRacine(d, &td) == 6 && td == 1 && d[0] == 5 && d[1] == 6, "{6, 5} : on retire 6, il reste {5}, puis 6");

    int e[] = {3};
    int te = 1;
    VERIFIER(retirerRacine(e, &te) == 3 && te == 0, "un tas d'une case : on retire sa seule valeur, la taille passe à 0");

    int n = 5000;
    int *t = malloc(n * sizeof(int));
    if (t == NULL) {
        exit(EXIT_FAILURE);
    }
    for (int i = 0; i < n; i++) {
        t[i] = n - i;
    }
    int taille = n;
    int ok = 1;
    for (int attendu = n; attendu >= 1; attendu--) {
        if (retirerRacine(t, &taille) != attendu || !aide_tas_max(t, taille)) {
            ok = 0;
            break;
        }
    }
    VERIFIER(ok, "en retirant 5 000 fois la racine, on obtient 5 000, 4 999, ..., 1 et le reste est toujours un tas max");
    free(t);
    return BILAN();
}
