#include <stdio.h>

typedef struct {
    int *tab;
    int start;
    int size;
    int capacity;
} Queue;

void enfiler(Queue *q, int valeur) {
}

int defiler(Queue *q) {
    return 0;
}

int tete(const Queue *q) {
    return 0;
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
