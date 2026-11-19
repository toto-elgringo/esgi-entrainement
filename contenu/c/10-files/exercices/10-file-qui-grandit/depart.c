#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *tab;
    int start;
    int size;
    int capacity;
} Queue;

Queue *creerFile(int capacite) {
    Queue *q = malloc(sizeof(Queue));
    if (q == NULL) {
        exit(EXIT_FAILURE);
    }
    q->tab = malloc(capacite * sizeof(int));
    if (q->tab == NULL) {
        exit(EXIT_FAILURE);
    }
    q->start = 0;
    q->size = 0;
    q->capacity = capacite;
    return q;
}

int defiler(Queue *q) {
    int valeur = q->tab[q->start];
    q->start = (q->start + 1) % q->capacity;
    q->size--;
    return valeur;
}

void enfiler(Queue *q, int valeur) {
}

void libererFile(Queue *q) {
}

int main(void) {
    Queue *file = creerFile(2);
    enfiler(file, 1);
    enfiler(file, 2);
    printf("je défile %d\n", defiler(file));
    for (int i = 3; i <= 6; i++) {
        enfiler(file, i);
        printf("enfiler %d : size %d, capacity %d\n", i, file->size, file->capacity);
    }
    while (file->size > 0) {
        printf("%d ", defiler(file));
    }
    printf("\n");
    libererFile(file);
    return 0;
}
