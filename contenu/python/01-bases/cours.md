# Les bases de Python

## 1. Python en bref

Python est un langage :

- **interprété** : un programme, l'interpréteur, lit ton fichier `.py` et l'exécute directement. Pas d'étape de compilation, et le même fichier tourne sur Windows, Linux ou macOS ;
- **multi-paradigmes** : on peut écrire des suites d'instructions rangées dans des fonctions (style impératif) ou des classes (style objet, chapitre 4) ;
- à **typage dynamique fort** : on ne déclare pas les types, ils sont décidés à l'exécution. « Fort » : Python refuse de mélanger des types incompatibles (`"3" + 4` est une erreur) ;
- à **gestion automatique de la mémoire** : pas de `malloc` ni de `free`, un ramasse-miettes libère ce qui ne sert plus.

Créé par Guido van Rossum (première ébauche à Noël 1989, version publique en 1991). **Python 3** (2008) n'est pas compatible avec Python 2 : tout le cours est en Python 3.

On s'en sert pour les **scripts** (automatiser des tâches), les **plugins**, le **prototypage** et le **web**.

## 2. La syntaxe

```python
def facto(x):
    if x < 2:
        return 1
    else:
        return x * facto(x - 1)


print(facto(5))
```

- **Une instruction par ligne**, pas de point-virgule.
- Les **blocs** se font par **indentation** (4 espaces), pas avec des accolades. Une ligne qui ouvre un bloc (`def`, `if`, `for`, `while`...) se termine par `:`.
- Les **commentaires** commencent par `#`.
- Les **noms** commencent par une lettre ou `_`, puis lettres, chiffres et `_`. La casse compte (`age` et `Age` sont différents).

> [!warning] L'indentation a un sens
> Une ligne décalée au mauvais niveau change de bloc. Un décalage incohérent donne une `IndentationError`. Ne mélange jamais tabulations et espaces.

> [!tip] Conventions de nommage (PEP 8)
> Variables et fonctions en `snake_case`, classes en `CamelCase`, constantes en `MAJUSCULES`.

## 3. Types simples et typage dynamique

| Type | Contenu | Exemple |
|---|---|---|
| `int` | entier de taille illimitée | `a = 1` |
| `float` | nombre à virgule | `b = 1.4` |
| `bool` | `True` ou `False` (avec majuscule) | `c = True` |
| `str` | texte, **non modifiable** | `d = "Hello"` |

```python
a = 1
print(type(a))
a = 4.2
print(type(a))
print(2 ** 100)

d, e = "toto", False
d, e = e, d
print(d, e)
```

Une variable n'a pas de type : c'est la **valeur** qu'elle contient qui en a un. `d, e = e, d` échange deux valeurs sans variable temporaire.

## 4. Opérateurs

| Opération | Exemple | Résultat |
|---|---|---|
| `+`, `-`, `*` | `10 + 4`, `10 - 4`, `10 * 4` | `14`, `6`, `40` |
| `/` division | `10 / 4` | `2.5` |
| `//` quotient | `10 // 4` | `2` |
| `%` reste | `10 % 4` | `2` |
| `**` puissance | `10 ** 4` | `10000` |

```python
print(10 / 2)
print(10 // 2.5)
print(-7 // 2, -7 % 2)
print(0.1 + 0.2)
```

> [!warning] Pièges
> - `/` donne **toujours** un `float` : `10 / 2` vaut `5.0`.
> - `//` donne un `float` dès qu'un des nombres est un `float` : `10 // 2.5` vaut `4.0`.
> - `//` arrondit vers le bas : `-7 // 2` vaut `-4`.
> - Les `float` sont approximatifs : `0.1 + 0.2` ne vaut pas exactement `0.3`.

## 5. Conditions

```python
a = -3
if a == 0:
    print("nul")
elif a > 0:
    print("positif")
else:
    print("négatif")
```

| Comparaison | Sens | Logique | Sens |
|---|---|---|---|
| `==`, `!=` | égal, différent | `and` | ET |
| `<`, `<=`, `>`, `>=` | ordre | `or` | OU |
| `x in l`, `x not in l` | appartenance | `not` | NON |

Tout objet peut servir de condition : il est **faux** s'il est nul (`0`, `0.0`, `None`, `False`) ou **vide** (`""`, `[]`, `()`, `{}`, `set()`), et vrai sinon.

```python
for valeur in [0, 3, "", "a", [], [0], None]:
    if valeur:
        print(repr(valeur), "est vrai")
    else:
        print(repr(valeur), "est faux")

note = 14
print(0 <= note <= 20)
```

