Un **port** réseau est un nombre entre 0 et 65 535 : il tient dans un `u16`. Deux fonctions le lisent depuis un texte, toutes les deux avec un `unwrap()` maladroit.

1. `lire_port(texte)` : si le texte n'est pas un port valide, renvoie le port par défaut **8080** au lieu de planter ;
2. `lire_port_obligatoire(texte)` : ici le port est indispensable, planter est acceptable, mais avec un message clair :

```text
le port doit être un nombre entre 0 et 65535
```

| Appel | Résultat |
|---|---|
| `lire_port("3000")` | `3000` |
| `lire_port("abc")` | `8080` |
| `lire_port("70000")` | `8080` (trop grand pour un `u16`) |
| `lire_port_obligatoire("abc")` | panique avec le message ci-dessus |

> [!info] `#[should_panic]`
> Un des tests porte `#[should_panic(expected = "...")]` : il réussit seulement si le code panique **avec ce message**.
