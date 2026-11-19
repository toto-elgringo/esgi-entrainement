#include <stdlib.h>

static int aide_ordre(const Fiche *fiches, const char *const *noms, size_t n) {
    for (size_t i = 0; i < n; i++) {
        if (strcmp(fiches[i].nom, noms[i]) != 0) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    Fiche a[] = {{"Alice", 12}, {"Bruno", 15}, {"Chloe", 12}, {"David", 18}};
    classer(a, 4);
    VERIFIER_EGAL(a[0].nom, "David", "David (18) est premier");
    VERIFIER_EGAL(a[1].nom, "Bruno", "Bruno (15) est deuxième");
    VERIFIER_EGAL(a[2].nom, "Alice", "à 12, Alice reste devant Chloe (ordre alphabétique gardé)");
    VERIFIER_EGAL(a[3].nom, "Chloe", "Chloe (12) est dernière");
    VERIFIER(a[0].note == 18 && a[1].note == 15 && a[2].note == 12 && a[3].note == 12, "chaque nom garde sa note : 18 15 12 12");

    Fiche b[] = {{"Amir", 10}, {"Bea", 14}, {"Cyril", 10}, {"Dina", 14}, {"Eli", 10}, {"Fanny", 17}};
    classer(b, 6);
    VERIFIER(aide_ordre(b, (const char *const[]){"Fanny", "Bea", "Dina", "Amir", "Cyril", "Eli"}, 6),
             "Fanny, puis Bea et Dina (14), puis Amir, Cyril et Eli (10), chacun dans l'ordre de départ");

    Fiche c[] = {{"Zoe", 9}, {"Yann", 9}, {"Xavier", 9}};
    classer(c, 3);
    VERIFIER(aide_ordre(c, (const char *const[]){"Zoe", "Yann", "Xavier"}, 3), "trois notes égales : rien ne bouge");

    Fiche d[] = {{"Seul", 20}};
    classer(d, 1);
    VERIFIER(strcmp(d[0].nom, "Seul") == 0 && d[0].note == 20, "une seule fiche ne change pas");

    classer(NULL, 0);
    VERIFIER(1, "une liste vide ne fait pas planter le classement");

    size_t n = 300;
    Fiche *grand = malloc(n * sizeof(Fiche));
    if (grand == NULL) {
        exit(EXIT_FAILURE);
    }
    for (size_t i = 0; i < n; i++) {
        snprintf(grand[i].nom, sizeof grand[i].nom, "eleve%03zu", i);
        grand[i].note = (int)((i * 7) % 11);
    }
    classer(grand, n);
    int bon = 1;
    for (size_t i = 0; i + 1 < n; i++) {
        if (grand[i].note < grand[i + 1].note) {
            bon = 0;
        }
        if (grand[i].note == grand[i + 1].note && strcmp(grand[i].nom, grand[i + 1].nom) > 0) {
            bon = 0;
        }
    }
    VERIFIER(bon, "300 fiches : notes de la meilleure à la moins bonne, et à note égale dans l'ordre de départ");
    free(grand);
    return BILAN();
}
