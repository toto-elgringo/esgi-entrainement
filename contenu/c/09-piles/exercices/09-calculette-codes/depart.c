#include <stdio.h>

enum {
    CALCUL_OK,
    PAS_ASSEZ_DE_NOMBRES,
    TROP_DE_NOMBRES,
    SYMBOLE_INCONNU
};

typedef struct {
    int *tab;
    int size;
    int capacity;
} Stack;

int estVide(const Stack *s) {
    return s->size == 0;
}

void empiler(Stack *s, int valeur) {
    s->tab[s->size] = valeur;
    s->size++;
}

int depiler(Stack *s) {
    s->size--;
    return s->tab[s->size];
}

int sommet(const Stack *s) {
    return s->tab[s->size - 1];
}

int evaluer(const char *calcul, int *resultat) {
    return -1;
}

int main(void) {
    const char *calculs[] = {"12 30 +", "3 4 + 2 x", "5 +", "1 2", "6 2 /"};
    for (int i = 0; i < 5; i++) {
        int resultat = 0;
        int code = evaluer(calculs[i], &resultat);
        printf("%-10s -> code %d, résultat %d\n", calculs[i], code, resultat);
    }
    return 0;
}
