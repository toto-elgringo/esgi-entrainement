def test_exemple():
    attendu = {"titre": "Pourquoi print affiche None ?", "auteur": "kim", "date": "2026-11-02", "votes": 12, "reponses": 2}
    assert lire_question(PAGE) == attendu, "les cinq informations de la page d'exemple"


def test_titre_en_morceaux():
    page = '<h1 class="grand question-titre">Lire un <b>CSV</b>  en\n  <i>Python</i> </h1>'
    assert lire_question(page)["titre"] == "Lire un CSV en Python", "le texte des balises intérieures compte, les blancs en trop sont retirés"


def test_autre_h1_ignore():
    page = '<h1>Le forum</h1><h1 class="question-titre">Vraie question</h1>'
    assert lire_question(page)["titre"] == "Vraie question", "seul le h1 de classe question-titre donne le titre"


def test_premier_auteur():
    page = '<div class="question" data-votes="3"><span class="auteur"> ana </span></div><div class="reponse"><span class="auteur">tom</span></div>'
    infos = lire_question(page)
    assert infos["auteur"] == "ana", "l'auteur est le premier span de classe auteur, sans les espaces autour"
    assert infos["votes"] == 3, "data-votes du div de classe question, converti en int"


def test_reponses_plusieurs_classes():
    page = '<div class="question" data-votes="-2"></div><div class="reponse acceptee"></div><DIV CLASS="reponse"></DIV><div class="reponses-liste"></div><div class="commentaire"></div>'
    infos = lire_question(page)
    assert infos["reponses"] == 2, "deux div ont la classe reponse (reponses-liste et commentaire ne comptent pas)"
    assert infos["votes"] == -2, "les votes peuvent être négatifs"


def test_valeurs_absentes():
    infos = lire_question("<p>Page sans question</p>")
    assert infos == {"titre": "", "auteur": None, "date": None, "votes": 0, "reponses": 0}, "valeurs par défaut quand rien n'est trouvé"


def test_fiche():
    attendu = "Pourquoi print affiche None ?\nPar kim\nDate : 2026-11-02\nVotes : 12\nRéponses : 2"
    assert fiche(PAGE) == attendu, "le résumé en cinq lignes, sans \n à la fin"
