import csv
import os
import tempfile

_EXEMPLE = 'nom;maths;physique;histoire\nBen;10;15;20\n"Martin; Jr";12;4,5;18\nJohn;3;2;8\n'


def _bulletin(contenu):
    with tempfile.TemporaryDirectory() as dossier:
        source = os.path.join(dossier, "notes.csv")
        cible = os.path.join(dossier, "bulletin.csv")
        with open(source, "w", encoding="utf-8") as f:
            f.write(contenu)
        nombre = ecrire_bulletin(source, cible)
        with open(cible, encoding="utf-8", newline="") as f:
            lignes = [ligne for ligne in csv.reader(f, delimiter=";") if ligne]
        with open(cible, encoding="utf-8") as f:
            premiere = f.readline().strip()
        return nombre, lignes, premiere


def test_entete():
    _, _, premiere = _bulletin(_EXEMPLE)
    assert premiere == "nom;moyenne;resultat", "la première ligne est l'en-tête, séparé par des « ; »"


def test_lignes_exemple():
    _, lignes, _ = _bulletin(_EXEMPLE)
    attendu = [["nom", "moyenne", "resultat"], ["Ben", "15.0", "admis"], ["Martin; Jr", "11.5", "admis"], ["John", "4.3", "ajourné"]]
    assert lignes == attendu, "relu avec csv.reader, le bulletin doit donner ces lignes (le nom avec « ; » reste en un seul morceau)"


def test_nombre_eleves():
    nombre, _, _ = _bulletin(_EXEMPLE)
    assert nombre == 3, "la fonction renvoie le nombre d'élèves écrits"


def test_tri_et_egalites():
    contenu = "nom;maths\nZoé;12\nAli;9\nBob;12\nEva;18\n"
    _, lignes, _ = _bulletin(contenu)
    noms = [ligne[0] for ligne in lignes[1:]]
    assert noms == ["Eva", "Bob", "Zoé", "Ali"], "de la meilleure moyenne à la moins bonne, puis par ordre alphabétique"


def test_seuil_admis():
    contenu = "nom;maths;physique\nLou;10;10\nKim;9,6;10\n"
    _, lignes, _ = _bulletin(contenu)
    assert lignes[1:] == [["Lou", "10.0", "admis"], ["Kim", "9.8", "ajourné"]], "admis à partir de 10 exactement, sinon ajourné"
