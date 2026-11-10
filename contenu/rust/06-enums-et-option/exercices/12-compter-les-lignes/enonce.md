Lire un fichier **pendant l'exécution** peut échouer (fichier absent, droits insuffisants…). Écris les deux fonctions **sans `unwrap` ni `expect`** :

| Fonction | Résultat |
|---|---|
| `compter_lignes(chemin: &str) -> std::io::Result<usize>` | `Ok(nombre de lignes)`, ou l'erreur de lecture (utilise `?`) |
| `resume(chemin: &str) -> String` | `"3 lignes"` si tout va bien, `"impossible de lire <chemin> : <erreur>"` sinon |

```rust
compter_lignes("notes.txt");    // Ok(3) si le fichier a 3 lignes
compter_lignes("absent.txt");   // Err(...) : le fichier n'existe pas
resume("absent.txt");           // "impossible de lire absent.txt : ..." (le message dépend du système)
```

> [!tip] L'opérateur `?`
> `let contenu = std::fs::read_to_string(chemin)?;` : si la lecture réussit, `contenu` reçoit le texte ; sinon la fonction s'arrête et **renvoie l'erreur** à l'appelant. Ça ne marche que parce que `compter_lignes` renvoie elle-même un `Result`.

> [!info] Compter les lignes
> `texte.lines().count()` compte les lignes ; un fichier vide en a 0.
