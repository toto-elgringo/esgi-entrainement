On a récupéré la page HTML d'une question posée sur un forum d'entraide (la constante `PAGE` du code de départ). On veut en extraire les informations principales **sans** chercher du texte à la main : avec `html.parser.HTMLParser`, le lecteur de HTML de la bibliothèque standard.

Complète la classe `LecteurQuestion` puis écris deux fonctions :

**`lire_question(html)`** renvoie le dictionnaire :

| Clé | Où la trouver | Si absente |
|---|---|---|
| `titre` | le texte du `<h1>` qui a la classe `question-titre`, texte des balises intérieures compris, avec les blancs en trop retirés (un seul espace entre les mots, aucun aux bouts) | `""` |
| `auteur` | le texte du **premier** `<span>` de classe `auteur` de la page | `None` |
| `date` | l'attribut `datetime` de la **première** balise `<time>` | `None` |
| `votes` | l'attribut `data-votes` du `<div>` de classe `question`, en `int` | `0` |
| `reponses` | le nombre de `<div>` qui ont la classe `reponse` | `0` |

Une balise peut avoir **plusieurs** classes séparées par des espaces (`class="reponse acceptee"`), et les noms des balises peuvent être écrits en majuscules (`<DIV CLASS="reponse">`).

**`fiche(html)`** renvoie un résumé de cinq lignes :

```text
Pourquoi print affiche None ?
Par kim
Date : 2026-11-02
Votes : 12
Réponses : 2
```

> [!info] Et Beautiful Soup ?
> Hors de ce site, on utiliserait souvent la bibliothèque **Beautiful Soup** (`soup.find("h1", class_="question-titre").get_text()`). Elle n'est pas installée ici : on fait le même travail avec `HTMLParser`.
