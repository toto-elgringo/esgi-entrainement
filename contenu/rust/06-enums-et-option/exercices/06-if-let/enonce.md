La fonction `chercher_age(nom)` est déjà écrite : elle renvoie `Some(age)` si la personne est connue, sinon `None`.

Réécris `main` pour afficher **exactement** :

```text
Alice a 30 ans
Zoé : âge inconnu
Bob a 25 ans
L'an prochain, Alice aura 31 ans
```

1. Pour chaque nom de la liste `["Alice", "Zoé", "Bob"]`, utilise `if let ... else` ;
2. pour la dernière ligne, transforme l'âge d'Alice avec `.map(|age| age + 1)`, puis affiche-le avec `if let`.

> [!tip] `if let`
> `if let Some(age) = valeur { ... }` exécute le bloc seulement s'il y a une valeur, et la met dans `age`.
