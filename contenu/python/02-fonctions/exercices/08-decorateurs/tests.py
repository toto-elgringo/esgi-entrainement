def test_en_majuscules():
    @en_majuscules
    def saluer(nom):
        return "bonjour " + nom

    assert saluer("ada") == "BONJOUR ADA", "le résultat doit être en majuscules"


def test_en_majuscules_arguments():
    @en_majuscules
    def presenter(nom, ville="paris"):
        return nom + " de " + ville

    assert presenter("tom") == "TOM DE PARIS", "la valeur par défaut doit marcher"
    assert presenter("léa", ville="lyon") == "LÉA DE LYON", "les mots-clés doivent être transmis"


def test_compter_appels():
    @compter_appels
    def addition(a, b):
        return a + b

    assert addition(1, 2) == 3, "la fonction décorée renvoie toujours son résultat"
    assert addition(3, b=4) == 7, "les mots-clés sont transmis"
    assert addition.appels == 2, "après 2 appels, l'attribut appels vaut 2"


def test_compteurs_separes():
    @compter_appels
    def f():
        return 1

    @compter_appels
    def g():
        return 2

    f()
    f()
    g()
    assert f.appels == 2 and g.appels == 1, "chaque fonction décorée a son propre compteur"
