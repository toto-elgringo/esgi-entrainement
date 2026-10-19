On programme la logique d'un jeu du pendu. Le mot à deviner est en minuscules ; les lettres proposées sont rangées dans deux **ensembles**, `trouvees` et `ratees`.

Écris :

- `afficher(mot, trouvees)` : le mot avec les lettres non trouvées remplacées par `_`, séparées par des espaces. `afficher("python", {"p", "o"})` → `"p _ _ _ o _"` ;
- `proposer(mot, trouvees, ratees, lettre)` : traite une proposition et renvoie :
  - `"invalide"` si ce n'est pas exactement une lettre ;
  - `"deja"` si la lettre a déjà été proposée ;
  - `"bonne"` si elle est dans le mot (elle est ajoutée à `trouvees`) ;
  - `"mauvaise"` sinon (elle est ajoutée à `ratees`).
  La proposition est mise en minuscules : `"P"` compte comme `"p"` ;
- `gagne(mot, trouvees)` : `True` si toutes les lettres du mot ont été trouvées.

Le bloc `if __name__ == "__main__":` du départ simule une partie : lance-le pour voir tes fonctions en action.
