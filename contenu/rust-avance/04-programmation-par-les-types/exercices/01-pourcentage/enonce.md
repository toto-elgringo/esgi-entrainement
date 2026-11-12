Un pourcentage doit être compris entre 0 et 100. Au lieu de vérifier partout, on crée un type `Pourcentage` qui ne peut **pas** contenir une valeur invalide.

1. `Pourcentage::new(valeur)` renvoie `Ok(Pourcentage)` si `valeur <= 100`, sinon `Err` avec le message `"<valeur> dépasse 100"`.
2. `valeur()` rend le nombre stocké.
3. `appliquer_remise(prix, remise)` renvoie le prix après remise (division entière).

| Appel | Résultat |
|---|---|
| `Pourcentage::new(100)` | `Ok(Pourcentage(100))` |
| `Pourcentage::new(101)` | `Err("101 dépasse 100")` |
| `appliquer_remise(200, Pourcentage::new(25).unwrap())` | `150` |

> [!info] Champ privé
> Le champ n'a pas `pub` : à l'extérieur du module, on ne peut créer un `Pourcentage` qu'avec `new`.
