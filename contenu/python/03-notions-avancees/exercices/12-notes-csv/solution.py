def lire_notes(chemin):
    notes = {}
    with open(chemin, encoding="utf-8") as f:
        for ligne in f:
            ligne = ligne.strip()
            if not ligne:
                continue
            morceaux = ligne.split(";")
            if len(morceaux) != 2:
                continue
            nom, texte_note = morceaux
            try:
                notes[nom] = float(texte_note)
            except ValueError:
                continue
    return notes


def ecrire_rapport(notes, chemin):
    with open(chemin, "w", encoding="utf-8") as f:
        for nom, note in sorted(notes.items()):
            f.write("%s : %.1f/20\n" % (nom, note))


def moyenne_classe(chemin):
    notes = lire_notes(chemin)
    if not notes:
        return None
    return sum(notes.values()) / len(notes)


if __name__ == "__main__":
    with open("notes.txt", "w", encoding="utf-8") as f:
        f.write("Tom;12.5\nAna;17\n\nBob;abc\nLéa;14;bonus\nEva;8\n")
    notes = lire_notes("notes.txt")
    print(notes)
    ecrire_rapport(notes, "rapport.txt")
    print(moyenne_classe("notes.txt"))
