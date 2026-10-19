Écris quatre **fabriques de fonctions** (des fonctions qui renvoient une fonction) :

- `create_adder(n)` : renvoie une fonction qui ajoute `n`. `plus10 = create_adder(10)` puis `plus10(24)` → `34` ;
- `create_multiplier(n)` : renvoie une fonction qui multiplie par `n` ;
- `composer(f, g)` : renvoie la fonction qui calcule `f(g(x))` ;
- `compteur()` : renvoie une fonction qui renvoie `1` au premier appel, `2` au deuxième, etc. Deux compteurs créés séparément sont **indépendants**.

```python
c = compteur()
print(c(), c(), c())   # 1 2 3
```
