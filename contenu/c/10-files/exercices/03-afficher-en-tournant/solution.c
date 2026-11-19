#include <stdio.h>

typedef struct {
    int *tab;
    int start;
    int size;
    int capacity;
} Queue;

void afficher(const Queue *q) {
    if (q->size == 0) {
        printf("(vide)\n");
        return;
    }
    for (int i = 0; i < q->size; i++) {
        printf("%d ", q->tab[(q->start + i) % q->capacity]);
    }
    printf("\n");
}

void afficherDepuisFin(const Queue *q) {
    if (q->size == 0) {
        printf("(vide)\n");
        return;
    }
    for (int i = 0; i < q->size; i++) {
        printf("%d ", q->tab[(q->start + q->size - 1 - i) % q->capacity]);
    }
    printf("\n");
}

int main(void) {
    int cases[5] = {7, 0, 0, 3, 5};
    int pleine[5] = {4, 5, 1, 2, 3};
    Queue a = {cases, 3, 3, 5};
    afficher(&a);
    afficherDepuisFin(&a);
    Queue b = {cases, 3, 0, 5};
    afficher(&b);
    afficherDepuisFin(&b);
    Queue c = {pleine, 2, 5, 5};
    afficher(&c);
    afficherDepuisFin(&c);
    Queue d = {cases, 4, 1, 5};
    afficher(&d);
    return 0;
}
