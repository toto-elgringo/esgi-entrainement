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
> Une fois parcouru, il est épuisé : un deuxième `for` ne donne plus rien. Rappelle la fonction pour en avoir un nouveau.

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
