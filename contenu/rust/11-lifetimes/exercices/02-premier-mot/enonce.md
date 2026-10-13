Écris deux fonctions qui renvoient une **vue** (`&str`) sur un morceau de la phrase, sans rien copier :

- `premier_mot(phrase)` : le premier mot ;
- `dernier_mot(phrase)` : le dernier mot.

Les espaces en trop sont ignorés. S'il n'y a aucun mot, renvoie `""`.

| Appel | Résultat |
|---|---|
| `premier_mot("Bonjour tout le monde")` | `"Bonjour"` |
| `dernier_mot("Bonjour tout le monde")` | `"monde"` |
| `premier_mot("   seul  ")` | `"seul"` |
| `premier_mot("")` | `""` |

> [!info] Pas de `'a` ici
> Il n'y a qu'**un seul** paramètre référence : grâce aux règles d'élision, le compilateur comprend tout seul que le résultat est emprunté à `phrase`.
