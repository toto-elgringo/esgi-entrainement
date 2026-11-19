#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *tab;
    int start;
    int size;
    int capacity;
} Queue;

void enfiler(Queue *q, int valeur) {
    q->tab[(q->start + q->size) % q->capacity] = valeur;
    q->size++;
}

int defiler(Queue *q) {
    int valeur = q->tab[q->start];
    q->start = (q->start + 1) % q->capacity;
    q->size--;
    return valeur;
}

void tourniquet(const int *durees, int n, int quantum, int *fin) {
}

int main(void) {
    int durees[3] = {5, 2, 4};
    int fin[3] = {0};
    tourniquet(durees, 3, 2, fin);
    for (int i = 0; i < 3; i++) {
        printf("tâche %d : finie à %d\n", i, fin[i]);
    }
    return 0;
}
