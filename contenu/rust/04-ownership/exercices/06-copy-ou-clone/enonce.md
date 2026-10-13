Le programme doit afficher **exactement** :

```text
5 5
salut salut
Point { x: 1, y: 2 } Point { x: 1, y: 2 }
```

Il ne compile pas : `s1` et `p1` sont **déplacés** (*move*) puis réutilisés. Corrige-le **sans toucher aux `println!`** :

- pour la `String`, fais une vraie copie avec `.clone()` ;
- pour `Point`, rends le type `Copy` en complétant la ligne `#[derive(...)]`.

> [!info] Pourquoi `a` marche déjà ?
> Les entiers sont `Copy` : `let b = a;` copie la valeur et `a` reste utilisable. Un type peut être `Copy` seulement s'il n'a **rien à libérer** : `Point` (deux `i32`) peut l'être, une `String` jamais.
