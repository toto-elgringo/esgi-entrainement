Écris `lire_age(texte)` qui lit un âge saisi par un utilisateur et décrit **précisément** ce qui ne va pas avec l'enum `ErreurAge` :

1. on ignore les espaces autour du texte ;
2. texte vide → `Err(ErreurAge::Vide)` ;
3. pas un nombre entier positif → `Err(ErreurAge::PasUnNombre)` ;
4. plus de 150 → `Err(ErreurAge::TropGrand(age))` ;
5. sinon → `Ok(age)`.

| Appel | Résultat |
|---|---|
| `lire_age(" 42 ")` | `Ok(42)` |
| `lire_age("")` | `Err(Vide)` |
| `lire_age("vingt")` | `Err(PasUnNombre)` |
| `lire_age("-3")` | `Err(PasUnNombre)` |
| `lire_age("200")` | `Err(TropGrand(200))` |

> [!tip] `map_err`
> `parse` renvoie une `ParseIntError`, mais ta fonction renvoie une `ErreurAge`. `map_err(|_| ErreurAge::PasUnNombre)` convertit l'une en l'autre, puis `?` peut la renvoyer.
