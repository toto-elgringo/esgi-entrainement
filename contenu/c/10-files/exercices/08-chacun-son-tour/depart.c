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

int eliminer(int n, int k, int *ordre) {
    return 0;
}

int main(void) {
    int ordre[5] = {0};
    int survivant = eliminer(6, 3, ordre);
    printf("éliminées : ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", ordre[i]);
    }
    printf("\nil reste : %d\n", survivant);
    return 0;
}
