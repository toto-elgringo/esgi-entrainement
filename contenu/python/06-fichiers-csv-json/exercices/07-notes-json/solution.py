import json


def _eleves(chemin):
    with open(chemin, encoding="utf-8") as f:
        return json.load(f)["eleves"]


def moyennes(chemin):
    resultat = []
    for eleve in _eleves(chemin):
        notes = eleve["notes"]
        moyenne = round(sum(notes.values()) / len(notes), 1) if notes else None
        resultat.append((eleve["nom"], moyenne))
    return resultat


def classement(chemin):
    notes = [(nom, moyenne) for nom, moyenne in moyennes(chemin) if moyenne is not None]
    return [nom for nom, _ in sorted(notes, key=lambda couple: (-couple[1], couple[0]))]


def meilleurs_par_matiere(chemin):
    meilleurs = {}
    for eleve in _eleves(chemin):
        for matiere, note in eleve["notes"].items():
            if matiere not in meilleurs or note > meilleurs[matiere][1]:
                meilleurs[matiere] = (eleve["nom"], note)
    return {matiere: nom for matiere, (nom, _) in meilleurs.items()}


if __name__ == "__main__":
    classe = {"eleves": [
        {"nom": "Ben", "notes": {"maths": 10, "physique": 15, "histoire": 20}},
        {"nom": "Sophie", "notes": {"maths": 12, "physique": 4, "histoire": 18}},
        {"nom": "Lou", "notes": {}},
        {"nom": "Ana", "notes": {"maths": 16, "physique": 13}},
    ]}
    with open("classe.json", "w", encoding="utf-8") as f:
        json.dump(classe, f, indent=2)
    print(moyennes("classe.json"))
    print(classement("classe.json"))
    print(meilleurs_par_matiere("classe.json"))
