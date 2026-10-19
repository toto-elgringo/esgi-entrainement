import os

_SOURCE = "test_notes_source.txt"
_RAPPORT = "test_notes_rapport.txt"
_CONTENU = "Tom;12.5\nAna;17\n\nBob;abc\nLéa;14;bonus\nEva;8\n"


def _creer(contenu):
    with open(_SOURCE, "w", encoding="utf-8") as f:
        f.write(contenu)


def _nettoyer():
    for nom in (_SOURCE, _RAPPORT):
        if os.path.exists(nom):
            os.remove(nom)


def test_lire_notes():
    _creer(_CONTENU)
    try:
        assert lire_notes(_SOURCE) == {"Tom": 12.5, "Ana": 17.0, "Eva": 8.0}, "les lignes vides et invalides sont ignorées"
    finally:
        _nettoyer()


def test_lire_notes_types():
    _creer("Ana;17\n")
    try:
        note = lire_notes(_SOURCE)["Ana"]
        assert isinstance(note, float), "les notes doivent être des float"
    finally:
        _nettoyer()


def test_ecrire_rapport():
    _nettoyer()
    try:
        ecrire_rapport({"Tom": 12.5, "Ana": 17.0, "Eva": 8.0}, _RAPPORT)
        with open(_RAPPORT, encoding="utf-8") as f:
            contenu = f.read()
        assert contenu == "Ana : 17.0/20\nEva : 8.0/20\nTom : 12.5/20\n", "une ligne par élève, par ordre alphabétique, une décimale"
    finally:
        _nettoyer()


def test_moyenne_classe():
    _creer(_CONTENU)
    try:
        assert abs(moyenne_classe(_SOURCE) - 12.5) < 1e-9, "(12.5 + 17 + 8) / 3 = 12.5"
    finally:
        _nettoyer()


def test_moyenne_classe_vide():
    _creer("\nBob;abc\n")
    try:
        assert moyenne_classe(_SOURCE) is None, "aucune note valide : None"
    finally:
        _nettoyer()
