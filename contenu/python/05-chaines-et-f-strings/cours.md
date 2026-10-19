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

> [!warning] Récupérer le résultat
> `texte.upper()` seul ne sert à rien : il faut ranger le résultat, `texte = texte.upper()`.

## 2. Les f-strings

Une **f-string** commence par `f` : ce qui est entre accolades est **calculé** et inséré dans le texte.

```python
nom = "Ada"
age = 36
print(f"{nom} a {age} ans")
print(f"Dans 5 ans : {age + 5} ans")
print(f"En majuscules : {nom.upper()}")
```

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

```python
articles = [("pomme", 3, 1.5), ("chocolat", 12, 30.0)]
for nom, qte, prix in articles:
    print(f"{nom:<10}{qte:>5}{prix:>8.2f}")
print(f"{'Total':<10}{'':>5}{31.5:>8.2f}")
print(f"{7:03d}", f"{0.075:.1%}", f"{1234.5:,.2f}")
```

> [!tip] Les nombres s'alignent à droite
> Par défaut, un nombre est aligné à droite et un texte à gauche. Pour des tableaux lisibles, fixe toujours la largeur des colonnes.

> [!warning] Guillemets dans une f-string
> Avant Python 3.12, on ne peut pas réutiliser le même guillemet à l'intérieur des accolades : écris `f"{d['cle']}"` (apostrophes dedans, guillemets dehors).

## 3. Les méthodes utiles

| Méthode | Rôle | Exemple | Résultat |
|---|---|---|---|
| `strip()`, `lstrip()`, `rstrip()` | enlève les espaces (ou les caractères donnés) aux bouts | `"..ok..".strip(".")` | `"ok"` |
| `lower()`, `upper()` | minuscules, majuscules | `"Ok".lower()` | `"ok"` |
| `capitalize()`, `title()` | première lettre / chaque mot en majuscule | `"le chat".title()` | `"Le Chat"` |
| `replace(a, b)` | remplace toutes les occurrences | `"banane".replace("a", "o")` | `"bonono"` |
| `count(sous)` | nombre d'occurrences | `"banane".count("an")` | `2` |
| `find(sous)` | position de la première occurrence, `-1` si absente | `"banane".find("n")` | `2` |
| `startswith(...)`, `endswith(...)` | commence / finit par | `"photo.jpg".endswith(".jpg")` | `True` |
| `isdigit()`, `isalpha()`, `isalnum()`, `isspace()` | que des chiffres / lettres / les deux / des espaces | `"42".isdigit()` | `True` |
| `split(sep, maxsplit)` | découpe | `"a=b=c".split("=", 1)` | `["a", "b=c"]` |
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

> [!tip] Nettoyer les espaces en trop
> `" ".join(texte.split())` enlève les espaces au début, à la fin, et remplace les espaces multiples par un seul.

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

Les chaînes se comparent **caractère par caractère**, selon leur code : toutes les majuscules passent avant les minuscules (`"Z" < "a"`). Pour trier sans tenir compte de la casse : `sorted(mots, key=str.lower)`.

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

## 6. Construire un texte morceau par morceau

```python
morceaux = []
for i in range(1, 4):
    morceaux.append(f"ligne {i}")
texte = "\n".join(morceaux)
print(texte)
```

> [!info] Pourquoi `join` ?
> Comme une `str` n'est pas modifiable, `texte += morceau` dans une grande boucle recrée une chaîne à chaque tour. Ranger les morceaux dans une liste puis faire un seul `join` à la fin est plus rapide et plus lisible.
