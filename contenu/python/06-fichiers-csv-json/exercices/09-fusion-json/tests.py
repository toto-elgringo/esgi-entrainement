import json
import os
import tempfile


def _fusion(releves):
    with tempfile.TemporaryDirectory() as dossier:
        chemins = []
        for i, articles in enumerate(releves):
            chemin = os.path.join(dossier, "releve%d.json" % i)
            with open(chemin, "w", encoding="utf-8") as f:
                json.dump({"articles": articles}, f)
            chemins.append(chemin)
        cible = os.path.join(dossier, "fusion.json")
        nombre = fusionner(chemins, cible)
        with open(cible, encoding="utf-8") as f:
            return nombre, json.load(f)


def test_date_en_tuple():
    assert date_en_tuple("12-4-2008") == (2008, 4, 12), "jour-mois-année devient (année, mois, jour)"
    assert date_en_tuple("1-12-2010") == (2010, 12, 1), "les nombres deviennent des int"


def test_dates_comparables():
    assert date_en_tuple("3-1-2009") < date_en_tuple("12-1-2010"), "le 3 janvier 2009 est avant le 12 janvier 2010"
    assert date_en_tuple("30-11-2010") < date_en_tuple("2-12-2010"), "le 30 novembre est avant le 2 décembre"


def test_fusion_exemple():
    mars = [{"nom": "pomme", "prix": 3.1, "date": "12-1-2010"}, {"nom": "banane", "prix": 4.0, "date": "3-1-2009"}]
    avril = [{"nom": "pomme", "prix": 2.9, "date": "3-1-2009"}, {"nom": "kiwi", "prix": 0.5, "date": "1-2-2010"}]
    nombre, resultat = _fusion([mars, avril])
    attendu = {"articles": [
        {"nom": "banane", "prix": 4.0, "date": "3-1-2009"},
        {"nom": "kiwi", "prix": 0.5, "date": "1-2-2010"},
        {"nom": "pomme", "prix": 3.1, "date": "12-1-2010"},
    ]}
    assert resultat == attendu, "chaque article une seule fois, la version la plus récente (comparer les dates en texte se trompe ici), rangés par nom"
    assert nombre == 3, "trois articles différents"


def test_meme_date():
    premier = [{"nom": "lait", "prix": 1.0, "date": "5-5-2020"}]
    second = [{"nom": "lait", "prix": 1.2, "date": "5-5-2020"}]
    _, resultat = _fusion([premier, second])
    assert resultat["articles"] == [{"nom": "lait", "prix": 1.2, "date": "5-5-2020"}], "à date égale, le fichier le plus tard dans la liste gagne"


def test_plus_ancien_ensuite():
    premier = [{"nom": "riz", "prix": 2.0, "date": "1-6-2021"}]
    second = [{"nom": "riz", "prix": 1.5, "date": "28-5-2021"}]
    _, resultat = _fusion([premier, second])
    assert resultat["articles"] == [{"nom": "riz", "prix": 2.0, "date": "1-6-2021"}], "un relevé plus ancien ne remplace pas un relevé plus récent"


def test_un_seul_fichier_vide():
    nombre, resultat = _fusion([[]])
    assert nombre == 0 and resultat == {"articles": []}, "aucun article : un relevé vide"
