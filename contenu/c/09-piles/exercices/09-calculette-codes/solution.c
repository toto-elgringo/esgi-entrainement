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
    int cases[64];
    Stack pile = {cases, 0, 64};
    int i = 0;
    while (calcul[i] != '\0') {
        char c = calcul[i];
        if (c == ' ') {
            i++;
        } else if (c >= '0' && c <= '9') {
            int nombre = 0;
            while (calcul[i] >= '0' && calcul[i] <= '9') {
                nombre = nombre * 10 + (calcul[i] - '0');
                i++;
            }
            empiler(&pile, nombre);
        } else if (c == '+' || c == '-' || c == 'x') {
            if (pile.size < 2) {
                return PAS_ASSEZ_DE_NOMBRES;
            }
            int droite = depiler(&pile);
            int gauche = depiler(&pile);
            if (c == '+') {
                empiler(&pile, gauche + droite);
            } else if (c == '-') {
                empiler(&pile, gauche - droite);
            } else {
                empiler(&pile, gauche * droite);
            }
            i++;
        } else {
            return SYMBOLE_INCONNU;
        }
    }
    if (estVide(&pile)) {
        return PAS_ASSEZ_DE_NOMBRES;
    }
    if (pile.size > 1) {
        return TROP_DE_NOMBRES;
    }
    *resultat = depiler(&pile);
    return CALCUL_OK;
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
