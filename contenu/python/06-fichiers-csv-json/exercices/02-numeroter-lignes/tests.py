import os
import tempfile


def _numeroter(contenu, **options):
    with tempfile.TemporaryDirectory() as dossier:
        chemin = os.path.join(dossier, "texte.txt")
        with open(chemin, "w", encoding="utf-8") as f:
            f.write(contenu)
        return numeroter(chemin, **options)


def test_exemple():
    obtenu = _numeroter("Bonjour\n\nLa programmation, c'est sympa !\n")
    assert obtenu == ["1: Bonjour", "2: ", "3: La programmation, c'est sympa !"], "chaque ligne précédée de son numéro et de « : », la ligne vide comprise"


def test_sans_retour_final():
    obtenu = _numeroter("un\ndeux")
    assert obtenu == ["1: un", "2: deux"], "la dernière ligne n'a pas de \n : elle doit quand même être numérotée"


def test_espaces_gardes():
    obtenu = _numeroter("  retrait\nfin   \n")
    assert obtenu == ["1:   retrait", "2: fin   "], "seul le retour à la ligne est enlevé, pas les espaces"


def test_sauter_vides():
    obtenu = _numeroter("a\n\n   \nb\n", sauter_vides=True)
    assert obtenu == ["1: a", "4: b"], "les lignes vides disparaissent, mais b garde son numéro 4"


def test_fichier_vide():
    assert _numeroter("") == [], "un fichier vide donne une liste vide"
