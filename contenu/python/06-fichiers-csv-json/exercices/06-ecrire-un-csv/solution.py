import csv


def ecrire_bulletin(source, cible):
    eleves = []
    with open(source, encoding="utf-8", newline="") as f:
        lecteur = csv.reader(f, delimiter=";")
        next(lecteur)
        for ligne in lecteur:
            if not ligne:
                continue
            notes = [float(note.replace(",", ".")) for note in ligne[1:]]
            eleves.append((ligne[0], sum(notes) / len(notes)))
    eleves.sort(key=lambda eleve: (-eleve[1], eleve[0]))
    with open(cible, "w", encoding="utf-8", newline="") as f:
        ecrivain = csv.writer(f, delimiter=";")
        ecrivain.writerow(["nom", "moyenne", "resultat"])
        for nom, moyenne in eleves:
            ecrivain.writerow([nom, f"{moyenne:.1f}", "admis" if moyenne >= 10 else "ajourné"])
    return len(eleves)


if __name__ == "__main__":
    with open("notes.csv", "w", encoding="utf-8") as f:
        f.write('nom;maths;physique;histoire\nBen;10;15;20\n"Martin; Jr";12;4,5;18\nJohn;3;2;8\n')
    print(ecrire_bulletin("notes.csv", "bulletin.csv"))
    with open("bulletin.csv", encoding="utf-8") as f:
        print(f.read())
