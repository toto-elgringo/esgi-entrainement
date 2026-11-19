# Fichiers, CSV et JSON

Un **fichier** est une suite de données, rangée sous un **nom** sur un support (disque, clé USB...). Un script passe son temps à en lire et à en écrire : journaux, exports de tableur, configurations, réponses d'API. Ce chapitre reprend les bases vues au chapitre « Notions avancées » (`open`, `with`) et va plus loin : modes, encodage, lecture fine, puis les deux formats de données les plus courants, **CSV** et **JSON**.

## 1. Fichier texte ou fichier binaire

| | Fichier texte | Fichier binaire |
|---|---|---|
| Contenu | des **caractères**, lisibles par un humain | des **octets** qu'il faut décoder |
| Exemples | `.txt`, code source (`.py`, `.c`, `.html`), données (`.csv`, `.json`, `.xml`) | images (`.png`, `.jpg`), sons et vidéos (`.mp3`, `.mp4`), programmes (`.exe`) |
| En Python | on lit et on écrit des `str` | on lit et on écrit des `bytes` |

Au fond, tout fichier est une suite d'octets. Un fichier texte est simplement un fichier dont les octets représentent des caractères selon un **encodage** (voir plus bas).

## 2. Ouvrir et fermer

Manipuler un fichier ressemble à l'usage d'un cahier : on l'**ouvre**, on **lit** ou on **écrit** (en repartant de zéro ou à la suite), puis on le **ferme** pour que d'autres puissent s'en servir.

`open(nom, mode)` renvoie un **objet fichier** (*file object*), par lequel passent toutes les lectures et écritures.

| Mode | Rôle | Si le fichier existe | S'il n'existe pas |
|---|---|---|---|
| `"r"` | lecture (par défaut) | lu depuis le début | `FileNotFoundError` |
| `"w"` | écriture | **vidé** puis réécrit | créé |
| `"a"` | ajout | on écrit **à la fin** | créé |
| `"x"` | création | `FileExistsError` | créé |

On ajoute `"b"` pour le **binaire** (`"rb"`, `"wb"`, `"ab"`) et `"+"` pour lire **et** écrire (`"r+"`), plus rare.

```python
f = open("exemple.txt", "w", encoding="utf-8")
print(f.name, f.mode, f.closed)
f.write("bonjour\n")
f.close()
print(f.closed)
```

### `with` : la fermeture automatique

