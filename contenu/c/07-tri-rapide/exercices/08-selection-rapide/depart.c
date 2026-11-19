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

int selectionRapide(int *t, int n, int k) {
    return 0;
}

int main(void) {
    int t[] = {4, 9, 1, 6, 8, 2, 7};
    printf("La médiane vaut %d\n", selectionRapide(t, 7, 3));
    return 0;
}
