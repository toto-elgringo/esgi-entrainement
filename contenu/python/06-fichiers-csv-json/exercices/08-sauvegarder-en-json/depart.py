import json


def sauvegarder(chemin, donnees):
    pass


def charger(chemin, defaut):
    pass


def ajouter_score(chemin, joueur, points):
    pass


if __name__ == "__main__":
    print(ajouter_score("scores.json", "Élodie", 10))
    print(ajouter_score("scores.json", "Tom", 4))
    print(ajouter_score("scores.json", "Élodie", 5))
    with open("scores.json", encoding="utf-8") as f:
        print(f.read())
