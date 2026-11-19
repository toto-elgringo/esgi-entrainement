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
    int *cases = malloc(n * sizeof(int));
    if (cases == NULL) {
        exit(EXIT_FAILURE);
    }
    Queue file = {cases, 0, 0, n};
    for (int i = 1; i <= n; i++) {
        enfiler(&file, i);
    }
    int j = 0;
    while (file.size > 1) {
        for (int i = 1; i < k; i++) {
            enfiler(&file, defiler(&file));
        }
        ordre[j] = defiler(&file);
        j++;
    }
    int survivant = defiler(&file);
    free(cases);
    return survivant;
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
