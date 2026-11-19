import json
import os
import tempfile


def _lire(chemin):
    with open(chemin, encoding="utf-8") as f:
        return f.read()


def test_sauvegarder_relisible():
    with tempfile.TemporaryDirectory() as dossier:
        chemin = os.path.join(dossier, "donnees.json")
        donnees = {"nom": "Lina", "niveaux": [1, 2, 3], "actif": True, "meilleur": None}
        sauvegarder(chemin, donnees)
        with open(chemin, encoding="utf-8") as f:
            relu = json.load(f)
        assert relu == donnees, "le fichier écrit doit être du JSON valide qui redonne les mêmes données"


def test_sauvegarder_lisible():
    with tempfile.TemporaryDirectory() as dossier:
        chemin = os.path.join(dossier, "scores.json")
        sauvegarder(chemin, {"Élodie": 15, "Tom": 4})
        assert _lire(chemin) == '{\n  "Élodie": 15,\n  "Tom": 4\n}', "indentation de 2 espaces et accents écrits tels quels (indent=2, ensure_ascii=False)"


def test_charger_absent():
    with tempfile.TemporaryDirectory() as dossier:
        chemin = os.path.join(dossier, "absent.json")
        assert charger(chemin, {"vide": True}) == {"vide": True}, "fichier absent : on renvoie la valeur par défaut"


def test_charger_invalide():
    with tempfile.TemporaryDirectory() as dossier:
        chemin = os.path.join(dossier, "abime.json")
        with open(chemin, "w", encoding="utf-8") as f:
            f.write("{'Tom': 4}")
        assert charger(chemin, []) == [], "JSON invalide (guillemets simples) : on renvoie la valeur par défaut"
        with open(chemin, "w", encoding="utf-8") as f:
            f.write("")
        assert charger(chemin, 0) == 0, "fichier vide : on renvoie la valeur par défaut"


def test_ajouter_score():
    with tempfile.TemporaryDirectory() as dossier:
        chemin = os.path.join(dossier, "scores.json")
        assert ajouter_score(chemin, "Élodie", 10) == 10, "premier score d'Élodie : 0 + 10"
        assert ajouter_score(chemin, "Tom", 4) == 4, "premier score de Tom : 0 + 4"
        assert ajouter_score(chemin, "Élodie", 5) == 15, "Élodie : 10 + 5"
        assert charger(chemin, {}) == {"Élodie": 15, "Tom": 4}, "le fichier garde tous les scores"


def test_ajouter_score_fichier_abime():
    with tempfile.TemporaryDirectory() as dossier:
        chemin = os.path.join(dossier, "scores.json")
        with open(chemin, "w", encoding="utf-8") as f:
            f.write("pas du json")
        assert ajouter_score(chemin, "Kim", 3) == 3, "un fichier abîmé repart de zéro au lieu de planter"
