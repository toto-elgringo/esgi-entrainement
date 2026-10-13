L'enum `Forme` a trois variantes qui transportent des **données** différentes :

- `Cercle { rayon }` (champ nommé) ;
- `Rectangle { largeur, hauteur }` (champs nommés) ;
- `Triangle(base, hauteur)` (champs numérotés).

Complète les deux méthodes :

1. `aire(&self)` :
   - cercle : π × rayon × rayon ;
   - rectangle : largeur × hauteur ;
   - triangle : base × hauteur / 2 ;
2. `nom(&self)` : `"cercle"`, `"rectangle"` ou `"triangle"`.

> [!tip] Déstructurer
> Le `match` sort les données de la variante dans des variables, que tu peux utiliser directement dans le bras.