> [!tip] Court-circuit
> `and` s'arrête au premier faux, `or` au premier vrai : `if l and l[0] == 5:` ne plante pas sur une liste vide.

## 6. Boucles

`while` répète **tant qu'une condition est vraie**, `for` parcourt **les éléments** d'une séquence.

```python
l = [1, 2, 3, 4]
while l:
    print(l)
    l = l[1::2]

for i in range(3):
    print("tour", i)

for lettre in "abc":
    print(lettre)
```

| `range(...)` | Valeurs |
|---|---|
| `range(5)` | 0, 1, 2, 3, 4 (fin **exclue**) |
| `range(2, 6)` | 2, 3, 4, 5 |
| `range(0, 10, 3)` | 0, 3, 6, 9 |
| `range(5, 0, -1)` | 5, 4, 3, 2, 1 |

`continue` passe directement au tour suivant, `break` sort de la boucle.

```python
for lettre in "Hello world !":
    if lettre == "o":
        continue
    print(lettre, end="")
print()

for lettre in "Hello world !":
    if lettre == "o":
        break
    print(lettre, end="")
print()
```

## 7. Fonctions et console

```python
def aire_rectangle(largeur, hauteur):
    """Renvoie l'aire d'un rectangle."""
    return largeur * hauteur


print(aire_rectangle(3, 4))
print("a", "b", 3, sep=" - ")
```

- La **docstring** (texte entre triples guillemets sous `def`) explique la fonction : ce qu'elle fait, ses paramètres, ce qu'elle renvoie.
- Sans `return`, une fonction renvoie `None`.
- `print(a, b)` affiche plusieurs valeurs séparées par un espace.
- `input()` lit une ligne tapée au clavier et renvoie **toujours une `str`** : `age = int(input())` pour un entier.

> [!warning] `input()` et les nombres
> `input()` renvoie `"42"`, pas `42`. Sans `int(...)`, `"42" + 1` lève une `TypeError`. Si le texte n'est pas un nombre, `int("abc")` lève une `ValueError`.

## 8. Les listes

Pas de tableaux en Python : on utilise `list`, qui grandit, rétrécit, se découpe et se concatène.

```python
l = [10, 20, 30, 40, 50]
print(l[0], l[-1], l[-2])
l[2] = 5
print(l, len(l))

print(list(range(5)), list("hello"))

l.append(60)
l.insert(0, 0)
dernier = l.pop()
print(l, dernier)
print(30 in l, [1, 2] + [3], [0] * 3)
```

On crée une liste de trois façons : en écrivant ses valeurs (`[1, 2, 3]`, un **littéral**), à partir d'un autre itérable (`list(range(5))`, `list("abc")`), ou avec une compréhension (chapitre 3).

### Les méthodes des listes

Elles **modifient la liste** elle-même (on dit « sur place ») et, sauf `pop` et `index`, renvoient `None`.

| Méthode | Effet | Avec `l = [1, 2, 3]` |
|---|---|---|
| `l.append(x)` | ajoute **un** élément à la fin | `l.append(4)` → `[1, 2, 3, 4]` |
| `l.extend(it)` | ajoute **chaque** élément d'un itérable | `l.extend("hi")` → `[1, 2, 3, 'h', 'i']` |
| `l.insert(i, x)` | insère `x` à l'indice `i` (à la fin si `i` est trop grand) | `l.insert(1, 10)` → `[1, 10, 2, 3]` |
| `l.pop()`, `l.pop(i)` | retire et **renvoie** le dernier, ou celui d'indice `i` | `l.pop(0)` renvoie `1` |
| `l.remove(x)` | retire la **première** occurrence de `x` (`ValueError` si absent) | `l.remove(2)` → `[1, 3]` |
| `l.index(x, debut, fin)` | position de la première occurrence, cherchée entre `debut` et `fin` (`ValueError` si absent) | `l.index(3)` vaut `2` |
| `l.count(x)` | nombre d'occurrences | `l.count(1)` vaut `1` |
| `l.sort()` | trie sur place | |
| `l.clear()` | vide la liste | `[]` |

```python
l = [1, 2, 3, 4, 5, 6]
del l[0]
del l[-1]
del l[1::2]
print(l)

try:
    l.remove(42)
except ValueError:
    print("42 n'est pas dans la liste")

notes = [12, 8, 15]
print(sum(notes), min(notes), max(notes))

grille = [0] * 5
print(grille)
```

`del` supprime un élément **ou une tranche entière** : `del l[1::2]` retire tous les éléments d'indice impair en une instruction.

