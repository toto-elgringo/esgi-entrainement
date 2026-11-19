import os
import tempfile

_EXEMPLE = "nom;maths;physique;histoire\nBen;10;15;20\nSophie;12;4,5;18\nJohn;3;2;8\n"


def _avec_fichier(contenu, fonction):
    with tempfile.TemporaryDirectory() as dossier:
        chemin = os.path.join(dossier, "notes.csv")
        with open(chemin, "w", encoding="utf-8") as f:
            f.write(contenu)
        return fonction(chemin)


def test_moyennes_eleves():
    assert _avec_fichier(_EXEMPLE, moyennes_eleves) == {"Ben": 15.0, "Sophie": 11.5, "John": 4.3}, "la moyenne de chaque élève, arrondie à une décimale"


def test_moyennes_matieres():
    assert _avec_fichier(_EXEMPLE, moyennes_matieres) == {"maths": 8.3, "physique": 7.2, "histoire": 15.3}, "la moyenne de chaque matière, arrondie à une décimale"


def test_autres_matieres():
    contenu = "nom;anglais;sport\nLou;12;16\nKim;8;14,6\n"
    assert _avec_fichier(contenu, moyennes_matieres) == {"anglais": 10.0, "sport": 15.3}, "les matières viennent de la première ligne, quel que soit leur nombre"
    assert _avec_fichier(contenu, moyennes_eleves) == {"Lou": 14.0, "Kim": 11.3}, "deux matières seulement : moyenne sur deux notes"


def test_lignes_vides():
    contenu = "nom;maths\nBen;10\n\nSophie;13\n\n"
    assert _avec_fichier(contenu, moyennes_eleves) == {"Ben": 10.0, "Sophie": 13.0}, "les lignes vides sont ignorées"


def test_nom_entre_guillemets():
    contenu = 'nom;maths;physique\n"Martin; Jr";10;20\n'
    assert _avec_fichier(contenu, moyennes_eleves) == {"Martin; Jr": 15.0}, "un nom entre guillemets peut contenir un « ; » : c'est le module csv qui sait le lire"
