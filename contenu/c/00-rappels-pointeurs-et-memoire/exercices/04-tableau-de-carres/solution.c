#include <stdio.h>
#include <stdlib.h>

int *carres(int n) {
    int *t = malloc(n * sizeof(int));
    if (t == NULL) {
        exit(EXIT_FAILURE);
    }
    for (int i = 0; i < n; i++) {
        t[i] = i * i;
    }
    return t;
}

int main(void) {
    int n = 5;
    int *t = carres(n);
    if (t != NULL) {
        for (int i = 0; i < n; i++) {
            printf("%d ", t[i]);
        }
        printf("\n");
        free(t);
    }
    return 0;
}
