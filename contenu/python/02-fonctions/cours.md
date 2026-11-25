# Fonctions avancées

## 1. Les paramètres

### Rappel : écrire une fonction

Une fonction s'écrit avec `def`, son nom, ses **paramètres** entre parenthèses, puis `:`. Le **corps** est en dessous, décalé de 4 espaces. `return` renvoie le résultat et arrête la fonction. Sans `return`, la fonction renvoie `None`.

```python
def perimetre(longueur, largeur):
    return 2 * (longueur + largeur)


def carre(x): return x * x


def annoncer(texte) -> str:
    return "Annonce : " + texte


print(perimetre(3, 5))
print(carre(7))
print(annoncer("pause"))
```

**Exemple résolu : que fait `perimetre(3, 5)` ?**

1. Python crée les variables locales `longueur = 3` et `largeur = 5` (dans l'ordre des paramètres).
2. Il calcule `2 * (3 + 5) = 2 * 8 = 16`.
3. `return` renvoie `16`, que `print` affiche.

Quelques détails :

- un corps très court peut tenir sur la même ligne que le `def` (`carre`) ;
- `-> str` est une **annotation** : elle annonce le type renvoyé, pour le lecteur. Python ne vérifie rien, et elle ne calcule rien ;
- il n'y a pas de `function`, pas d'accolades et pas de `new` en Python : ce sont des mots d'autres langages (JavaScript, Java).

**À retenir :** `def nom(paramètres):` puis le corps indenté ; `return` donne le résultat.

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

**Exemple résolu : pourquoi `nombres` change, et pas `x` ?**

| Ligne | Ce qui se passe |
|---|---|
| `ajoute_zero(nombres)` | `l` et `nombres` désignent **la même** liste `[1, 2]` |
| `l.append(0)` | on modifie cette liste : elle devient `[1, 2, 0]` |
| `print(nombres)` | `nombres` désigne toujours cette liste : `[1, 2, 0]` |
| `double(x)` | `n` et `x` désignent le même entier `5` |
| `n = n * 2` | on **range un nouvel objet** `10` dans `n` ; `x` désigne toujours `5` |
| `print(x)` | `5` |

> [!info] La règle
> **Modifier** l'objet reçu (`l.append(...)`, `d[cle] = ...`) se voit dehors. **Réaffecter** le paramètre (`n = ...`) ne change que la variable locale. Les `int`, `str` et `tuple` ne sont pas modifiables : une fonction ne peut pas les changer.

```anim
references
scenario: fonctions
```

#### Modifier la liste reçue, ou en fabriquer une nouvelle

Les deux sont possibles, et il faut savoir lequel on veut :

- **modifier sur place** : on change les cases de la liste reçue avec `l[i] = ...`. La fonction ne renvoie rien (donc `None`) ;
- **nouvelle liste** : on construit une autre liste et on la renvoie. L'originale reste intacte.

```python
def majuscules_sur_place(mots):
    for i in range(len(mots)):
        mots[i] = mots[i].upper()


def en_majuscules(mots):
    return [mot.upper() for mot in mots]


animaux = ["chat", "loup"]
print(majuscules_sur_place(animaux), animaux)

fruits = ["kiwi", "pomme"]
print(en_majuscules(fruits), fruits)
```

**Exemple résolu :**

1. `majuscules_sur_place(animaux)` : `i = 0`, la case 0 devient `"CHAT"` ; `i = 1`, la case 1 devient `"LOUP"`. Pas de `return` : l'appel vaut `None`. Mais `animaux` a changé : `['CHAT', 'LOUP']`.
2. `en_majuscules(fruits)` : la compréhension fabrique une **nouvelle** liste `['KIWI', 'POMME']`. `fruits` n'a pas été touchée : `['kiwi', 'pomme']`.

> [!warning] `for mot in mots: mot = mot.upper()` ne change rien
> `mot` est une variable locale qui reçoit chaque élément : la réaffecter ne touche pas la liste. Pour changer une case, il faut passer par son indice : `mots[i] = ...`.

**À retenir :** « modifie la liste » = `l[i] = ...` et pas de `return` ; « renvoie une nouvelle liste » = on construit une liste et on la renvoie, sans toucher à l'originale.

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

**Exemple résolu : que reçoivent `a`, `b` et `c` à chaque appel ?** Python remplit d'abord les paramètres dans l'ordre avec les arguments par position, puis ceux donnés par mot-clé, et enfin ce qui reste vide prend sa valeur par défaut.

| Appel | `a` | `b` | `c` | Pourquoi |
|---|---|---|---|---|
| `foo(2, 3)` | 2 | 3 | `toto` | 2 et 3 remplissent `a` puis `b` ; `c` prend son défaut |
| `foo(0)` | 0 | 4 | `toto` | seul `a` est donné |
| `foo(1, 42, "truc")` | 1 | 42 | `truc` | trois valeurs par position |
| `foo(c="truc", a=1)` | 1 | 4 | `truc` | par mot-clé, l'ordre ne compte pas |
| `foo(1, c="fin")` | 1 | 4 | `fin` | on saute `b` en nommant `c` |

Les appels qui ne marchent pas :

| Écriture | Erreur | Pourquoi |
|---|---|---|
| `foo()` | `TypeError` | `a` n'a pas de valeur par défaut, il est obligatoire |
| `foo(a=1, 2)` | `SyntaxError` | un argument par position **après** un mot-clé |
| `foo(1, a=2)` | `TypeError` | `a` reçoit deux valeurs (1 par position, 2 par mot-clé) |
| `def f(a=1, b):` | `SyntaxError` | un paramètre sans défaut après un paramètre avec défaut |

> [!warning] `=` et pas `:`
> `def f(x, taux=0.5):` donne la valeur par défaut `0.5`. `def f(x, taux: 0.5):` est accepté par Python, mais c'est une **annotation** (comme `-> str`) : `taux` reste **obligatoire**.

Pour arrondir un résultat, `round(valeur, n)` garde `n` chiffres après la virgule : `round(3.14159, 2)` vaut `3.14`, `round(2.675, 1)` vaut `2.7`.

**À retenir :** par position d'abord, par mot-clé ensuite ; ce qui n'est pas donné prend sa valeur par défaut, écrite avec `=`.

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

**Exemple résolu : pourquoi la première ligne affiche `[1, 2] [1, 2]` ?**

1. Au moment du `def ajoute_mauvais`, Python crée **une** liste vide et la range comme valeur par défaut de `l`.
2. `ajoute_mauvais(1)` : `l` désigne cette liste, qui devient `[1]`. La fonction renvoie **cette liste**.
3. `ajoute_mauvais(2)` : `l` désigne **encore la même** liste, qui devient `[1, 2]`.
4. Les deux appels ont renvoyé la même liste : quand `print` l'affiche, elle vaut `[1, 2]`, deux fois.

Avec `ajoute`, chaque appel sans liste passe par `l = []` : une liste **neuve** à chaque fois, d'où `[1] [2]`.

Le même piège existe pour un **dictionnaire** (`d={}`) ou un ensemble (`s=set()`) par défaut : même solution, `None` puis création dans la fonction.

> [!warning] `is None`, pas `if not l`
> `if not l: l = []` a l'air équivalent, mais il remplace aussi une liste **vide donnée par l'appelant** : `ma_liste = []` puis `ajoute(5, ma_liste)` laisserait `ma_liste` vide. `if l is None` ne remplace que l'absence de liste.

**À retenir :** une valeur par défaut modifiable s'écrit `=None`, puis `if x is None: x = []` (ou `{}`) dans la fonction.

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

**Exemple résolu :**

1. `puissances(1, 2, 3)` : les trois valeurs vont dans `nombres = (1, 2, 3)`. `exposant` n'est pas donné : il vaut 2. Résultat `[1, 4, 9]`.
2. `puissances(1, 2, 3, exposant=3)` : seul un mot-clé peut atteindre `exposant`, placé après `*nombres`. Résultat `[1, 8, 27]`.
3. `chercher("Python", "PY", ignorer_casse=True)` : tout passe en minuscules, `"py" in "python"` vaut `True`.
4. `chercher("Python", "PY", True)` : le `*` seul dit « plus d'argument par position après `motif` ». Le troisième argument par position n'a nulle part où aller : `TypeError`.

Le `*` seul peut même être en **premier** : `def f(*, a=None, b=None):` n'accepte **aucun** argument par position. Et sans `**kwargs`, un mot-clé inconnu (`f(z=1)`) est refusé lui aussi avec une `TypeError`.

```python
def badge(*, nom=None, role=None):
    if nom is None:
        nom = "anonyme"
    texte = "Badge : " + nom
    if role is not None:
        texte += " (" + role + ")"
    return texte


print(badge())
print(badge(role="invité", nom="Lina"))
for appel in (lambda: badge("Lina"), lambda: badge(age=20)):
    try:
        appel()
    except TypeError as e:
        print("Refusé :", e)
```

Ici `None` sert à savoir si une option a été **donnée** : `badge()` affiche `Badge : anonyme`, `badge(role="invité", nom="Lina")` affiche `Badge : Lina (invité)`. Les deux derniers appels sont refusés : un argument par position, puis un mot-clé inconnu. (`lambda: ...` crée une petite fonction sans nom, expliquée plus bas : ici elle permet de lancer chaque appel dans le `try`.)

> [!warning] Le nom d'un paramètre fait partie de la fonction
> Dès qu'on appelle par mot-clé, une faute de frappe dans la définition (`subtitute` au lieu de `substitute`) fait planter l'appel avec une `TypeError`. Et n'appelle jamais un paramètre `pow`, `sum` ou `max` : dans la fonction, il cache la fonction intégrée du même nom.

Deux outils de texte souvent utiles avec ces options : `texte.count(motif)` compte les apparitions de `motif` (`"banana".count("an")` vaut 2) et `texte.lower()` passe tout en minuscules.

> [!warning] La tranche `t[-0:]`
> `t[-2:]` donne les 2 derniers caractères, mais `t[-0:]` vaut `t[0:]`, c'est-à-dire **tout** le texte (car `-0` est `0`). Pour « les `n` derniers » avec `n` qui peut valoir 0, écris `t[len(t) - n:]`.

**À retenir :** après `*` (ou `*args`), un paramètre ne se donne que par `nom=valeur` ; `None` par défaut permet de savoir si une option a été donnée.

### Renvoyer plusieurs valeurs

`return a, b` renvoie le **tuple** `(a, b)`. L'appelant le déballe directement dans plusieurs variables. `divmod(a, b)` fait la même chose : il renvoie le quotient et le reste.

```python
def vers_hms(total):
    minutes, secondes = divmod(total, 60)
    heures, minutes = divmod(minutes, 60)
    return heures, minutes, secondes


h, m, s = vers_hms(7384)
print(h, m, s)
print(vers_hms(59))
```

**Exemple résolu : `vers_hms(7384)`.**

1. `divmod(7384, 60)` : 7384 = 123 × 60 + 4, donc `(123, 4)` : `minutes = 123`, `secondes = 4`.
2. `divmod(123, 60)` : 123 = 2 × 60 + 3, donc `(2, 3)` : `heures = 2`, `minutes = 3`.
3. `return heures, minutes, secondes` renvoie le tuple `(2, 3, 4)`.
4. `h, m, s = (2, 3, 4)` : `h` reçoit 2, `m` reçoit 3, `s` reçoit 4. Vérification : 2 × 3600 + 3 × 60 + 4 = 7384.

`print(vers_hms(59))` affiche le tuple entier, `(0, 0, 59)` : sans déballage, on récupère le tuple.

Pour renvoyer des **positions**, `enumerate(liste)` donne chaque indice avec sa valeur : `for i, v in enumerate(["x", "y"])` donne `(0, "x")` puis `(1, "y")`. Un tuple se construit aussi avec `tuple(...)` : `tuple(i for i, v in enumerate("aba") if v == "a")` vaut `(0, 2)`.

> [!tip] Penser au cas vide
> Avant de renvoyer « le plus petit » ou « la position du maximum », demande-toi ce qui se passe avec une liste vide. Renvoyer `(0, 0)` serait faux : mieux vaut lever `ValueError("liste vide")`, comme le fait `min([])`.

#### Les égalités : `<` ou `<=` ?

Quand on cherche le meilleur élément en parcourant une liste, la comparaison décide **quel** élément gagne en cas d'égalité.

```python
def plus_court(mots):
    if not mots:
        raise ValueError("liste vide")
    meilleur = mots[0]
    for mot in mots[1:]:
        if len(mot) < len(meilleur):
            meilleur = mot
    return meilleur


print(plus_court(["chien", "rat", "lion", "elk"]))
```

**Exemple résolu :** `meilleur` part de `"chien"` (5 lettres).

| Mot lu | Longueur | `len(mot) < len(meilleur)` ? | `meilleur` |
|---|---|---|---|
| `rat` | 3 | 3 < 5 : oui | `rat` |
| `lion` | 4 | 4 < 3 : non | `rat` |
| `elk` | 3 | 3 < 3 : **non** | `rat` |

Avec `<` strict, un mot **aussi** court ne remplace pas le premier trouvé : on garde le **premier** (`rat`). Avec `<=`, `elk` l'aurait remplacé : on garderait le **dernier**. De même, `liste.index(min(liste))` donne l'indice de la **première** apparition du minimum.

**À retenir :** `return a, b` renvoie un tuple, déballé par `x, y = f()` ; en cas d'égalité, `<` (ou `>`) strict garde le premier trouvé, `<=` (ou `>=`) le dernier.

### Réutiliser ses fonctions

Une fonction peut (et doit) en appeler une autre. Si un calcul est écrit **une seule fois**, une erreur se corrige à un seul endroit.

```python
def en_minutes(heures, minutes):
    return heures * 60 + minutes


def en_heures_minutes(total):
    return divmod(total, 60)


def decaler(horaire, minutes):
    total = en_minutes(*horaire) + minutes
    return en_heures_minutes(total % (24 * 60))


print(decaler((22, 50), 90))
print(decaler((0, 20), -30))
```

**Exemple résolu :**

1. `decaler((22, 50), 90)` : `en_minutes(*horaire)` déballe le tuple en `en_minutes(22, 50)` (l'étoile est expliquée en partie 2), soit 22 × 60 + 50 = 1370. On ajoute 90 : 1460.
2. Une journée fait 24 × 60 = 1440 minutes. `1460 % 1440 = 20` : on revient au début de la journée.
3. `en_heures_minutes(20)` : `divmod(20, 60) = (0, 20)`, soit 0 h 20.
4. `decaler((0, 20), -30)` : 20 - 30 = -10. En Python, `-10 % 1440` vaut **1430** (le reste a le signe du diviseur, donc il est positif). `divmod(1430, 60) = (23, 50)` : 23 h 50, la veille.

Autres outils utiles : `abs(x)` donne la valeur sans signe (`abs(-7)` vaut 7), pratique pour un écart « toujours positif ».

> [!warning] La puissance s'écrit `**`
> `x ** 3` est « x puissance 3 ». `x ^ 3` est un **ou exclusif** bit à bit, une tout autre opération : `2 ^ 3` vaut 1, sans aucune erreur. De plus, `2 * x ** 2` se calcule comme `2 * (x ** 2)` : la puissance passe avant la multiplication.

Pour un polynôme rangé du degré 0 au plus haut (`coefs[i]` est le coefficient de x puissance i), `enumerate(coefs)` donne chaque degré `i` avec son coefficient. Rappel de maths : la dérivée de `c × x puissance i` est `i × c × x puissance (i - 1)` ; une constante (degré 0) a une dérivée nulle. Par exemple, `[5, 3, 2]` représente 5 + 3x + 2x², de dérivée 3 + 4x, soit `[3, 4]`.

**À retenir :** écris une formule une fois dans une petite fonction, puis appelle-la ; `% n` ramène un nombre (même négatif) entre 0 et n - 1.

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

**Exemple résolu : qui reçoit quoi ?**

| Appel | `x` | `args` / `kwargs` | Pourquoi |
|---|---|---|---|
| `foo()` | 0 | `args = ()` | rien de donné : `x` prend son défaut, le tuple est vide |
| `foo(1, 2, 3)` | 1 | `args = (2, 3)` | le premier remplit `x`, les autres sont « en trop » |
| `bar(a="A", b="B")` | 0 | `kwargs = {'a': 'A', 'b': 'B'}` | `a` et `b` ne sont pas des paramètres connus |
| `bar(a="A", x="X")` | `X` | `kwargs = {'a': 'A'}` | `x` est connu : il va dans `x`, pas dans `kwargs` |

L'ordre dans la définition est toujours : paramètres normaux, `*args`, `**kwargs`. Les noms `args` et `kwargs` sont une convention, ce sont les étoiles qui comptent : une étoile = tuple des positions, deux étoiles = dictionnaire des mots-clés.

**À retenir :** `*args` = tuple des arguments par position en trop ; `**kwargs` = dict des mots-clés qui ne correspondent à aucun paramètre.

### Travailler avec `args` et `kwargs`

`args` est un tuple ordinaire (`len`, `for`, `sum`, indices...) et `kwargs` un dictionnaire ordinaire (`len`, `.items()`...). Le dictionnaire garde les mots-clés **dans l'ordre où ils ont été écrits** à l'appel.

```python
def produit(*nombres):
    resultat = 1
    for n in nombres:
        resultat *= n
    return resultat


def premier_mot(premier, *autres):
    return premier, len(autres)


def requete(adresse, **parametres):
    if not parametres:
        return adresse
    morceaux = [cle + "=" + str(valeur) for cle, valeur in parametres.items()]
    return adresse + "?" + "&".join(morceaux)


print(produit(2, 3, 4), produit())
print(premier_mot("a", "b", "c"))
print(requete("site.fr"))
print(requete("site.fr", page=2, tri="prix"))
```

**Exemple résolu :**

1. `produit(2, 3, 4)` : `nombres = (2, 3, 4)`. `resultat` passe de 1 à 1 × 2 = 2, puis 2 × 3 = 6, puis 6 × 4 = **24**. `produit()` : le tuple est vide, la boucle ne tourne pas, on renvoie **1**. Pense toujours au cas « aucun argument » : une moyenne `sum(t) / len(t)` planterait (division par zéro) avec un tuple vide, il faut le tester à part.
2. `premier_mot("a", "b", "c")` : `premier = "a"`, `autres = ("b", "c")`, d'où `('a', 2)`. Écrire `premier` avant `*autres` **oblige** à donner au moins un argument : `premier_mot()` lève une `TypeError`. Pratique pour un maximum fait à la main : on part de `premier`, puis on compare avec chaque élément de `autres`.
3. `requete("site.fr")` : `parametres = {}`, vide, donc `not parametres` est vrai : on renvoie l'adresse seule.
4. `requete("site.fr", page=2, tri="prix")` : `parametres = {'page': 2, 'tri': 'prix'}`, dans l'ordre de l'appel. La compréhension donne `['page=2', 'tri=prix']` (`str(2)` car on ne colle pas un nombre à un texte), et `"&".join(...)` les relie : `site.fr?page=2&tri=prix`.

Rappel : `"sep".join(liste_de_textes)` relie les textes en mettant `sep` **entre** eux (`"-".join(["a", "b"])` vaut `"a-b"`). Un paramètre placé après `*args` (comme `sep=" "`) ne se donne que par mot-clé, vu en partie 1.

**À retenir :** `args` se parcourt comme un tuple, `kwargs.items()` donne les couples (nom, valeur) dans l'ordre de l'appel ; pense au cas où il n'y a rien.

### Déballer à l'appel

À l'appel, les étoiles font l'inverse : elles **déballent** une liste en arguments par position, un dictionnaire en arguments par mot-clé.

```python
def point(x, y, z):
    return x + y + z


coords = [1, 2, 3]
options = {"x": 10, "y": 20, "z": 30}
print(point(*coords), point(**options))


def deux_fois(func, *args, **kwargs):
    return [func(*args, **kwargs), func(*args, **kwargs)]


print(deux_fois(round, 3.14159, ndigits=2))
```

**Exemple résolu :**

1. `point(*coords)` devient `point(1, 2, 3)` : 6.
2. `point(**options)` devient `point(x=10, y=20, z=30)` : 60.
3. `deux_fois(round, 3.14159, ndigits=2)` : `func = round`, `args = (3.14159,)`, `kwargs = {'ndigits': 2}`. `func(*args, **kwargs)` redevient `round(3.14159, ndigits=2)`, soit 3.14, calculé deux fois : `[3.14, 3.14]`.

Ce « je ramasse tout avec `*args, **kwargs`, puis je redonne tout avec `func(*args, **kwargs)` » permet de **transmettre** des arguments à une autre fonction sans savoir lesquels. C'est la base des décorateurs (partie 5).

**À retenir :** dans un `def`, les étoiles **ramassent** ; dans un appel, elles **déballent**.

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

**Exemple résolu : `pow_and_add_list(3, 2, 1)`.** Ici `p = 2` et `a = 1` : la fonction interne calcule `x ** 2 + 1`, en lisant `p` et `a` de la fonction englobante.

| `i` | `pow_and_add(i)` | `l` |
|---|---|---|
| 0 | 0² + 1 = 1 | `[1]` |
| 1 | 1² + 1 = 2 | `[1, 2]` |
| 2 | 2² + 1 = 5 | `[1, 2, 5]` |
| 3 | 3² + 1 = 10 | `[1, 2, 5, 10]` |

`range(n + 1)` va de 0 à 3 inclus. En dehors de `pow_and_add_list`, le nom `pow_and_add` n'existe pas.

> [!tip] `nonlocal`
> La fonction interne peut **lire** les variables englobantes. Pour les **réaffecter**, il faut écrire `nonlocal nom_de_la_variable` dans la fonction interne.

```python
def total_sans_nonlocal(valeurs):
    total = 0

    def ajouter(v):
        total += v

    for v in valeurs:
        ajouter(v)
    return total


def total_avec_nonlocal(valeurs):
    total = 0

    def ajouter(v):
        nonlocal total
        total += v

    for v in valeurs:
        ajouter(v)
    return total


try:
    total_sans_nonlocal([1, 2])
except UnboundLocalError as e:
    print("Erreur :", e)
print(total_avec_nonlocal([1, 2, 3]))
```

**Exemple résolu :** `total += v` veut dire `total = total + v`, c'est une **affectation**. Sans `nonlocal`, Python décide que `total` est une variable **locale** à `ajouter`... qui n'a pas encore de valeur quand on la lit : `UnboundLocalError`. Avec `nonlocal total`, c'est le `total` de la fonction englobante qui passe de 0 à 1, 3, puis 6.

Modifier un objet (`liste.append(...)`, `dico[cle] = ...`) n'est pas une réaffectation : cela marche **sans** `nonlocal`.

**À retenir :** lire une variable englobante, c'est libre ; la réaffecter (`=`, `+=`) demande `nonlocal`.

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

**Exemple résolu : `appliquer(elems, int)`.** `func` désigne `int`, donc `func(x)` fait `int(x)` sur chaque élément.

| `x` | `int(x)` | `float(x)` | `str(x)` |
|---|---|---|---|
| `"4"` | 4 | 4.0 | `'4'` |
| `45` | 45 | 45.0 | `'45'` |
| `3.2` | 3 (on coupe la partie décimale) | 3.2 | `'3.2'` |

On écrit `appliquer(elems, int)` et **pas** `appliquer(elems, int())` : avec les parenthèses, `int()` serait exécuté tout de suite (il vaut 0), et on passerait le nombre 0 au lieu de la fonction.

> [!warning] Ne pas écraser les noms intégrés
> Appeler sa fonction `map`, `list`, `sum` ou `input` masque la fonction de Python du même nom. Choisis un autre nom.

**À retenir :** `f` est la fonction, `f(x)` est son résultat ; on passe `f` sans parenthèses.

### Les fonctions sans nom : `lambda`

`lambda x: expression` crée une petite fonction sans nom, qui renvoie `expression`. C'est pratique pour passer une condition ou une clé de tri sans écrire un `def`.

```python
est_pair = lambda n: n % 2 == 0
print(est_pair(4), est_pair(7))


def compter_si(l, condition):
    total = 0
    for x in l:
        if condition(x):
            total += 1
    return total


print(compter_si([3, 8, 10, 5], est_pair))
print(compter_si(["oui", "", "non"], lambda t: t != ""))
print(sorted(["kiwi", "ananas", "figue"], key=lambda mot: len(mot)))
```

**Exemple résolu :**

1. `est_pair(4)` : 4 % 2 vaut 0, donc `True` ; `est_pair(7)` : 7 % 2 vaut 1, donc `False`.
2. `compter_si([3, 8, 10, 5], est_pair)` : 3 non, 8 oui, 10 oui, 5 non : **2**.
3. `compter_si(["oui", "", "non"], lambda t: t != "")` : seul `""` est refusé : **2**.
4. `sorted(..., key=lambda mot: len(mot))` trie selon la longueur : kiwi (4), figue (5), ananas (6).

Une `lambda` ne contient qu'**une** expression (pas de `if` en bloc, pas de boucle). Dès que c'est plus long, écris un `def`.

**À retenir :** `lambda paramètres: résultat` = une mini-fonction sans nom, à passer en paramètre.

### Appliquer une fonction plusieurs fois

Une fonction reçue en paramètre peut être appelée autant de fois qu'on veut, en réutilisant chaque résultat.

```python
def appliquer_jusqua(func, x, limite):
    etapes = 0
    while x < limite:
        x = func(x)
        etapes += 1
    return x, etapes


print(appliquer_jusqua(lambda n: n * 3, 1, 50))
```

**Exemple résolu :** `x` vaut 1, on triple tant que `x < 50` : 1 → 3 → 9 → 27 → 81. À 81, la condition est fausse : on s'arrête après **4** étapes, d'où `(81, 4)`. Le point clé est `x = func(x)` : le résultat d'un appel devient l'entrée du suivant.

**À retenir :** pour enchaîner, réaffecte : `x = func(x)` dans une boucle.

### Un dictionnaire de fonctions

Comme une fonction est une valeur, on peut la ranger dans un dictionnaire. On choisit alors l'action avec une clé, sans longue suite de `if ... elif`.

```python
def doubler(n):
    return 2 * n


def oppose(n):
    return -n


ACTIONS = {"double": doubler, "oppose": oppose, "carre": lambda n: n * n}


def executer(nom, n):
    if nom not in ACTIONS:
        return "action inconnue"
    return ACTIONS[nom](n)


print(executer("double", 7), executer("carre", 7), executer("racine", 7))
```

**Exemple résolu : `executer("carre", 7)`.**

1. `"carre" in ACTIONS` : oui, on continue.
2. `ACTIONS["carre"]` est la fonction `lambda n: n * n` (pas encore appelée).
3. `ACTIONS["carre"](7)` l'appelle avec 7 : **49**.

Pour `"racine"`, la clé n'existe pas : on le teste **avant** avec `in` (sinon `ACTIONS["racine"]` lèverait une `KeyError`).

**À retenir :** `TABLE[cle](arguments)` = je choisis la fonction par sa clé, puis je l'appelle.

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
d = compteur()
print(d(), c())
```

**Exemple résolu :**

1. `create_adder(10)` crée une fonction `adder` qui « se souvient » de `n = 10`, et la renvoie **sans l'appeler** (`return adder`, sans parenthèses). `create_adder` est terminée, mais `n = 10` reste attaché à `adder`.
2. `plus10(24)` exécute `24 + n` avec `n = 10` : **34**. `plus1(24)` a son propre `n = 1` : **25**.
3. `c = compteur()` : `total = 0`, gardé par `suivant`. Chaque `c()` fait `total += 1` (d'où le `nonlocal`) : 1, 2, 3.
4. `d = compteur()` relance `compteur` : un **nouveau** `total = 0`, à part. `d()` donne 1, alors que `c()` continue à 4 : les deux compteurs sont **indépendants**.

Une fabrique peut aussi recevoir des **fonctions** : `def apres(f, g): return lambda x: g(f(x))` renvoie la fonction « d'abord `f`, puis `g` ». Avec `f = lambda x: x + 1` et `g = lambda x: x * 10`, `apres(f, g)(2)` calcule `f(2) = 3` puis `g(3) = 30`.

**À retenir :** une fabrique renvoie une fonction interne (sans parenthèses) ; chaque appel de la fabrique crée une mémoire neuve.

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

**Exemple résolu : que se passe-t-il, ligne par ligne ?**

1. Python lit `def addition`, puis applique `@decor` : il appelle `decor(addition)`. Dans `decor`, `func` désigne l'addition d'origine ; `decor` renvoie `wrapper`.
2. Le nom `addition` désigne maintenant `wrapper` (qui garde `func` en mémoire : c'est une closure).
3. `addition(2, 3)` appelle donc `wrapper(2, 3)` : `args = (2, 3)`, `kwargs = {}`.
4. `wrapper` affiche `Avant`, appelle `func(2, 3)` (l'addition d'origine) qui renvoie 5, affiche `Après`, puis renvoie 5.
5. `print` affiche `5`. Sortie complète :

```text
Avant
Après
5
```

Sans le `return res` final, le wrapper renverrait `None` : la fonction décorée « perdrait » son résultat. Le wrapper peut aussi **transformer** ce résultat avant de le renvoyer (`return res * 2`, `return res.strip()`...).

**À retenir :** `@d` sur `def f` = `f = d(f)` ; le wrapper reçoit `*args, **kwargs`, appelle `func(*args, **kwargs)` et renvoie (éventuellement transformé) son résultat.

### Des attributs sur la fonction décorée

> [!tip] Un décorateur peut garder des informations
> Une fonction est un objet : on peut lui ajouter des attributs. `wrapper.appels = 0` dans le décorateur, puis `wrapper.appels += 1` à chaque appel, permet de compter les appels.

Même idée avec une liste, `wrapper.historique = []`. Le wrapper les met à jour à chaque appel, et on les lit depuis l'extérieur avec `fonction_decoree.historique`.

```python
def journaliser(func):
    def wrapper(*args, **kwargs):
        wrapper.historique.append(args)
        return func(*args, **kwargs)
    wrapper.historique = []
    return wrapper


@journaliser
def soustraire(a, b):
    return a - b


soustraire(10, 4)
soustraire(3, 1)
print(soustraire.historique)
```

**Exemple résolu :**

1. À la décoration, `wrapper.historique = []` crée la liste, **une seule fois** (le décorateur n'est exécuté qu'une fois).
2. `soustraire(10, 4)` : le wrapper ajoute `(10, 4)` à la liste puis renvoie 6.
3. `soustraire(3, 1)` : il ajoute `(3, 1)`, renvoie 2.
4. `soustraire` désigne le wrapper, donc `soustraire.historique` vaut `[(10, 4), (3, 1)]`.

Pour un **nombre**, `wrapper.total += 1` marche de la même façon (c'est un attribut, pas une variable : pas besoin de `nonlocal`).

**À retenir :** initialise l'attribut dans le décorateur, après le `def wrapper`, et mets-le à jour dans le wrapper.

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

**Exemple résolu :**

1. `decor("debug")` est d'abord **exécuté** : il renvoie `inner_decor` (qui garde `param = "debug"`).
2. `@decor("debug")` équivaut donc à `carre = inner_decor(carre)` : `carre` devient `wrapper`.
3. `carre(4)` affiche `Avant, avec : debug`, calcule 16, affiche `Après` et renvoie 16.

Trois couches, trois rôles : `decor(param)` reçoit le **réglage**, `inner_decor(func)` reçoit la **fonction**, `wrapper(*args, **kwargs)` reçoit les **arguments** de chaque appel.

Un décorateur avec paramètre peut appeler la fonction **plusieurs fois**, ou garder un état entre les appels avec `nonlocal` :

```python
def reessayer(fois):
    def inner_decor(func):
        def wrapper(*args, **kwargs):
            for essai in range(1, fois + 1):
                try:
                    return func(*args, **kwargs)
                except ValueError:
                    print("Essai", essai, "raté")
            raise RuntimeError("abandon après " + str(fois) + " essais")
        return wrapper
    return inner_decor


def numeroter(prefixe):
    def inner_decor(func):
        numero = 0

        def wrapper(*args, **kwargs):
            nonlocal numero
            numero += 1
            return prefixe + str(numero) + " " + func(*args, **kwargs)
        return wrapper
    return inner_decor


essais = iter(["x", "y", "12"])


@reessayer(3)
def lire_nombre():
    return int(next(essais))


@numeroter("n°")
def crier(mot):
    return mot.upper()


print(lire_nombre())
print(crier("stop"), "|", crier("go"))
```

**Exemple résolu :**

1. `lire_nombre()` : essai 1, `int("x")` lève `ValueError` : on affiche `Essai 1 raté` et on recommence. Essai 2, `int("y")` : raté aussi. Essai 3, `int("12")` vaut 12 : le `return` sort tout de suite du wrapper. Si les 3 essais avaient raté, on serait sorti de la boucle et le `raise RuntimeError(...)` aurait signalé l'abandon.
2. `numero = 0` est créé **une fois par fonction décorée** (dans `inner_decor`, au moment de la décoration). Premier `crier("stop")` : `nonlocal` permet au wrapper de passer `numero` à 1, d'où `n°1 STOP`. Deuxième appel : `numero` passe à 2, d'où `n°2 GO`. C'est ce qu'il faut pour compter des appels, ou en refuser au-delà d'une limite (tester `numero` puis lever une exception).

**À retenir :** `@d(réglage)` = `f = d(réglage)(f)` ; trois `def` imbriqués, et chaque couche renvoie la suivante sans l'appeler.

### Garder le nom : `functools.wraps`

Sans précaution, la fonction décorée **est** le wrapper : elle s'appelle `wrapper` et perd sa docstring (gênant dans les messages d'erreur et dans `help()`). `@functools.wraps(func)` recopie le nom et la docstring de `func` sur le wrapper.

```python
import functools


def sans_wraps(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper


def bavard(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print("Appel de", func.__name__, args, kwargs)
        return func(*args, **kwargs)
    return wrapper


@sans_wraps
def volume(cote):
    """Volume d'un cube."""
    return cote ** 3


@bavard
def aire(largeur, hauteur=1):
    """Aire d'un rectangle."""
    return largeur * hauteur


print(volume.__name__, ":", volume.__doc__)
print(aire(3, hauteur=2))
print(aire.__name__, ":", aire.__doc__)
```

**Exemple résolu :**

1. `volume` est décorée **sans** `wraps` : `volume.__name__` vaut `wrapper` et `volume.__doc__` vaut `None` (le wrapper n'a pas de docstring).
2. `aire(3, hauteur=2)` : le wrapper affiche `Appel de aire (3,) {'hauteur': 2}` puis renvoie 6. Dans le wrapper, `func.__name__` est toujours le vrai nom.
3. Avec `@functools.wraps(func)`, `aire.__name__` vaut `aire` et la docstring est conservée.

> [!warning] Un wrapper sans paramètres
> `def wrapper():` ne marche qu'avec des fonctions **sans** paramètre. Prends l'habitude d'écrire `def wrapper(*args, **kwargs):` et `func(*args, **kwargs)` : ton décorateur marchera partout.

`@functools.wraps(func)` se place juste au-dessus du `def wrapper`, y compris dans un décorateur avec paramètre (dans la couche du milieu, là où `func` est connu).

**À retenir :** mets toujours `@functools.wraps(func)` au-dessus du `def wrapper`.

### Vérifier les arguments dans un décorateur

Le wrapper voit **tous** les arguments avant d'appeler la fonction : ceux par position dans `args` (un tuple), ceux par mot-clé dans `kwargs.values()`. Il peut donc les contrôler et refuser l'appel.

```python
import functools


def refuser_vides(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        for valeur in list(args) + list(kwargs.values()):
            if isinstance(valeur, str) and valeur == "":
                raise ValueError(func.__name__ + " : texte vide")
        return func(*args, **kwargs)
    return wrapper


@refuser_vides
def presenter(prenom, nom="X", age=0):
    return prenom + " " + nom + ", " + str(age) + " ans"


print(presenter("Ada", nom="Lovelace", age=36))
try:
    presenter("Ada", nom="")
except ValueError as e:
    print("Refusé :", e)
```

**Exemple résolu :**

1. `presenter("Ada", nom="Lovelace", age=36)` : `args = ("Ada",)`, `kwargs = {'nom': 'Lovelace', 'age': 36}`. On teste `"Ada"`, `"Lovelace"`, `36` : 36 n'est pas un texte, `isinstance(36, str)` est faux, on ne le vérifie pas. Rien de vide : on appelle la fonction.
2. `presenter("Ada", nom="")` : `""` est un texte vide : `ValueError("presenter : texte vide")`, et la fonction n'est **jamais** appelée.

`isinstance(valeur, (int, float))` teste « est-ce un nombre ? » (un tuple de types veut dire « l'un ou l'autre »).

**À retenir :** pour contrôler tous les arguments, parcours `args` **et** `kwargs.values()`.

### Retenir les résultats déjà calculés

Un **cache** est un dictionnaire : la clé décrit l'appel, la valeur est le résultat. Comme `args` est un tuple, il peut servir de clé directement (un tuple est « hachable », il peut être une clé de dictionnaire, une liste non).

```python
appels = 0
resultats = {}


def lent_carre(n):
    global appels
    appels += 1
    return n * n


def carre_rapide(n):
    cle = (n,)
    if cle not in resultats:
        resultats[cle] = lent_carre(n)
    return resultats[cle]


print(carre_rapide(9), carre_rapide(9), carre_rapide(4))
print("Vrais calculs :", appels)
```

**Exemple résolu :** `carre_rapide(9)` : `(9,)` n'est pas dans le cache, on calcule (1 vrai calcul) et on range 81. Deuxième `carre_rapide(9)` : la clé y est, on renvoie 81 **sans** recalculer. `carre_rapide(4)` : nouveau calcul. Total : 2 vrais calculs pour 3 appels. Dans un décorateur, le dictionnaire se crée dans le décorateur (une fois par fonction décorée), et `args` sert de clé.

**À retenir :** cache = `if cle not in cache: cache[cle] = calcul` puis `return cache[cle]`.

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

**Exemple résolu : `saluer("ada")`.**

| Étape | Qui travaille | Texte |
|---|---|---|
| 1 | la fonction d'origine | `salut ada` |
| 2 | `majuscules` (le plus proche du `def`) | `SALUT ADA` |
| 3 | `entre_crochets` (le plus haut) | `[SALUT ADA]` |

L'ordre compte : si un décorateur retournait le texte à l'envers **après** l'ajout des crochets, les crochets seraient retournés aussi (`[ADA]` deviendrait `]ADA[`). Pour trouver l'ordre, pars du résultat voulu et demande-toi quelle transformation doit être faite **en dernier** : c'est le décorateur du **haut**.

**À retenir :** le décorateur le plus bas agit en premier sur le résultat, le plus haut en dernier.

### Un décorateur tout fait : le cache

Une fonction **récursive** s'appelle elle-même. Elle a toujours :

- un **cas de base**, qui répond sans s'appeler (sinon elle ne s'arrêterait jamais) ;
- un **cas récursif**, qui s'appelle sur un problème **plus petit**.

C'est naturel pour Fibonacci, mais la version directe recalcule sans cesse les mêmes valeurs : `fibo(30)` fait plus d'un million d'appels. Un **cache** (mémoïsation) retient chaque résultat déjà calculé ; `functools.lru_cache` le fait pour nous.

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

**Exemple résolu : pourquoi c'est lent sans cache.** Voici les appels de `fibo(4)` sans cache :

```text
fibo(4)
├── fibo(3)
│   ├── fibo(2)
│   │   ├── fibo(1)
│   │   └── fibo(0)
│   └── fibo(1)
└── fibo(2)
    ├── fibo(1)
    └── fibo(0)
```

`fibo(2)` est calculé 2 fois, `fibo(1)` 3 fois : 9 appels pour `fibo(4)`. Chaque niveau de plus multiplie presque le travail par 1,6 : environ 2,7 millions d'appels pour `fibo(30)`, des centaines de millions pour `fibo(40)`. Avec le cache, chaque `fibo(k)` n'est calculé **qu'une fois** : 101 calculs pour `fibo(100)` (de `fibo(0)` à `fibo(100)`), le reste est lu dans le cache (`hits` dans `cache_info()`).

Un autre exemple : le nombre de façons de monter un escalier de `n` marches, par pas de 1 ou 2 marches.

```python
from functools import lru_cache


@lru_cache(maxsize=None)
def facons(n):
    if n < 0:
        return 0
    if n == 0:
        return 1
    return facons(n - 1) + facons(n - 2)


print(facons(3), facons(4), facons(60))
```

**Exemple résolu :**

1. **Cas de base** : `n == 0`, on est en haut, il y a **1** façon (ne plus bouger) ; `n < 0`, on a dépassé, **0** façon.
2. **Cas récursif** : le premier pas fait 1 marche (il en reste `n - 1`) ou 2 marches (il en reste `n - 2`). On additionne les deux possibilités.
3. `facons(3) = facons(2) + facons(1)`. `facons(1) = facons(0) + facons(-1) = 1 + 0 = 1`. `facons(2) = facons(1) + facons(0) = 1 + 1 = 2`. Donc `facons(3) = 2 + 1 = 3` (1+1+1, 1+2, 2+1).
4. `facons(4) = facons(3) + facons(2) = 3 + 2 = 5`. Grâce au cache, `facons(60)` répond tout de suite.

> [!info] Récursif ou boucle ?
> La récursion est lisible, mais chaque appel s'empile : au-delà d'environ 1000 niveaux, Python lève `RecursionError`. Pour Fibonacci, une boucle `a, b = b, a + b` est aussi simple et sans limite. Le cache ne marche qu'avec des arguments **hachables** (nombres, textes, tuples), pas avec des listes.

**À retenir :** une fonction récursive = cas de base + appel sur plus petit ; si elle recalcule les mêmes valeurs, ajoute `@lru_cache(maxsize=None)`.

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

**Exemple résolu : `pows(3, 2)`, tour par tour.**

| La boucle demande | `pows` reprend... | `i` | `yield` fournit | Affiché |
|---|---|---|---|---|
| 1re valeur | depuis le début | 1 | 1² = 1 | `1` |
| 2e valeur | après le `yield` | 2 | 2² = 4 | `4` |
| 3e valeur | après le `yield` | 3 | 3² = 9 | `9` |
| 4e valeur | après le `yield` | la boucle `for i` est finie, la fonction se termine | rien | la boucle s'arrête |

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

**Exemple résolu :**

1. `g = pows(2, 3)` crée le générateur, sans rien calculer.
2. `next(g)` : le code démarre, `i = 1`, fournit 1³ = **1**. `next(g)` : reprise, `i = 2`, fournit 2³ = **8**.
3. Troisième `next(g)` : la boucle est finie, la fonction se termine : `StopIteration`, qu'on intercepte.
4. `list(pows(4, 1))` demande **toutes** les valeurs et les range dans une liste : `[1, 2, 3, 4]`.
5. `entiers()` ne se termine jamais (`while True`), mais ce n'est pas grave : il ne calcule une valeur que quand on la demande. Le `break` arrête la boucle après `0, 1, 2, 3`.

> [!info] Générateur
> Appeler `pows(3, 2)` n'exécute rien : cela crée un **générateur**. Chaque `next()` avance jusqu'au `yield` suivant ; à la fin, `StopIteration` est levée (la boucle `for` s'en occupe). Les valeurs sont produites **une par une, sans être stockées** : idéal pour de grandes ou d'infinies suites de valeurs.

> [!warning] Un générateur ne sert qu'une fois
> Une fois parcouru, il est épuisé : un deuxième `for` ne donne plus rien. Rappelle la fonction pour en avoir un nouveau. Si ton générateur reçoit un itérable qu'il doit parcourir **plusieurs fois**, copie-le d'abord : `elements = list(iterable)`.

Pour compter à l'envers, `range` accepte un pas négatif : `range(5, 0, -1)` donne 5, 4, 3, 2, 1 (la borne 0 est exclue).

**À retenir :** `yield` fournit une valeur et met en pause ; `next(g)` (ou un tour de `for`) fait reprendre jusqu'au `yield` suivant.

### Une suite sans fin : l'affectation simultanée

Beaucoup de suites se calculent à partir des **deux** termes précédents. L'affectation `a, b = b, a + b` calcule d'abord **tout** le côté droit avec les anciennes valeurs, puis range les résultats : pas besoin de variable temporaire.

```python
from itertools import islice


def suite_de_lucas():
    a, b = 2, 1
    while True:
        yield a
        a, b = b, a + b


print(list(islice(suite_de_lucas(), 7)))
```

**Exemple résolu :** la suite de Lucas commence par 2 et 1, puis chaque terme est la somme des deux précédents.

| Tour | `yield a` | calcul de `b, a + b` (anciennes valeurs) | nouveaux `a`, `b` |
|---|---|---|---|
| 1 | 2 | `1, 2 + 1` | 1, 3 |
| 2 | 1 | `3, 1 + 3` | 3, 4 |
| 3 | 3 | `4, 3 + 4` | 4, 7 |
| 4 | 4 | `7, 4 + 7` | 7, 11 |

On obtient 2, 1, 3, 4, 7, 11, 18. `islice(g, 7)` (module `itertools`, voir plus bas) ne prend que les 7 premières valeurs : sans lui, `list(...)` sur une suite infinie ne finirait jamais.

> [!warning] Pas de liste
> Écrire `a = b` puis `b = a + b` sur deux lignes est faux : à la deuxième ligne, `a` a déjà changé. Et un générateur ne fabrique **pas** de liste : il fournit chaque valeur avec `yield` au moment où on la demande.

**À retenir :** `a, b = b, a + b` avance de deux termes à la fois en un seul calcul ; une suite infinie = `while True` + `yield`.

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

**Exemple résolu :**

1. `compte` contient `yield` : c'est une fonction génératrice. `gen = compte(-1)` crée le générateur **sans** exécuter le `if` : aucune erreur, le message s'affiche. L'erreur ne sortirait qu'au premier `next(gen)` ou `list(gen)`.
2. `compte_sur` ne contient **pas** `yield` : c'est une fonction normale, son code s'exécute tout de suite. Avec `-1`, le `raise` part immédiatement.
3. Avec un `n` correct, `compte_sur` renvoie `_compte(n)`, le générateur qui fait le vrai travail : pour celui qui l'utilise, c'est la même chose qu'un générateur ordinaire.

**À retenir :** une fonction qui contient `yield` ne vérifie rien avant le premier `next` ; pour vérifier dès l'appel, une fonction normale vérifie puis `return` le générateur.

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

**Exemple résolu : `aplatir([1, [2, [3, 4]], 5])`.**

| Élément lu | Est-ce une liste ? | Ce qui se passe | Fourni |
|---|---|---|---|
| `1` | non | `yield 1` | 1 |
| `[2, [3, 4]]` | oui | `yield from aplatir([2, [3, 4]])` : on recommence dedans | |
| ↳ `2` | non | `yield 2` | 2 |
| ↳ `[3, 4]` | oui | `yield from aplatir([3, 4])` | 3, puis 4 |
| `5` | non | `yield 5` | 5 |

Résultat `[1, 2, 3, 4, 5]`. Le **cas de base** est l'élément simple (on le fournit), le **cas récursif** est la liste (on délègue à un nouvel `aplatir`). Pour accepter aussi les tuples : `isinstance(element, (list, tuple))`. Un texte est itérable lui aussi, mais il ne faut pas le découper en lettres : on ne met pas `str` dans les types parcourus.

Un générateur récursif peut aussi transmettre des informations à l'appel suivant, comme le chemin déjà parcouru dans un dictionnaire imbriqué :

```python
def feuilles(menu, niveau=0):
    for nom, contenu in menu.items():
        if isinstance(contenu, dict):
            yield from feuilles(contenu, niveau + 1)
        else:
            yield niveau, nom, contenu


carte = {"entrées": {"soupe": 5}, "plats": {"viandes": {"steak": 15}, "omelette": 9}}
print(list(feuilles(carte)))
```

**Exemple résolu :** `menu.items()` donne les couples (clé, valeur). `"entrées"` a pour valeur un dictionnaire : on descend, au niveau 1, et on trouve `soupe` (5). `"plats"` : on descend au niveau 1 ; `"viandes"` est encore un dictionnaire, on descend au niveau 2 (`steak`, 15) ; `"omelette"` vaut 9, c'est une feuille du niveau 1. Résultat `[(1, 'soupe', 5), (2, 'steak', 15), (1, 'omelette', 9)]`. Le paramètre `niveau` (ou un préfixe de texte, `prefixe + nom + "/"`) se transmet à chaque appel récursif.

`yield from` sert aussi à enchaîner plusieurs itérables : `for it in (a, b): yield from it` fournit tout `a`, puis tout `b`.

**À retenir :** `yield from g` = « fournis toutes les valeurs de `g` » ; dans un générateur récursif, cas simple → `yield`, cas composé → `yield from` sur un appel récursif.

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

**Exemple résolu :** `count()` fournit 0, 1, 2, 3... sans fin, et `n = 3`.

| Élément | `fenetre` après `append` | Pleine (3) ? | Fourni |
|---|---|---|---|
| 0 | `[0]` | non | |
| 1 | `[0, 1]` | non | |
| 2 | `[0, 1, 2]` | oui | `(0, 1, 2)` |
| 3 | `[1, 2, 3]` (0 est jeté) | oui | `(1, 2, 3)` |
| 4 | `[2, 3, 4]` | oui | `(2, 3, 4)` |
| 5 | `[3, 4, 5]` | oui | `(3, 4, 5)` |

`islice(..., 4)` s'arrête après 4 tuples : le flux infini n'est jamais parcouru en entier.

> [!tip] `deque` plutôt que `pop(0)`
> `liste.pop(0)` décale tous les éléments à chaque fois. Une `deque(maxlen=n)` (file à deux bouts) jette toute seule le plus ancien quand elle est pleine, et `popleft()` est immédiat.

Pour une **somme** sur chaque fenêtre, inutile de tout réadditionner à chaque pas : on garde un total, on **ajoute** l'élément qui entre et on **retire** celui qui sort. Avec `[4, 1, 3, 2]` et des fenêtres de 2 :

| Entre | Sort | Total | Fenêtre |
|---|---|---|---|
| 4 | | 4 | `[4]` (pas encore pleine) |
| 1 | | 5 | `[4, 1]` |
| 3 | 4 | 5 + 3 - 4 = 4 | `[1, 3]` |
| 2 | 1 | 4 + 2 - 1 = 5 | `[3, 2]` |

Une seule addition et une seule soustraction par pas, quelle que soit la taille de la fenêtre. L'élément qui sort est celui qu'on retire de la `deque` (`fenetre.popleft()` quand elle a déjà `n` éléments).

Pour « se souvenir de ce qu'on a déjà vu », on garde un **ensemble** (`vus = set()`) : `x in vus` est immédiat, et `vus.add(x)` l'ajoute. Pour « l'élément d'avant », on garde une simple variable. Exemple : fournir chaque **record** (valeur plus grande que toutes les précédentes).

```python
def records(iterable):
    meilleur = None
    for x in iterable:
        if meilleur is None or x > meilleur:
            meilleur = x
            yield x


def premieres_fois(iterable):
    vus = set()
    for i, x in enumerate(iterable):
        if x not in vus:
            vus.add(x)
            yield i, x


print(list(records([3, 1, 4, 1, 5, 9, 2, 6])))
print(list(premieres_fois("hello")))
```

**Exemple résolu :**

1. `records` : 3 (premier, record), 1 non, 4 > 3 oui, 1 non, 5 > 4 oui, 9 > 5 oui, 2 non, 6 non : `[3, 4, 5, 9]`.
2. `premieres_fois("hello")` : `h` (indice 0) nouveau, `e` (1) nouveau, `l` (2) nouveau, `l` (3) déjà dans `vus`, `o` (4) nouveau : `[(0, 'h'), (1, 'e'), (2, 'l'), (4, 'o')]`.

Aucune liste complète n'est construite : ces générateurs marchent aussi sur un flux infini.

> [!warning] Une boucle infinie qui ne fournit rien
> `while True: for x in elements: yield x` bloque le programme pour toujours si `elements` est vide : aucun `yield` n'est jamais atteint. Ajoute `if not elements: return` avant la boucle.

**À retenir :** les variables d'un générateur survivent entre deux `yield` : un ensemble pour « déjà vu », une variable pour « le précédent », une `deque` pour « les n derniers ».

### Avancer à la main : `iter` et `next`

`iter(x)` donne un **itérateur** sur `x` : un objet qui fournit les éléments un par un avec `next`. `next(it, defaut)` renvoie `defaut` au lieu de lever `StopIteration` quand c'est fini. On avance ainsi à son rythme, même dans un itérable infini, et on peut tenir **plusieurs** itérateurs à la fois (chacun garde sa position).

```python
from itertools import count

lettres = iter("ab")
print(next(lettres), next(lettres), next(lettres, "fini"))

FIN = object()


def par_deux(iterable):
    it = iter(iterable)
    while True:
        premier = next(it, FIN)
        if premier is FIN:
            return
        yield premier, next(it, None)


print(list(par_deux([1, 2, 3, 4, 5])))
nombres = par_deux(count(1))
print(next(nombres), next(nombres))
```

**Exemple résolu :**

1. `next(lettres)` donne `a`, puis `b`. Le troisième `next` n'a plus rien : au lieu de lever `StopIteration`, il renvoie `"fini"`.
2. `FIN = object()` crée un objet unique, qui ne peut pas être confondu avec une vraie valeur (même `None` ou `0` pourraient être dans les données). `premier is FIN` veut dire « l'itérateur est épuisé ».
3. `par_deux([1, 2, 3, 4, 5])` : on lit 1 et 2 → `(1, 2)` ; 3 et 4 → `(3, 4)` ; 5, puis plus rien : le second `next` renvoie `None` → `(5, None)` ; enfin `premier` vaut `FIN` : `return` termine le générateur.
4. Sur `count(1)`, infini, `par_deux` marche aussi : `(1, 2)` puis `(3, 4)`. Un `for` sur l'itérable aurait aussi marché ici, mais `next` permet de lire **deux** éléments dans le même tour de boucle.

> [!warning] Un générateur reçu se parcourt une seule fois
> Si un générateur reçoit un itérable qu'il doit relire plusieurs fois (pour recommencer depuis le début), fais d'abord `elements = list(iterable)` : un générateur reçu serait sinon vide au deuxième passage. Pour un itérable **infini**, n'en fais jamais une liste : avance avec `iter` et `next`.

**À retenir :** `it = iter(x)` puis `next(it, defaut)` pour avancer à la main ; `list(x)` seulement si `x` est fini et doit être relu.

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
from itertools import accumulate, combinations, groupby, islice, product, cycle

print(list(islice(cycle("ab"), 5)))
print(["".join(p) for p in product("01", repeat=3)])
print(list(combinations([1, 2, 3], 2)))
print(list(accumulate([5, 2, 4])))
mots = sorted(["bus", "avion", "bateau"], key=lambda m: m[0])
print({lettre: list(groupe) for lettre, groupe in groupby(mots, key=lambda m: m[0])})
```

**Exemple résolu :**

1. `islice(cycle("ab"), 5)` : `cycle` tourne sans fin (a, b, a, b, ...), `islice` en garde 5 : `['a', 'b', 'a', 'b', 'a']`.
2. `product("01", repeat=3)` fournit des **tuples** comme `('0', '1', '1')` : `"".join(p)` les recolle en texte. Il y en a 2 × 2 × 2 = 8, de `000` à `111`, dans l'ordre des symboles donnés.
3. `combinations([1, 2, 3], 2)` : chaque paire une seule fois, dans l'ordre de la liste : `(1, 2)`, `(1, 3)`, `(2, 3)` (pas de `(2, 1)` ni de `(1, 1)`).
4. `accumulate([5, 2, 4])` : 5, puis 5 + 2 = 7, puis 7 + 4 = 11.
5. `groupby` : on trie d'abord sur la première lettre (`avion`, `bus`, `bateau`), puis on regroupe : `{'a': ['avion'], 'b': ['bus', 'bateau']}`.

Pourquoi trier avant `groupby` ? Sur `bus, avion, bateau` **sans** tri, il ferait trois paquets : `b` (`bus`), `a` (`avion`), puis encore `b` (`bateau`), et dans un dictionnaire le second paquet `b` **écraserait** le premier. Le tri de Python est **stable** : deux éléments de même clé gardent leur ordre d'origine (`bus` reste avant `bateau`), donc trier sur la seule première lettre ne mélange pas les mots à l'intérieur d'un groupe.

Chaque outil renvoie un **itérateur** : pour obtenir une liste, entoure-le de `list(...)`.

**À retenir :** `islice` pour couper un flux infini, `product` / `combinations` pour énumérer, `accumulate` pour cumuler, et toujours `sorted(..., key=)` avant `groupby(..., key=)` avec la même clé.

## 7. Les exceptions

Quand quelque chose est incorrect (conversion impossible, mauvais type, fichier absent...), Python **lève une exception** : le programme s'arrête, sauf si on l'**intercepte**.

| Exception | Situation |
|---|---|
| `OSError` (anciennement `IOError`) | erreur d'entrée/sortie, ex. `FileNotFoundError` |
| `ArithmeticError` | erreur de calcul, ex. `ZeroDivisionError` |
| `LookupError` | indice ou clé introuvable : `IndexError`, `KeyError` |
| `ValueError` | bon type, mauvaise valeur : `int("abc")` |
| `TypeError` | mauvais type : `"a" + 1` |
| `RuntimeError` | erreur générale « ça ne devrait pas arriver », souvent levée par le programmeur lui-même |

Les exceptions forment une **famille** : `KeyError` et `IndexError` sont des sortes de `LookupError`, `ZeroDivisionError` est une sorte d'`ArithmeticError`. Toutes descendent d'`Exception`.

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

**Exemple résolu : quels blocs s'exécutent ?**

| Appel | Dans le `try` | Bloc choisi | `else` ? | `finally` ? | Affiché |
|---|---|---|---|---|---|
| `division(10, 4)` | 10 / 4 = 2.5, pas d'erreur | aucun `except` | oui | oui | `Résultat : 2.5` puis `Fin du calcul` |
| `division(1, 0)` | `ZeroDivisionError` | le premier `except` | non | oui | `Erreur : division by zero` puis `Fin du calcul` |
| `division("a", 2)` | `"a" / 2` : `TypeError` | `except (TypeError, ValueError)` | non | oui | `Il faut des nombres` puis `Fin du calcul` |

Python essaie les `except` **dans l'ordre** et prend le premier qui correspond. Dès qu'une erreur arrive dans le `try`, la suite du `try` est sautée.

```python
def lire(conteneur, cle):
    try:
        return conteneur[cle]
    except LookupError:
        return "introuvable"
    finally:
        print("lecture de", cle)


print(lire({"a": 1}, "b"))
print(lire([10, 20], 5))
print(lire([10, 20], 1))
```

**Exemple résolu :**

1. `{"a": 1}["b"]` lève `KeyError`, `[10, 20][5]` lève `IndexError` : les deux sont des `LookupError`, **un seul** `except` suffit pour les deux.
2. `[10, 20][1]` vaut 20 : le `return` se fait... mais le `finally` s'exécute **avant** que la fonction rende la main : `lecture de 1` s'affiche avant `20`.

Cette façon de faire (« essaie, et rattrape l'erreur si elle arrive ») évite une série de `if` qui testerait chaque cas à l'avance : c'est le style habituel en Python. Par exemple, `try: return int(texte)` puis `except ValueError: return defaut` lit un entier ou renvoie une valeur de secours.

**À retenir :** `try` = le code risqué, `except Type` = quoi faire si ce type d'erreur arrive (parents compris), `else` = si tout s'est bien passé, `finally` = dans tous les cas.

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

**Exemple résolu :**

1. `need_positive_number(-3)` : `-3 < 0`, donc `raise ValueError("need to be positive")` crée l'exception (comme on appelle une fonction) et la **lance**. La fonction s'arrête net, le `return n` n'est jamais atteint.
2. Le `except ValueError as e` la rattrape : `e` est l'exception, et `print` affiche son message.
3. `class SoldeInsuffisant(Exception): pass` crée **sa propre** sorte d'exception (le chapitre sur les classes détaille la syntaxe). On la lève et on l'intercepte comme les autres ; `type(e).__name__` donne son nom.

| Écriture | Que fait-elle ? |
|---|---|
| `raise ValueError("msg")` | lève l'erreur, la fonction s'arrête |
| `return ValueError("msg")` | **renvoie** un objet erreur comme une valeur normale : rien ne s'arrête, rien n'est signalé |
| `throw ValueError("msg")` | n'existe pas en Python (c'est du Java ou du JavaScript) : `SyntaxError` |
| `raise new ValueError("msg")` | pas de `new` en Python : `SyntaxError` |

> [!warning] Intercepter précisément
> Un `except:` sans type attrape **toutes** les erreurs, y compris tes propres fautes de frappe, qui deviennent invisibles. Intercepte seulement les exceptions que tu sais gérer, et garde le `try` le plus court possible.

**À retenir :** `raise TypeDErreur("message")` pour refuser une valeur ; le message est ce qui s'affichera.

### Valider une entrée, dans l'ordre

Un programme qui lit des lignes tapées par l'utilisateur doit refuser les entrées incorrectes avec un message clair. On fait les vérifications **dans un ordre précis**, et on s'arrête à la première qui échoue.

```python
def commande(ligne):
    morceaux = ligne.split()
    if len(morceaux) != 2:
        return "Erreur : il faut « action nombre »"
    action, texte = morceaux
    if action not in ("moitie", "inverse"):
        return "Erreur : action inconnue"
    try:
        n = int(texte)
    except ValueError:
        return "Erreur : nombre invalide"
    try:
        if action == "moitie":
            return ligne + " = " + str(n / 2)
        return ligne + " = " + str(1 / n)
    except ZeroDivisionError:
        return "Erreur : pas d'inverse pour zéro"


for ligne in ["moitie 7", "inverse 4", "inverse 0", "double 3", "moitie sept", "moitie"]:
    print(commande(ligne))
```

**Exemple résolu :**

| Ligne | Morceaux | 2 morceaux ? | Action connue ? | Entier ? | Résultat |
|---|---|---|---|---|---|
| `moitie 7` | `['moitie', '7']` | oui | oui | 7 | `moitie 7 = 3.5` |
| `inverse 4` | `['inverse', '4']` | oui | oui | 4 | `inverse 4 = 0.25` |
| `inverse 0` | `['inverse', '0']` | oui | oui | 0 | 1 / 0 : `ZeroDivisionError` → message |
| `double 3` | `['double', '3']` | oui | **non** | pas testé | `Erreur : action inconnue` |
| `moitie sept` | `['moitie', 'sept']` | oui | oui | **non** | `Erreur : nombre invalide` |
| `moitie` | `['moitie']` | **non** | pas testé | pas testé | `Erreur : il faut « action nombre »` |

Points importants :

- `ligne.split()` découpe sur les espaces ; on teste le **nombre** de morceaux **avant** de les déballer (`action, texte = morceaux` planterait sinon) ;
- l'ordre des tests décide du message quand plusieurs choses sont fausses : avec `double x`, c'est « action inconnue » qui sort, car ce test passe avant celui du nombre ;
- la fonction **renvoie** le texte au lieu de l'afficher : le programme principal fait `print(commande(ligne))`, et les tests peuvent comparer le texte renvoyé ;
- `str(n / 2)` : `/` donne toujours un `float` (`7 / 2` vaut 3.5, `8 / 2` vaut `4.0`), alors que `+`, `-` et `*` entre entiers donnent un `int`.

Dans un vrai programme, les lignes viennent de `input()`, dans une boucle `while True` qui s'arrête (`break`) sur un mot convenu, comme `fin`.

**À retenir :** une vérification par étape, dans l'ordre demandé, chacune avec son `return` de message ; les conversions et calculs risqués dans un `try` court.

### Vérifier les arguments et transformer une erreur

Une fonction qui reçoit des données de l'extérieur vérifie souvent leur **type** et leur **valeur** avant de calculer. Deux détails à connaître :

```python
print(isinstance(True, int))
print(type(True) is int)
print(repr("abc"), repr(None), repr([1, 2]))


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

**Exemple résolu :**

1. `isinstance(True, int)` vaut `True` : pour Python, `True` est l'entier 1 « habillé » en booléen (`True + True` vaut 2). `type(True) is int` vaut `False`, car le type exact est `bool`. Un test `isinstance(n, int)` laisse donc passer `True` et `False`, ce qui est rarement voulu.
2. `repr(x)` donne l'écriture de `x` telle qu'on la taperait dans le code : `'abc'` (avec les guillemets), `None`, `[1, 2]`. `%r` dans un texte fait la même chose : utile dans un message d'erreur, pour voir exactement la valeur fautive.
3. `vers_reel("abc")` : `float("abc")` lève `ValueError`. On la rattrape, puis on lève une `TypeError("pas un nombre : 'abc'")` **depuis** elle. Celui qui intercepte la `TypeError` retrouve l'erreur d'origine dans `e.__cause__` : ici une `ValueError`.

| Test | `True` | `3` | `3.0` | `"3"` |
|---|---|---|---|---|
| `isinstance(x, int)` | vrai (piège) | vrai | faux | faux |
| `isinstance(x, bool) or not isinstance(x, int)` (= « à refuser ») | **refusé** | accepté | refusé | refusé |

**À retenir :** pour « un vrai entier », refuse d'abord les `bool` ; pour remplacer une erreur par une plus claire, `raise Nouvelle(...) from ancienne`.

> [!warning] `range` à l'envers
> Pour inclure la borne de fin, on écrit `range(debut, fin + 1)`... seulement si le pas est **positif**. Avec un pas négatif, on descend : la borne exclue est `fin - 1`, donc `range(debut, fin - 1, pas)`. Et `range(..., 0)` lève une `ValueError`.

```python
print(list(range(2, 8 + 1, 2)))
print(list(range(9, 3 - 1, -2)))
print(list(range(9, 3 + 1, -2)))
print(list(range(3, 9 - 1, -2)))
try:
    range(1, 5, 0)
except ValueError as e:
    print("Erreur :", e)
```

**Exemple résolu :** on veut toutes les valeurs de `debut` à `fin` **incluses**.

| Demande | Écriture | Valeurs | Bon ? |
|---|---|---|---|
| de 2 à 8, pas 2 | `range(2, 8 + 1, 2)` | 2, 4, 6, 8 | oui |
| de 9 à 3, pas -2 | `range(9, 3 - 1, -2)` | 9, 7, 5, 3 | oui |
| de 9 à 3, pas -2 | `range(9, 3 + 1, -2)` | 9, 7, 5 | non : avec `+ 1`, la borne exclue 4 arrête avant 3 |
| de 3 à 9, pas -2 | `range(3, 9 - 1, -2)` | aucune | on ne peut pas monter avec un pas négatif : `range` est vide (une somme vaudrait 0) |
| pas 0 | `range(1, 5, 0)` | | `ValueError` : on n'avancerait jamais |

**À retenir :** borne de fin incluse = `fin + 1` si on monte, `fin - 1` si on descend ; un `range` dans le mauvais sens est simplement vide.
