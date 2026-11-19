import os
import tempfile


def _avec_fichier(contenu, fonction):
    with tempfile.TemporaryDirectory() as dossier:
        chemin = os.path.join(dossier, "texte.txt")
        with open(chemin, "w", encoding="utf-8") as f:
            f.write(contenu)
        return fonction(chemin)


def test_exemple():
    attendu = {"lignes": 2, "mots": 6, "mots_lettres": 4, "mots_chiffres": 1, "caracteres": 28, "lettres": 19, "minuscules": 17, "majuscules": 2, "chiffres": 2, "autres": 7}
    assert _avec_fichier("Acheter 12 Œufs\net du lait.\n", statistiques) == attendu, "les dix statistiques de l'exemple de l'énoncé"


def test_derniere_ligne_sans_retour():
    stats = _avec_fichier("un\ndeux", statistiques)
    assert stats["lignes"] == 2, "une dernière ligne sans \n compte quand même"
    assert stats["caracteres"] == 7, "u, n, \n, d, e, u, x : 7 caractères"


def test_blancs_multiples():
    stats = _avec_fichier("a  b\t\tc\n\n", statistiques)
    assert stats["mots"] == 3, "plusieurs espaces ou tabulations à la suite ne créent pas de mot vide"
    assert stats["lignes"] == 2, "la ligne vide compte comme une ligne"
    assert stats["autres"] == 6, "2 espaces, 2 tabulations et 2 retours à la ligne"


def test_mots_mixtes():
    stats = _avec_fichier("A4 2026 été 3,5 -12\n", statistiques)
    assert stats["mots_lettres"] == 1, "seul « été » n'a que des lettres"
    assert stats["mots_chiffres"] == 1, "seul « 2026 » n'a que des chiffres (pas « 3,5 » ni « -12 »)"


def test_fichier_vide():
    stats = _avec_fichier("", statistiques)
    assert stats == {cle: 0 for cle in ORDRE}, "un fichier vide : toutes les statistiques valent 0"


def test_rapport():
    texte = _avec_fichier("Acheter 12 Œufs\net du lait.\n", rapport)
    attendu = "lignes : 2\nmots : 6\nmots_lettres : 4\nmots_chiffres : 1\ncaracteres : 28\nlettres : 19\nminuscules : 17\nmajuscules : 2\nchiffres : 2\nautres : 7"
    assert texte == attendu, "une ligne « clé : valeur » par statistique, dans l'ordre de ORDRE, sans \n à la fin"
