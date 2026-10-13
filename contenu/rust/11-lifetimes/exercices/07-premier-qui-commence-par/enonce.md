`premier_qui_commence_par(mots, prefixe)` renvoie le premier mot de la liste qui commence par `prefixe`, ou `None` s'il n'y en a aucun.

```rust
let mots = ["pomme", "poire", "banane"];
premier_qui_commence_par(&mots, "po")   // Some("pomme")
premier_qui_commence_par(&mots, "ki")   // None
```

Le code ne compile pas : **E0106**. Il y a plusieurs références en paramètre, le compilateur ne sait pas d'où vient le résultat.

1. Ajoute les durées de vie.
2. Écris le corps de la fonction.

> [!warning] Le piège
> Un test détruit le `prefixe` **avant** d'utiliser le résultat. Si tu mets `'a` sur `prefixe` aussi, ce test ne compilera pas (E0597). Ne relie le résultat **qu'au** paramètre dont il vient vraiment.

> [!tip] `&[&str]`
> C'est une **tranche** (une vue sur une liste) de textes empruntés. `starts_with` teste le début d'un texte.
