#include <stdio.h>

int estTasMax(const int *t, int n) {
    for (int i = 1; i < n; i++) {
        if (t[i] > t[(i - 1) / 2]) {
            return 0;
        }
    }
    return 1;
}

int estTasMin(const int *t, int n) {
    for (int i = 1; i < n; i++) {
        if (t[i] < t[(i - 1) / 2]) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int t[] = {53, 29, 12, 4, 15, 3, 9, 1};
    printf("tas max : %d, tas min : %d\n", estTasMax(t, 8), estTasMin(t, 8));
    return 0;
}
