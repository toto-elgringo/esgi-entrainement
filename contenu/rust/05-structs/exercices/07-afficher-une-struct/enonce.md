Complète le programme pour qu'il affiche **exactement** :

```text
Eleve { nom: "Alice", note: 15 }
Eleve {
    nom: "Bob",
    note: 9,
}
Alice a eu 15/20
Bob a eu 9/20
```

Étapes :

1. donne à `Eleve` la capacité de s'afficher avec `{:?}` ;
2. écris `Eleve::new(nom, note)` et la méthode `presenter(&self)` qui renvoie le texte `"Alice a eu 15/20"` ;
3. dans `main`, crée Alice (15) et Bob (9), affiche Alice avec `{:?}`, Bob avec `{:#?}`, puis la présentation de chacun.

> [!tip] `format!`
> `format!` marche comme `println!`, mais **renvoie** un `String` au lieu de l'afficher.

> [!info] `{:#?}`
> C'est l'affichage « joli » : un champ par ligne, pratique pour les grosses structs.
