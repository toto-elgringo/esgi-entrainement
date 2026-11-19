def test_nb_mots_distincts():
    assert nb_mots_distincts("Le chat et le chien") == 4, "Le et le sont le même mot : le, chat, et, chien"
    assert nb_mots_distincts("a  b   a") == 2, "les espaces multiples ne créent pas de mot vide"
    assert nb_mots_distincts("") == 0, "texte vide : aucun mot"


def test_vocabulaire_commun():
    assert vocabulaire_commun("Le chat dort", "le chien dort") == ["dort", "le"], "dort et le sont dans les deux textes"
    assert vocabulaire_commun("Un DEUX", "deux deux un") == ["deux", "un"], "pas de doublon, majuscules ignorées"
    assert vocabulaire_commun("abc", "def") == [], "rien en commun"


def test_surligner_exemple():
    assert surligner("Le chat  et LE chien", ["le", "Loup"]) == "LE chat et LE chien", "les deux le sont surlignés, un seul espace entre les mots"


def test_surligner_mot_repete():
    assert surligner("bip bip bip", ["bip"]) == "BIP BIP BIP", "un mot-clé répété est surligné à chaque fois"
    assert surligner("a b a b", ["B"]) == "a B a B", "le mot-clé B (en majuscule) correspond à b"


def test_surligner_sans_cle():
    assert surligner("Bonjour TOUT le monde", []) == "bonjour tout le monde", "sans mot-clé, tout est en minuscules"
    assert surligner("", ["x"]) == "", "texte vide"
