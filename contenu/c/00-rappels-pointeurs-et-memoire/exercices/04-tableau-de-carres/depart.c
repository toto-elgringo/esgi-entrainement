#include <stdio.h>
#include <stdlib.h>

int *carres(int n) {
    return NULL;
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
