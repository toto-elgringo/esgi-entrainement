# Fonctions avancées

## 1. Les paramètres

### Passage par référence

Une fonction reçoit une **référence** vers l'objet donné en argument, pas une copie. Si l'objet est **modifiable** (liste, dictionnaire, ensemble), la fonction peut le changer, et ça se voit à l'extérieur.

```python
def ajoute_zero(l):
    l.append(0)


def double(n):
    n = n * 2


nombres = [1, 2]
ajoute_zero(nombres)
print(nombres)

x = 5
double(x)
print(x)
```

> [!info] La règle
> **Modifier** l'objet reçu (`l.append(...)`, `d[cle] = ...`) se voit dehors. **Réaffecter** le paramètre (`n = ...`) ne change que la variable locale. Les `int`, `str` et `tuple` ne sont pas modifiables : une fonction ne peut pas les changer.

```anim
references
scenario: fonctions
```

### Valeurs par défaut et mots-clés

```python
def foo(a, b=4, c="toto"):
    print(a, b, c)


foo(2, 3)
foo(0)
foo(1, 42, "truc")
foo(c="truc", a=1)
foo(1, c="fin")
```

- Les paramètres avec une valeur par défaut se placent **après** ceux qui n'en ont pas.
- À l'appel, on peut nommer les arguments (**par mot-clé**) : l'ordre ne compte plus. Les arguments par position viennent toujours **avant** ceux par mot-clé.

> [!warning] Jamais de liste comme valeur par défaut
> La valeur par défaut est créée **une seule fois**, quand Python lit le `def`. Une liste par défaut est donc partagée entre tous les appels.

```python
def ajoute_mauvais(x, l=[]):
    l.append(x)
    return l


def ajoute(x, l=None):
    if l is None:
        l = []
    l.append(x)
    return l


print(ajoute_mauvais(1), ajoute_mauvais(2))
print(ajoute(1), ajoute(2))
```

```anim
references
scenario: defaut
titre: La liste par défaut partagée
```

### Paramètres nommés obligatoires

Un paramètre placé **après** `*args`, ou après un `*` seul, ne peut être donné **que par mot-clé**. On s'en sert pour les options : l'appel devient lisible, et on ne peut pas les confondre avec les valeurs.

```python
def puissances(*nombres, exposant=2):
    return [x ** exposant for x in nombres]


def chercher(texte, motif, *, ignorer_casse=False):
    if ignorer_casse:
        texte, motif = texte.lower(), motif.lower()
    return motif in texte


print(puissances(1, 2, 3), puissances(1, 2, 3, exposant=3))
print(chercher("Python", "PY", ignorer_casse=True))
try:
    chercher("Python", "PY", True)
except TypeError as e:
    print("Refusé :", e)
```

> [!warning] Le nom d'un paramètre fait partie de la fonction
> Dès qu'on appelle par mot-clé, une faute de frappe dans la définition (`subtitute` au lieu de `substitute`) fait planter l'appel avec une `TypeError`. Et n'appelle jamais un paramètre `pow`, `sum` ou `max` : dans la fonction, il cache la fonction intégrée du même nom.

### Renvoyer plusieurs valeurs

`return a, b` renvoie le **tuple** `(a, b)`. L'appelant le déballe directement dans plusieurs variables. `divmod(a, b)` fait la même chose : il renvoie le quotient et le reste.

```python
def vers_hms(total):
    minutes, secondes = divmod(total, 60)
    heures, minutes = divmod(minutes, 60)
    return heures, minutes, secondes


h, m, s = vers_hms(4203)
print(h, m, s)
print(vers_hms(59))
```

> [!tip] Penser au cas vide
> Avant de renvoyer « le plus petit » ou « la position du maximum », demande-toi ce qui se passe avec une liste vide. Renvoyer `(0, 0)` serait faux : mieux vaut lever `ValueError("liste vide")`, comme le fait `min([])`.

## 2. Nombre variable d'arguments

