import csv


def moyennes_eleves(chemin):
    pass


def moyennes_matieres(chemin):
    pass


if __name__ == "__main__":
    with open("notes.csv", "w", encoding="utf-8") as f:
        f.write("nom;maths;physique;histoire\nBen;10;15;20\nSophie;12;4,5;18\nJohn;3;2;8\n")
    print(moyennes_eleves("notes.csv"))
    print(moyennes_matieres("notes.csv"))
