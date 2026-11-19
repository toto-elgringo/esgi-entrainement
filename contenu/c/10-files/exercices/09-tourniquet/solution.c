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
    if (n <= 0) {
        return;
    }
    int *cases = malloc(n * sizeof(int));
    int *reste = malloc(n * sizeof(int));
    if (cases == NULL || reste == NULL) {
        exit(EXIT_FAILURE);
    }
    Queue file = {cases, 0, 0, n};
    for (int i = 0; i < n; i++) {
        reste[i] = durees[i];
        enfiler(&file, i);
    }
    int temps = 0;
    while (file.size > 0) {
        int i = defiler(&file);
        int tranche = reste[i] < quantum ? reste[i] : quantum;
        temps += tranche;
        reste[i] -= tranche;
        if (reste[i] > 0) {
            enfiler(&file, i);
        } else {
            fin[i] = temps;
        }
    }
    free(reste);
    free(cases);
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
