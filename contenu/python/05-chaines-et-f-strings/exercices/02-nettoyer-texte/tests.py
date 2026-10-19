def test_nettoyer():
    assert nettoyer("  Bonjour   LE monde ") == "bonjour le monde", "espaces en trop enlevés, minuscules"
    assert nettoyer("ok") == "ok", "un texte déjà propre ne change pas"
    assert nettoyer("   ") == "", "que des espaces : chaîne vide"


def test_capitaliser_mots():
    assert capitaliser_mots("ada LOVELACE") == "Ada Lovelace", "chaque mot commence par une majuscule"
    assert capitaliser_mots("  le   petit chat ") == "Le Petit Chat", "un seul espace entre les mots"
    assert capitaliser_mots("") == "", "texte vide"


def test_extension():
    assert extension("Photo.Vacances.JPG") == "jpg", "l'extension est après le dernier point"
    assert extension("notes.txt") == "txt", "notes.txt a l'extension txt"
    assert extension("README") == "", "pas de point : pas d'extension"