> [!warning] `append` ou `extend` ?
> `l.append([4, 5])` ajoute **une** case qui contient une liste : `[1, 2, 3, [4, 5]]`. `l.extend([4, 5])` (ou `l += [4, 5]`) ajoute deux cases. Et `+` ne marche qu'entre deux listes : `[1, 2] + 3` lève une `TypeError`, il faut `[1, 2] + [3]`.

Pour parcourir **deux listes en même temps**, rang par rang, on utilise `zip` (détaillé au chapitre 3) :

```python
noms = ["Ana", "Tom", "Eva"]
notes = [14, 9, 17]
for nom, note in zip(noms, notes):
    print(nom, note)
```

### Les tranches `[début:fin:pas]`

Le début est **inclus**, la fin **exclue**.

```python
l = [1, 2, 3, 4, 5]
print(l[1:4])
print(l[:4])
print(l[2:])
print(l[::2])
print(l[::-1])
print(l[-3:])
```

```anim
decoupage
```

> [!warning] `l2 = l` ne copie pas
> Les deux noms désignent **la même** liste : modifier l'une modifie « l'autre ». Pour une vraie copie : `l[:]`, `list(l)` ou `l.copy()`.

```python
a = [1, 2]
b = a
b.append(3)
print(a)
c = a[:]
c.append(4)
print(a, c)
```

```anim
references
scenario: alias
titre: Deux noms, une seule liste
```

## 9. Les chaînes

Pas de type `char` : un caractère est une `str` de longueur 1. Une `str` est **non modifiable** : `s[0] = "J"` lève une `TypeError`, on fabrique une nouvelle chaîne à la place.

```python
s = "Hello World"
print(s[0], s[-1], len(s))
print(s[1:4], s[:5], s[6:], s[::-1])
print("World" in s)
print("hi" * 3, "Hello " + "!")

s = "J" + s[1:]
print(s)

texte = """Plusieurs
lignes"""
print(texte)
```

### Découper, relier, formater

```python
mots = "Hello World".split()
print(mots)
print("Hello World".split("o"))
print("-".join(["A", "B", "C"]))

print("j'ai %d pommes" % 5)
print("%s a %d ans" % ("Ben", 20))
print("%.2f euros" % 1.4)

prix = 1.4
print(f"{prix:.2f} euros")
```

| Marqueur `%` | Pour |
|---|---|
| `%d` | un entier |
| `%f`, `%.2f` | un flottant (6 ou 2 décimales) |
| `%s` | n'importe quoi converti en texte |

> [!tip] f-strings
> `f"{nom} a {age} ans"` écrit les valeurs directement dans le texte : c'est la façon moderne, plus lisible que `%`.

### Les méthodes les plus courantes

Elles renvoient une **nouvelle** valeur : la chaîne d'origine ne change jamais.

| Méthode | Rôle | Exemple | Résultat |
|---|---|---|---|
| `upper()`, `lower()` | majuscules, minuscules | `"Salut".upper()` | `"SALUT"` |
| `capitalize()`, `title()` | majuscule à la première lettre / à chaque mot | `"le chat".title()` | `"Le Chat"` |
| `startswith(p)`, `endswith(s)` | commence / finit par | `"Hello".startswith("He")` | `True` |
| `find(sous)` | position de la première occurrence, **`-1`** si absente | `"hello".find("l")` | `2` |
| `replace(a, b)` | remplace toutes les occurrences | `"Mr X et Mr Y".replace("Mr", "Dr")` | `"Dr X et Dr Y"` |
| `isdigit()`, `isalpha()`, `isalnum()` | que des chiffres / des lettres / les deux | `"Naruto93".isalnum()` | `True` |
| `isupper()`, `islower()` | toutes les lettres sont en majuscules / minuscules | `"hello world".islower()` | `True` |
| `strip()` | enlève les espaces aux deux bouts | `"  ok ".strip()` | `"ok"` |

```python
print("hello world".isalpha())
print("a1".islower())
print("hello".find("X"))
print("Hello World".endswith("world"))
```

> [!warning] Pièges
> - `isalpha()` est faux dès qu'il y a un espace : `"hello world".isalpha()` vaut `False`.
> - `islower()` et `isupper()` ne regardent **que les lettres** : `"a1".islower()` vaut `True`.
> - Tout est sensible à la casse : `"Hello World".endswith("world")` vaut `False`.

Le chapitre 5 détaille toutes ces méthodes et les f-strings.

## 10. Les tuples

Un tuple est une liste **non modifiable**.

```python
t = (1, 2, 3)
un_seul = ("one",)
print(type(un_seul), type(("one")))

a, b, c = t
print(a, b, c)

t = (1, 2, 3, 4, 5, 6, 7, 8)
premier, deuxieme, *reste = t
*debut, avant_dernier, dernier = t
print(premier, reste)
print(debut, dernier)
```

