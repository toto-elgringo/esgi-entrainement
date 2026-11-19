`yield from autre_iterable` délègue le travail : le générateur fournit toutes les valeurs de `autre_iterable`, puis continue. C'est très pratique pour les générateurs **récursifs**.

Écris quatre générateurs :

- `aplatir(structure)` : parcourt une liste qui contient d'autres listes ou tuples, à n'importe quelle profondeur, et fournit les éléments « simples » dans l'ordre. Un texte est un élément simple ;
- `enchainer(*iterables)` : fournit tous les éléments du premier itérable, puis du deuxième, etc. ;
- `mots(alphabet, longueur)` : fournit tous les mots de `longueur` lettres qu'on peut écrire avec les lettres de `alphabet`, dans l'ordre de l'alphabet donné. `longueur` négative : `ValueError` ;
- `chemins(arbre, prefixe="")` : l'arbre est un dictionnaire qui représente des dossiers (valeur = un autre dictionnaire) et des fichiers (valeur = `None`). Fournit le chemin de chaque fichier, avec des `/`.

```python
print(list(aplatir([1, [2, [3, [4]]], (5, "ab")])))   # [1, 2, 3, 4, 5, 'ab']
print(list(enchainer("ab", [1, 2])))                  # ['a', 'b', 1, 2]
print(list(mots("ab", 2)))                            # ['aa', 'ab', 'ba', 'bb']
arbre = {"src": {"main.py": None, "lib": {"outils.py": None}}, "README.md": None}
print(list(chemins(arbre)))   # ['src/main.py', 'src/lib/outils.py', 'README.md']
```
