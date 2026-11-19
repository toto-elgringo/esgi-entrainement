#include <stdio.h>

void echanger(int *t, int i, int j) {
    int temporaire = t[i];
    t[i] = t[j];
    t[j] = temporaire;
}

int partition(int *t, int debut, int fin, int indicePivot) {
    int dernier = fin - 1;
    echanger(t, indicePivot, dernier);
    int position = 0;
    for (int i = 0; i < dernier; i++) {
        if (t[i] < t[dernier]) {
            echanger(t, i, position);
            position++;
        }
    }
    echanger(t, position, dernier);
    return position;
}

int main(void) {
    int t[] = {100, 200, 4, 9, 1, 6, 8, 2, 7, 300};
    int p = partition(t, 2, 9, 5);
    printf("Le pivot est à l'indice %d : ", p);
    for (int i = 0; i < 10; i++) {
        printf("%d ", t[i]);
    }
    printf("\n");
    return 0;
}
