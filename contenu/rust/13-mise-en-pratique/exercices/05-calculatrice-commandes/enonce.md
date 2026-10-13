Une calculatrice lit un petit programme, une commande par ligne, et part de la valeur `0` :

```text
ajoute 5
multiplie 3
retire 1
```

Résultat : (0 + 5) × 3 − 1 = `14`.

| Commande | Effet |
|---|---|
| `ajoute N` | valeur + N |
| `retire N` | valeur − N |
| `multiplie N` | valeur × N |
| `reset` | remet la valeur à 0 |

`N` est un entier, éventuellement négatif. Les espaces en trop et les lignes vides sont ignorés.

1. `analyser(ligne)` transforme une ligne en `Commande`, ou renvoie une erreur :
   - nom inconnu : `ErreurCommande::Inconnue(nom)` ;
   - nombre absent : `ErreurCommande::ArgumentManquant(nom)` ;
   - nombre illisible : `ErreurCommande::NombreInvalide(texte)`.
2. `executer(programme)` exécute toutes les lignes et renvoie la valeur finale. À la première erreur, elle renvoie `Err((numero_de_ligne, erreur))`, avec des lignes numérotées **à partir de 1** (les lignes vides comptent dans la numérotation).

| Appel | Résultat |
|---|---|
| `analyser("ajoute 5")` | `Ok(Commande::Ajoute(5))` |
| `analyser("divise 2")` | `Err(ErreurCommande::Inconnue("divise".to_string()))` |
| `executer("ajoute 1\n\nmultiplie x")` | `Err((3, ErreurCommande::NombreInvalide("x".to_string())))` |

> [!tip] L'opérateur `?`
> Il renvoie l'erreur immédiatement. Avec `map_err`, on la transforme d'abord (par exemple pour ajouter le numéro de ligne).
