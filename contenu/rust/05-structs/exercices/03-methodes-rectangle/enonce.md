Complète le bloc `impl Rectangle` :

1. `aire(&self)` : largeur × hauteur ;
2. `perimetre(&self)` : 2 × (largeur + hauteur) ;
3. `peut_contenir(&self, autre)` : `true` si `autre` rentre entièrement dans `self`, sans le tourner (largeur **et** hauteur inférieures ou égales) ;
4. `carre(cote)` : une **fonction associée** (sans `self`) qui fabrique un rectangle carré. On l'appelle avec `Rectangle::carre(5)`.

| Appel | Résultat |
|---|---|
| `Rectangle { largeur: 3, hauteur: 4 }.aire()` | `12` |
| `Rectangle { largeur: 3, hauteur: 4 }.perimetre()` | `14` |
| `Rectangle::carre(5).aire()` | `25` |
