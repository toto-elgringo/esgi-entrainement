import csv


def _lire(chemin):
    with open(chemin, encoding="utf-8", newline="") as f:
        lecteur = csv.reader(f, delimiter=";")
        entete = next(lecteur)
        lignes = []
        for ligne in lecteur:
            if not ligne:
                continue
            notes = [float(note.replace(",", ".")) for note in ligne[1:]]
            lignes.append((ligne[0], notes))
    return entete[1:], lignes


def moyennes_eleves(chemin):
    _, lignes = _lire(chemin)
    return {nom: round(sum(notes) / len(notes), 1) for nom, notes in lignes}


def moyennes_matieres(chemin):
    matieres, lignes = _lire(chemin)
    colonnes = zip(*(notes for _, notes in lignes))
    return {matiere: round(sum(notes) / len(notes), 1) for matiere, notes in zip(matieres, colonnes)}


if __name__ == "__main__":
    with open("notes.csv", "w", encoding="utf-8") as f:
        f.write("nom;maths;physique;histoire\nBen;10;15;20\nSophie;12;4,5;18\nJohn;3;2;8\n")
    print(moyennes_eleves("notes.csv"))
    print(moyennes_matieres("notes.csv"))
