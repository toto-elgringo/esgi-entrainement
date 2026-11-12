Le trait `Transformation` transforme un texte. Plusieurs types l'implémentent, et on veut les ranger ensemble dans un `Vec<Box<dyn Transformation>>` (objets-traits).

À écrire :

1. `Repeter(n)` : répète le texte `n` fois (`"ab"` avec 2 donne `"abab"`).
2. `Entourer(c)` : met le caractère `c` avant et après le texte (`"hop"` avec `'*'` donne `"*hop*"`).
3. `enchainer(etapes, texte)` : applique les étapes **dans l'ordre**, chacune sur le résultat de la précédente.
4. `construire(nom)` : crée une étape à partir de son nom.

| `nom` | Étape créée |
|---|---|
| `"majuscules"` | `Majuscules` |
| `"doubler"` | `Repeter(2)` |
| `"etoiles"` | `Entourer('*')` |
| autre | `None` |

Exemple : les étapes `majuscules` puis `etoiles` appliquées à `"hop"` donnent `"*HOP*"`.

> [!tip] Rappel
> Un `Box<dyn Trait>` peut contenir n'importe quel type qui implémente le trait. Le type exact est choisi à l'exécution.
