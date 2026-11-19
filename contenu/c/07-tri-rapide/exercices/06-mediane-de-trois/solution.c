#include <stdio.h>

void echanger(int *t, int i, int j) {
    int temporaire = t[i];
    t[i] = t[j];
    t[j] = temporaire;
}

int partition(int *t, int debut, int fin, int indicePivot) {
    int dernier = fin - 1;
    echanger(t, indicePivot, dernier);
    int position = debut;
    for (int i = debut; i < dernier; i++) {
        if (t[i] < t[dernier]) {
            echanger(t, i, position);
            position++;
        }
    }
    echanger(t, position, dernier);
    return position;
}

int medianeDeTrois(const int *t, int debut, int fin) {
    int milieu = debut + (fin - debut) / 2;
    int dernier = fin - 1;
    int a = t[debut];
    int b = t[milieu];
    int c = t[dernier];
    if ((a <= b && b <= c) || (c <= b && b <= a)) {
        return milieu;
    }
    if ((b <= a && a <= c) || (c <= a && a <= b)) {
        return debut;
    }
    return dernier;
}

void trierRapidePartie(int *t, int debut, int fin) {
    if (fin - debut <= 1) {
        return;
    }
    int p = partition(t, debut, fin, medianeDeTrois(t, debut, fin));
    trierRapidePartie(t, debut, p);
    trierRapidePartie(t, p + 1, fin);
}

void triRapide(int *t, int n) {
    trierRapidePartie(t, 0, n);
}

int main(void) {
    int t[] = {9, 4, 7, 1, 2};
    printf("Pivot choisi : indice %d\n", medianeDeTrois(t, 0, 5));
    triRapide(t, 5);
    for (int i = 0; i < 5; i++) {
        printf("%d ", t[i]);
    }
    printf("\n");
    return 0;
}
