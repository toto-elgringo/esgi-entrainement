def _erreur(appel):
    try:
        appel()
    except Exception as erreur:
        return erreur
    return None


def test_avis_complet():
    attendu = "Recherché : femme (172 cm)\n- yeux verts\n- cheveux bruns bouclés"
    assert avis(sexe="f", taille=172, yeux="verts", couleur="bruns", coiffure="bouclés") == attendu, "toutes les informations, dans l'ordre, sans espace en fin de ligne"


def test_avis_sans_rien():
    assert avis() == "Recherché : personne", "aucune information : une seule ligne"
    assert avis(sexe="h") == "Recherché : homme", "sexe h : homme"


def test_avis_taille_entiere():
    assert avis(taille=180) == "Recherché : personne (180 cm)", "la taille est un entier : il faut la convertir en texte"


def test_avis_cheveux_partiels():
    assert avis(coiffure="courts") == "Recherché : personne\n- cheveux courts", "seulement la coiffure"
    assert avis(couleur="roux") == "Recherché : personne\n- cheveux roux", "seulement la couleur"
    assert avis(sexe="h", yeux="bleus") == "Recherché : homme\n- yeux bleus", "pas de ligne cheveux sans couleur ni coiffure"


def test_avis_refuse_les_positions():
    assert isinstance(_erreur(lambda: avis("f")), TypeError), "avis(\"f\") : les options se donnent uniquement par mot-clé"


def test_avis_refuse_les_mots_cles_inconnus():
    assert isinstance(_erreur(lambda: avis(age=30)), TypeError), "age n'est pas une option : TypeError"


def test_avis_sexe_invalide():
    assert isinstance(_erreur(lambda: avis(sexe="x")), ValueError), "sexe=\"x\" : ValueError"
