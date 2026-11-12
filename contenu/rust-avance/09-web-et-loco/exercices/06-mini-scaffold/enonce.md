`cargo loco generate scaffold capteur nom:string! unite:string!` écrit tout seul le code d'une ressource. Fais une version minuscule : `scaffold(nom, champs)` renvoie un texte avec la structure et les routes CRUD.

Pour `scaffold("capteur", &[("nom", "string"), ("valeur", "double")])` :

```text
struct Capteur {
    id: i64,
    nom: String,
    valeur: f64,
}
GET /capteurs
POST /capteurs
GET /capteurs/:id
PUT /capteurs/:id
DELETE /capteurs/:id
```

- Le nom de la structure prend une majuscule ; le pluriel des routes ajoute un `s`.
- Types : `string` donne `String`, `double` donne `f64`, `int` donne `i64`, tout autre type donne `String`.
- Le champ `id: i64` est toujours écrit en premier.
- Pas de retour à la ligne à la fin du texte renvoyé (le programme principal fait le `println!`).

Le programme affiche le scaffold de `capteur`, une ligne vide, puis celui de `mesure`.
