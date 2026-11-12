Un `Noeud` possède ses enfants (`Rc`) et connaît son parent par une référence faible (`Weak`) : pas de cycle, pas de fuite.

1. `ajouter_enfant(parent, enfant)` : met l'enfant dans la liste du parent **et** enregistre le parent dans l'enfant.
2. `chemin(noeud)` : renvoie les noms de la racine jusqu'au noeud, séparés par `/`.
3. `a_un_parent(noeud)` : `true` si le parent existe encore.
4. `compter_descendants(noeud)` : nombre total de noeuds sous celui-ci (enfants, petits-enfants...).

| Arbre | Appel | Résultat |
|---|---|---|
| `racine` > `src` > `main` | `chemin(main)` | `"racine/src/main"` |
| `racine` seule | `chemin(racine)` | `"racine"` |
| `racine` > `src` > `main` | `compter_descendants(racine)` | `2` |

> [!warning] Parent disparu
> Quand le parent est libéré, `upgrade()` renvoie `None`. `a_un_parent` doit alors renvoyer `false`.
