# Chaînes et f-strings

Ce chapitre va plus loin que le cours sur le texte : un script passe son temps à lire, nettoyer, découper et afficher des chaînes.

## 1. Rappels

Une `str` est une suite de caractères **non modifiable** : chaque méthode renvoie une **nouvelle** chaîne, l'originale ne change pas.

```python
s = "  Bonjour  "
propre = s.strip()
print(repr(s), repr(propre))

texte = "abc"
texte.upper()
print(texte)
texte = texte.upper()
print(texte)
```

**Pas à pas :**

1. `s.strip()` fabrique une **nouvelle** chaîne sans les espaces des bouts, `"Bonjour"`, rangée dans `propre`. `s` garde ses espaces. `repr` affiche la chaîne avec ses guillemets : on voit bien les espaces.
2. `texte.upper()` fabrique `"ABC"`, mais personne ne range ce résultat : il est perdu. `texte` vaut toujours `"abc"`.
3. `texte = texte.upper()` range le résultat dans `texte` : cette fois, `texte` vaut `"ABC"`.

```text
'  Bonjour  ' 'Bonjour'
abc
ABC
```

> [!warning] Récupérer le résultat
> `texte.upper()` seul ne sert à rien : il faut ranger le résultat, `texte = texte.upper()`.

**À retenir :** une méthode de chaîne ne modifie jamais la chaîne, elle en **renvoie** une nouvelle : écris toujours `x = x.methode()` (ou range le résultat dans une autre variable).

### Indices et tranches

Chaque caractère a une **position** (un indice) qui commence à **0**. On peut aussi compter depuis la fin avec des indices **négatifs** : `-1` est le dernier caractère.

| Caractère | `P` | `y` | `t` | `h` | `o` | `n` |
|---|---|---|---|---|---|---|
| Indice | 0 | 1 | 2 | 3 | 4 | 5 |
| Indice négatif | -6 | -5 | -4 | -3 | -2 | -1 |

- `s[i]` donne **un** caractère.
- `s[debut:fin]` donne une **tranche** : de `debut` **inclus** à `fin` **exclu**. Si on n'écrit pas `debut`, on part du début ; sans `fin`, on va jusqu'au bout.
- `s[::-1]` lit la chaîne à l'envers (pas de `-1`).

```python
s = "Python"
print(s[0], s[-1])
print(s[1:4])
print(s[:2], s[2:])
print(s[-2:], s[:-2])
print(s[::-1])
print(len(s), s[2:100])
```

**Pas à pas** avec le tableau ci-dessus :

| Écriture | Ce qu'on prend | Résultat |
|---|---|---|
| `s[0]`, `s[-1]` | le premier, le dernier | `P`, `n` |
| `s[1:4]` | indices 1, 2, 3 (le 4 est exclu) | `yth` |
| `s[:2]` | indices 0 et 1 | `Py` |
| `s[2:]` | de l'indice 2 jusqu'au bout | `thon` |
| `s[-2:]` | les **2 derniers** | `on` |
| `s[:-2]` | tout **sauf** les 2 derniers | `Pyth` |
| `s[::-1]` | tout, à l'envers | `nohtyP` |
| `s[2:100]` | une tranche trop longue s'arrête au bout, sans erreur | `thon` |

```text
P n
yth
Py thon
on Pyth
nohtyP
6 thon
```

