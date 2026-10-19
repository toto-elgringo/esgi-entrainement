def lire_notes(chemin):
    pass


def ecrire_rapport(notes, chemin):
    pass


def moyenne_classe(chemin):
    pass


if __name__ == "__main__":
    with open("notes.txt", "w", encoding="utf-8") as f:
        f.write("Tom;12.5\nAna;17\n\nBob;abc\nLéa;14;bonus\nEva;8\n")
    notes = lire_notes("notes.txt")
    print(notes)
    ecrire_rapport(notes, "rapport.txt")
    print(moyenne_classe("notes.txt"))
