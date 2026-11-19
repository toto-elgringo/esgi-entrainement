#include <stdio.h>

typedef struct {
    int note;
    char nom[8];
} Copie;

void fusionnerCopies(const Copie *a, int na, const Copie *b, int nb, Copie *resultat) {
    int i = 0;
    int j = 0;
    int k = 0;
    while (i < na && j < nb) {
        if (a[i].note < b[j].note) {
            resultat[k++] = a[i++];
        } else {
            resultat[k++] = b[j++];
        }
    }
    while (i < na) {
        resultat[k++] = a[i++];
    }
    while (j < nb) {
        resultat[k++] = b[j++];
    }
}

int main(void) {
    Copie a[] = {{12, "Alice"}, {15, "Chloe"}};
    Copie b[] = {{12, "Bruno"}, {15, "David"}};
    Copie resultat[4];
    fusionnerCopies(a, 2, b, 2, resultat);
    for (int i = 0; i < 4; i++) {
        printf("%d %s\n", resultat[i].note, resultat[i].nom);
    }
    return 0;
}
