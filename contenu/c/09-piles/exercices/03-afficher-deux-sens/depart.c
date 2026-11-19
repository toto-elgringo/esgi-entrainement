#include <stdio.h>

typedef struct {
    int *tab;
    int size;
    int capacity;
} Stack;

void afficherDepuisFond(const Stack *s) {
}

void afficherDepuisDessus(const Stack *s) {
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
