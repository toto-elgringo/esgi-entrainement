def test_nature_nombre():
    assert nature("2026") == "nombre", "2026 n'a que des chiffres"
    assert nature("007") == "nombre", "007 n'a que des chiffres"


def test_nature_lettres():
    assert nature("chat") == "minuscules", "chat : que des minuscules"
    assert nature("ESGI") == "majuscules", "ESGI : que des majuscules"
    assert nature("Python") == "lettres", "Python mélange majuscule et minuscules"
    assert nature("élève") == "minuscules", "les lettres accentuées sont des lettres"


def test_nature_alphanumerique():
    assert nature("Naruto93") == "alphanumérique", "Naruto93 : lettres et chiffres"
    assert nature("a1") == "alphanumérique", "a1 : une lettre et un chiffre, ce n'est pas « minuscules »"


def test_nature_autre():
    assert nature("14-18") == "autre", "le tiret n'est ni une lettre ni un chiffre"
    assert nature("deux mots") == "autre", "l'espace n'est ni une lettre ni un chiffre"
    assert nature("") == "autre", "une chaîne vide est « autre »"


def test_apres():
    assert apres("nom=Ada=1", "=") == "Ada=1", "on coupe après le premier ="
    assert apres("clé: valeur", ": ") == "valeur", "un repère de plusieurs caractères"
    assert apres("bonjour", "=") == "", "repère absent : chaîne vide"
    assert apres("fin=", "=") == "", "rien après le repère"


def test_images():
    assert images(["a.PNG", "b.txt", "c.jpg"]) == ["a.PNG", "c.jpg"], "les majuscules de l'extension ne comptent pas"
    assert images(["photo.jpeg", "jpg.txt", "png"]) == ["photo.jpeg"], "il faut que le nom FINISSE par l'extension, point compris"
    assert images([]) == [], "liste vide"
