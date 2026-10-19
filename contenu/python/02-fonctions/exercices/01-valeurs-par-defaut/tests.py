def test_saluer_par_defaut():
    assert saluer("Ada") == "Bonjour Ada!", "par défaut : « Bonjour Ada! »"


def test_saluer_par_position():
    assert saluer("Bob", "Salut") == "Salut Bob!", "la salutation est le 2e paramètre"
    assert saluer("Bob", "Salut", ".") == "Salut Bob.", "la ponctuation est le 3e paramètre"


def test_saluer_par_mot_cle():
    assert saluer("Ada", ponctuation="?") == "Bonjour Ada?", "on peut ne donner que la ponctuation"
    assert saluer(salutation="Coucou", nom="Léa") == "Coucou Léa!", "avec des mots-clés, l'ordre ne compte plus"


def test_prix_ttc():
    assert prix_ttc(100) == 120.0, "TVA de 20 % par défaut : 100 donne 120"
    assert prix_ttc(100, 0.055) == 105.5, "avec un taux de 5,5 % : 105.5"
    assert prix_ttc(19.99, taux=0.1) == 21.99, "le résultat est arrondi à 2 décimales"