> [!warning] La virgule fait le tuple
> `("one")` est juste une chaîne. Il faut `("one",)`. Et `*reste` reçoit une **liste**, même si on déballe un tuple.

## 11. Les ensembles

Un `set` contient des éléments **uniques**, **sans ordre** ni position.

```python
s = {1, 2, 4, 4}
print(s, len(s))
print(set("hello"))
vide = set()
print(type(vide), type({}))

a = {0, 1, 2, 3}
b = {2, 3, 4}
print(a & b, a | b, a - b, a ^ b)

print({1, 2, 3}.isdisjoint([4, 5]))
print({1, 2}.issubset([1, 2, 3]))
print(set("01").issuperset("100101"))
```

| Question | Méthode |
|---|---|
| `x` ne contient **aucun** élément de `s` ? | `s.isdisjoint(x)` |
| `x` contient **tous** les éléments de `s` ? | `s.issubset(x)` |
| `x` ne contient **que** des éléments de `s` ? | `s.issuperset(x)` |

### Modifier un ensemble

| Méthode | Effet |
|---|---|
| `s.add(x)` | ajoute **un** élément (rien ne change s'il y est déjà) |
| `s.update(it)` | ajoute chaque élément d'un itérable |
| `s.remove(x)` | retire `x`, **`KeyError`** s'il n'y est pas |
| `s.discard(x)` | retire `x` s'il y est, sinon ne fait rien |
| `s.pop()` | retire et renvoie un élément **au hasard** |
| `s.difference_update(it)` | retire tous les éléments d'un itérable |
| `s.clear()` | vide l'ensemble |

```python
s = {1, 2, 3}
s.add(4)
s.add(1)
s.update([2, 6])
s.discard(99)
s.difference_update([1, 2])
print(s)

print(sorted({5, 2, 3, 1}))
print(sum({5, 2, 1}), min({5, 2, 1}), max({5, 2, 1}))
```

Un ensemble n'a pas d'ordre : pour l'afficher trié, `sorted(s)` renvoie une **liste** triée.

> [!warning] Pièges
> - `{}` est un **dictionnaire** vide : l'ensemble vide s'écrit `set()`.
> - `s.update(t)` modifie `s` et renvoie `None` : pour un nouvel ensemble, `s | t` ou `s.union(t)`.
> - Un set ne contient que des valeurs non modifiables (pas de liste dedans).

## 12. Les dictionnaires

Un `dict` associe une **clé** à une **valeur**. Un couple clé-valeur s'appelle un **item**.

```python
d = {"a": 1, "b": 2}
d["c"] = 4
d["a"] = 10
print(d, len(d))
print("a" in d, 1 in d)

print(d.get("z", 0))
d.update({"b": 33, "x": 32})
print(d)

valeur = d.pop("c")
print(valeur, d.pop("absent", 0))
del d["x"]

try:
    d.pop("absent")
except KeyError:
    print("pas de clé absent")

for cle, valeur in d.items():
    print(cle, valeur)
print(list(d.keys()), list(d.values()))

compte = {}
for mot in "le chat et le chien".split():
    compte[mot] = compte.get(mot, 0) + 1
print(compte)

d.clear()
print(d)
```

> [!info] À retenir
> - `in` teste les **clés**, pas les valeurs.
> - `for cle, valeur in d.items():` est plus clair que `for cle in d:` suivi de `d[cle]`.
> - `d[cle]` lève une `KeyError` si la clé n'existe pas ; `d.get(cle, defaut)` jamais.
> - Les clés doivent être non modifiables (`str`, `int`, `tuple`).
> - Depuis Python 3.7, un dictionnaire garde l'ordre d'insertion.

## 13. Structurer un programme

```python
def saluer(nom):
    return "Bonjour " + nom


def main():
    print(saluer("Ada"))


if __name__ == "__main__":
    main()
```

`__name__` vaut `"__main__"` quand le fichier est **lancé directement**, et le nom du module quand il est **importé**. Ainsi, `main()` ne se lance pas quand un autre fichier importe `saluer`.

> [!info] Dans les exercices
> Le site **importe** ton code pour le tester : ce qui affiche ou lit au clavier doit être sous `if __name__ == "__main__":`.

- **Module** : un fichier `.py`. **Package** : un dossier de modules avec un fichier `__init__.py`.
- Trois façons d'importer : `import sound.formats.wav` (puis `sound.formats.wav.read()`), `from sound.formats import wav` (puis `wav.read()`), `from sound.formats.wav import read` (puis `read()`).

```python
import math
from random import randint

print(math.sqrt(16), math.pi)
print(1 <= randint(1, 6) <= 6)
```
