from html.parser import HTMLParser


class LecteurQuestion(HTMLParser):
    def __init__(self):
        super().__init__()
        self.infos = {"titre": "", "auteur": None, "date": None, "votes": 0, "reponses": 0}
        self.dans_titre = False
        self.dans_auteur = False
        self.morceaux_titre = []

    def handle_starttag(self, balise, attributs):
        attributs = dict(attributs)
        classes = (attributs.get("class") or "").split()
        if balise == "h1" and "question-titre" in classes:
            self.dans_titre = True
        elif balise == "span" and "auteur" in classes and self.infos["auteur"] is None:
            self.dans_auteur = True
        elif balise == "time" and self.infos["date"] is None:
            self.infos["date"] = attributs.get("datetime")
        elif balise == "div" and "question" in classes:
            self.infos["votes"] = int(attributs.get("data-votes", "0"))
        elif balise == "div" and "reponse" in classes:
            self.infos["reponses"] += 1

    def handle_endtag(self, balise):
        if balise == "h1" and self.dans_titre:
            self.dans_titre = False
            self.infos["titre"] = " ".join("".join(self.morceaux_titre).split())
        elif balise == "span":
            self.dans_auteur = False

    def handle_data(self, texte):
        if self.dans_titre:
            self.morceaux_titre.append(texte)
        elif self.dans_auteur:
            self.infos["auteur"] = texte.strip()
            self.dans_auteur = False


def lire_question(html):
    lecteur = LecteurQuestion()
    lecteur.feed(html)
    return lecteur.infos


def fiche(html):
    infos = lire_question(html)
    return "\n".join([
        infos["titre"],
        "Par " + str(infos["auteur"]),
        "Date : " + str(infos["date"]),
        "Votes : " + str(infos["votes"]),
        "Réponses : " + str(infos["reponses"]),
    ])


PAGE = """<!DOCTYPE html>
<html>
<head><title>Pourquoi print affiche None ? - Le forum du code</title></head>
<body>
  <h1 class="question-titre">
    Pourquoi <code>print</code> affiche None ?
  </h1>
  <div class="question" data-votes="12">
    <p>Ma fonction affiche bien le résultat, puis None...</p>
    <span class="auteur">kim</span> a demandé le <time datetime="2026-11-02">2 nov.</time>
  </div>
  <h2>2 réponses</h2>
  <div class="reponse acceptee" data-votes="7">
    <p>Ta fonction ne fait pas de return.</p>
    <span class="auteur">lou</span> <time datetime="2026-11-03">3 nov.</time>
  </div>
  <DIV CLASS="reponse" data-votes="-1">
    <p>Change de langage.</p>
    <span class="auteur">bob</span>
  </DIV>
</body>
</html>
"""


if __name__ == "__main__":
    print(lire_question(PAGE))
    print(fiche(PAGE))
