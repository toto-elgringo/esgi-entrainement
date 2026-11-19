import json


def sauvegarder(chemin, donnees):
    with open(chemin, "w", encoding="utf-8") as f:
        json.dump(donnees, f, indent=2, ensure_ascii=False)


def charger(chemin, defaut):
    try:
        with open(chemin, encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return defaut


def ajouter_score(chemin, joueur, points):
    scores = charger(chemin, {})
    scores[joueur] = scores.get(joueur, 0) + points
    sauvegarder(chemin, scores)
    return scores[joueur]


if __name__ == "__main__":
    print(ajouter_score("scores.json", "Élodie", 10))
    print(ajouter_score("scores.json", "Tom", 4))
    print(ajouter_score("scores.json", "Élodie", 5))
    with open("scores.json", encoding="utf-8") as f:
        print(f.read())
