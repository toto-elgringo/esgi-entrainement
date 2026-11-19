import json


def date_en_tuple(texte):
    pass


def fusionner(chemins, cible):
    pass


if __name__ == "__main__":
    releves = {
        "mars.json": [{"nom": "pomme", "prix": 3.1, "date": "12-1-2010"}, {"nom": "banane", "prix": 4.0, "date": "3-1-2009"}],
        "avril.json": [{"nom": "pomme", "prix": 2.9, "date": "3-1-2009"}, {"nom": "kiwi", "prix": 0.5, "date": "1-2-2010"}],
    }
    for nom, articles in releves.items():
        with open(nom, "w", encoding="utf-8") as f:
            json.dump({"articles": articles}, f)
    print(date_en_tuple("12-4-2008"))
    print(fusionner(list(releves), "fusion.json"))
    with open("fusion.json", encoding="utf-8") as f:
        print(f.read())
