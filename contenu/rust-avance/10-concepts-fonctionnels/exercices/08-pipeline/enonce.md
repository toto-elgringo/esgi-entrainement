Voici ce que ferait un programmeur impératif pour une phrase : parcourir les mots avec une boucle, tester la longueur, remplir un `Vec` modifiable, et additionner à part avec une variable `mut`.

```rust
let mut longs = Vec::new();
let mut total = 0;
for mot in phrase.split_whitespace() {
    if mot.len() >= 5 {
        longs.push(mot.to_uppercase());
        total += mot.len();
    }
}
```

Réécris les deux fonctions en **pipeline** : une seule expression chaînée, sans `mut` ni boucle.

| Fonction | Rôle |
|---|---|
| `mots_longs(phrase)` | les mots d'au moins 5 lettres, en majuscules, dans l'ordre |
| `total_lettres(phrase)` | le nombre total de lettres de ces mots |

Avec le `main` fourni, le programme doit afficher :

```text
["PROGRAMMATION", "FONCTIONNELLE", "AGREABLE", "UTILE"]
total : 39
```

> [!tip] Le quoi, pas le comment
> Lis ton pipeline à voix haute : « découpe en mots, garde les longs, mets en majuscules, rassemble ». C'est ce qu'on veut obtenir, sans détailler les étapes.
