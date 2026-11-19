#include <stdio.h>

void echanger(int *t, int i, int j) {
    int temporaire = t[i];
    t[i] = t[j];
    t[j] = temporaire;
}

void partitionTroisZones(int *t, int debut, int fin, int pivot, int *finPetits, int *debutGrands) {
    int petits = debut;
    int i = debut;
    int grands = fin;
    while (i < grands) {
        if (t[i] < pivot) {
            echanger(t, i, petits);
            petits++;
            i++;
        } else if (t[i] > pivot) {
            grands--;
            echanger(t, i, grands);
        } else {
            i++;
        }
    }
    *finPetits = petits;
    *debutGrands = grands;
}

void trierPartie3(int *t, int debut, int fin) {
    if (fin - debut <= 1) {
        return;
    }
    int pivot = t[debut + (fin - debut) / 2];
    int finPetits = debut;
    int debutGrands = fin;
    partitionTroisZones(t, debut, fin, pivot, &finPetits, &debutGrands);
    trierPartie3(t, debut, finPetits);
    trierPartie3(t, debutGrands, fin);
}

void triRapide3(int *t, int n) {
    trierPartie3(t, 0, n);
}

int main(void) {
    int t[] = {5, 2, 5, 9, 5, 1, 7};
    int p = 0;
    int g = 0;
    partitionTroisZones(t, 0, 7, 5, &p, &g);
    printf("petites : [0, %d), égales : [%d, %d), grandes : [%d, 7)\n", p, p, g, g);
    for (int i = 0; i < 7; i++) {
        printf("%d ", t[i]);
    }
    printf("\n");
    return 0;
}
