#include <stdio.h>

typedef struct {
    int *tab;
    int size;
    int capacity;
} Stack;

void afficherDepuisFond(const Stack *s) {
    if (s->size == 0) {
        printf("(vide)\n");
        return;
    }
    for (int i = 0; i < s->size; i++) {
        printf("%d ", s->tab[i]);
    }
    printf("\n");
}

void afficherDepuisDessus(const Stack *s) {
    if (s->size == 0) {
        printf("(vide)\n");
        return;
    }
    for (int i = s->size - 1; i >= 0; i--) {
        printf("%d ", s->tab[i]);
    }
    printf("\n");
}

int main(void) {
    int cases[5] = {3, 8, 1, 0, 0};
    Stack pile = {cases, 3, 5};
    afficherDepuisFond(&pile);
    afficherDepuisDessus(&pile);
    pile.size = 0;
    afficherDepuisFond(&pile);
    afficherDepuisDessus(&pile);
    pile.size = 1;
    afficherDepuisDessus(&pile);
    return 0;
}
