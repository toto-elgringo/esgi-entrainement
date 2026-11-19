#include <stdio.h>
#include <stdlib.h>

typedef struct cell {
    int value;
    struct cell *next;
} Cell;

typedef struct {
    Cell *premier;
    Cell *dernier;
    int taille;
} File;

int estVideFile(const File *f) {
    return f->premier == NULL;
}

void enfilerListe(File *f, int valeur) {
    Cell *c = malloc(sizeof(Cell));
    if (c == NULL) {
        exit(EXIT_FAILURE);
    }
    c->value = valeur;
    c->next = NULL;
    if (f->dernier == NULL) {
        f->premier = c;
    } else {
        f->dernier->next = c;
    }
    f->dernier = c;
    f->taille++;
}

int defilerListe(File *f) {
    Cell *ancien = f->premier;
    int valeur = ancien->value;
    f->premier = ancien->next;
    if (f->premier == NULL) {
        f->dernier = NULL;
    }
    free(ancien);
    f->taille--;
    return valeur;
}

void viderFile(File *f) {
    while (f->premier != NULL) {
        defilerListe(f);
    }
}

int main(void) {
    File file = {NULL, NULL, 0};
    enfilerListe(&file, 1);
    enfilerListe(&file, 2);
    enfilerListe(&file, 3);
    printf("%d ", defilerListe(&file));
    enfilerListe(&file, 4);
    while (!estVideFile(&file)) {
        printf("%d ", defilerListe(&file));
    }
    printf("\n");
    viderFile(&file);
    return 0;
}
