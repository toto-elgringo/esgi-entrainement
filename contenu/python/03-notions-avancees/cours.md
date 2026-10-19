# Notions avancées

Un **itérable** est tout ce qu'on peut parcourir avec `for` : liste, tuple, chaîne, ensemble, dictionnaire, `range`, fichier, générateur... Toutes les notions de ce chapitre marchent avec n'importe quel itérable.

## 1. Listes en compréhension

On construit souvent une liste à partir d'une autre séquence, avec toujours le même schéma :

```python
result = []
for v in range(10):
    if v % 2 == 0:
        result.append(-v)
print(result)
```

Python permet de l'écrire en **une seule ligne** :

```python
result = [-v for v in range(10) if v % 2 == 0]
print(result)
```

La forme générale : `[traitement(e) for e in source if test(e)]`. Se lit : « ce que je mets » `for` « d'où ça vient » `if` « la condition pour garder ». Le `if` est facultatif.

```python
line = "Il y a 3 chats et 12 chiens"
print([w.upper() for w in line.split() if w.isalpha()])

my_list = [3, -1, 0, 7, -5]
print([i for i in my_list if i > 0])
print([i ** 2 for i in range(10)])

firstnames = ["Ana", "Bob"]
lastnames = ["Diaz", "Roy"]
print([f + " " + l for f in firstnames for l in lastnames])

E = [1, 2, 3]
print([(i, j) for i in E for j in E if i < j])
```

> [!info] Plusieurs `for`
> `[... for x in A for y in B]` correspond à deux boucles imbriquées écrites dans le même ordre : `for x in A:` puis, à l'intérieur, `for y in B:`.

### Dictionnaires et ensembles en compréhension

Même idée avec des accolades : `{cle: valeur for ...}` pour un dictionnaire, `{valeur for ...}` pour un ensemble.

```python
mots = ["chat", "souris", "ours"]
print({m: len(m) for m in mots})

prix = {"pomme": 2, "kiwi": 5, "melon": 8}
print({k: v for k, v in prix.items() if v > 3})
print({v: k for k, v in prix.items()})
print({m[0] for m in mots})
```

> [!warning] Rester lisible
> Au-delà de deux `for` ou d'une condition compliquée, une boucle classique est plus claire.

## 2. Expressions génératrices

On remplace les crochets par des **parenthèses** : on obtient un **générateur**, qui calcule les valeurs **une par une, à la demande**, sans les stocker.

```python
carres = (x * x for x in range(3))
for c in carres:
    print(c)

print(sum(x * x for x in range(1_000_000)))
print(next((m for m in ["a", "abc", "abcd"] if len(m) > 2), None))
```

| | `[...]` liste | `(...)` générateur |
|---|---|---|
| Calcul | tout de suite | à la demande |
| Mémoire | stocke tout | presque rien |
| Réutilisable | oui | non, une seule fois |
| `len()`, `[i]` | oui | non |

> [!tip] Seul argument d'une fonction
> Les parenthèses du générateur peuvent alors être omises : `sum(x * x for x in l)`.

## 3. Fonctions utilitaires

- **Intermédiaires** : elles fournissent plusieurs résultats et peuvent s'enchaîner : `zip`, `map`, `filter`, `enumerate`, `sorted`, `reversed`.
- **Terminales** : elles combinent tout en un seul résultat : `any`, `all`, `min`, `max`, `sum`.

> [!warning] Des résultats « paresseux »
> `zip`, `map`, `filter`, `enumerate` et `reversed` renvoient un itérable, pas une liste. `print(map(...))` affiche `<map object ...>` : utilise `list(...)` pour voir le contenu. Ils ne se parcourent qu'**une fois**.

### zip, map, filter, enumerate

```python
a = [1, 2, 3, 4]
b = "abcd"
c = (1.5, 3.0, 4.0)
print(list(zip(a, b, c)))

noms = ["Tom", "Bob"]
notes = [12, 15]
for nom, note in zip(noms, notes):
    print(nom, note)
print(dict(zip(noms, notes)))

print(list(map(int, ["1", "2", "3"])))
print(list(map(pow, [2, 3], [10, 2])))


def est_pair(n):
    return n % 2 == 0


print(list(filter(est_pair, range(10))))

for i, fruit in enumerate(["banane", "pomme"], start=1):
    print(i, fruit)
```

- `zip` s'arrête au plus court des itérables ;
- `map(f, l)` équivaut à `(f(x) for x in l)`, avec une séquence par paramètre si `f` en prend plusieurs ;
- `filter(f, l)` équivaut à `(x for x in l if f(x))` ;
- `enumerate(l, start=0)` fournit des couples `(compteur, élément)`.

### sorted et reversed

```python
print(sorted([3, 1, 2]))
print(sorted([3, 1, 2], reverse=True))
print(sorted(["poire", "kiwi", "banane"], key=len))
print(sorted("hello"))
print(list(reversed([1, 2, 3])))

l = [3, 1, 2]
print(l.sort(), l)
```