> [!warning] Un indice seul peut planter
> `s[10]` sur `"Python"` lève `IndexError` (il n'y a pas de caractère 10), alors que la tranche `s[2:100]` ne plante jamais. Sur une chaîne vide, même `s[0]` plante.

**À retenir :** `s[-n:]` = les `n` derniers, `s[:-n]` = tout sauf les `n` derniers, `s[-n]` = un seul caractère. Dans une tranche, la fin est toujours **exclue**.

### Chercher un morceau avec `in`

`morceau in texte` vaut `True` si `morceau` apparaît quelque part dans `texte` (`not in` pour le contraire). Les chaînes n'ont **pas** de méthode `contains` comme dans d'autres langages : en Python, on écrit `in`.

```python
phrase = "J'apprends Python"
print("Python" in phrase)
print("python" in phrase)
print("python" in phrase.lower())
print("@" not in phrase)
```

**Pas à pas :**

1. `"Python"` apparaît tel quel : `True`.
2. `"python"` (avec un `p` minuscule) n'apparaît pas : `in` tient compte des majuscules, `False`.
3. `phrase.lower()` vaut `"j'apprends python"`, qui contient `"python"` : `True`.
4. Il n'y a pas de `@` : `"@" not in phrase` vaut `True`.

```text
True
False
True
True
```

**À retenir :** `in` cherche un morceau et respecte la casse. Pour l'ignorer, mets les deux côtés en minuscules.

### Un texte sur plusieurs lignes

Entre **triples guillemets** (`"""..."""` ou `'''...'''`), une chaîne peut s'étendre sur plusieurs lignes du code : les retours à la ligne sont gardés (ce sont des `\n` dans la chaîne).

```python
menu = """1. Jouer
2. Quitter"""
print(menu)
print(len(menu))
print(menu.splitlines())
```

**Pas à pas :** `"1. Jouer"` fait 8 caractères, puis vient le retour à la ligne (1 caractère), puis `"2. Quitter"` (10 caractères) : 8 + 1 + 10 = **19**. `splitlines()` coupe aux retours à la ligne.

```text
1. Jouer
2. Quitter
19
['1. Jouer', '2. Quitter']
```

**À retenir :** triples guillemets = texte sur plusieurs lignes, chaque passage à la ligne compte pour un caractère `\n`.

### Passer du texte au nombre, et inversement

Un texte qui contient des chiffres n'est **pas** un nombre : `"4" + "2"` colle les textes (`"42"`). Pour calculer, on convertit :

| Conversion | Écriture | Exemple | Résultat |
|---|---|---|---|
| texte → entier | `int(texte)` | `int("42")` | `42` |
| texte → nombre à virgule | `float(texte)` | `float("4.2")` | `4.2` |
| nombre → texte | `str(nombre)` | `str(42)` | `"42"` |

Si le texte ne représente pas un entier, `int` lève une `ValueError`.

```python
print("4" + "2")
print(int("4") + int("2"))
print(str(7) + " jours")
print(float("2.5") * 2)
try:
    int("4.2")
except ValueError as erreur:
    print("Refusé :", erreur)
```

**Pas à pas :**

1. `"4" + "2"` : deux textes, `+` les colle : `42` (un texte).
2. `int("4") + int("2")` : deux entiers, `+` les additionne : `6`.
3. `str(7) + " jours"` : on ne peut pas coller un nombre et un texte, on transforme d'abord 7 en `"7"`.
4. `float("2.5") * 2` vaut `5.0`.
5. `int("4.2")` échoue : `"4.2"` n'est pas un entier (il faudrait `float`).

```text
42
6
7 jours
5.0
Refusé : invalid literal for int() with base 10: '4.2'
```

> [!info] Pas de `parseInt` ni de `(int)`
> En Python, la conversion s'écrit toujours comme un appel de fonction : `int(...)`, `float(...)`, `str(...)`. Les écritures `parseInt("42")` (JavaScript) ou `(int) x` (C) n'existent pas.

**À retenir :** pour calculer avec un texte lu, convertis-le avec `int` ou `float` ; pour le coller dans un texte, `str` (ou plus simple : une f-string).

## 2. Les f-strings

Une **f-string** commence par `f` : ce qui est entre accolades est **calculé** et inséré dans le texte.

```python
nom = "Ada"
age = 36
print(f"{nom} a {age} ans")
print(f"Dans 5 ans : {age + 5} ans")
print(f"En majuscules : {nom.upper()}")
```

**Pas à pas :** Python remplace chaque `{...}` par la valeur de ce qu'il contient.

| Accolades | Calcul | Inséré |
|---|---|---|
| `{nom}` | la variable `nom` | `Ada` |
| `{age}` | la variable `age` | `36` |
| `{age + 5}` | 36 + 5 | `41` |
| `{nom.upper()}` | `"Ada".upper()` | `ADA` |

```text
Ada a 36 ans
Dans 5 ans : 41 ans
En majuscules : ADA
```

Sans le `f` devant, les accolades restent écrites telles quelles : `"{nom}"` affiche `{nom}`. Et sans accolades, `f"30 + 6"` affiche le texte `30 + 6`, sans calcul.

**À retenir :** `f` devant les guillemets, et tout ce qui est entre `{ }` est calculé (variable, calcul, appel de méthode).

### La mise en forme après `:`

Après `:`, on précise la **mise en forme** :

| Format | Effet | Exemple | Résultat |
|---|---|---|---|
| `:.2f` | 2 décimales | `f"{3.14159:.2f}"` | `3.14` |
| `:10` ou `:<10` | largeur 10, aligné à gauche (texte) | `f"{'ab':<5}"` | `ab   ` |
| `:>10` | aligné à droite | `f"{'ab':>5}"` | `   ab` |
| `:^10` | centré | `f"{'ab':^6}"` | `  ab  ` |
| `:05d` | entier sur 5 chiffres, complété par des 0 | `f"{42:05d}"` | `00042` |
| `:,` | séparateur de milliers | `f"{1234567:,}"` | `1,234,567` |
| `:.1%` | pourcentage | `f"{0.125:.1%}"` | `12.5%` |

On peut combiner : `:>8.2f` (largeur 8, à droite, 2 décimales), `:,.2f` (milliers **et** 2 décimales).

```python
x = 2.71828
print(f"{x:.2f}|{x:.1f}|{x:.0f}")
print(f"{4:03d}|{12:02d}|{1234:02d}")
print(f"{0.4567:.1%}|{98765.4:,.2f}")
minutes, secondes = 3, 7
print(f"{minutes:02d}:{secondes:02d}")
```

**Pas à pas :**

1. `.2f` garde 2 décimales en **arrondissant** : `2.71828` → `2.72`. `.1f` → `2.7`, `.0f` → `3` (aucune décimale).
2. `03d` : au moins 3 chiffres, on complète à gauche par des 0 : `4` → `004`. `02d` sur 12 ne change rien (`12` a déjà 2 chiffres), et sur 1234 non plus : la largeur est un **minimum**, rien n'est coupé.
3. `.1%` multiplie par 100 et ajoute `%` : `0.4567` → `45.67` → `45.7%` (1 décimale).
4. `,.2f` : séparateur de milliers (une virgule, à l'anglaise) et 2 décimales : `98,765.40`.
5. `02d` pour chaque morceau d'une durée : `03:07`.

```text
2.72|2.7|3
004|12|1234
45.7%|98,765.40
03:07
```

**À retenir :** `.Nf` = N décimales, `0Nd` = au moins N chiffres complétés par des 0, `.N%` = pourcentage (multiplié par 100), `,` = milliers.

### Aligner un tableau

La largeur fixe le nombre de caractères **minimum** occupés : la valeur est complétée par des espaces. `<` colle la valeur à gauche, `>` à droite.

```python
notes = [("Maths", 3, 12.5), ("Anglais", 1, 16.0), ("Python", 2, 15.0)]
print(f"{'Matière':<10}{'Coef':>5}{'Note':>7}")
total_points = 0
total_coef = 0
for matiere, coef, note in notes:
    total_points += coef * note
    total_coef += coef
    print(f"{matiere:<10}{coef:>5}{note:>7.2f}")
print(f"{'Moyenne':<10}{'':>5}{total_points / total_coef:>7.2f}")
```

**Pas à pas** (un `·` représente une espace) :

| Morceau | Valeur | Taille de la valeur | Espaces ajoutées | Écrit |
|---|---|---|---|---|
| `{'Matière':<10}` | `Matière` | 7 | 3 à droite | `Matière···` |
| `{'Coef':>5}` | `Coef` | 4 | 1 à gauche | `·Coef` |
| `{'Note':>7}` | `Note` | 4 | 3 à gauche | `···Note` |
| `{matiere:<10}` | `Maths` | 5 | 5 à droite | `Maths·····` |
| `{coef:>5}` | `3` | 1 | 4 à gauche | `····3` |
| `{note:>7.2f}` | `12.50` | 5 | 2 à gauche | `··12.50` |
| `{'':>5}` | texte vide | 0 | 5 | `·····` |

La dernière ligne utilise `{'':>5}` : une case **vide** de 5 caractères, pour que la moyenne tombe sous la colonne des notes. La moyenne vaut (3 × 12.5 + 1 × 16 + 2 × 15) / 6 = 83.5 / 6 ≈ 13.92.

```text
Matière    Coef   Note
Maths         3  12.50
Anglais       1  16.00
Python        2  15.00
Moyenne          13.92
```

> [!tip] Les nombres s'alignent à droite
> Par défaut, un nombre est aligné à droite et un texte à gauche. Pour des tableaux lisibles, fixe toujours la largeur des colonnes.

> [!warning] Guillemets dans une f-string
> Avant Python 3.12, on ne peut pas réutiliser le même guillemet à l'intérieur des accolades : écris `f"{d['cle']}"` (apostrophes dedans, guillemets dehors).

**À retenir :** une colonne = une largeur fixe ; texte avec `<`, nombres avec `>`, et `{'':>N}` pour laisser une colonne vide.

### Changer les séparateurs

Le format `,` met des **virgules** pour les milliers et un **point** pour les décimales (à l'anglaise). Pour un autre format, on part de ce texte et on remplace les caractères avec `replace` (voir la partie 3).

```python
n = 1234567.891
anglais = f"{n:,.2f}"
print(anglais)
print(anglais.replace(",", "'"))
print(anglais.replace(",", ".").replace(".", ","))
print(anglais.replace(",", "_").replace(".", ",").replace("_", "."))
```

**Pas à pas :**

1. `f"{n:,.2f}"` donne `1,234,567.89`.
2. Format suisse (apostrophe pour les milliers) : on remplace chaque `,` par `'` → `1'234'567.89`.
3. Piège : pour échanger `,` et `.` (format allemand), si on remplace d'abord `,` par `.`, on obtient `1.234.567.89`, puis **tous** les `.` deviennent `,` : `1,234,567,89`. Raté.
4. La bonne méthode passe par un caractère provisoire : `,` → `_`, puis `.` → `,`, puis `_` → `.` : `1.234.567,89`.

```text
1,234,567.89
1'234'567.89
1,234,567,89
1.234.567,89
```

**À retenir :** formate d'abord avec `,.2f`, puis remplace les séparateurs avec `replace`, en faisant attention à l'**ordre** des remplacements.

## 3. Les méthodes utiles

| Méthode | Rôle | Exemple | Résultat |
|---|---|---|---|
| `strip()`, `lstrip()`, `rstrip()` | enlève les espaces (ou les caractères donnés) aux bouts | `"..ok..".strip(".")` | `"ok"` |
| `lower()`, `upper()` | minuscules, majuscules | `"Ok".lower()` | `"ok"` |
| `capitalize()`, `title()` | première lettre / chaque mot en majuscule | `"le chat".title()` | `"Le Chat"` |
| `replace(a, b)` | remplace toutes les occurrences | `"banane".replace("a", "o")` | `"bonono"` |
| `count(sous)` | nombre d'occurrences | `"banane".count("an")` | `2` |
| `find(sous)` | position de la première occurrence, `-1` si absente | `"banane".find("n")` | `2` |
| `rfind(sous)` | position de la **dernière** occurrence, `-1` si absente | `"banane".rfind("n")` | `4` |
| `index(sous)` | comme `find`, mais lève `ValueError` si absente | `"banane".index("n")` | `2` |
| `startswith(...)`, `endswith(...)` | commence / finit par | `"photo.jpg".endswith(".jpg")` | `True` |
| `isdigit()`, `isalpha()`, `isalnum()`, `isspace()` | que des chiffres / lettres / les deux / des espaces | `"42".isdigit()` | `True` |
| `isupper()`, `islower()` | lettres toutes en majuscules / en minuscules | `"ESGI".isupper()` | `True` |
| `split(sep, maxsplit)` | découpe | `"a=b=c".split("=", 1)` | `["a", "b=c"]` |
| `rsplit(sep, maxsplit)` | découpe en partant de la **fin** | `"a=b=c".rsplit("=", 1)` | `["a=b", "c"]` |
| `splitlines()` | découpe en lignes | `"a\nb".splitlines()` | `["a", "b"]` |
| `sep.join(liste)` | relie | `"/".join(["a", "b"])` | `"a/b"` |
| `zfill(n)`, `center(n)` | complète avec des 0, centre | `"7".zfill(3)` | `"007"` |

```python
ligne = "  Nom : Ada Lovelace ;  "
cle, valeur = ligne.strip(" ;").split(":")
print(repr(cle.strip()), repr(valeur.strip()))

print(" ".join("  trop   d'espaces   ici ".split()))
print("photo.JPG".lower().endswith((".jpg", ".png")))
print("2026-10-18".split("-"))
```

**Pas à pas :**

1. `ligne.strip(" ;")` enlève aux deux bouts **tous** les espaces et points-virgules (chaque caractère donné, dans n'importe quel ordre) : `"Nom : Ada Lovelace"`.
2. `.split(":")` coupe au `:` : `["Nom ", " Ada Lovelace"]`, rangés dans `cle` et `valeur`. Il reste des espaces, enlevés par `strip()` à l'affichage.
3. `"  trop   d'espaces   ici ".split()` (sans argument) coupe sur **toutes** les suites d'espaces et ne garde aucun morceau vide : `["trop", "d'espaces", "ici"]`. `" ".join(...)` recolle avec **un** espace.
4. `"photo.JPG".lower()` donne `"photo.jpg"` ; `endswith` accepte un **tuple** de fins possibles : `True` si l'une d'elles convient.
5. `"2026-10-18".split("-")` donne trois textes (pas trois nombres).

```text
'Nom' 'Ada Lovelace'
trop d'espaces ici
True
['2026', '10', '18']
```

> [!tip] Nettoyer les espaces en trop
> `" ".join(texte.split())` enlève les espaces au début, à la fin, et remplace les espaces multiples par un seul.

> [!warning] `split()` et `split(" ")` ne font pas la même chose
> `"a  b".split()` donne `["a", "b"]`, mais `"a  b".split(" ")` donne `["a", "", "b"]` : avec `" "`, chaque espace est un séparateur, et deux espaces côte à côte laissent un morceau **vide**. De même, `texte.replace("  ", " ")` ne remplace qu'une paire d'espaces à la fois : trois espaces deviennent deux, pas un.

**À retenir :** `split()` sans argument pour découper en mots, `sep.join(liste)` pour recoller ; `join` est une méthode du **séparateur**, et la liste ne doit contenir que des chaînes.

### Découper une seule fois : `maxsplit`

Le deuxième argument de `split` limite le **nombre de découpes**. `rsplit` fait pareil, mais en partant de la fin.

```python
chemin = "C:/cours/python/tp1.py"
print(chemin.split("/"))
print(chemin.split("/", 1))
print(chemin.rsplit("/", 1))
print(chemin.rsplit("/", 1)[1])
print("archive.tar.gz".split(".", 1), "archive.tar.gz".rsplit(".", 1))
print("README".rsplit(".", 1))
```

**Pas à pas :**

1. Sans limite, on coupe à chaque `/` : 4 morceaux.
2. `split("/", 1)` : **une** seule découpe, au **premier** `/` : `["C:", "cours/python/tp1.py"]`.
3. `rsplit("/", 1)` : une seule découpe, au **dernier** `/` : `["C:/cours/python", "tp1.py"]`. Le morceau `[1]` est le nom du fichier.
4. Avec `"archive.tar.gz"`, `split(".", 1)` coupe au premier point, `rsplit(".", 1)` au dernier : seul `rsplit` isole `gz`.
5. Sans séparateur, il n'y a rien à couper : on obtient une liste d'**un seul** élément. Écrire `[1]` dessus lèverait `IndexError` : teste d'abord `"." in texte`.

```text
['C:', 'cours', 'python', 'tp1.py']
['C:', 'cours/python/tp1.py']
['C:/cours/python', 'tp1.py']
tp1.py
['archive', 'tar.gz'] ['archive.tar', 'gz']
['README']
```

**À retenir :** `split(sep, 1)` coupe au premier séparateur, `rsplit(sep, 1)` au dernier ; vérifie que le séparateur est présent avant de prendre le morceau `[1]`.

### Ignorer les majuscules

Les méthodes comme `count`, `find`, `replace`, `in` et `==` tiennent compte de la casse : `"A"` et `"a"` sont différents. Pour l'ignorer, on met **tout** en minuscules avant de comparer : le texte **et** ce qu'on cherche.

```python
texte = "Le Lac et le Loup"
print(texte.count("l"))
print(texte.lower().count("l"))
print(texte.lower().count("LE"), texte.lower().count("LE".lower()))
print("aaaa".count("aa"))
```

**Pas à pas :**

1. Dans `"Le Lac et le Loup"`, le seul `l` minuscule est celui de `le` : `1`.
2. `texte.lower()` vaut `"le lac et le loup"` : il y a un `l` dans `le`, `lac`, `le` et `loup`, donc `4`.
3. Chercher `"LE"` en majuscules dans un texte en minuscules ne trouve rien (`0`) : il faut aussi mettre en minuscules ce qu'on cherche, et on trouve les deux `le`.
4. `count` compte des apparitions qui ne se **chevauchent pas** : dans `"aaaa"`, il prend `aa` puis `aa`, soit `2` (et pas 3).

```text
1
4
0 2
2
```

**À retenir :** pour ignorer la casse, applique `.lower()` **des deux côtés**.

### Remplacer plusieurs caractères

`replace(a, b)` remplace **toutes** les apparitions de `a`, mais un seul `a` à la fois. Pour en remplacer plusieurs, on boucle et on **range** le résultat à chaque tour.

```python
texte = "Oui, non ; peut-être !"
for signe in ",;!":
    texte = texte.replace(signe, "")
print(repr(texte))
print(" ".join(texte.split()))
```

**Pas à pas :** la boucle parcourt les caractères de `",;!"`.

| Tour | `signe` | `texte` après le tour |
|---|---|---|
| 1 | `,` | `"Oui non ; peut-être !"` |
| 2 | `;` | `"Oui non  peut-être !"` |
| 3 | `!` | `"Oui non  peut-être "` |

Les espaces restés autour des signes sont ensuite nettoyés avec `" ".join(texte.split())`.

```text
'Oui non  peut-être '
Oui non peut-être
```

Si on oublie `texte = ...`, chaque `replace` part du texte d'origine et son résultat est perdu : rien ne change.

**À retenir :** pour plusieurs remplacements, `for c in "...": texte = texte.replace(c, nouveau)`.

### Trouver ce qui suit un repère

`find(repere)` donne la position où commence `repere`, ou `-1` s'il est absent. Le texte qui suit commence `len(repere)` caractères plus loin.

```python
def valeur_apres(texte, repere):
    position = texte.find(repere)
    if position == -1:
        return None
    return texte[position + len(repere):]


print(valeur_apres("prix: 12 €", ": "))
print(valeur_apres("a->b->c", "->"))
print(valeur_apres("rien ici", ": "))
```

**Pas à pas** sur `"prix: 12 €"` avec le repère `": "` :

| Caractère | `p` | `r` | `i` | `x` | `:` | espace | `1` | `2` | espace | `€` |
|---|---|---|---|---|---|---|---|---|---|---|
| Indice | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |

1. `find(": ")` renvoie `4` (là où le repère **commence**).
2. Le repère fait 2 caractères : la suite commence à 4 + 2 = 6.
3. `texte[6:]` vaut `"12 €"`.

Avec `"a->b->c"`, `find` s'arrête au **premier** `->` (indice 1) : on obtient `"b->c"`. Si le repère est absent, `find` vaut `-1` : sans le test, `texte[-1 + 2:]` donnerait un morceau sans aucun sens, d'où le `if`.

```text
12 €
b->c
None
```

**À retenir :** `find` = position du début du repère (ou `-1`) ; la suite est `texte[position + len(repere):]`, après avoir testé le `-1`.

### Une majuscule à chaque mot

`title()` met une majuscule au début de chaque mot et le reste en minuscules, mais il considère que l'apostrophe sépare les mots. Pour tout contrôler, on le fait mot par mot : `mot[0].upper() + mot[1:].lower()`.

```python
print("l'ÉTÉ indien".title())
print("pYTHON".capitalize())
mot = "pYTHON"
print(mot[0].upper() + mot[1:].lower())
```

**Pas à pas :**

1. `title()` met une majuscule après l'apostrophe : `L'Été Indien` (pas toujours ce qu'on veut).
2. `capitalize()` traite la chaîne entière : première lettre en majuscule, **tout** le reste en minuscules.
3. À la main : `mot[0]` vaut `"p"` → `"P"` ; `mot[1:]` vaut `"YTHON"` → `"ython"` ; on colle : `"Python"`.

```text
L'Été Indien
Python
Python
```

**À retenir :** un mot propre = `mot[0].upper() + mot[1:].lower()` ; pour une phrase, applique-le à chaque mot de `split()` puis recolle avec `" ".join(...)`.

### Tester le contenu d'une chaîne

Les méthodes `is...()` renvoient `True` ou `False` :

- `isdigit()` : que des chiffres (`0` à `9`) ;
- `isalpha()` : que des lettres (accents compris) ;
- `isalnum()` : que des lettres ou des chiffres ;
- `isspace()` : que des espaces (ou tabulations, retours à la ligne) ;
- `isupper()` / `islower()` : il y a au moins une lettre, et **toutes** les lettres sont en majuscules / en minuscules (les chiffres sont ignorés).

```python
for mot in ["2026", "chat", "ESGI", "Python", "R2D2", "-5", "3.5", ""]:
    print(f"{mot!r:8}", mot.isdigit(), mot.isalpha(), mot.isalnum(), mot.isupper(), mot.islower())
```

**Pas à pas** (`!r` affiche le mot avec ses guillemets, pour voir la chaîne vide) :

| Mot | `isdigit` | `isalpha` | `isalnum` | `isupper` | `islower` | Pourquoi |
|---|---|---|---|---|---|---|
| `"2026"` | True | False | True | False | False | que des chiffres, aucune lettre |
| `"chat"` | False | True | True | False | True | que des lettres minuscules |
| `"ESGI"` | False | True | True | True | False | que des lettres majuscules |
| `"Python"` | False | True | True | False | False | lettres mélangées : ni tout en haut, ni tout en bas |
| `"R2D2"` | False | False | True | True | False | lettres **et** chiffres ; ses lettres sont toutes majuscules |
| `"-5"` | False | False | False | False | False | le `-` n'est ni un chiffre ni une lettre |
| `"3.5"` | False | False | False | False | False | le `.` n'est pas un chiffre |
| `""` | False | False | False | False | False | une chaîne vide donne toujours `False` |

```text
'2026'   True False True False False
'chat'   False True True False True
'ESGI'   False True True True False
'Python' False True True False False
'R2D2'   False False True True False
'-5'     False False False False False
'3.5'    False False False False False
''       False False False False False
```

> [!warning] L'ordre des tests compte
> Ces tests se chevauchent : `"chat".isalnum()` est vrai aussi, puisqu'une lettre est un caractère alphanumérique. Pour classer un texte, teste du **plus précis** au **plus large** (par exemple `isdigit`, puis `isalpha`, puis `isalnum`) : sinon le test large attrape tout.

```python
def genre(c):
    if c.isdigit():
        return "chiffre"
    if c.isalpha():
        return "lettre"
    if c.isspace():
        return "espace"
    return "autre"


print([genre(c) for c in "a1 ?"])
```

**Pas à pas :** `"a"` n'est pas un chiffre mais une lettre ; `"1"` est un chiffre (premier test) ; `" "` passe les deux premiers tests puis est un espace ; `"?"` ne passe aucun test : `"autre"`.

```text
['lettre', 'chiffre', 'espace', 'autre']
```

**À retenir :** `isdigit` ne connaît ni le signe `-` ni le point ; une chaîne vide est `False` partout ; teste du plus précis au plus large.

### Valider un format, règle par règle

Pour vérifier qu'un texte respecte plusieurs règles, on teste les règles **une par une** et on renvoie `False` dès qu'une échoue. Si on arrive au bout, tout est bon. Exemple : une heure au format `HH:MM`.

```python
def heure_valide(texte):
    if texte.count(":") != 1:
        return False
    h, m = texte.split(":")
    if len(h) != 2 or len(m) != 2:
        return False
    if not h.isdigit() or not m.isdigit():
        return False
    return int(h) < 24 and int(m) < 60


for essai in ["09:30", "9:30", "0930", "09:75", "ab:cd"]:
    print(essai, heure_valide(essai))
```

**Pas à pas :**

| Essai | Un seul `:` ? | 2 chiffres de chaque côté ? | Que des chiffres ? | Valeurs possibles ? | Résultat |
|---|---|---|---|---|---|
| `"09:30"` | oui | oui | oui | 9 < 24 et 30 < 60 | True |
| `"9:30"` | oui | non (`"9"`) | | | False |
| `"0930"` | non (aucun) | | | | False |
| `"09:75"` | oui | oui | oui | 75 ≥ 60 | False |
| `"ab:cd"` | oui | oui | non | | False |

On ne fait `split(":")` qu'**après** avoir vérifié qu'il y a exactement un `:` : sinon `h, m = ...` planterait (pas exactement deux morceaux). De même, `int(h)` ne vient qu'après `isdigit()`.

```text
09:30 True
9:30 False
0930 False
09:75 False
ab:cd False
```

**À retenir :** une règle = un test ; `return False` dès qu'une règle échoue, `True` à la fin ; vérifie la forme (`count`, `len`, `isdigit`) avant de découper ou de convertir.

## 4. Caractères et codes

Chaque caractère a un **code** (Unicode). `ord` donne le code d'un caractère, `chr` le caractère d'un code.

```python
print(ord("a"), ord("b"), ord("A"))
print(chr(97), chr(ord("a") + 2))

decalage = 3
lettre = "y"
nouvelle = chr((ord(lettre) - ord("a") + decalage) % 26 + ord("a"))
print(nouvelle)

print("a" < "b", "Z" < "a", "pomme" < "pommier")
```

Les lettres ont des codes qui se suivent : `a` = 97, `b` = 98, … `z` = 122, et `A` = 65, … `Z` = 90.

**Pas à pas du décalage** de `"y"` de 3 rangs :

| Étape | Calcul | Valeur |
|---|---|---|
| Code de la lettre | `ord("y")` | 121 |
| Rang dans l'alphabet (a = 0) | 121 - 97 | 24 |
| On décale | 24 + 3 | 27 |
| On revient au début après `z` | 27 % 26 | 1 |
| On revient à un code | 1 + 97 | 98 |
| Caractère | `chr(98)` | `b` |

Le `% 26` (reste de la division par 26) fait « tourner » l'alphabet : après le rang 25 (`z`) revient le rang 0 (`a`).

```text
97 98 65
a c
b
True True True
```

**À retenir :** pour décaler une lettre : rang = `ord(c) - ord("a")`, nouveau rang = `(rang + decalage) % 26`, puis `chr(nouveau_rang + ord("a"))`. Pour les majuscules, même calcul avec `ord("A")`.

### Décalage négatif ou plus grand que 26

En Python, `%` renvoie toujours un résultat entre `0` et `25` quand on divise par 26, **même** pour un nombre négatif. Le même calcul marche donc pour reculer ou pour faire plusieurs tours.

```python
print(-2 % 26, 30 % 26, 52 % 26)


def decaler_minuscule(c, decalage):
    if "a" <= c <= "z":
        return chr((ord(c) - ord("a") + decalage) % 26 + ord("a"))
    return c


print(decaler_minuscule("b", -3), decaler_minuscule("b", 29), decaler_minuscule("!", 5))
```

**Pas à pas :**

1. `-2 % 26` vaut `24` (car -2 = 26 × (-1) + 24) ; `30 % 26` vaut `4` ; `52 % 26` vaut `0` (deux tours complets).
2. `"a" <= c <= "z"` teste si `c` est une lettre minuscule (son code est entre celui de `a` et celui de `z`).
3. `decaler_minuscule("b", -3)` : rang 1, 1 - 3 = -2, `-2 % 26` = 24 → `y`. On a bien reculé de 3 en passant par `a`.
4. `decaler_minuscule("b", 29)` : 1 + 29 = 30, `30 % 26` = 4 → `e`. Décaler de 29, c'est un tour complet (26) plus 3.
5. `"!"` n'est pas une lettre minuscule : on le renvoie tel quel.

Pour une majuscule, c'est le même calcul avec le test `"A" <= c <= "Z"` et `ord("A")` à la place de `ord("a")` : la lettre reste majuscule.

```text
24 4 0
y e !
```

**À retenir :** `% 26` règle tout seul les décalages négatifs et trop grands ; faire l'inverse d'un décalage `d`, c'est décaler de `-d`.

### Comparer des chaînes

Les chaînes se comparent **caractère par caractère**, selon leur code : on compare le premier caractère de chaque chaîne ; s'ils sont égaux, on passe au deuxième, et ainsi de suite. Toutes les majuscules passent avant les minuscules (`"Z" < "a"`). Pour trier sans tenir compte de la casse : `sorted(mots, key=str.lower)`.

```python
print("Bob" < "alice")
print("pomme" < "pommier")
print("ami" < "amie")
mots = ["banane", "Cerise", "abricot"]
print(sorted(mots))
print(sorted(mots, key=str.lower))
```

**Pas à pas :**

| Comparaison | Premier caractère différent | Codes | Résultat |
|---|---|---|---|
| `"Bob" < "alice"` | `B` contre `a` | 66 < 97 | True |
| `"pomme" < "pommier"` | `e` contre `i` (après `pomm`) | 101 < 105 | True |
| `"ami" < "amie"` | `"ami"` s'arrête avant | la plus courte passe devant | True |

La longueur ne compte que si l'une des chaînes est le **début** de l'autre. `sorted(mots)` met `"Cerise"` en premier (majuscule). Avec `key=str.lower`, Python compare `"banane"`, `"cerise"`, `"abricot"` en minuscules, mais garde les mots d'origine dans le résultat.

```text
True
True
True
['Cerise', 'abricot', 'banane']
['abricot', 'banane', 'Cerise']
```

**À retenir :** la comparaison s'arrête au premier caractère différent et compare leurs codes (majuscules avant minuscules) ; pour ignorer la casse, compare les versions en minuscules.

## 5. Caractères spéciaux

| Écriture | Caractère |
|---|---|
| `\n` | retour à la ligne |
| `\t` | tabulation |
| `\\` | une barre oblique inverse |
| `\"`, `\'` | un guillemet, une apostrophe |

```python
print("colonne1\tcolonne2\nligne 2")
print("C:\\dossier\\fichier.txt")
print(r"C:\dossier\nouveau.txt")
print(len("\n"))
```

Une chaîne **brute** (`r"..."`) ne traite pas les `\` : pratique pour les chemins Windows et les expressions régulières.

**Pas à pas :**

1. `\t` est **un** caractère (la tabulation), `\n` aussi (le retour à la ligne) : la première ligne affiche deux colonnes puis passe à la ligne.
2. Dans une chaîne normale, `\\` s'écrit avec deux caractères dans le code, mais n'en donne qu'**un** : `\`.
3. Dans la chaîne brute, `\d` et `\n` restent écrits tels quels : `\n` n'y est **pas** un retour à la ligne, mais deux caractères, `\` puis `n`.
4. `len("\n")` vaut `1` : `\n` est un seul caractère.

```text
colonne1	colonne2
ligne 2
C:\dossier\fichier.txt
C:\dossier\nouveau.txt
1
```

Compter les caractères, avec ou sans `r` :

```python
print(len("x\ty"), len(r"x\ty"))
print(list("x\ty"), list(r"x\ty"))
```

```text
3 4
['x', '\t', 'y'] ['x', '\\', 't', 'y']
```

Sans `r`, `\t` ne compte que pour un caractère (3 en tout). Avec `r`, `\` et `t` sont deux caractères séparés (4 en tout). Python réaffiche la barre seule `\` sous la forme `'\\'` dans une liste.

**À retenir :** dans une chaîne normale, `\` + une lettre = **un** caractère spécial ; dans une chaîne brute `r"..."`, chaque `\` est un caractère ordinaire.

## 6. Construire un texte morceau par morceau

```python
morceaux = []
for i in range(1, 4):
    morceaux.append(f"ligne {i}")
texte = "\n".join(morceaux)
print(texte)
```

**Pas à pas :** la liste vaut successivement `["ligne 1"]`, `["ligne 1", "ligne 2"]`, puis `["ligne 1", "ligne 2", "ligne 3"]`. `"\n".join(...)` met un retour à la ligne **entre** les morceaux (pas après le dernier).

```text
ligne 1
ligne 2
ligne 3
```

> [!info] Pourquoi `join` ?
> Comme une `str` n'est pas modifiable, `texte += morceau` dans une grande boucle recrée une chaîne à chaque tour. Ranger les morceaux dans une liste puis faire un seul `join` à la fin est plus rapide et plus lisible.

**À retenir :** une liste de morceaux puis un seul `sep.join(morceaux)` à la fin.

### Garder, transformer ou remplacer chaque caractère

On peut donner directement à `join` une **expression génératrice** : `"".join(... for c in texte ...)`. Elle parcourt le texte caractère par caractère.

- `if condition` à la fin **garde** seulement certains caractères ;
- `a if condition else b` au début **choisit** quoi écrire pour chaque caractère.

```python
texte = "R2-D2, 1977 !"
print("".join(c for c in texte if c.isalpha()))
print("".join(c.lower() for c in texte if c.isalnum()))
print(" ".join(c if c in "aeiou" else "." for c in "banane"))
```

**Pas à pas :**

1. On garde seulement les lettres de `"R2-D2, 1977 !"` : `R` et `D`, soit `"RD"`.
2. On garde les lettres **et** les chiffres, mis en minuscules : `r`, `2`, `d`, `2`, `1`, `9`, `7`, `7` → `"r2d21977"`. Les espaces, `-`, `,` et `!` disparaissent.
3. Pour chaque lettre de `"banane"` : voyelle → on la garde, sinon → `.` ; on obtient `.`, `a`, `.`, `a`, `.`, `e`, recollés avec un espace.

```text
RD
r2d21977
. a . a . e
```

**À retenir :** `"".join(c for c in t if test)` pour **filtrer**, `"".join(x if test else y for c in t)` pour **remplacer** caractère par caractère.

### Retourner et trier les lettres

- `t[::-1]` donne le texte à l'envers : un texte qui vaut son envers se lit pareil dans les deux sens.
- `sorted(t)` donne la **liste** des caractères rangés dans l'ordre : deux textes qui ont la même liste triée utilisent exactement les mêmes lettres, autant de fois.

```python
print("kayak"[::-1], "kayak" == "kayak"[::-1])
print("radio"[::-1], "radio" == "radio"[::-1])
print(sorted("marion"))
print(sorted("Romain"), sorted("Romain".lower()))
print(sorted("marion") == sorted("romain"), sorted("aab") == sorted("abb"))
```

**Pas à pas :**

1. `"kayak"` à l'envers donne `"kayak"` : égal, `True`. `"radio"` à l'envers donne `"oidar"` : différent, `False`.
2. `sorted("marion")` range les 6 lettres : `a, i, m, n, o, r`.
3. `sorted("Romain")` met le `R` majuscule en premier (code plus petit) : il faut passer en minuscules avant de trier pour comparer.
4. `"marion"` et `"romain"` donnent la même liste : mêmes lettres. `"aab"` et `"abb"` ont les mêmes lettres, mais pas autant de fois : listes différentes, `False`.

```text
kayak True
oidar False
['a', 'i', 'm', 'n', 'o', 'r']
['R', 'a', 'i', 'm', 'n', 'o'] ['a', 'i', 'm', 'n', 'o', 'r']
True False
```

> [!tip] Nettoyer d'abord
> Pour une phrase, enlève d'abord ce qui ne compte pas (espaces, ponctuation, majuscules) avec le filtre vu juste au-dessus, **puis** retourne ou trie le résultat.

**À retenir :** « se lit pareil dans les deux sens » = `t == t[::-1]` ; « mêmes lettres autant de fois » = `sorted(a) == sorted(b)`, après nettoyage.

### Des lettres dans un ensemble

Un **ensemble** (`set`) range des valeurs sans doublon ; `x in ensemble` teste la présence, `ensemble.add(x)` ajoute (sans rien faire si `x` y est déjà). `all(...)` vaut `True` si **toutes** les valeurs testées sont vraies.

```python
vues = set()
for lettre in "abba":
    vues.add(lettre)
print(sorted(vues), len(vues))

autorisees = {"c", "a", "f", "e"}
print(all(c in autorisees for c in "cafe"))
print(all(c in autorisees for c in "face"))
print(all(c in autorisees for c in "fee"))
print(all(c in autorisees for c in "café"))
```

**Pas à pas :**

1. On ajoute `a`, `b`, `b` (déjà là, ignoré), `a` (déjà là) : l'ensemble contient 2 lettres.
2. `"cafe"` : `c`, `a`, `f`, `e` sont toutes autorisées : `True`. `"face"` aussi : `True`.
3. `"fee"` : `f`, `e`, `e` sont autorisées (la répétition ne gêne pas) : `True`.
4. `"café"` : le `é` n'est pas dans l'ensemble, **un seul** échec suffit : `False`.

```text
['a', 'b'] 2
True
True
True
False
```

**À retenir :** `set()` pour noter des valeurs déjà vues, `x in ensemble` pour tester, `all(c in ensemble for c in mot)` pour vérifier toutes les lettres d'un mot.
