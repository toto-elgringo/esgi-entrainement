import os
import tempfile

_EXEMPLE = "Bonjour\nLa prog, c'est sympa !\nMais alors là, vraiment sympa :)\n"


def _avec_fichier(contenu, fonction, n):
    with tempfile.TemporaryDirectory() as dossier:
        chemin = os.path.join(dossier, "journal.txt")
        with open(chemin, "w", encoding="utf-8") as f:
            f.write(contenu)
        return fonction(chemin, n)


def test_dernieres_exemple():
    obtenu = _avec_fichier(_EXEMPLE, dernieres_lignes, 2)
    assert obtenu == ["La prog, c'est sympa !", "Mais alors là, vraiment sympa :)"], "les 2 dernières lignes, dans l'ordre du fichier, sans \n"


def test_premieres_exemple():
    assert _avec_fichier(_EXEMPLE, premieres_lignes, 1) == ["Bonjour"], "la première ligne seulement"


def test_n_trop_grand():
    assert _avec_fichier(_EXEMPLE, dernieres_lignes, 10) == ["Bonjour", "La prog, c'est sympa !", "Mais alors là, vraiment sympa :)"], "moins de lignes que n : on renvoie tout"
    assert _avec_fichier("a\nb\n", premieres_lignes, 5) == ["a", "b"], "moins de lignes que n : on renvoie tout"


def test_n_nul_ou_negatif():
    assert _avec_fichier(_EXEMPLE, dernieres_lignes, 0) == [], "n = 0 : liste vide"
    assert _avec_fichier(_EXEMPLE, dernieres_lignes, -2) == [], "n négatif : liste vide, sans erreur"
    assert _avec_fichier(_EXEMPLE, premieres_lignes, -1) == [], "n négatif : liste vide, sans erreur"


def test_derniere_ligne_sans_retour():
    assert _avec_fichier("un\ndeux\ntrois", dernieres_lignes, 2) == ["deux", "trois"], "la dernière ligne peut ne pas finir par \n"


def test_grand_fichier():
    contenu = "".join("ligne %d\n" % i for i in range(1, 200001))
    assert _avec_fichier(contenu, dernieres_lignes, 3) == ["ligne 199998", "ligne 199999", "ligne 200000"], "les 3 dernières lignes d'un fichier de 200 000 lignes"
    assert _avec_fichier(contenu, premieres_lignes, 2) == ["ligne 1", "ligne 2"], "les 2 premières lignes d'un gros fichier"
