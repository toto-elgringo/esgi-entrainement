Une fonction ne renvoie qu'**une** valeur... mais cette valeur peut être un **tuple** : `return a, b` renvoie `(a, b)`, et l'appelant le déballe avec `x, y = f()`.

Écris trois fonctions :

- `extremes(valeurs)` : renvoie le couple `(plus_petit, plus_grand)`. Si la liste est **vide**, lève `ValueError("liste vide")` (il n'y a pas de bonne réponse à donner) ;
- `positions(valeurs, cible)` : renvoie le **tuple** de tous les indices où `cible` apparaît, `()` si elle n'apparaît pas ;
- `stats_mots(phrase)` : renvoie `(nombre_de_mots, mot_le_plus_long, longueur_moyenne)`. Les mots sont séparés par des espaces. En cas d'égalité, le mot le plus long est le **premier** rencontré. Phrase sans mot : `(0, "", 0.0)`.

```python
petit, grand = extremes([4, -2, 9, 3])
print(petit, grand)                        # -2 9
print(positions(["a", "b", "a"], "a"))     # (0, 2)
print(stats_mots("le chat dort"))          # (3, 'chat', 3.3333333333333335)
```
