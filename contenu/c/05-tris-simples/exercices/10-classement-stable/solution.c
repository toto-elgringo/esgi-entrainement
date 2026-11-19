#include <stdio.h>

typedef struct {
    char nom[16];
    int note;
} Fiche;

void echanger_fiches(Fiche *a, Fiche *b) {
    Fiche temp = *a;
    *a = *b;
    *b = temp;
}

void classer(Fiche *fiches, size_t n) {
    for (size_t i = 1; i < n; i++) {
        Fiche f = fiches[i];
        size_t j = i;
        while (j > 0 && fiches[j - 1].note < f.note) {
            fiches[j] = fiches[j - 1];
            j--;
        }
        fiches[j] = f;
    }
}

int main(void) {
    Fiche fiches[] = {{"Alice", 12}, {"Bruno", 15}, {"Chloe", 12}, {"David", 18}};
    classer(fiches, 4);
    for (size_t i = 0; i < 4; i++) {
        printf("%s %d\n", fiches[i].nom, fiches[i].note);
    }
    return 0;
}
