import os

_FICHIER = "test_compter_mots.txt"


def _creer(contenu):
    with open(_FICHIER, "w", encoding="utf-8") as f:
        f.write(contenu)


def _nettoyer():
    if os.path.exists(_FICHIER):
        os.remove(_FICHIER)


def test_compter_mots_exemple():
    _creer("Le chat dort. Le chien aussi !\nle chat mange.\n")
    try:
        attendu = {"le": 3, "chat": 2, "dort": 1, "chien": 1, "aussi": 1, "mange": 1}
        assert compter_mots(_FICHIER) == attendu, "minuscules, ponctuation enlevée, « ! » seul ignoré"
    finally:
        _nettoyer()


def test_compter_mots_fichier_absent():
    _nettoyer()
    assert compter_mots(_FICHIER) == {}, "fichier absent : dictionnaire vide"


def test_mots_frequents():
    _creer("Le chat dort. Le chien aussi !\nle chat mange.\n")
    try:
        assert mots_frequents(_FICHIER, 3) == [("le", 3), ("chat", 2), ("aussi", 1)], "les 3 plus fréquents, égalités par ordre alphabétique"
        assert mots_frequents(_FICHIER, 1) == [("le", 3)], "le mot le plus fréquent"
    finally:
        _nettoyer()


def test_mots_frequents_k_trop_grand():
    _creer("b a b\n")
    try:
        assert mots_frequents(_FICHIER, 10) == [("b", 2), ("a", 1)], "si k est trop grand, on renvoie tous les mots"
    finally:
        _nettoyer()
