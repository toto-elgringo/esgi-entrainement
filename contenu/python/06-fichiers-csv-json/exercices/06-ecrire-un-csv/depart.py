import csv


def ecrire_bulletin(source, cible):
    pass


if __name__ == "__main__":
    with open("notes.csv", "w", encoding="utf-8") as f:
        f.write('nom;maths;physique;histoire\nBen;10;15;20\n"Martin; Jr";12;4,5;18\nJohn;3;2;8\n')
    print(ecrire_bulletin("notes.csv", "bulletin.csv"))
    with open("bulletin.csv", encoding="utf-8") as f:
        print(f.read())