`sorted` renvoie une **nouvelle** liste triée. `key` est une fonction qui donne le critère de tri, `reverse=True` trie en ordre décroissant.

> [!warning] `sorted(l)` ou `l.sort()` ?
> `l.sort()` trie la liste **sur place** et renvoie `None` : `l = l.sort()` détruit la liste.

### any, all, min, max, sum

```python
notes = [12, 8, 15]
print(any(n < 10 for n in notes))
print(all(n >= 10 for n in notes))
print(any([]), all([]))

print(min(notes), max(notes), sum(notes))
print(max(["aa", "b", "cccc"], key=len))
print(min([], default=0))
```

- `any` : vrai si **au moins un** élément est vrai (une suite de OU) ;
- `all` : vrai si **tous** les éléments sont vrais (une suite de ET) ;
- `min` / `max` acceptent `key` (le critère) et `default` (la valeur si l'itérable est vide, sinon `ValueError`).

> [!info] Itérable vide
> `any([])` vaut `False` et `all([])` vaut `True` : il n'y a aucun élément faux dans une liste vide.

## 4. Les fonctions lambda

Une **lambda** est une petite fonction **anonyme**, écrite en une ligne : `lambda arguments: expression`. Le résultat de l'expression est renvoyé automatiquement.

```python
mypow = lambda x, n: x ** n
print(mypow(5, 2))

lst = [3, 6, 7, 9, 10]
print(list(filter(lambda x: x % 3 == 0, lst)))
print(list(map(lambda x, y: x * y, lst, [1, 2, 3, 4, 5])))

eleves = [("Tom", 12), ("Bob", 15), ("Ana", 9)]
print(sorted(eleves, key=lambda e: e[1]))
print(max(eleves, key=lambda e: e[1]))
```

> [!warning] Limites
> Une lambda ne contient qu'**une seule expression** : pas de boucle, pas d'affectation (`x if condition else y` est permis). Le guide de style PEP 8 conseille un vrai `def` plutôt qu'une lambda rangée dans une variable : les lambdas sont faites pour être passées directement en argument.

## 5. Les fichiers

```python
fichier = open("exemple.txt", "w", encoding="utf-8")
nombre = fichier.write("première ligne\n")
fichier.write("deuxième ligne\n")
print(fichier.name, fichier.mode, fichier.closed, nombre)
fichier.close()
print(fichier.closed)

fichier = open("exemple.txt", encoding="utf-8")
print(repr(fichier.readline()))
print(repr(fichier.read()))
print(repr(fichier.read()))
fichier.close()
```

| Mode | Rôle | Si le fichier n'existe pas |
|---|---|---|
| `"r"` | lecture (par défaut) | `FileNotFoundError` |
| `"w"` | écriture, **efface** le contenu | il est créé |
| `"a"` | ajout à la fin | il est créé |
| `"rb"`, `"wb"` | lecture / écriture binaire (`bytes`) | |

- `write(texte)` renvoie le nombre de caractères écrits et **n'ajoute pas** de retour à la ligne ;
- `read()` lit tout, `read(n)` au plus `n` caractères ; `readline()` lit une ligne **avec** son `"\n"` ;
- à la fin du fichier, `read()` et `readline()` renvoient `""` ;
- `for ligne in fichier:` parcourt les lignes une par une.

> [!tip] Le `"\n"` en trop
> Chaque ligne lue garde son retour à la ligne : utilise `ligne.strip()` (ou `ligne.rstrip("\n")`) avant de la traiter.

## 6. Les context managers : `with`

Si une exception survient entre `open` et `close`, le fichier n'est jamais fermé. On pourrait écrire un `try` / `finally`, mais Python a mieux : `with` **lie la durée de vie** du fichier à un bloc. À la sortie du bloc (fin normale, `return` ou exception), le fichier est **fermé automatiquement**.

```python
with open("in.txt", "w", encoding="utf-8") as f:
    f.write("bonjour\nle monde\n")

with open("in.txt", encoding="utf-8") as file_in:
    with open("out.txt", "w", encoding="utf-8") as file_out:
        for ligne in file_in:
            file_out.write(ligne.upper())
    print(file_out.closed)
print(file_in.closed)

with open("out.txt", encoding="utf-8") as f:
    print([ligne.strip() for ligne in f])
```

> [!info] Toujours `with`
> C'est la bonne façon d'ouvrir un fichier. Les deux `with` imbriqués peuvent aussi s'écrire sur une ligne : `with open(a) as f, open(b, "w") as g:`.

### Exemple complet

```python
def compter_mots(chemin):
    compte = {}
    with open(chemin, encoding="utf-8") as f:
        for ligne in f:
            for mot in ligne.lower().split():
                compte[mot] = compte.get(mot, 0) + 1
    return compte


with open("texte.txt", "w", encoding="utf-8") as f:
    f.write("le chat et le chien\nle loup\n")

try:
    compte = compter_mots("texte.txt")
except FileNotFoundError:
    print("Fichier introuvable")
else:
    print(sorted(compte.items(), key=lambda kv: kv[1], reverse=True)[:2])
```
