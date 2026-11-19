Quand on demande à une liste ou à un dictionnaire une valeur qu'il n'a pas, Python lève une erreur. Ici, on l'**attrape** avec `try` / `except` au lieu de tester avant.

```python
try:
    l.remove(x)
except ValueError:
    print(x, "n'était pas dans la liste")
```

Écris ces fonctions :

- `retirer_premier(l, x)` : retire la **première** occurrence de `x` de la liste reçue et renvoie `True`, ou renvoie `False` (sans erreur) si `x` n'y est pas ;
- `rang(classement, nom)` : le rang de `nom` dans la liste `classement`, **en comptant à partir de 1**, ou `None` s'il n'y est pas. `rang(["Ana", "Tom"], "Tom")` → `2` ;
- `deuxieme_position(l, x)` : l'indice de la **deuxième** occurrence de `x`, ou `-1` s'il y en a moins de deux. `deuxieme_position([4, 7, 4, 4], 4)` → `2` ;
- `prix_total(panier, tarifs)` : `panier` est une liste d'articles, `tarifs` un dictionnaire article → prix. Renvoie le couple `(total, inconnus)` : la somme des prix connus et la liste des articles qui n'ont pas de tarif, dans l'ordre ;
- `remettre_a_zero(liste, ensemble, dico)` : vide les trois conteneurs **reçus** et renvoie le nombre total d'éléments retirés.

```python
print(prix_total(["pain", "lait", "café", "pain"], {"pain": 1.2, "lait": 0.9}))
# (3.3, ['café'])
```

> [!warning] Une erreur précise
> Écris `except ValueError:` ou `except KeyError:`, jamais un `except:` tout seul, qui cacherait aussi les vraies fautes de frappe.
