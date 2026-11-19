#include <stdio.h>

typedef struct {
    int *tab;
    int start;
    int size;
    int capacity;
} Queue;

void enfiler(Queue *q, int valeur) {
    q->tab[q->start + q->size] = valeur;
    q->size++;
}

int defiler(Queue *q) {
    q->start = (q->start + 1) % q->capacity;
    q->size--;
    return q->tab[q->start];
}

int valeurA(const Queue *q, int i) {
    return q->tab[q->start + i];
}

int main(void) {
    int cases[8] = {0};
    Queue file = {cases, 0, 0, 4};
    enfiler(&file, 10);
    enfiler(&file, 20);
    enfiler(&file, 30);
    printf("je défile %d\n", defiler(&file));
    enfiler(&file, 40);
    enfiler(&file, 50);
    printf("la dernière valeur est %d\n", valeurA(&file, 3));
    while (file.size > 0) {
        printf("je défile %d\n", defiler(&file));
    }
    printf("témoins : %d %d %d %d\n", cases[4], cases[5], cases[6], cases[7]);
    return 0;
}
