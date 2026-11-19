#include <stdio.h>

typedef struct {
    int *tab;
    int start;
    int size;
    int capacity;
} Queue;

int enfiler(Queue *q, int valeur) {
    q->tab[(q->start + q->size) % q->capacity] = valeur;
    q->size++;
    return 1;
}

int defiler(Queue *q, int *valeur) {
    *valeur = q->tab[q->start];
    q->start = (q->start + 1) % q->capacity;
    q->size--;
    return 1;
}

int lireTete(const Queue *q, int *valeur) {
    *valeur = q->tab[q->start];
    return 1;
}

int main(void) {
    int cases[3];
    Queue file = {cases, 0, 0, 3};
    for (int i = 1; i <= 4; i++) {
        printf("enfiler %d : %d\n", i, enfiler(&file, i));
    }
    int v = 0;
    while (defiler(&file, &v)) {
        printf("je défile %d\n", v);
        if (file.size < 0) {
            printf("size vaut %d : la file est cassée\n", file.size);
            break;
        }
    }
    return 0;
}
