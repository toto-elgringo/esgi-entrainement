Deux conversions à écrire :

1. **Qui réussit toujours** : implémente `From<Celsius> for Fahrenheit` (formule : `F = C * 9 / 5 + 32`). Puis écris `en_fahrenheit`, qui utilise `.into()` pour convertir et renvoie le nombre.
2. **Qui peut échouer** : implémente `TryFrom<i32> for Note`. Une note valide est entre 0 et 20 (inclus). Sinon, l'erreur est le texte `note invalide : <valeur>`.

| Appel | Résultat |
|---|---|
| `en_fahrenheit(Celsius(100.0))` | `212.0` |
| `en_fahrenheit(Celsius(-40.0))` | `-40.0` |
| `Note::try_from(15)` | `Ok(Note(15))` |
| `Note::try_from(25)` | `Err("note invalide : 25")` |

> [!tip] Rappel
> Écrire `From` donne `Into` gratuitement. De même, `TryFrom` donne `try_into()`.
