from html.parser import HTMLParser


class LecteurQuestion(HTMLParser):
    def __init__(self):
        super().__init__()
        self.infos = {"titre": "", "auteur": None, "date": None, "votes": 0, "reponses": 0}

    def handle_starttag(self, balise, attributs):
        pass

    def handle_endtag(self, balise):
        pass

    def handle_data(self, texte):
        pass


def lire_question(html):
    pass


def fiche(html):
    pass


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