- `*args` récupère les arguments **par position** en trop, dans un **tuple** ;
- `**kwargs` récupère les arguments **par mot-clé** inconnus, dans un **dict**.

```python
def foo(x=0, *args):
    print("x :", x, "args :", args)


def bar(x=0, **kwargs):
    print("x :", x, "kwargs :", kwargs)


foo()
foo(1, 2, 3)
bar(a="A", b="B")
bar(a="A", x="X")
```

L'ordre dans la définition est toujours : paramètres normaux, `*args`, `**kwargs`. Les noms `args` et `kwargs` sont une convention, ce sont les étoiles qui comptent.

À l'appel, les étoiles font l'inverse : elles **déballent** une liste en arguments par position, un dictionnaire en arguments par mot-clé.

```python
def point(x, y, z):
    return x + y + z


coords = [1, 2, 3]
options = {"x": 10, "y": 20, "z": 30}
print(point(*coords), point(**options))
```

## 3. Fonctions internes

Une fonction peut être définie **dans** une autre : elle n'existe que dans la fonction englobante, et elle peut lire ses variables.

```python
def pow_and_add_list(n, p, a):
    l = []

    def pow_and_add(x):
        return x ** p + a

    for i in range(n + 1):
        l.append(pow_and_add(i))
    return l


print(pow_and_add_list(3, 2, 1))
```

> [!tip] `nonlocal`
> La fonction interne peut **lire** les variables englobantes. Pour les **réaffecter**, il faut écrire `nonlocal nom_de_la_variable` dans la fonction interne.

## 4. Les fonctions sont des objets

Une fonction est une valeur comme une autre : on peut la ranger dans une variable, la passer en paramètre, la renvoyer. Son nom **sans parenthèses** désigne la fonction ; **avec** parenthèses, on l'exécute.

```python
display = print
display("hello world")


def appliquer(l, func):
    res = []
    for x in l:
        res.append(func(x))
    return res


elems = ["4", 45, 3.2]
print(appliquer(elems, int))
print(appliquer(elems, float))
print(appliquer(elems, str))
```

> [!warning] Ne pas écraser les noms intégrés
> Appeler sa fonction `map`, `list`, `sum` ou `input` masque la fonction de Python du même nom. Choisis un autre nom.

### Les closures

Une fonction interne **renvoyée** garde en mémoire les variables de la fonction qui l'a créée : c'est une **closure** (fermeture).

```python
def create_adder(n):
    def adder(x):
        return x + n
    return adder


plus1 = create_adder(1)
plus10 = create_adder(10)
print(plus1(24), plus10(24))


def compteur():
    total = 0

    def suivant():
        nonlocal total
        total += 1
        return total
    return suivant


c = compteur()
print(c(), c(), c())
```

## 5. Les décorateurs

Un **décorateur** est une fonction qui reçoit une fonction, et renvoie une nouvelle fonction (l'**enveloppe**, *wrapper*) qui fait des choses **avant et/ou après** l'originale.

```python
def decor(func):
    def wrapper(*args, **kwargs):
        print("Avant")
        res = func(*args, **kwargs)
        print("Après")
        return res
    return wrapper


@decor
def addition(a, b):
    return a + b


print(addition(2, 3))
```

- `@decor` au-dessus de `def addition` équivaut à écrire `addition = decor(addition)` après la définition.
- `*args, **kwargs` dans le wrapper permettent de décorer **n'importe quelle** fonction, quels que soient ses paramètres : on les retransmet tels quels.

### Décorateur avec paramètre

Pour écrire `@decor("debug")`, on ajoute une couche : la fonction extérieure reçoit le paramètre et renvoie le vrai décorateur.

```python
def decor(param):
    def inner_decor(func):
        def wrapper(*args, **kwargs):
            print("Avant, avec :", param)
            res = func(*args, **kwargs)
            print("Après")
            return res
        return wrapper
    return inner_decor


@decor("debug")
def carre(x):
    return x * x


print(carre(4))
```

> [!tip] Un décorateur peut garder des informations
> Une fonction est un objet : on peut lui ajouter des attributs. `wrapper.appels = 0` dans le décorateur, puis `wrapper.appels += 1` à chaque appel, permet de compter les appels.

### Garder le nom : `functools.wraps`

Sans précaution, la fonction décorée **est** le wrapper : elle s'appelle `wrapper` et perd sa docstring (gênant dans les messages d'erreur et dans `help()`). `@functools.wraps(func)` recopie le nom et la docstring de `func` sur le wrapper.

