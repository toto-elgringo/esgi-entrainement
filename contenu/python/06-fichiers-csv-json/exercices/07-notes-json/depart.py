import json


def moyennes(chemin):
    pass


def classement(chemin):
    pass


def meilleurs_par_matiere(chemin):
    pass


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
