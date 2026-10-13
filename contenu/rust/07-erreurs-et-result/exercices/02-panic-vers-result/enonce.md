`diviser` fait **planter tout le programme** quand `b` vaut 0 (clique sur « Exécuter » pour le voir).

Une division par zéro est une erreur **prévisible** : l'appelant doit pouvoir la gérer. Transforme la fonction pour qu'elle renvoie un `Result<i32, String>` :

- `Ok(a / b)` si tout va bien ;
- `Err("division par zéro".to_string())` si `b` vaut 0.

Adapte aussi `main` pour afficher les deux résultats avec `{:?}` :

```text
Ok(5)
Err("division par zéro")
```