```python
import functools


def bavard(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print("Appel de", func.__name__, args, kwargs)
        return func(*args, **kwargs)
    return wrapper


@bavard
def aire(largeur, hauteur=1):
    """Aire d'un rectangle."""
    return largeur * hauteur


print(aire(3, hauteur=2))
print(aire.__name__, ":", aire.__doc__)
```

> [!warning] Un wrapper sans paramètres
> `def wrapper():` ne marche qu'avec des fonctions **sans** paramètre. Prends l'habitude d'écrire `def wrapper(*args, **kwargs):` et `func(*args, **kwargs)` : ton décorateur marchera partout.

### Empiler des décorateurs

Plusieurs décorateurs s'appliquent **de bas en haut** : le plus proche du `def` enveloppe la fonction en premier.

```python
def majuscules(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs).upper()
    return wrapper


def entre_crochets(func):
    def wrapper(*args, **kwargs):
        return "[" + func(*args, **kwargs) + "]"
    return wrapper


@entre_crochets
@majuscules
def saluer(nom):
    return "salut " + nom


print(saluer("ada"))
```

Ici, `saluer = entre_crochets(majuscules(saluer))` : d'abord les majuscules, ensuite les crochets.

### Un décorateur tout fait : le cache

Une fonction **récursive** s'appelle elle-même. C'est naturel pour Fibonacci, mais la version directe recalcule sans cesse les mêmes valeurs : `fibo(30)` fait plus d'un million d'appels. Un **cache** (mémoïsation) retient chaque résultat déjà calculé ; `functools.lru_cache` le fait pour nous.

```python
from functools import lru_cache


@lru_cache(maxsize=None)
def fibo(n):
    if n < 0:
        raise ValueError("n doit être positif")
    if n < 2:
        return n
    return fibo(n - 1) + fibo(n - 2)


print(fibo(100))
print(fibo.cache_info())
```

> [!info] Récursif ou boucle ?
> La récursion est lisible, mais chaque appel s'empile : au-delà d'environ 1000 niveaux, Python lève `RecursionError`. Pour Fibonacci, une boucle `a, b = b, a + b` est aussi simple et sans limite. Le cache ne marche qu'avec des arguments **hachables** (nombres, textes, tuples), pas avec des listes.

## 6. Les co-routines : `yield`

Une **co-routine** est une fonction qui, au lieu de se terminer quand elle fournit un résultat, se **met en pause**, et reprend plus tard **là où elle s'était arrêtée**. Le mot-clé `yield` remplace `return` : il fournit une valeur et met la fonction en pause.

```python
def pows(n, p):
    """Fournit les valeurs de 1 à n, à la puissance p."""
    for i in range(1, n + 1):
        yield i ** p


for x in pows(3, 2):
    print(x)
```

Déroulé : la boucle demande une valeur, `pows` démarre et fournit `1`, puis se met en pause. La boucle affiche `1` et redemande : `pows` reprend après le `yield`, fournit `4`... Quand `pows` se termine, la boucle s'arrête.

```python
def pows(n, p):
    for i in range(1, n + 1):
        yield i ** p


g = pows(2, 3)
print(next(g))
print(next(g))
try:
    next(g)
except StopIteration:
    print("plus de valeurs")
print(list(pows(4, 1)))


def entiers():
    n = 0
    while True:
        yield n
        n += 1


for n in entiers():
    if n > 3:
        break
    print(n)
```

