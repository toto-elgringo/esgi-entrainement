#include <stdio.h>

typedef struct {
    int *tab;
    int start;
    int size;
    int capacity;
} Queue;

void enfiler(Queue *q, int valeur) {
    int fin = (q->start + q->size) % q->capacity;
    q->tab[fin] = valeur;
    q->size++;
}

int defiler(Queue *q) {
    int valeur = q->tab[q->start];
    q->start = (q->start + 1) % q->capacity;
    q->size--;
    return valeur;
}

int tete(const Queue *q) {
    return q->tab[q->start];
}

int main(void) {
    int cases[3];
    Queue file = {cases, 0, 0, 3};
    enfiler(&file, 1);
    enfiler(&file, 2);
    enfiler(&file, 3);
    printf("je défile %d\n", defiler(&file));
    enfiler(&file, 4);
    printf("la tête est %d\n", tete(&file));
    while (file.size > 0) {
        printf("je défile %d\n", defiler(&file));
    }
    return 0;
}
