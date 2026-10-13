Écris trois fonctions qui fabriquent une `String`, chacune avec un outil différent :

1. `encadrer(mot)` : met le mot entre crochets, avec `push` et `push_str`.
   `encadrer("rust")` → `"[rust]"`
2. `repeter(mot, n)` : répète le mot `n` fois, séparé par des tirets, avec une boucle.
   `repeter("ab", 3)` → `"ab-ab-ab"` et `repeter("ab", 0)` → `""`
3. `presenter(nom, age)` : avec `format!`.
   `presenter("Alice", 20)` → `"Alice a 20 ans"`

> [!tip] Rappel
> `format!` s'utilise comme `println!`, mais au lieu d'afficher le texte, il le **renvoie** sous forme de `String`.
