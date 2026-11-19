#include <stdio.h>

int enfantGauche(int i) {
    return 2 * i + 1;
}

int enfantDroit(int i) {
    return 2 * i + 2;
}

int parent(int i) {
    return (i - 1) / 2;
}

int valeurDuParent(const int *t, int i) {
    return t[parent(i)];
}

int main(void) {
    int t[] = {53, 29, 12, 4, 15, 3, 9, 1};
    for (int i = 0; i < 8; i++) {
        printf("case %d (valeur %d) : enfants %d et %d\n", i, t[i], enfantGauche(i), enfantDroit(i));
    }
    printf("parent de la case 7 : case %d, valeur %d\n", parent(7), valeurDuParent(t, 7));
    return 0;
}
