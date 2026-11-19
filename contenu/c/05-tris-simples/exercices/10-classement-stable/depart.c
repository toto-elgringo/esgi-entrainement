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
    for (size_t i = 0; i + 1 < n; i++) {
        size_t pos_max = i;
        for (size_t j = i + 1; j < n; j++) {
            if (fiches[j].note > fiches[pos_max].note) {
                pos_max = j;
            }
        }
        if (pos_max != i) {
            echanger_fiches(&fiches[i], &fiches[pos_max]);
        }
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