> [!info] Générateur
> Appeler `pows(3, 2)` n'exécute rien : cela crée un **générateur**. Chaque `next()` avance jusqu'au `yield` suivant ; à la fin, `StopIteration` est levée (la boucle `for` s'en occupe). Les valeurs sont produites **une par une, sans être stockées** : idéal pour de grandes ou d'infinies suites de valeurs.

> [!warning] Un générateur ne sert qu'une fois
> Une fois parcouru, il est épuisé : un deuxième `for` ne donne plus rien. Rappelle la fonction pour en avoir un nouveau. Si ton générateur reçoit un itérable qu'il doit parcourir **plusieurs fois**, copie-le d'abord : `elements = list(iterable)`.

### Le code ne démarre qu'au premier `next`

Appeler une fonction qui contient `yield` n'exécute **aucune** ligne de son corps, même pas les vérifications du début. Une erreur n'apparaît qu'au moment du parcours, parfois bien plus loin dans le programme. Pour vérifier les paramètres **dès l'appel**, on sépare : une fonction normale vérifie, puis renvoie le générateur.

```python
def compte(n):
    if n < 0:
        raise ValueError("n négatif")
    yield from range(n)


gen = compte(-1)
print("Aucune erreur pour l'instant")


def compte_sur(n):
    if n < 0:
        raise ValueError("n négatif")
    return _compte(n)


def _compte(n):
    yield from range(n)


try:
    compte_sur(-1)
except ValueError as e:
    print("Erreur dès l'appel :", e)
```

### Déléguer : `yield from`

`yield from autre` fournit une par une toutes les valeurs de `autre` (un itérable ou un autre générateur). C'est un raccourci pour `for x in autre: yield x`, très pratique pour les générateurs **récursifs**.

```python
def aplatir(liste):
    for element in liste:
        if isinstance(element, list):
            yield from aplatir(element)
        else:
            yield element


print(list(aplatir([1, [2, [3, 4]], 5])))
```

### Un générateur garde son état

Entre deux `yield`, les variables locales sont conservées : un générateur peut compter, se souvenir de ce qu'il a déjà vu, garder une fenêtre des derniers éléments... tout en marchant sur un flux **infini**.

```python
from collections import deque
from itertools import count, islice


def derniers(iterable, n):
    fenetre = deque(maxlen=n)
    for element in iterable:
        fenetre.append(element)
        if len(fenetre) == n:
            yield tuple(fenetre)


print(list(islice(derniers(count(), 3), 4)))
```

> [!tip] `deque` plutôt que `pop(0)`
> `liste.pop(0)` décale tous les éléments à chaque fois. Une `deque(maxlen=n)` (file à deux bouts) jette toute seule le plus ancien quand elle est pleine, et `popleft()` est immédiat.

> [!warning] Une boucle infinie qui ne fournit rien
> `while True: for x in elements: yield x` bloque le programme pour toujours si `elements` est vide : aucun `yield` n'est jamais atteint. Ajoute `if not elements: return` avant la boucle.

### Le module `itertools`

Il contient des générateurs tout faits :

| Outil | Fournit | Exemple |
|---|---|---|
| `count(debut)` | `debut`, `debut + 1`, ... sans fin | `count(5)` → 5, 6, 7... |
| `cycle(it)` | les éléments de `it` en boucle | `cycle("ab")` → a, b, a, b... |
| `islice(it, n)` | les `n` premiers éléments | `islice(count(), 3)` → 0, 1, 2 |
| `chain(a, b)` | `a` puis `b` | `chain("ab", [1])` → a, b, 1 |
| `accumulate(it)` | les sommes cumulées | `accumulate([1, 2, 3])` → 1, 3, 6 |
| `product(it, repeat=k)` | toutes les suites de `k` éléments | `product("ab", repeat=2)` → aa, ab, ba, bb |
| `combinations(it, k)` | les groupes de `k` éléments distincts, sans ordre | `combinations("abc", 2)` → ab, ac, bc |
| `groupby(it, key)` | les paquets d'éléments **consécutifs** de même clé | trier avant ! |

```python
from itertools import combinations, groupby, islice, product, cycle

print(list(islice(cycle("ab"), 5)))
print(["".join(p) for p in product("01", repeat=3)])
print(list(combinations([1, 2, 3], 2)))
mots = sorted(["bus", "avion", "bateau"], key=lambda m: m[0])
print({lettre: list(groupe) for lettre, groupe in groupby(mots, key=lambda m: m[0])})
```

## 7. Les exceptions

Quand quelque chose est incorrect (conversion impossible, mauvais type, fichier absent...), Python **lève une exception** : le programme s'arrête, sauf si on l'**intercepte**.

| Exception | Situation |
|---|---|
| `OSError` (anciennement `IOError`) | erreur d'entrée/sortie, ex. `FileNotFoundError` |
| `ArithmeticError` | erreur de calcul, ex. `ZeroDivisionError` |
| `LookupError` | indice ou clé introuvable : `IndexError`, `KeyError` |
| `ValueError` | bon type, mauvaise valeur : `int("abc")` |
| `TypeError` | mauvais type : `"a" + 1` |

```python
def division(a, b):
    try:
        resultat = a / b
    except ZeroDivisionError as e:
        print("Erreur :", e)
    except (TypeError, ValueError):
        print("Il faut des nombres")
    else:
        print("Résultat :", resultat)
    finally:
        print("Fin du calcul")


division(10, 4)
division(1, 0)
division("a", 2)
```

- `except Type:` n'est exécuté que pour ce type d'exception (ou ses sous-types : `except LookupError` attrape aussi `KeyError`) ;
- `as e` donne accès à l'exception (son message) ;
- un **tuple** intercepte plusieurs types ;
- `else` : seulement si **aucune** exception n'a été levée ;
- `finally` : **toujours** exécuté, même après un `return`.

### Lever une exception

```python
def need_positive_number(n):
    if n < 0:
        raise ValueError("need to be positive")
    return n


try:
    need_positive_number(-3)
except ValueError as e:
    print("Refusé :", e)


class SoldeInsuffisant(Exception):
    pass


try:
    raise SoldeInsuffisant("solde trop bas")
except SoldeInsuffisant as e:
    print(type(e).__name__, ":", e)
```

> [!warning] Intercepter précisément
> Un `except:` sans type attrape **toutes** les erreurs, y compris tes propres fautes de frappe, qui deviennent invisibles. Intercepte seulement les exceptions que tu sais gérer, et garde le `try` le plus court possible.

### Vérifier les arguments et transformer une erreur

Une fonction qui reçoit des données de l'extérieur vérifie souvent leur **type** et leur **valeur** avant de calculer. Deux détails à connaître :

```python
print(isinstance(True, int))
print(type(True) is int)


def vers_reel(valeur):
    try:
        return float(valeur)
    except (TypeError, ValueError) as erreur:
        raise TypeError("pas un nombre : %r" % (valeur,)) from erreur


try:
    vers_reel("abc")
except TypeError as e:
    print(e, "| cause :", type(e.__cause__).__name__)
```

- `bool` est une sorte d'`int` : `isinstance(True, int)` vaut `True`. Pour refuser les booléens, teste-les à part : `isinstance(n, bool) or not isinstance(n, int)` ;
- `raise NouvelleErreur(...) from erreur` lève une exception plus claire **sans perdre** la cause d'origine (rangée dans `__cause__`, affichée dans le message d'erreur) ;
- `float(None)` lève une `TypeError`, `float("abc")` une `ValueError` : intercepte les deux.

> [!warning] `range` à l'envers
> Pour inclure la borne de fin, on écrit `range(debut, fin + 1)`... seulement si le pas est **positif**. Avec un pas négatif, on descend : la borne exclue est `fin - 1`, donc `range(debut, fin - 1, pas)`. Et `range(..., 0)` lève une `ValueError`.
