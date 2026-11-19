import json
import os
import tempfile

_CLASSE = {"eleves": [
    {"nom": "Ben", "notes": {"maths": 10, "physique": 15, "histoire": 20}},
    {"nom": "Sophie", "notes": {"maths": 12, "physique": 4, "histoire": 18}},
    {"nom": "Lou", "notes": {}},
    {"nom": "Ana", "notes": {"maths": 16, "physique": 13}},
]}


def _avec_json(donnees, fonction):
    with tempfile.TemporaryDirectory() as dossier:
        chemin = os.path.join(dossier, "classe.json")
        with open(chemin, "w", encoding="utf-8") as f:
            json.dump(donnees, f, indent=2, ensure_ascii=False)
        return fonction(chemin)


def test_moyennes():
    assert _avec_json(_CLASSE, moyennes) == [("Ben", 15.0), ("Sophie", 11.3), ("Lou", None), ("Ana", 14.5)], "une moyenne par élève, dans l'ordre du fichier, None sans note"


def test_classement():
    assert _avec_json(_CLASSE, classement) == ["Ben", "Ana", "Sophie"], "de la meilleure moyenne à la moins bonne, sans Lou qui n'a pas de note"


def test_classement_egalite():
    donnees = {"eleves": [{"nom": "Zoé", "notes": {"a": 12}}, {"nom": "Éric", "notes": {"a": 10}}, {"nom": "Bob", "notes": {"a": 12}}]}
    assert _avec_json(donnees, classement) == ["Bob", "Zoé", "Éric"], "à moyenne égale, ordre alphabétique"


def test_meilleurs_par_matiere():
    assert _avec_json(_CLASSE, meilleurs_par_matiere) == {"maths": "Ana", "physique": "Ben", "histoire": "Ben"}, "le meilleur élève de chaque matière"


def test_meilleurs_egalite():
    donnees = {"eleves": [{"nom": "Kim", "notes": {"sport": 14}}, {"nom": "Lou", "notes": {"sport": 14, "art": 9}}]}
    assert _avec_json(donnees, meilleurs_par_matiere) == {"sport": "Kim", "art": "Lou"}, "en cas d'égalité, le premier du fichier l'emporte"


def test_classe_vide():
    assert _avec_json({"eleves": []}, moyennes) == [], "aucun élève : liste vide"
    assert _avec_json({"eleves": []}, meilleurs_par_matiere) == {}, "aucun élève : dictionnaire vide"
