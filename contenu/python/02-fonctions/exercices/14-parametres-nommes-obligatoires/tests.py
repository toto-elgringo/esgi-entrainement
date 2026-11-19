import inspect


def _refuse(appel):
    try:
        appel()
    except TypeError:
        return True
    return False


def test_arrondir_tous():
    assert arrondir_tous(1.26, 2.54, decimales=1) == [1.3, 2.5], "arrondi à une décimale"
    assert arrondir_tous(1.6, 2.2) == [2, 2], "par défaut, arrondi à l'unité"
    assert arrondir_tous() == [], "sans nombre : liste vide"


def test_compter():
    assert compter("Aa a", "a") == 2, "par défaut, les majuscules comptent"
    assert compter("Aa a", "a", ignorer_casse=True) == 3, "en ignorant la casse : 3"
    assert compter("banane", "an") == 2, "un motif de plusieurs lettres"


def test_compter_nomme_obligatoire():
    assert _refuse(lambda: compter("Aa a", "a", True)), "ignorer_casse doit être donné par mot-clé (mets un * avant)"


def test_masquer():
    assert masquer("1234567812345678") == "************5678", "garde les 4 derniers par défaut"
    assert masquer("abc") == "abc", "texte trop court : inchangé"
    assert masquer("abcd") == "abcd", "exactement 4 caractères : inchangé"


def test_masquer_mots_cles():
    assert masquer("motdepasse", visibles=2) == "********se", "le paramètre s'appelle visibles"
    assert masquer("secret", visibles=0, caractere="#") == "######", "visibles=0 : tout est masqué"
    assert masquer("abcdef", 3, caractere="-") == "---def", "visibles peut être donné par position"


def test_masquer_nomme_obligatoire():
    assert _refuse(lambda: masquer("abcdef", 2, "#")), "caractere doit être donné par mot-clé"


def test_signatures():
    parametres = inspect.signature(masquer).parameters
    assert "visibles" in parametres, "le paramètre doit s'appeler visibles"
    assert parametres["caractere"].kind == inspect.Parameter.KEYWORD_ONLY, "caractere est nommé obligatoire"
