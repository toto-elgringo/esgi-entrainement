Le programme lit une liste de saisies, mais il **plante** dès la deuxième (« abc ») à cause de `unwrap()`.

Remplace le `unwrap()` par un `match` sur le `Result` pour afficher **exactement** :

```text
"12" -> nombre 12
"abc" -> erreur : invalid digit found in string
"-5" -> nombre -5
"" -> erreur : cannot parse integer from empty string
```

> [!tip] Afficher une erreur
> Une `ParseIntError` affichée avec `{}` donne un message lisible, comme « invalid digit found in string ».
