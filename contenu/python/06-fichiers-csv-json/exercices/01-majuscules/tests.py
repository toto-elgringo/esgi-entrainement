import os
import tempfile


def _ecrire(chemin, texte):
    with open(chemin, "w", encoding="utf-8") as f:
        f.write(texte)


def _lire(chemin):
    with open(chemin, encoding="utf-8") as f:
        return f.read()


def test_contenu_en_majuscules():
    with tempfile.TemporaryDirectory() as dossier:
        source = os.path.join(dossier, "source.txt")
        cible = os.path.join(dossier, "cible.txt")
        _ecrire(source, "Bonjour\nle monde\n")
        copier_en_majuscules(source, cible)
        assert _lire(cible) == "BONJOUR\nLE MONDE\n", "la cible contient le texte en majuscules, retours à la ligne compris"


def test_accents():
    with tempfile.TemporaryDirectory() as dossier:
        source = os.path.join(dossier, "source.txt")
        cible = os.path.join(dossier, "cible.txt")
        _ecrire(source, "l'été à Noël\n")
        copier_en_majuscules(source, cible)
        assert _lire(cible) == "L'ÉTÉ À NOËL\n", "les lettres accentuées passent aussi en majuscules"


def test_nombre_de_caracteres():
    with tempfile.TemporaryDirectory() as dossier:
        source = os.path.join(dossier, "source.txt")
        cible = os.path.join(dossier, "cible.txt")
        _ecrire(source, "Bonjour,\nl'été arrive !\n")
        assert copier_en_majuscules(source, cible) == 24, "24 caractères écrits, les deux \n compris"


def test_cible_remplacee():
    with tempfile.TemporaryDirectory() as dossier:
        source = os.path.join(dossier, "source.txt")
        cible = os.path.join(dossier, "cible.txt")
        _ecrire(source, "court\n")
        _ecrire(cible, "un ancien contenu beaucoup plus long\n")
        copier_en_majuscules(source, cible)
        assert _lire(cible) == "COURT\n", "l'ancien contenu de la cible est remplacé (mode \"w\")"


def test_source_intacte():
    with tempfile.TemporaryDirectory() as dossier:
        source = os.path.join(dossier, "source.txt")
        cible = os.path.join(dossier, "cible.txt")
        _ecrire(source, "Petit Texte\n")
        copier_en_majuscules(source, cible)
        assert _lire(source) == "Petit Texte\n", "le fichier source ne doit pas être modifié"