Oublier `close()` (ou planter avant de l'atteindre) laisse le fichier ouvert. Le bloc `with` est un **gestionnaire de contexte** : il ferme le fichier tout seul en sortant du bloc, que ce soit à la fin normale, sur un `return` ou sur une exception.

```python
def premiere_ligne(chemin):
    with open(chemin, encoding="utf-8") as f:
        for ligne in f:
            if ligne.strip():
                return ligne.strip()
    return None


with open("exemple.txt", "w", encoding="utf-8") as f:
    f.write("\n\nla vraie première ligne\nla suite\n")

print(premiere_ligne("exemple.txt"))
```

Sans `with`, il faudrait penser à un `close()` avant **chaque** `return`. Avec `with`, il n'y a rien à faire.

> [!tip] Toujours `with`
> C'est la façon normale d'ouvrir un fichier en Python. Plusieurs fichiers à la fois : `with open(a) as source, open(b, "w") as cible:`.

## 3. L'encodage

Pour ranger un caractère dans un fichier, il faut le transformer en octets : c'est l'**encodage**. Le standard actuel est **UTF-8** (1 octet pour les lettres simples, 2 pour `é`, jusqu'à 4 pour un emoji). D'anciens fichiers Windows utilisent encore **Latin-1** ou **cp1252**.

```python
texte = "été"
octets = texte.encode("utf-8")
print(octets, len(octets))
print(octets.decode("utf-8"))
print(octets.decode("latin-1"))
print(len(texte.encode("latin-1")))
```

Si on ne précise rien, `open` utilise l'encodage par défaut du système, qui n'est **pas le même** partout (souvent cp1252 sur un vieux Windows, UTF-8 sur Linux et macOS). Un script qui marche chez toi peut alors afficher `Ã©tÃ©` chez un autre, ou planter avec une `UnicodeDecodeError`.

> [!warning] Précise toujours l'encodage
> Écris `open(chemin, encoding="utf-8")` pour tous les fichiers texte. En mode binaire (`"rb"`, `"wb"`), on ne met **pas** d'encodage : on manipule directement des `bytes`.

```python
with open("image.bin", "wb") as f:
    f.write(bytes([137, 80, 78, 71]))

with open("image.bin", "rb") as f:
    debut = f.read()
print(debut, list(debut))
```

## 4. Lire

| Méthode | Renvoie |
|---|---|
| `f.read()` | **tout** le reste du fichier, en une chaîne |
| `f.read(n)` | au plus `n` caractères (`n` octets en binaire) |
| `f.readline()` | la ligne suivante, **avec** son `"\n"` ; `""` à la fin du fichier |
| `f.readlines()` | la **liste** des lignes restantes, chacune avec son `"\n"` |
| `for ligne in f:` | les lignes une par une, sans tout charger en mémoire |

```python
with open("poeme.txt", "w", encoding="utf-8") as f:
    f.write("un\ndeux\ntrois\n")

with open("poeme.txt", encoding="utf-8") as f:
    print(repr(f.read(2)))
    print(repr(f.readline()))
    print(f.readlines())
    print(repr(f.read()))
```

Le fichier garde un **curseur** : chaque lecture avance. Une fois au bout, `read()` renvoie `""`. Pour relire, on revient au début avec `f.seek(0)` (`f.tell()` donne la position actuelle).

> [!tip] Le `"\n"` de fin
> Chaque ligne lue garde son retour à la ligne : `print(ligne)` en ajoute un deuxième (ligne vide entre chaque). Nettoie avec `ligne.rstrip("\n")` (garde les espaces) ou `ligne.strip()` (enlève tous les blancs autour).

### Les gros fichiers

`read()` et `readlines()` chargent tout en mémoire. Pour un journal de plusieurs gigaoctets, on parcourt le fichier avec `for` : une seule ligne est en mémoire à la fois. Un **générateur** (chapitre « Fonctions avancées ») permet d'emballer ce parcours dans une fonction :

```python
def lignes_non_vides(chemin):
    with open(chemin, encoding="utf-8") as f:
        for numero, ligne in enumerate(f, start=1):
            if ligne.strip():
                yield numero, ligne.rstrip("\n")


with open("journal.txt", "w", encoding="utf-8") as f:
    f.write("démarrage\n\nerreur disque\n")

for numero, ligne in lignes_non_vides("journal.txt"):
    print(numero, ":", ligne)
```

Le fichier reste ouvert tant que le générateur n'est pas terminé, puis `with` le ferme.

## 5. Écrire

- `f.write(texte)` écrit le texte **tel quel** (pas de retour à la ligne ajouté) et renvoie le nombre de caractères écrits ;
- `f.writelines(liste)` écrit chaque chaîne de la liste, là encore **sans** ajouter de `"\n"` ;
- `print(..., file=f)` écrit comme `print`, avec le retour à la ligne.

```python
notes = {"Ana": 17, "Tom": 12.5}

with open("bilan.txt", "w", encoding="utf-8") as f:
    f.write("Bilan\n")
    f.writelines(["-----\n", "\n"])
    for nom, note in notes.items():
        print(nom, ":", note, file=f)

with open("bilan.txt", "a", encoding="utf-8") as f:
    f.write("fin du bilan\n")

with open("bilan.txt", encoding="utf-8") as f:
    print(f.read())
```

> [!warning] `"w"` efface tout
> Ouvrir en `"w"` vide le fichier **immédiatement**, avant même la première écriture. Pour compléter un fichier, c'est `"a"`. Pour ne jamais écraser un fichier existant, c'est `"x"`.

## 6. Les erreurs courantes

| Exception | Quand |
|---|---|
| `FileNotFoundError` | lecture d'un fichier qui n'existe pas |
| `FileExistsError` | mode `"x"` sur un fichier qui existe |
| `PermissionError` | pas le droit (fichier protégé, ouvert ailleurs) |
| `IsADirectoryError` | le chemin désigne un dossier |
| `UnicodeDecodeError` | les octets ne correspondent pas à l'encodage demandé |

Les quatre premières sont des sortes d'`OSError`.

```python
def lire_ou_defaut(chemin, defaut=""):
    try:
        with open(chemin, encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return defaut


print(repr(lire_ou_defaut("absent.txt", "rien")))
```

> [!info] Savoir si un fichier existe
> `os.path.exists(chemin)` répond `True` ou `False`, `os.remove(chemin)` supprime un fichier. Le module `pathlib` propose la même chose en objets : `Path("a.txt").exists()`, `Path("a.txt").read_text(encoding="utf-8")`. Mais pour lire, le plus sûr reste d'essayer et d'intercepter `FileNotFoundError` : le fichier peut disparaître entre le test et l'ouverture.

## 7. Les formats de données

Pour ranger des **données** (et pas juste du texte) dans un fichier, il faut un **format** qui dit quoi correspond à quoi. Le binaire est plus compact, le texte plus lisible et plus facile à échanger. Trois formats texte dominent :

**CSV** (*Comma-Separated Values*) : un tableau, une ligne par enregistrement, les colonnes séparées par un délimiteur (virgule, ou point-virgule en France).

```text
nom;ville;age
Lina;Lyon;24
Marc;Brest;31
```

**XML** (*Extensible Markup Language*) : des balises ouvrantes et fermantes, imbriquées.

```text
<personne>
  <nom>Lina</nom>
  <ville>Lyon</ville>
</personne>
```

**JSON** (*JavaScript Object Notation*) : des dictionnaires et des listes, comme en Python.

```text
{"personnes": [{"nom": "Lina", "ville": "Lyon", "age": 24}]}
```

| Format | Taille | Facile à lire en code | Données imbriquées |
|---|---|---|---|
| CSV | petite | oui | non (un tableau plat) |
| XML | grosse (chaque balise est écrite deux fois) | non | oui |
| JSON | moyenne | avec le module `json`, oui | oui, et très utilisé sur le web |

## 8. Le CSV

### À la main, avec `split`

Pour un CSV très simple, découper chaque ligne suffit :

```python
with open("gens.csv", "w", encoding="utf-8") as f:
    f.write("Lina;Lyon;24\nMarc;Brest;31\n")

with open("gens.csv", encoding="utf-8") as f:
    for ligne in f:
        nom, ville, age = ligne.rstrip("\n").split(";")
        print(nom, "a", int(age), "ans")
```

Mais dès qu'une valeur contient le délimiteur (`"Brest; Finistère"`), un guillemet ou un retour à la ligne, `split` se trompe. Le CSV prévoit alors de mettre la valeur **entre guillemets** : c'est le module `csv` qui sait gérer ces cas.

### Le module `csv`

```python
import csv

with open("gens.csv", "w", encoding="utf-8", newline="") as f:
    ecrivain = csv.writer(f, delimiter=";")
    ecrivain.writerow(["nom", "ville", "age"])
    ecrivain.writerow(["Lina", "Lyon", 24])
    ecrivain.writerow(["Marc", "Brest; Finistère", 31])

with open("gens.csv", encoding="utf-8") as f:
    print(f.read())

with open("gens.csv", encoding="utf-8", newline="") as f:
    lecteur = csv.reader(f, delimiter=";")
    entete = next(lecteur)
    for ligne in lecteur:
        print(dict(zip(entete, ligne)))
```

- `csv.reader` fournit chaque ligne sous forme de **liste de chaînes** (convertis toi-même avec `int`, `float`) ;
- `csv.writer` met les guillemets là où il faut ;
- `newline=""` à l'ouverture est recommandé avec `csv` : le module gère lui-même les fins de ligne (sinon, sous Windows, on obtient des lignes vides en trop à l'écriture).

### Avec les noms de colonnes : `DictReader` et `DictWriter`

Quand la première ligne contient les noms des colonnes, `DictReader` renvoie un **dictionnaire** par ligne : on écrit `ligne["ville"]` plutôt que `ligne[1]`.

```python
import csv

with open("stock.csv", "w", encoding="utf-8", newline="") as f:
    ecrivain = csv.DictWriter(f, fieldnames=["article", "prix", "quantite"])
    ecrivain.writeheader()
    ecrivain.writerow({"article": "stylo", "prix": 1.5, "quantite": 40})
    ecrivain.writerow({"article": "cahier", "prix": 3.2, "quantite": 12})

with open("stock.csv", encoding="utf-8", newline="") as f:
    total = 0
    for ligne in csv.DictReader(f):
        total += float(ligne["prix"]) * int(ligne["quantite"])
print(round(total, 2))
```

### Dialectes et détection automatique

Un **dialecte** regroupe les réglages d'un CSV : délimiteur, caractère de guillemet, caractère d'échappement, fin de ligne. On peut passer les réglages un par un (`delimiter=";"`, `quotechar='"'`), ou enregistrer un dialecte réutilisable :

```python
import csv


class PointVirgule(csv.Dialect):
    delimiter = ";"
    quotechar = '"'
    doublequote = True
    lineterminator = "\n"
    quoting = csv.QUOTE_MINIMAL


csv.register_dialect("point-virgule", PointVirgule)

with open("villes.csv", "w", encoding="utf-8", newline="") as f:
    csv.writer(f, dialect="point-virgule").writerows([["Lyon", 522000], ["Brest", 140000]])

with open("villes.csv", encoding="utf-8", newline="") as f:
    extrait = f.read(1024)
    dialecte = csv.Sniffer().sniff(extrait)
    f.seek(0)
    print("délimiteur deviné :", repr(dialecte.delimiter))
    for ligne in csv.reader(f, dialecte):
        print(ligne)
```

Le `Sniffer` lit un **extrait** du fichier et devine le dialecte. Comme cette lecture a avancé le curseur, `f.seek(0)` revient au début avant la vraie lecture.

## 9. Le JSON

Le module `json` convertit des dictionnaires et des listes Python en texte JSON, et inversement.

| Fonction | Va de | Vers |
|---|---|---|
| `json.dump(donnees, f)` | objet Python | **fichier** JSON |
| `json.load(f)` | fichier JSON | objet Python |
| `json.dumps(donnees)` | objet Python | **chaîne** JSON |
| `json.loads(texte)` | chaîne JSON | objet Python |

Moyen mnémotechnique : le `s` final veut dire *string* (chaîne).

```python
import json

carnet = {"contacts": [
    {"nom": "Lina", "ville": "Lyon", "tel": None, "actif": True},
    {"nom": "Élodie", "ville": "Brest", "tel": "0601020304", "actif": False},
]}

with open("carnet.json", "w", encoding="utf-8") as f:
    json.dump(carnet, f, indent=2, ensure_ascii=False)

with open("carnet.json", encoding="utf-8") as f:
    relu = json.load(f)

print(relu == carnet)
print([c["nom"] for c in relu["contacts"] if c["actif"]])
print(json.dumps({"a": 1, "b": [1, 2]}))
print(json.loads('{"x": [true, null, 2.5]}'))
```

- `indent=2` rend le fichier lisible (retours à la ligne et indentation) ;
- `ensure_ascii=False` écrit `É` tel quel, au lieu de `\u00c9`.

| JSON | Python |
|---|---|
| objet `{...}` | `dict` |
| tableau `[...]` | `list` |
| texte `"..."` | `str` |
| nombre | `int` ou `float` |
| `true` / `false` | `True` / `False` |
| `null` | `None` |

> [!warning] Ce que JSON ne sait pas garder
> - Les **clés** d'un objet JSON sont toujours des **textes** : `{1: "a"}` revient sous la forme `{"1": "a"}` ;
> - un **tuple** revient sous forme de **liste** ;
> - un `set`, une date ou un objet de ta propre classe ne passent pas du tout (`TypeError`) : convertis-les d'abord (en liste, en texte, en dictionnaire).

```python
import json

print(json.loads(json.dumps({1: (2, 3)})))
try:
    json.dumps({"tags": {"a", "b"}})
except TypeError as e:
    print("Refusé :", e)
try:
    json.loads("{'simple': 'quotes'}")
except json.JSONDecodeError as e:
    print("JSON invalide :", e)
```

Un fichier JSON mal formé (guillemets simples, virgule en trop, fichier vide) lève `json.JSONDecodeError`, une sorte de `ValueError`.

### Parcourir des données imbriquées

Un JSON se parcourt comme n'importe quelle structure Python : des `for` sur les listes, des `[...]` ou `.get(...)` sur les dictionnaires.

```python
import json

texte = '{"equipes": [{"nom": "Rouge", "joueurs": [{"pseudo": "kim", "score": 12}, {"pseudo": "lou", "score": 7}]}, {"nom": "Bleu", "joueurs": []}]}'
donnees = json.loads(texte)

for equipe in donnees["equipes"]:
    total = sum(j["score"] for j in equipe["joueurs"])
    meilleur = max(equipe["joueurs"], key=lambda j: j["score"], default=None)
    print(equipe["nom"], total, meilleur["pseudo"] if meilleur else "-")
```

## 10. Lire du HTML

Une page web est un fichier texte en **HTML**, un langage à balises proche du XML. Pour en extraire des informations (le titre, les liens...), on évite les `split` et les recherches de texte : les balises peuvent avoir des attributs, des espaces, des majuscules. La bibliothèque standard fournit `html.parser.HTMLParser` : on en hérite et on réagit à chaque balise rencontrée.

```python
from html.parser import HTMLParser


class Liens(HTMLParser):
    def __init__(self):
        super().__init__()
        self.liens = []

    def handle_starttag(self, balise, attributs):
        if balise == "a":
            self.liens.append(dict(attributs).get("href"))


page = '<html><body><a href="/cours">Cours</a> et <A HREF="/quiz">Quiz</A></body></html>'
lecteur = Liens()
lecteur.feed(page)
print(lecteur.liens)
```

- `handle_starttag(balise, attributs)` : une balise ouvrante (nom en minuscules, attributs en liste de couples) ;
- `handle_endtag(balise)` : une balise fermante ;
- `handle_data(texte)` : le texte entre les balises.

> [!info] Hors bibliothèque standard
> En dehors des exercices, on utilise souvent **Beautiful Soup** (`pip install beautifulsoup4`), plus confortable : `soup.find("title").text`, `soup.find_all("a")`. Le principe reste le même : laisser un vrai lecteur de HTML découper la page.

## À retenir

- Toujours `with open(chemin, mode, encoding="utf-8") as f:` ; pas d'encodage en binaire.
- `"r"` lit, `"w"` **vide** puis écrit, `"a"` ajoute, `"x"` crée sans jamais écraser.
- Les lignes lues gardent leur `"\n"` ; `for ligne in f` lit sans tout charger.
- CSV : `csv.reader` / `csv.writer` (ou `DictReader` / `DictWriter`), `newline=""`, valeurs lues en **texte**.
- JSON : `load` / `dump` pour les fichiers, `loads` / `dumps` pour les chaînes ; clés toujours en texte, tuples rendus en listes.
- Intercepte `FileNotFoundError` et `json.JSONDecodeError` quand un fichier peut manquer ou être abîmé.
