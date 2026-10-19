import os

_FICHIER = "test_fichiers_lignes.txt"


def _nettoyer():
    if os.path.exists(_FICHIER):
        os.remove(_FICHIER)


def test_ecrire_lignes():
    _nettoyer()
    try:
        ecrire_lignes(_FICHIER, ["pain", "lait"])
        with open(_FICHIER, encoding="utf-8") as f:
            contenu = f.read()
        assert contenu == "pain\nlait\n", "chaque élément doit être sur sa propre ligne, terminée par \\n"
    finally:
        _nettoyer()


def test_ecrire_remplace():
    _nettoyer()
    try:
        ecrire_lignes(_FICHIER, ["ancien", "contenu"])
        ecrire_lignes(_FICHIER, ["nouveau"])
        with open(_FICHIER, encoding="utf-8") as f:
            contenu = f.read()
        assert contenu == "nouveau\n", "ecrire_lignes doit remplacer le contenu (mode w)"
    finally:
        _nettoyer()


def test_ajouter_ligne():
    _nettoyer()
    try:
        ecrire_lignes(_FICHIER, ["pain"])
        ajouter_ligne(_FICHIER, "œufs")
        with open(_FICHIER, encoding="utf-8") as f:
            contenu = f.read()
        assert contenu == "pain\nœufs\n", "ajouter_ligne doit écrire à la fin sans effacer (mode a)"
    finally:
        _nettoyer()


def test_lire_lignes():
    _nettoyer()
    try:
        with open(_FICHIER, "w", encoding="utf-8") as f:
            f.write("un\ndeux\ntrois\n")
        assert lire_lignes(_FICHIER) == ["un", "deux", "trois"], "les lignes sans les retours à la ligne"
    finally:
        _nettoyer()


def test_compter_lignes():
    _nettoyer()
    try:
        assert compter_lignes(_FICHIER) == 0, "un fichier absent compte 0 ligne"
        with open(_FICHIER, "w", encoding="utf-8") as f:
            f.write("a\nb\n")
        assert compter_lignes(_FICHIER) == 2, "le fichier contient 2 lignes"
    finally:
        _nettoyer()
