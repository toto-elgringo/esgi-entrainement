Complète le programme pour qu'il affiche exactement :

```text
1065353216
vrai : 1
5 : 5
```

À faire :

1. `bits_du_flottant(f: f32) -> u32` lit les bits d'un nombre à virgule à travers une `union` (pouvoir n°5). `1.0` a pour bits `1065353216`.
2. Le trait `unsafe trait Brut` est déjà écrit. Implémente-le avec `unsafe impl` pour `bool` et pour `u32` (pouvoir n°4) : `octet_logique` renvoie `1` ou `0` pour un `bool`, et le nombre lui-même pour un `u32`.
