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
    return 1;
}

void enfilerListe(File *f, int valeur) {
}

int defilerListe(File *f) {
    return 0;
}

void viderFile(File *f) {
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
